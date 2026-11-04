"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { collaborationsData } from "@/lib/data";
import { HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";

type Brand = (typeof collaborationsData)[number];

function Tile({ brand, decorative = false }: { brand: Brand; decorative?: boolean }) {
  const inner = (
    <>
      <span className={`e-brand__logo${"dark" in brand && brand.dark ? " is-dark" : ""}${"wide" in brand && brand.wide ? " is-wide" : ""}`}>
        <Image src={brand.logo} alt={`${brand.name} logo`} width={brand.w} height={brand.h} unoptimized />
      </span>
      <span className="e-brand__meta">
        <strong>{brand.name}</strong>
        <span className="e-mono">{brand.tag}</span>
      </span>
      {"href" in brand && (
        <span className="e-brand__link">
          Case study
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </>
  );

  return "href" in brand ? (
    <Link href={brand.href} className="e-brand is-link" aria-label={`${brand.name}: view case study`} tabIndex={decorative ? -1 : undefined}>
      {inner}
    </Link>
  ) : (
    <div className="e-brand">{inner}</div>
  );
}

export default function Collaborations() {
  return (
    <section id="collaborations" data-ground="white" className="g-white e-section e-brands">
      <div className="e-container">
        <Reveal>
          <HandTag tilt={-3}>collaborations</HandTag>
        </Reveal>
        <SplitHeading lines={[{ text: "Brands & products", block: true }, { text: "I’ve helped build", className: "is-soft", block: true }]} />
        <Reveal delay={1} as="p" className="e-lead">
          From gifting and retail to point of sale, IoT and healthcare, these are teams I’ve partnered with on research, product design and
          front-end builds.
        </Reveal>
      </div>
      {/* The list is rendered twice so the marquee can loop seamlessly; the copy is hidden from assistive tech. */}
      <Reveal delay={2} className="e-marquee e-brands__rail" style={{ ["--dur" as any]: "70s" }}>
        <div className="e-marquee__track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="e-brands__set" aria-hidden={copy === 1 || undefined}>
              {collaborationsData.map((b) => (
                <li key={b.name}>
                  <Tile brand={b} decorative={copy === 1} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
