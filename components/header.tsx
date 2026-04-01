"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="z-[999] relative">
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 h-[4.5rem] w-full sm:top-6 sm:h-[3.25rem] sm:w-[44rem] sm:rounded-full transition-all duration-500"
        style={{
          background: scrolled ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--glass-shadow)' : 'none',
        }}
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
      />

      <nav className="flex fixed top-0 left-1/2 h-[4.5rem] -translate-x-1/2 items-center sm:top-6 sm:h-[3.25rem]">
        <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.875rem] font-medium sm:w-[initial] sm:flex-nowrap sm:gap-1">
          {links.map((link) => (
            <motion.li
              className="flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <Link
                className={clsx(
                  "relative flex w-full items-center justify-center px-4 py-2 rounded-full transition-all duration-300",
                  activeSection === link.name
                    ? "text-white font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
                href={link.hash}
                onClick={() => {
                  setActiveSection(link.name);
                  setTimeOfLastClick(Date.now());
                }}
              >
                {link.name}

                {link.name === activeSection && (
                  <motion.span
                    className="absolute inset-0 rounded-full -z-10"
                    style={{
                      background: 'linear-gradient(135deg, #00D4FF 0%, #4A90E2 100%)',
                      boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)',
                    }}
                    layoutId="activeSection"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
