"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { motion } from "framer-motion";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50 border"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'var(--glass-border)',
        boxShadow: 'var(--glass-shadow), 0 0 20px rgba(0,212,255,0.1)',
        color: theme === 'light' ? '#f59e0b' : '#00D4FF',
      }}
      onClick={toggleTheme}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {theme === "light" ? (
          <BsSun className="text-lg" />
        ) : (
          <BsMoon className="text-lg" />
        )}
      </motion.div>
    </motion.button>
  );
}
