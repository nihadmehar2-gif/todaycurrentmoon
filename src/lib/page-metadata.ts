import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getRoute } from "@/lib/routes";

/**
 * Build per-page Metadata for a real App Router page. Generates a unique
 * title, description, canonical URL, and Open Graph / Twitter tags.
 */
export function pageMetadata(path: string): Metadata {
  const route = getRoute(path);
  const title = route?.title ?? "Today Current Moon";
  const description =
    route?.description ??
    "Live lunar data and the exact current phase of the moon emoji.";
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
