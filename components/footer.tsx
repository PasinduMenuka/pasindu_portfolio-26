"use client";

import React from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Hide the footer on individual project/case study pages
  if (pathname?.startsWith("/projects")) {
    return null;
  }
  
  return (
    <footer
      className="mb-8 px-6 py-8 text-center border-t mx-4 rounded-2xl"
      style={{
        borderColor: 'var(--color-border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        {/* Logo/name */}
        <div
          className="text-lg font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Pasindu Sannasuriya
        </div>

        {/* Copyright */}
        <small className="text-xs text-[var(--color-text-muted)]">
          &copy; {currentYear} Sannasuriya. All rights reserved.
        </small>

        {/* Socials */}
        <div className="flex items-center gap-3">
          <a
            href="https://linkedin.com"
            target="_blank"
            aria-label="LinkedIn"
            className="p-2 rounded-full border transition-all duration-300"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#00D4FF';
              (e.currentTarget as HTMLElement).style.color = '#00D4FF';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(0,212,255,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <BsLinkedin className="text-sm" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            aria-label="GitHub"
            className="p-2 rounded-full border transition-all duration-300"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#00D4FF';
              (e.currentTarget as HTMLElement).style.color = '#00D4FF';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(0,212,255,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <BsGithub className="text-sm" />
          </a>
        </div>
      </div>
    </footer>
  );
}
