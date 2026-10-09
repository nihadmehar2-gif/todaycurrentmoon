"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed deep-space backdrop: layered nebula glow plus a canvas starfield
 * with gentle twinkle and slow drift. Rendered once and pinned behind
 * all content.
 */
export function CosmicBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      twinkleSpeed: number;
      phase: number;
      hue: number;
    };

    let stars: Star[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with area but stays bounded.
      const count = Math.min(220, Math.floor((w * h) / 7000));
      stars = Array.from({ length: count }, () => {
        const r = Math.random() * 1.3 + 0.2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          baseAlpha: Math.random() * 0.6 + 0.25,
          twinkleSpeed: Math.random() * 0.9 + 0.2,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() > 0.85 ? 260 : 220,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    let start = performance.now();
    const render = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const alpha = Math.max(
          0.05,
          s.baseAlpha +
            Math.sin(t * s.twinkleSpeed + s.phase) * 0.35 * s.baseAlpha,
        );
        ctx.beginPath();
        ctx.fillStyle =
          s.hue === 260
            ? `rgba(196,181,253,${alpha})`
            : `rgba(255,255,255,${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        // Soft glow on larger stars.
        if (s.r > 1) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(196,181,253,${alpha * 0.12})`;
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="cosmic-bg">
      <div className="nebula" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="stars" />
    </div>
  );
}
