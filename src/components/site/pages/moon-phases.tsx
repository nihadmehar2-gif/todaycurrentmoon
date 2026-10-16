"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MoonVisual } from "@/components/site/moon-visual";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { PHASE_CATALOG, SYNODIC_MONTH } from "@/lib/moon";

interface PhaseDetail {
  when: string;
  look: string;
  meaning: string;
  alt: string;
}

const PHASE_DETAILS: Record<string, PhaseDetail> = {
  new: {
    when: "Day 0 of the lunar cycle",
    look: "The Moon is hidden from view. Its lit side faces the Sun, away from Earth, so the side we see is dark.",
    meaning:
      "A fresh start. Many people set a goal or begin a new habit at the new moon.",
    alt: "New Moon shown as a dark disk with no visible lit area",
  },
  "waxing-crescent": {
    when: "Days 1 to 7 of the cycle",
    look: "A thin sliver of light grows on the right side (in the Northern Hemisphere). Each night the lit part gets a little wider.",
    meaning:
      "First steps and hope. A good time to act on the goals you set at the new moon.",
    alt: "Waxing Crescent Moon with a thin lit sliver on the right side",
  },
  "first-quarter": {
    when: "Around day 7 of the cycle",
    look: "Half the disk is lit on the right side. It rises near midday and sets near midnight, so it is easy to see in the evening.",
    meaning:
      "A push to keep going. Review your progress and move past early blocks.",
    alt: "First Quarter Moon with the right half lit and left half dark",
  },
  "waxing-gibbous": {
    when: "Days 8 to 14 of the cycle",
    look: "More than half is lit, and the bright part keeps growing toward full. The Moon stays up longer each night.",
    meaning:
      "Steady growth and focus. Refine your work as the full moon gets close.",
    alt: "Waxing Gibbous Moon with most of the disk lit and a dark sliver on the left",
  },
  full: {
    when: "Around day 15 of the cycle",
    look: "The whole near side is lit. The Moon rises at sunset and stays up all night, so it is the brightest phase of all.",
    meaning:
      "A peak of light. Full moons have shaped tides, calendars, and rites for ages.",
    alt: "Full Moon shown as a fully lit bright disk",
  },
  "waning-gibbous": {
    when: "Days 16 to 21 of the cycle",
    look: "The lit part begins to shrink. The Moon rises later each night after the full moon.",
    meaning:
      "Thanks and release. Reflect on what went well and let go of stress.",
    alt: "Waning Gibbous Moon with most of the disk lit and a dark sliver on the right",
  },
  "last-quarter": {
    when: "Around day 22 of the cycle",
    look: "Half the disk is lit, but now on the left side. It rises near midnight and is visible in the morning sky.",
    meaning:
      "Letting go. Drop what no longer helps you as the cycle winds down.",
    alt: "Third Quarter (Last Quarter) Moon with the left half lit and right half dark",
  },
  "waning-crescent": {
    when: "Days 23 to 29 of the cycle",
    look: "A thin sliver of light remains on the left side before the Moon goes dark for the next new moon.",
    meaning:
      "Rest and reset. Slow down and prepare for a fresh start.",
    alt: "Waning Crescent Moon with a thin lit sliver on the left side",
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
      title="Moon Phases Explained: All 8 Lunar Phases"
      breadcrumb="Moon Phases"
      path="/moon-phases"
      description={`The Moon moves through eight phases in a lunar cycle that lasts about ${SYNODIC_MONTH.toFixed(
        2,
      )} days. Learn what each phase looks like, why the Moon changes shape, and the names of all eight moon phases.`}
      jsonLd={jsonLd}
    >
      {/* Introduction — what moon phases are */}
      <section className="space-y-4">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-white">
            What are moon phases?
          </h2>
          <p className="text-slate-300/80 leading-relaxed mt-2">
            Moon phases are the changing shapes of the lit part of the Moon we
            see from Earth. The Moon makes no light of its own. It only shines
            because sunlight reflects off its surface. As the Moon travels
            around Earth, we see a different share of its lit side each night.
            That share grows from a thin sliver to a full disk, then shrinks
            back to nothing, in a pattern that repeats every lunar cycle.
          </p>
        </Reveal>
      </section>

      {/* Why the Moon changes shape — the astronomy */}
      <Reveal>
        <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Why the Moon appears to change shape
          </h2>
          <p className="text-slate-300/80 leading-relaxed mb-3">
            The shape changes because of the positions of the Sun, Earth, and
            Moon. The Sun always lights exactly half of the Moon. How much of
            that lit half faces us depends on where the Moon sits in its orbit.
          </p>
          <p className="text-slate-300/80 leading-relaxed mb-3">
            When the Moon is between Earth and the Sun, its lit side faces away
            from us, so we see a new moon. When the Moon is on the far side of
            Earth from the Sun, its lit side faces us fully, so we see a full
            moon. At the points in between, we see part of the lit side and
            part of the dark side, which makes the crescent, quarter, and
            gibbous shapes.
          </p>
          <p className="text-slate-300/80 leading-relaxed">
            A common myth is that moon phases are caused by Earth&apos;s shadow
            falling on the Moon. That is not true. Earth&apos;s shadow only
            reaches the Moon during a lunar eclipse, which is rare and separate
            from the normal lunar cycle.
          </p>
        </Card>
      </Reveal>

      {/* Waxing vs waning + crescent vs gibbous */}
      <Reveal>
        <Card className="glass rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-4">
            Waxing, waning, crescent, and gibbous
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-base font-semibold text-indigo-200 mb-1">
                Waxing vs waning
              </h3>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                <strong className="text-white">Waxing</strong> means the lit
                part is growing, from new moon to full moon.{" "}
                <strong className="text-white">Waning</strong> means the lit
                part is shrinking, from full moon back to new moon. In the
                Northern Hemisphere, waxing phases are lit on the right and
                waning phases are lit on the left.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-indigo-200 mb-1">
                Crescent vs gibbous
              </h3>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                A <strong className="text-white">crescent</strong> is less than
                half lit, so it looks like a thin curve. A{" "}
                <strong className="text-white">gibbous</strong> is more than
                half lit, so it looks like a fat oval. The quarter phases are
                exactly half lit and half dark.
              </p>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* Quick tour of the cycle */}
      <section className="space-y-4">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-white">
            The lunar cycle at a glance
          </h2>
          <p className="text-slate-300/80 leading-relaxed mt-2">
            The cycle starts in darkness at the new moon. Light grows on the
            right side through waxing crescent, first quarter, and waxing
            gibbous, until the full moon lights the whole disk. Then the light
            shrinks back through waning gibbous, third quarter, and waning
            crescent to the next new moon. The same eight phases repeat, cycle
            after cycle.
          </p>
        </Reveal>
      </section>

      {/* All eight phases in order */}
      <section className="space-y-5">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-white">
            The eight phases of the Moon
          </h2>
          <p className="text-slate-300/80 leading-relaxed mt-2">
            Below are all eight moon phases in their correct astronomical order,
            with the name of each phase, what it looks like, when it happens in
            the cycle, and the matching moon emoji.
          </p>
        </Reveal>
        {PHASE_CATALOG.map((phase, i) => {
          const detail = PHASE_DETAILS[phase.key];
          const phaseNumber = i + 1;
          return (
            <Reveal key={phase.key} delay={i * 0.04}>
              <Card
                id={phase.key}
                className="glass scroll-mt-28 rounded-2xl border-white/10 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <MoonVisual
                      phase={phase.demoFraction}
                      size={120}
                      copyable={false}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-indigo-300/70 tabular-nums">
                        {String(phaseNumber).padStart(2, "0")}
                      </span>
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

      {/* Cycle length explanation */}
      <Reveal>
        <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            How long the lunar cycle lasts
          </h2>
          <p className="text-slate-300/80 leading-relaxed">
            The lunar cycle lasts about {SYNODIC_MONTH.toFixed(2)} days from one
            new moon to the next. This period is called the synodic month. It
            is the time it takes the Moon to go through all eight phases and
            return to the same position relative to the Sun and Earth. Because
            29.53 days is not a whole number, the moon phases drift across the
            calendar from month to month. That is why a full moon can fall on
            any date of the month. Our moon calendar and calculator track this
            drift for you, so the phase and emoji stay correct every day.
          </p>
        </Card>
      </Reveal>

      {/* Related tools — contextual internal links to existing pages. */}
      <Reveal>
        <Card className="glass rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-white mb-4">
            Keep exploring the Moon
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/moon-calendar"
              className="group glass rounded-2xl p-4 border-white/10 hover:border-indigo-300/30 transition-colors"
            >
              <div className="text-2xl mb-1" aria-hidden>
                {"\u{1F5D3}\u{FE0F}"}
              </div>
              <div className="font-display text-base font-semibold text-white">
                Moon Calendar
              </div>
              <p className="text-sm text-slate-300/70 mt-1">
                See the moon phase for every day of any month.
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
