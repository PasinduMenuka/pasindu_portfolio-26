"use client";

import React from "react";
import Image from "next/image";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import AboutOrbit from "./about-orbit";

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

      {/* Orbit diagram + bio card + pills */}
      <AboutOrbit />

    </motion.section>
  );
}
