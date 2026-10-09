"use client";

import { Card } from "@/components/ui/card";
import { MoonVisual } from "@/components/site/moon-visual";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { PHASE_CATALOG, SYNODIC_MONTH } from "@/lib/moon";

const PHASE_DETAILS: Record<
  string,
  { when: string; look: string; meaning: string }
> = {
  new: {
    when: "Day 0 of the cycle",
    look: "The Moon is invisible to the eye. Its lit side faces the Sun, away from us.",
    meaning:
      "A clean start. Many people set a goal or begin a new habit at the new moon.",
  },
  "waxing-crescent": {
    when: "Days 1 to 7",
    look: "A thin sliver of light on the right side grows a little each night.",
    meaning:
      "First steps and hope. A good time to act on the goals you set at the new moon.",
  },
  "first-quarter": {
    when: "Around day 7",
    look: "Half the disk is lit. It rises near midday and sets near midnight.",
    meaning:
      "A push to keep going. Review your progress and move past early blocks.",
  },
  "waxing-gibbous": {
    when: "Days 8 to 14",
    look: "More than half is lit, and the bright part keeps growing toward full.",
    meaning:
      "Steady growth and focus. Refine your work as the full moon gets close.",
  },
  full: {
    when: "Around day 15",
    look: "The whole near side is lit. The Moon rises at sunset and stays up all night.",
    meaning:
      "A peak of light. Full moons have shaped tides, calendars, and rites for ages.",
  },
  "waning-gibbous": {
    when: "Days 16 to 21",
    look: "The lit part begins to shrink. The Moon rises later each night.",
    meaning:
      "Thanks and release. Reflect on what went well and let go of stress.",
  },
  "last-quarter": {
    when: "Around day 22",
    look: "Half the disk is lit, but now on the left side. It rises near midnight.",
    meaning:
      "Letting go. Drop what no longer helps you as the cycle winds down.",
  },
  "waning-crescent": {
    when: "Days 23 to 29",
    look: "A thin sliver remains before the Moon goes dark for the new moon.",
    meaning:
      "Rest and reset. Slow down and prepare for a fresh start.",
  },
};

export function MoonPhasesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PHASE_CATALOG.map((p) => ({
      "@type": "Question",
      name: `What is the ${p.name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: p.short,
      },
    })),
  };

  return (
    <PageShell
      title="Moon Phases: All Eight, Explained Simply"
      breadcrumb="Moon Phases"
      description={`The Moon moves through eight phases in a cycle that lasts about ${SYNODIC_MONTH.toFixed(
        2,
      )} days. Here is each phase, what it looks like, and what it means.`}
      jsonLd={jsonLd}
    >
      <section className="space-y-4">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-white">
            A quick tour of the cycle
          </h2>
          <p className="text-slate-300/80 leading-relaxed mt-2">
            The cycle starts in darkness at the new moon. Light grows on the
            right side through crescent, first quarter, and gibbous, until the
            full moon lights the whole disk. Then the light shrinks back through
            gibbous, last quarter, and crescent to the next new moon. The same
            eight shapes repeat, cycle after cycle.
          </p>
        </Reveal>
      </section>

      <section className="space-y-5">
        {PHASE_CATALOG.map((phase, i) => {
          const detail = PHASE_DETAILS[phase.key];
          return (
            <Reveal key={phase.key} delay={i * 0.04}>
              <Card
                id={phase.key}
                className="glass scroll-mt-28 rounded-2xl border-white/10 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <MoonVisual phase={phase.demoFraction} size={120} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl" aria-hidden>
                        {phase.emoji}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-white">
                        {phase.name}
                      </h3>
                    </div>
                    <p className="text-xs text-indigo-200/60 mb-3">
                      {detail.when}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-indigo-300/80 mb-1">
                          What you see
                        </div>
                        <p className="text-sm text-slate-300/80 leading-relaxed">
                          {detail.look}
                        </p>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-indigo-300/80 mb-1">
                          What it means
                        </div>
                        <p className="text-sm text-slate-300/80 leading-relaxed">
                          {detail.meaning}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </section>

      <Reveal>
        <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            A note on the cycle length
          </h2>
          <p className="text-slate-300/80 leading-relaxed">
            The lunar cycle is about 29.53 days from one new moon to the next.
            This is called the synodic month. Because it is not a whole number,
            the moon phases drift across the calendar from month to month. That
            is why a full moon can fall on any date of the month. Our tool tracks
            this drift for you, so the phase and emoji stay correct every day.
          </p>
        </Card>
      </Reveal>
    </PageShell>
  );
}
