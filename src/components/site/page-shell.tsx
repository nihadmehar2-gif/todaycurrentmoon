"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Reveal } from "@/components/site/reveal";
import { SITE_URL } from "@/lib/site";

interface PageShellProps {
  title: string;
  description?: ReactNode;
  /** Breadcrumb label for the current page. */
  breadcrumb: string;
  /** Canonical path of the current page, e.g. "/moon-phases". */
  path: string;
  children: ReactNode;
  /** JSON-LD structured data object, rendered as a script tag. */
  jsonLd?: object;
}

/** Shared layout for inner pages: breadcrumb, heading, description, content. */
export function PageShell({
  title,
  description,
  breadcrumb,
  path,
  children,
  jsonLd,
}: PageShellProps) {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumb,
        item: `${SITE_URL}${path}`,
      },
    ],
  };

  return (
    <article className="pt-28 sm:pt-32 pb-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Reveal>
          <Breadcrumb className="mb-5">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-indigo-200/70 hover:text-white"
                >
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-indigo-200/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  {breadcrumb}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Reveal>

        <Reveal delay={0.05}>
          <span className="eyebrow mb-3">Moon Phase Emoji</span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gradient leading-[1.1] tracking-tight">
            {title}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.1}>
            <p className="mt-4 text-slate-200/80 text-base sm:text-lg leading-relaxed max-w-2xl">
              {description}
            </p>
          </Reveal>
        )}

        <div className="mt-10 space-y-12">{children}</div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd ?? breadcrumbLd),
        }}
      />
    </article>
  );
}
