"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/dom";

/**
 * Sahifa bo'ylab interaktivlik:
 *  - yuqoridagi scroll-progress chizig'i
 *  - [data-reveal] elementlar scrollda silliq paydo bo'ladi
 *  - [data-tilt] kartalar kursor bo'yicha 3D egiladi + yorug'lik
 *  - [data-count] raqamlar ko'ringanda sanaladi
 * Har bir sahifa o'tishida (pathname) qaytadan ishga tushadi.
 */
export default function InteractionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = prefersReducedMotion();

    // --- scroll progress ---
    const bar = document.getElementById("scroll-progress");
    function onScroll() {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- counters ---
    function animateCount(el) {
      const raw = el.getAttribute("data-count") || "";
      const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
      const suffix = raw.replace(/[0-9.\s]/g, "");
      if (isNaN(num) || reduce) {
        el.textContent = raw;
        return;
      }
      const dur = 1300;
      let start = 0;
      function tick(now) {
        if (!start) start = now;
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(num * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = num + suffix;
      }
      requestAnimationFrame(tick);
    }

    // --- reveal on scroll ---
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          e.target
            .querySelectorAll?.("[data-count]")
            .forEach(animateCount);
          if (e.target.hasAttribute("data-count")) animateCount(e.target);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
    reveals.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${(i % 5) * 70}ms`);
      io.observe(el);
    });

    // --- tilt + cursor glow ---
    const tiltEls = reduce
      ? []
      : Array.from(document.querySelectorAll("[data-tilt]"));

    function onTilt(e) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width;
      const my = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${(mx * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(my * 100).toFixed(2)}%`);
      el.style.setProperty("--rx", `${((0.5 - my) * 7).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((mx - 0.5) * 9).toFixed(2)}deg`);
      el.style.setProperty("--glow", "1");
    }
    function offTilt(e) {
      const el = e.currentTarget;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--glow", "0");
    }
    tiltEls.forEach((el) => {
      el.addEventListener("pointermove", onTilt);
      el.addEventListener("pointerleave", offTilt);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      tiltEls.forEach((el) => {
        el.removeEventListener("pointermove", onTilt);
        el.removeEventListener("pointerleave", offTilt);
      });
    };
  }, [pathname]);

  return null;
}
