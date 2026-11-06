"use client";

import React from "react";
import { motion } from "framer-motion";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaReact, FaFigma, FaHtml5, FaCss3Alt, FaJsSquare, FaRobot, FaCode, FaGithub, FaGitlab } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiFramer,
  SiRedux,
  SiAdobephotoshop,
  SiAdobexd,
  SiMiro,
  SiSass,
  SiPhp,
  SiWordpress,
  SiBitbucket,
  SiOpenai,
} from "react-icons/si";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import ArrowButton from "@/components/arrow-button";
import { CountUp, Reveal, useAppReady } from "@/components/motion/reveal";
import { HeroScene, DEFAULT_PARAMS } from "@/components/hero/hero-scene";
import { PERSON } from "@/lib/site";

const techStack = [
  { name: "Figma", icon: FaFigma },
  { name: "Figma MCP Server", icon: FaFigma },
  { name: "Figma AI", icon: FaFigma },
  { name: "Adobe XD", icon: SiAdobexd },
  { name: "Adobe Photoshop", icon: SiAdobephotoshop },
  { name: "Miro", icon: SiMiro },
  { name: "JavaScript", icon: FaJsSquare },
  { name: "ReactJS", icon: FaReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "HTML5", icon: FaHtml5 },
  { name: "CSS3", icon: FaCss3Alt },
  { name: "SCSS", icon: SiSass },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "PHP", icon: SiPhp },
  { name: "WordPress", icon: SiWordpress },
  { name: "Framer Motion", icon: SiFramer },
  { name: "Redux", icon: SiRedux },
  { name: "Shadcn UI", icon: BsGrid3X3Gap },
  { name: "Claude & Claude Code", icon: FaRobot },
  { name: "ChatGPT", icon: SiOpenai },
  { name: "GitHub Copilot", icon: FaGithub },
  { name: "Cursor", icon: FaCode },
  { name: "Prompt Engineering", icon: FaRobot },
  { name: "GitHub", icon: FaGithub },
  { name: "GitLab", icon: FaGitlab },
  { name: "Bitbucket", icon: SiBitbucket },
];

const HERO_CV = "https://drive.google.com/file/d/1PUnX36aga7dHJqw5DEGdk00hDmhkzinn/view?usp=sharing";
const PORTRAIT = "/hero-portrait.png";

/** react-spring style tension/friction, run through framer-motion's identical damped spring (mass 1). */
const spring = (stiffness: number, damping: number, delayMs = 0) => ({
  type: "spring" as const,
  stiffness,
  damping,
  mass: 1,
  delay: delayMs / 1000,
});
const REVEAL = [90, 26] as const;

/** The hero's figures — the same numbers the About section states. */
const STATS = [
  { value: "5+", label: "Years designing & building" },
  { value: "20+", label: "Projects shipped" },
  { value: "6", label: "Product teams" },
];

/** Opacity + rise, played once `play` turns true. */
function Rise({
  play,
  delay,
  y = "1.25rem",
  as = "div",
  className,
  children,
}: {
  play: boolean;
  delay: number;
  y?: string;
  as?: "div" | "li";
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      animate={play ? { opacity: 1, y: "0rem" } : { opacity: 0, y }}
      transition={spring(REVEAL[0], REVEAL[1], delay)}
    >
      {children}
    </Tag>
  );
}

/** Splits text into words or letters, each on its own spring. The plain string stays for assistive tech. */
function SplitReveal({
  text,
  by,
  play,
  delay,
  stagger,
  config,
  className = "",
  as: Tag = "span",
  softFrom,
}: {
  text: string;
  by: "words" | "letters";
  play: boolean;
  delay: number;
  stagger: number;
  config: readonly [number, number];
  className?: string;
  as?: "h1" | "dd" | "span";
  /** Units from this index on take the blue `is-soft` colour (the old hero's second line). */
  softFrom?: number;
}) {
  const parts = by === "words" ? text.split(/\s+/) : Array.from(text);
  const y = by === "words" ? "0.35em" : "0.3em";
  return (
    <Tag className={`kh-split ${className}`}>
      <span className="sr-only">{text}</span>
      {parts.map((part, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={softFrom !== undefined && i >= softFrom ? "kh-unit is-soft" : "kh-unit"}
          initial={{ opacity: 0, y }}
          animate={play ? { opacity: 1, y: "0em" } : { opacity: 0, y }}
          transition={spring(config[0], config[1], delay + i * stagger)}
        >
          {part}
        </motion.span>
      ))}
    </Tag>
  );
}

/** Four 10×10 corner strokes — one path, mirrored per corner. */
function Corners() {
  return (
    <>
      {(["tr", "tl", "bl", "br"] as const).map((corner) => (
        <svg key={corner} className={`kh-c ${corner}`} viewBox="0 0 10.5 10.5" aria-hidden="true">
          <path d="M0 0.5H10V10.5" />
        </svg>
      ))}
    </>
  );
}

/**
 * Mounts the WebGL scene on the canvas and keeps it fitted, fed and paused off screen.
 * `state` turns "ready" once every texture is uploaded and every program compiled, or "failed"
 * (no WebGL, or the portrait didn't load), in which case the portrait is shown as a plain image.
 */
function useHeroScene(play: boolean) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<HeroScene | null>(null);
  const [state, setState] = React.useState<"loading" | "ready" | "failed">("loading");

  React.useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!section || !canvas || !box) return;
    const container = canvas.parentElement as HTMLElement;

    let scene: HeroScene;
    try {
      scene = new HeroScene(canvas, section, PORTRAIT);
    } catch {
      setState("failed");
      return;
    }
    sceneRef.current = scene;

    const mq = (query: string) => window.matchMedia(query).matches;
    const applyFit = () => {
      const s = section.getBoundingClientRect();
      // The fit box only displays below 1280; above it the portrait fills the canvas.
      const b = box.offsetParent !== null ? box.getBoundingClientRect() : null;
      scene.setBox(b ? { left: b.left - s.left, top: b.top - s.top, width: b.width, height: b.height } : null);
      scene.setParams({
        ...DEFAULT_PARAMS,
        ...(mq("(max-width: 1023px)") ? { bgRevealOpacity: 0 } : null),
        ...(mq("(hover: none)") ? { autoSweepAmount: 0.76 } : null),
        ...(mq("(max-width: 639px)") ? { sweepRadius: 0.95, sweepWarp: 0.18, autoSweepAmount: 0.55 } : null),
        ...(scene.tier.reveal ? null : { autoSweepAmount: 0 }),
      });
    };

    const onPointer = (e: PointerEvent) =>
      scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    let pointerBound = false;
    const bindPointer = () => {
      if (scene.tier.pointerEnabled && !pointerBound) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        pointerBound = true;
      } else if (!scene.tier.pointerEnabled && pointerBound) {
        window.removeEventListener("pointermove", onPointer);
        pointerBound = false;
      }
    };
    bindPointer();

    let lastWidth = 0;
    let pending = 0;
    const onResize = () => {
      pending = 0;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const widthChanged = w !== lastWidth;
      // No URL-bar guard needed: the hero is sized in svh, so a height change here is a real
      // layout change (on phones the copy above the figure sets the section's height).
      lastWidth = w;
      if (widthChanged) {
        scene.retune();
        bindPointer();
      }
      scene.resize(w, h);
      applyFit();
    };
    const ro = new ResizeObserver(() => {
      if (!pending) pending = requestAnimationFrame(onResize);
    });
    ro.observe(container);
    onResize();

    // Render only while the hero is on screen (plus ten frames) and the tab is visible.
    let inView = true;
    let grace = 10;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) grace = 10;
    });
    io.observe(section);

    let raf = 0;
    let last = -Infinity;
    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (!inView) {
        if (grace <= 0) return;
        grace -= 1;
      }
      if (time - last <= scene.tier.frameInterval) return;
      last = time;
      scene.update(time);
    };
    raf = requestAnimationFrame(frame);

    scene.onReady = () => setState("ready");
    scene.load().catch(() => setState("failed"));

    return () => {
      cancelAnimationFrame(raf);
      if (pending) cancelAnimationFrame(pending);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // The figure rises and the blueprint burns once the page loader has handed over.
  React.useEffect(() => {
    if (play && state === "ready") sceneRef.current?.beginRise();
  }, [play, state]);

  return { sectionRef, canvasRef, boxRef, state };
}

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const appReady = useAppReady();
  const [timedOut, setTimedOut] = React.useState(false);
  const { sectionRef, canvasRef, boxRef, state } = useHeroScene(appReady);

  // Don't hold the copy hostage to a slow scene: 2.5s after the loader it plays regardless.
  React.useEffect(() => {
    if (!appReady) return;
    const id = window.setTimeout(() => setTimedOut(true), 2500);
    return () => window.clearTimeout(id);
  }, [appReady]);
  const play = appReady && (state !== "loading" || timedOut);

  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      ref(node);
    },
    [ref, sectionRef]
  );

  const goContact = () => {
    setActiveSection("Contact");
    setTimeOfLastClick(Date.now());
  };

  return (
    <>
      <section ref={setRefs} id="home" data-ground="light" className="kh" aria-label="Introduction">
        <div className="kh-scene" aria-hidden="true">
          <canvas ref={canvasRef} className={state === "ready" ? "is-ready" : ""} />
          {state === "failed" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="kh-fallback" src={PORTRAIT} alt="" />
          )}
        </div>
        <div className="kh-fitwrap" aria-hidden="true">
          <div className="kh-fitbox" ref={boxRef} />
        </div>
        <div className="kh-ramp" aria-hidden="true" />
        <div className="kh-ramp2" aria-hidden="true" />
        <div className="kh-wash" aria-hidden="true" />

        <div className="kh-content">
          <div className="kh-middle">
            <div className="kh-identity">
              <div>
                <motion.div
                  className="kh-id"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: play ? 1 : 0 }}
                  transition={spring(REVEAL[0], REVEAL[1], 180)}
                >
                  I design it &amp; build it
                </motion.div>
                <SplitReveal
                  as="h1"
                  className="kh-name"
                  text="Pasindu Sannasuriya"
                  by="words"
                  play={play}
                  delay={180}
                  stagger={110}
                  config={REVEAL}
                  softFrom={1}
                />
                <svg
                  className={`kh-underline e-pen ${play ? "is-in" : ""}`}
                  viewBox="0 0 400 22"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 15c60-9 130-12 200-8 55 3 120 7 194-2"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ ["--len" as any]: 420, ["--pen-d" as any]: "0.85s" }}
                  />
                </svg>
                <Rise play={play} delay={440} y="0.75rem" className="kh-lead">
                  <p>
                    Senior UI/UX Engineer &amp; Product Designer from Sri Lanka, turning complex IoT, fintech and POS
                    problems into simple products.
                  </p>
                </Rise>
                {/* The same pair the old hero carried: the site's blue pill, then the underlined ghost link. */}
                <Rise play={play} delay={600} y="0.75rem" className="kh-ctas">
                  <ArrowButton variant="blue" href="#contact" onClick={goContact}>
                    Hire me
                  </ArrowButton>
                  <ArrowButton variant="ghost" href={HERO_CV} target="_blank" rel="noopener noreferrer">
                    Download my CV
                  </ArrowButton>
                </Rise>
              </div>
            </div>

            <Rise className="kh-panels" play={play} delay={900}>
              <div className="kh-bpanel">
                <Corners />
                <div className="kh-eyebrow">at a glance</div>
                <dl className="kh-stats">
                  {STATS.map((stat, i) => (
                    <div key={stat.label} className="kh-stat">
                      <dt>{stat.label}</dt>
                      {/* Counts up from zero once the loader has gone, staggered down the column. */}
                      <dd>
                        <CountUp value={stat.value} play={play} delay={1100 + i * 180} className="kh-stat__num" />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Rise>
          </div>

          <Rise className="kh-actions" play={play} delay={1500}>
            <div className="kh-socials">
              <a className="kh-hover" href={PERSON.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a className="kh-hover" href={PERSON.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="kh-hover" href={`mailto:${PERSON.email}`}>
                Email
              </a>
            </div>
          </Rise>
        </div>
      </section>

      <div className="e-proof">
        <div className="e-container">
          <Reveal className="e-proof__panel">
            <p className="e-mono e-proof__label">Tools I design &amp; build with</p>
            <div className="e-marquee" style={{ ["--dur" as any]: "90s" }}>
              {/* Two identical groups: each one slides by exactly its own width (-100%), so the loop has no seam. */}
              <div className="e-marquee__track">
                {[0, 1].map((copy) => (
                  <div key={copy} className="e-marquee__group" aria-hidden={copy === 1 || undefined}>
                    {techStack.map((tech) => {
                      const Icon = tech.icon;
                      return (
                        <span key={tech.name} className="e-proof__item">
                          <Icon />
                          {tech.name}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
