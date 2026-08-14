export const BORTLE_LEVELS = [
  {
    level: 1,                         // Bortle level number (1 = darkest)
    name: 'Excellent Dark Sky',       // Display name
    color: '#22c55e',                 // Color used for the dot indicator and badge
    // Paragraph shown on the detail screen
    description:
      'This is the darkest classification of sky found anywhere on Earth, typically only reached in the most remote wilderness areas far from any artificial light source. The zodiacal light, gegenschein, and zodiacal band are all plainly visible, and the zodiacal light is bright and colorful enough to be mistaken for actual illumination of the landscape. The Milky Way is so bright it casts visible shadows on the ground and shows dense, intricate structure — dust lanes, star clouds, and dark nebulae are all clearly separated. Airglow, a natural faint atmospheric glow, can sometimes be seen low on the horizon. With this many stars visible, even experienced observers can find it difficult to pick out familiar constellations, since the sky is simply too crowded with light.',
    // Bullet points shown in the "Sky Characteristics" card
    chars: [
      'M33 is directly visible to the naked eye',
      'Limiting magnitude: 7.6 to 8.0',
      'Airglow may be faintly visible near the horizon',
      'Jupiter and Venus affect dark adaptation',
      'Globular clusters show structure without optical aid',
    ],
  },
  {
    level: 2,
    name: 'Truly Dark Sky',
    color: '#4ade80',
    description:
      'A truly dark rural sky, one level down from the very best sites on Earth but still exceptional by almost any standard. Airglow is weakly visible near the horizon on clear nights, and the zodiacal light retains a distinctly yellowish color, bright enough in spring and fall to cast faint shadows of its own. The Milky Way core shows tremendous structure overhead, with complex dark nebulae clearly separating bright star clouds. M33, the Triangulum Galaxy, is visible with averted vision — a useful benchmark astronomers use to judge sky darkness. Clouds are noticeably darker than the surrounding sky, appearing as black gaps against the Milky Way rather than glowing patches, and many Messier objects are within reach of the unaided eye.',
    chars: [
      'Zodiacal light easily visible in spring and fall',
      'Limiting magnitude: 7.1 to 7.5',
      'Clouds appear as dark holes against the Milky Way',
      'Many Messier objects visible to the naked eye',
      'Milky Way bright enough to cast faint shadows',
    ],
  },
  {
    level: 3,
    name: 'Rural Sky',
    color: '#a3e635',
    description:
      'A rural sky where light pollution has become evident, but only as a faint glow along one or two sections of the horizon rather than a dome overhead. The Milky Way still puts on an impressive show, retaining much of its structural detail directly overhead even though its edges begin to fade with altitude near the horizon. The zodiacal light remains striking in spring and autumn evenings, and its color is still discernible to careful observers. M33 is comparatively easy to spot with averted vision here, a step up in visibility from darker classes. This is often considered the realistic target for dedicated amateur astronomers who don\'t have access to true wilderness sites, offering excellent views of the majority of deep-sky objects.',
    chars: [
      'Limiting magnitude: 6.6 to 7.0',
      'M33 is easy with averted vision',
      'Zodiacal light striking in spring and fall',
      'Light domes visible on the horizon in 1-2 directions',
      'Excellent views of most deep sky objects',
    ],
  },
  {
    level: 4,
    name: 'Rural / Suburban Transition',
    color: '#facc15',
    description:
      'This transitional class marks the point where light pollution becomes fairly obvious rather than a minor annoyance, typically showing as bright domes over one or two directions where nearby towns or cities sit. The zodiacal light can still be seen on clear, moonless nights, but it no longer extends more than about 60 degrees above the horizon, a noticeable contraction from darker sites. The Milky Way remains genuinely impressive when viewed overhead, though it has begun to lose the fine structural detail that defines the darkest skies — dust lanes and subtle brightness variations blur together. Airglow may occasionally be visible low on the horizon on especially clear nights. Despite the encroaching light domes, Messier globular clusters still reveal fine detail through a telescope, making this a workable, if imperfect, site for serious observing.',
    chars: [
      'Limiting magnitude: 6.1 to 6.5',
      'Milky Way still impressive but lacks fine detail',
      'Airglow may be visible along the horizon',
      'Light domes apparent over populated areas',
      'Messier globulars still show fine detail in telescope',
    ],
  },
  {
    level: 5,
    name: 'Suburban Sky',
    color: '#fb923c',
    description:
      'A typical suburban sky, the reality for a large share of people who live within reach of a small city or a cluster of towns. Only the faintest hints of zodiacal light are visible, and only on the very best, haze-free nights. The Milky Way becomes washed out directly overhead and degrades even further near the horizon, where it may disappear into the sky glow entirely. Light pollution is visible along most of the horizon rather than concentrated in one or two directions, giving the whole sky a subtly brightened cast even at the zenith. Clouds are distinctly brighter than the surrounding sky background, reflecting the glow of streetlights and buildings back down. M33 becomes a genuinely difficult target here, usually requiring both a dark-adapted eye and ideal conditions to glimpse at all.',
    chars: [
      'Limiting magnitude: 5.6 to 6.0',
      'Light pollution visible over most of the horizon',
      'Milky Way only detectable overhead',
      'Clouds distinctly brighter than the sky background',
      'M33 is a very difficult object to observe',
    ],
  },
  {
    level: 6,
    name: 'Bright Suburban Sky',
    color: '#f97316',
    description:
      'A bright suburban sky where light pollution has become the dominant feature of the nighttime environment rather than an occasional distraction. The zodiacal light is no longer visible under any conditions, and the Milky Way survives only as a faint suggestion near the zenith, easily missed by anyone not specifically looking for it. The sky background itself often takes on a visible grey or orange cast from scattered artificial light, most noticeable when looking toward the horizon. Clouds glow clearly brighter than the surrounding sky, sometimes dramatically so near urban centers. M33 is only glimpsed on the very best nights of the year, and most Messier objects that were easy at darker sites now require real effort, leaving only the brightest handful to stand out clearly.',
    chars: [
      'Limiting magnitude: 5.1 to 5.5',
      'M33 only glimpsed on the best nights',
      'Sky background has a grey or orange cast',
      'Significant light domes in most directions',
      'Only the brightest Messier objects stand out',
    ],
  },
  {
    level: 7,
    name: 'Suburban / Urban Transition',
    color: '#ef4444',
    description:
      'The transition zone between suburban and true urban skies, where the entire sky background takes on a persistent greenish or orange hue from horizon to horizon. The Milky Way is essentially invisible under these conditions — at best, careful observers might detect a faint suggestion of it near the zenith on the clearest, driest nights of the year, and even then it\'s easy to miss. Light sources and their glow are visible in nearly every direction rather than isolated to one or two light domes. Despite the heavy sky glow, M31, the Andromeda Galaxy, can still be faintly made out with the naked eye by experienced observers who know exactly where to look. Clouds appear dramatically brighter than the sky around them, often lit orange or pink by the scattered light of the city below.',
    chars: [
      'Limiting magnitude: 4.6 to 5.0',
      'Light sources visible in most directions',
      'Orange or grey sky glow covers much of the sky',
      'M31 faintly visible to the naked eye',
      'Clouds much brighter than the background sky',
    ],
  },
  {
    level: 8,
    name: 'City Sky',
    color: '#dc2626',
    description:
      'A genuine city sky, where light pollution has overwhelmed nearly all but the very brightest celestial objects. The sky itself glows a whitish-gray or orange, bright enough in many locations to comfortably read a newspaper by its light alone, even well after midnight. The Milky Way is totally invisible under these conditions, with no realistic chance of detecting it regardless of viewing direction or time of year. Even well-known constellations like Orion or Ursa Major become difficult to trace, since only their brightest handful of stars punch through the ambient glow. This class of sky isn\'t hopeless for observing, however — a telescope remains genuinely useful for the Moon, bright planets, and close double stars, which stay unaffected by light pollution regardless of how bright the surrounding sky becomes.',
    chars: [
      'Limiting magnitude: 4.1 to 4.5',
      'Only the brightest stars recognizable in patterns',
      'Sky bright enough to read a newspaper',
      'Orion and Ursa Major barely identifiable',
      'Telescope still useful for Moon and planets',
    ],
  },
  {
    level: 9,
    name: 'Inner City Sky',
    color: '#991b1b',
    description:
      'The most light-polluted classification on the scale, typical of dense downtown cores and major metropolitan centers. The entire sky glows brightly even directly overhead at the zenith, with no direction offering meaningfully darker conditions than any other. Only a small handful of the very brightest stars remain visible at all — often just a dozen or so, compared to the thousands visible under a truly dark sky. The ambient light can be bright enough to comfortably read a book outdoors, a striking illustration of just how much artificial light has replaced the natural night. Familiar constellations become difficult or outright impossible to trace, since most of their fainter connecting stars are completely erased by the glow, and any meaningful deep-sky observation is essentially out of reach without traveling elsewhere.',
    chars: [
      'Limiting magnitude: 4.0 or worse',
      'Only a handful of the very brightest stars visible',
      'Sky bright enough to read a book comfortably outdoors',
      'Constellations difficult or impossible to identify',
      'Deep sky observation essentially impossible',
    ],
  },
]