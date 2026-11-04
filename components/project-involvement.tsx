"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { projectInvolvementData } from "@/lib/data";
import { HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";

type Item = (typeof projectInvolvementData)[number];
const total = projectInvolvementData.length;
const keyOf = (p: Item) => `${p.name}-${p.product}`;

function CardBody({ p, i }: { p: Item; i: number }) {
  return (
    <>
      <div className="e-inv__head">
        <span className="e-inv__n e-mono" aria-hidden="true">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div>
          {"recent" in p && p.recent && <span className="e-inv__badge e-mono">Most recent</span>}
          <h3>{p.name}</h3>
          <p className="e-inv__product">{p.product}</p>
        </div>
        <ul className="e-inv__roles" aria-label="My role">
          {p.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <ul className="e-inv__tech" aria-label="Tools and tech">
          {p.tech.map((t) => (
            <li key={t} className="e-mono">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="e-inv__body">
        <ul className="e-inv__points">
          {p.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
        <Link href={p.href} className="e-inv__link">
          View case study
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </>
  );
}

/**
 * A card in the deck. `active` is the scroll position measured in cards (0 → total-1):
 * cards already passed fly up and fade, the current card sits on top, later cards wait behind it, smaller and lower.
 */
function DeckCard({ p, i, active }: { p: Item; i: number; active: MotionValue<number> }) {
  const d = useTransform(active, (a) => i - a);
  const y = useTransform(d, (v) => (v < 0 ? `${v * 115}%` : `${Math.min(v, 3) * 1.6}rem`));
  const scale = useTransform(d, (v) => (v < 0 ? 1 : 1 - Math.min(v, 3) * 0.06));
  const rotate = useTransform(d, (v) => (v < 0 ? v * 7 : 0));
  const opacity = useTransform(d, (v) => (v < 0 ? Math.max(0, 1 + v * 2.5) : v > 3 ? 0 : 1));
  const shade = useTransform(d, (v) => Math.min(Math.max(v, 0), 3) * 0.16);

  return (
    <motion.article className="e-inv__item" style={{ y, scale, rotate, opacity, zIndex: total - i }}>
      <CardBody p={p} i={i} />
      <motion.span className="e-inv__shade" style={{ opacity: shade }} aria-hidden="true" />
    </motion.article>
  );
}

/** The deck only runs on wide screens with motion allowed; elsewhere the cards are a plain list. */
function useDeck() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return on;
}

/** The pinned deck. Its own component so useScroll binds to the wrapper once it exists. */
function Deck({ intro }: { intro: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  // Leave a short hold on the last card before the section scrolls away.
  const active = useTransform(scrollYProgress, (v) => Math.min(total - 1, v * (total - 0.6)));
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(active, "change", (v) => setCurrent(Math.min(total - 1, Math.round(v))));

  const goTo = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const travel = wrap.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (total - 0.6)) * travel + 2, behavior: "smooth" });
  };

  return (
    <section id="involvement" data-ground="blue" className="g-blue-diag e-inv is-deck">
      <div ref={wrapRef} className="e-inv__wrap" style={{ height: `${total * 75 + 40}vh` }}>
        <div className="e-inv__stage e-container">
          <div className="e-inv__intro">
            {intro}
            <div className="e-inv__nav" role="tablist" aria-label="Projects">
              {projectInvolvementData.map((p, i) => (
                <button
                  key={keyOf(p)}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`${p.name}: ${p.product}`}
                  onClick={() => goTo(i)}
                >
                  <span className="e-mono">{String(i + 1).padStart(2, "0")}</span>
                  {p.name}
                  <em>{p.product}</em>
                </button>
              ))}
            </div>
          </div>
          <div className="e-inv__deck">
            {projectInvolvementData.map((p, i) => (
              <DeckCard key={keyOf(p)} p={p} i={i} active={active} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectInvolvement() {
  const deck = useDeck();

  const intro = (
    <>
      <Reveal>
        <HandTag tilt={-2}>recent project involvement</HandTag>
      </Reveal>
      <SplitHeading
        className="e-inv__title"
        lines={[{ text: "What I’ve been", block: true }, { text: "building lately", className: "is-white", block: true }]}
      />
      <Reveal delay={1} as="p" className="e-lead">
        Products I’ve shaped recently, from the first research session to the final front-end build.
      </Reveal>
    </>
  );

  if (deck) return <Deck intro={intro} />;

  return (
    <section id="involvement" data-ground="blue" className="e-section g-blue-diag e-inv">
      <div className="e-container">
        {intro}
        <ol className="e-inv__list">
          {projectInvolvementData.map((p, i) => (
            <Reveal as="li" key={keyOf(p)} delay={(i % 3) as 0 | 1 | 2}>
              <article className="e-inv__item">
                <CardBody p={p} i={i} />
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
