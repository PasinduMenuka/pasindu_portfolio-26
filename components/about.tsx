"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[56rem] w-full text-center sm:mb-40 scroll-mt-28 px-4"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      id="about"
    >
      <SectionHeading subtitle="Passionate about creating meaningful digital experiences">
        About me
      </SectionHeading>

      {/* Profile photo */}
      <motion.div
        className="about-avatar-wrap"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 130, damping: 18, delay: 0.1 }}
      >
        <div className="about-avatar-ring">
          <Image
            src="/projects/profile image.jpeg"
            alt="Pasindu Sannasuriya"
            width={160}
            height={160}
            className="about-avatar-img"
            priority
          />
        </div>
      </motion.div>

      {/* Glassmorphism card */}
      <motion.div
        className="relative rounded-2xl p-8 sm:p-10 text-left overflow-hidden"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
        whileHover={{
          boxShadow: 'var(--glass-shadow), 0 0 40px rgba(0,212,255,0.08)',
          borderColor: 'rgba(0,212,255,0.15)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Decorative accent */}
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
          style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #4A90E2 100%)' }}
        />

        {/* Quote icon */}
        <div
          className="text-5xl mb-4 leading-none font-serif select-none"
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          "
        </div>

        <p className="text-[var(--color-text-secondary)] leading-8 text-base sm:text-lg mb-4">
          <span className="font-bold text-[var(--color-text-primary)]">Product Designer & UI/UX Engineer</span>{" "}
          with{" "}
          <span className="font-bold text-[var(--color-text-primary)]">5+ years</span>{" "}
          of experience designing intuitive web and mobile applications. Experienced in IoT, AI-driven products, POS systems, ERP platforms, and fintech solutions, with a strong focus on user research and end-to-end product design.
        </p>

        <p className="text-[var(--color-text-secondary)] leading-8 text-base sm:text-lg">
          Proficient in <span className="font-bold text-[var(--color-text-primary)]">React.js</span> and{" "}
          <span className="font-bold text-[var(--color-text-primary)]">Next.js</span>, bridging the gap between design and development. Passionate about creating scalable, user-centered, and visually compelling digital experiences.
        </p>
      </motion.div>

    </motion.section>
  );
}
