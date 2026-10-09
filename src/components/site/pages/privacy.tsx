"use client";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { useMounted } from "@/components/site/use-mounted";

const SECTIONS = [
  {
    h: "The short version",
    p: "We keep things simple. We do not use analytics, ads, tracking pixels, or third party services on this site. We only store what you choose to send us through the contact form.",
  },
  {
    h: "What we collect",
    p: "If you submit the contact form, we save the name, email, subject, and message you type in. We use this only to read and reply to your note. We do not collect browsing data, search history, or personal profiles.",
  },
  {
    h: "Location and time zone",
    p: "The live moon tool uses your device time zone by default to show the right local date and time. If you tap the location button, your browser will ask if you want to share your exact spot. We never store your location. It is used only in your browser to show your coordinates on the page.",
  },
  {
    h: "Cookies",
    p: "We do not set tracking cookies. The site may use your browser storage to remember simple choices, like the time zone you pick. These are kept on your device and are not shared with us or anyone else.",
  },
  {
    h: "How we store messages",
    p: "Contact form messages are saved in our own database. We keep them only as long as needed to handle your request, then we remove them. We do not sell or share your details with anyone.",
  },
  {
    h: "External links",
    p: "Some pages link to trusted astronomy sources, such as NASA and the US Navy. Those sites have their own privacy rules. Once you leave this site, their policies apply, not ours.",
  },
  {
    h: "Your choices",
    p: "You do not need to share any data to use the moon tools. The live moon, calendar, and calculators all work without an account. You only share details if you choose to use the contact form.",
  },
  {
    h: "Children",
    p: "This site is fine for all ages. We do not aim at young children, and we do not knowingly collect data from anyone under 13. If you think a child sent us a message by mistake, email us and we will delete it.",
  },
  {
    h: "Changes to this policy",
    p: "If we change how we handle data, we will update this page. The date at the bottom shows when it was last reviewed.",
  },
  {
    h: "Contact",
    p: "Questions about privacy? Email us at nihadmehar2@gmail.com and we will help you out.",
  },
];

export function PrivacyPage() {
  const mounted = useMounted();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "The Moon Phase Emoji privacy policy. We do not use analytics, ads, or tracking.",
  };

  return (
    <PageShell
      title="Privacy Policy"
      breadcrumb="Privacy Policy"
      description="We respect your privacy. This page explains, in plain words, what we do and do not collect."
      jsonLd={jsonLd}
    >
      <div className="space-y-5">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.h} delay={i * 0.03}>
            <Card className="glass rounded-2xl border-white/10 p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-2">
                {s.h}
              </h2>
              <p className="text-sm text-violet-100/75 leading-relaxed">
                {s.p}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="text-xs text-violet-100/50 text-center pt-4">
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
