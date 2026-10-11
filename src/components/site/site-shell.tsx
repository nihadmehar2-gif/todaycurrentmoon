"use client";

import type { ReactNode } from "react";
import { CosmicBg } from "@/components/site/cosmic-bg";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AdSlot } from "@/components/site/ad-slot";

/**
 * Shared site chrome: cosmic background, sticky navbar, ad banners,
 * content, and a sticky footer. Used by every real App Router page so
 * the layout is identical across the site.
 *
 * Ad placements:
 * - 320x50 mobile banner: below the navbar, above main content (mobile
 *   only, hidden on desktop).
 * - 728x90 desktop banner: before the footer (desktop only, hidden on
 *   mobile).
 * The mobile and desktop banners are mutually exclusive so they never
 * render simultaneously in the same responsive placement.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <CosmicBg />
      <Navbar />

      {/* Mobile banner (320x50) — below navbar, mobile only. */}
      <div className="lg:hidden pt-20 sm:pt-24 pb-3 px-4">
        <AdSlot
          adKey="b0f955d2352761b944e53b1655707268"
          width={320}
          height={50}
        />
      </div>

      <main className="flex-1">{children}</main>

      {/* Desktop banner (728x90) — before footer, desktop only. */}
      <div className="hidden lg:block py-6 px-4">
        <AdSlot
          adKey="09f003d2d6c27e365f369cb0eafad065"
          width={728}
          height={90}
        />
      </div>

      <Footer />
    </div>
  );
}
