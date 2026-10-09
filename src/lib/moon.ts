/**
 * Moon phase calculation library.
 *
 * Uses a reliable lunar phase algorithm based on the synodic month
 * and a known new moon reference date. Accurate to within a small
 * fraction of a day for phase display purposes.
 *
 * Reference new moon: 2000-01-06 18:14 UTC (Julian Day 2451550.1)
 * Mean synodic month: 29.530588853 days
 */

// Mean length of a synodic month in days.
export const SYNODIC_MONTH = 29.530588853;

// Reference new moon as a Unix timestamp (ms): 2000-01-06T18:14:00Z
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export type PhaseKey =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export interface PhaseInfo {
  /** 0..1 position in the cycle. 0 = new moon, 0.5 = full moon. */
  phaseFraction: number;
  /** Illuminated fraction of the Moon's visible disk, 0..1. */
  illumination: number;
  /** Days since the last new moon (lunar age). */
  age: number;
  /** Cycle progress as a percentage (0..100). */
  progress: number;
  /** Machine key for the named phase. */
  key: PhaseKey;
  /** Human-readable phase name. */
  name: string;
  /** Emoji matching the current phase. */
  emoji: string;
  /** True when the Moon is growing brighter (between new and full). */
  waxing: boolean;
  /** True when the Moon is shrinking (between full and new). */
  waning: boolean;
}

const PHASE_NAMES: Record<PhaseKey, string> = {
  new: "New Moon",
  "waxing-crescent": "Waxing Crescent",
  "first-quarter": "First Quarter",
  "waxing-gibbous": "Waxing Gibbous",
  full: "Full Moon",
  "waning-gibbous": "Waning Gibbous",
  "last-quarter": "Last Quarter",
  "waning-crescent": "Waning Crescent",
};

const PHASE_EMOJI: Record<PhaseKey, string> = {
  new: "\u{1F311}", // 🌑
  "waxing-crescent": "\u{1F312}", // 🌒
  "first-quarter": "\u{1F313}", // 🌓
  "waxing-gibbous": "\u{1F314}", // 🌔
  full: "\u{1F315}", // 🌕
  "waning-gibbous": "\u{1F316}", // 🌖
  "last-quarter": "\u{1F317}", // 🌗
  "waning-crescent": "\u{1F318}", // 🌘
};

/**
 * Returns the moon phase fraction (0..1) for a given date.
 * 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter.
 */
export function getPhaseFraction(date: Date): number {
  const diffDays =
    (date.getTime() - REFERENCE_NEW_MOON_MS) / (1000 * 60 * 60 * 24);
  const phase = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  return phase / SYNODIC_MONTH;
}

/**
 * Returns the illuminated fraction (0..1) of the Moon's visible disk.
 * Derived from the phase angle: k = (1 - cos(2*pi*phase)) / 2.
 */
export function getIllumination(phaseFraction: number): number {
  return (1 - Math.cos(2 * Math.PI * phaseFraction)) / 2;
}

/** Maps a phase fraction to a named phase key. */
export function getPhaseKey(phaseFraction: number): PhaseKey {
  // Center each named phase on its nominal point with a 1/8 window.
  const segments: Array<[number, PhaseKey]> = [
    [0.0, "new"],
    [0.125, "waxing-crescent"],
    [0.25, "first-quarter"],
    [0.375, "waxing-gibbous"],
    [0.5, "full"],
    [0.625, "waning-gibbous"],
    [0.75, "last-quarter"],
    [0.875, "waning-crescent"],
  ];
  const normalized = (phaseFraction + 1 / 16) % 1;
  const idx = Math.floor(normalized * 8) % 8;
  return segments[idx][1];
}

/** Full phase information for a given date. */
export function getMoonPhase(date: Date = new Date()): PhaseInfo {
  const phaseFraction = getPhaseFraction(date);
  const illumination = getIllumination(phaseFraction);
  const age = phaseFraction * SYNODIC_MONTH;
  const progress = phaseFraction * 100;
  const key = getPhaseKey(phaseFraction);
  const waxing = phaseFraction < 0.5;
  return {
    phaseFraction,
    illumination,
    age,
    progress,
    key,
    name: PHASE_NAMES[key],
    emoji: PHASE_EMOJI[key],
    waxing,
    waning: !waxing,
  };
}

/**
 * Shortest circular distance between two phase fractions (0..0.5).
 */
function angularDistance(a: number, b: number): number {
  let d = Math.abs(a - b) % 1;
  if (d > 0.5) d = 1 - d;
  return d;
}

/**
 * Finds the next date (strictly after `from`) where the phase fraction
 * crosses the given target (0..1). Used to compute upcoming new and full
 * moons. Uses a mean-motion estimate plus a fine-grained local search so
 * it is robust near the 0/1 wrap-around.
 */
export function findNextPhase(from: Date, target: number): Date {
  const p0 = getPhaseFraction(from);
  // Forward distance (in fraction of a cycle) to the next target crossing.
  let delta = target - p0;
  if (delta <= 1e-9) delta += 1;
  const cycleMs = SYNODIC_MONTH * 24 * 60 * 60 * 1000;
  const estMs = delta * cycleMs;
  const center = from.getTime() + estMs;
  // Search a +/-2 day window around the estimate. Clamped to be >= from
  // so we never report a crossing at or before the start.
  const windowMs = 2 * 24 * 60 * 60 * 1000;
  let lo = Math.max(center - windowMs, from.getTime() + 1);
  const hi = center + windowMs;

  // Coarse scan every 30 minutes to bracket the crossing.
  const stepMs = 30 * 60 * 1000;
  let bestT = lo;
  let bestD = Infinity;
  for (let t = lo; t <= hi; t += stepMs) {
    const d = angularDistance(getPhaseFraction(new Date(t)), target);
    if (d < bestD) {
      bestD = d;
      bestT = t;
    }
  }

  // Refine with a ternary search around the best sample.
  let a = bestT - stepMs;
  let b = bestT + stepMs;
  if (a < from.getTime()) a = from.getTime() + 1;
  for (let i = 0; i < 50; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    const d1 = angularDistance(getPhaseFraction(new Date(m1)), target);
    const d2 = angularDistance(getPhaseFraction(new Date(m2)), target);
    if (d1 < d2) b = m2;
    else a = m1;
  }
  return new Date((a + b) / 2);
}

/** Returns the next full moon date after the given date. */
export function getNextFullMoon(from: Date = new Date()): Date {
  return findNextPhase(from, 0.5);
}

/** Returns the next new moon date after the given date. */
export function getNextNewMoon(from: Date = new Date()): Date {
  return findNextPhase(from, 0);
}

/**
 * Builds an SVG path string for the lit portion of the Moon given a phase
 * fraction (0..1) and a radius. The disk is centred at (0,0).
 *
 * The terminator is a half-ellipse whose horizontal radius changes with the
 * illuminated fraction, which produces an accurate phase silhouette.
 */
export function getLitPath(phaseFraction: number, radius: number): string {
  const R = radius;
  const angle = 2 * Math.PI * phaseFraction;
  const k = (1 - Math.cos(angle)) / 2; // illuminated fraction 0..1
  const rx = Math.abs(R * (1 - 2 * k)); // terminator x-radius
  const waxing = phaseFraction < 0.5;
  let s1: 0 | 1;
  let s2: 0 | 1;
  if (waxing) {
    // Right side lit.
    s1 = 1; // outer right semicircle (clockwise)
    s2 = k < 0.5 ? 1 : 0; // crescent bulges right, gibbous bulges left
  } else {
    // Left side lit.
    s1 = 0; // outer left semicircle (counterclockwise)
    s2 = k < 0.5 ? 0 : 1; // crescent bulges left, gibbous bulges right
  }
  return `M 0 ${-R} A ${R} ${R} 0 0 ${s1} 0 ${R} A ${rx} ${R} 0 0 ${s2} 0 ${-R} Z`;
}

/** Static catalogue of the eight principal moon phases. */
export interface PhaseCatalogEntry {
  key: PhaseKey;
  name: string;
  emoji: string;
  /** Nominal phase fraction for the visual demo. */
  demoFraction: number;
  short: string;
  meaning: string;
}

export const PHASE_CATALOG: PhaseCatalogEntry[] = [
  {
    key: "new",
    name: "New Moon",
    emoji: "\u{1F311}",
    demoFraction: 0,
    short:
      "The Moon sits between Earth and the Sun, so its lit side faces away from us. The night sky is dark and starry.",
    meaning:
      "A fresh lunar cycle begins. Many people use this dark, quiet moon to set a goal, start a habit, or plan the weeks ahead.",
  },
  {
    key: "waxing-crescent",
    name: "Waxing Crescent",
    emoji: "\u{1F312}",
    demoFraction: 0.125,
    short:
      "A slim sliver of light appears on the right side (in the Northern Hemisphere). The Moon is growing toward first quarter.",
    meaning:
      "A gentle sign of progress. This phase is linked with taking the first small steps on a new plan or idea.",
  },
  {
    key: "first-quarter",
    name: "First Quarter",
    emoji: "\u{1F313}",
    demoFraction: 0.25,
    short:
      "Half of the Moon's near side is lit. It rises around midday and sets around midnight, so it is easy to spot in the evening.",
    meaning:
      "A good moment to review your progress and push past early hurdles. The Moon is half way from new to full.",
  },
  {
    key: "waxing-gibbous",
    name: "Waxing Gibbous",
    emoji: "\u{1F314}",
    demoFraction: 0.375,
    short:
      "More than half is lit and the bright part keeps growing. The Moon stays up longer each night.",
    meaning:
      "A phase of steady building. People often use it to refine their work and stay focused before a big reveal.",
  },
  {
    key: "full",
    name: "Full Moon",
    emoji: "\u{1F315}",
    demoFraction: 0.5,
    short:
      "The whole near side is lit. The Moon rises at sunset and stays up all night, so it is the brightest phase of all.",
    meaning:
      "A peak of light and energy. Full moons have shaped calendars, tides, and traditions for thousands of years.",
  },
  {
    key: "waning-gibbous",
    name: "Waning Gibbous",
    emoji: "\u{1F316}",
    demoFraction: 0.625,
    short:
      "The lit part begins to shrink. The Moon rises later each night after the full moon.",
    meaning:
      "A time to slow down and be thankful. Many use this phase to reflect on what went well and let go of stress.",
  },
  {
    key: "last-quarter",
    name: "Last Quarter",
    emoji: "\u{1F317}",
    demoFraction: 0.75,
    short:
      "Half of the near side is lit again, but the bright part is now on the left (in the Northern Hemisphere).",
    meaning:
      "A moment to release what no longer helps you. The Moon is half way from full back to new.",
  },
  {
    key: "waning-crescent",
    name: "Waning Crescent",
    emoji: "\u{1F318}",
    demoFraction: 0.875,
    short:
      "A thin sliver of light remains before the Moon goes dark. It rises late and fades before dawn.",
    meaning:
      "A quiet, restful close to the cycle. A good time to rest, reset, and prepare for a fresh start.",
  },
];

/** Format a date for display with day, date, and time. */
export function formatFullDate(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(date);
}

export function formatDayName(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(
    date,
  );
}

export function formatTime(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone,
  }).format(date);
}

/** Returns a short GMT offset label such as "GMT+5". */
export function getTimeZoneOffsetLabel(timeZone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find(
      (p) => p.type === "timeZoneName",
    )?.value;
    return tzPart ?? "";
  } catch {
    return "";
  }
}
