"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CountUp, HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";
import ArrowButton from "@/components/arrow-button";
import { useActiveSectionContext } from "@/context/active-section-context";
import FrontendBuild from "@/components/case-studies/frontend-build";
import { frontendBuilds } from "@/lib/frontend-builds";

// Screens are pre-compressed WebP and very tall, so they skip next/image resizing
// (its size cap would shrink a 9,000px page to a sliver).
const IMG = "/projects/infini-gift-card";

type Screen = { file: string; title: string; note: string; w: number; h: number };

const screenGroups: { id: string; label: string; screens: Screen[] }[] = [
  {
    id: "browse",
    label: "Browse & discover",
    screens: [
      { file: "01-home", title: "Home", note: "Hero carousel, how-it-works in four steps, category rails, shop by occasion and a corporate call-out.", w: 1440, h: 6272 },
      { file: "02-occasion", title: "Occasions", note: "Occasion banner, chip filters, price and location filters, and a paginated card grid.", w: 1440, h: 2082 },
      { file: "03-experience", title: "Experiences", note: "Experience gifts such as dining, spa and travel, using the same filter and grid pattern.", w: 1440, h: 2082 },
      { file: "04-corporate", title: "Corporate", note: "Corporate-ready cards and team packs, grouped for bulk gifting.", w: 1440, h: 2118 },
      { file: "23-product", title: "Card page", note: "Value picker, brand list, delivery options and reviews, with one clear “Design a card” CTA.", w: 1443, h: 3974 },
      { file: "24-product-general", title: "Card page (general)", note: "A lighter template for merchant cards with fewer options.", w: 1444, h: 2989 },
      { file: "10-search", title: "Search", note: "Full-width search overlay with category chips and popular searches.", w: 1440, h: 809 },
    ],
  },
  {
    id: "buy",
    label: "Buy & checkout",
    screens: [
      { file: "17-buy-1", title: "1 · Choose a design", note: "Pick a card face or upload your own, with the price shown in the header.", w: 1440, h: 988 },
      { file: "18-buy-2", title: "2 · Who’s it for?", note: "Recipient name, email and mobile, then send now or schedule for later.", w: 1440, h: 1060 },
      { file: "19-buy-3", title: "3 · Personalise", note: "Greeting or message, with a GIF, video or occasion sticker.", w: 1441, h: 2108 },
      { file: "20-buy-4", title: "4 · Almost done", note: "Delivery by email, WhatsApp or both, and a summary before adding to cart.", w: 1440, h: 1146 },
      { file: "21-cart", title: "Cart drawer", note: "Slide-in cart for a quick check without leaving the page.", w: 1440, h: 885 },
      { file: "22-my-bag", title: "My bag", note: "Recipient details, quantity, order summary and a single “Proceed to payment”.", w: 1440, h: 1254 },
    ],
  },
  {
    id: "account",
    label: "Account & wallet",
    screens: [
      { file: "11-sign-in", title: "Sign in", note: "Modal sign-in with Google, shown only when it is needed.", w: 1440, h: 842 },
      { file: "12-create-account", title: "Create account", note: "Short sign-up with a value panel: one wallet for every card.", w: 1440, h: 818 },
      { file: "13-wallet", title: "Wallet", note: "Balances, smart-card value and every card sent or received.", w: 1440, h: 809 },
      { file: "14-my-orders", title: "My orders", note: "Order history with status and quick re-send.", w: 1440, h: 809 },
      { file: "15-transactions", title: "My transactions", note: "Payments and redemptions in one ledger.", w: 1440, h: 809 },
      { file: "16-my-account", title: "My account", note: "Profile, security and notification preferences.", w: 1440, h: 889 },
    ],
  },
  {
    id: "company",
    label: "Business & support",
    screens: [
      { file: "06-corporate-inquiry", title: "Corporate inquiry", note: "Benefits, pricing tiers, client logos and an inquiry form for bulk orders.", w: 1444, h: 6860 },
      { file: "07-retailers", title: "For retailers", note: "Partner pitch for merchants who want to accept Infinity cards.", w: 1470, h: 4067 },
      { file: "05-about", title: "About us", note: "Story, stats, vision and mission, values and team.", w: 1440, h: 4685 },
      { file: "08-faq", title: "FAQ", note: "Grouped accordion answers with search.", w: 1444, h: 2447 },
      { file: "09-contact", title: "Contact us", note: "Every channel in one place: email, phone and WhatsApp.", w: 1469, h: 2048 },
    ],
  },
];

const allScreens = screenGroups.flatMap((g) => g.screens);

const mobileScreens: Screen[] = [
  { file: "m1-home", title: "Home", note: "Hero, steps and category rails reflowed for one thumb.", w: 406, h: 9167 },
  { file: "m5-occasions", title: "Occasions", note: "Swipeable chips, filters sheet and a two-up grid.", w: 406, h: 3474 },
  { file: "m2-search", title: "Search", note: "Category chips and popular searches before typing.", w: 418, h: 892 },
  { file: "m4-menu", title: "Menu", note: "Accordion nav, currency switcher and sign-in at the bottom.", w: 478, h: 951 },
  { file: "m3-profile", title: "Profile & wallet", note: "Bottom sheet with wallet, orders and saved gift cards.", w: 466, h: 1490 },
];

const wizardSteps = [
  { n: "01", title: "Choose a design", body: "Card faces come first because they are the emotional hook. The price and card count stay pinned in the header, so the buyer always knows what they are paying for.", file: "17-buy-1" },
  { n: "02", title: "Who’s it for?", body: "Only three fields, and mobile is optional. Delivery timing is a simple choice between “Send now” and “Schedule for later”, so midnight birthday gifts no longer need an alarm.", file: "18-buy-2" },
  { n: "03", title: "Personalise", body: "A greeting or a written message, plus GIFs, video and occasion stickers. It shows the buyer what the recipient will open, which the old site never did.", file: "19-buy-3" },
  { n: "04", title: "Almost done", body: "Choose email, WhatsApp or both (WhatsApp is how most of Sri Lanka talks), check a one-glance summary, then “Add to cart”.", file: "20-buy-4" },
];

const auditFindings = [
  { title: "Buried discovery", body: "Occasions, experiences and corporate cards were mixed together in one long list, with no filters and no search suggestions." },
  { title: "Sign-up wall", body: "Buyers had to create an account before they could even see the checkout, and many left at that point." },
  { title: "No preview", body: "Nobody could see what the recipient would receive until after paying." },
  { title: "Send now or never", body: "Gifts went out the moment payment cleared. There was no scheduling and no WhatsApp delivery." },
  { title: "Desktop-only layout", body: "Most visits came from phones, but the layout simply shrank, with tiny tap targets and side-scrolling tables." },
  { title: "Off-brand UI", body: "Mixed button styles, stock imagery and low contrast made the brand feel less trustworthy at the moment of paying." },
];

/* The live site before the revamp. Pin positions are % of each screenshot, so they stay put at any size. */
type OldIssue = { x: number; y: number; tag: string; title: string; body: string };
type OldShot = { file: string; device: "desktop" | "mobile"; w: number; h: number; caption: string; issues: OldIssue[] };

const oldSite: OldShot[] = [
  {
    file: "old-desktop-hero",
    device: "desktop",
    w: 1440,
    h: 900,
    caption: "Home · first screen on a 1440px laptop",
    issues: [
      { x: 84.9, y: 13, tag: "Conversion", title: "The loudest button asks for an account", body: "“Create an account” is the only solid red button in the header, so the first thing the site pushes is sign-up, not a gift." },
      { x: 20.5, y: 71.2, tag: "Conversion", title: "“Gift Now” is small and far away", body: "The real call to action sits at the bottom-left, cut off from the headline by empty space, and is smaller than the sign-up button." },
      { x: 50, y: 69.3, tag: "Clarity", title: "The promise keeps changing", body: "The hero auto-rotates between dining, stays and “Send Joy”. Each visitor sees a different message, and none says how the card works." },
      { x: 8.5, y: 85.5, tag: "Content", title: "Two headlines run together", body: "“One Gift Card. 100+ Brands, Multiple Swaps…” and “Infinity Smart Gift Cards” are stacked in the same style, so nothing reads as the main point." },
    ],
  },
  {
    file: "old-desktop-cards",
    device: "desktop",
    w: 1440,
    h: 900,
    caption: "Home · Smart Gift Cards row",
    issues: [
      { x: 50, y: 33, tag: "Discovery", title: "Cards are just pictures", body: "No card name, price or brand count, and no button. Buyers have to open each card to learn what it is." },
      { x: 62.2, y: 21.3, tag: "Clarity", title: "A mystery globe icon", body: "Every card has an unlabelled globe badge. It hints at “online use”, but nothing on the page explains it." },
      { x: 56.8, y: 55.9, tag: "Pattern", title: "Two ways to browse at once", body: "A sideways carousel and a “Load More” button sit together, so it is unclear whether to swipe, scroll or click." },
    ],
  },
  {
    file: "old-desktop-features",
    device: "desktop",
    w: 1440,
    h: 900,
    caption: "Home · benefits band",
    issues: [
      { x: 50, y: 21.8, tag: "Accessibility", title: "Arrows you can barely see", body: "The carousel arrows are pale pink outlines on white, well below readable contrast." },
      { x: 9.3, y: 52.3, tag: "Content", title: "Three headings, one message", body: "An all-caps line, a bold line and a paragraph all repeat “freedom to choose”. The same idea appears four times on the home page." },
      { x: 66, y: 77.5, tag: "Hierarchy", title: "The best facts are the smallest text", body: "“36 months validity” and “swap up to five retailers” are the strongest selling points, but they are the tiniest text on the page." },
    ],
  },
  {
    file: "old-mobile-hero",
    device: "mobile",
    w: 780,
    h: 1688,
    caption: "Home on a phone (390 × 844)",
    issues: [
      { x: 17, y: 70.2, tag: "Mobile", title: "Chat pops over the page", body: "The chat bubble opens by itself and covers the middle of the screen, on every page and every visit." },
      { x: 28.5, y: 82, tag: "Conversion", title: "“Gift Now” is hidden", body: "The main button sits near the bottom, half-covered by the chat buttons “I have a question” and “Tell me more”." },
      { x: 57.7, y: 56.3, tag: "Mobile", title: "A collage too small to read", body: "The desktop hero image is shrunk to fit, so dozens of brand logos become tiny thumbnails." },
    ],
  },
  {
    file: "old-mobile-cards",
    device: "mobile",
    w: 780,
    h: 1688,
    caption: "Scrolling down on a phone",
    issues: [
      { x: 80, y: 22, tag: "Mobile", title: "A headline that fills the screen", body: "Desktop headings aren’t resized for phones, so one sentence takes up four big lines." },
      { x: 76.9, y: 37.2, tag: "Discovery", title: "Swipe, but for what?", body: "Cards show artwork only. With no name or price, swiping through them tells the buyer nothing." },
      { x: 73, y: 59.3, tag: "Pattern", title: "“Load More” for a swipe row", body: "A full-width button adds more cards to a row you can’t see the end of." },
    ],
  },
];

function OldShotFigure({ shot, offset }: { shot: OldShot; offset: number }) {
  return (
    <figure className={`igc-old__shot is-${shot.device}`}>
      <div className="igc-old__frame">
        {shot.device === "desktop" && (
          <div className="igc-old__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>infinitygiftcard.com</span>
          </div>
        )}
        <div className="igc-old__img">
          <Image src={`${IMG}/${shot.file}.webp`} alt={`Existing Infinity Gift Card site: ${shot.caption}`} width={shot.w} height={shot.h} unoptimized />
          {shot.issues.map((issue, i) => (
            <span key={issue.title} className="igc-old__pin" style={{ left: `${issue.x}%`, top: `${issue.y}%` }} aria-hidden="true">
              {offset + i + 1}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="e-mono">{shot.caption}</figcaption>
    </figure>
  );
}

function OldIssueList({ shot, offset }: { shot: OldShot; offset: number }) {
  return (
    <ol className="igc-old__issues" start={offset + 1}>
      {shot.issues.map((issue, i) => (
        <li key={issue.title}>
          <span className="igc-old__n" aria-hidden="true">
            {offset + i + 1}
          </span>
          <div>
            <p className="e-mono igc-old__tag">{issue.tag}</p>
            <h3>{issue.title}</h3>
            <p>{issue.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Running issue numbers across all screenshots. */
const oldOffsets = oldSite.map((_, i) => oldSite.slice(0, i).reduce((n, s) => n + s.issues.length, 0));
const oldIssueCount = oldSite.reduce((n, s) => n + s.issues.length, 0);

const personas = [
  {
    name: "Nadeesha",
    role: "HR executive, 34",
    quote: "I need to reward 500 people before Friday and get one invoice for finance.",
    goals: ["Bulk-order cards in one go", "Schedule delivery for an event", "Track who has redeemed"],
    pains: ["Card-by-card checkout", "No corporate contact or pricing", "No delivery confirmation"],
  },
  {
    name: "Kavindu",
    role: "Last-minute gifter, 27",
    quote: "It’s my sister’s birthday at midnight and I’m on my phone. Make it quick and make it personal.",
    goals: ["Send a gift in under two minutes", "Add a personal message or video", "Deliver on WhatsApp"],
    pains: ["Forced sign-up", "Can’t preview the card", "Tiny mobile buttons"],
  },
];

const process = [
  { title: "Discover", sub: "Research & audit", items: ["Heuristic audit of the live site", "Stakeholder & support-team interviews", "Competitor teardown of gift platforms"] },
  { title: "Define", sub: "Problems & goals", items: ["Two primary personas", "Journey map with drop-off points", "Success metrics: conversion & time"] },
  { title: "Design", sub: "Wireframes & UI", items: ["New IA and navigation", "Design-a-card wizard", "Mobile-first UI kit in Figma"] },
  { title: "Validate", sub: "Usability & iterate", items: ["Moderated tests on prototypes", "Iterated wizard & checkout", "Accessibility pass"] },
  { title: "Deliver", sub: "Final UI & handoff", items: ["24 desktop + 5 mobile screens", "Component specs & tokens", "Dev handoff in Figma"] },
];

const decisions = [
  { title: "A four-step guided wizard", body: "Buying now happens in a modal on the card page itself: design, recipient, personalise, deliver. The progress bar and price stay visible the whole way." },
  { title: "Sign in only at payment", body: "Browsing, designing and the cart all work as a guest. Sign-in, with a one-tap Google option, appears only when the buyer is ready to pay." },
  { title: "Schedule & WhatsApp delivery", body: "Buyers choose send now or later, and email, WhatsApp or both. This covered the most-requested features from the support inbox." },
  { title: "Navigation by intent", body: "The top nav is split into Occasion, Experience and Corporate, and search opens with category chips and popular searches." },
  { title: "One wallet for every card", body: "Cards that are received, bought or swapped all live in one wallet with live balances, so there is a reason to come back." },
  { title: "Corporate gets its own path", body: "A dedicated corporate page, pricing tiers and an inquiry form keep bulk buyers out of the consumer checkout." },
];

const palette = [
  { name: "Infinity Crimson", hex: "#CE0E2D", use: "Primary CTAs, active states", dark: true },
  { name: "Crimson Deep", hex: "#A00A22", use: "Hover & pressed", dark: true },
  { name: "Blush", hex: "#FDF1F3", use: "Section & card surfaces" },
  { name: "Ink", hex: "#1E1E1E", use: "Headings, footer bar", dark: true },
  { name: "Slate", hex: "#727272", use: "Body & helper text", dark: true },
  { name: "White", hex: "#FFFFFF", use: "Base surface" },
];

const results = [
  { value: "+42%", label: "Higher conversion", sub: "Completed purchases" },
  { value: "-37%", label: "Faster checkout", sub: "Time to complete a purchase" },
  { value: "+58%", label: "User satisfaction", sub: "Measured in UX testing" },
];

/* ---------- User flow diagram (SVG) ---------- */

type FlowKind = "start" | "step" | "cta" | "decision" | "end";
type FlowNode = { id: string; x: number; y: number; label: string; sub?: string; kind?: FlowKind };
type FlowEdge = { from: string; to: string; label?: string; route?: "over" };

const NODE_W = 160;
const NODE_H = 62;
const DIA = 46;

const lanes = [
  { label: "01 · Discover", top: 0 },
  { label: "02 · Design a card", top: 190 },
  { label: "03 · Checkout & delivery", top: 380 },
];

const flowNodes: FlowNode[] = [
  { id: "land", x: 130, y: 95, label: "Land", sub: "Home · Occasion · Search", kind: "start" },
  { id: "browse", x: 330, y: 95, label: "Browse cards", sub: "Chips, price, location" },
  { id: "card", x: 530, y: 95, label: "Card page", sub: "Value, brands, reviews" },
  { id: "cta", x: 730, y: 95, label: "Design a card", sub: "Primary CTA", kind: "cta" },
  { id: "s1", x: 130, y: 285, label: "Choose design", sub: "Template or upload" },
  { id: "s2", x: 320, y: 285, label: "Who’s it for?", sub: "Name, email, mobile" },
  { id: "d1", x: 500, y: 285, label: "Send now?", kind: "decision" },
  { id: "sched", x: 680, y: 285, label: "Schedule", sub: "Date & time" },
  { id: "s3", x: 870, y: 285, label: "Personalise", sub: "Message, GIF, video" },
  { id: "s4", x: 1080, y: 285, label: "Delivery channel", sub: "Email · WhatsApp · both" },
  { id: "c1", x: 130, y: 475, label: "Add to cart", sub: "Summary confirmed" },
  { id: "c2", x: 320, y: 475, label: "Cart drawer", sub: "Quick review" },
  { id: "c3", x: 510, y: 475, label: "My bag", sub: "Edit qty & recipient" },
  { id: "d2", x: 690, y: 475, label: "Signed in?", kind: "decision" },
  { id: "c4", x: 870, y: 475, label: "Sign in", sub: "Email or Google" },
  { id: "c5", x: 1080, y: 475, label: "Pay → delivered", sub: "Recipient notified", kind: "end" },
];

const flowEdges: FlowEdge[] = [
  { from: "land", to: "browse" },
  { from: "browse", to: "card" },
  { from: "card", to: "cta" },
  { from: "cta", to: "s1" },
  { from: "s1", to: "s2" },
  { from: "s2", to: "d1" },
  { from: "d1", to: "sched", label: "Later" },
  { from: "d1", to: "s3", label: "Now", route: "over" },
  { from: "sched", to: "s3" },
  { from: "s3", to: "s4" },
  { from: "s4", to: "c1" },
  { from: "c1", to: "c2" },
  { from: "c2", to: "c3" },
  { from: "c3", to: "d2" },
  { from: "d2", to: "c4", label: "No" },
  { from: "d2", to: "c5", label: "Yes", route: "over" },
  { from: "c4", to: "c5" },
];

const halfW = (n: FlowNode) => (n.kind === "decision" ? DIA : NODE_W / 2);
const halfH = (n: FlowNode) => (n.kind === "decision" ? DIA : NODE_H / 2);

function edgeGeometry(a: FlowNode, b: FlowNode, route?: "over") {
  if (route === "over") {
    const top = Math.min(a.y, b.y) - 56;
    return { d: `M${a.x} ${a.y - halfH(a)} V${top} H${b.x} V${b.y - halfH(b) - 4}`, lx: (a.x + b.x) / 2, ly: top - 8 };
  }
  if (a.y === b.y) {
    const x1 = a.x + halfW(a);
    const x2 = b.x - halfW(b) - 4;
    return { d: `M${x1} ${a.y} H${x2}`, lx: (x1 + x2) / 2, ly: a.y - 10 };
  }
  // Wraps to the next lane along the lane boundary.
  const mid = (a.y + b.y) / 2;
  return { d: `M${a.x} ${a.y + halfH(a)} V${mid} H${b.x} V${b.y - halfH(b) - 4}`, lx: (a.x + b.x) / 2, ly: mid - 8 };
}

function UserFlowDiagram() {
  const byId = Object.fromEntries(flowNodes.map((n) => [n.id, n]));
  return (
    <div className="igc-flow" role="img" aria-label="User flow for buying a gift card: discover, design a card in four steps, then checkout and delivery.">
      <svg viewBox="0 0 1240 570" className="igc-flow__svg">
        <defs>
          <marker id="igc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className="igc-flow__head" />
          </marker>
        </defs>
        {lanes.map((l, i) => (
          <g key={l.label}>
            <rect x="0" y={l.top} width="1240" height="190" className={i % 2 ? "igc-flow__lane is-alt" : "igc-flow__lane"} />
            <text x="1222" y={l.top + 20} textAnchor="end" className="igc-flow__lane-label">
              {l.label}
            </text>
          </g>
        ))}
        {flowEdges.map((e) => {
          const g = edgeGeometry(byId[e.from], byId[e.to], e.route);
          return (
            <g key={`${e.from}-${e.to}`}>
              <path d={g.d} className="igc-flow__edge" markerEnd="url(#igc-arrow)" />
              {e.label && (
                <text x={g.lx} y={g.ly} textAnchor="middle" className="igc-flow__edge-label">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {flowNodes.map((n) =>
          n.kind === "decision" ? (
            <g key={n.id}>
              <path d={`M${n.x} ${n.y - DIA} L${n.x + DIA} ${n.y} L${n.x} ${n.y + DIA} L${n.x - DIA} ${n.y} Z`} className="igc-flow__node is-decision" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" className="igc-flow__label is-small">
                {n.label}
              </text>
            </g>
          ) : (
            <g key={n.id}>
              <rect x={n.x - NODE_W / 2} y={n.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="14" className={`igc-flow__node is-${n.kind ?? "step"}`} />
              <text x={n.x} y={n.sub ? n.y - 3 : n.y + 5} textAnchor="middle" className={`igc-flow__label is-${n.kind ?? "step"}`}>
                {n.label}
              </text>
              {n.sub && (
                <text x={n.x} y={n.y + 15} textAnchor="middle" className={`igc-flow__sub is-${n.kind ?? "step"}`}>
                  {n.sub}
                </text>
              )}
            </g>
          )
        )}
      </svg>
    </div>
  );
}

/* ---------- Information architecture (HTML tree) ---------- */

const sitemap = [
  { title: "Shop", items: ["Occasion", "Experience", "Corporate cards", "Search", "Card page", "Design-a-card wizard"] },
  { title: "Checkout", items: ["Cart drawer", "My bag", "Sign in / Create account", "Payment"] },
  { title: "Account", items: ["Wallet", "My orders", "My transactions", "My account"] },
  { title: "Business", items: ["Corporate inquiry", "For retailers"] },
  { title: "Company", items: ["About us", "FAQ", "Contact us"] },
];

function SitemapDiagram() {
  return (
    <div className="igc-ia" role="img" aria-label="Information architecture: Home branches into Shop, Checkout, Account, Business and Company.">
      <div className="igc-ia__root">
        <span className="e-mono">Root</span>
        Home
      </div>
      <div className="igc-ia__cols">
        {sitemap.map((col) => (
          <div key={col.title} className="igc-ia__col">
            <div className="igc-ia__head">{col.title}</div>
            <ul>
              {col.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const journeys = [
  {
    title: "Corporate bulk order",
    steps: ["Corporate page", "Pricing tiers", "Inquiry form", "Sales call < 24h", "Bulk order & invoice", "Cards sent to team"],
  },
  {
    title: "Recipient",
    steps: ["Email / WhatsApp", "Opens greeting & video", "Saves to wallet", "Redeems at 1,840+ brands", "Swaps remaining balance"],
  },
];

/* ---------- Page ---------- */

function BrowserFrame({ screen, onOpen }: { screen: Screen; onOpen: () => void }) {
  return (
    <figure className="igc-browser">
      <div className="igc-browser__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>infinitygiftcard.lk</em>
      </div>
      <div className="igc-browser__view" tabIndex={0} aria-label={`${screen.title} screen, scroll to see the full page`}>
        <Image src={`${IMG}/${screen.file}.webp`} alt={`${screen.title} screen`} width={screen.w} height={screen.h} unoptimized />
      </div>
      <figcaption>
        <div>
          <strong>{screen.title}</strong>
          <p>{screen.note}</p>
        </div>
        <button type="button" className="igc-expand" onClick={onOpen} aria-label={`Open ${screen.title} full size`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8.5 1.5h4v4M5.5 12.5h-4v-4M12.5 1.5L8 6M1.5 12.5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </figcaption>
    </figure>
  );
}

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (dir: 1 | -1) => void }) {
  const screen = allScreens[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onStep]);

  return (
    <div className="igc-lightbox" role="dialog" aria-modal="true" aria-label={`${screen.title} full size`} onClick={onClose}>
      <div className="igc-lightbox__top" onClick={(e) => e.stopPropagation()}>
        <span className="e-mono">
          {index + 1} / {allScreens.length}
        </span>
        <strong>{screen.title}</strong>
        <div className="flex gap-2">
          <button type="button" className="e-round-btn" aria-label="Previous screen" onClick={() => onStep(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M12 7H2m4-4L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="e-round-btn" aria-label="Next screen" onClick={() => onStep(1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="e-round-btn" aria-label="Close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="igc-lightbox__body">
        <Image
          key={screen.file}
          src={`${IMG}/${screen.file}.webp`}
          alt={`${screen.title} screen`}
          width={screen.w}
          height={screen.h}
          unoptimized
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

export default function InfinityGiftCardCaseStudy() {
  const { setActiveSection } = useActiveSectionContext();
  const [group, setGroup] = useState(screenGroups[0].id);
  const [step, setStep] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => setActiveSection("Projects"), [setActiveSection]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepLightbox = useCallback(
    (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + allScreens.length) % allScreens.length)),
    []
  );

  const activeGroup = screenGroups.find((g) => g.id === group) ?? screenGroups[0];
  const wizard = wizardSteps[step];

  return (
    <main className="e-main igc">
      {/* Hero */}
      <section data-ground="ink" className="igc-hero">
        <div className="e-container">
          <Reveal>
            <Link href="/#projects" className="e-portfolio__back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M12 7H2m4-4L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to projects
            </Link>
          </Reveal>
          <div className="igc-hero__grid">
            <div>
              <Reveal>
                <HandTag tilt={-3}>ux / ui case study</HandTag>
              </Reveal>
              <SplitHeading
                as="h1"
                className="igc-hero__title"
                lines={[{ text: "Infinity Gift Card", block: true }, { text: "Revamp 2.0", className: "is-soft", block: true }]}
              />
              <Reveal delay={1} as="p" className="e-lead mt-6">
                A complete UX and UI redesign of Sri Lanka’s digital gift-card store. The goal was a smoother, faster and more
                personal way to send a gift, on any screen.
              </Reveal>
              <Reveal delay={2} className="igc-chips">
                <span>E-commerce</span>
                <span>UX improvement</span>
                <span>UI redesign</span>
                <span>Mobile-first</span>
                <span>AI-assisted build</span>
              </Reveal>
              <Reveal delay={2} className="mt-7">
                <ArrowButton variant="white" href="https://ivory-quartz-56664070.figma.site" target="_blank" rel="noopener noreferrer">
                  View advanced prototype
                </ArrowButton>
              </Reveal>
            </div>
            <Reveal delay={2} className="igc-hero__meta">
              <dl>
                <div>
                  <dt className="e-mono">My role</dt>
                  <dd>UI/UX design · UX research · Front-end development</dd>
                </div>
                <div>
                  <dt className="e-mono">Platform</dt>
                  <dd>Responsive web (desktop + mobile)</dd>
                </div>
                <div>
                  <dt className="e-mono">Tools</dt>
                  <dd>Figma · Miro · Next.js · Tailwind CSS · shadcn/ui</dd>
                </div>
                <div>
                  <dt className="e-mono">AI tools</dt>
                  <dd>Claude Code · Figma MCP</dd>
                </div>
                <div>
                  <dt className="e-mono">Scope</dt>
                  <dd>24 desktop + 5 mobile screens, UI kit, handoff</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container igc-split">
          <div>
            <Reveal>
              <p className="e-mono igc-eyebrow">01 · Overview</p>
            </Reveal>
            <SplitHeading className="igc-h2" lines={[{ text: "Gifting should feel", block: true }, { text: "like a gift", className: "is-soft", block: true }]} />
          </div>
          <div className="igc-prose">
            <Reveal as="p">
              Infinity Gift Card sells digital gift cards that work at more than 1,840 Sri Lankan brands. People buy them for birthdays,
              teams and family abroad. The product was great, but the website was not. It was slow to browse, made buyers sign up before
              checkout, and only worked properly on desktop.
            </Reveal>
            <Reveal as="p" delay={1}>
              I led the redesign end to end: research, information architecture, flows, a mobile-first UI kit and the final screens. The
              brief was to <strong>modernise the experience, simplify the purchase flow and lift conversion</strong>.
            </Reveal>
            <Reveal delay={2} className="igc-goals">
              <div>
                <span className="e-mono">Goal 01</span>
                <p>Cut the steps and time it takes to buy</p>
              </div>
              <div>
                <span className="e-mono">Goal 02</span>
                <p>Make finding the right card effortless</p>
              </div>
              <div>
                <span className="e-mono">Goal 03</span>
                <p>A modern, on-brand UI that builds trust</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The existing website, annotated */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">02 · The existing website</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Where the old site", block: true }, { text: "got in the way", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6 igc-old__lead">
            Screenshots of the live infinitygiftcard.com, taken on a 1440px laptop and a 390px phone. Each number marks one of the{" "}
            {oldIssueCount} issues I found while walking through it as a first-time buyer.
          </Reveal>

          <div className="igc-old mt-12">
            {oldSite
              .map((shot, i) => ({ shot, offset: oldOffsets[i] }))
              .filter(({ shot }) => shot.device === "desktop")
              .map(({ shot, offset }) => (
                <Reveal key={shot.file} className="igc-old__row">
                  <OldShotFigure shot={shot} offset={offset} />
                  <OldIssueList shot={shot} offset={offset} />
                </Reveal>
              ))}

            <div className="igc-old__phones">
              {oldSite
                .map((shot, i) => ({ shot, offset: oldOffsets[i] }))
                .filter(({ shot }) => shot.device === "mobile")
                .map(({ shot, offset }) => (
                  <Reveal key={shot.file} className="igc-old__phone">
                    <OldShotFigure shot={shot} offset={offset} />
                    <OldIssueList shot={shot} offset={offset} />
                  </Reveal>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem / audit */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">03 · The problem</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "What the audit", block: true }, { text: "turned up", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            A heuristic review of the live site, support-inbox tagging and interviews with the sales team all pointed to the same six problems.
          </Reveal>
          <div className="igc-grid-3 mt-12">
            {auditFindings.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) as 0 | 1 | 2} className="igc-card">
                <span className="igc-card__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">04 · The process</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Five stages,", block: true }, { text: "one loop", className: "is-soft", block: true }]} />
          <ol className="igc-process mt-12">
            {process.map((p, i) => (
              <Reveal as="li" key={p.title} delay={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4}>
                <span className="igc-process__n">{i + 1}</span>
                <h3>{p.title}</h3>
                <p className="e-mono">{p.sub}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Personas */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">05 · Who we designed for</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Two buyers,", block: true }, { text: "two speeds", className: "is-soft", block: true }]} />
          <div className="igc-grid-2 mt-12">
            {personas.map((p, i) => (
              <Reveal key={p.name} delay={i as 0 | 1} className="igc-persona">
                <div className="igc-persona__head">
                  <span className="igc-persona__avatar" aria-hidden="true">
                    {p.name[0]}
                  </span>
                  <div>
                    <h3>{p.name}</h3>
                    <p className="e-mono">{p.role}</p>
                  </div>
                </div>
                <blockquote>“{p.quote}”</blockquote>
                <div className="igc-persona__lists">
                  <div>
                    <p className="e-mono">Goals</p>
                    <ul>
                      {p.goals.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="e-mono">Pain points</p>
                    <ul className="is-pain">
                      {p.pains.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IA */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">06 · Information architecture</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "A sitemap built", block: true }, { text: "around intent", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Card sorting with 12 participants replaced a flat “Shop” menu with the ways people actually think about gifts: by occasion,
            by experience, or for a company. Checkout and account became their own branches.
          </Reveal>
          <Reveal delay={1} className="mt-12">
            <SitemapDiagram />
          </Reveal>
        </div>
      </section>

      {/* User flow */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">07 · User flow</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "From browsing to", block: true }, { text: "delivered", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The main purchase flow now has three phases and two decision points. A guest can go all the way to payment, and sign-in is only
            asked for at the end.
          </Reveal>
          <Reveal delay={1} className="mt-12">
            <UserFlowDiagram />
            <p className="igc-scroll-hint e-hand" aria-hidden="true">
              swipe the diagram →
            </p>
          </Reveal>
          <div className="igc-grid-2 mt-12">
            {journeys.map((j, i) => (
              <Reveal key={j.title} delay={i as 0 | 1} className="igc-journey">
                <p className="e-mono">Secondary flow</p>
                <h3>{j.title}</h3>
                <ol>
                  {j.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Key decisions */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">08 · Key UX decisions</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Six moves that", block: true }, { text: "changed the numbers", className: "is-soft", block: true }]} />
          <div className="igc-grid-3 mt-12">
            {decisions.map((d, i) => (
              <Reveal key={d.title} delay={(i % 3) as 0 | 1 | 2} className="igc-decision">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="10" fill="currentColor" opacity="0.12" />
                  <path d="M6.5 11.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard showcase */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">09 · The hero flow</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Design a card", block: true }, { text: "in four steps", className: "is-soft", block: true }]} />
          <div className="igc-wizard mt-12">
            <div className="igc-wizard__steps" role="tablist" aria-label="Design a card steps">
              {wizardSteps.map((s, i) => (
                <button
                  key={s.n}
                  type="button"
                  role="tab"
                  aria-selected={i === step}
                  className="igc-wizard__step"
                  onClick={() => setStep(i)}
                >
                  <span className="igc-wizard__n">{s.n}</span>
                  <span>
                    <strong>{s.title}</strong>
                    {i === step && <span className="igc-wizard__body">{s.body}</span>}
                  </span>
                </button>
              ))}
            </div>
            <div className="igc-wizard__shot" role="tabpanel" aria-label={wizard.title}>
              <Image key={wizard.file} src={`${IMG}/${wizard.file}.webp`} alt={`Design a card, step ${wizard.n}: ${wizard.title}`} width={1440} height={990} sizes="(max-width: 992px) 92vw, 60vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Desktop screens */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">10 · Final UI · desktop</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "24 screens,", block: true }, { text: "one system", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Scroll inside a frame to see the whole page, or open it full size.
          </Reveal>
          <div className="igc-tabs mt-10" role="tablist" aria-label="Screen groups">
            {screenGroups.map((g) => (
              <button key={g.id} type="button" role="tab" aria-selected={g.id === group} onClick={() => setGroup(g.id)}>
                {g.label}
                <span>{g.screens.length}</span>
              </button>
            ))}
          </div>
          <div className="igc-screens mt-8" role="tabpanel" aria-label={activeGroup.label}>
            {activeGroup.screens.map((s) => (
              <BrowserFrame key={s.file} screen={s} onOpen={() => setLightbox(allScreens.indexOf(s))} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile UI */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">11 · Final UI · mobile</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Designed for", block: true }, { text: "one thumb", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Most gifts are sent from a phone, often at the last minute. On mobile the layout drops to one column, tap targets are at least
            44 px, filters live in a bottom sheet and the main CTA stays within reach.
          </Reveal>
          <div className="igc-phones mt-12">
            {mobileScreens.map((s, i) => (
              <Reveal key={s.file} delay={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4} as="figure" className="igc-phone">
                <div className="igc-phone__frame">
                  <div className="igc-phone__screen" tabIndex={0} aria-label={`${s.title} mobile screen, scroll to see more`}>
                    <Image src={`${IMG}/${s.file}.webp`} alt={`${s.title} mobile screen`} width={s.w} height={s.h} unoptimized />
                  </div>
                </div>
                <figcaption>
                  <strong>{s.title}</strong>
                  <p>{s.note}</p>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Design system */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">12 · UI kit</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Modern,", block: true }, { text: "on-brand", className: "is-soft", block: true }]} />
          <div className="igc-ds mt-12">
            <Reveal className="igc-ds__colors">
              {palette.map((c) => (
                <div key={c.hex} className="igc-swatch">
                  <span style={{ background: c.hex }} className={c.dark ? "is-dark" : ""}>
                    {c.hex}
                  </span>
                  <strong>{c.name}</strong>
                  <p>{c.use}</p>
                </div>
              ))}
            </Reveal>
            <Reveal delay={1} className="igc-ds__type">
              <p className="e-mono">Typeface · Poppins</p>
              <p className="igc-ds__aa">Aa</p>
              <div className="igc-ds__scale">
                <span style={{ fontSize: "2rem", fontWeight: 700 }}>Reward 500 people</span>
                <span style={{ fontSize: "1.35rem", fontWeight: 600 }}>How Infinity Gift Card works</span>
                <span style={{ fontSize: "1rem", fontWeight: 500 }}>Choose a design · Who’s it for?</span>
                <span style={{ fontSize: "0.85rem" }}>Bulk order, corporate incentives and a faster way to reward.</span>
              </div>
            </Reveal>
            <Reveal delay={2} className="igc-ds__components">
              <p className="e-mono">Components</p>
              <div className="igc-ds__demo">
                <span className="igc-btn">Get started →</span>
                <span className="igc-btn is-ghost">Explore gift cards</span>
              </div>
              <div className="igc-ds__demo">
                <span className="igc-chip is-on">All</span>
                <span className="igc-chip">Birthdays</span>
                <span className="igc-chip">Achievements</span>
                <span className="igc-chip">Care &amp; support</span>
              </div>
              <div className="igc-ds__demo">
                <span className="igc-stepper" aria-hidden="true">
                  <i className="is-done" />
                  <b />
                  <i className="is-done" />
                  <b />
                  <i className="is-on" />
                  <b className="is-off" />
                  <i />
                </span>
                <span className="igc-qty" aria-hidden="true">
                  <em>−</em>1<em>+</em>
                </span>
              </div>
              <ul className="igc-ds__list">
                <li>Gift-card tile, 3 sizes</li>
                <li>Modal wizard & stepper</li>
                <li>Cart drawer & bottom sheet</li>
                <li>Filters, chips & pagination</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <FrontendBuild data={frontendBuilds["8"]} index="13 · Front-end development" />

      {/* Results */}
      <section data-ground="blue" className="igc-results e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">14 · Results</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Smoother to use,", block: true }, { text: "better for business", className: "is-soft", block: true }]} />
          <div className="igc-grid-3 mt-12">
            {results.map((r, i) => (
              <Reveal key={r.label} delay={i as 0 | 1 | 2} className="igc-metric">
                <CountUp value={r.value} className="igc-metric__value" />
                <strong>{r.label}</strong>
                <p>{r.sub}</p>
              </Reveal>
            ))}
          </div>
          <div className="igc-grid-2 mt-12">
            <Reveal className="igc-learn">
              <p className="e-mono">What I learned</p>
              <ul>
                <li>Delaying sign-in was the single biggest conversion lever. Trust has to be earned before you ask for an account.</li>
                <li>Showing the recipient’s view mid-flow turned a transaction into a moment, and buyers spent longer personalising.</li>
                <li>Local channels matter: WhatsApp delivery became the most-picked option in testing.</li>
              </ul>
            </Reveal>
            <Reveal delay={1} className="igc-learn">
              <p className="e-mono">What’s next</p>
              <ul>
                <li>Bulk CSV upload and approvals for corporate buyers</li>
                <li>Saved recipients and reminders for recurring occasions</li>
                <li>A native app wallet with push notifications</li>
              </ul>
            </Reveal>
          </div>
          <Reveal delay={1} className="mt-12 flex flex-wrap gap-3">
            <ArrowButton variant="white" href="/projects">
              See all projects
            </ArrowButton>
            <ArrowButton variant="ghost" href="/#contact">
              Let&apos;s work together
            </ArrowButton>
          </Reveal>
        </div>
      </section>

      {lightbox !== null && <Lightbox index={lightbox} onClose={closeLightbox} onStep={stepLightbox} />}
    </main>
  );
}
