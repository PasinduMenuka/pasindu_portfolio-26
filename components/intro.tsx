"use client";

import React from "react";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaReact, FaFigma, FaHtml5, FaCss3Alt, FaJsSquare } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiFramer, SiRedux, SiAdobephotoshop, SiAdobexd, SiMiro } from "react-icons/si";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import ArrowButton from "@/components/arrow-button";
import { Reveal, SplitHeading, useInViewOnce } from "@/components/motion/reveal";

const techStack = [
  { name: "Figma", icon: FaFigma },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: FaReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Framer Motion", icon: SiFramer },
  { name: "Redux", icon: SiRedux },
  { name: "Shadcn UI", icon: BsGrid3X3Gap },
  { name: "Adobe XD", icon: SiAdobexd },
  { name: "Miro", icon: SiMiro },
  { name: "HTML5", icon: FaHtml5 },
  { name: "CSS3", icon: FaCss3Alt },
  { name: "JavaScript", icon: FaJsSquare },
  { name: "Photoshop", icon: SiAdobephotoshop },
];

function HeroNote() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={`e-hero__note e-hand ${inView ? "is-in" : ""}`} aria-hidden="true">
      that&apos;s me. I design it <em>and</em> build it
      <svg className="e-pen" viewBox="0 0 90 60" fill="none">
        <path
          d="M4 6c18 2 40 10 52 26 6 8 9 15 10 22"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ ["--len" as any]: 90, ["--pen-d" as any]: "1.1s" }}
        />
        <path
          d="M58 46l8 9 7-11"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ ["--len" as any]: 30, ["--pen-d" as any]: "1.7s" }}
        />
      </svg>
    </div>
  );
}

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const underline = useInViewOnce<SVGSVGElement>();
  const [hasScrolled, setHasScrolled] = React.useState(false);

  React.useEffect(() => {
    const updatePortrait = () => setHasScrolled(window.scrollY > 120);
    updatePortrait();
    window.addEventListener("scroll", updatePortrait, { passive: true });
    return () => window.removeEventListener("scroll", updatePortrait);
  }, []);

  return (
    <>
      <section ref={ref} id="home" data-ground="blue" className="e-hero g-blue">
        <div className="e-container e-hero__grid">
          <div>
            <SplitHeading
              as="h1"
              className="e-hero__title"
              lines={[
                { text: "Products that feel", className: "e-hero__line", block: true },
                { text: "effortless", className: "is-soft e-hero__line", block: true },
              ]}
            />
            <svg
              ref={underline.ref}
              className={`e-hero__underline e-pen ${underline.inView ? "is-in" : ""}`}
              viewBox="0 0 400 22"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 15c60-9 130-12 200-8 55 3 120 7 194-2"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ ["--len" as any]: 420, ["--pen-d" as any]: "0.75s" }}
              />
            </svg>

            <Reveal delay={2} as="p" className="e-lead e-hero__copy">
              I&apos;m Pasindu, a Senior UI/UX Engineer &amp; Product Designer based in Sri Lanka. For 5+ years
              I&apos;ve been turning messy, poorly defined problems into precise, scalable product experiences across
              IoT, fintech, POS and AI. Research, design and the front-end code, all from one person.
            </Reveal>

            <Reveal delay={3} className="e-hero__ctas">
              <ArrowButton
                variant="white"
                href="#contact"
                onClick={() => {
                  setActiveSection("Contact");
                  setTimeOfLastClick(Date.now());
                }}
              >
                Hire me
              </ArrowButton>
              <ArrowButton variant="ghost" href="https://drive.google.com/file/d/1AuQ0pFahUC0L0MWK41k-5Ddj1mu37n5t/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                Download my CV
              </ArrowButton>
            </Reveal>
          </div>

          <Reveal delay={1} className="e-hero__stage">
            <svg className="e-hero__shape" viewBox="0 0 200 200" aria-hidden="true">
              <path d="M12 140 112 40H72V10H190V128H160V88L42 206Z" fill="currentColor" />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`e-hero__photo${hasScrolled ? "" : " is-visible"}`}
              src="/hero-portrait.png"
              alt={hasScrolled ? "" : "Pasindu Sannasuriya"}
              aria-hidden={hasScrolled}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`e-hero__photo${hasScrolled ? " is-visible" : ""}`}
              src="/hero-portrait-scroll.png"
              alt={hasScrolled ? "Pasindu Sannasuriya" : ""}
              aria-hidden={!hasScrolled}
            />
            <HeroNote />
          </Reveal>
        </div>
      </section>

      <div className="e-proof">
        <div className="e-container">
          <Reveal className="e-proof__panel">
            <p className="e-mono e-proof__label">Tools I design &amp; build with</p>
            <div className="e-marquee" style={{ ["--dur" as any]: "45s" }}>
              <div className="e-marquee__track">
                {[...techStack, ...techStack].map((tech, i) => {
                  const Icon = tech.icon;
                  return (
                    <span key={`${tech.name}-${i}`} className="e-proof__item" aria-hidden={i >= techStack.length}>
                      <Icon />
                      {tech.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
