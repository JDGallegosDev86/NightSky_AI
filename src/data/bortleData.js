export const BORTLE_LEVELS = [
  {
    level: 1,                         // Bortle level number (1 = darkest)
    name: 'Excellent Dark Sky',       // Display name
    color: '#22c55e',                 // Color used for the dot indicator and badge
    // Short paragraph shown on the detail screen
    description:
      'The zodiacal light, gegenschein, and zodiacal band are all visible. The Milky Way causes a noticeable increase in sky brightness and shows incredible structure and detail.',
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
      'Airglow is weakly visible near the horizon. M33 is directly visible with averted vision. The Milky Way core shows tremendous structure and complex dark nebulae.',
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
      'Some light pollution evident along the horizon. The Milky Way is still very impressive and shows many structural details overhead.',
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
      'Fairly obvious light pollution domes over one or two directions. The zodiacal light is still visible but does not extend more than 60 degrees from the horizon.',
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
      'Only hints of the zodiacal light on the best nights. The Milky Way is washed out at the zenith and appears very degraded close to the horizon.',
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
      'The zodiacal light is invisible. The Milky Way is only seen near the zenith. Clouds are clearly brighter than the rest of the sky.',
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
      'The entire sky background has a greenish or orange hue. The Milky Way is nearly invisible. Only portions near the zenith are barely detectable on the best nights.',
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
      'The sky glows whitish gray or orange. You can read a newspaper by the sky glow alone. The Milky Way is totally invisible.',
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
      'The entire sky is brightly lit even at the zenith. Only the brightest stars are visible at all. The Milky Way is completely and utterly invisible.',
    chars: [
      'Limiting magnitude: 4.0 or worse',
      'Only a handful of the very brightest stars visible',
      'Sky bright enough to read a book comfortably outdoors',
      'Constellations difficult or impossible to identify',
      'Deep sky observation essentially impossible',
    ],
  },
]