"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";

// Skill icons mapping (emoji fallbacks)
const skillIcons: Record<string, string> = {
  "User Research": "🔍",
  "Information Architecture": "🗺️",
  "Prototyping and Design": "✏️",
  "Usability Testing": "🧪",
  "Interaction Design": "🖱️",
  "User-Centered Design": "👤",
  "Collaboration": "🤝",
  "User-Centered Innovation": "💡",
  "User Flow": "🌊",
  "Task Flow": "📋",
  "Flow Diagram": "📊",
  "Site Map": "🗂️",
  "HTML": "🌐",
  "Css": "🎨",
  "Next.JS": "▲",
  "React.JS": "⚛️",
};

const skillCategories = [
  {
    label: "UX Research & Strategy",
    color: "rgba(0,212,255,0.12)",
    accent: "#00D4FF",
    skills: ["User Research", "Information Architecture", "Usability Testing", "User-Centered Design", "User-Centered Innovation"],
  },
  {
    label: "Design & Prototyping",
    color: "rgba(74,144,226,0.12)",
    accent: "#4A90E2",
    skills: ["Prototyping and Design", "Interaction Design", "Flow Diagram", "User Flow", "Task Flow", "Site Map"],
  },
  {
    label: "Development & Tools",
    color: "rgba(139,92,246,0.12)",
    accent: "#8B5CF6",
    skills: ["HTML", "Css", "Next.JS", "React.JS", "Collaboration"],
  },
];

export default function Skills() {
  const { ref } = useSectionInView("Skills");

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-28 max-w-[56rem] w-full scroll-mt-28 sm:mb-40 px-4"
    >
      <SectionHeading subtitle="Technologies and methodologies I work with">
        My skills
      </SectionHeading>

      <div className="space-y-6">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${category.accent}30`,
              boxShadow: 'var(--glass-shadow)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.15, duration: 0.6 }}
          >
            {/* Category label */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: category.accent, boxShadow: `0 0 8px ${category.accent}` }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: category.accent }}
              >
                {category.label}
              </span>
            </div>

            {/* Skill pills */}
            <ul className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, index) => {
                const globalIndex = skillsData.indexOf(skill as typeof skillsData[number]);
                return (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium cursor-default select-none"
                    style={{
                      background: `${category.color}`,
                      border: `1px solid ${category.accent}25`,
                      color: 'var(--color-text-secondary)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: catIndex * 0.1 + index * 0.04,
                      type: "spring",
                      stiffness: 300,
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: `${category.accent}18`,
                      borderColor: `${category.accent}60`,
                      color: category.accent,
                      boxShadow: `0 0 15px ${category.accent}20`,
                      y: -2,
                    }}
                  >
                    <span className="text-sm leading-none">{skillIcons[skill] || "•"}</span>
                    {skill}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
