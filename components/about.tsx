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

      {/* Profile photo + intro row */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-8 mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Avatar */}
        <div className="about-avatar-wrap flex-shrink-0">
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
        </div>

        {/* Name + title */}
        <div className="text-left">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{
              background: "linear-gradient(135deg, #00D4FF, #4A90E2)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pasindu Sannasuriya
          </h2>
          <p className="text-[var(--color-text-secondary)] text-base sm:text-lg font-medium">
            Senior UI/UX Engineer &amp; Product Designer
          </p>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            5+ years · IoT · Fintech · AI · POS · ERP
          </p>
        </div>
      </motion.div>

      {/* Bio card */}
      <motion.div
        className="relative rounded-2xl p-7 sm:p-9 text-left overflow-hidden mb-6"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
        }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{
          borderColor: "rgba(0,212,255,0.2)",
          boxShadow: "var(--glass-shadow), 0 0 40px rgba(0,212,255,0.08)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
          style={{ background: "linear-gradient(135deg, #00D4FF 0%, #4A90E2 100%)" }}
        />
        <p className="text-[var(--color-text-secondary)] leading-8 text-base sm:text-lg">
          I combine <span className="font-semibold text-[var(--color-text-primary)]">product thinking</span>,{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">UX design</span>, and{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">frontend engineering</span> into one role.
          I handle user research, UX strategy, wireframing, low-to-high fidelity Figma prototyping, UI design systems,
          and responsive web &amp; mobile interfaces — then bring them to life with{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">React.js</span> and{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">Next.js</span>.
        </p>
      </motion.div>

      {/* Focus areas */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {[
          { icon: "🎨", label: "UI / UX Design" },
          { icon: "📐", label: "Product Design" },
          { icon: "🔬", label: "User Research" },
          { icon: "⚛️", label: "React & Next.js" },
          { icon: "🧩", label: "Design Systems" },
          { icon: "📱", label: "Mobile Interfaces" },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--glass-border)",
            }}
            whileHover={{
              borderColor: "rgba(0,212,255,0.3)",
              boxShadow: "0 0 20px rgba(0,212,255,0.1)",
            }}
            transition={{ delay: 0.1 * i }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

    </motion.section>
  );
}
