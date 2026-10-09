"use client";

import { PHASE_CATALOG } from "@/lib/moon";
import { MoonVisual } from "@/components/site/moon-visual";

/**
 * Circular lunar cycle diagram. The eight phases sit around a ring so the
 * waxing and waning halves read at a glance.
 */
export function LunarCycle() {
  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const ringRadius = 170;
  const moonSize = 64;

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[460px] aspect-square">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full"
            role="img"
            aria-label="Diagram of the lunar cycle showing eight phases around a ring"
          >
            {/* Faint guide ring */}
            <circle
              cx={cx}
              cy={cy}
              r={ringRadius}
              fill="none"
              stroke="rgba(196,181,253,0.18)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            {/* Direction arrows (waxing top, waning bottom) */}
            <defs>
              <marker
                id="arrow"
                markerWidth="8"
                markerHeight="8"
                refX="4"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8 Z" fill="rgba(196,181,253,0.5)" />
              </marker>
            </defs>
            {/* Waxing arrow (clockwise on the right half top) */}
            <path
              d={`M ${cx + ringRadius * 0.92} ${cy - ringRadius * 0.38} A ${ringRadius} ${ringRadius} 0 0 1 ${cx + ringRadius * 0.38} ${cy - ringRadius * 0.92}`}
              fill="none"
              stroke="rgba(196,181,253,0.4)"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <text
              x={cx + ringRadius + 18}
              y={cy - ringRadius + 6}
              fill="rgba(196,181,253,0.7)"
              fontSize="11"
              fontFamily="var(--font-geist-sans)"
            >
              Waxing
            </text>
            <text
              x={cx - ringRadius - 50}
              y={cy + ringRadius + 6}
              fill="rgba(196,181,253,0.7)"
              fontSize="11"
              fontFamily="var(--font-geist-sans)"
            >
              Waning
            </text>

            {/* Center label */}
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="15"
              fontFamily="var(--font-display)"
              fontWeight="600"
            >
              Lunar cycle
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              fill="rgba(196,181,253,0.6)"
              fontSize="11"
              fontFamily="var(--font-geist-sans)"
            >
              29.53 days
            </text>
          </svg>

          {/* Position the 8 phase moons around the ring with HTML for crisp text. */}
          {PHASE_CATALOG.map((phase, i) => {
            const angle = (i / 8) * 2 * Math.PI - Math.PI / 2; // start at top
            const x = cx + Math.cos(angle) * ringRadius;
            const y = cy + Math.sin(angle) * ringRadius;
            const leftPct = (x / size) * 100;
            const topPct = (y / size) * 100;
            return (
              <div
                key={phase.key}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: moonSize,
                }}
              >
                <MoonVisual
                  phase={phase.demoFraction}
                  size={moonSize}
                  glow={false}
                />
                <span className="text-[10px] text-violet-100/70 text-center leading-tight">
                  {phase.name}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-sm text-violet-100/60 mt-5 max-w-md">
          The Moon moves all the way around Earth in about 29.5 days. We see the
          same eight shapes in the same order, cycle after cycle.
        </p>
      </div>
    </div>
  );
}
