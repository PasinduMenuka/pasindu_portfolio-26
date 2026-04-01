"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "20+", label: "Projects Completed" },
  { value: "100%", label: "User-Centered Focus" },
];

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
          As a{" "}
          <span className="font-bold text-[var(--color-text-primary)]">Senior UI/UX Engineer</span>{" "}
          with{" "}
          <span className="font-bold text-[var(--color-text-primary)]">over 5 years</span>{" "}
          of dedicated experience, I am passionate about creating meaningful and intuitive digital
          experiences that resonate with users.
        </p>

        <p className="text-[var(--color-text-secondary)] leading-8 text-base sm:text-lg">
          My role has been pivotal in shaping the design and functionality of various digital products,
          including{" "}
          <span className="font-bold text-[var(--color-text-primary)]">web applications</span> and{" "}
          <span className="font-bold text-[var(--color-text-primary)]">mobile apps</span>, ensuring
          optimal user engagement and satisfaction. I specialize in transforming concepts and ideas into
          visually appealing, scalable, and highly functional interfaces.
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="rounded-xl p-5 text-center"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{
              borderColor: 'rgba(0,212,255,0.3)',
              boxShadow: '0 0 20px rgba(0,212,255,0.1)',
              translateY: -2,
            }}
          >
            <div
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
