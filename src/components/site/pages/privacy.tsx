"use client";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/reveal";
import { useMounted } from "@/components/site/use-mounted";

const SECTIONS = [
  {
    h: "Introduction and scope",
    p: "This privacy policy explains what information Today Current Moon collects, how it is used, and what choices you have. The site is hosted on Vercel and provides free moon phase tools, a moon calendar, and moon calculators. By using the site, you agree to the practices described here.",
  },
  {
    h: "Information collected",
    p: "Today Current Moon collects the following types of information: (1) Contact form data: when you submit the contact form, we collect your name, email address, subject, and message. (2) Analytics data: Google Analytics collects anonymous data about how visitors use the site, such as page views, session duration, and general location. (3) Advertising data: our advertising partners may collect data through cookies or similar technologies to serve and measure ads. (4) Technical data: Vercel, our hosting provider, may process technical information such as IP addresses, browser type, and request logs as part of normal web hosting operations.",
  },
  {
    h: "How information is used",
    p: "Contact form data is used to read and respond to your messages. Analytics data is used to understand which pages are popular and how to improve the site. Advertising data is used by our partners to display relevant ads and measure their performance. Technical data is used by Vercel to serve the website and maintain security. We do not use your contact form data for marketing or share it with advertisers.",
  },
  {
    h: "Cookies and browser storage",
    p: "Google Analytics may set cookies to track anonymous usage data. Our advertising partners (HighRevenueFormat and Google AdSense) may set cookies or use similar technologies to display and measure ads. You can control, block, or delete cookies in your browser settings. The site also uses your browser's local storage to remember preferences, such as the time zone you select in the moon tool. This data stays on your device and is not sent to our servers.",
  },
  {
    h: "Location and time-zone features",
    p: "The live moon tool uses your device's time zone by default to show the correct local date and time. If you click the location button, your browser will ask for permission to share your geographic coordinates. If granted, your coordinates are used only in your browser to display your location on the page. We do not store your location on our servers. You can decline the location request and the moon tools will still work using your time zone.",
  },
  {
    h: "Contact form and message handling",
    p: "When you submit the contact form, your name, email address, subject, and message are sent to our server and saved in a database. Messages are stored, not emailed. We read submitted messages to respond to your questions, corrections, or feedback. The database is part of the application's hosting infrastructure. On serverless platforms like Vercel, database persistence depends on the database configuration. We do not claim that messages are encrypted, automatically deleted, or never accessible to hosting providers.",
  },
  {
    h: "Third-party services and hosting",
    p: "Today Current Moon uses the following third-party services: (1) Vercel for web hosting, which may process IP addresses and request logs. (2) Google Analytics (GA4, measurement ID G-2YFNLFH6JP) for anonymous traffic analysis. (3) Google AdSense (publisher ID ca-pub-1791950384087416) for advertising. (4) HighRevenueFormat for banner ad delivery. (5) Google Fonts for web fonts (Outfit, Fraunces, JetBrains Mono). Each of these services has its own privacy policy and may collect data as described in their respective policies.",
  },
  {
    h: "Data retention and security",
    p: "Contact form messages are stored in the application database. We keep messages only as long as needed to handle your request. We do not have an automatic deletion schedule. We do not sell or share your contact details with third parties for marketing. Security depends on the hosting platform and database provider. We do not claim that data transmission or storage is encrypted beyond what the hosting provider offers by default.",
  },
  {
    h: "Children's privacy",
    p: "This site is suitable for all ages. We do not aim content at young children and do not knowingly collect personal information from anyone under 13. If you believe a child has submitted a message through the contact form, email us at nihadmehar2@gmail.com and we will delete it.",
  },
  {
    h: "Your privacy choices",
    p: "You can use all moon tools without submitting any personal information. The live moon, calendar, and calculators work without an account. You can block cookies in your browser settings and still use the moon tools. You can decline the location permission and the tools will use your time zone instead. You can contact us at nihadmehar2@gmail.com to request deletion of your contact form submission.",
  },
  {
    h: "Policy updates",
    p: "If we change how we handle data or add new services, we will update this page. The date at the bottom shows when the policy was last reviewed. We encourage you to review this page periodically.",
  },
  {
    h: "Privacy contact",
    p: "If you have questions about this privacy policy or how your data is handled, email us at nihadmehar2@gmail.com. We will do our best to respond to your questions.",
  },
];

export function PrivacyPage() {
  const mounted = useMounted();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "The Today Current Moon privacy policy. Explains what data we collect, how we use Google Analytics and advertising partners, and how contact form submissions are handled.",
  };

  return (
    <PageShell
      title="Privacy Policy"
      breadcrumb="Privacy Policy"
      path="/privacy"
      description="We respect your privacy. This page explains what data we collect, how it is used, and the choices you have."
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
