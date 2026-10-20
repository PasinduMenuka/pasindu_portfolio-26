"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import { links } from "@/lib/data";
import { useActiveSectionContext } from "@/context/active-section-context";
import type { SectionName } from "@/lib/types";
import Logo from "@/components/logo";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Pick header colours from whichever section ([data-ground]) sits under it.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const probe = 40;
      let ground = "white";
      document.querySelectorAll<HTMLElement>("[data-ground]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) ground = el.dataset.ground ?? "white";
      });
      const dark = ground === "ink" || ground === "blue" || document.documentElement.classList.contains("dark");
      setTheme(dark ? "dark" : "light");
      setScrolled(window.scrollY > 120);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const mo = new MutationObserver(onScroll);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (name: SectionName) => {
    setActiveSection(name);
    setTimeOfLastClick(Date.now());
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="e-header"
        data-theme={menuOpen ? "dark" : theme}
        data-scrolled={scrolled || menuOpen ? "" : undefined}
        data-menu={menuOpen ? "" : undefined}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="e-container e-header__inner">
          <Link href="/#home" className="e-header__logo" aria-label="Pasindu Sannasuriya, home" onClick={() => go("Home")}>
            <Logo title="" />
          </Link>

          <nav aria-label="Primary">
            <ul className="e-nav">
              {links.map((link) => {
                const active = activeSection === link.name;
                return (
                  <li key={link.hash}>
                    <Link
                      href={link.hash}
                      className={clsx(active && "is-active")}
                      aria-current={active ? "true" : undefined}
                      onClick={() => go(link.name)}
                    >
                      {active && (
                        <motion.span
                          layoutId="e-nav-pill"
                          className="e-nav__pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/94776217729"
              className="e-header__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="e-header__avatar">
                <span className="e-face" />
              </span>
              Let&apos;s talk
            </a>
            <button
              type="button"
              className="e-burger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="e-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
          >
            <ul>
              {links.map((link, i) => (
                <li key={link.hash} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <Link
                      href={link.hash}
                      className={clsx("e-menu__link", activeSection === link.name && "is-active")}
                      onClick={() => go(link.name)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="flex flex-wrap items-center justify-between gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <span className="e-hand text-2xl text-[var(--e-yellow)]">say hello, I don&apos;t bite</span>
              <a className="e-btn e-btn--white" href="mailto:sannasuriyapm@gmail.com">
                sannasuriyapm@gmail.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
