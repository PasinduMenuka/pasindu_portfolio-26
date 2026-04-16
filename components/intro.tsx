"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 180, damping: 22 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 140, damping: 24, delay: 0.25 },
  },
};

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[82rem] w-full sm:mb-0 scroll-mt-[100rem] relative px-4"
    >
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-between gap-14 lg:gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Left Content ── */}
        <div className="flex-1 text-center lg:text-left">

          {/* Available badge */}
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7 border"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
            }}
            variants={itemVariants}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Available for new opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-extrabold leading-[1.04] tracking-tight mb-5">
              <span className="block text-[var(--color-text-primary)]">Hi, I'm</span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #00D4FF 0%, #4A90E2 55%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Pasindu
              </span>
            </h1>
          </motion.div>

          {/* Role line */}
          <motion.p
            className="text-lg sm:text-xl font-medium text-[var(--color-text-secondary)] mb-2 leading-relaxed"
            variants={itemVariants}
          >
            Senior{" "}
            <span
              className="font-bold"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              UI/UX Engineer / Product Designer
            </span>
          </motion.p>

          <motion.p
            className="text-base text-[var(--color-text-muted)] mb-9 max-w-lg mx-auto lg:mx-0"
            variants={itemVariants}
          >
            Crafting user-centric digital experiences with{" "}
            <span className="font-semibold text-[var(--color-text-secondary)]">5+ years</span>{" "}
            of turning complex problems into beautiful, intuitive solutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-9"
            variants={itemVariants}
          >
            <Link
              href="#contact"
              className="btn-primary"
              onClick={() => {
                setActiveSection("Contact");
                setTimeOfLastClick(Date.now());
              }}
            >
              Let's work together
              <BsArrowRight className="text-sm" />
            </Link>

            <a className="btn-secondary" href="/CV.pdf" download>
              Download CV
              <HiDownload className="text-sm" />
            </a>
          </motion.div>

          {/* Social + Stats row */}
          <motion.div
            className="flex items-center justify-center lg:justify-start gap-3 flex-wrap"
            variants={itemVariants}
          >
            {/* LinkedIn */}
            <a
              className="flex items-center gap-2 p-3 rounded-full border transition-all duration-300"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                borderColor: 'var(--glass-border)',
                color: 'var(--color-text-secondary)',
              }}
              href="https://linkedin.com"
              target="_blank"
              aria-label="LinkedIn Profile"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(0,212,255,0.5)';
                el.style.color = '#00D4FF';
                el.style.boxShadow = '0 0 18px rgba(0,212,255,0.2)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--glass-border)';
                el.style.color = 'var(--color-text-secondary)';
                el.style.boxShadow = 'none';
                el.style.transform = 'none';
              }}
            >
              <BsLinkedin className="text-xl" />
            </a>

            {/* GitHub */}
            <a
              className="flex items-center gap-2 p-3 rounded-full border transition-all duration-300"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                borderColor: 'var(--glass-border)',
                color: 'var(--color-text-secondary)',
              }}
              href="https://github.com"
              target="_blank"
              aria-label="GitHub Profile"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(0,212,255,0.5)';
                el.style.color = '#00D4FF';
                el.style.boxShadow = '0 0 18px rgba(0,212,255,0.2)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--glass-border)';
                el.style.color = 'var(--color-text-secondary)';
                el.style.boxShadow = 'none';
                el.style.transform = 'none';
              }}
            >
              <FaGithubSquare className="text-2xl" />
            </a>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8" style={{ background: 'var(--color-border)' }} />

            {/* Stat pills */}
            {[
              { value: '5+', label: 'Years exp.' },
              { value: '20+', label: 'Projects' },
            ].map((s) => (
              <div
                key={s.label}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {s.value}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right — Profile Image ── */}
        <motion.div
          className="relative flex-shrink-0 flex items-center justify-center"
          variants={imageVariants}
        >
          {/* Static ambient glow — no rotation */}
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, #00D4FF 0%, #4A90E2 40%, transparent 70%)',
            }}
          />

          {/* Decorative corner accent — top-left */}
          <div
            className="absolute -top-3 -left-3 w-14 h-14 rounded-tl-2xl border-t-2 border-l-2 pointer-events-none"
            style={{ borderColor: '#00D4FF', opacity: 0.6 }}
          />
          {/* Decorative corner accent — bottom-right */}
          <div
            className="absolute -bottom-3 -right-3 w-14 h-14 rounded-br-2xl border-b-2 border-r-2 pointer-events-none"
            style={{ borderColor: '#4A90E2', opacity: 0.6 }}
          />

          {/* Image frame */}
          <div
            className="relative h-64 w-56 sm:h-[22rem] sm:w-72 lg:h-[26rem] lg:w-80 rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '1.5px solid rgba(0,212,255,0.25)' }}
          >
            <Image
              src="/projects/profile image.jpeg"
              alt="Pasindu Sannasuriya"
              width={320}
              height={420}
              quality={95}
              priority
              className="h-full w-full object-cover object-top"
            />
            {/* Subtle colour wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060d1a]/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Stat card — experience (right side) */}
          <motion.div
            className="absolute -right-5 top-8 flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl border hidden sm:flex"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(0,212,255,0.25)',
              boxShadow: '0 4px 24px rgba(0,212,255,0.12)',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 160, damping: 20 }}
          >
            <span
              className="text-xl font-extrabold leading-none"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              5+
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] font-medium tracking-wide">Years</span>
          </motion.div>

          {/* Stat card — projects (bottom) */}
          <motion.div
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-xl border hidden sm:flex"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(74,144,226,0.25)',
              boxShadow: '0 4px 24px rgba(74,144,226,0.12)',
              whiteSpace: 'nowrap',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, type: 'spring', stiffness: 160, damping: 20 }}
          >
            <span
              className="text-xl font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #4A90E2, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              20+
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">Projects Delivered</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden lg:flex flex-col items-center gap-2 mt-20 cursor-pointer select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] text-[var(--color-text-muted)] tracking-[0.2em] uppercase">Scroll</span>
        <div
          className="w-5 h-8 rounded-full border flex items-start justify-center p-1"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ background: 'linear-gradient(180deg, #00D4FF, #4A90E2)' }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
