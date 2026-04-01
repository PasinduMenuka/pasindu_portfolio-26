"use client";

import React from "react";
import { motion } from "framer-motion";

type SectionHeadingProps = {
  children: React.ReactNode;
  subtitle?: string;
};

export default function SectionHeading({ children, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold capitalize tracking-tight text-[var(--color-text-primary)] mb-3">
        {children}
      </h2>
      {subtitle && (
        <p className="text-[var(--color-text-secondary)] text-base mt-2 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="flex justify-center mt-4">
        <motion.div
          className="h-0.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #4A90E2 100%)',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.6)',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
