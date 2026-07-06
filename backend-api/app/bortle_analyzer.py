import cv2
import numpy as np
from PIL import Image, ExifTags
import io
import math


# ── Bortle Scale SQM Reference Table ────────────────────
# Maps SQM values (mag/arcsec²) to Bortle levels, based on
# the widely-cited standard SQM/Bortle correspondence
# (e.g. Bortle 1 ~21.99-22.00, Bortle 4 ~20.49-21.69,
# Bortle 9 <18.38). Bortle 8 vs 9 isn't finely split in most
# published sources (both fall under "<18.38"), so that
# specific boundary here is our own approximation.
SQM_TO_BORTLE = [
    (21.99, 1),  # Excellent dark sky
    (21.89, 2),  # Truly dark sky
    (21.69, 3),  # Rural sky
    (20.49, 4),  # Rural/suburban transition
    (19.50, 5),  # Suburban sky
    (18.94, 6),  # Bright suburban sky
    (18.38, 7),  # Suburban/urban transition
    (17.80, 8),  # City sky (approximation — see note above)
    (0.0,   9),  # Inner city sky
]


def sqm_to_bortle_level(sqm_estimate: float) -> int:
    """
    Converts an estimated SQM value to a Bortle level.
    """
    for threshold, bortle in SQM_TO_BORTLE:
        if sqm_estimate >= threshold:
            return bortle
    return 9


def estimate_sqm_from_brightness(mean_brightness: float) -> float:
    """
    Estimates Sky Quality Meter (SQM) value from mean sky
    background brightness (0-255 pixel scale).

    Formula approximates the relationship between camera
    pixel values and SQM readings:
    SQM ≈ -2.5 * log10(brightness/255) + 22.0

    A perfectly dark sky (brightness near 0) gives a high SQM.
    A bright, polluted sky (brightness near 255) gives a low SQM.
    """
    brightness = max(mean_brightness, 0.1)
    normalized = brightness / 255.0
    sqm = -2.5 * math.log10(normalized + 0.001) + 16.5
    return max(15.0, min(22.5, sqm))


def get_exposure_correction(image_bytes: bytes) -> dict:
    """
    Reads ISO and exposure time from the image's EXIF data,
    when present, purely for informational/debugging display
    in the API response.

    This is intentionally NOT used to adjust the brightness/SQM
    math. A phone's auto-exposure system boosts ISO/shutter
    speed for any dark scene, specifically so the resulting
    photo looks reasonably bright regardless of how dark or
    light-polluted the actual sky is — that's the camera's job.
    That means EXIF settings are roughly inversely correlated
    with true scene darkness rather than a reliable proxy for
    it: a genuinely dark sky and a light-polluted sky, both shot
    handheld at night, tend to get similarly boosted ISO/exposure.
    So we surface ISO/exposure time here for context, but don't
    feed them into the Bortle calculation.
    """
    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
        exif_raw = pil_image.getexif()

        if not exif_raw:
            return {'iso': None, 'exposure_time': None, 'source': 'no_exif'}

        tag_map = {ExifTags.TAGS.get(k, k): v for k, v in exif_raw.items()}
        iso = tag_map.get('ISOSpeedRatings') or tag_map.get('PhotographicSensitivity')
        exposure_time = tag_map.get('ExposureTime')

        # Most cameras/phones actually store these in a nested
        # "Exif IFD" sub-block rather than the top-level tags
        if iso is None or exposure_time is None:
            try:
                exif_ifd = exif_raw.get_ifd(0x8769)  # Exif IFD pointer
                if exif_ifd:
                    sub_map = {ExifTags.TAGS.get(k, k): v for k, v in exif_ifd.items()}
                    iso = iso or sub_map.get('ISOSpeedRatings') or sub_map.get('PhotographicSensitivity')
                    exposure_time = exposure_time or sub_map.get('ExposureTime')
            except Exception:
                pass

        if iso is None or exposure_time is None:
            return {'iso': iso, 'exposure_time': None, 'source': 'incomplete_exif'}

        # ExposureTime can come back as a Fraction-like tuple or a float
        if isinstance(exposure_time, tuple):
            shutter_seconds = exposure_time[0] / exposure_time[1] if exposure_time[1] else 0
        else:
            shutter_seconds = float(exposure_time)

        return {
            'iso': float(iso),
            'exposure_time': shutter_seconds,
            'source': 'exif',
        }

    except Exception:
        return {'iso': None, 'exposure_time': None, 'source': 'error'}


def analyze_sky_brightness(gray_image: np.ndarray) -> dict:
    """
    Analyzes the brightness of the sky background.

    Focuses on the upper 60% of the image where the sky is
    most likely to be visible, away from buildings or terrain
    at the bottom of the frame.

    Returns mean brightness, standard deviation, and an
    estimated SQM value.
    """
    height = gray_image.shape[0]
    sky_region = gray_image[:int(height * 0.6), :]

    mean_brightness = float(np.mean(sky_region))
    std_brightness = float(np.std(sky_region))

    sqm_estimate = estimate_sqm_from_brightness(mean_brightness)

    return {
        'mean_brightness': mean_brightness,
        'std_brightness': std_brightness,
        'sqm_estimate': sqm_estimate,
    }


def count_stars(gray_image: np.ndarray) -> dict:
    """
    Counts the number of visible stars in the image using
    blob detection — a technique that finds small bright
    spots against a darker background.

    Uses a threshold relative to each image's own brightness
    distribution (mean + 4 standard deviations) rather than a
    fixed absolute value, so it works correctly whether the
    photo itself is bright or dark overall. Blob geometry
    filters are fairly tight (small max area, high circularity
    and convexity requirements), since sensor noise/grain from
    high-ISO night shots tends to be small and irregular, while
    real stars are small, sharp, and round.

    This isn't perfect — very dense, overlapping star fields can
    undercount, since overlapping stars merge into shapes that
    fail the tight circularity check. But it reliably ranks
    photos in the right relative order from light-polluted to
    genuinely dark skies, which is what the weighted combination
    below actually needs.

    Returns star count and density (stars per 1000 pixels²).
    """
    height, width = gray_image.shape

    # Light denoise to strip single-pixel sensor grain before
    # we start looking for genuine point sources
    denoised = cv2.medianBlur(gray_image, 3)

    # Threshold relative to THIS image's own brightness
    # distribution, rather than a fixed absolute value
    mean, std = float(np.mean(denoised)), float(np.std(denoised))
    relative_threshold = mean + 4 * std
    _, thresh = cv2.threshold(denoised, relative_threshold, 255, cv2.THRESH_BINARY)

    params = cv2.SimpleBlobDetector_Params()
    params.filterByArea = True
    params.minArea = 1
    params.maxArea = 15          # real stars are small, sharp points
    params.filterByCircularity = True
    params.minCircularity = 0.7  # sensor noise tends to be irregular
    params.filterByConvexity = True
    params.minConvexity = 0.8
    params.filterByInertia = False

    detector = cv2.SimpleBlobDetector_create(params)
    keypoints = detector.detect(255 - thresh)  # blob detector looks for dark blobs by default

    star_count = len(keypoints)
    total_pixels = height * width
    density = (star_count / total_pixels) * 1000

    return {'star_count': star_count, 'density': density}


def analyze_color_cast(bgr_image: np.ndarray) -> dict:
    """
    Analyzes the color cast of the sky to detect light pollution.

    Light polluted skies have a characteristic orange, yellow,
    or white glow from sodium and LED street lights.
    Dark skies appear more neutral or slightly blue/green.

    Returns the color ratios and a pollution score (0-1)
    where 1 = heavily light polluted and 0 = natural sky color.
    """
    height = bgr_image.shape[0]
    sky_region = bgr_image[:int(height * 0.6), :]

    b_mean = float(np.mean(sky_region[:, :, 0]))  # Blue
    g_mean = float(np.mean(sky_region[:, :, 1]))  # Green
    r_mean = float(np.mean(sky_region[:, :, 2]))  # Red

    total = b_mean + g_mean + r_mean + 0.001
    r_ratio = r_mean / total
    g_ratio = g_mean / total
    b_ratio = b_mean / total

    pollution_score = (r_ratio + g_ratio * 0.5) - b_ratio
    pollution_score = max(0.0, min(1.0, pollution_score + 0.5))

    return {
        'r_mean': r_mean, 'g_mean': g_mean, 'b_mean': b_mean,
        'r_ratio': r_ratio, 'g_ratio': g_ratio, 'b_ratio': b_ratio,
        'pollution_score': pollution_score,
    }


def analyze_horizon_gradient(bgr_image: np.ndarray, gray_image: np.ndarray) -> dict:
    """
    Splits the sky region into 4 horizontal bands, from zenith
    (top of frame) down to horizon (bottom of the sky region),
    and compares brightness + warm color cast across them.

    Why this matters: real light-pollution skyglow is a dome
    that's warmest and brightest near the horizon (closest to
    the streetlights causing it) and fades toward zenith. Natural
    structure — the Milky Way, airglow, or just a warm sensor bias
    from a long exposure — doesn't follow that pattern. It can sit
    anywhere in the frame, and its color cast tends to be roughly
    uniform from top to bottom rather than concentrated low down.

    Note: brightness alone INCREASES toward the horizon even under
    genuinely dark skies, due to atmospheric extinction — so
    brightness gradient is only used as a weak supporting signal.
    The warm-color gradient is the real discriminator here.

    Returns a 'natural_glow_confidence' score (0-1) where 1 means
    "this really doesn't look like a horizon pollution dome."
    """
    height = gray_image.shape[0]
    sky_bottom = int(height * 0.6)  # same sky region used elsewhere

    sky_gray = gray_image[:sky_bottom, :]
    sky_bgr = bgr_image[:sky_bottom, :]

    band_count = 4
    band_height = max(1, sky_bottom // band_count)

    band_brightness = []
    band_warmth = []

    for i in range(band_count):
        start = i * band_height
        end = sky_bottom if i == band_count - 1 else (i + 1) * band_height
        if start >= end:
            continue

        band_gray = sky_gray[start:end, :]
        band_bgr = sky_bgr[start:end, :]

        band_brightness.append(float(np.mean(band_gray)))

        b_mean = float(np.mean(band_bgr[:, :, 0]))
        g_mean = float(np.mean(band_bgr[:, :, 1]))
        r_mean = float(np.mean(band_bgr[:, :, 2]))
        total = b_mean + g_mean + r_mean + 0.001

        warmth = (r_mean / total + 0.5 * g_mean / total) - (b_mean / total)
        band_warmth.append(max(0.0, min(1.0, warmth + 0.5)))

    if len(band_brightness) < 2:
        # Image too small to band reliably — assume neutral
        return {'natural_glow_confidence': 0.5, 'warm_gradient': 0.0, 'brightness_gradient': 0.0}

    zenith_brightness = band_brightness[0]
    horizon_brightness = band_brightness[-1]
    zenith_warmth = band_warmth[0]
    horizon_warmth = band_warmth[-1]

    # Positive warm_gradient = warmer near horizon (pollution-like).
    # Near-zero or negative = uniform/natural.
    warm_gradient = horizon_warmth - zenith_warmth

    # Positive brightness_gradient = brighter near horizon.
    # Weak signal on its own (see docstring) — kept small.
    brightness_gradient = (horizon_brightness - zenith_brightness) / 255.0

    # Normalize: a warm_gradient of ~0.3 is treated as a strongly
    # horizon-concentrated pollution signature.
    warm_gradient_norm = max(-1.0, min(1.0, warm_gradient / 0.3))
    brightness_gradient_norm = max(-1.0, min(1.0, brightness_gradient / 0.5))

    # Weighted combination: warmth does most of the work (80%),
    # brightness is a minor supporting signal (20%).
    pollution_likelihood = (
        0.5
        + 0.4 * warm_gradient_norm
        + 0.1 * brightness_gradient_norm
    )
    pollution_likelihood = max(0.0, min(1.0, pollution_likelihood))

    # We want the inverse: how confident we are this is NOT a
    # horizon pollution dome (i.e. likely natural glow instead)
    natural_glow_confidence = 1.0 - pollution_likelihood

    return {
        'natural_glow_confidence': natural_glow_confidence,
        'warm_gradient': warm_gradient,
        'brightness_gradient': brightness_gradient,
    }


def analyze_contrast(gray_image: np.ndarray) -> dict:
    """
    Measures the contrast between bright stars and the
    dark sky background.

    High contrast = stars are much brighter than the background
    = darker sky = lower Bortle number.

    Low contrast = stars barely visible against bright sky
    = heavy light pollution = higher Bortle number.

    Returns contrast ratio and a normalized score (0-1)
    where 1 = high contrast (dark sky) and 0 = low contrast.
    """
    bright_percentile = float(np.percentile(gray_image, 95))
    dark_percentile = float(np.percentile(gray_image, 10))

    if dark_percentile < 1:
        dark_percentile = 1.0

    contrast_ratio = bright_percentile / dark_percentile
    contrast_score = min(1.0, (contrast_ratio - 1) / 9.0)

    return {
        'bright_percentile': bright_percentile,
        'dark_percentile': dark_percentile,
        'contrast_ratio': contrast_ratio,
        'contrast_score': contrast_score,
    }


def combine_metrics_to_bortle(
    brightness_data: dict,
    star_data: dict,
    color_data: dict,
    contrast_data: dict,
    horizon_data: dict,
) -> dict:
    """
    Combines all four metrics into a single weighted Bortle
    Scale rating.

    Each metric (brightness, star count, color cast, contrast)
    produces its own independent "shadow" Bortle estimate, and
    the final rating is a weighted average of all four — so each
    metric has real voting power proportional to its weight,
    rather than one metric dominating the result.

    The color-cast estimate is additionally adjusted using
    horizon_data (see analyze_horizon_gradient) — dampened toward
    neutral when the warm color doesn't look horizon-concentrated,
    i.e. when it looks more like natural Milky Way/airglow
    structure than a real sodium/LED skyglow dome.

    Weights:
    - Sky brightness (SQM): 40% — most reliable single indicator
    - Star count:           25% — directly visible measure of sky quality
    - Color cast:           20% — indicator of light pollution type
    - Contrast:             15% — supporting metric

    Returns the final Bortle level and a confidence score.
    """

    sqm_bortle = sqm_to_bortle_level(brightness_data['sqm_estimate'])

    density = star_data['density']

    # Thresholds calibrated against the star detector's actual
    # output range across a set of real test photos spanning
    # genuinely dark skies to light-polluted skies.
    if density > 0.15:
        star_bortle = 1
    elif density > 0.08:
        star_bortle = 3
    elif density > 0.03:
        star_bortle = 5
    elif density > 0.008:
        star_bortle = 7
    else:
        star_bortle = 9

    pollution = color_data['pollution_score']
    raw_color_bortle = int(pollution * 8) + 1

    # Dampen color_bortle toward neutral (5) when the warm cast
    # doesn't look horizon-concentrated (i.e. likely natural glow
    # rather than real light pollution)
    natural_glow_confidence = horizon_data['natural_glow_confidence']
    color_bortle = 5 + (raw_color_bortle - 5) * (1.0 - natural_glow_confidence)
    color_bortle = round(color_bortle)

    contrast = contrast_data['contrast_score']
    contrast_bortle = 9 - int(contrast * 8)

    # ── Weighted average of all four shadow estimates ──
    weighted_bortle = (
        sqm_bortle      * 0.40 +
        star_bortle     * 0.25 +
        color_bortle    * 0.20 +
        contrast_bortle * 0.15
    )

    final_bortle = round(weighted_bortle)
    final_bortle = max(1, min(9, final_bortle))

    # ── Confidence: how much the four estimates agree ──
    # Compares each metric to the final blended rating rather
    # than to raw brightness alone, since brightness is not
    # treated as ground truth.
    estimates = [sqm_bortle, star_bortle, color_bortle, contrast_bortle]
    agreements = sum(1 for est in estimates if abs(est - final_bortle) <= 2)
    confidence = agreements / len(estimates)

    return {
        'bortle_level':    final_bortle,
        'sqm_estimate':    brightness_data['sqm_estimate'],
        'sqm_bortle':      sqm_bortle,
        'star_bortle':     star_bortle,
        'color_bortle':    color_bortle,
        'raw_color_bortle': raw_color_bortle,
        'contrast_bortle': contrast_bortle,
        'confidence':      confidence,
    }


def analyze_image(image_bytes: bytes) -> dict:
    """
    Main entry point for the Bortle analyzer.

    Takes raw image bytes (from the uploaded photo), runs all
    analysis steps, and returns the full result including the
    Bortle level and all supporting metrics.

    This is the function called by the FastAPI endpoint.
    """
    try:
        image_array = np.frombuffer(image_bytes, dtype=np.uint8)
        bgr_image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if bgr_image is None:
            return {
                'success': False,
                'error': 'Could not decode image. Make sure it is a valid JPEG or PNG.'
            }

        gray_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)

        # EXIF is read for informational display only — see
        # get_exposure_correction docstring for why it's not
        # used to adjust the brightness/SQM math
        exposure_info = get_exposure_correction(image_bytes)

        brightness_data = analyze_sky_brightness(gray_image)
        star_data = count_stars(gray_image)
        color_data = analyze_color_cast(bgr_image)
        contrast_data = analyze_contrast(gray_image)
        horizon_data = analyze_horizon_gradient(bgr_image, gray_image)

        result = combine_metrics_to_bortle(
            brightness_data, star_data, color_data, contrast_data, horizon_data,
        )

        return {
            'success': True,
            'bortle_level': result['bortle_level'],
            'confidence': round(result['confidence'] * 100, 1),
            'sqm_estimate': round(result['sqm_estimate'], 2),
            'analysis': {
                'sky_brightness': {
                    'mean': round(brightness_data['mean_brightness'], 2),
                    'std': round(brightness_data['std_brightness'], 2),
                    'sqm': round(brightness_data['sqm_estimate'], 2),
                },
                'stars': {
                    'count': star_data['star_count'],
                    'density': round(star_data['density'], 4),
                },
                'color': {
                    'r_mean': round(color_data['r_mean'], 2),
                    'g_mean': round(color_data['g_mean'], 2),
                    'b_mean': round(color_data['b_mean'], 2),
                    'pollution_score': round(color_data['pollution_score'], 3),
                },
                'contrast': {
                    'ratio': round(contrast_data['contrast_ratio'], 2),
                    'score': round(contrast_data['contrast_score'], 3),
                },
                'exposure_metadata': {
                    # informational only — not used in the Bortle math,
                    # see get_exposure_correction docstring
                    'iso': exposure_info['iso'],
                    'exposure_time_seconds': exposure_info['exposure_time'],
                    'source': exposure_info['source'],
                },
                'horizon_gradient': {
                    'natural_glow_confidence': round(horizon_data['natural_glow_confidence'], 3),
                    'warm_gradient': round(horizon_data['warm_gradient'], 3),
                    'brightness_gradient': round(horizon_data['brightness_gradient'], 3),
                    'raw_color_bortle': result['raw_color_bortle'],
                    'corrected_color_bortle': result['color_bortle'],
                },
            },
            'pipeline': 'math_analyzer',
        }

    except Exception as e:
        return {
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }