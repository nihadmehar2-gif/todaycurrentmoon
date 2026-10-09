"use client";

import { getLitPath } from "@/lib/moon";

interface MoonVisualProps {
  /** 0..1 phase fraction (0 = new, 0.5 = full). */
  phase: number;
  /** Pixel size of the rendered moon. */
  size?: number;
  /** Show the soft outer glow ring. */
  glow?: boolean;
  /** Optional className for layout. */
  className?: string;
}

/**
 * Realistic SVG moon renderer. Draws the dark disk, the accurately
 * shaped lit region, subtle crater texture, and a luminous rim so the
 * phase reads like real lunar lighting.
 */
export function MoonVisual({
  phase,
  size = 260,
  glow = true,
  className,
}: MoonVisualProps) {
  const R = 100;
  const litPath = getLitPath(phase, R);
  const gradId = "moon-lit";
  const darkId = "moon-dark";
  const rimId = "moon-rim";
  const cratersId = "moon-craters";

  return (
    <svg
      viewBox="-120 -120 240 240"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Moon phase visualization showing ${Math.round(
        ((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100,
      )} percent illumination`}
    >
      <defs>
        <radialGradient id={gradId} cx="34%" cy="30%" r="82%">
          <stop offset="0%" stopColor="#fffefb" />
          <stop offset="38%" stopColor="#eef0ff" />
          <stop offset="72%" stopColor="#c3cbef" />
          <stop offset="100%" stopColor="#7e89c4" />
        </radialGradient>
        <radialGradient id={darkId} cx="68%" cy="70%" r="85%">
          <stop offset="0%" stopColor="#161a35" />
          <stop offset="60%" stopColor="#0c0f24" />
          <stop offset="100%" stopColor="#05060f" />
        </radialGradient>
        <radialGradient id={rimId} cx="50%" cy="50%" r="50%">
          <stop offset="84%" stopColor="rgba(165,180,252,0)" />
          <stop offset="95%" stopColor="rgba(165,180,252,0.4)" />
          <stop offset="100%" stopColor="rgba(165,180,252,0)" />
        </radialGradient>
        <clipPath id="moon-clip">
          <circle cx="0" cy="0" r={R} />
        </clipPath>
        <pattern
          id={cratersId}
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="12" cy="18" r="3" fill="rgba(0,0,0,0.05)" />
          <circle cx="40" cy="10" r="1.8" fill="rgba(0,0,0,0.04)" />
          <circle cx="48" cy="44" r="2.4" fill="rgba(0,0,0,0.05)" />
          <circle cx="22" cy="48" r="1.5" fill="rgba(0,0,0,0.04)" />
          <circle cx="30" cy="30" r="1.2" fill="rgba(0,0,0,0.03)" />
        </pattern>
      </defs>

      {glow && (
        <circle cx="0" cy="0" r={R + 20} fill="url(#moon-rim)" opacity="0.9" />
      )}

      {/* Dark base disk (the unlit near side). */}
      <circle cx="0" cy="0" r={R} fill={`url(#${darkId})`} />

      {/* Lit portion, clipped to the disk. */}
      <g clipPath="url(#moon-clip)">
        <path d={litPath} fill={`url(#${gradId})`} />
        <circle cx="0" cy="0" r={R} fill={`url(#${cratersId})`} opacity="0.5" />
      </g>

      {/* Soft inner shadow on the dark side for depth. */}
      <circle
        cx="0"
        cy="0"
        r={R}
        fill="none"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth="1.5"
      />
      {/* Luminous rim light. */}
      <circle
        cx="0"
        cy="0"
        r={R - 0.5}
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />
    </svg>
  );
}
