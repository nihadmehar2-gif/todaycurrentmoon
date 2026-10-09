import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://moonphaseemoji.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Current Phase of the Moon Emoji | Moon Phase Today",
    template: "%s | Moon Phase Emoji",
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
  authors: [{ name: "Adam Jonah" }],
  creator: "Adam Jonah",
  applicationName: "Moon Phase Emoji",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    title: "Current Phase of the Moon Emoji | Moon Phase Today",
    description:
      "Live moon phase today with the exact emoji, illumination, lunar age, and cycle progress. A free moon calendar and moon calculators.",
    url: SITE_URL,
    siteName: "Moon Phase Emoji",
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
  category: "science",
};

export const viewport: Viewport = {
  themeColor: "#06040f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Moon Phase Emoji",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
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
