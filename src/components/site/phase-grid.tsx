"use client";

import { PHASE_CATALOG } from "@/lib/moon";
import { MoonVisual } from "@/components/site/moon-visual";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";

/** Grid of the eight principal moon phases with realistic visuals. */
export function PhaseGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PHASE_CATALOG.map((phase, i) => (
        <Reveal key={phase.key} delay={i * 0.05}>
          <Card className="glass h-full p-5 rounded-2xl border-white/10 hover:border-indigo-300/30 transition-colors group">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden
                />
                <MoonVisual
                  phase={phase.demoFraction}
                  size={108}
                  glow={false}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" aria-hidden>
                {phase.emoji}
              </span>
              <h3 className="font-display text-lg font-semibold text-white">
                {phase.name}
              </h3>
            </div>
            <p className="text-sm text-slate-300/75 leading-relaxed">
              {phase.short}
            </p>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
