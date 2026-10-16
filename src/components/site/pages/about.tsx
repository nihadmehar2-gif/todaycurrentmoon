"use client";

import Link from "next/link";
import { Quote, Target, Eye, Heart, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section";
import { SITE_EMAIL } from "@/lib/site";

const VALUES = [
  {
    icon: Target,
    title: "Clear content first",
    text: "I write in plain words so anyone can understand the moon, fast. No jargon, no filler.",
  },
  {
    icon: Eye,
    title: "Checked calculations",
    text: "I verify lunar data against USNO and NASA new moon tables before it goes on the site.",
  },
  {
    icon: Heart,
    title: "Built for you",
    text: "Your needs lead the design. If a feature does not help you, it does not ship.",
  },
];

const PROMISES = [
  "Moon phase data calculated from actual new moon times, not a fixed list",
  "A real lunar cycle based on the 29.53-day synodic month",
  "No sign up, no app, and no cost to use any tool",
  "Clear labels for every number shown",
  "Honest notes where a value is an approximation",
];

export function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Today Current Moon",
    description:
      "Learn about Today Current Moon, a free moon phase website built by Nihad Mehar.",
  };

  return (
    <PageShell
      title="About Today Current Moon"
      breadcrumb="About Us"
      path="/about"
      description="Today Current Moon is a free website that shows the current moon phase, a monthly moon calendar, and easy moon calculators. Built by Nihad Mehar."
      jsonLd={jsonLd}
    >
      {/* Author bio */}
      <Reveal>
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
                  Content Specialist
                </span>
              </div>
              <h2 className="font-display text-xl font-semibold text-white">
                Nihad Mehar
              </h2>
              <p className="text-sm text-indigo-200/70 mb-3">Website Developer</p>
              <div className="text-sm text-slate-200/85 leading-relaxed space-y-3">
                <p>
                  Hi, I am Nihad. I built Today Current Moon because the moon
                  should be simple to check. My work focuses on clear content,
                  lunar research, and useful tools that fit real life.
                </p>
                <p>
                  Each day, I look at how the Moon moves and turn that into tools
                  and words you can use. I verify the lunar calculations against
                  USNO and NASA new moon tables, so the phase and emoji you see
                  match the sky. I do not invent credentials. I just read, test,
                  and build with care.
                </p>
                <p>
                  My aim is to put your needs first. Whether you want the moon
                  for tonight, a plan for the month, or the reason the phases
                  change, I want this site to help you most. You can reach me
                  anytime at{" "}
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="text-indigo-200 hover:text-white underline underline-offset-2"
                  >
                    {SITE_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* What the site does */}
      <Reveal>
        <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            What Today Current Moon does
          </h2>
          <p className="text-slate-300/80 leading-relaxed mb-3">
            Today Current Moon is a free website that shows the current moon
            phase, emoji, and illumination for your time zone. You can also
            browse a monthly moon calendar, find the moon phase for any date,
            and learn what each of the eight lunar phases means.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 mt-4">
            <Link
              href="/moon-phases"
              className="glass rounded-xl p-4 border-white/10 hover:border-indigo-300/30 transition-colors"
            >
              <div className="text-xl mb-1" aria-hidden>
                {"\u{1F312}"}
              </div>
              <div className="text-sm font-semibold text-white">
                Moon Phases
              </div>
              <p className="text-xs text-slate-300/70 mt-1">
                Learn all eight phases, what they look like, and what they mean.
              </p>
            </Link>
            <Link
              href="/moon-calendar"
              className="glass rounded-xl p-4 border-white/10 hover:border-indigo-300/30 transition-colors"
            >
              <div className="text-xl mb-1" aria-hidden>
                {"\u{1F5D3}\u{FE0F}"}
              </div>
              <div className="text-sm font-semibold text-white">
                Moon Calendar
              </div>
              <p className="text-xs text-slate-300/70 mt-1">
                See the moon phase for every day of any month.
              </p>
            </Link>
            <Link
              href="/moon-calculator"
              className="glass rounded-xl p-4 border-white/10 hover:border-indigo-300/30 transition-colors"
            >
              <div className="text-xl mb-1" aria-hidden>
                {"\u{1F4C5}"}
              </div>
              <div className="text-sm font-semibold text-white">
                Moon Calculator
              </div>
              <p className="text-xs text-slate-300/70 mt-1">
                Find the moon phase for any past or future date.
              </p>
            </Link>
          </div>
        </Card>
      </Reveal>

      {/* How calculations work */}
      <Reveal>
        <Card className="glass rounded-3xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            How the moon phases are calculated
          </h2>
          <p className="text-slate-300/80 leading-relaxed mb-3">
            The moon phase for each day is calculated from a lookup table of
            actual new moon times published by the USNO (United States Naval
            Observatory) and NASA. The table covers the years 2020 to 2030. For
            each date, the site finds the nearest preceding new moon and
            computes how far through the 29.53-day synodic cycle the Moon has
            traveled. This gives the phase name, emoji, and illumination
            percentage.
          </p>
          <p className="text-slate-300/80 leading-relaxed mb-3">
            This method is more accurate than using a fixed average cycle
            length, because the actual time between new moons varies by up to
            half a day due to the Moon&apos;s elliptical orbit. Within the
            2020 to 2030 range, the phase labels match the sky to within a few
            hours.
          </p>
          <p className="text-slate-300/80 leading-relaxed">
            The calendar and calculator show general phase information for any
            date. They do not show moonrise or moonset times, which depend on
            your location. For those, use a local astronomy app or website.
          </p>
        </Card>
      </Reveal>

      {/* Values */}
      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="What I value"
          title="How I build this site"
          description="Three ideas guide every page, tool, and word here."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <Card className="glass h-full p-6 rounded-2xl border-white/10">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-300/20 mb-4">
                  <v.icon className="w-5 h-5 text-indigo-200" />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-300/80 leading-relaxed">
                  {v.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Promises */}
      <section className="space-y-4">
        <SectionHeading
          align="left"
          eyebrow="My promise"
          title="What you can count on"
          description="A short list of what this site will always do for you."
        />
        <Reveal>
          <Card className="glass rounded-2xl border-white/10 p-6">
            <ul className="space-y-3">
              {PROMISES.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-slate-200/85">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </section>

      {/* Why I made this */}
      <Reveal>
        <Card className="glass rounded-2xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            Why I made this
          </h2>
          <p className="text-slate-300/80 leading-relaxed">
            I kept looking for a quick, clean way to see the moon phase for
            today. Most tools were cluttered, slow, or wrong. So I built one
            myself. The moon is the same for all of us, so the data should be
            free, fast, and easy to trust. That is the whole idea behind
            Today Current Moon.
          </p>
        </Card>
      </Reveal>

      {/* Contact link */}
      <Reveal>
        <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-white mb-2">
            Get in touch
          </h2>
          <p className="text-sm text-slate-300/80 mb-4">
            Questions, corrections, or ideas? I read every message.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 px-5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Contact Us
          </Link>
        </Card>
      </Reveal>
    </PageShell>
  );
}
