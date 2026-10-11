"use client";

import { Quote, Target, Eye, Heart, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section";

const VALUES = [
  {
    icon: Target,
    title: "Clear content first",
    text: "I write in plain words so anyone can grasp the moon, fast. No jargon, no fluff.",
  },
  {
    icon: Eye,
    title: "Checked sources",
    text: "I check lunar data against trusted astronomy sources before it goes on the site.",
  },
  {
    icon: Heart,
    title: "Built for you",
    text: "Your needs lead the design. If a feature does not help you, it does not ship.",
  },
];

const PROMISES = [
  "Live moon data that updates in real time, not a fixed list",
  "A real lunar cycle, so the phase and emoji match the sky",
  "No sign up, no app, and no cost to use any tool",
  "Clear labels for every number we show",
  "Honest notes where a value is an estimate",
];

export function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Moon Phase Emoji",
    description:
      "Learn about Moon Phase Emoji and the content specialist behind it, Nihad Mehar.",
  };

  return (
    <PageShell
      title="About Moon Phase Emoji"
      breadcrumb="About Us"
      path="/about"
      description="A small project with one goal: make the current phase of the moon easy to find, read, and trust."
      jsonLd={jsonLd}
    >
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
                  Hi, I am Nihad. I built Moon Phase Emoji because the moon
                  should be simple to check. My work focuses on clear content,
                  lunar research, and useful explanations that fit real life.
                </p>
                <p>
                  Each day, I look at how the Moon moves and turn that into words
                  you can use. I check our lunar math against trusted sources, so
                  the phase and emoji you see match the sky. I do not invent
                  credentials. I just read, test, and write with care.
                </p>
                <p>
                  My aim is to put your needs first. Whether you want the moon
                  for tonight, a plan for the month, or the reason the phases
                  change, I want this site to help you most.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

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

      <Reveal>
        <Card className="glass rounded-2xl border-white/10 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-white mb-3">
            Why I made this
          </h2>
          <p className="text-slate-300/80 leading-relaxed">
            I kept looking for a quick, clean way to see the moon phase for
            today. Most tools were cluttered, slow, or wrong. So I built one
            myself. The moon is the same for all of us, so the data should be
            free, fast, and easy to trust. That is the whole idea behind this
            site.
          </p>
        </Card>
      </Reveal>
    </PageShell>
  );
}
