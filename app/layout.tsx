'use client'
import Header from "@/components/header";
import "./globals.css";
import "./ency.css";
import localFont from "next/font/local";
import { usePathname, useSearchParams } from "next/navigation";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import Logo from "@/components/logo";
import { Toaster } from "react-hot-toast";
import {useEffect, useState} from "react";
import { Provider } from 'react-redux';
import { store } from './store';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

// Fonts are bundled in app/fonts so builds and dev never depend on reaching Google Fonts.
const inter = localFont({ src: "./fonts/inter.woff2", weight: "100 900", variable: "--font-inter", display: "swap" });
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400" },
    { path: "./fonts/poppins-500.woff2", weight: "500" },
    { path: "./fonts/poppins-600.woff2", weight: "600" },
    { path: "./fonts/poppins-700.woff2", weight: "700" },
    { path: "./fonts/poppins-800.woff2", weight: "800" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
const display = localFont({
  src: "./fonts/big-shoulders-display.woff2",
  weight: "800 900",
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});
const hand = localFont({ src: "./fonts/caveat.woff2", weight: "500 700", variable: "--font-hand", display: "swap", fallback: ["cursive"] });
const mono = localFont({ src: "./fonts/jetbrains-mono.woff2", weight: "400 500", variable: "--font-mono", display: "swap", fallback: ["ui-monospace", "monospace"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Pages using the Ency design: home and the full portfolio listing (/projects without ?id)
  const isHome = pathname === "/" || (pathname === "/projects" && !searchParams?.get("id"));
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for cursor glow
  useEffect(() => {
    if (isHome) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHome]);

  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="theme-color" content={isHome ? "#0000ff" : "#060d1a"} />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${display.variable} ${hand.variable} ${mono.variable} font-sans relative overflow-x-hidden ${
          isHome ? "is-home" : "bg-[var(--color-bg)] text-[var(--color-text-primary)] pt-28 sm:pt-36 mesh-bg"
        }`}
      >
        
        {/* Page loader */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="page-loader"
              role="status"
              aria-label="Loading portfolio"
              exit={{ opacity: 0, y: "-2%" }}
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="loader-content">
                <div className="loader-mark">
                  <Logo className="loader-logo" title="Pasindu Sannasuriya" />
                  <span className="loader-mark__spark" aria-hidden="true" />
                </div>
                <p className="loader-eyebrow">PASINDU SANNASURIYA <span>·</span> PORTFOLIO</p>
                <p className="loader-message">Crafting thoughtful digital experiences.</p>
                <div className="loader-track" aria-hidden="true"><span /></div>
                <p className="loader-caption">Loading the good stuff<span className="loader-dots">...</span></p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll progress bar */}
        {!isHome && (
          <motion.div
            className="scroll-progress"
            style={{ scaleX }}
          />
        )}

        {/* Cursor glow (desktop only) */}
        {!isHome && <div
          className="cursor-glow hidden lg:block"
          style={{
            left: mousePos.x - 12,
            top: mousePos.y - 12,
          }}
        />}

        {/* Background orbs for parallax depth */}
        {!isHome && <div className="parallax-bg fixed inset-0 pointer-events-none z-[-1]">
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />
          <div className="floating-orb floating-orb-3" />
        </div>}

          <ActiveSectionContextProvider>
            <Provider store={store}>
              <Header />
              {children}
              <Footer />
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--color-text-primary)',
                    borderRadius: '12px',
                  }
                }}
              />
            </Provider>
          </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
