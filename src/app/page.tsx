"use client";

import { useEffect } from "react";
import { CosmicBg } from "@/components/site/cosmic-bg";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { useHashRoute, type RouteKey } from "@/components/site/use-route";
import { HomePage } from "@/components/site/pages/home";
import { MoonPhasesPage } from "@/components/site/pages/moon-phases";
import { MoonCalendarPage } from "@/components/site/pages/moon-calendar";
import { MoonCalculatorsPage } from "@/components/site/pages/moon-calculators";
import { AboutPage } from "@/components/site/pages/about";
import { ContactPage } from "@/components/site/pages/contact";
import { PrivacyPage } from "@/components/site/pages/privacy";
import { TermsPage } from "@/components/site/pages/terms";

const ROUTE_META: Record<RouteKey, { title: string; description: string }> = {
  home: {
    title: "Current Phase of the Moon Emoji | Moon Phase Today",
    description:
      "See the current phase of the moon emoji for today with the exact moon phase, illumination, lunar age, and cycle progress. Live moon data, a moon calendar, and easy moon calculators.",
  },
  "moon-phases": {
    title: "Moon Phases: All Eight, Explained Simply | Moon Phase Emoji",
    description:
      "A clear guide to all eight moon phases, what each one looks like, when it happens, and what it means.",
  },
  "moon-calendar": {
    title: "Moon Calendar: Every Phase, Every Day | Moon Phase Emoji",
    description:
      "Browse any month and see the moon phase for each day. A free, interactive moon calendar with one emoji per day.",
  },
  "moon-calculators": {
    title: "Moon Calculators: Free Tools for Every Lunar Question | Moon Phase Emoji",
    description:
      "Find the moon phase for any date, check the next full moon, or see the Moon on your birthday with free moon calculators.",
  },
  about: {
    title: "About Us | Moon Phase Emoji",
    description:
      "Learn about Moon Phase Emoji and the content specialist behind it, Adam Jonah, focused on clear content and checked lunar data.",
  },
  contact: {
    title: "Contact Us | Moon Phase Emoji",
    description:
      "Send a message or email us at nihadmehar2@gmail.com. We read every note and reply to every reader.",
  },
  privacy: {
    title: "Privacy Policy | Moon Phase Emoji",
    description:
      "Our privacy policy in plain words. We do not use analytics, ads, or tracking. We only store what you send through the contact form.",
  },
  terms: {
    title: "Terms of Use | Moon Phase Emoji",
    description:
      "Clear, fair rules for using Moon Phase Emoji and its free moon tools.",
  },
};

function RouteView({ route }: { route: RouteKey }) {
  switch (route) {
    case "home":
      return <HomePage />;
    case "moon-phases":
      return <MoonPhasesPage />;
    case "moon-calendar":
      return <MoonCalendarPage />;
    case "moon-calculators":
      return <MoonCalculatorsPage />;
    case "about":
      return <AboutPage />;
    case "contact":
      return <ContactPage />;
    case "privacy":
      return <PrivacyPage />;
    case "terms":
      return <TermsPage />;
    default:
      return <HomePage />;
  }
}

export default function Home() {
  const { route } = useHashRoute();
  const meta = ROUTE_META[route];

  // Keep the document title and meta description in sync with the view.
  useEffect(() => {
    document.title = meta.title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute("content", meta.description);
  }, [meta]);

  // Scroll to top when the route changes for a page-like feel.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBg />
      <Navbar />
      <main className="flex-1">
        <RouteView route={route} />
      </main>
      <Footer />
    </div>
  );
}
