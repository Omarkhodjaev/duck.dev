"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/dom";

// AudioContext ni modul darajasida saqlaymiz (sahifa o'tishida ham yashaydi)
let actx: AudioContext | null = null;

function playQuack() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    actx = actx || new Ctx();
    if (actx.state === "suspended") actx.resume();

    const t = actx.currentTime;
    const dur = 0.2 + Math.random() * 0.05;
    const base = 220 + Math.random() * 70;

    // Asosiy "buzzy" ton — o'rdak ovozining yadrosi
    const osc = actx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(base * 2.3, t + 0.05);
    osc.frequency.exponentialRampToValueAtTime(base * 0.8, t + dur);

    // Yengil vibrato — tabiiyroq "qaqillash"
    const lfo = actx.createOscillator();
    const lfoGain = actx.createGain();
    lfo.frequency.value = 28;
    lfoGain.gain.value = base * 0.18;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Formant filtrlari — "aw/quack" tembri
    const bp = actx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(950, t);
    bp.frequency.linearRampToValueAtTime(1750, t + 0.06);
    bp.frequency.linearRampToValueAtTime(700, t + dur);
    bp.Q.value = 6;

    const peak = actx.createBiquadFilter();
    peak.type = "peaking";
    peak.frequency.value = 1250;
    peak.Q.value = 4;
    peak.gain.value = 9;

    // Amplituda konverti — tez attack, qisqa decay
    const gain = actx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.55, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(bp);
    bp.connect(peak);
    peak.connect(gain);
    gain.connect(actx.destination);

    osc.start(t);
    lfo.start(t);
    osc.stop(t + dur + 0.02);
    lfo.stop(t + dur + 0.02);
  } catch {
    /* tovush qo'llab-quvvatlanmasa — jim qolamiz */
  }
}

export default function LogoMark() {
  const ref = useRef<HTMLImageElement>(null);

  function onClick() {
    playQuack();
    const el = ref.current;
    if (el && !prefersReducedMotion()) {
      el.classList.remove("quack");
      void el.offsetWidth; // animatsiyani qayta ishga tushirish uchun reflow
      el.classList.add("quack");
    }
  }

  return (
    <img
      ref={ref}
      className="logo-mark"
      src="/logo.svg"
      alt=""
      width={30}
      height={30}
      onClick={onClick}
    />
  );
}
