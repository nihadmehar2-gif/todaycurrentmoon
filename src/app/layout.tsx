import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Outfit, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL, SITE_NAME, SITE_AUTHOR } from "@/lib/site";

/** Google Analytics 4 Measurement ID. */
const GA_MEASUREMENT_ID = "G-2YFNLFH6JP";

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Current Phase of the Moon Emoji | Moon Phase Today",
    template: "%s",
  },
  description:
    "See the current phase of the moon emoji for today with the exact moon phase, illumination, lunar age, and cycle progress. Live moon data, a moon calendar, and easy moon calculators.",
  keywords: [
    "current phase of the moon emoji",
    "moon phase today",
    "moon emoji",
    "lunar phase",
    "moon calendar",
    "moon calculator",
    "full moon",
    "new moon",
    "moon illumination",
  ],
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    title: "Current Phase of the Moon Emoji | Moon Phase Today",
    description:
      "Live moon phase today with the exact emoji, illumination, lunar age, and cycle progress. A free moon calendar and moon calculators.",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Current Phase of the Moon Emoji | Moon Phase Today",
    description:
      "Live moon phase today with the exact emoji, illumination, lunar age, and cycle progress.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ZD9SdIXWF3yJhDc3HSp5Ti6QufX1rrttnUxM6AFeVSY",
  },
  other: {
    "google-adsense-account": "ca-pub-1791950384087416",
  },
  category: "science",
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "See the current phase of the moon emoji for today with live moon data, a moon calendar, and moon calculators.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 (gtag.js) — official Google tag. */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
