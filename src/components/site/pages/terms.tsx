"use client";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { useMounted } from "@/components/site/use-mounted";

const SECTIONS = [
  {
    h: "Accepting the terms",
    p: "By using this site, you agree to these terms. If you do not agree, please do not use the site. These terms apply to all pages and tools here.",
  },
  {
    h: "What we offer",
    p: "Moon Phase Emoji gives you free lunar data, including the current moon phase, emoji, illumination, lunar age, cycle progress, a moon calendar, and moon calculators. All tools are free and need no account.",
  },
  {
    h: "Use of the site",
    p: "Please use the site in a fair and lawful way. Do not try to break, overload, or scrape it. Do not use the tools to harm others or break any law.",
  },
  {
    h: "Accuracy of data",
    p: "We work hard to keep the moon data correct. The phase and emoji come from a real lunar cycle, and we check our math against trusted sources. Still, the data is for general use and may have small rounding differences. For work that needs exact astronomy, please check an official source.",
  },
  {
    h: "No warranty",
    p: "The site is provided as is, without a warranty of any kind. We do not promise the tools will be error free or always available. You use them at your own risk.",
  },
  {
    h: "Limits on our liability",
    p: "We are not liable for any loss or damage that comes from using this site. This includes indirect or accidental loss, such as a missed event or a plan based on the data shown here.",
  },
  {
    h: "External links",
    p: "This site does not link to outside websites. If we ever add one, that site's own rules will apply once you leave us.",
  },
  {
    h: "Your messages",
    p: "If you send a message through the contact form, you give us permission to save and read it so we can reply. Please do not share details you want to keep private.",
  },
  {
    h: "Changes to the site or terms",
    p: "We may update the tools, content, or these terms at any time. If the terms change in a big way, we will post the new version here. The date at the bottom shows when it was last reviewed.",
  },
  {
    h: "Contact",
    p: "Questions about these terms? Email us at nihadmehar2@gmail.com and we will be glad to help.",
  },
];

export function TermsPage() {
  const mounted = useMounted();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Use",
    description:
      "The Moon Phase Emoji terms of use. Clear, fair rules for using the site and its moon tools.",
  };

  return (
    <PageShell
      title="Terms of Use"
      breadcrumb="Terms of Use"
      description="Clear, fair rules for using this site and its moon tools. Please read them before you use the tools."
      jsonLd={jsonLd}
    >
      <div className="space-y-5">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.h} delay={i * 0.03}>
            <Card className="glass rounded-2xl border-white/10 p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-2">
                {s.h}
              </h2>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                {s.p}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="text-xs text-slate-400/70 text-center pt-4">
          Last reviewed:{" "}
          {mounted
            ? new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : ""}
        </p>
      </Reveal>
    </PageShell>
  );
}
