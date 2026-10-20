"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSectionInView } from "@/lib/hooks";
import { CountUp, HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";

const strengths = [
  "Lead UX teams from research to release",
  "Design real-time IoT dashboards people trust",
  "Ship production UI in Next.js & Tailwind",
  "Build atomic design systems that scale",
  "Run user research & usability testing",
  "Translate fluently between design and engineering",
];

const stats = [
  { value: "5+", label: "years designing and building products" },
  { value: "20+", label: "projects shipped across web and mobile" },
  { value: "6", label: "product teams I’ve worked inside" },
  { value: "45%", label: "faster task completion on the SES portal revamp" },
];

function Tick() {
  return (
    <svg className="e-note__tick" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        className="e-note__ring"
        d="M16 3.5c7.5 0 12.5 5.2 12.5 12.3S23.2 28.5 15.6 28.5 3.5 23 3.5 15.9C3.5 9 8.6 3.8 17 3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        className="e-note__check"
        d="M9.5 16.5l4.5 4.5 9-10"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Sticky-note checklist. Ticks itself off one line at a time while on screen,
 * stamps "all sorted", then clears and loops. Clicking a line hands control to the visitor.
 */
function Note() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(() => strengths.map(() => false));
  const [manual, setManual] = useState(false);
  const [popped, setPopped] = useState(-1);
  const allDone = checked.every(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay loop: tick the next line, hold when complete, then clear.
  useEffect(() => {
    if (!visible || manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChecked(strengths.map(() => true));
      return;
    }
    const next = checked.indexOf(false);
    const t =
      next === -1
        ? window.setTimeout(() => setChecked(strengths.map(() => false)), 3200)
        : window.setTimeout(
            () => setChecked((c) => c.map((v, i) => (i === next ? true : v))),
            next === 0 ? 900 : 700
          );
    return () => clearTimeout(t);
  }, [visible, manual, checked]);

  const toggle = (i: number) => {
    setManual(true);
    setChecked((c) => c.map((v, j) => (j === i ? !v : v)));
    setPopped(i);
    window.setTimeout(() => setPopped((p) => (p === i ? -1 : p)), 450);
  };

  return (
    <div ref={ref} className={`e-note ${allDone ? "is-done" : ""}`}>
      <ul className="e-note__list" role="group" aria-label="What I bring">
        {strengths.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              role="checkbox"
              aria-checked={checked[i]}
              className={`e-note__item ${checked[i] ? "is-checked" : ""} ${popped === i ? "is-pop" : ""}`}
              onClick={() => toggle(i)}
            >
              <Tick />
              <span className="e-note__text">{s}</span>
            </button>
          </li>
        ))}
      </ul>
      <span className="e-note__stamp" aria-hidden="true">
        all sorted ✓
      </span>
      <span className="e-note__aside e-hand" aria-hidden="true">
        {manual ? "go on, tick them all" : "and yes, I code too"}
      </span>
    </div>
  );
}

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <section ref={ref} id="about" data-ground="white" className="e-section g-white">
      <div className="e-container">
        <div className="e-about__grid">
          <div className="e-about__bio">
            <Reveal>
              <HandTag>nice to meet you</HandTag>
            </Reveal>
            <SplitHeading lines={[{ text: "Who I am" }]} />
            <Reveal delay={1} className="e-lead mt-7">
              <p>
                Most of the products I work on aren&apos;t starting from nothing. They&apos;re complex platforms,
                real-time dashboards and POS systems that have outgrown their interfaces, and the people using them
                feel it every day.
              </p>
              <p>
                I lead UX from research and flows through to high-fidelity Figma and production-ready front-end, so
                nothing gets lost between the design file and the shipped product.
              </p>
            </Reveal>
            <Reveal delay={2} className="e-about__meta">
              {["IoT", "Fintech", "AI", "POS", "ERP", "Dashboards"].map((t) => (
                <span key={t} className="e-chip e-mono">
                  {t}
                </span>
              ))}
            </Reveal>
          </div>

          <Reveal delay={1}>
            <Note />
          </Reveal>
        </div>

        <div className="e-stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i as 0 | 1 | 2 | 3} className="e-stat">
              <CountUp value={s.value} className="e-stat__num" />
              <span className="e-stat__label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
