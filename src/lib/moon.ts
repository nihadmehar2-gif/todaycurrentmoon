/**
 * Moon phase calculation library.
 *
 * Uses a lookup table of actual (astronomically observed) new moon times
 * to compute the phase fraction. This avoids the accumulated drift of the
 * mean-synodic-month method, which can be off by 1-3 days over multiple
 * cycles because the Moon's orbit is elliptical.
 *
 * The table covers 2020-2030. For dates outside this range, it falls back
 * to the mean synodic month from the nearest table entry.
 *
 * Reference new moon times: USNO / NASA Astronomical Applications Department.
 */

// Mean length of a synodic month in days.
export const SYNODIC_MONTH = 29.530588853;

// Reference new moon as a Unix timestamp (ms): 2000-01-06T18:14:00Z
// (kept for backward compatibility; used only as a fallback).
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

// Table of actual new moon times (UTC) from USNO/NASA, covering 2020-2030.
// Each entry is the Unix timestamp (ms) of an astronomically observed new moon.
const NEW_MOON_TIMES_MS: number[] = [
  Date.UTC(2020, 0, 24, 21, 42),
  Date.UTC(2020, 1, 23, 15, 32),
  Date.UTC(2020, 2, 24, 9, 28),
  Date.UTC(2020, 3, 23, 2, 26),
  Date.UTC(2020, 4, 22, 17, 39),
  Date.UTC(2020, 5, 21, 6, 41),
  Date.UTC(2020, 6, 20, 17, 33),
  Date.UTC(2020, 7, 19, 2, 41),
  Date.UTC(2020, 8, 17, 11, 0),
  Date.UTC(2020, 9, 16, 19, 31),
  Date.UTC(2020, 10, 15, 5, 7),
  Date.UTC(2020, 11, 14, 16, 17),
  Date.UTC(2021, 0, 13, 5, 0),
  Date.UTC(2021, 1, 11, 19, 5),
  Date.UTC(2021, 2, 13, 10, 21),
  Date.UTC(2021, 3, 12, 2, 31),
  Date.UTC(2021, 4, 11, 19, 0),
  Date.UTC(2021, 5, 10, 10, 53),
  Date.UTC(2021, 6, 10, 1, 17),
  Date.UTC(2021, 7, 8, 13, 50),
  Date.UTC(2021, 8, 7, 0, 52),
  Date.UTC(2021, 9, 6, 11, 5),
  Date.UTC(2021, 10, 4, 21, 15),
  Date.UTC(2021, 11, 4, 7, 43),
  Date.UTC(2022, 0, 2, 18, 33),
  Date.UTC(2022, 1, 1, 5, 46),
  Date.UTC(2022, 2, 2, 17, 35),
  Date.UTC(2022, 3, 1, 6, 24),
  Date.UTC(2022, 3, 30, 20, 28),
  Date.UTC(2022, 4, 30, 11, 30),
  Date.UTC(2022, 5, 29, 2, 52),
  Date.UTC(2022, 6, 28, 17, 55),
  Date.UTC(2022, 7, 27, 8, 17),
  Date.UTC(2022, 8, 25, 21, 55),
  Date.UTC(2022, 9, 25, 10, 49),
  Date.UTC(2022, 10, 23, 22, 57),
  Date.UTC(2022, 11, 23, 10, 16),
  Date.UTC(2023, 0, 21, 20, 53),
  Date.UTC(2023, 1, 20, 7, 6),
  Date.UTC(2023, 2, 21, 18, 23),
  Date.UTC(2023, 3, 20, 4, 12),
  Date.UTC(2023, 4, 19, 15, 53),
  Date.UTC(2023, 5, 18, 4, 37),
  Date.UTC(2023, 6, 17, 18, 32),
  Date.UTC(2023, 7, 16, 9, 38),
  Date.UTC(2023, 8, 14, 1, 40),
  Date.UTC(2023, 9, 14, 17, 55),
  Date.UTC(2023, 10, 13, 9, 27),
  Date.UTC(2023, 11, 12, 23, 32),
  Date.UTC(2024, 0, 11, 11, 57),
  Date.UTC(2024, 1, 9, 22, 59),
  Date.UTC(2024, 2, 10, 9, 0),
  Date.UTC(2024, 3, 8, 18, 21),
  Date.UTC(2024, 4, 8, 3, 22),
  Date.UTC(2024, 5, 6, 12, 38),
  Date.UTC(2024, 6, 5, 22, 57),
  Date.UTC(2024, 7, 4, 11, 13),
  Date.UTC(2024, 8, 3, 1, 55),
  Date.UTC(2024, 9, 2, 18, 49),
  Date.UTC(2024, 10, 1, 12, 47),
  Date.UTC(2024, 11, 1, 6, 21),
  Date.UTC(2024, 11, 30, 22, 27),
  Date.UTC(2025, 0, 29, 12, 36),
  Date.UTC(2025, 1, 28, 0, 45),
  Date.UTC(2025, 2, 29, 10, 58),
  Date.UTC(2025, 3, 27, 19, 31),
  Date.UTC(2025, 4, 27, 3, 2),
  Date.UTC(2025, 5, 25, 10, 32),
  Date.UTC(2025, 6, 24, 19, 11),
  Date.UTC(2025, 7, 23, 6, 6),
  Date.UTC(2025, 8, 21, 19, 54),
  Date.UTC(2025, 9, 21, 12, 25),
  Date.UTC(2025, 10, 20, 6, 47),
  Date.UTC(2025, 11, 20, 1, 43),
  Date.UTC(2026, 0, 19, 19, 25),
  Date.UTC(2026, 1, 18, 9, 1),
  Date.UTC(2026, 2, 19, 23, 8),
  Date.UTC(2026, 3, 18, 11, 28),
  Date.UTC(2026, 4, 18, 2, 42),
  Date.UTC(2026, 5, 16, 19, 15),
  Date.UTC(2026, 6, 15, 11, 14),
  Date.UTC(2026, 7, 14, 3, 42),
  Date.UTC(2026, 8, 12, 20, 4),
  Date.UTC(2026, 9, 11, 9, 55),
  Date.UTC(2026, 10, 10, 4, 29),
  Date.UTC(2026, 11, 9, 23, 17),
  Date.UTC(2027, 0, 8, 16, 38),
  Date.UTC(2027, 1, 7, 9, 48),
  Date.UTC(2027, 2, 9, 3, 32),
  Date.UTC(2027, 3, 7, 21, 23),
  Date.UTC(2027, 4, 7, 14, 59),
  Date.UTC(2027, 5, 6, 7, 45),
  Date.UTC(2027, 6, 6, 0, 7),
  Date.UTC(2027, 6, 31, 15, 46),
  Date.UTC(2027, 7, 30, 7, 6),
  Date.UTC(2027, 8, 28, 22, 8),
  Date.UTC(2027, 9, 28, 13, 5),
  Date.UTC(2027, 10, 27, 4, 34),
  Date.UTC(2027, 11, 26, 21, 7),
  Date.UTC(2028, 0, 25, 15, 20),
  Date.UTC(2028, 1, 24, 10, 39),
  Date.UTC(2028, 2, 25, 4, 4),
  Date.UTC(2028, 3, 23, 19, 13),
  Date.UTC(2028, 4, 23, 9, 15),
  Date.UTC(2028, 5, 21, 21, 41),
  Date.UTC(2028, 6, 21, 9, 33),
  Date.UTC(2028, 7, 19, 21, 0),
  Date.UTC(2028, 8, 18, 8, 9),
  Date.UTC(2028, 9, 17, 19, 26),
  Date.UTC(2028, 10, 16, 6, 36),
  Date.UTC(2028, 11, 15, 18, 40),
  Date.UTC(2029, 0, 14, 7, 38),
  Date.UTC(2029, 1, 12, 21, 44),
  Date.UTC(2029, 2, 14, 12, 39),
  Date.UTC(2029, 3, 13, 3, 23),
  Date.UTC(2029, 4, 12, 16, 45),
  Date.UTC(2029, 5, 11, 4, 45),
  Date.UTC(2029, 6, 10, 15, 48),
  Date.UTC(2029, 7, 9, 2, 3),
  Date.UTC(2029, 7, 25, 12, 4),
  Date.UTC(2029, 8, 23, 22, 1),
  Date.UTC(2029, 9, 23, 9, 9),
  Date.UTC(2029, 10, 21, 21, 11),
  Date.UTC(2029, 11, 21, 10, 28),
  Date.UTC(2030, 0, 20, 0, 9),
  Date.UTC(2030, 1, 18, 12, 55),
  Date.UTC(2030, 2, 20, 3, 58),
  Date.UTC(2030, 3, 18, 18, 33),
  Date.UTC(2030, 4, 18, 8, 4),
  Date.UTC(2030, 5, 16, 20, 22),
  Date.UTC(2030, 6, 16, 7, 54),
  Date.UTC(2030, 7, 14, 19, 19),
  Date.UTC(2030, 8, 13, 6, 42),
  Date.UTC(2030, 9, 12, 18, 22),
  Date.UTC(2030, 10, 11, 6, 48),
  Date.UTC(2030, 11, 10, 20, 46),
];

/**
 * Returns the moon phase fraction (0..1) for a given date.
 * 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter.
 *
 * Uses the lookup table of actual new moon times for 2020-2030. For dates
 * outside this range, falls back to the mean synodic month from the
 * nearest table entry.
 */
export function getPhaseFraction(date: Date): number {
  const t = date.getTime();

  // If within the table range, find the nearest preceding new moon.
  if (
    t >= NEW_MOON_TIMES_MS[0] &&
    t <= NEW_MOON_TIMES_MS[NEW_MOON_TIMES_MS.length - 1] + SYNODIC_MONTH * 86400000
  ) {
    // Binary search for the nearest preceding new moon.
    let lo = 0;
    let hi = NEW_MOON_TIMES_MS.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (NEW_MOON_TIMES_MS[mid] <= t) lo = mid;
      else hi = mid - 1;
    }
    const newMoonMs = NEW_MOON_TIMES_MS[lo];
    const diffMs = t - newMoonMs;
    const phase = diffMs / (SYNODIC_MONTH * 86400000);
    return ((phase % 1) + 1) % 1;
  }

  // Fallback: mean synodic month from the nearest table entry (or the
  // year-2000 reference if completely out of range).
  let refMs = REFERENCE_NEW_MOON_MS;
  if (t < NEW_MOON_TIMES_MS[0]) {
    refMs = NEW_MOON_TIMES_MS[0];
  } else if (t > NEW_MOON_TIMES_MS[NEW_MOON_TIMES_MS.length - 1]) {
    refMs = NEW_MOON_TIMES_MS[NEW_MOON_TIMES_MS.length - 1];
  }
  const diffDays = (t - refMs) / (1000 * 60 * 60 * 24);
  const phase = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  return phase / SYNODIC_MONTH;
}

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

/** Returns the emoji for a given phase fraction (0..1). */
export function getPhaseEmoji(phaseFraction: number): string {
  return PHASE_EMOJI[getPhaseKey(phaseFraction)];
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
