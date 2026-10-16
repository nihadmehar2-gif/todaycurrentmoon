"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { MoonCalendar } from "@/components/site/moon-calendar";
import { SectionHeading } from "@/components/site/section";
import { useMounted } from "@/components/site/use-mounted";
import { getMoonPhase, PHASE_CATALOG, SYNODIC_MONTH } from "@/lib/moon";

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
      "A free interactive moon calendar that shows the moon phase for every day of any month, including full moon dates and new moon dates.",
  };

  return (
    <PageShell
      title="Moon Calendar: Every Phase, Every Day"
      breadcrumb="Moon Calendar"
      path="/moon-calendar"
      description={`Browse any month and see the moon phase for each day. This lunar calendar shows all eight phases, including full moon and new moon dates, using the ${SYNODIC_MONTH.toFixed(2)}-day synodic cycle.`}
      jsonLd={jsonLd}
    >
      {/* Introduction — what the calendar shows */}
      <section className="space-y-4">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-white">
            How this moon calendar works
          </h2>
          <p className="text-slate-300/80 leading-relaxed mt-2">
            This monthly moon phase calendar shows the lunar phase for every
            day of any month. Each day cell displays the moon emoji and the
            percentage of the Moon&apos;s disk that is lit. The phases are
            calculated from the actual positions of the Sun, Earth, and Moon
            using the {SYNODIC_MONTH.toFixed(2)}-day synodic month, so the
            full moon dates and new moon dates match what you see in the sky.
          </p>
          <p className="text-slate-300/80 leading-relaxed mt-2">
            The Moon does not make its own light. It shines because sunlight
            reflects off its surface. As the Moon orbits Earth, we see a
            different share of its lit side each night, which creates the eight
            phases. These phases are not caused by Earth&apos;s shadow — that
            only happens during a lunar eclipse, which is rare and separate
            from the normal lunar cycle.
          </p>
        </Reveal>
      </section>

      {/* The interactive calendar */}
      <Reveal>
        <MoonCalendar />
      </Reveal>

      {/* How to use the calendar */}
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
              d: "Tap the arrows to go back or forward. The moon phase updates for each day you view, so you can check any past or future month.",
            },
            {
              t: "Jump to today",
              d: "Press the Today button to return to the current month with today marked by a soft ring.",
            },
            {
              t: "Plan ahead",
              d: "Spot full and new moons at a glance so you can plan events, photos, or nights out around the lunar cycle.",
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

      {/* Key moon dates this month */}
      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="This month at a glance"
          title="Key moon dates to know"
          description="A quick look at the next occurrence of each phase and what it means for the month ahead."
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

      {/* Educational content about the lunar cycle */}
      <Reveal>
        <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Understanding the lunar calendar
          </h2>
          <p className="text-slate-300/80 leading-relaxed mb-3">
            The lunar cycle lasts about {SYNODIC_MONTH.toFixed(2)} days from
            one new moon to the next. This period is called the synodic month.
            Because it is not a whole number, the moon phases drift across the
            calendar from month to month. That is why a full moon can fall on
            any date of the month, and why the calendar looks different each
            month.
          </p>
          <p className="text-slate-300/80 leading-relaxed mb-3">
            The calendar shows the phase for each day based on the Moon&apos;s
            position in its orbit. The phase name and emoji tell you what
            shape the Moon appears from Earth. The percentage shows how much
            of the Moon&apos;s near side is lit by the Sun. This is general
            phase information — it does not include moonrise or moonset times,
            which depend on your location.
          </p>
          <p className="text-slate-300/80 leading-relaxed">
            A common question is whether moon phases are caused by
            Earth&apos;s shadow falling on the Moon. They are not. The phases
            happen because we see different amounts of the Moon&apos;s lit
            side as it orbits Earth. Earth&apos;s shadow only reaches the Moon
            during a lunar eclipse, which is a separate and much rarer event.
          </p>
        </Card>
      </Reveal>

      {/* Related tools — contextual internal links */}
      <Reveal>
        <Card className="glass rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-white mb-4">
            Keep exploring the Moon
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/moon-phases"
              className="group glass rounded-2xl p-4 border-white/10 hover:border-indigo-300/30 transition-colors"
            >
              <div className="text-2xl mb-1" aria-hidden>
                {"\u{1F312}"}
              </div>
              <div className="font-display text-base font-semibold text-white">
                Moon Phases Guide
              </div>
              <p className="text-sm text-slate-300/70 mt-1">
                Learn what each of the eight moon phases looks like and means.
              </p>
            </Link>
            <Link
              href="/moon-calculator"
              className="group glass rounded-2xl p-4 border-white/10 hover:border-indigo-300/30 transition-colors"
            >
              <div className="text-2xl mb-1" aria-hidden>
                {"\u{1F4C5}"}
              </div>
              <div className="font-display text-base font-semibold text-white">
                Moon Calculator
              </div>
              <p className="text-sm text-slate-300/70 mt-1">
                Find the moon phase for any past or future date.
              </p>
            </Link>
            <Link
              href="/"
              className="group glass rounded-2xl p-4 border-white/10 hover:border-indigo-300/30 transition-colors"
            >
              <div className="text-2xl mb-1" aria-hidden>
                {"\u{1F315}"}
              </div>
              <div className="font-display text-base font-semibold text-white">
                Tonight&apos;s Moon
              </div>
              <p className="text-sm text-slate-300/70 mt-1">
                See the current moon phase, emoji, and live data.
              </p>
            </Link>
          </div>
        </Card>
      </Reveal>
    </PageShell>
  );
}
