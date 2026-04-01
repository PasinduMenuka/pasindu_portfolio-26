"use client";

import React from "react";
import SectionHeading from "./section-heading";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/context/theme-context";
import { motion } from "framer-motion";

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40 w-full px-4">
      <SectionHeading subtitle="My professional journey — building impactful products">
        My experience
      </SectionHeading>

      <VerticalTimeline
        lineColor={isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 212, 255, 0.3)"}
      >
        {experiencesData.map((item, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              contentStyle={{
                background: isDark
                  ? "rgba(13, 22, 40, 0.7)"
                  : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: isDark
                  ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
                border: isDark
                  ? "1px solid rgba(0, 212, 255, 0.12)"
                  : "1px solid rgba(0, 212, 255, 0.15)",
                textAlign: "left",
                padding: "1.75rem 2rem",
                borderRadius: "1rem",
              }}
              contentArrowStyle={{
                borderRight: isDark
                  ? "0.4rem solid rgba(0, 212, 255, 0.3)"
                  : "0.4rem solid rgba(0, 212, 255, 0.4)",
              }}
              date={item.date}
              icon={item.icon}
              iconStyle={{
                background: isDark
                  ? "rgba(13, 22, 40, 0.9)"
                  : "white",
                color: "#00D4FF",
                boxShadow: `0 0 0 3px #00D4FF, 0 0 20px rgba(0,212,255,0.4)`,
                fontSize: "1.25rem",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "linear-gradient(90deg, #00D4FF, #4A90E2)",
                  borderRadius: "1rem 1rem 0 0",
                }}
              />

              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bold text-lg leading-tight" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                  {item.title}
                </h3>
              </div>

              <p
                className="font-semibold text-sm mb-3"
                style={{
                  background: "linear-gradient(135deg, #00D4FF, #4A90E2)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {item.location}
              </p>

              <p
                className="text-sm leading-relaxed"
                style={{ color: isDark ? "rgba(148,163,184,0.9)" : "#475569" }}
              >
                {item.description}
              </p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  );
}
