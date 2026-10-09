"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Cake,
  CalendarSearch,
  Gauge,
  Moon,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoonVisual } from "@/components/site/moon-visual";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section";
import { useMounted } from "@/components/site/use-mounted";
import {
  getMoonPhase,
  getNextFullMoon,
  getNextNewMoon,
  formatFullDate,
} from "@/lib/moon";
import { CALCULATOR_TOOLS } from "@/lib/content";
import {
  type RouteKey,
  useHashRoute,
} from "@/components/site/use-route";

function todayInputValue(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function DateMoonCalculator() {
  const mounted = useMounted();
  // Empty during SSR + first paint (stable), defaults to today on the client.
  const [value, setValue] = useState<string>("");
  // The effective date string: the user's choice, or today once mounted.
  const effectiveValue = value || (mounted ? todayInputValue() : "");

  const date = useMemo(() => {
    if (!effectiveValue) return null;
    const d = new Date(`${effectiveValue}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [effectiveValue]);

  const phase = useMemo(() => (date ? getMoonPhase(date) : null), [date]);
  const nextFull = useMemo(
    () => (date ? getNextFullMoon(date) : null),
    [date],
  );
  const nextNew = useMemo(() => (date ? getNextNewMoon(date) : null), [date]);

  return (
    <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8">
      <div className="grid lg:grid-cols-[auto,1fr] gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="moon-glow">
            <MoonVisual phase={phase ? phase.phaseFraction : 0.5} size={180} />
          </div>
          <div className="mt-3 text-5xl" aria-hidden>
            {phase ? phase.emoji : "\u{1F315}"}
          </div>
          <div className="text-sm font-medium text-white mt-1">
            {phase ? phase.name : "Pick a date"}
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-white mb-1">
            Moon phase for any date
          </h3>
          <p className="text-sm text-violet-100/70 mb-5">
            Pick a date and see the exact moon phase, emoji, and live details for
            that day. Great for planning, photos, or looking back at a special
            moment.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moon-date" className="text-violet-100">
                Choose a date
              </Label>
              <Input
                id="moon-date"
                type="date"
                value={effectiveValue}
                min="1900-01-01"
                max="2100-12-31"
                onChange={(e) => setValue(e.target.value)}
                className="bg-white/5 border-white/10 text-white [color-scheme:dark] max-w-xs"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { l: "Date", v: date ? formatFullDate(date) : "\u2014" },
                {
                  l: "Illumination",
                  v: phase ? `${Math.round(phase.illumination * 100)}%` : "\u2014",
                },
                { l: "Lunar age", v: phase ? `${phase.age.toFixed(1)} d` : "\u2014" },
                {
                  l: "Trend",
                  v: phase ? (phase.waxing ? "Waxing" : "Waning") : "\u2014",
                },
              ].map((s) => (
                <div key={s.l} className="glass rounded-2xl px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-wide text-violet-200/60">
                    {s.l}
                  </div>
                  <div className="text-sm text-white font-medium tabular-nums">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="glass rounded-2xl px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-wide text-violet-200/60">
                  Next full moon
                </div>
                <div className="text-sm text-white font-medium">
                  {nextFull ? formatFullDate(nextFull) : "\u2014"}
                </div>
              </div>
              <div className="glass rounded-2xl px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-wide text-violet-200/60">
                  Next new moon
                </div>
                <div className="text-sm text-white font-medium">
                  {nextNew ? formatFullDate(nextNew) : "\u2014"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const TOOL_META: Record<
  string,
  { icon: typeof Calculator; note: string }
> = {
  "phase-by-date": {
    icon: CalendarSearch,
    note: "Try the live tool above.",
  },
  "next-full-moon": {
    icon: Moon,
    note: "Shown above for your chosen date.",
  },
  "birthday-moon": {
    icon: Cake,
    note: "Enter your birth date above.",
  },
  illumination: {
    icon: Gauge,
    note: "See the percent lit above.",
  },
  "cycle-progress": {
    icon: RefreshCw,
    note: "Track it in the live tool.",
  },
  "moon-calendar": {
    icon: Calculator,
    note: "Opens the full month view.",
  },
};

export function MoonCalculatorsPage() {
  const { navigate } = useHashRoute();
  const go = (k: RouteKey) => navigate(k);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Moon Calculators",
    itemListElement: CALCULATOR_TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      description: t.blurb,
    })),
  };

  return (
    <PageShell
      title="Moon Calculators: Free Tools for Every Lunar Question"
      breadcrumb="Moon Calculators"
      description="A polished set of free moon tools. Find the phase for any date, check the next full moon, or see the Moon on your birthday."
      jsonLd={jsonLd}
    >
      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="Try it now"
          title="Moon phase by date"
          description="The fastest way to find the moon phase, emoji, and details for any day you choose."
        />
        <Reveal>
          <DateMoonCalculator />
        </Reveal>
      </section>

      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="The directory"
          title="All moon calculators"
          description="A clear list of every moon tool on this site and what each one does."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATOR_TOOLS.map((t, i) => {
            const meta = TOOL_META[t.id];
            const Icon = meta?.icon ?? Calculator;
            const isCalendar = t.id === "moon-calendar";
            return (
              <Reveal key={t.id} delay={i * 0.04}>
                <Card className="glass h-full p-5 rounded-2xl border-white/10 hover:border-violet-300/30 transition-colors flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="grid place-items-center w-10 h-10 rounded-xl bg-violet-500/15 ring-1 ring-violet-300/20 text-xl">
                      <span aria-hidden>{t.emoji}</span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {t.name}
                    </h3>
                  </div>
                  <p className="text-sm text-violet-100/70 leading-relaxed mb-3">
                    {t.blurb}
                  </p>
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {t.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-xs text-violet-100/60"
                      >
                        <Sparkles className="w-3 h-3 text-violet-300 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-white/10">
                    {isCalendar ? (
                      <button
                        onClick={() => go("moon-calendar")}
                        className="inline-flex items-center gap-1.5 text-xs text-violet-200 hover:text-white transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {meta?.note}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-violet-200/70">
                        <Icon className="w-3.5 h-3.5" />
                        {meta?.note}
                      </span>
                    )}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal>
        <Card className="glass rounded-2xl border-white/10 p-5 sm:p-6">
          <p className="text-sm text-violet-100/75 leading-relaxed">
            Every tool here uses the same lunar math, based on the 29.53-day
            cycle and a known reference new moon. That keeps the phase, emoji,
            and dates consistent across the whole site. Pick a tool, enter your
            date, and get an answer in seconds.
          </p>
        </Card>
      </Reveal>
    </PageShell>
  );
}
