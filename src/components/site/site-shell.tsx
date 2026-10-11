"use client";

import type { ReactNode } from "react";
import { CosmicBg } from "@/components/site/cosmic-bg";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

/**
 * Shared site chrome: cosmic background, sticky navbar, content, and a
 * sticky footer. Used by every real App Router page so the layout is
 * identical across the site.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBg />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
