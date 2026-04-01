"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <motion.div
      className="my-24 hidden sm:flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.125 }}
    >
      <motion.div
        className="w-0.5 h-16 rounded-full"
        style={{
          background: 'linear-gradient(180deg, transparent, #00D4FF, #4A90E2, transparent)',
          boxShadow: '0 0 12px rgba(0,212,255,0.4)',
        }}
        animate={{ scaleY: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
