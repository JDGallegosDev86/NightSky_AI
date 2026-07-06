import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form
from app.bortle_analyzer import analyze_image

router = APIRouter()

# ── Upload directory ─────────────────────────────────────
# All uploaded photos are saved here.
# TODO: Replace with cloud storage (AWS S3, etc.) in production.
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-photo")
async def upload_photo(
    photo:        UploadFile = File(...),
    latitude:     str = Form(None),
    longitude:    str = Form(None),
    timestamp:    str = Form(None),
    sharePublicly: str = Form(None),
):
    # ── Read the image bytes ─────────────────────────
    image_bytes = await photo.read()

    # ── Save the file to disk ────────────────────────
    file_path = os.path.join(UPLOAD_DIR, photo.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(image_bytes)

    # ── Run Bortle analysis ──────────────────────────
    # Pass the raw image bytes to the math analyzer.
    # This returns the Bortle level and supporting metrics.
    analysis_result = analyze_image(image_bytes)

    # ── Build the response ───────────────────────────
    if analysis_result['success']:
        return {
            "message":      "Photo uploaded and analyzed successfully",
            "filename":     photo.filename,
            "latitude":     latitude,
            "longitude":    longitude,
            "timestamp":    timestamp,
            "sharePublicly": sharePublicly,
            # Bortle Scale result from the math analyzer
            "bortle_level":  analysis_result['bortle_level'],
            "confidence":    analysis_result['confidence'],
            "sqm_estimate":  analysis_result['sqm_estimate'],
            "analysis":      analysis_result['analysis'],
            "pipeline":      analysis_result['pipeline'],
        }
    else:
        # Analysis failed but file was still saved
        return {
            "message":   "Photo uploaded but analysis failed",
            "filename":  photo.filename,
            "latitude":  latitude,
            "longitude": longitude,
            "timestamp": timestamp,
            "error":     analysis_result.get('error', 'Unknown error'),
        }