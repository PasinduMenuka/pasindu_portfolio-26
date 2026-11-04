'use client'
import Header from "@/components/header";
import { encyCaseStudyPaths } from "@/lib/data";
import { usePathname } from "next/navigation";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import { LoaderLogo } from "@/components/logo";
import { Toaster } from "react-hot-toast";
import {useEffect, useState} from "react";
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

/** Client side of the root layout: loader, page chrome and providers. Renders <body> so its classes can depend on the route. */
export default function AppShell({ children, fontClassName }: { children: React.ReactNode; fontClassName: string }) {
  const pathname = usePathname();
  // Read ?id after mount instead of useSearchParams, which would opt every page out of static HTML.
  const [hasIdParam, setHasIdParam] = useState(false);
  useEffect(() => {
    setHasIdParam(new URLSearchParams(window.location.search).has("id"));
  }, [pathname]);
  // Pages using the Ency design: home and the full portfolio listing (/projects without ?id)
  const isHome =
    pathname === "/" || (pathname === "/projects" && !hasIdParam) || encyCaseStudyPaths.includes(pathname ?? "");
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
      <body
        className={`${fontClassName} font-sans relative overflow-x-hidden ${
          isHome ? "is-home" : "bg-[var(--color-bg)] text-[var(--color-text-primary)] pt-28 sm:pt-36 mesh-bg"
        }`}
      >
        
        {/* Page loader */}
        <AnimatePresence
          onExitComplete={() => {
            // Lets first-screen animations (the hero) start only once the loader has gone.
            document.documentElement.dataset.ready = "1";
            window.dispatchEvent(new Event("app:ready"));
          }}
        >
          {isLoading && (
            <motion.div
              className="page-loader"
              role="status"
              aria-label="Loading portfolio"
              exit={{ opacity: 0, y: "-2%" }}
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="loader-content">
                <LoaderLogo className="loader-logo" title="Pasindu Sannasuriya" />
                <p className="loader-eyebrow">PASINDU SANNASURIYA <span>·</span> PORTFOLIO</p>
                <div className="loader-dots" aria-hidden="true"><span /><span /><span /></div>
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
  );
}
