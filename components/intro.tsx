"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsLinkedin, BsGrid3X3Gap } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare, FaReact, FaFigma, FaHtml5, FaCss3Alt, FaJsSquare } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiFramer, SiRedux, SiAdobephotoshop, SiAdobexd, SiMiro } from "react-icons/si";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 150, damping: 22 },
  },
};

const heroStats = [
  { value: "5+", label: "Years Exp." },
  { value: "20+", label: "Projects" },
  { value: "100%", label: "Dedication" },
];

const techStack = [
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: FaReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Framer Motion", icon: SiFramer },
  { name: "Redux", icon: SiRedux },
  { name: "Figma", icon: FaFigma },
  { name: "Shadcn UI", icon: BsGrid3X3Gap },
  { name: "Adobe XD", icon: SiAdobexd },
  { name: "Miro", icon: SiMiro },
  { name: "HTML5", icon: FaHtml5 },
  { name: "CSS3", icon: FaCss3Alt },
  { name: "JavaScript", icon: FaJsSquare },
  { name: "Photoshop", icon: SiAdobephotoshop },
];

function TechCarousel() {
  const track = [...techStack, ...techStack];

  return (
    <div className="hero-tech-marquee" aria-label="Technology stack">
      <div className="hero-tech-track">
        {track.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <div key={`${tech.name}-${index}`} className="hero-tech-pill">
              <Icon className="hero-tech-icon" />
              <span>{tech.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.85]);

  return (
    <section
      ref={(node) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      id="home"
      className="relative w-screen overflow-hidden -mt-28 sm:-mt-36 scroll-mt-[100rem] mb-14 sm:mb-0"
    >
      <motion.div className="hero-modern-bg" style={{ y: bgY, scale: bgScale }}>
        <div className="hero-modern-orb hero-modern-orb-a" />
        <div className="hero-modern-orb hero-modern-orb-b" />
        <div className="hero-modern-grid" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-[64rem] px-4 sm:px-8 pt-20 sm:pt-40 pb-10 sm:pb-20 flex flex-col items-center text-center"
        style={{ y: contentY, opacity: contentOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Available badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-5 sm:mb-8 hero-badge"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span>Available for new opportunities</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="hero-title">
          <span className="block">Hi, I&apos;m</span>
          <span className="block hero-title-accent">Pasindu</span>
        </motion.h1>

        {/* Role */}
        <motion.p variants={itemVariants} className="hero-role">
          Senior <span>UI/UX Engineer / Product Designer</span>
        </motion.p>

        {/* Description */}
        <motion.p variants={itemVariants} className="hero-copy">
          Crafting user-centric digital experiences with <span>5+ years</span> of turning
          complex problems into beautiful, intuitive solutions.
        </motion.p>

        {/* Inline stat pills */}
        <motion.div variants={itemVariants} className="hero-stat-pills">
          {heroStats.map((s) => (
            <div key={s.label} className="hero-stat-pill">
              <span className="hero-stat-pill-value">{s.value}</span>
              <span className="hero-stat-pill-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto"
        >
          <Link
            href="#contact"
            className="btn-primary w-full sm:w-auto"
            onClick={() => {
              setActiveSection("Contact");
              setTimeOfLastClick(Date.now());
            }}
          >
            Let&apos;s work together
            <BsArrowRight className="text-sm" />
          </Link>
          <a className="btn-secondary w-full sm:w-auto" href="/Pasindu-Sannasuriya-Resume.pdf" download="Pasindu-Sannasuriya-Resume.pdf">
            Download CV
            <HiDownload className="text-sm" />
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div variants={itemVariants} className="mt-4 sm:mt-5 flex items-center justify-center gap-3">
          <a className="hero-social" href="https://linkedin.com" target="_blank" aria-label="LinkedIn Profile">
            <BsLinkedin />
          </a>
          <a className="hero-social" href="https://github.com" target="_blank" aria-label="GitHub Profile">
            <FaGithubSquare />
          </a>
        </motion.div>

        {/* Tech Carousel */}
        <motion.div variants={itemVariants} className="mt-10 sm:mt-14 w-full">
          <div className="hero-tech-panel">
            <div className="hero-tech-header">
              <span className="hero-tech-label">Tech Stack</span>
              <span className="hero-tech-subtitle">Trusted tools &amp; product stack</span>
            </div>
            <TechCarousel />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
