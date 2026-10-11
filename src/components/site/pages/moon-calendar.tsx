"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { MoonCalendar } from "@/components/site/moon-calendar";
import { SectionHeading } from "@/components/site/section";
import { useMounted } from "@/components/site/use-mounted";
import { getMoonPhase, PHASE_CATALOG } from "@/lib/moon";

export function MoonCalendarPage() {
  const mounted = useMounted();

  // Precompute the next occurrence of each phase within ~31 days.
  // Only computed on the client to keep SSR output stable.
  const phaseDates = useMemo(() => {
    const map = new Map<string, Date>();
    if (!mounted) return map;
    const now = new Date();
    for (const p of PHASE_CATALOG) {
      for (let i = 0; i < 31; i++) {
        const d = new Date(now.getTime() + i * 86400000);
        if (getMoonPhase(d).key === p.key) {
          map.set(p.key, d);
          break;
        }
      }
    }
    return map;
  }, [mounted]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Moon Phase Calendar",
    applicationCategory: "AstronomyApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "A free interactive moon calendar that shows the moon phase for every day of any month.",
  };

  return (
    <PageShell
      title="Moon Calendar: Every Phase, Every Day"
      breadcrumb="Moon Calendar"
      path="/moon-calendar"
      description="Browse any month and see the moon phase for each day. Use the arrows to move between months, or jump back to today with one tap."
      jsonLd={jsonLd}
    >
      <Reveal>
        <MoonCalendar />
      </Reveal>

      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="How to use it"
          title="Read your moon calendar"
          description="The calendar shows one moon emoji per day. Today has a soft ring around it."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Move between months",
              d: "Tap the arrows to go back or forward. The moon phase updates for each day you view.",
            },
            {
              t: "Jump to today",
              d: "Press the Today button to return to the current month with today marked.",
            },
            {
              t: "Plan ahead",
              d: "Spot full and new moons at a glance so you can plan events, photos, or nights out.",
            },
          ].map((c) => (
            <Card key={c.t} className="glass p-5 rounded-2xl border-white/10">
              <h3 className="font-display text-base font-semibold text-white mb-1.5">
                {c.t}
              </h3>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                {c.d}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="This month at a glance"
          title="Key moon dates to know"
          description="A quick look at the main phases and what they mean for the month ahead."
        />
        <Reveal>
          <Card className="glass rounded-2xl border-white/10 overflow-hidden">
            <div className="divide-y divide-white/5">
              {PHASE_CATALOG.map((p) => {
                const match = phaseDates.get(p.key);
                return (
                  <div
                    key={p.key}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    <span className="text-2xl shrink-0" aria-hidden>
                      {p.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white">
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-400/70">
                        {p.short}
                      </div>
                    </div>
                    {match && (
                      <div className="text-right shrink-0">
                        <div className="text-sm text-white tabular-nums">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                          }).format(match)}
                        </div>
                        <div className="text-[10px] text-indigo-200/60">
                          Next up
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </Reveal>
      </section>
    </PageShell>
  );
}
