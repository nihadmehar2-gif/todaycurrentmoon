import type { PhaseKey } from "@/lib/moon";
import { SCIENTIFIC_SOURCES } from "@/lib/site";

export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQS: FaqItem[] = [
  {
    q: "What is the current phase of the moon emoji?",
    a: "The current phase of the moon emoji is the moon emoji that matches the real Moon right now. Our tool checks the date and time, works out the true lunar phase, and shows the right emoji. If the Moon is full today, you will see the full moon emoji. If it is a thin crescent, you will see the crescent emoji.",
  },
  {
    q: "How is the moon phase calculated?",
    a: "We use the length of the lunar cycle, about 29.53 days, and a known new moon date. The tool counts the days since that reference new moon and finds where today falls in the cycle. This gives the phase name, the lit fraction, and the moon emoji for your local time.",
  },
  {
    q: "Why does the moon emoji change each day?",
    a: "The Moon moves around Earth, so the Sun lights a different part of its near side each day. As the lit part grows, we move through new, crescent, quarter, and full. As it shrinks, we go back through gibbous, quarter, and crescent to new again.",
  },
  {
    q: "Is the moon data shown for my location?",
    a: "Yes. The tool uses your device time zone by default, so the phase and times match your area. You can also let your browser share your exact spot, or pick a time zone from the list. The moon phase is the same everywhere on Earth, but your local date and time can change the day it falls on.",
  },
  {
    q: "How accurate is the moon phase here?",
    a: "The phase name and emoji are accurate for the date shown. The lit fraction is based on the average lunar cycle, which is very close to the real, slightly changing cycle. For most uses, the result matches what you will see in the sky.",
  },
  {
    q: "Do I need to install anything to use this?",
    a: "No. The tool runs in your browser. Just open the page and the current moon phase, emoji, and details load at once. No app, sign up, or download is needed.",
  },
];

export interface EmojiMeaning {
  emoji: string;
  phase: PhaseKey;
  name: string;
  meaning: string;
}

export const EMOJI_MEANINGS: EmojiMeaning[] = [
  {
    emoji: "\u{1F311}",
    phase: "new",
    name: "New Moon",
    meaning:
      "Stands for a fresh start. People link it with new goals, quiet focus, and a clean slate.",
  },
  {
    emoji: "\u{1F312}",
    phase: "waxing-crescent",
    name: "Waxing Crescent",
    meaning:
      "Stands for the first steps. A sliver of light means hope and small wins after a new start.",
  },
  {
    emoji: "\u{1F313}",
    phase: "first-quarter",
    name: "First Quarter",
    meaning:
      "Stands for action and choice. Half lit means it is time to push past early blocks.",
  },
  {
    emoji: "\u{1F314}",
    phase: "waxing-gibbous",
    name: "Waxing Gibbous",
    meaning:
      "Stands for steady growth. The Moon is almost full, so keep going and refine your work.",
  },
  {
    emoji: "\u{1F315}",
    phase: "full",
    name: "Full Moon",
    meaning:
      "Stands for peak energy and clarity. Full moons have guided calendars, tides, and rites for ages.",
  },
  {
    emoji: "\u{1F316}",
    phase: "waning-gibbous",
    name: "Waning Gibbous",
    meaning:
      "Stands for thanks and release. The light starts to fade, so it is a good time to reflect.",
  },
  {
    emoji: "\u{1F317}",
    phase: "last-quarter",
    name: "Last Quarter",
    meaning:
      "Stands for letting go. Half lit on the other side means it is time to drop what holds you back.",
  },
  {
    emoji: "\u{1F318}",
    phase: "waning-crescent",
    name: "Waning Crescent",
    meaning:
      "Stands for rest and reset. A thin sliver before the dark means slow down and prepare for a new cycle.",
  },
];

export type SourceLink = (typeof SCIENTIFIC_SOURCES)[number];

export const SOURCES: SourceLink[] = [...SCIENTIFIC_SOURCES];

export interface CalculatorTool {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  points: string[];
}

export const CALCULATOR_TOOLS: CalculatorTool[] = [
  {
    id: "phase-by-date",
    name: "Moon Phase by Date",
    emoji: "\u{1F4C5}",
    blurb:
      "Pick any past or future date and see the exact moon phase, emoji, and lit fraction for that day.",
    points: [
      "Works for any date from 1900 to 2100",
      "Shows phase name, emoji, and illumination",
      "Great for birthdays, events, and history",
    ],
  },
  {
    id: "next-full-moon",
    name: "Next Full Moon Finder",
    emoji: "\u{1F315}",
    blurb:
      "Find the date of the next full moon from any starting point, plus the new moon that follows it.",
    points: [
      "Exact date of the next full moon",
      "Next new moon shown too",
      "Adjusted for your time zone",
    ],
  },
  {
    id: "birthday-moon",
    name: "Birthday Moon",
    emoji: "\u{1F389}",
    blurb:
      "Enter your birth date to learn what the Moon looked like the day you were born.",
    points: [
      "The moon phase on your birth date",
      "The matching moon emoji",
      "A fun fact to share with friends",
    ],
  },
  {
    id: "illumination",
    name: "Moon Illumination Checker",
    emoji: "\u{1F4A1}",
    blurb:
      "See how much of the Moon is lit right now or on any date, shown as a clear percent.",
    points: [
      "Live illumination percent",
      "Waxing or waning status",
      "Lunar age in days",
    ],
  },
  {
    id: "cycle-progress",
    name: "Cycle Progress Tracker",
    emoji: "\u{1F504}",
    blurb:
      "Track how far the Moon is through its 29.5 day cycle, with a clear progress readout.",
    points: [
      "Percent of the cycle done",
      "Days since the last new moon",
      "Days until the next new moon",
    ],
  },
  {
    id: "moon-calendar",
    name: "Moon Calendar",
    emoji: "\u{1F5D3}\u{FE0F}",
    blurb:
      "Browse a full month of moon phases at a glance, with an emoji for each day.",
    points: [
      "Any month, past or future",
      "One emoji per day",
      "Today is clearly marked",
    ],
  },
];
