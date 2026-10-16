"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getLitPath, getPhaseEmoji } from "@/lib/moon";
import { useToast } from "@/hooks/use-toast";

interface MoonVisualProps {
  phase: number;
  size?: number;
  glow?: boolean;
  className?: string;
  /** Show the click-to-copy emoji affordance. Defaults to true. */
  copyable?: boolean;
}

/*
  Beautiful, accurate Moon renderer.
  ----------------------------------
  Uses a real lunar surface photograph as the albedo map. Each pixel is
  shaded with a Lambertian factor derived from the ACTUAL sun direction
  for the current phase, so the lit side, terminator, and limb darkening
  are all physically correct.

  Stylized color grade (matching the reference aesthetic):
    - Lit side: warm cream / pale gold (complementary warm tone)
    - Dark side: teal-blue earthshine that shows the real surface texture

  Double halo: a dark indigo inner ring + a warm amber outer glow.

  Click the moon to copy the current phase emoji to the clipboard.

  Falls back to a phase-accurate SVG silhouette if canvas/texture fail.
*/

const TEX = 640;

interface MoonTexture {
  albedo: Float32Array;
  mask: Uint8Array;
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
      if (d > R + 1) {
        mask[idx] = 0;
        continue;
      }
      mask[idx] = 1;
      const si = idx * 4;
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
 * Renders the Moon with accurate Lambertian shading and a stylized
 * warm-cream lit side + teal-blue earthshine dark side.
 */
function renderMoon(
  ctx: CanvasRenderingContext2D,
  phase: number,
  tex: MoonTexture,
  imageData: ImageData,
) {
  const N = TEX;
  const { albedo, mask, cx, cy, R } = tex;
  const theta = 2 * Math.PI * phase;
  const sx = Math.sin(theta);
  const sy = 0;
  const sz = -Math.cos(theta);
  const data = imageData.data;

  // Warm cream tint for the lit side (pale gold).
  const litR = 1.16,
    litG = 1.08,
    litB = 0.86;
  // Teal-blue tint for the earthshine dark side (shows surface texture).
  const darkR = 0.16,
    darkG = 0.24,
    darkB = 0.4;
  // Earthshine intensity (how much of the surface shows on the dark side).
  const earthshine = 0.42;

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
      const nx = (x - cx) / R;
      const ny = (y - cy) / R;
      const r2 = nx * nx + ny * ny;
      const nz = Math.sqrt(Math.max(0, 1 - r2));
      const lambert = nx * sx + ny * sy + nz * sz;
      let intensity = smoothstep(-0.03, 0.16, lambert);
      // Gentle limb darkening.
      intensity *= 0.74 + 0.26 * nz;
      const ni = idx * 3;
      const aR = albedo[ni];
      const aG = albedo[ni + 1];
      const aB = albedo[ni + 2];
      // Lit side: warm cream color grade over the real surface.
      // Dark side: teal-blue earthshine that keeps the surface texture visible.
      const r =
        aR * litR * intensity + aR * darkR * earthshine * (1 - intensity);
      const g =
        aG * litG * intensity + aG * darkG * earthshine * (1 - intensity);
      const b =
        aB * litB * intensity + aB * darkB * earthshine * (1 - intensity);
      data[p] = Math.min(255, r * 255);
      data[p + 1] = Math.min(255, g * 255);
      data[p + 2] = Math.min(255, b * 255);
      data[p + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// ---------- SVG fallback ----------
function MoonSvg({ phase, size }: { phase: number; size: number }) {
  const R = 100;
  const litPath = getLitPath(phase, R);
  // Unique IDs so multiple moons on one page don't collide.
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, "");
  const litId = `moon-lit-fb-${uid}`;
  const darkId = `moon-dark-fb-${uid}`;
  const clipId = `moon-clip-fb-${uid}`;
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
        <radialGradient id={litId} cx="34%" cy="30%" r="82%">
          <stop offset="0%" stopColor="#fff8e6" />
          <stop offset="40%" stopColor="#f5ead0" />
          <stop offset="74%" stopColor="#d9c89a" />
          <stop offset="100%" stopColor="#9c8a5a" />
        </radialGradient>
        <radialGradient id={darkId} cx="68%" cy="70%" r="85%">
          <stop offset="0%" stopColor="#1a2a3a" />
          <stop offset="60%" stopColor="#0e1828" />
          <stop offset="100%" stopColor="#080c1c" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx="0" cy="0" r={R} />
        </clipPath>
      </defs>
      <circle cx="0" cy="0" r={R} fill={`url(#${darkId})`} />
      <g clipPath={`url(#${clipId})`}>
        {litPath && <path d={litPath} fill={`url(#${litId})`} />}
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
  copyable = true,
}: MoonVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const phaseBucket = Math.round(phase * 200) / 200;

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const doRender = () => {
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
    };

    // Lazy-render: only process the canvas when the moon scrolls into
    // view. This avoids rendering 8 heavy canvases up-front on long
    // pages (e.g. the Moon Phases guide).
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            doRender();
            observer?.disconnect();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(canvas);
    } else {
      doRender();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [phaseBucket]);

  const illum = Math.round(
    ((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100,
  );
  const emoji = getPhaseEmoji(phase);

  const handleCopy = async () => {
    if (!copyable) return;
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(true);
      toast({
        title: "Moon emoji copied",
        description: `${emoji}  ${emoji}  ${emoji}  paste it anywhere.`,
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({
        title: "Could not copy",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size }}
    >
      {/* Double halo: dark indigo inner ring + warm amber outer glow. */}
      {glow && (
        <>
          {/* Warm amber outer glow. */}
          <div aria-hidden style={{
            position: "absolute", inset: "-32%", borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(217,164,74,0.3) 0%, rgba(184,134,11,0.16) 40%, transparent 70%)",
            filter: "blur(20px)", pointerEvents: "none",
          }} />
          {/* Soft blue-violet mid corona. */}
          <div aria-hidden style={{
            position: "absolute", inset: "-16%", borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(129,140,248,0.28) 0%, rgba(99,102,241,0.14) 45%, transparent 72%)",
            filter: "blur(12px)", pointerEvents: "none",
          }} />
          {/* Tight warm glow hugging the lit limb. */}
          <div aria-hidden style={{
            position: "absolute", inset: "-5%", borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(255,238,200,0.4) 0%, rgba(255,248,225,0.16) 40%, transparent 66%)",
            filter: "blur(6px)", pointerEvents: "none",
          }} />
        </>
      )}

      {/* The moon (clickable to copy the emoji). */}
      <button
        type="button"
        onClick={handleCopy}
        disabled={!copyable}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`Moon phase showing ${illum} percent illumination. Click to copy the ${emoji} emoji.`}
        style={{
          position: "relative",
          width: size,
          height: size,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: copyable ? "pointer" : "default",
          borderRadius: "50%",
        }}
      >
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
            "inset 0 0 0 1px rgba(255,240,210,0.2), 0 0 16px rgba(217,164,74,0.26)",
          pointerEvents: "none",
        }} />
      </button>

      {/* Click-to-copy hint badge (appears on hover/focus, only when copyable). */}
      {copyable && (hovered || copied) && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "2%",
            right: "2%",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 9px",
            borderRadius: "9999px",
            background: copied
              ? "rgba(16,185,129,0.92)"
              : "rgba(15,18,38,0.88)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.01em",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          {copied ? "Copied!" : `${emoji} Copy`}
        </div>
      )}
    </div>
  );
}
