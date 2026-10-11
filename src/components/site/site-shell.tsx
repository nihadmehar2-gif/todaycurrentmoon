"use client";

import type { ReactNode } from "react";
import { CosmicBg } from "@/components/site/cosmic-bg";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AdSlot } from "@/components/site/ad-slot";

/**
 * Shared site chrome: cosmic background, sticky navbar, a desktop
 * leaderboard ad, content, and a sticky footer. Used by every real App
 * Router page so the layout is identical across the site.
 *
 * Ad placement in the shell:
 * - 728x90 desktop banner: below the navbar, above main content. Desktop
 *   only (hidden on mobile/tablet). This is the responsive leaderboard.
 *
 * The 320x50 mobile banner and 300x250 content banner are placed within
 * page content (see the homepage) so they sit next to relevant moon info.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <CosmicBg />
      <Navbar />

      {/* Desktop leaderboard (728x90) — below navbar, above main content.
          Desktop only; mobile uses in-content banners instead. */}
      <div className="hidden lg:flex justify-center pt-24 pb-4 px-4">
        <AdSlot
          adKey="09f003d2d6c27e365f369cb0eafad065"
          width={728}
          height={90}
        />
      </div>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
