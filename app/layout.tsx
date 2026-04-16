'use client'
import Header from "@/components/header";
import Image from "next/image";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import ThemeContextProvider from "@/context/theme-context";
import { Toaster } from "react-hot-toast";
import {useEffect, useState, useRef} from "react";
import OffCanvasMenu from "@/components/off-canvas-menu";
import { Provider } from 'react-redux';
import { store } from './store';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins"
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  type value = {
    width: number | undefined,
    height: number | undefined
  }

  const [windowSize, setWindowSize] = useState<value>({
    width: undefined,
    height: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize(prevState => ({ ...prevState, width: window.innerWidth, height: window.innerHeight }));
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for cursor glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="theme-color" content="#060d1a" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-[var(--color-bg)] text-[var(--color-text-primary)] relative pt-28 sm:pt-36 overflow-x-hidden mesh-bg`}>
        
        {/* Page loader */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="page-loader"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center justify-center gap-6">
                <Image src="/Logo.png" alt="Logo" width={180} height={180} priority className="animate-pulse drop-shadow-xl" />
                <div className="loader-bar">
                  <div className="loader-bar-fill" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll progress bar */}
        <motion.div
          className="scroll-progress"
          style={{ scaleX }}
        />

        {/* Cursor glow (desktop only) */}
        <div
          className="cursor-glow hidden lg:block"
          style={{
            left: mousePos.x - 12,
            top: mousePos.y - 12,
          }}
        />

        {/* Background orbs for parallax depth */}
        <div className="parallax-bg fixed inset-0 pointer-events-none z-[-1]">
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />
          <div className="floating-orb floating-orb-3" />
        </div>

        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Provider store={store}>
              {(windowSize.width && windowSize.width > 640) ? (<Header />) : (<OffCanvasMenu />)}
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
              <ThemeSwitch />
            </Provider>
          </ActiveSectionContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
