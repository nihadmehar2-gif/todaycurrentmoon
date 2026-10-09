/**
 * Central site configuration.
 *
 * Production domain for Moon Phase Emoji. All canonical URLs, Open Graph
 * URLs, sitemap entries, robots.txt, and JSON-LD structured data must use
 * this single constant so the site always points canonicals at itself.
 */
export const SITE_URL = "https://moonphaseemoji.com";

/** Site name used in metadata and structured data. */
export const SITE_NAME = "Moon Phase Emoji";

/** Default author for content and structured data. */
export const SITE_AUTHOR = "Adam Jonah";

/** Contact email shown on the site. */
export const SITE_EMAIL = "nihadmehar2@gmail.com";

/**
 * Legitimate scientific sources cited for lunar data. These are kept as
 * trusted external references; no marketing, template, or competitor
 * links belong here.
 */
export const SCIENTIFIC_SOURCES = [
  {
    label: "NASA Science: Moon",
    href: "https://science.nasa.gov/moon/",
    note: "NASA facts on the Moon, its phases, and its orbit around Earth.",
  },
  {
    label: "USNO Moon Phase Data",
    href: "https://aa.usno.navy.mil/data/MoonPhase",
    note: "Official moon phase tables used to check our lunar math.",
  },
  {
    label: "Time and Date: Moon Phases",
    href: "https://www.timeanddate.com/moon/phases/",
    note: "A trusted reference for moon phase dates around the world.",
  },
] as const;
