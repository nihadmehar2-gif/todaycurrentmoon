"use client";

import { Mail, MoonStar } from "lucide-react";
import {
  type RouteKey,
  ROUTES,
  routeHref,
  useHashRoute,
} from "@/components/site/use-route";
import { useMounted } from "@/components/site/use-mounted";
import { SCIENTIFIC_SOURCES, SITE_EMAIL } from "@/lib/site";

export function Footer() {
  const { navigate } = useHashRoute();
  const mounted = useMounted();
  const go = (key: RouteKey) => navigate(key);

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#04060f]/70 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-sky-500/30 ring-1 ring-white/15">
                <MoonStar className="w-5 h-5 text-indigo-100" />
              </span>
              <span className="font-display text-lg font-semibold text-gradient">
                Moon Phase Emoji
              </span>
            </div>
            <p className="text-sm text-slate-300/70 leading-relaxed">
              Live lunar data and the exact current phase of the moon emoji,
              updated in real time for your location.
            </p>
          </div>

          {/* Pages */}
          <nav aria-label="Site pages" className="md:col-span-1">
            <h2 className="eyebrow mb-3">Explore</h2>
            <ul className="space-y-2">
              {ROUTES.map((r) => (
                <li key={r.key}>
                  <a
                    href={routeHref(r.key)}
                    onClick={(e) => {
                      e.preventDefault();
                      go(r.key);
                    }}
                    className="text-sm text-slate-300/70 hover:text-white transition-colors"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sources */}
          <div className="md:col-span-1">
            <h2 className="eyebrow mb-3">Sources</h2>
            <ul className="space-y-2">
              {SCIENTIFIC_SOURCES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-300/70 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h2 className="eyebrow mb-3">Contact</h2>
            <p className="text-sm text-slate-300/70 mb-3">
              We reply to every reader who writes in.
            </p>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-indigo-100 hover:text-white transition-colors break-all"
            >
              <Mail className="w-4 h-4 shrink-0 text-indigo-300" />
              {SITE_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400/70">
          <p>
            &copy; {mounted ? new Date().getFullYear() : ""} Moon Phase Emoji.
            Built by Adam Jonah.
          </p>
          <p className="flex items-center gap-3">
            <a
              href={routeHref("privacy")}
              onClick={(e) => {
                e.preventDefault();
                go("privacy");
              }}
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>
            <span aria-hidden className="opacity-40">
              &middot;
            </span>
            <a
              href={routeHref("terms")}
              onClick={(e) => {
                e.preventDefault();
                go("terms");
              }}
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
