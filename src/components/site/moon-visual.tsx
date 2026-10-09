"use client";

import { useEffect, useRef } from "react";
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

/*
  Realistic Moon renderer (texture-based).
  ----------------------------------------
  Uses a real lunar surface photograph (the near side at full phase) as the
  albedo map. A height map is derived from the albedo (bright highlands are
  high, dark maria and crater floors are low), and per-pixel surface normals
  are computed from that height map so crater and terrain shadows move
  correctly as the Sun sweeps across the cycle.

  Final shading is Lambertian from the phase-derived Sun direction, with a
  soft (penumbral) terminator, realistic limb darkening, and faint
  earthshine on the night side. At full moon the result reproduces the
  source photograph; at a crescent only a thin sliver is lit.

  Falls back to a phase-accurate SVG silhouette if the image or canvas is
  unavailable.
*/

const TEX = 640;

interface MoonTexture {
  albedo: Float32Array; // TEX*TEX*3 (linear RGB 0..1)
  normals: Float32Array; // TEX*TEX*3 (normalized surface normals)
  mask: Uint8Array; // 1 inside the disk, 0 outside
}

let cachedTexture: MoonTexture | null = null;
let cachedPromise: Promise<MoonTexture | null> | null = null;

/**
 * Loads the lunar albedo image, extracts the disk (with a circular mask),
 * derives a height map from the albedo (bright = high), and computes
 * per-pixel surface normals. Cached after the first load.
 */
function loadTexture(): Promise<MoonTexture | null> {
  if (cachedTexture) return Promise.resolve(cachedTexture);
  if (cachedPromise) return cachedPromise;

  cachedPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const tex = buildTextureFromImage(img);
        cachedTexture = tex;
        resolve(tex);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = "/moon-albedo.png";
  });
  return cachedPromise;
}

function buildTextureFromImage(img: HTMLImageElement): MoonTexture {
  const N = TEX;
  // Draw the image to an offscreen canvas at the target resolution.
  const off = document.createElement("canvas");
  off.width = N;
  off.height = N;
  const offCtx = off.getContext("2d", { willReadFrequently: true });
  if (!offCtx) throw new Error("no 2d context");
  offCtx.drawImage(img, 0, 0, N, N);
  const src = offCtx.getImageData(0, 0, N, N).data;

  const albedo = new Float32Array(N * N * 3);
  const normals = new Float32Array(N * N * 3);
  const mask = new Uint8Array(N * N);
  const height = new Float32Array(N * N);

  const cx = (N - 1) / 2;
  const cy = (N - 1) / 2;

  // Detect the disk radius by scanning from the center along +x.
  const lumAt = (x: number, y: number) => {
    const i = (y * N + x) * 4;
    return (src[i] + src[i + 1] + src[i + 2]) / 3;
  };
  let diskR = N / 2 - 2;
  for (let x = Math.floor(cx); x < N; x++) {
    if (lumAt(x, Math.floor(cy)) < 28) {
      diskR = x - cx - 1;
      break;
    }
  }
  diskR = Math.max(diskR, N * 0.4);

  // 1. Build the mask (circular, with a 2px anti-aliased edge) and copy
  //    albedo from the image. Slightly normalize the albedo by lifting
  //    very dark values so maria still show subtle detail in shade.
  const R = diskR;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const idx = y * N + x;
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      // Soft circular edge.
      const edge = d > R + 1 ? 0 : d > R - 1 ? (R + 1 - d) / 2 : 1;
      if (edge <= 0) {
        mask[idx] = 0;
        continue;
      }
      mask[idx] = 1;
      const si = idx * 4;
      // Slight gamma lift on the albedo so dark maria retain visible
      // texture when shaded.
      const lift = 0.03;
      albedo[idx * 3] = (src[si] / 255) * (1 - lift) + lift;
      albedo[idx * 3 + 1] = (src[si + 1] / 255) * (1 - lift) + lift;
      albedo[idx * 3 + 2] = (src[si + 2] / 255) * (1 - lift) + lift;
    }
  }

  // 2. Height map from albedo luminance (bright = high). Smooth with a
  //    small box blur to reduce noise so the normals read as terrain
  //    rather than per-pixel speckle.
  const tmp = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) {
    if (!mask[i]) {
      height[i] = 0;
      continue;
    }
    const l =
      albedo[i * 3] * 0.3 +
      albedo[i * 3 + 1] * 0.59 +
      albedo[i * 3 + 2] * 0.11;
    height[i] = l;
  }
  // 3x3 box blur, 2 passes.
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const idx = y * N + x;
        if (!mask[idx]) {
          tmp[idx] = 0;
          continue;
        }
        let sum = 0;
        let cnt = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || nx >= N || ny < 0 || ny >= N) continue;
            const ni = ny * N + nx;
            if (!mask[ni]) continue;
            sum += height[ni];
            cnt++;
          }
        }
        tmp[idx] = cnt > 0 ? sum / cnt : height[idx];
      }
    }
    height.set(tmp);
  }

  // 3. Per-pixel normals: sphere normal perturbed by the height gradient.
  const bump = 5.0;
  const sphereR = R;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const idx = y * N + x;
      const ni = idx * 3;
      if (!mask[idx]) {
        normals[ni] = 0;
        normals[ni + 1] = 0;
        normals[ni + 2] = 1;
        continue;
      }
      const dxn = (x - cx) / sphereR;
      const dyn = (y - cy) / sphereR;
      const r2 = dxn * dxn + dyn * dyn;
      let nx = dxn;
      let ny = dyn;
      let nz = Math.sqrt(Math.max(0, 1 - r2));
      const xm =
        mask[y * N + Math.max(0, x - 1)] ? height[y * N + Math.max(0, x - 1)] : height[idx];
      const xp =
        mask[y * N + Math.min(N - 1, x + 1)] ? height[y * N + Math.min(N - 1, x + 1)] : height[idx];
      const ym =
        mask[Math.max(0, y - 1) * N + x] ? height[Math.max(0, y - 1) * N + x] : height[idx];
      const yp =
        mask[Math.min(N - 1, y + 1) * N + x] ? height[Math.min(N - 1, y + 1) * N + x] : height[idx];
      const gx = (xp - xm) * 0.5;
      const gy = (yp - ym) * 0.5;
      nx -= gx * bump;
      ny -= gy * bump;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      normals[ni] = nx / len;
      normals[ni + 1] = ny / len;
      normals[ni + 2] = nz / len;
    }
  }

  return { albedo, normals, mask };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Renders the lit Moon: Lambertian shading from the phase-derived Sun
 * direction, soft terminator, limb darkening, earthshine.
 */
function renderMoon(
  ctx: CanvasRenderingContext2D,
  phase: number,
  texture: MoonTexture,
  imageData: ImageData,
) {
  const N = TEX;
  const { albedo, normals, mask } = texture;
  const theta = 2 * Math.PI * phase;
  const sx = Math.sin(theta);
  const sy = 0;
  const sz = -Math.cos(theta);
  const data = imageData.data;
  // Faint earthshine (blue-gray) on the night side. Visible but subtle,
  // as in real crescent-moon photographs.
  const eR = 0.055,
    eG = 0.062,
    eB = 0.085;

  for (let i = 0; i < N * N; i++) {
    const p = i * 4;
    if (!mask[i]) {
      data[p] = 0;
      data[p + 1] = 0;
      data[p + 2] = 0;
      data[p + 3] = 0;
      continue;
    }
    const ni = i * 3;
    const nx = normals[ni];
    const ny = normals[ni + 1];
    const nz = normals[ni + 2];
    const lambert = nx * sx + ny * sy + nz * sz;
    let intensity = smoothstep(-0.02, 0.13, lambert);
    // Limb darkening (~35% darker at the limb vs center).
    intensity *= 0.65 + 0.35 * nz;
    const dark = 1 - intensity;
    const r = albedo[ni] * intensity + eR * dark;
    const g = albedo[ni + 1] * intensity + eG * dark;
    const b = albedo[ni + 2] * intensity + eB * dark;
    data[p] = Math.min(255, r * 255);
    data[p + 1] = Math.min(255, g * 255);
    data[p + 2] = Math.min(255, b * 255);
    data[p + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

// ---------- SVG fallback (phase-accurate silhouette) ----------
function MoonSvg({
  phase,
  size,
  glow,
  className,
}: MoonVisualProps) {
  const R = 100;
  const litPath = getLitPath(phase, R);
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
        <radialGradient id="moon-lit-fb" cx="34%" cy="30%" r="82%">
          <stop offset="0%" stopColor="#fffefb" />
          <stop offset="38%" stopColor="#eef0ff" />
          <stop offset="72%" stopColor="#c3cbef" />
          <stop offset="100%" stopColor="#7e89c4" />
        </radialGradient>
        <radialGradient id="moon-dark-fb" cx="68%" cy="70%" r="85%">
          <stop offset="0%" stopColor="#161a35" />
          <stop offset="60%" stopColor="#0c0f24" />
          <stop offset="100%" stopColor="#05060f" />
        </radialGradient>
        <radialGradient id="moon-rim-fb" cx="50%" cy="50%" r="50%">
          <stop offset="84%" stopColor="rgba(165,180,252,0)" />
          <stop offset="95%" stopColor="rgba(165,180,252,0.4)" />
          <stop offset="100%" stopColor="rgba(165,180,252,0)" />
        </radialGradient>
        <clipPath id="moon-clip-fb">
          <circle cx="0" cy="0" r={R} />
        </clipPath>
      </defs>
      {glow && (
        <circle cx="0" cy="0" r={R + 20} fill="url(#moon-rim-fb)" opacity="0.9" />
      )}
      <circle cx="0" cy="0" r={R} fill="url(#moon-dark-fb)" />
      <g clipPath="url(#moon-clip-fb)">
        <path d={litPath} fill="url(#moon-lit-fb)" />
      </g>
      <circle
        cx="0"
        cy="0"
        r={R}
        fill="none"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth="1.5"
      />
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

export function MoonVisual({
  phase,
  size = 260,
  glow = true,
  className,
}: MoonVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);
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

    loadTexture().then((texture) => {
      if (cancelled || !texture) return; // SVG fallback stays visible.
      try {
        renderMoon(ctx, phaseBucket, texture, imageDataRef.current!);
        canvas.style.opacity = "1";
      } catch {
        // Leave the canvas transparent; the SVG fallback stays visible.
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
      {/* Soft atmospheric glow behind the Moon. */}
      {glow && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-18%",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(165,180,252,0.35) 0%, rgba(56,116,203,0.15) 42%, transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
      )}
      {/* SVG fallback: always present underneath, covered by the canvas
          once the realistic Moon finishes rendering. */}
      <div style={{ position: "absolute", inset: 0 }}>
        <MoonSvg phase={phase} size={size} glow={false} />
      </div>
      {/* Realistic canvas Moon (fades in once rendered). */}
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
    </div>
  );
}
