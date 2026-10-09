"use client";

import { useId } from "react";

interface MoonVisualProps {
  phase: number;
  size?: number;
  glow?: boolean;
  className?: string;
}

/*
  Beautiful Moon renderer.
  -----------------------
  Uses a real high-resolution lunar photograph as the surface (HTML <img>,
  so it always loads reliably). An SVG overlay on top fills the unlit
  portion with a soft earthshine gradient, using fill-rule="evenodd" to
  "cut out" the lit region so the photo shows through. This avoids
  clipPath/mask compatibility issues entirely.

  Phase accuracy: crescent, quarter, gibbous, and full all use the
  correct half-ellipse terminator. New moon shows no lit region.
*/

function getLitPath(phaseFraction: number, R: number): string {
  const angle = 2 * Math.PI * phaseFraction;
  const k = (1 - Math.cos(angle)) / 2;
  if (k < 0.005) return "";
  if (k > 0.995)
    return `M 0 ${-R} A ${R} ${R} 0 1 1 0 ${R} A ${R} ${R} 0 1 1 0 ${-R} Z`;
  const rx = Math.abs(R * (1 - 2 * k));
  const waxing = phaseFraction < 0.5;
  let s1: 0 | 1;
  let s2: 0 | 1;
  if (waxing) {
    s1 = 1;
    s2 = k < 0.5 ? 1 : 0;
  } else {
    s1 = 0;
    s2 = k < 0.5 ? 0 : 1;
  }
  return `M 0 ${-R} A ${R} ${R} 0 0 ${s1} 0 ${R} A ${rx} ${R} 0 0 ${s2} 0 ${-R} Z`;
}

export function MoonVisual({
  phase,
  size = 260,
  glow = true,
  className,
}: MoonVisualProps) {
  const R = 100;
  const litPath = getLitPath(phase, R);
  const illum = Math.round(
    ((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100,
  );
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, "");

  // Full circle path (clockwise).
  const fullCircle = `M 0 ${-R} A ${R} ${R} 0 1 1 0 ${R} A ${R} ${R} 0 1 1 0 ${-R} Z`;
  // Dark overlay = full circle + lit path, with evenodd fill so the lit
  // region is cut out (transparent), showing the photo underneath.
  const darkPath = litPath ? `${fullCircle} ${litPath}` : fullCircle;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      {/* Glow layers */}
      {glow && (
        <>
          <div aria-hidden style={{
            position: "absolute", inset: "-35%", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(56,116,203,0.14) 38%, transparent 68%)",
            filter: "blur(22px)", pointerEvents: "none", zIndex: -1,
          }} />
          <div aria-hidden style={{
            position: "absolute", inset: "-18%", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(199,210,254,0.45) 0%, rgba(165,180,252,0.22) 42%, transparent 70%)",
            filter: "blur(12px)", pointerEvents: "none", zIndex: -1,
          }} />
          <div aria-hidden style={{
            position: "absolute", inset: "-6%", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(255,238,200,0.4) 0%, rgba(255,248,225,0.16) 40%, transparent 66%)",
            filter: "blur(6px)", pointerEvents: "none", zIndex: -1,
          }} />
        </>
      )}

      {/* Real lunar surface photo (full disk). Always loads reliably as HTML img. */}
      <img
        src="/moon-albedo.png"
        alt={`Moon phase visualization showing ${illum} percent illumination`}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />

      {/* SVG overlay: fills the unlit portion with earthshine, cutting out
          the lit region via fill-rule="evenodd" so the photo shows through. */}
      <svg
        viewBox="-120 -120 240 240"
        width={size}
        height={size}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <defs>
          <radialGradient id={`eg-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a3358" />
            <stop offset="45%" stopColor="#1a2240" />
            <stop offset="80%" stopColor="#0e1428" />
            <stop offset="100%" stopColor="#080c1c" />
          </radialGradient>
          <radialGradient id={`lg-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="88%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
          </radialGradient>
        </defs>
        {/* Dark earthshine fill with lit region cut out (evenodd). */}
        <path
          d={darkPath}
          fillRule="evenodd"
          fill={`url(#eg-${uid})`}
        />
        {/* Limb darkening over the whole disk. */}
        <circle cx="0" cy="0" r={R} fill={`url(#lg-${uid})`} />
      </svg>

      {/* Warm luminous rim ring. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          boxShadow:
            "inset 0 0 0 1px rgba(255,240,210,0.22), 0 0 18px rgba(199,210,254,0.3)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
