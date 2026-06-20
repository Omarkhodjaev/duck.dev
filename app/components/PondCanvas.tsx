"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/dom";

type RGB = [number, number, number];

interface Orb {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  color: RGB;
  depth: number;
}

interface Ripple {
  x: number;
  y: number;
  life: number;
  max: number;
  color: RGB;
}

/**
 * Interaktiv "hovuz" foni: sekin suzuvchi rangli orblar (logo palitrasida),
 * kursor bo'yicha parallaks va bosilganda tarqaladigan to'lqin halqalari.
 * Canvas o'zi blur(CSS) bilan yumshatiladi — shuning uchun arzon va silliq.
 */
export default function PondCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // Closure ichida narrowing yo'qolmasligi uchun aniq non-null tipli const'lar
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;
    const reduce = prefersReducedMotion();

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    const orbs: Orb[] = [];
    const ripples: Ripple[] = [];
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    function readColors(): RGB[] {
      const s = getComputedStyle(document.documentElement);
      return [
        s.getPropertyValue("--accent").trim() || "#b75c34",
        s.getPropertyValue("--gold").trim() || "#e6a423",
        s.getPropertyValue("--teal").trim() || "#3b4c4a",
      ].map(toRgb);
    }
    let colors = readColors();

    function toRgb(hex: string): RGB {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      const n = parseInt(c, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function rgba([r, g, b]: RGB, a: number): string {
      return `rgba(${r},${g},${b},${a})`;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initOrbs() {
      orbs.length = 0;
      const n = 6;
      for (let i = 0; i < n; i++) {
        orbs.push({
          x: Math.random(),
          y: Math.random(),
          r: 160 + Math.random() * 260,
          dx: (Math.random() - 0.5) * 0.00018,
          dy: (Math.random() - 0.5) * 0.00018,
          color: colors[i % colors.length],
          depth: 0.25 + Math.random() * 0.85,
        });
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, w, h);

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const px = pointer.x - 0.5;
      const py = pointer.y - 0.5;

      for (const o of orbs) {
        o.x += o.dx;
        o.y += o.dy;
        if (o.x < -0.25) o.x = 1.25;
        if (o.x > 1.25) o.x = -0.25;
        if (o.y < -0.25) o.y = 1.25;
        if (o.y > 1.25) o.y = -0.25;

        const cx = (o.x + px * 0.07 * o.depth) * w;
        const cy = (o.y + py * 0.07 * o.depth) * h;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        g.addColorStop(0, rgba(o.color, 0.5));
        g.addColorStop(1, rgba(o.color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.life += 0.012;
        const p = rp.life / 1;
        if (p >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        const ease = 1 - Math.pow(1 - p, 2);
        const rad = ease * rp.max;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rad, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(rp.color, (1 - p) * 0.55);
        ctx.lineWidth = 2.5 * (1 - p) + 0.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rad * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(rp.color, (1 - p) * 0.3);
        ctx.lineWidth = 1.5 * (1 - p);
        ctx.stroke();
      }
    }

    function loop() {
      drawFrame();
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = e.clientY / window.innerHeight;
    }
    function onDown(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        life: 0,
        max: 220 + Math.random() * 120,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      if (ripples.length > 12) ripples.shift();
    }
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduce) {
        raf = requestAnimationFrame(loop);
      }
    }
    function onResize() {
      resize();
    }

    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      orbs.forEach((o, i) => (o.color = colors[i % colors.length]));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    initOrbs();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) {
      drawFrame();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="pond-canvas" aria-hidden="true" />;
}
