"use client";

import { useEffect, useRef } from "react";
import { getLitPath } from "@/lib/moon";

interface MoonVisualProps {
  phase: number;
  size?: number;
  glow?: boolean;
  className?: string;
}

/*
  Accurate, beautiful Moon renderer.
  ----------------------------------
  Uses a real lunar surface photograph as the albedo map. Each pixel is
  shaded with a Lambertian factor derived from the ACTUAL sun direction
  for the current phase, so the lit side, terminator, and limb darkening
  are all physically correct for every phase (crescent, quarter, gibbous,
  full). The real surface detail (craters, maria, rays) shows through
  with natural, phase-matched shading — no muddy bump-mapping, no flat
  full-moon lighting on a crescent.

  Sun direction (viewer at +z):
    new moon      -> sun behind sphere   (-z)  -> dark disk + earthshine
    first quarter -> sun from the right  (+x)  -> right half lit
    full moon     -> sun behind viewer   (+z)  -> whole disk lit, limb darkened
    last quarter  -> sun from the left   (-x)  -> left half lit

  Falls back to a phase-accurate SVG silhouette if canvas/texture fail.
*/

const TEX = 640;

interface MoonTexture {
  albedo: Float32Array; // TEX*TEX*3 (linear RGB 0..1)
  mask: Uint8Array; // 1 inside disk, 0 outside
  cx: number;
  cy: number;
  R: number;
}

let cachedTexture: MoonTexture | null = null;
let cachedPromise: Promise<MoonTexture | null> | null = null;

function loadTexture(): Promise<MoonTexture | null> {
  if (cachedTexture) return Promise.resolve(cachedTexture);
  if (cachedPromise) return cachedPromise;
  cachedPromise = new Promise((resolve) => {
    const img = new Image();
    // Same-origin image; do NOT set crossOrigin (it triggers a CORS
    // request that taints the canvas if the dev server omits CORS headers).
    img.onload = () => {
      try {
        resolve(buildTexture(img));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = "/moon-albedo.png";
  });
  return cachedPromise;
}

function buildTexture(img: HTMLImageElement): MoonTexture {
  const N = TEX;
  const off = document.createElement("canvas");
  off.width = N;
  off.height = N;
  const offCtx = off.getContext("2d", { willReadFrequently: true });
  if (!offCtx) throw new Error("no 2d context");
  offCtx.drawImage(img, 0, 0, N, N);
  const src = offCtx.getImageData(0, 0, N, N).data;

  const albedo = new Float32Array(N * N * 3);
  const mask = new Uint8Array(N * N);
  const cx = (N - 1) / 2;
  const cy = (N - 1) / 2;

  // Detect disk radius by scanning from center along +x.
  const lumAt = (x: number, y: number) => {
    const i = (y * N + x) * 4;
    return (src[i] + src[i + 1] + src[i + 2]) / 3;
  };
  let R = N / 2 - 2;
  for (let x = Math.floor(cx); x < N; x++) {
    if (lumAt(x, Math.floor(cy)) < 28) {
      R = x - cx - 1;
      break;
    }
  }
  R = Math.max(R, N * 0.4);

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const idx = y * N + x;
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      // Circular mask with a 1px anti-aliased edge.
      if (d > R + 1) {
        mask[idx] = 0;
        continue;
      }
      mask[idx] = 1;
      const si = idx * 4;
      // Keep the photo's natural albedo and contrast (no lift, no wash-out).
      albedo[idx * 3] = src[si] / 255;
      albedo[idx * 3 + 1] = src[si + 1] / 255;
      albedo[idx * 3 + 2] = src[si + 2] / 255;
    }
  }

  cachedTexture = { albedo, mask, cx, cy, R };
  return cachedTexture;
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/**
 * Renders the Moon with accurate Lambertian shading from the phase-derived
 * sun direction. The real surface photo is multiplied by the light factor,
 * so the lit side, terminator, and limb darkening are all physically
 * correct. Earthshine fills the dark side with a soft blue-grey glow.
 */
function renderMoon(
  ctx: CanvasRenderingContext2D,
  phase: number,
  tex: MoonTexture,
  imageData: ImageData,
) {
  const N = TEX;
  const { albedo, mask, cx, cy, R } = tex;
  // Sun direction from the phase. This is the real geometry: the phase
  // angle equals the Moon's orbit angle, and the sun illuminates from
  // the side that produces the observed lit fraction.
  const theta = 2 * Math.PI * phase;
  const sx = Math.sin(theta);
  const sy = 0;
  const sz = -Math.cos(theta);
  const data = imageData.data;
  // Soft earthshine on the night side (blue-grey).
  const eR = 0.05,
    eG = 0.058,
    eB = 0.082;

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const idx = y * N + x;
      const p = idx * 4;
      if (!mask[idx]) {
        data[p] = 0;
        data[p + 1] = 0;
        data[p + 2] = 0;
        data[p + 3] = 0;
        continue;
      }
      // Sphere surface normal (normalized).
      const nx = (x - cx) / R;
      const ny = (y - cy) / R;
      const r2 = nx * nx + ny * ny;
      const nz = Math.sqrt(Math.max(0, 1 - r2));
      // Lambertian: dot of normal and sun direction.
      const lambert = nx * sx + ny * sy + nz * sz;
      // Soft (penumbral) terminator.
      let intensity = smoothstep(-0.03, 0.16, lambert);
      // Limb darkening (~30% darker at the limb vs center).
      intensity *= 0.7 + 0.3 * nz;
      const dark = 1 - intensity;
      const ni = idx * 3;
      const r = albedo[ni] * intensity + eR * dark;
      const g = albedo[ni + 1] * intensity + eG * dark;
      const b = albedo[ni + 2] * intensity + eB * dark;
      data[p] = Math.min(255, r * 255);
      data[p + 1] = Math.min(255, g * 255);
      data[p + 2] = Math.min(255, b * 255);
      data[p + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// ---------- SVG fallback (phase-accurate silhouette) ----------
function MoonSvg({ phase, size }: { phase: number; size: number }) {
  const R = 100;
  const litPath = getLitPath(phase, R);
  return (
    <svg
      viewBox="-120 -120 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={`Moon phase visualization showing ${Math.round(
        ((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100,
      )} percent illumination`}
    >
      <defs>
        <radialGradient id="moon-lit-fb" cx="34%" cy="30%" r="82%">
          <stop offset="0%" stopColor="#fffefb" />
          <stop offset="40%" stopColor="#eef0ff" />
          <stop offset="74%" stopColor="#c3cbef" />
          <stop offset="100%" stopColor="#7e89c4" />
        </radialGradient>
        <radialGradient id="moon-dark-fb" cx="68%" cy="70%" r="85%">
          <stop offset="0%" stopColor="#1a2240" />
          <stop offset="60%" stopColor="#0e1428" />
          <stop offset="100%" stopColor="#080c1c" />
        </radialGradient>
        <clipPath id="moon-clip-fb">
          <circle cx="0" cy="0" r={R} />
        </clipPath>
      </defs>
      <circle cx="0" cy="0" r={R} fill="url(#moon-dark-fb)" />
      <g clipPath="url(#moon-clip-fb)">
        {litPath && <path d={litPath} fill="url(#moon-lit-fb)" />}
      </g>
      <circle cx="0" cy="0" r={R} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
    </svg>
  );
}

export function MoonVisual({
  phase,
  size = 260,
  glow = true,
  className,
}: MoonVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  // Quantize so the canvas only re-renders when the phase meaningfully
  // changes (the Moon moves slowly through its cycle).
  const phaseBucket = Math.round(phase * 200) / 200;

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (canvas.width !== TEX) {
      canvas.width = TEX;
      canvas.height = TEX;
    }
    if (!imageDataRef.current) {
      imageDataRef.current = ctx.createImageData(TEX, TEX);
    }
    loadTexture().then((tex) => {
      if (cancelled || !tex) return;
      try {
        renderMoon(ctx, phaseBucket, tex, imageDataRef.current!);
        canvas.style.opacity = "1";
      } catch {
        // SVG fallback stays visible.
      }
    });
    return () => {
      cancelled = true;
    };
  }, [phaseBucket]);

  const illum = Math.round(
    ((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100,
  );

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size }}
    >
      {/* Beautiful luminous corona behind the Moon. */}
      {glow && (
        <>
          <div aria-hidden style={{
            position: "absolute", inset: "-35%", borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(56,116,203,0.14) 38%, transparent 68%)",
            filter: "blur(22px)", pointerEvents: "none",
          }} />
          <div aria-hidden style={{
            position: "absolute", inset: "-18%", borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(199,210,254,0.45) 0%, rgba(165,180,252,0.22) 42%, transparent 70%)",
            filter: "blur(12px)", pointerEvents: "none",
          }} />
          <div aria-hidden style={{
            position: "absolute", inset: "-6%", borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(255,238,200,0.4) 0%, rgba(255,248,225,0.16) 40%, transparent 66%)",
            filter: "blur(6px)", pointerEvents: "none",
          }} />
        </>
      )}

      {/* SVG fallback: visible until the canvas finishes rendering. */}
      <div style={{ position: "absolute", inset: 0, transition: "opacity 0.5s ease" }}>
        <MoonSvg phase={phase} size={size} />
      </div>

      {/* Accurate canvas Moon (fades in once rendered). */}
      <canvas
        ref={canvasRef}
        width={TEX}
        height={TEX}
        role="img"
        aria-label={`Realistic moon phase visualization showing ${illum} percent illumination`}
        style={{
          position: "absolute",
          inset: 0,
          width: size,
          height: size,
          opacity: 0,
          transition: "opacity 0.6s ease",
          borderRadius: "50%",
        }}
      />

      {/* Warm luminous rim ring. */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        boxShadow:
          "inset 0 0 0 1px rgba(255,240,210,0.18), 0 0 16px rgba(199,210,254,0.28)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
