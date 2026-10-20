"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";

function XpCard({ item, index }: { item: (typeof experiencesData)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="e-xp-card">
      <div className="e-xp-card__tile">
        <span className="e-xp-card__index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="e-xp-card__date e-mono">{item.date}</span>
        <h3 className="e-xp-card__role">{item.title}</h3>
      </div>
      <div className="e-xp-card__body">
        <p className="e-xp-card__company">{item.location}</p>
        <p className={`e-xp-card__desc ${open ? "is-open" : ""}`}>{item.description}</p>
        {item.description.length > 260 && (
          <button type="button" className="e-xp-card__more" onClick={() => setOpen((o) => !o)}>
            {open ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </article>
  );
}

export default function Experience() {
  const { ref } = useSectionInView("Experience", 0.4);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setProgress(max > 0 ? t.scrollLeft / max : 1);
    setAtStart(t.scrollLeft <= 1);
    setAtEnd(t.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  // Slow, continuous auto-scroll. Pauses for hover/drag/touch/arrows, loops at the end.
  const pausedUntil = useRef(0);
  const hovering = useRef(false);
  const pauseFor = (ms: number) => {
    pausedUntil.current = Math.max(pausedUntil.current, performance.now() + ms);
  };
  useEffect(() => {
    const t = trackRef.current;
    if (!t || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const SPEED = 28; // px per second
    let raf = 0;
    let last = 0;
    let pos = t.scrollLeft;
    let visible = false;
    let gliding = false;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    io.observe(t);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - (last || now)) / 1000;
      last = now;
      const active = visible && !hovering.current && drag.current.id === -1 && now > pausedUntil.current;
      t.toggleAttribute("data-auto", active);
      if (!active) {
        pos = t.scrollLeft;
        return;
      }
      const max = t.scrollWidth - t.clientWidth;
      if (max <= 0) return;
      if (pos >= max - 1) {
        if (gliding) return;
        gliding = true;
        // Hold at the end, then glide back to the first card.
        pauseFor(1800);
        window.setTimeout(() => {
          t.scrollTo({ left: 0, behavior: "smooth" });
          pos = 0;
          pauseFor(1400);
          gliding = false;
        }, 1800);
        return;
      }
      pos = Math.min(max, pos + SPEED * dt);
      t.scrollLeft = pos;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      t.removeAttribute("data-auto");
    };
  }, []);

  const stepBy = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    pauseFor(5000);
    const cards = t.children;
    const step = cards.length > 1 ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft : t.clientWidth;
    t.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Mouse drag-to-scroll (touch already scrolls natively).
  const drag = useRef({ id: -1, x: 0, left: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      e.currentTarget.setAttribute("data-dragging", "");
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    e.currentTarget.scrollLeft = d.left - dx;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (e.pointerId !== d.id) return;
    drag.current.id = -1;
    if (!d.moved) return;
    const t = e.currentTarget;
    t.removeAttribute("data-dragging");
    if (t.hasPointerCapture(e.pointerId)) t.releasePointerCapture(e.pointerId);
    const cards = t.children;
    const step = cards.length > 1 ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft : t.clientWidth;
    t.scrollTo({ left: Math.round(t.scrollLeft / step) * step, behavior: "smooth" });
  };

  return (
    <section id="experience" ref={ref} data-ground="white" className="e-section g-white">
      <div className="e-container e-xp__head">
        <div>
          <Reveal>
            <HandTag>the journey so far</HandTag>
          </Reveal>
          <SplitHeading lines={[{ text: "Where I've" }, { text: "worked", className: "is-soft" }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            From trainee front-end developer to leading UX teams. Six companies, one through-line: making complex
            products feel simple.
          </Reveal>
        </div>
        <Reveal delay={2} className="e-xp__controls">
          <button type="button" className="e-round-btn" aria-label="Previous" aria-disabled={atStart} onClick={() => stepBy(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M12 7H2m4-4L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="e-round-btn" aria-label="Next" aria-disabled={atEnd} onClick={() => stepBy(1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Reveal>
      </div>

      <Reveal delay={1}>
        <div
          ref={trackRef}
          className="e-xp__track"
          onScroll={update}
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
          onTouchStart={() => pauseFor(60000)}
          onTouchEnd={() => {
            pausedUntil.current = 0;
            pauseFor(3500);
          }}
          onWheel={() => pauseFor(3000)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDragStart={(e) => e.preventDefault()}
        >
          {experiencesData.map((item, i) => (
            <XpCard key={`${item.location}-${i}`} item={item} index={i} />
          ))}
        </div>
      </Reveal>
      <div className="e-xp__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
      </div>
    </section>
  );
}
