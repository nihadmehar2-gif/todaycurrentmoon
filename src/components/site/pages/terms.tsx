"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { useMounted } from "@/components/site/use-mounted";
import { SITE_EMAIL } from "@/lib/site";

const SECTIONS = [
  {
    h: "Acceptance of terms",
    p: "By using Today Current Moon, you agree to these Terms of Use. If you do not agree with any part of these terms, please do not use the website. These terms apply to all pages, tools, and content on the site.",
  },
  {
    h: "Website purpose and services",
    p: "Today Current Moon is a free website that provides current moon phase information, a monthly moon calendar, moon phase explanations, and moon-related calculators. The site shows the moon phase emoji, illumination percentage, lunar age, and cycle progress for any date. All tools are free to use and do not require an account.",
  },
  {
    h: "Accuracy and limitations of moon phase information",
    p: "Moon phase calculations are based on a lookup table of actual new moon times from the USNO (United States Naval Observatory) and NASA, covering the years 2020 to 2030. The calculations use the 29.53-day synodic month. Within this date range, the phase labels are accurate to within a few hours of the actual astronomical event. For dates outside the 2020 to 2030 range, the site falls back to a mean synodic month calculation, which may be off by up to half a day per cycle. The site does not show moonrise or moonset times, which depend on your geographic location. The information provided is for general educational and planning purposes, not for navigation, scientific research, or any purpose requiring precise astronomical data.",
  },
  {
    h: "Informational and educational use",
    p: "All content on Today Current Moon is provided for informational and educational purposes. The moon phase data, calendar, explanations, and calculators are intended to help you understand lunar phases and plan around them. The site does not provide professional astronomy, navigation, or scientific advice. You should not rely on this site for decisions that require precise astronomical data.",
  },
  {
    h: "User responsibilities",
    p: "You agree to use the website in a fair and lawful manner. You must not attempt to disrupt, overload, or gain unauthorized access to the website or its servers. You must not use automated tools to scrape, copy, or extract content at a rate that could harm the site's performance. You are responsible for any content you submit through the contact form and must not submit false, harmful, or unlawful information.",
  },
  {
    h: "Intellectual property",
    p: "The website's design, code, text, and visual elements are owned by Today Current Moon. You may view and use the site for personal, non-commercial purposes. You may share links to the site. You may not copy, reproduce, or redistribute the website's content for commercial purposes without permission. The moon phase calculations are based on publicly available astronomical data from USNO and NASA.",
  },
  {
    h: "Third-party services, advertisements, and external links",
    p: "Today Current Moon uses Google Analytics to understand traffic patterns. The site displays advertisements from third-party advertising partners, including Google AdSense and HighRevenueFormat. These partners may use cookies or similar technologies to serve and measure ads. The site also uses Google Fonts for typography. Today Current Moon is not responsible for the content or practices of these third-party services. The site does not currently link to external websites. If external links are added in the future, they will be subject to their own terms and privacy policies.",
  },
  {
    h: "Website availability and service changes",
    p: "Today Current Moon strives to keep the website available and accurate. However, the site may experience downtime, errors, or data inaccuracies. We may change, update, or remove features, tools, or content at any time without notice. We are not liable for any loss resulting from the unavailability of the site or its tools.",
  },
  {
    h: "Warranty disclaimers and limitations of liability",
    p: "The website and its content are provided as is, without warranties of any kind, whether express or implied. We do not guarantee that the moon phase information, calculations, or tools are accurate, complete, or up to date. To the fullest extent permitted by applicable law, Today Current Moon is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or reliance on its information. This includes but is not limited to loss of data, loss of opportunity, or any other damages.",
  },
  {
    h: "Changes to these terms",
    p: "We may update these Terms of Use at any time. When we do, we will update the date at the bottom of this page. We encourage you to review this page periodically. Your continued use of the website after changes are made constitutes your acceptance of the updated terms.",
  },
  {
    h: "Contact information",
    p: "If you have questions about these Terms of Use, you can contact us by email at nihadmehar2@gmail.com or through our contact page. For information about how we handle data, please see our Privacy Policy.",
  },
];

export function TermsPage() {
  const mounted = useMounted();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Use",
    description:
      "The Today Current Moon Terms of Use. Rules for using the free moon phase tools, calendar, and calculators.",
  };

  return (
    <PageShell
      title="Terms of Use"
      breadcrumb="Terms of Use"
      path="/terms-of-use"
      description="The rules for using Today Current Moon and its free moon phase tools, calendar, and calculators."
      jsonLd={jsonLd}
    >
      <div className="space-y-5">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.h} delay={i * 0.02}>
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

      {/* Privacy Policy link */}
      <Reveal>
        <Card className="glass-strong rounded-3xl border-white/10 p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-white mb-2">
            Privacy Policy
          </h2>
          <p className="text-sm text-slate-300/80 mb-4">
            For details on how we handle data, please read our Privacy Policy.
          </p>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 px-5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Read Privacy Policy
          </Link>
        </Card>
      </Reveal>

      {/* Contact link */}
      <Reveal>
        <Card className="glass rounded-2xl border-white/10 p-6 text-center">
          <p className="text-sm text-slate-300/80">
            Questions about these terms? Email us at{" "}
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="text-indigo-200 hover:text-white underline underline-offset-2"
            >
              {SITE_EMAIL}
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              className="text-indigo-200 hover:text-white underline underline-offset-2"
            >
              contact page
            </Link>
            .
          </p>
        </Card>
      </Reveal>

      <Reveal>
        <p className="text-xs text-slate-400/70 text-center pt-4">
          Last updated:{" "}
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
