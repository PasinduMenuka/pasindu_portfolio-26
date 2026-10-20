"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";
import { HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";
import ArrowButton from "@/components/arrow-button";

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.3);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Pin + scrub horizontally only on large screens with motion allowed.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setPinned(mq.matches);
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const [staticProgress, setStaticProgress] = useState(0);

  const isPinned = pinned && distance > 0;
  const [pinnedProgress, setPinnedProgress] = useState(0);
  useEffect(() => scrollYProgress.on("change", setPinnedProgress), [scrollYProgress]);
  const progress = isPinned ? pinnedProgress : staticProgress;
  const atStart = progress <= 0.001;
  const atEnd = progress >= 0.999;

  // One card per click. When pinned, vertical scroll maps 1:1 to horizontal travel.
  const stepBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.children;
    const step = cards.length > 1 ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft : track.clientWidth;
    if (isPinned) window.scrollBy({ top: dir * step, behavior: "smooth" });
    else track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="projects"
      data-ground="ink"
      className={`g-ink e-work ${isPinned ? "" : "e-work--static e-section"}`}
    >
      <div ref={pinRef} className="e-work__pin" style={isPinned ? { height: `calc(100vh + ${distance}px)` } : undefined}>
        <div className="e-work__sticky">
          <div className="e-container e-work__head">
            <div>
              <Reveal>
                <HandTag tilt={-3}>selected work</HandTag>
              </Reveal>
              <SplitHeading
                className="!text-[clamp(3rem,6.6vw,6.75rem)]"
                lines={[{ text: "Recent work," }, { text: "real results", className: "is-soft" }]}
              />
              <Reveal delay={1} className="e-work__sub">
                <ArrowButton variant="white" href="/projects">
                  See my portfolio
                </ArrowButton>
                <span className="e-work__hint e-hand" aria-hidden="true">
                  {isPinned ? "keep scrolling" : "swipe"}
                  <svg viewBox="0 0 50 20" fill="none">
                    <path d="M2 10c12-6 26-6 44 0M38 4l8 6-8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Reveal>
            </div>
            <Reveal delay={2} className="flex gap-2">
              <button type="button" className="e-round-btn" aria-label="Previous project" aria-disabled={atStart} onClick={() => stepBy(-1)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M12 7H2m4-4L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className="e-round-btn" aria-label="Next project" aria-disabled={atEnd} onClick={() => stepBy(1)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Reveal>
          </div>

          <motion.div
            ref={trackRef}
            className="e-work__track"
            style={isPinned ? { x } : undefined}
            onScroll={(e) => {
              const t = e.currentTarget;
              const max = t.scrollWidth - t.clientWidth;
              setStaticProgress(max > 0 ? t.scrollLeft / max : 0);
            }}
          >
            {projectsData.map((project) => (
              <Project key={project.id} {...project} />
            ))}
          </motion.div>

          <div className="e-work__progress" aria-hidden="true">
            {isPinned ? (
              <motion.span style={{ scaleX: scrollYProgress }} />
            ) : (
              <span style={{ transform: `scaleX(${Math.max(0.08, staticProgress)})` }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
