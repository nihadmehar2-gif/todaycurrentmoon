"use client";

import { useCallback, useSyncExternalStore } from "react";

export type RouteKey =
  | "home"
  | "moon-phases"
  | "moon-calendar"
  | "moon-calculators"
  | "about"
  | "contact"
  | "privacy"
  | "terms";

export const ROUTES: Array<{ key: RouteKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "moon-phases", label: "Moon Phases" },
  { key: "moon-calendar", label: "Moon Calendar" },
  { key: "moon-calculators", label: "Moon Calculators" },
  { key: "about", label: "About Us" },
  { key: "contact", label: "Contact Us" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "terms", label: "Terms of Use" },
];

const VALID_KEYS = new Set(ROUTES.map((r) => r.key));

function parseHash(): RouteKey {
  if (typeof window === "undefined") return "home";
  const raw = window.location.hash.replace(/^#\/?/, "").trim();
  return VALID_KEYS.has(raw as RouteKey) ? (raw as RouteKey) : "home";
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getSnapshot(): RouteKey {
  return parseHash();
}

function getServerSnapshot(): RouteKey {
  return "home";
}

/**
 * Hash-based client router built on useSyncExternalStore. Keeps every
 * view on the single `/` route while feeling like separate pages.
 */
export function useHashRoute() {
  const route = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const navigate = useCallback((key: RouteKey) => {
    if (typeof window === "undefined") return;
    const target = key === "home" ? "#/" : `#/${key}`;
    if (window.location.hash === target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = target;
  }, []);

  return { route, navigate };
}

/** Returns a href string for a route key (used for shareable links). */
export function routeHref(key: RouteKey): string {
  return key === "home" ? "#/" : `#/${key}`;
}
