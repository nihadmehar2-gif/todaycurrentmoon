"use client";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { useMounted } from "@/components/site/use-mounted";

const SECTIONS = [
  {
    h: "The short version",
    p: "This site uses Google Analytics to understand traffic and advertising partners to display ads. If you submit the contact form, we store your name, email, subject, and message in our database. We do not sell your personal details.",
  },
  {
    h: "Analytics and advertising",
    p: "We use Google Analytics (GA4) to collect anonymous data about how visitors use the site, such as which pages are viewed and how long visitors stay. Google may set cookies to track this data. We also display ads from third-party advertising partners. These partners may use cookies or similar technologies to show relevant ads. You can control cookies in your browser settings.",
  },
  {
    h: "What we collect from the contact form",
    p: "If you submit the contact form, we save the name, email, subject, and message you type in. We use this only to read and reply to your note. We do not use your contact details for marketing or share them with advertisers.",
  },
  {
    h: "Location and time zone",
    p: "The live moon tool uses your device time zone by default to show the right local date and time. If you tap the location button, your browser will ask if you want to share your exact spot. We never store your location. It is used only in your browser to show your coordinates on the page.",
  },
  {
    h: "Cookies",
    p: "Google Analytics and our advertising partners may set cookies. These cookies help track anonymous usage data and serve ads. You can block or delete cookies in your browser settings. The site also uses your browser storage to remember simple choices, like the time zone you pick.",
  },
  {
    h: "How we store messages",
    p: "Contact form messages are saved in our database. We keep them only as long as needed to handle your request. We do not sell or share your contact details with anyone.",
  },
  {
    h: "External links",
    p: "This site does not link to outside websites. If we ever add a link, we will note it here and the other site's rules will apply once you leave us.",
  },
  {
    h: "Your choices",
    p: "You do not need to share any data to use the moon tools. The live moon, calendar, and calculators all work without an account. You only share details if you choose to use the contact form. You can block cookies and still use the moon tools.",
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
      "The Today Current Moon privacy policy. We use Google Analytics and advertising partners, and store contact form submissions.",
  };

  return (
    <PageShell
      title="Privacy Policy"
      breadcrumb="Privacy Policy"
      path="/privacy"
      description="We respect your privacy. This page explains, in plain words, what data we collect and how we use it."
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
