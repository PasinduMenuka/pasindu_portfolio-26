"use client";

import React, { useEffect, useRef, useState } from "react";

/** Adds `is-in` once the element scrolls into view (fires once). */
export function useInViewOnce<T extends Element>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, inView]);

  return { ref, inView };
}

type RevealProps = {
  as?: keyof JSX.IntrinsicElements;
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

/** Fade + rise reveal (Ency `data-reveal`). */
export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }: RevealProps) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-delay={delay || undefined}
      className={`${className} ${inView ? "is-in" : ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Splits plain-string children into masked words that slide up in sequence. */
export function SplitText({
  text,
  className = "",
  startIndex = 0,
}: {
  text: string;
  className?: string;
  startIndex?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="split-w">
            <span className="split-wi" style={{ transitionDelay: `${Math.min(startIndex + i, 12) * 40}ms` }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

/**
 * Heading whose words reveal on scroll. `lines` lets you style parts
 * separately, e.g. [{ text: "Recent work," }, { text: "real results", className: "is-soft" }].
 */
export function SplitHeading({
  as = "h2",
  lines,
  className = "",
}: {
  as?: keyof JSX.IntrinsicElements;
  lines: { text: string; className?: string; block?: boolean }[];
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const Tag = as as any;
  let idx = 0;
  return (
    <Tag ref={ref} className={`e-display ${className} ${inView ? "is-in" : ""}`}>
      {lines.map((line, i) => {
        const start = idx;
        idx += line.text.split(/\s+/).filter(Boolean).length;
        return (
          <React.Fragment key={i}>
            <SplitText
              text={line.text}
              startIndex={start}
              className={`${line.className ?? ""} ${line.block ? "block" : ""}`}
            />
            {!line.block && i < lines.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}

/** Yellow handwritten sticker label (“the good news?”). */
export function HandTag({ children, className = "", tilt = -4 }: { children: React.ReactNode; className?: string; tilt?: number }) {
  return (
    <span className={`e-hand-tag ${className}`} style={{ ["--tilt" as any]: `${tilt}deg` }}>
      {children}
    </span>
  );
}

/** Numbers count up from 0 with easeOutQuart once visible. Keeps prefix/suffix (e.g. "5+", "45%"). */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>(0.4);
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const ease = (t: number) => 1 - (1 - t) ** 4;
    const tick = (now: number) => {
      start ||= now + 450;
      const p = Math.min(1, Math.max(0, (now - start) / 1600));
      setN(Math.round(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target]);

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className} aria-label={value}>
      {match[1]}
      {n}
      {match[3]}
    </span>
  );
}
