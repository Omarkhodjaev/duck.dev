"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/dom";

/**
 * Pat (feather) ko'rinishidagi maxsus kursor.
 * Sichqonchani silliq kuzatadi, harakat tezligiga qarab chayqaladi,
 * havola/tugma ustida kattalashadi, bosilganda kichrayadi.
 * Faqat "fine pointer" qurilmalarda (sensorli ekranlarda yo'q).
 */
export default function CursorFeather() {
  const outer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasFinePointer()) return;

    const reduce = prefersReducedMotion();
    const el = outer.current;
    const root = document.documentElement;
    root.classList.add("has-feather");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let prevX = x;
    let rot = -35;
    let raf = 0;
    let visible = false;

    const follow = reduce ? 0.45 : 0.2;

    function onMove(e: PointerEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        if (el) el.style.opacity = "1";
      }
    }
    function onDown() {
      root.classList.add("feather-press");
    }
    function onUp() {
      root.classList.remove("feather-press");
    }
    function onOver(e: PointerEvent) {
      const t = e.target as Element | null;
      const interactive =
        t &&
        t.closest(
          "a, button, input, textarea, select, [role='button'], .theme-toggle, [data-tilt], .chip"
        );
      root.classList.toggle("feather-active", !!interactive);
    }
    function onLeave() {
      visible = false;
      if (el) el.style.opacity = "0";
    }

    function loop() {
      x += (tx - x) * follow;
      y += (ty - y) * follow;
      if (!reduce) {
        const vx = tx - prevX;
        prevX = tx;
        const target = -35 + Math.max(-26, Math.min(26, vx * 1.4));
        rot += (target - rot) * 0.14;
      }
      if (el) el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      root.classList.remove("has-feather", "feather-active", "feather-press");
    };
  }, []);

  return (
    <div ref={outer} className="cursor-feather" aria-hidden="true">
      <div className="feather-inner">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <defs>
            <linearGradient
              id="featherGrad"
              x1="2"
              y1="2"
              x2="28"
              y2="29"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#efe9de" />
            </linearGradient>
          </defs>
          {/* Pat tanasi (vane) — oq, nozik kontur bilan */}
          <path
            d="M2 2 C 15 3 26 9 30 21 C 31 25 28 29 23.5 29 C 12.5 30 4 22.5 2.6 11 C 2 8 2 5 2 2 Z"
            fill="url(#featherGrad)"
            stroke="rgba(45,35,25,0.22)"
            strokeWidth="0.8"
          />
          {/* Patcha tomirlari (barbs) — yumshoq tuk effekti */}
          <g
            stroke="rgba(120,108,92,0.35)"
            strokeWidth="0.8"
            strokeLinecap="round"
          >
            <path d="M5 4.5 L 11 5.5" />
            <path d="M7 7.5 L 15 9" />
            <path d="M9 11 L 20 13" />
            <path d="M11.5 14.5 L 24 17" />
            <path d="M14.5 18.5 L 26 21.5" />
            <path d="M18 22.5 L 25.5 25.5" />
          </g>
          {/* O'q (rachis) */}
          <path
            d="M2.4 2.4 L 23 27.5"
            stroke="rgba(90,78,64,0.55)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
