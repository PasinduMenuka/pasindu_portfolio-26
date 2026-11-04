"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";
import ArrowButton from "@/components/arrow-button";
import { useActiveSectionContext } from "@/context/active-section-context";
import FrontendBuild from "@/components/case-studies/frontend-build";
import { frontendBuilds } from "@/lib/frontend-builds";

// Old screens are full-page captures of the live site; new screens are exported from the Figma file.
// All are pre-compressed WebP, so they skip next/image resizing.
const IMG = "/projects/blooming-box";

type Screen = { file: string; title: string; note: string; w: number; h: number };

/* ---------- Before / after ---------- */

const comparisons: {
  id: string;
  label: string;
  before: Screen;
  after: Screen;
  was: string[];
  now: string[];
}[] = [
  {
    id: "home",
    label: "Home",
    before: { file: "old-home", title: "Home · live site", note: "", w: 1440, h: 4200 },
    after: { file: "d-home", title: "Home · redesign", note: "", w: 1440, h: 3438 },
    was: [
      "A country pop-up blocks the page before anything loads",
      "Flat, monochrome rails that all look the same",
      "Collaborations and seasonal edits are easy to scroll past",
    ],
    now: [
      "Delivery city is a pill in the header, set once and never in the way",
      "Seasonal hero, Premium Collaborations and Best Sellers each have their own look",
      "Soft blush surfaces and big product imagery feel like a gift shop",
    ],
  },
  {
    id: "plp",
    label: "Category",
    before: { file: "old-plp", title: "Flowers · live site", note: "", w: 1440, h: 4200 },
    after: { file: "d-in-season", title: "In Season · redesign", note: "", w: 1440, h: 3194 },
    was: [
      "A sidebar of 20+ categories competes with the products",
      "Small, identical tiles in a 10,000 px page",
      "Filters, sort and budget are spread over three controls",
    ],
    now: [
      "Sub-categories become chips above the grid",
      "Larger cards with Free Delivery tags, wishlist and image carousel",
      "One floating Filter button opens a sheet with every option",
    ],
  },
  {
    id: "pdp",
    label: "Product",
    before: { file: "old-pdp", title: "Rose Box · live site", note: "", w: 1440, h: 3148 },
    after: { file: "d-pdp", title: "Product page · redesign", note: "", w: 1440, h: 2126 },
    was: [
      "Options are small text chips in one dense column",
      "Delivery time isn’t shown until checkout",
      "The Add to Bag button is small and sits below the fold",
    ],
    now: [
      "Size, flower colour and box colour as 48 px chips with swatches",
      "A same-day countdown: “Order within 00:00:00, get it in 2 hours”",
      "Tabby and Tamara instalments next to the price, Buy Now beside Add to Bag",
    ],
  },
];

const mobileCompare = {
  before: { file: "old-m-pdp", title: "Before", note: "", w: 390, h: 2858 },
  after: { file: "m-pdp", title: "After", note: "", w: 402, h: 2232 },
};

/* ---------- Final UI ---------- */

const screenGroups: { id: string; label: string; screens: Screen[] }[] = [
  {
    id: "browse",
    label: "Browse & discover",
    screens: [
      { file: "d-home", title: "Home", note: "Seasonal hero, Premium Collaborations, Best Sellers, Shop Your Way and Featured On.", w: 1440, h: 3438 },
      { file: "d-in-season", title: "Category · In Season", note: "Chip sub-categories, large product cards and a floating filter.", w: 1440, h: 3194 },
      { file: "d-shop-menu", title: "Shop menu", note: "A mega menu grouped by product, occasion and collection.", w: 1440, h: 1024 },
      { file: "d-search", title: "Search", note: "Full-width search with recent and trending queries.", w: 1440, h: 1024 },
      { file: "d-delivery-location", title: "Delivery location", note: "Pick the emirate once; prices and slots update everywhere.", w: 1440, h: 1024 },
    ],
  },
  {
    id: "product",
    label: "Product & add-ons",
    screens: [
      { file: "d-pdp", title: "Product page", note: "Gallery, chip options, countdown, instalments and points.", w: 1440, h: 2126 },
      { file: "d-cake-pdp", title: "Cake + Make it Special", note: "A cake page with balloons, cards and a cake message added inline.", w: 1440, h: 2126 },
      { file: "d-balloons", title: "Balloon options", note: "Add-ons open in a light dialog without leaving the product.", w: 1440, h: 1024 },
      { file: "d-collab-plp", title: "Netflix collection", note: "A themed collaboration page with a dark, on-brand skin.", w: 1440, h: 1696 },
      { file: "d-collab-pdp", title: "Netflix product", note: "The same product template, re-skinned by the collaboration theme.", w: 1440, h: 1696 },
    ],
  },
  {
    id: "checkout",
    label: "Checkout",
    screens: [
      { file: "d-bag", title: "Bag", note: "Line items with quantity, an upsell rail and the order summary.", w: 1440, h: 1024 },
      { file: "d-card", title: "Greeting card", note: "I want a card, send an empty card, or no card.", w: 1440, h: 1305 },
      { file: "d-delivery", title: "Receiver & delivery", note: "Delivery or pickup, “I am the receiver” and saved addresses.", w: 1440, h: 2733 },
      { file: "d-slot", title: "Delivery slot", note: "Free and priority slots, picked from a calendar.", w: 1440, h: 2965 },
      { file: "d-payment", title: "Payment", note: "Apple Pay, cards, Tabby and Tamara, plus promo codes.", w: 1440, h: 1024 },
      { file: "d-confirmed", title: "Order confirmed", note: "Summary, delivery details and what happens next.", w: 1440, h: 1122 },
    ],
  },
  {
    id: "account",
    label: "Account",
    screens: [
      { file: "d-login", title: "Sign in", note: "Email, Google or Apple, asked for only when it is needed.", w: 1440, h: 1024 },
      { file: "d-account", title: "Account menu", note: "Orders, addresses, points and settings from one dropdown.", w: 1440, h: 1024 },
      { file: "d-account-details", title: "Account details", note: "A side menu with profile fields, linked Google and Apple accounts, and delete account.", w: 1440, h: 1250 },
      { file: "d-settings", title: "Settings", note: "Currency and emirate in one place, plus order tracking by number.", w: 1440, h: 1250 },
    ],
  },
];

const allScreens = screenGroups.flatMap((g) => g.screens);

const mobileScreens: Screen[] = [
  { file: "m-home-app", title: "Home (iOS app)", note: "Floating bottom bar with Home, Products, Bag, Profile and an AI gift assistant.", w: 402, h: 1790 },
  { file: "m-plp", title: "Category", note: "Back, title and wishlist on top; chips and a floating Filter.", w: 402, h: 1554 },
  { file: "m-pdp", title: "Product", note: "Full-bleed gallery, countdown, chip options and sticky CTAs.", w: 402, h: 2232 },
  { file: "m-make-special", title: "Make it special", note: "Cake size, box colour, a cake message and balloons.", w: 402, h: 874 },
  { file: "m-collab-pdp", title: "Netflix product", note: "The collaboration theme carries through on mobile.", w: 402, h: 1808 },
  { file: "m-bag", title: "Bag", note: "Steppers, “You may also like” and totals above the CTA.", w: 402, h: 1051 },
  { file: "m-sender", title: "Greeting card", note: "Three clear choices and a message box.", w: 402, h: 874 },
  { file: "m-receiver", title: "Receiver", note: "Delivery or pickup, contact details and saved addresses.", w: 402, h: 1964 },
  { file: "m-delivery", title: "Delivery slot", note: "Free and Priority delivery with time windows.", w: 402, h: 2186 },
  { file: "m-checkout", title: "Checkout", note: "One review screen: card, receiver, points, payment and total.", w: 402, h: 1863 },
  { file: "m-confirmed", title: "Order confirmed", note: "Order summary and delivery details at a glance.", w: 402, h: 1320 },
];

const accountScreens: Screen[] = [
  { file: "m-login", title: "Sign in", note: "Email, Google or Apple, with “Continue as guest” always available.", w: 402, h: 1032 },
  { file: "m-signup", title: "Sign up", note: "Name, mobile, email, birthday and gender. The birthday unlocks a BLACK perk.", w: 402, h: 1295 },
  { file: "m-account", title: "Account (logged in)", note: "BLACK card on top, then details, orders, wishlist, store credit and saved cards.", w: 402, h: 1820 },
  { file: "m-account-black", title: "Account, compact", note: "A lighter layout: tier pill, quick links and app settings with toggles.", w: 402, h: 874 },
  { file: "m-personal", title: "Personal details", note: "A sheet with a single Save button and linked sign-in accounts.", w: 402, h: 1032 },
];

const blackTiers = [
  {
    id: "basic",
    name: "BLACK",
    badge: "Entry",
    body: "Every shopper joins at sign-up. The card shows progress to Silver, available points, activity, the tier anniversary and a personal BLACK promo code to share.",
    perks: ["Points on every order", "Personal promo code", "Points activity history"],
    screens: [
      { file: "m-black-basic", title: "BLACK", note: "", w: 402, h: 1209 },
      { file: "m-account", title: "Account with BLACK card", note: "", w: 402, h: 1820 },
    ],
  },
  {
    id: "plus",
    name: "BLACK Silver",
    badge: "Plus",
    body: "Silver members earn faster and get double points in their birthday month. Rewards list what they have unlocked and what comes next on the way to Gold.",
    perks: ["Birthday month double points", "Unlocked rewards list", "Compare tiers at any time"],
    screens: [
      { file: "m-black-plus", title: "BLACK Silver rewards", note: "", w: 402, h: 1840 },
      { file: "m-black-plus-default", title: "BLACK Silver", note: "", w: 402, h: 874 },
    ],
  },
  {
    id: "signature",
    name: "BLACK Gold",
    badge: "Signature",
    body: "The top tier adds a named personal manager for gifting help, along with every earlier perk. It turns a store into a relationship, which is the point of BLACK.",
    perks: ["A personal gifting manager", "Tier anniversary rewards", "Priority service"],
    screens: [
      { file: "m-black-signature", title: "BLACK Gold", note: "", w: 402, h: 1423 },
      { file: "m-black-signature-rewards", title: "BLACK Gold rewards", note: "", w: 402, h: 1013 },
    ],
  },
];

const checkoutSteps = [
  { n: "01", title: "Bag", body: "Quantity steppers, a “You may also like” rail and a clear order summary. Nothing is hidden behind a drawer.", file: "d-bag" },
  { n: "02", title: "Greeting card", body: "Three plain choices: write a card, send an empty one to fill in by hand, or skip it. The message box only appears when it is needed.", file: "d-card" },
  { n: "03", title: "Receiver & delivery", body: "Delivery or pickup, an “I am the receiver” switch, the address book, and a “Call the receiver” option for surprise gifts when you don’t know the address.", file: "d-delivery" },
  { n: "04", title: "Delivery slot", body: "Free standard slots or paid Priority delivery, chosen from a calendar with time windows that update for the selected emirate.", file: "d-slot" },
  { n: "05", title: "Payment", body: "Apple Pay first, then cards, Tabby and Tamara. Promo codes and loyalty points apply on the same screen.", file: "d-payment" },
  { n: "06", title: "Confirmed", body: "A calm confirmation with the order summary, delivery details and what happens next.", file: "d-confirmed" },
];

const auditFindings = [
  { title: "Blocked first visit", body: "A country and city pop-up covers the home page before the shopper has seen a single product." },
  { title: "Crowded mobile header", body: "An app-download banner, a delivery bar and the header stack up, so products start below the fold." },
  { title: "Sidebar overload", body: "Category pages lead with a list of 20+ links and small tiles, which makes the range feel bigger but harder to browse." },
  { title: "Hidden delivery promise", body: "Same-day delivery is the brand’s main selling point, but the cut-off time isn’t visible on the product page." },
  { title: "Dense product options", body: "Flower colour, box colour, card message and add-ons are stacked as small text in one column." },
  { title: "Flat brand feel", body: "A black-and-white UI with little hierarchy doesn’t match a premium gifting brand, and collaborations don’t stand out." },
];

const personas = [
  {
    name: "Mariam",
    role: "Marketing manager in Dubai, 31",
    quote: "It’s my mum’s birthday and I’m stuck in meetings. I need flowers there by this evening.",
    goals: ["See the delivery cut-off before choosing", "Pay with Apple Pay in one tap", "Add a cake or balloons without starting over"],
    pains: ["Pop-ups before she can browse", "Delivery time only shown at checkout", "Tiny option chips on her phone"],
  },
  {
    name: "Harry",
    role: "Expat sending gifts home & across the UAE, 38",
    quote: "I want it to be a surprise, but I don’t always know the exact address.",
    goals: ["Let BloomingBox call the receiver for the address", "Write a proper card message", "Split the payment with Tabby"],
    pains: ["Address required up front", "No way to send an empty card", "Checkout forms that feel long"],
  },
];

const process = [
  { title: "Discover", sub: "Audit & benchmark", items: ["Heuristic audit of the live site", "Benchmark of UAE & global gifting stores", "Review of support tickets & analytics"] },
  { title: "Define", sub: "Problems & goals", items: ["Two primary personas", "Journey map with drop-off points", "Success metrics for checkout"] },
  { title: "Design", sub: "Wireframes & UI", items: ["New IA and navigation", "Wireframes for PLP, PDP & checkout", "Blush & ink UI kit in Figma"] },
  { title: "Validate", sub: "Test & iterate", items: ["Clickable prototype tests", "Iterated PDP options & checkout", "Accessibility & RTL pass"] },
  { title: "Deliver", sub: "UI & build", items: ["40+ desktop & iOS screens", "Components & tokens", "Next.js front end"] },
];

const decisions = [
  { title: "Delivery city, set once", body: "The blocking pop-up became a “Delivery to Dubai” pill in the header. Prices, stock and slots update everywhere when it changes." },
  { title: "Show the same-day promise", body: "Every product page shows a live cut-off: “Order within 00:00:00, get it in 2 hours”. The main reason people choose BloomingBox is now visible." },
  { title: "Options as big chips", body: "Size, flower colour and box colour are 48 px chips and swatch dropdowns, so choices are clear and easy to tap." },
  { title: "Make it special, inline", body: "Balloons, cake messages and cards are added on the product page itself, instead of in a separate step later." },
  { title: "Checkout for surprises", body: "“I am the receiver”, pickup, the address book and “Call the receiver” cover the real ways people send gifts in the UAE." },
  { title: "Themeable collaborations", body: "Netflix, Mercedes-Benz and Stranger Things pages reuse the same templates with a swappable theme, so partner launches are fast." },
];

const palette = [
  { name: "Ink", hex: "#13171B", use: "CTAs, bottom bar, text", dark: true },
  { name: "Rose", hex: "#D2898D", use: "Seasonal accents", dark: true },
  { name: "Petal", hex: "#E4BEC2", use: "Hero & highlight surfaces" },
  { name: "Blush", hex: "#F4EBE6", use: "Page gradient & cards" },
  { name: "Mint", hex: "#EBFBEE", use: "Success states" },
  { name: "White", hex: "#FFFFFF", use: "Base surface" },
];

const outcomes = [
  { value: "40+", label: "Screens designed", sub: "Desktop web and iOS, from home to order confirmed" },
  { value: "6", label: "Calm checkout steps", sub: "Each one asks for one thing, with a summary always visible" },
  { value: "1", label: "Theme engine", sub: "Collaboration pages re-skin the same templates" },
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
  { label: "02 · Product", top: 190 },
  { label: "03 · Checkout", top: 380 },
];

const flowNodes: FlowNode[] = [
  { id: "land", x: 130, y: 95, label: "Land", sub: "Home · Search · Collab", kind: "start" },
  { id: "city", x: 330, y: 95, label: "Delivery city", sub: "Header pill, set once" },
  { id: "plp", x: 530, y: 95, label: "Category", sub: "Chips & filter sheet" },
  { id: "pdp", x: 730, y: 95, label: "Product page", sub: "Options & countdown", kind: "cta" },
  { id: "opts", x: 130, y: 285, label: "Pick options", sub: "Size, flowers, box" },
  { id: "d1", x: 320, y: 285, label: "Extras?", kind: "decision" },
  { id: "special", x: 500, y: 285, label: "Make it special", sub: "Balloons, cake msg" },
  { id: "bag", x: 700, y: 285, label: "Add to bag", sub: "Or Buy now" },
  { id: "bagv", x: 900, y: 285, label: "Bag", sub: "Qty & upsell" },
  { id: "card", x: 130, y: 475, label: "Greeting card", sub: "Card · empty · none" },
  { id: "recv", x: 320, y: 475, label: "Receiver", sub: "Delivery or pickup" },
  { id: "d2", x: 500, y: 475, label: "Address?", kind: "decision" },
  { id: "call", x: 680, y: 475, label: "Call receiver", sub: "We get the address" },
  { id: "slot", x: 870, y: 475, label: "Delivery slot", sub: "Free · Priority" },
  { id: "pay", x: 1080, y: 475, label: "Pay → confirmed", sub: "Apple Pay · Tabby", kind: "end" },
];

const flowEdges: FlowEdge[] = [
  { from: "land", to: "city" },
  { from: "city", to: "plp" },
  { from: "plp", to: "pdp" },
  { from: "pdp", to: "opts" },
  { from: "opts", to: "d1" },
  { from: "d1", to: "special", label: "Yes" },
  { from: "d1", to: "bag", label: "No", route: "over" },
  { from: "special", to: "bag" },
  { from: "bag", to: "bagv" },
  { from: "bagv", to: "card" },
  { from: "card", to: "recv" },
  { from: "recv", to: "d2" },
  { from: "d2", to: "call", label: "Unknown" },
  { from: "d2", to: "slot", label: "Known", route: "over" },
  { from: "call", to: "slot" },
  { from: "slot", to: "pay" },
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
    <div className="igc-flow" role="img" aria-label="User flow for sending a gift: discover, choose product options and extras, then checkout with greeting card, receiver, delivery slot and payment.">
      <svg viewBox="0 0 1240 570" className="igc-flow__svg">
        <defs>
          <marker id="bbx-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
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
              <path d={g.d} className="igc-flow__edge" markerEnd="url(#bbx-arrow)" />
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
  { title: "Shop", items: ["Flowers", "Bundles", "Cakes & treats", "Perfumes & jewellery", "Hampers & plants", "In Season"] },
  { title: "Occasions", items: ["Birthday", "Love", "Graduation", "Newborn", "Get well"] },
  { title: "Collaborations", items: ["Netflix", "Mercedes-Benz", "Stranger Things", "Maison Morand"] },
  { title: "Checkout", items: ["Bag", "Greeting card", "Receiver & delivery", "Delivery slot", "Payment", "Confirmed"] },
  { title: "Account", items: ["Sign in / Sign up", "Personal details", "Orders & wishlist", "Store credit & cards", "BLACK loyalty", "Settings"] },
];

function SitemapDiagram() {
  return (
    <div className="igc-ia" role="img" aria-label="Information architecture: Home branches into Shop, Occasions, Collaborations, Checkout and Account.">
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
  { title: "Surprise gift, address unknown", steps: ["Product page", "Add to bag", "Greeting card", "Call the receiver", "Priority slot", "Delivered in 2 hours"] },
  { title: "Collaboration launch", steps: ["Instagram ad", "Netflix collection", "Themed product page", "Buy now", "Apple Pay", "Confirmed"] },
];

/* ---------- Page ---------- */

function BrowserFrame({ screen, onOpen, label, url = "bloomingbox.com" }: { screen: Screen; onOpen?: () => void; label?: "before" | "after"; url?: string }) {
  return (
    <figure className="igc-browser">
      <div className="igc-browser__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>{url}</em>
        {label && <b className={`bbx-label is-${label}`}>{label}</b>}
      </div>
      <div className="igc-browser__view" tabIndex={0} aria-label={`${screen.title} screen, scroll to see the full page`}>
        <Image src={`${IMG}/${screen.file}.webp`} alt={`${screen.title} screen`} width={screen.w} height={screen.h} unoptimized />
      </div>
      {screen.note && (
        <figcaption>
          <div>
            <strong>{screen.title}</strong>
            <p>{screen.note}</p>
          </div>
          {onOpen && (
            <button type="button" className="igc-expand" onClick={onOpen} aria-label={`Open ${screen.title} full size`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M8.5 1.5h4v4M5.5 12.5h-4v-4M12.5 1.5L8 6M1.5 12.5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function Phone({ screen }: { screen: Screen }) {
  return (
    <div className="igc-phone__frame">
      <div className="igc-phone__screen" tabIndex={0} aria-label={`${screen.title} mobile screen, scroll to see more`}>
        <Image src={`${IMG}/${screen.file}.webp`} alt={`${screen.title} mobile screen`} width={screen.w} height={screen.h} unoptimized />
      </div>
    </div>
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

export default function BloomingBoxCaseStudy() {
  const { setActiveSection } = useActiveSectionContext();
  const [compare, setCompare] = useState(comparisons[0].id);
  const [group, setGroup] = useState(screenGroups[0].id);
  const [step, setStep] = useState(0);
  const [tier, setTier] = useState(blackTiers[0].id);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => setActiveSection("Projects"), [setActiveSection]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepLightbox = useCallback(
    (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + allScreens.length) % allScreens.length)),
    []
  );

  const activeCompare = comparisons.find((c) => c.id === compare) ?? comparisons[0];
  const activeGroup = screenGroups.find((g) => g.id === group) ?? screenGroups[0];
  const checkout = checkoutSteps[step];
  const activeTier = blackTiers.find((t) => t.id === tier) ?? blackTiers[0];

  return (
    <main className="e-main igc bbx">
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
                lines={[{ text: "BloomingBox", block: true }, { text: "Revamp", className: "is-soft", block: true }]}
              />
              <Reveal delay={1} as="p" className="e-lead mt-6">
                A full UX and UI redesign of the UAE’s same-day flower and gift store. The goal was to make sending a thoughtful gift feel as
                fast and as special as receiving one, on the web and in the iOS app.
              </Reveal>
              <Reveal delay={2} className="igc-chips">
                <span>E-commerce</span>
                <span>UX research</span>
                <span>UI redesign</span>
                <span>iOS & web</span>
                <span>Next.js build</span>
              </Reveal>
              <Reveal delay={2} className="mt-7">
                <ArrowButton variant="white" href="https://bloomingbox.com/" target="_blank" rel="noopener noreferrer">
                  Visit the current site
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
                  <dd>Responsive web + iOS app</dd>
                </div>
                <div>
                  <dt className="e-mono">Tools</dt>
                  <dd>Figma · Next.js · Tailwind CSS · shadcn/ui</dd>
                </div>
                <div>
                  <dt className="e-mono">AI tools</dt>
                  <dd>Claude Code · Figma MCP</dd>
                </div>
                <div>
                  <dt className="e-mono">Scope</dt>
                  <dd>40+ screens, UI kit, components, front end</dd>
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
            <SplitHeading className="igc-h2" lines={[{ text: "Same-day gifting,", block: true }, { text: "without the rush", className: "is-soft", block: true }]} />
          </div>
          <div className="igc-prose">
            <Reveal as="p">
              BloomingBox sells flowers, cakes, perfumes and curated gifts across the UAE, with delivery in as little as two hours. It also
              runs premium collaborations with brands like Netflix and Mercedes-Benz. The service is fast, but the website made shoppers work
              hard: pop-ups before browsing, dense product options, and a delivery promise you only saw at checkout.
            </Reveal>
            <Reveal as="p" delay={1}>
              I redesigned the experience end to end: audit, information architecture, flows, a blush-and-ink UI kit, desktop and iOS
              screens, and the Next.js front end. The brief was to <strong>make the store feel premium, surface the same-day promise, and
              make checkout work for surprise gifts</strong>.
            </Reveal>
            <Reveal delay={2} className="igc-goals">
              <div>
                <span className="e-mono">Goal 01</span>
                <p>Get from landing to product with fewer interruptions</p>
              </div>
              <div>
                <span className="e-mono">Goal 02</span>
                <p>Make delivery timing and options obvious</p>
              </div>
              <div>
                <span className="e-mono">Goal 03</span>
                <p>A checkout built for real gifting habits</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Problem / audit */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">02 · The problem</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "What the audit", block: true }, { text: "turned up", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            I walked through the live site on desktop and mobile, from landing to checkout, and benchmarked it against other gifting stores.
            Six problems kept coming up.
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

      {/* Before & after */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">03 · Before & after</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "The old site,", block: true }, { text: "side by side", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The left frame is a capture of the live site. The right frame is the redesign. Scroll inside either one to compare the full page.
          </Reveal>
          <div className="igc-tabs mt-10" role="tablist" aria-label="Pages to compare">
            {comparisons.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={c.id === compare} onClick={() => setCompare(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="mt-8" role="tabpanel" aria-label={activeCompare.label}>
            <div className="bbx-compare">
              <BrowserFrame key={activeCompare.before.file} screen={activeCompare.before} label="before" url="bloomingbox.com · today" />
              <BrowserFrame key={activeCompare.after.file} screen={activeCompare.after} label="after" url="bloomingbox.com · redesign" />
            </div>
            <div className="bbx-notes">
              <div>
                <p className="e-mono">Before</p>
                <ul>
                  {activeCompare.was.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              <div className="is-after">
                <p className="e-mono">After</p>
                <ul>
                  {activeCompare.now.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <Reveal className="bbx-phones-compare mt-12">
            {[
              { s: mobileCompare.before, l: "before" as const, t: "Product page on mobile today" },
              { s: mobileCompare.after, l: "after" as const, t: "Redesigned product page" },
            ].map(({ s, l, t }) => (
              <figure key={s.file} className="igc-phone">
                <Phone screen={s} />
                <figcaption>
                  <b className={`bbx-label is-${l}`}>{l}</b>
                  <strong>{t}</strong>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section data-ground="white" className="igc-blush e-section">
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
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">05 · Who we designed for</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Two senders,", block: true }, { text: "one deadline", className: "is-soft", block: true }]} />
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
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">06 · Information architecture</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "A sitemap built", block: true }, { text: "around the gift", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The catalogue is now split three ways: by product, by occasion and by brand collaboration. Checkout became its own short branch
            with one question per step.
          </Reveal>
          <Reveal delay={1} className="mt-12">
            <SitemapDiagram />
          </Reveal>
        </div>
      </section>

      {/* User flow */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">07 · User flow</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "From browsing to", block: true }, { text: "delivered", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The main flow has three phases and two decision points. Extras are optional and added on the product page. If the sender doesn’t
            know the address, BloomingBox calls the receiver.
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
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">08 · Key UX decisions</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Six moves that", block: true }, { text: "shaped the redesign", className: "is-soft", block: true }]} />
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

      {/* Feature spotlights */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">09 · Feature spotlight</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Details that", block: true }, { text: "make it a gift", className: "is-soft", block: true }]} />
          <div className="mt-12">
            <Reveal className="bbx-feature">
              <div>
                <h3>Make it special, without leaving the page</h3>
                <p>
                  Cakes, balloons and messages used to be separate products. Now they are add-ons on the product page, so a bouquet becomes a
                  celebration in a few taps.
                </p>
                <ul>
                  <li>Cake size chips: Bento, 1 kg and 2 kg</li>
                  <li>A cake message written on the page</li>
                  <li>Balloon options in a light dialog</li>
                </ul>
              </div>
              <div className="bbx-feature__media">
                <figure className="igc-phone">
                  <Phone screen={{ file: "m-make-special", title: "Make it special", note: "", w: 402, h: 874 }} />
                </figure>
                <BrowserFrame screen={{ file: "d-balloons", title: "Balloon options", note: "", w: 1440, h: 1024 }} />
              </div>
            </Reveal>
            <Reveal className="bbx-feature is-flip">
              <div>
                <h3>Collaborations with their own skin</h3>
                <p>
                  Partner collections like Netflix get a dark, cinematic theme on the same templates. Marketing can launch a new partner page
                  without new designs.
                </p>
                <ul>
                  <li>Theme tokens for background, text and accent</li>
                  <li>Same product, bag and checkout components</li>
                  <li>Works on web and in the iOS app</li>
                </ul>
              </div>
              <div className="bbx-feature__media">
                <BrowserFrame screen={{ file: "d-collab-plp", title: "Netflix collection", note: "", w: 1440, h: 1696 }} />
                <figure className="igc-phone">
                  <Phone screen={{ file: "m-collab-pdp", title: "Netflix product", note: "", w: 402, h: 1808 }} />
                </figure>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Checkout showcase */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">10 · The hero flow</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "A checkout built", block: true }, { text: "for surprises", className: "is-soft", block: true }]} />
          <div className="igc-wizard mt-12">
            <div className="igc-wizard__steps" role="tablist" aria-label="Checkout steps">
              {checkoutSteps.map((s, i) => (
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
            <div className="igc-wizard__shot" role="tabpanel" aria-label={checkout.title}>
              <Image key={checkout.file} src={`${IMG}/${checkout.file}.webp`} alt={`Checkout step ${checkout.n}: ${checkout.title}`} width={1440} height={990} unoptimized />
            </div>
          </div>
        </div>
      </section>

      {/* Desktop screens */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">11 · Final UI · desktop</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "20 desktop screens,", block: true }, { text: "one system", className: "is-soft", block: true }]} />
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
            <p className="e-mono igc-eyebrow">12 · Final UI · iOS & mobile web</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Designed for", block: true }, { text: "one thumb", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Most gifts are sent from a phone, often on the way somewhere. A floating bottom bar keeps Home, Products, Bag, Profile and the AI
            gift assistant in reach, soft blurs keep content readable under it, and every main action sits in the lower half of the screen.
          </Reveal>
          <div className="igc-phones mt-12">
            {mobileScreens.map((s, i) => (
              <Reveal key={s.file} delay={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4} as="figure" className="igc-phone">
                <Phone screen={s} />
                <figcaption>
                  <strong>{s.title}</strong>
                  <p>{s.note}</p>
                </figcaption>
              </Reveal>
            ))}
          </div>
          <p className="igc-scroll-hint e-hand" aria-hidden="true">
            swipe for more screens →
          </p>
        </div>
      </section>

      {/* Account */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">13 · User account</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "An account worth", block: true }, { text: "signing in for", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The old account area was a plain list of links. Now it opens with the shopper’s BLACK card and progress, and the everyday things
            (orders, wishlist, store credit, saved cards, language, currency and delivery city) sit in short grouped lists below it. Sign-in is
            never a wall: “Continue as guest” is always there.
          </Reveal>
          <div className="bbx-account mt-12">
            {accountScreens.map((s, i) => (
              <Reveal key={s.file} delay={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4} as="figure" className="igc-phone">
                <Phone screen={s} />
                <figcaption>
                  <strong>{s.title}</strong>
                  <p>{s.note}</p>
                </figcaption>
              </Reveal>
            ))}
          </div>
          <div className="igc-grid-2 mt-12">
            <Reveal>
              <BrowserFrame screen={{ file: "d-account-details", title: "Account details · desktop", note: "Side menu, profile fields, linked Google and Apple accounts.", w: 1440, h: 1250 }} />
            </Reveal>
            <Reveal delay={1}>
              <BrowserFrame screen={{ file: "d-settings", title: "Settings · desktop", note: "Currency, emirate and order tracking on one page.", w: 1440, h: 1250 }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Loyalty */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">14 · Loyalty · BLACK</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Not a discount club,", block: true }, { text: "a relationship", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            BLACK is a new three-tier loyalty programme. I designed it in BloomingBox’s most premium look: matte black cards, gold and silver
            tier tags, and a soft spotlight. It shows up where it matters: a header pill and a home-screen teaser, the account card, points on
            the product page, and points at checkout.
          </Reveal>
          <div className="bbx-black-intro mt-12">
            {[
              { file: "m-black-home", title: "Home teaser", note: "“Introducing BLACK” takes over the hero for members who haven’t joined.", w: 402, h: 874 },
              { file: "m-black-onboarding", title: "How BLACK works", note: "Three steps: shop, earn and unlock, enjoy. One button: Enter BLACK.", w: 402, h: 874 },
            ].map((s, i) => (
              <Reveal key={s.file} delay={i as 0 | 1} as="figure" className="igc-phone">
                <Phone screen={s} />
                <figcaption>
                  <strong>{s.title}</strong>
                  <p>{s.note}</p>
                </figcaption>
              </Reveal>
            ))}
          </div>
          <div className="bbx-tiers mt-12">
            <div className="igc-wizard__steps" role="tablist" aria-label="BLACK tiers">
              {blackTiers.map((t, i) => (
                <button key={t.id} type="button" role="tab" aria-selected={t.id === tier} className="igc-wizard__step" onClick={() => setTier(t.id)}>
                  <span className="igc-wizard__n">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="e-mono bbx-tiers__badge">{t.badge}</span>
                    <strong>{t.name}</strong>
                    {t.id === tier && (
                      <>
                        <span className="igc-wizard__body">{t.body}</span>
                        <ul className="bbx-tiers__perks">
                          {t.perks.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div key={activeTier.id} className="bbx-tiers__phones" role="tabpanel" aria-label={activeTier.name}>
              {activeTier.screens.map((s) => (
                <figure key={s.file} className="igc-phone">
                  <Phone screen={s} />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Design system */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">15 · UI kit</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Soft blush,", block: true }, { text: "confident ink", className: "is-soft", block: true }]} />
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
                <span style={{ fontSize: "2rem", fontWeight: 600 }}>Premium Collaborations</span>
                <span style={{ fontSize: "1.35rem", fontWeight: 500 }}>Roses Box Medium</span>
                <span style={{ fontSize: "1rem", fontWeight: 500 }}>Order within 00:00:00</span>
                <span style={{ fontSize: "0.85rem" }}>4 interest-free payments of AED 65.00 with Tabby.</span>
              </div>
            </Reveal>
            <Reveal delay={2} className="igc-ds__components">
              <p className="e-mono">Components</p>
              <div className="igc-ds__demo">
                <span className="igc-btn">Buy now</span>
                <span className="igc-btn is-ghost">Add to bag</span>
              </div>
              <div className="igc-ds__demo">
                <span className="igc-chip is-on">All</span>
                <span className="igc-chip">Boxes</span>
                <span className="igc-chip">Bouquets</span>
                <span className="igc-chip">Vases</span>
              </div>
              <div className="igc-ds__demo">
                <span className="igc-chip">S</span>
                <span className="igc-chip is-on">Medium</span>
                <span className="igc-chip">L</span>
                <span className="igc-qty" aria-hidden="true">
                  <em>−</em>1<em>+</em>
                </span>
              </div>
              <ul className="igc-ds__list">
                <li>Floating bottom bar, 5 states incl. AI</li>
                <li>Product card with carousel & tags</li>
                <li>Option chips, swatch dropdowns, steppers</li>
                <li>Announcement bar & page indicator</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <FrontendBuild data={frontendBuilds["9"]} index="16 · Front-end development" />

      {/* Outcome */}
      <section data-ground="blue" className="igc-results e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">17 · Outcome</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "A store that feels", block: true }, { text: "like the gift", className: "is-soft", block: true }]} />
          <div className="igc-grid-3 mt-12">
            {outcomes.map((r, i) => (
              <Reveal key={r.label} delay={i as 0 | 1 | 2} className="igc-metric">
                <span className="igc-metric__value">{r.value}</span>
                <strong>{r.label}</strong>
                <p>{r.sub}</p>
              </Reveal>
            ))}
          </div>
          <div className="igc-grid-2 mt-12">
            <Reveal className="igc-learn">
              <p className="e-mono">What I learned</p>
              <ul>
                <li>The delivery promise is the product. Putting the cut-off on every product page did more than any visual change.</li>
                <li>Gifting has edge cases normal checkouts ignore: unknown addresses, blank cards and buying for yourself.</li>
                <li>A theme layer on shared templates lets marketing move fast without breaking the system.</li>
              </ul>
            </Reveal>
            <Reveal delay={1} className="igc-learn">
              <p className="e-mono">What’s next</p>
              <ul>
                <li>Arabic RTL screens from the same components</li>
                <li>The AI gift assistant: budget, occasion and receiver in, picks out</li>
                <li>BLACK reminders for repeat occasions, like birthdays and anniversaries</li>
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
