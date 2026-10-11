"use client";

import {
  Orbit,
  Eye,
  Sun,
  Globe2,
  HelpCircle,
  Quote,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { LiveMoonHero } from "@/components/site/live-moon-hero";
import { PhaseGrid } from "@/components/site/phase-grid";
import { LunarCycle } from "@/components/site/lunar-cycle";
import { MoonCalendar } from "@/components/site/moon-calendar";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import Link from "next/link";
import {
  EMOJI_MEANINGS,
  HOME_FAQS,
} from "@/lib/content";

const WHY_PHASES = [
  {
    icon: Orbit,
    title: "The Moon orbits Earth",
    text: "The Moon takes about 29.5 days to go all the way around Earth. As it moves, we see a different share of its lit side each night.",
  },
  {
    icon: Sun,
    title: "The Sun lights half",
    text: "Sunlight always lights half of the Moon. How much of that lit half faces us depends on where the Moon sits in its orbit.",
  },
  {
    icon: Eye,
    title: "Our view changes",
    text: "When the Moon is between Earth and the Sun, its lit side faces away, so we see a new moon. When it is on the far side, we see a full moon.",
  },
  {
    icon: Globe2,
    title: "The cycle repeats",
    text: "After a full moon, the lit part shrinks day by day until the next new moon. Then the whole cycle starts over, in the same order.",
  },
];

export function HomePage() {

  return (
    <>
      <LiveMoonHero />

      {/* Current phase guide */}
      <Section id="phase-guide">
        <SectionHeading
          eyebrow="Phase guide"
          title="Read tonight's Moon at a glance"
          description="The Moon shows eight clear shapes as it moves through its cycle. Here is how to read what you see in the sky right now."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Spot the shape",
              d: "Look at the bright part of the Moon. Is it a thin sliver, a half disk, or fully round? That shape tells you the phase.",
            },
            {
              t: "Check the side",
              d: "In the Northern Hemisphere, the bright side grows from right to left. If the right side is lit, the Moon is waxing. If the left is lit, it is waning.",
            },
            {
              t: "Feel the trend",
              d: "Waxing means the Moon is heading toward full. Waning means it is heading back toward new. The tool above shows this for you.",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06}>
              <Card className="glass h-full p-6 rounded-2xl border-white/10">
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {c.t}
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  {c.d}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* All 8 phases */}
      <Section id="all-phases" className="pt-0">
        <SectionHeading
          eyebrow="The eight phases"
          title="All eight moon phases, explained"
          description="Every cycle runs through the same eight shapes. Each one has its own name, emoji, and moment in the 29.5-day journey."
        />
        <div className="mt-10">
          <PhaseGrid />
        </div>
        <Reveal className="mt-8 text-center">
          <Link
            href="/moon-phases"
            className="inline-flex items-center gap-2 text-sm text-indigo-200 hover:text-white transition-colors"
          >
            Explore the full moon phases guide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </Section>

      {/* Lunar cycle */}
      <Section id="lunar-cycle" className="pt-0">
        <SectionHeading
          eyebrow="The cycle"
          title="How the lunar cycle flows"
          description="The Moon moves from new to full and back to new in about 29.5 days. This ring shows the whole journey at once."
        />
        <div className="mt-10">
          <LunarCycle />
        </div>
      </Section>

      {/* Interactive calendar */}
      <Section id="calendar" className="pt-0">
        <SectionHeading
          eyebrow="Moon calendar"
          title="See a whole month of moons"
          description="Browse any month and see the moon phase for each day. Today is marked with a soft ring."
        />
        <div className="mt-10">
          <MoonCalendar />
        </div>
        <Reveal className="mt-8 text-center">
          <Link
            href="/moon-calendar"
            className="inline-flex items-center gap-2 text-sm text-indigo-200 hover:text-white transition-colors"
          >
            Open the full moon calendar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </Section>

      {/* Emoji meanings */}
      <Section id="emoji-meanings" className="pt-0">
        <SectionHeading
          eyebrow="Emoji meanings"
          title="What each moon emoji stands for"
          description="Moon emojis do more than show a phase. People use them to share moods, plans, and moments. Here is what each one tends to mean."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EMOJI_MEANINGS.map((m, i) => (
            <Reveal key={m.phase} delay={i * 0.04}>
              <Card className="glass h-full p-5 rounded-2xl border-white/10 hover:border-indigo-300/30 transition-colors">
                <div className="text-4xl mb-3" aria-hidden>
                  {m.emoji}
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-1.5">
                  {m.name}
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  {m.meaning}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why phases change */}
      <Section id="why-phases-change" className="pt-0">
        <SectionHeading
          eyebrow="The science"
          title="Why the moon phases change"
          description="The Moon does not make its own light. It reflects sunlight, and the part we see lit shifts as the Moon orbits Earth."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_PHASES.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <Card className="glass h-full p-6 rounded-2xl border-white/10">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-300/20 mb-4">
                  <w.icon className="w-5 h-5 text-indigo-200" />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2">
                  {w.title}
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  {w.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section id="faqs" className="pt-0">
        <SectionHeading
          eyebrow="FAQ"
          title="Moon phase questions, answered"
          description="The most common questions about the current phase of the moon emoji, in plain words."
        />
        <div className="mt-10 max-w-3xl mx-auto">
          <Card className="glass rounded-3xl border-white/10 p-2 sm:p-3">
            <Accordion type="single" collapsible className="w-full">
              {HOME_FAQS.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-white/10 px-2 sm:px-4"
                >
                  <AccordionTrigger className="text-left text-white hover:no-underline">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-300 shrink-0" />
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300/80 leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </Section>

      {/* Author bio */}
      <Section id="author" className="pt-0">
        <Reveal className="max-w-3xl mx-auto">
          <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="shrink-0">
                <div className="grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-sky-500/30 ring-1 ring-white/15 text-2xl font-display font-semibold text-white">
                  NM
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Quote className="w-4 h-4 text-indigo-300" />
                  <span className="eyebrow">
                    About the Content Specialist
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Nihad Mehar
                </h3>
                <p className="text-sm text-indigo-200/70 mb-3">
                  Website Developer
                </p>
                <div className="text-sm text-slate-200/85 leading-relaxed space-y-3">
                  <p>
                    Hi, I am Nihad. I built this site because I want the current
                    phase of the moon to be easy to find, read, and trust. My
                    focus is on clear content, simple tools, and useful
                    explanations that help you in real life.
                  </p>
                  <p>
                    I spend my time checking lunar sources, reading how the
                    Moon moves, and turning that research into words you can
                    use. Every moon value on this site comes from a real lunar
                    cycle, not a fixed list. If a number can be checked, I check
                    it before it goes live.
                  </p>
                  <p>
                    My goal is to put your needs first. If you want to know the
                    moon for tonight, plan a month ahead, or learn why the
                    phases change, I want this to be the place that helps you
                    most. You can reach me anytime on the contact page.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>

    </>
  );
}
