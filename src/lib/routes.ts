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
    title: "Moon Phases: All Eight, Explained Simply | Today Current Moon",
    description:
      "A clear guide to all eight moon phases, what each one looks like, when it happens, and what it means.",
  },
  {
    path: "/moon-calendar",
    label: "Moon Calendar",
    title: "Moon Calendar: Every Phase, Every Day | Today Current Moon",
    description:
      "Browse any month and see the moon phase for each day. A free, interactive moon calendar with one emoji per day.",
  },
  {
    path: "/moon-calculator",
    label: "Moon Calculator",
    title: "Moon Calculator: Free Tools for Every Lunar Question | Today Current Moon",
    description:
      "Find the moon phase for any date, check the next full moon, or see the Moon on your birthday with a free moon calculator.",
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
