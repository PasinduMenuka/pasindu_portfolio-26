"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

/* ────────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────────── */
const SKILLS = [
  { id: 0, icon: "🔍", title: "User Research",   sub: "Interviews & usability tests",     accent: "#00D4FF", gridPos: "top-left",    tag1: "Surveys",   tag2: "Testing"  },
  { id: 1, icon: "✏️", title: "UX Design",       sub: "Lo-fi to hi-fi wireframes",         accent: "#4A90E2", gridPos: "top-right",   tag1: "Figma",     tag2: "A11y"     },
  { id: 2, icon: "🎨", title: "Prototyping",     sub: "Interactive hi-fi flows",           accent: "#A855F7", gridPos: "bottom-left", tag1: "Figma",     tag2: "Lottie"   },
  { id: 3, icon: "⚡", title: "Dev Handoff",     sub: "React & Next.js production code",   accent: "#10B981", gridPos: "bottom-right",tag1: "React",     tag2: "Next.js"  },
] as const;

const PILLS = [
  "UX Strategy", "Information Architecture", "Interaction Design",
  "Accessibility", "Responsive Layouts", "Dev Handoff",
  "A/B Testing", "Cross-team Collaboration",
];

/* 80 stars for the background */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.4 + 0.4,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

/*
  SVG viewBox: 900 x 380
  Left grid: 4 cards (2x2) inside viewBox, with text rendered in SVG foreignObject-style positions.
  Right: central chip at (720, 190)
  Branch lines: each card → a horizontal gather point → chip
*/
const VW = 900;
const VH = 380;

// Card bounding boxes inside SVG (x, y, w, h)
const CARD_BOXES = {
  "top-left":     { x: 30,  y: 40,  w: 190, h: 120 },
  "top-right":    { x: 250, y: 40,  w: 190, h: 120 },
  "bottom-left":  { x: 30,  y: 220, w: 190, h: 120 },
  "bottom-right": { x: 250, y: 220, w: 190, h: 120 },
};

const CHIP_CX = 720;
const CHIP_CY = VH / 2; // 190

// Gather spine: vertical line at x=510
const SPINE_X = 510;
// Column gap between left cards (right edge x=220) and right cards (left edge x=250)
const GAP_X = 232;

// Branch endpoint (right edge of each card)
function cardRight(pos: keyof typeof CARD_BOXES) {
  const b = CARD_BOXES[pos];
  return { x: b.x + b.w, y: b.y + b.h / 2 };
}

/*
  Routing rules so no line ever overlaps another card:

  LEFT cards (right edge x=220):
    Step 1 – short horizontal to column gap x=232  (x=220→232, same y, inside gap)
    Step 2 – vertical through column gap to row gap (y=177 top / y=203 bottom)
    Step 3 – horizontal along row gap to spine x=510  (y=160–220 = safe zone)
    Step 4 – cubic bezier to chip inlet

  RIGHT cards (right edge x=440):
    Step 1 – horizontal to spine x=510  (x=440→510, no cards in the way)
    Step 2 – cubic bezier to chip inlet
*/
function buildLinePath(pos: keyof typeof CARD_BOXES): string {
  const b      = CARD_BOXES[pos];
  const cx     = b.x + b.w;
  const cy     = b.y + b.h / 2;
  const isLeft = pos.includes("left");
  const isTop  = pos.startsWith("top");
  const inletX = CHIP_CX - 48;
  // Row-gap y values: row gap is y=160 → y=220; use offsets from CHIP_CY (190)
  const gapY   = isTop ? CHIP_CY - 13 : CHIP_CY + 13; // 177 or 203

  if (isLeft) {
    return [
      `M ${cx} ${cy}`,
      `H ${GAP_X}`,                                                          // ① col-gap turn
      `V ${gapY}`,                                                           // ② vertical through col-gap into row-gap
      `H ${SPINE_X}`,                                                        // ③ horizontal through row-gap
      `C ${SPINE_X + 55} ${gapY} ${inletX - 40} ${CHIP_CY} ${inletX} ${CHIP_CY}`, // ④ bezier to chip
    ].join(" ");
  } else {
    return [
      `M ${cx} ${cy}`,
      `H ${SPINE_X}`,
      `C ${SPINE_X + 55} ${cy} ${inletX - 40} ${CHIP_CY} ${inletX} ${CHIP_CY}`,
    ].join(" ");
  }
}

/* ────────────────────────────────────────────────────────────────
   StarField
──────────────────────────────────────────────────────────────── */
function StarField() {
  const refs = useRef<(SVGCircleElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: 0.05 + Math.random() * 0.55,
        duration: STARS[i].dur, delay: STARS[i].delay,
        repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });
  }, []);
  return (
    <>
      {STARS.map((s, i) => (
        <circle key={s.id}
          ref={(el) => { refs.current[i] = el; }}
          cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={0.1}
        />
      ))}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────
   Pills
──────────────────────────────────────────────────────────────── */
function PillsRow({ pillRefs }: { pillRefs: React.MutableRefObject<(HTMLSpanElement | null)[]> }) {
  const onEnter = (el: HTMLSpanElement) => gsap.to(el, {
    background: "rgba(0,212,255,0.1)", borderColor: "rgba(0,212,255,0.4)",
    boxShadow: "0 0 14px rgba(0,212,255,0.18)", duration: 0.2, ease: "power2.out",
  });
  const onLeave = (el: HTMLSpanElement) => gsap.to(el, {
    background: "rgba(0,212,255,0.04)", borderColor: "rgba(0,212,255,0.14)",
    boxShadow: "none", duration: 0.25, ease: "power2.inOut",
  });
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-5">
      {PILLS.map((p, i) => (
        <span key={p}
          ref={(el) => { pillRefs.current[i] = el; }}
          onMouseEnter={(e) => onEnter(e.currentTarget)}
          onMouseLeave={(e) => onLeave(e.currentTarget)}
          className="text-[11px] px-3.5 py-1.5 rounded-full cursor-default select-none opacity-0"
          style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.14)", color: "#4d6580" }}>
          {p}
        </span>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Hero bio card
──────────────────────────────────────────────────────────────── */
function HeroBioCard({ bioRef }: { bioRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={bioRef}
      className="relative rounded-2xl p-5 sm:p-7 text-left overflow-hidden mb-5 opacity-0"
      style={{
        background: "linear-gradient(160deg,rgba(6,13,26,0.96) 0%,rgba(10,20,44,0.92) 100%)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0,212,255,0.12)",
        boxShadow: "0 8px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-[3px] rounded-t-2xl"
        style={{ background: "linear-gradient(90deg,#00D4FF,#4A90E2 50%,#A855F7)", boxShadow: "0 0 10px rgba(0,212,255,0.35)" }} />
      <p className="leading-[1.9] text-sm sm:text-base" style={{ color: "#5e7a99" }}>
        I combine product thinking, UX design, and frontend engineering into one role — bridging user research, UX strategy &amp; wireframing through lo-fi to hi-fi Figma prototyping, design systems, and responsive React.js &amp; Next.js interfaces that ship.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────────── */
export default function AboutOrbit() {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const chipRef      = useRef<SVGGElement>(null);
  const ring1Ref     = useRef<SVGEllipseElement>(null);
  const ring2Ref     = useRef<SVGEllipseElement>(null);
  const ring3Ref     = useRef<SVGEllipseElement>(null);
  const dotRefs      = useRef<(SVGCircleElement | null)[]>([]);
  const padRefs      = useRef<(SVGCircleElement | null)[]>([]);
  const scanRef      = useRef<SVGRectElement>(null);
  const cardGRefs    = useRef<(SVGGElement | null)[]>([]);
  const pillRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const bioRef       = useRef<HTMLDivElement | null>(null);
  const hasInit      = useRef(false);

  /* ── Entry timeline ── */
  const runEntry = useCallback(() => {
    if (hasInit.current) return;
    hasInit.current = true;
    const tl = gsap.timeline();

    if (bioRef.current)
      tl.fromTo(bioRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0);

    if (panelRef.current)
      tl.fromTo(panelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2);

    // Skill card groups stagger in from their edge
    const cardOffsets = [
      { x: -40, y: -20 }, { x: -40, y: 20 },
      { x: -40, y: -20 }, { x: -40, y: 20 },
    ];
    cardGRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(el, { opacity: 0, x: cardOffsets[i].x, y: cardOffsets[i].y },
        { opacity: 1, x: 0, y: 0, duration: 0.5, ease: "back.out(1.4)" }, 0.35 + i * 0.1);
    });

    // Chip entrance
    if (chipRef.current)
      tl.fromTo(chipRef.current, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", transformOrigin: `${CHIP_CX}px ${CHIP_CY}px` }, 0.5);

    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.85 + i * 0.045);
    });
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) runEntry(); }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [runEntry]);

  /* ── Ring rotation ── */
  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    [
      { el: ring1Ref.current, dur: 18, dir:  1 },
      { el: ring2Ref.current, dur: 28, dir: -1 },
      { el: ring3Ref.current, dur: 38, dir:  1 },
    ].forEach(({ el, dur, dir }) => {
      if (!el) return;
      tweens.push(gsap.to(el, { rotation: dir * 360, transformOrigin: "50% 50%", svgOrigin: `${CHIP_CX} ${CHIP_CY}`, duration: dur, ease: "none", repeat: -1 }));
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  /* ── Chip breathe ── */
  useEffect(() => {
    const el = chipRef.current;
    if (!el) return;
    const t = gsap.to(el, { scale: 1.05, transformOrigin: "50% 50%", svgOrigin: `${CHIP_CX} ${CHIP_CY}`, duration: 3.5, ease: "sine.inOut", repeat: -1, yoyo: true });
    return () => t.kill();
  }, []);

  /* ── Traveling dots along paths ── */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const tweens: gsap.core.Tween[] = [];
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      const pathEl = svg.querySelector<SVGPathElement>(`.line-path-${i}`);
      if (!pathEl) return;
      tweens.push(gsap.to(dot, {
        motionPath: { path: pathEl, align: pathEl, alignOrigin: [0.5, 0.5] },
        duration: 2.8 + i * 0.45, ease: "none", repeat: -1, delay: i * 0.6,
      }));
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  /* ── Dashed-line flow ── */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll<SVGPathElement>("[class^='line-path']");
    const tweens: gsap.core.Tween[] = [];
    paths.forEach((p, i) => {
      const len = p.getTotalLength?.() ?? 200;
      p.style.strokeDasharray = "5 8";
      p.style.strokeDashoffset = "0";
      tweens.push(gsap.to(p, { strokeDashoffset: -len, duration: 3 + i * 0.35, ease: "none", repeat: -1 }));
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  /* ── Card float ── */
  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    cardGRefs.current.forEach((el, i) => {
      if (!el) return;
      tweens.push(gsap.to(el, {
        y: "+=8", duration: 5 + i * 0.5, delay: i * 0.4,
        repeat: -1, yoyo: true, ease: "sine.inOut",
      }));
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  /* ── PCB pad pulse ── */
  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];
    padRefs.current.forEach((el, i) => {
      if (!el) return;
      tweens.push(
        gsap.fromTo(el,
          { attr: { r: "2.5" }, opacity: 0.65 },
          { attr: { r: "9" }, opacity: 0, duration: 1.6, delay: i * 0.08, ease: "power2.out", repeat: -1 }
        )
      );
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  /* ── Chip scan line ── */
  useEffect(() => {
    const el = scanRef.current;
    if (!el) return;
    const t = gsap.fromTo(el,
      { attr: { y: String(CHIP_CY - 44) } },
      { attr: { y: String(CHIP_CY + 42) }, duration: 2.4, ease: "none", repeat: -1, delay: 1 }
    );
    return () => t.kill();
  }, []);

  /* ── Mouse parallax on rings ── */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const factors = [5, 10, 16];
    const onMove = (e: MouseEvent) => {
      const r = panel.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / r.width;
      const dy = (e.clientY - r.top  - r.height / 2) / r.height;
      [ring1Ref.current, ring2Ref.current, ring3Ref.current].forEach((el, i) => {
        if (!el) return;
        gsap.to(el, { x: dx * factors[i], y: dy * factors[i], duration: 0.45, ease: "power2.out", overwrite: "auto" });
      });
    };
    const onLeave = () => {
      [ring1Ref.current, ring2Ref.current, ring3Ref.current].forEach((el) => {
        if (!el) return;
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "power2.inOut", overwrite: "auto" });
      });
    };
    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", onLeave);
    return () => { panel.removeEventListener("mousemove", onMove); panel.removeEventListener("mouseleave", onLeave); };
  }, []);

  /* ── Card hover (SVG foreignObject can't easily get pointer — we use HTML overlay) ── */
  const handleCardEnter = (i: number) => {
    const el = cardGRefs.current[i];
    if (!el) return;
    gsap.to(el, { scale: 1.04, duration: 0.22, ease: "power2.out", transformOrigin: "50% 50%", svgOrigin: "450 190" });
  };
  const handleCardLeave = (i: number) => {
    const el = cardGRefs.current[i];
    if (!el) return;
    gsap.to(el, { scale: 1, duration: 0.28, ease: "power2.inOut", transformOrigin: "50% 50%", svgOrigin: "450 190" });
  };

  return (
    <div ref={wrapRef}>
      <HeroBioCard bioRef={(el) => { bioRef.current = el; }} />

      {/* Main panel */}
      <div ref={panelRef}
        className="relative rounded-2xl overflow-hidden opacity-0"
        style={{
          background: "linear-gradient(135deg,rgba(4,9,20,0.99) 0%,rgba(8,16,38,0.97) 60%,rgba(14,10,36,0.98) 100%)",
          border: "1px solid rgba(0,212,255,0.1)",
          boxShadow: "0 16px 56px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.035)",
        }}
      >
        {/* SVG — full-width, preserveAspectRatio handles responsiveness */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ minHeight: 220, maxHeight: 420 }}
          aria-hidden="true"
        >
          <defs>
            {/* Chip gradient */}
            <radialGradient id="chipGrad" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#3b6aff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1a2fa8" stopOpacity="0.95" />
            </radialGradient>
            {/* Chip glow filter */}
            <filter id="chipGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {/* Soft line glow */}
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="chipText" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <radialGradient id="rightGlow" cx="80%" cy="50%">
              <stop offset="0%" stopColor="rgba(59,106,255,0.12)" />
              <stop offset="100%" stopColor="rgba(59,106,255,0)" />
            </radialGradient>
            <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(0,212,255,0)" />
              <stop offset="40%"  stopColor="rgba(0,212,255,0.45)" />
              <stop offset="60%"  stopColor="rgba(0,212,255,0.45)" />
              <stop offset="100%" stopColor="rgba(0,212,255,0)" />
            </linearGradient>
            <clipPath id="chipClip">
              <rect x={CHIP_CX - 46} y={CHIP_CY - 46} width="92" height="92" rx="16" />
            </clipPath>
          </defs>

          {/* Stars */}
          <StarField />

          {/* ── Skill cards (SVG foreignObject) ── */}
          {SKILLS.map((skill, i) => {
            const box = CARD_BOXES[skill.gridPos];
            return (
              <g key={skill.id}
                ref={(el) => { cardGRefs.current[i] = el; }}
                opacity={0}
                onMouseEnter={() => handleCardEnter(i)}
                onMouseLeave={() => handleCardLeave(i)}
                style={{ cursor: "default" }}
              >
                {/* Card background */}
                <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="10"
                  fill="rgba(8,16,34,0.92)"
                  stroke={`${skill.accent}30`} strokeWidth="1"
                  style={{ filter: `drop-shadow(0 4px 14px rgba(0,0,0,0.5))` }} />
                {/* Top accent line */}
                <rect x={box.x} y={box.y} width={box.w} height="2.5" rx="10"
                  fill={skill.accent} opacity="0.7" />
                {/* Icon bubble */}
                <rect x={box.x + 12} y={box.y + 14} width="28" height="28" rx="6"
                  fill={`${skill.accent}18`} stroke={`${skill.accent}35`} strokeWidth="1" />
                <text x={box.x + 26} y={box.y + 33} textAnchor="middle" fontSize="14">{skill.icon}</text>
                {/* Title */}
                <text x={box.x + 50} y={box.y + 26} fontSize="11" fontWeight="700" fill={skill.accent}>{skill.title}</text>
                {/* Sub text */}
                <text x={box.x + 12} y={box.y + 58} fontSize="9" fill="#3d5470">{skill.sub}</text>
                {/* Tag chips */}
                <rect x={box.x + 12} y={box.y + 74} width="44" height="15" rx="7"
                  fill={`${skill.accent}14`} stroke={`${skill.accent}30`} strokeWidth="0.8" />
                <text x={box.x + 34} y={box.y + 85} fontSize="7.5" fill={`${skill.accent}cc`} textAnchor="middle">{skill.tag1}</text>
                <rect x={box.x + 62} y={box.y + 74} width="42" height="15" rx="7"
                  fill={`${skill.accent}14`} stroke={`${skill.accent}30`} strokeWidth="0.8" />
                <text x={box.x + 83} y={box.y + 85} fontSize="7.5" fill={`${skill.accent}cc`} textAnchor="middle">{skill.tag2}</text>
                {/* Right connector dot */}
                <circle cx={box.x + box.w} cy={box.y + box.h / 2} r="4"
                  fill={skill.accent} style={{ filter: `drop-shadow(0 0 4px ${skill.accent})` }} />
              </g>
            );
          })}

          {/* ── Branch lines ── */}
          {/* Column-gap spine: dashed vertical at x=GAP_X, outside both left cards */}
          <line
            x1={GAP_X} y1={CARD_BOXES["top-left"].y + CARD_BOXES["top-left"].h / 2}
            x2={GAP_X} y2={CARD_BOXES["bottom-left"].y + CARD_BOXES["bottom-left"].h / 2}
            stroke="rgba(0,212,255,0.18)" strokeWidth="1.2" strokeDasharray="3 6"
            filter="url(#lineGlow)"
          />
          {/* Row-gap spine: short dashed vertical at x=SPINE_X between the two row-gap horizontals */}
          <line
            x1={SPINE_X} y1={CHIP_CY - 13}
            x2={SPINE_X} y2={CHIP_CY + 13}
            stroke="rgba(0,212,255,0.18)" strokeWidth="1.2" strokeDasharray="2 4"
            filter="url(#lineGlow)"
          />

          {/* Four non-crossing paths — one per card */}
          {SKILLS.map((skill, i) => (
            <path key={skill.id}
              className={`line-path-${i}`}
              d={buildLinePath(skill.gridPos)}
              stroke={`${skill.accent}55`} strokeWidth="1.8"
              fill="none"
              filter="url(#lineGlow)"
            />
          ))}

          {/* Junction dots at every bend / merge point */}
          {SKILLS.map((skill) => {
            const b     = CARD_BOXES[skill.gridPos];
            const cy    = b.y + b.h / 2;
            const isLeft = skill.gridPos.includes("left");
            const isTop  = skill.gridPos.startsWith("top");
            const gapY   = isTop ? CHIP_CY - 13 : CHIP_CY + 13;
            return isLeft ? (
              <g key={`junc-${skill.id}`}>
                {/* dot at column-gap turn */}
                <circle cx={GAP_X} cy={cy} r="4"
                  fill={skill.accent} style={{ filter: `drop-shadow(0 0 5px ${skill.accent})` }} />
                {/* dot at row-gap merge with spine */}
                <circle cx={SPINE_X} cy={gapY} r="4"
                  fill={skill.accent} style={{ filter: `drop-shadow(0 0 5px ${skill.accent})` }} />
              </g>
            ) : (
              <circle key={`junc-${skill.id}`}
                cx={SPINE_X} cy={cy} r="4"
                fill={skill.accent} style={{ filter: `drop-shadow(0 0 5px ${skill.accent})` }}
              />
            );
          })}

          {/* Traveling dots */}
          {SKILLS.map((skill, i) => (
            <circle key={skill.id}
              ref={(el) => { dotRefs.current[i] = el; }}
              r="4" fill={skill.accent}
              style={{ filter: `drop-shadow(0 0 6px ${skill.accent})` }}
            />
          ))}

          {/* ── Central chip ── */}
          <g ref={chipRef} opacity={0}>
            {/* Orbit rings around chip */}
            <ellipse ref={ring3Ref} cx={CHIP_CX} cy={CHIP_CY} rx="130" ry="100"
              fill="none" stroke="rgba(59,106,255,0.07)" strokeWidth="1" strokeDasharray="3 10" />
            <ellipse ref={ring2Ref} cx={CHIP_CX} cy={CHIP_CY} rx="94" ry="72"
              fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="1" strokeDasharray="4 9" />
            <ellipse ref={ring1Ref} cx={CHIP_CX} cy={CHIP_CY} rx="60" ry="46"
              fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="1" strokeDasharray="5 7" />

            {/* Chip outer glow */}
            <rect x={CHIP_CX - 56} y={CHIP_CY - 56} width="112" height="112" rx="20"
              fill="rgba(59,106,255,0.08)"
              style={{ filter: "blur(12px)" }} />

            {/* Chip body */}
            <rect x={CHIP_CX - 46} y={CHIP_CY - 46} width="92" height="92" rx="16"
              fill="url(#chipGrad)"
              stroke="rgba(100,140,255,0.45)" strokeWidth="1.5"
              style={{ filter: "drop-shadow(0 0 22px rgba(59,106,255,0.7))" }}
            />

            {/* Scan line sweep */}
            <rect ref={scanRef}
              x={CHIP_CX - 44} y={CHIP_CY - 44} width="88" height="5" rx="2"
              fill="url(#scanGrad)" clipPath="url(#chipClip)" opacity="0.65" />

            {/* UI·UX label */}
            <text x={CHIP_CX} y={CHIP_CY + 6}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="22" fontWeight="900" letterSpacing="1"
              fill="url(#chipText)"
              style={{ filter: "drop-shadow(0 0 8px rgba(0,212,255,0.8))" }}
            >
              UI·UX
            </text>

            {/* Enhanced PCB traces */}
            {([-30, -10, 10, 30] as const).map((offset, oi) => (
              <g key={offset}>
                <line x1={CHIP_CX + offset} y1={CHIP_CY - 46} x2={CHIP_CX + offset} y2={CHIP_CY - 64}
                  stroke="rgba(100,160,255,0.55)" strokeWidth="1.5" />
                <line x1={CHIP_CX + offset} y1={CHIP_CY + 46} x2={CHIP_CX + offset} y2={CHIP_CY + 64}
                  stroke="rgba(100,160,255,0.55)" strokeWidth="1.5" />
                <line x1={CHIP_CX - 46} y1={CHIP_CY + offset} x2={CHIP_CX - 64} y2={CHIP_CY + offset}
                  stroke="rgba(100,160,255,0.55)" strokeWidth="1.5" />
                <line x1={CHIP_CX + 46} y1={CHIP_CY + offset} x2={CHIP_CX + 64} y2={CHIP_CY + offset}
                  stroke="rgba(100,160,255,0.55)" strokeWidth="1.5" />
                {Math.abs(offset) === 30 && (
                  <>
                    <line x1={CHIP_CX + offset} y1={CHIP_CY - 64}
                      x2={CHIP_CX + offset + (offset > 0 ? 10 : -10)} y2={CHIP_CY - 64}
                      stroke="rgba(100,160,255,0.28)" strokeWidth="1" />
                    <line x1={CHIP_CX + offset} y1={CHIP_CY + 64}
                      x2={CHIP_CX + offset + (offset > 0 ? 10 : -10)} y2={CHIP_CY + 64}
                      stroke="rgba(100,160,255,0.28)" strokeWidth="1" />
                    <line x1={CHIP_CX - 64} y1={CHIP_CY + offset}
                      x2={CHIP_CX - 64} y2={CHIP_CY + offset + (offset > 0 ? 10 : -10)}
                      stroke="rgba(100,160,255,0.28)" strokeWidth="1" />
                    <line x1={CHIP_CX + 64} y1={CHIP_CY + offset}
                      x2={CHIP_CX + 64} y2={CHIP_CY + offset + (offset > 0 ? 10 : -10)}
                      stroke="rgba(100,160,255,0.28)" strokeWidth="1" />
                  </>
                )}
              </g>
            ))}

            {/* PCB pads — solid core */}
            {([-30, -10, 10, 30] as const).map((offset) => (
              <g key={offset}>
                <circle cx={CHIP_CX + offset} cy={CHIP_CY - 64} r="2.5" fill="rgba(100,160,255,0.85)" />
                <circle cx={CHIP_CX + offset} cy={CHIP_CY + 64} r="2.5" fill="rgba(100,160,255,0.85)" />
                <circle cx={CHIP_CX - 64} cy={CHIP_CY + offset} r="2.5" fill="rgba(100,160,255,0.85)" />
                <circle cx={CHIP_CX + 64} cy={CHIP_CY + offset} r="2.5" fill="rgba(100,160,255,0.85)" />
              </g>
            ))}

            {/* PCB pads — pulsing rings */}
            {([-30, -10, 10, 30] as const).map((offset, oi) => (
              <g key={offset}>
                <circle ref={(el) => { padRefs.current[oi * 4 + 0] = el; }}
                  cx={CHIP_CX + offset} cy={CHIP_CY - 64} r="2.5"
                  fill={oi % 2 === 0 ? "rgba(0,212,255,0.6)" : "rgba(168,85,247,0.6)"} />
                <circle ref={(el) => { padRefs.current[oi * 4 + 1] = el; }}
                  cx={CHIP_CX + offset} cy={CHIP_CY + 64} r="2.5"
                  fill={oi % 2 === 0 ? "rgba(0,212,255,0.6)" : "rgba(168,85,247,0.6)"} />
                <circle ref={(el) => { padRefs.current[oi * 4 + 2] = el; }}
                  cx={CHIP_CX - 64} cy={CHIP_CY + offset} r="2.5"
                  fill={oi % 2 === 0 ? "rgba(100,160,255,0.6)" : "rgba(16,185,129,0.6)"} />
                <circle ref={(el) => { padRefs.current[oi * 4 + 3] = el; }}
                  cx={CHIP_CX + 64} cy={CHIP_CY + offset} r="2.5"
                  fill={oi % 2 === 0 ? "rgba(100,160,255,0.6)" : "rgba(16,185,129,0.6)"} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Pills */}
      <PillsRow pillRefs={pillRefs} />
    </div>
  );
}
