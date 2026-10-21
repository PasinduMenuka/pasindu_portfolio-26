"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import { links } from "@/lib/data";
import { BsEnvelopeFill, BsTelephoneFill } from "react-icons/bs";
import Logo from "@/components/logo";
import { useInViewOnce } from "@/components/motion/reveal";

type FooterLink = { label: string; href: string; external?: boolean; download?: boolean };

const columns: { heading: string; items: FooterLink[] }[] = [
  {
    heading: "Pages",
    items: links.map((l) => ({ label: l.name, href: l.hash })),
  },
  {
    heading: "Work",
    items: [
      { label: "SES Portal Revamp", href: "/projects/7" },
      { label: "HVAC IoT Platform", href: "/projects/1" },
      { label: "All projects", href: "/projects" },
      { label: "Download CV", href: "https://drive.google.com/file/d/1AuQ0pFahUC0L0MWK41k-5Ddj1mu37n5t/view?usp=sharing", external: true },
    ],
  },
  {
    heading: "Follow",
    items: [
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
      { label: "GitHub", href: "https://github.com", external: true },
    ],
  },
];

const contactItems = [
  { label: "sannasuriyapm@gmail.com", href: "mailto:sannasuriyapm@gmail.com", icon: BsEnvelopeFill },
  { label: "+94 77 621 7729", href: "tel:+94776217729", icon: BsTelephoneFill },
];

/** Link text that rolls up to a duplicate on hover. */
function Roll({ children }: { children: string }) {
  return (
    <span className="e-roll">
      <span className="e-roll__text" data-text={children}>
        {children}
      </span>
    </span>
  );
}

function TalkRow({ progress, index, opacity }: { progress: MotionValue<number>; index: number; opacity: number }) {
  const start = index * 0.12;
  const y = useTransform(progress, [start, Math.min(1, start + 0.6)], ["0.35em", "0em"]);
  return (
    <motion.span className="e-talk__row" style={{ y, ["--row-o" as any]: opacity }} aria-hidden="true">
      Let&rsquo;s talk
    </motion.span>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const talkRef = useRef<HTMLAnchorElement>(null);
  const cta = useInViewOnce<HTMLDivElement>(0.3);
  const { scrollYProgress } = useScroll({ target: talkRef, offset: ["start end", "end 0.85"] });

  // Yellow arrow cursor that trails the pointer over "Let's talk".
  const [hovering, setHovering] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cx = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.6 });
  const cy = useSpring(my, { stiffness: 260, damping: 26, mass: 0.6 });

  // Hide the footer on individual project/case study pages (the full listing keeps it)
  const isListing = pathname === "/projects" && !searchParams?.get("id");
  if (pathname?.startsWith("/projects") && !isListing) {
    return null;
  }

  return (
    <footer className="e-footer2 g-blue" data-ground="blue">
      <div className="e-container">
        <a
          ref={talkRef}
          href="/#contact"
          className="e-talk"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set(e.clientX - r.left);
            my.set(e.clientY - r.top);
            if (!hovering) {
              cx.jump(e.clientX - r.left);
              cy.jump(e.clientY - r.top);
              setHovering(true);
            }
          }}
          onPointerLeave={() => setHovering(false)}
        >
          <span className="sr-only">Let&rsquo;s talk. Get in touch</span>
          {[0.56, 0.76, 1].map((o, i) => (
            <TalkRow key={i} progress={scrollYProgress} index={i} opacity={o} />
          ))}
          <motion.span
            className="e-talk__cursor"
            style={{ x: cx, y: cy }}
            initial={false}
            animate={{ scale: hovering ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M8.5 6H18v9.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" />
            </svg>
          </motion.span>
        </a>

        <div ref={cta.ref} className={`e-footer2__cta ${cta.inView ? "is-in" : ""}`}>
          <a href="/#contact" className="e-footer2__hand e-hand">
            <span className="e-face e-footer2__face" />
            <span>(let&rsquo;s build something)</span>
            <svg className="e-pen e-footer2__pen" viewBox="0 0 90 60" fill="none" aria-hidden="true">
              <path d="M4 52C30 56 62 44 76 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ ["--len" as any]: 100, ["--pen-d" as any]: "0.4s" }} />
              <path d="M64 16L77 7L84 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ ["--len" as any]: 32, ["--pen-d" as any]: "1.1s" }} />
            </svg>
          </a>
          <p className="e-footer2__or">
            or <a href="mailto:sannasuriyapm@gmail.com">send me an email</a>. I reply to everything myself.
          </p>
        </div>
      </div>

      <div className="e-footer2__card" data-ground="white">
        <div className="e-footer2__grid">
          <div className="e-footer2__brand">
            <Link href="/#home" aria-label="Pasindu Sannasuriya, home" className="e-footer2__logo">
              <Logo title="" />
            </Link>
            <p>Senior UI/UX Engineer &amp; Product Designer based in Sri Lanka, working with product teams worldwide.</p>
            <ul className="e-footer2__contact">
              {contactItems.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a href={href} className="e-footer2__link">
                    <span className="e-footer2__icon">
                      <Icon />
                    </span>
                    <Roll>{label}</Roll>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} className="e-footer2__col" aria-label={col.heading}>
              <p className="e-mono e-footer2__heading">{col.heading}</p>
              <ul>
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="e-footer2__link"
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener" : undefined}
                      download={item.download || undefined}
                    >
                      <Roll>{item.label}</Roll>
                      {item.external && <span aria-hidden="true">↗</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="e-footer2__bottom">
          <small>&copy; {currentYear} Pasindu Sannasuriya. Designed &amp; built by me.</small>
          <a href="#home" className="e-footer2__link">
            <Roll>Back to top ↑</Roll>
          </a>
        </div>
      </div>
    </footer>
  );
}
