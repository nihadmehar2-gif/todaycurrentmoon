import type { ComponentType } from "react";

/**
 * Site navigation configuration for real Next.js App Router pages.
 * Each route maps to a real URL path (no hash fragments).
 */

export interface RouteDef {
  /** Real URL path, e.g. "/moon-phases". */
  path: string;
  /** Nav label. */
  label: string;
  /** Unique SEO title for the page. */
  title: string;
  /** Unique meta description for the page. */
  description: string;
}

export const ROUTES: RouteDef[] = [
  {
    path: "/",
    label: "Home",
    title: "Current Phase of the Moon Emoji | Moon Phase Today",
    description:
      "See the current phase of the moon emoji for today with the exact moon phase, illumination, lunar age, and cycle progress. Live moon data, a moon calendar, and easy moon calculators.",
  },
  {
    path: "/moon-phases",
    label: "Moon Phases",
    title: "Moon Phases Explained: All 8 Lunar Phases with Emoji | Today Current Moon",
    description:
      "A clear, visual guide to all eight moon phases. See what each phase looks like, when it happens in the 29.5-day lunar cycle, the matching moon emoji, and what every phase means.",
  },
  {
    path: "/moon-calendar",
    label: "Moon Calendar",
    title: "Moon Calendar 2026: Monthly Moon Phase Calendar | Today Current Moon",
    description:
      "Free interactive moon calendar showing the moon phase for every day of any month. See full moon dates, new moon dates, and all eight lunar phases at a glance.",
  },
  {
    path: "/moon-calculator",
    label: "Moon Calculator",
    title: "Moon Phase Calculator: Find the Moon for Any Date | Today Current Moon",
    description:
      "Free moon phase calculator. Find the moon phase for any date, check the next full moon, see the Moon on your birthday, and track lunar cycle progress with easy tools.",
  },
  {
    path: "/about",
    label: "About Us",
    title: "About Us | Today Current Moon",
    description:
      "Learn about Today Current Moon and the content specialist behind it, Nihad Mehar, focused on clear content and checked lunar data.",
  },
  {
    path: "/contact",
    label: "Contact Us",
    title: "Contact Us | Today Current Moon",
    description:
      "Send a message or email us at nihadmehar2@gmail.com. We read every note and reply to every reader.",
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    title: "Privacy Policy | Today Current Moon",
    description:
      "Our privacy policy in plain words. We do not use analytics, ads, or tracking. We only store what you send through the contact form.",
  },
  {
    path: "/terms",
    label: "Terms of Use",
    title: "Terms of Use | Today Current Moon",
    description:
      "Clear, fair rules for using Today Current Moon and its free moon tools.",
  },
];

/** Look up a route definition by its path. */
export function getRoute(path: string): RouteDef | undefined {
  return ROUTES.find((r) => r.path === path);
}
