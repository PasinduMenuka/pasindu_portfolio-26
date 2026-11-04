"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";
import ArrowButton from "@/components/arrow-button";
import { useActiveSectionContext } from "@/context/active-section-context";
import FrontendBuild from "@/components/case-studies/frontend-build";
import { frontendBuilds } from "@/lib/frontend-builds";

// "Before" images are captures of salesplay.com and the current app's Play Store screenshots;
// "after" images are exported from the Android POS Figma file. All are pre-compressed WebP.
const IMG = "/projects/salesplay-pos";

type Screen = { file: string; title: string; note: string; w: number; h: number };

const tab = (file: string, title: string, note = ""): Screen => ({ file, title, note, w: 1280, h: 800 });
const phone = (file: string, title: string, note = "", w = 412, h = 917): Screen => ({ file, title, note, w, h });

/* ---------- Content ---------- */

const oldApp: Screen[] = [
  { file: "old-sale", title: "Sale screen", note: "", w: 1351, h: 1000 },
  { file: "old-payment", title: "Payment", note: "", w: 1351, h: 1000 },
  { file: "old-credit", title: "Credit settlement", note: "", w: 1351, h: 1000 },
  { file: "old-customer", title: "Customer profile", note: "", w: 1351, h: 1000 },
  { file: "old-drawer", title: "Drawer transactions", note: "", w: 1351, h: 1000 },
];

const auditFindings = [
  { title: "Keypad-first payment", body: "The payment screen opens on a large number pad. Most cash sales are a round amount, so cashiers typed the same numbers again and again." },
  { title: "Methods hidden in tabs", body: "Cash, Card and Credit sit in small tabs at the top. Mixed or unusual payments meant switching tabs and starting over." },
  { title: "One CHARGE for everything", body: "A single CHARGE button did different things for each method, with no confirm step, so a mistyped amount went straight through." },
  { title: "No room for real-world rules", body: "Card surcharges, dual pricing, cash rounding and foreign currency had no clear place on the screen, so they lived in settings or on paper." },
  { title: "Silent failures", body: "When the network dropped or a field was wrong, feedback was easy to miss on a busy counter." },
  { title: "Long, single-form onboarding", body: "New merchants had to register, pick a shop and set up a terminal in one long flow, with errors shown only after submitting." },
];

const personas = [
  {
    name: "Nimal",
    role: "Cashier at a busy grocery, 24",
    quote: "There’s a queue out the door. I need to take cash, give change and move to the next person.",
    goals: ["Take round cash amounts in one tap", "See the change due clearly", "Split a bill without a calculator"],
    pains: ["Typing every amount on a keypad", "No confirm before charging", "Error messages he can’t see"],
  },
  {
    name: "Fathima",
    role: "Café owner with two outlets, 36",
    quote: "Card fees and two price lists eat my margin. I want the POS to handle that, not my staff.",
    goals: ["Add card surcharges automatically", "Show dine-in and takeaway prices", "Set up a new terminal in minutes"],
    pains: ["Surcharges done by hand", "Rounding errors at closing", "Slow onboarding for new staff"],
  },
];

const process = [
  { title: "Discover", sub: "Audit & research", items: ["Heuristic audit of the current app", "Cashier observation at the counter", "Support ticket review"] },
  { title: "Define", sub: "Problems & goals", items: ["Cashier and owner personas", "Checkout journey map", "Payment edge-case inventory"] },
  { title: "Design", sub: "Flows & UI", items: ["Payment and split flows", "Tablet + phone layouts", "Material-based UI kit"] },
  { title: "Validate", sub: "Test & iterate", items: ["Prototype tests with cashiers", "Error and offline states", "Accessibility pass"] },
  { title: "Deliver", sub: "Handoff & build", items: ["40+ screens & flow boards", "Components & snackbar system", "Dev handoff"] },
];

const decisions = [
  { title: "Quick cash amounts", body: "The cash field is pre-filled with the total, and four suggested notes sit underneath. Most cash sales now take one tap, not five." },
  { title: "Big, explicit methods", body: "Cash, Card and Other are full-width buttons instead of tabs. Every method ends with a clear Confirm, so nothing is charged by accident." },
  { title: "Rules built into checkout", body: "Card surcharge, dual price, manual rounding and alternative currency each have a defined spot and dialog on the payment screen." },
  { title: "Split without a calculator", body: "Plus and minus set the number of payments. Each line has its own method, amount and Charge button, and shows Paid when done." },
  { title: "One snackbar system", body: "Success, info, warning and error snackbars in two sizes, with or without a title and close button: 32 variants from one component." },
  { title: "Onboarding in small steps", body: "Register, pick a shop, pick or create a POS, done. Inline validation shows problems as you type, and toasts cover server errors." },
];

const paymentScenarios = [
  { n: "01", title: "Cash", body: "The total is pre-filled and four quick amounts sit underneath. Confirm Cash shows the change due before the drawer opens.", file: "t-pay-confirm-cash" },
  { n: "02", title: "Change due", body: "After confirming, the change amount is the largest thing on screen, so the cashier never has to work it out.", file: "t-pay-change" },
  { n: "03", title: "Card + surcharge", body: "Selecting Card shows the surcharge as a line the customer can see, with a checkbox to waive it before Confirm Card.", file: "t-pay-card-surcharge" },
  { n: "04", title: "Dual price", body: "Shops with two price lists see both totals side by side, so the right one is charged every time.", file: "t-pay-dual-price" },
  { n: "05", title: "Manual rounding", body: "A small dialog shows the total and the rounded amount, with Reset and Apply. Closing totals stay exact.", file: "t-pay-rounding" },
  { n: "06", title: "Alternative currency", body: "Switch the amount due to another currency, like USD for tourists, without leaving the payment screen.", file: "t-pay-alt-currency" },
  { n: "07", title: "Receipt & new sale", body: "Points earned, email or print the receipt, then one big New Sale button back to the till.", file: "t-receipt-sent" },
];

const splitScreens: Screen[] = [
  tab("t-split-start", "Start split", "Split is one tap from the payment header."),
  tab("t-split-edit", "Set payments", "Plus and minus set the number of payments; each line gets a method and amount."),
  tab("t-split-dual", "Split with dual price", "Both price totals stay visible while each part is paid."),
  tab("t-split-done", "All paid", "Every line shows Paid with a check before moving on."),
];

const onboardingPhones: Screen[] = [
  phone("m-splash", "Splash", "Brand mark and a friendly message if the device date or network is wrong."),
  phone("m-welcome", "Welcome", "Two clear choices: Registration or Sign in."),
  phone("m-create-validation", "Registration", "Inline validation on every field, with the country pre-selected."),
  phone("m-create-toast", "Server error", "A toast for problems the form can’t catch, like unaccepted terms."),
  phone("m-sign-in", "Sign in", "Email and password with show/hide and Forgot password."),
  phone("m-select-terminal", "Select shop & terminal", "Pick the shop, then the terminal. A snackbar flags a weak connection."),
];

const onboardingTablets: Screen[] = [
  tab("t-shop-info", "Existing POS", "Reconnect a tablet to a POS that already exists."),
  tab("t-create-pos-shop", "Create POS · select shop", "Choose which shop the new terminal belongs to."),
  tab("t-create-pos", "Create POS · name it", "One field and Save. That’s the whole step."),
  tab("t-register-success", "Registered", "A clear confirmation that the account email is on its way."),
];

const boards: (Screen & { fit?: boolean })[] = [
  { file: "board-landscape", title: "Landscape sign-in & setup flow", note: "Three tablet flows end to end: Add POS, Replace POS and Forgot password.", w: 3880, h: 2626, fit: true },
  { file: "board-portrait-signin", title: "Portrait sign-in flow", note: "Phone sign-in, validation and shop selection states.", w: 2813, h: 2964, fit: true },
  { file: "board-portrait-register", title: "Portrait registration", note: "Phone registration with all error states.", w: 2944, h: 1366, fit: true },
  { file: "board-landscape-register", title: "Landscape registration", note: "Tablet registration from start to success. Scroll sideways.", w: 3982, h: 508 },
];

const printerSteps = [
  {
    screen: tab("t-printer-empty", "1 · No printers yet", "An empty state that explains what’s missing, with one button: Setup now."),
    tag: "Empty state",
  },
  {
    screen: { file: "t-printer-add", title: "2 · Add printer", note: "Name, model and connection, then Search finds paired Bluetooth devices. Paper size, the key toggles and Test Print are on the same screen.", w: 1280, h: 1144 },
    tag: "Connect",
  },
  {
    screen: { file: "t-printer-receipt", title: "3 · What it prints", note: "Toggles grouped by job: receipts & bills, KOT/BOT for the kitchen and bar, and printer groups. Each group only opens when its main switch is on.", w: 1280, h: 1521 },
    tag: "Configure",
  },
  {
    screen: { file: "t-printer-advanced", title: "4 · Advanced settings", note: "Print mode, extra space at the receipt edge, paper size and drawer ESC/POS commands, kept out of the way.", w: 1280, h: 819 },
    tag: "Fine-tune",
  },
];

const errorScreens: Screen[] = [
  tab("t-pay-error", "Offline while paying", "The payment screen dims and a snackbar explains what to check."),
  tab("t-pay-disabled", "Card unavailable", "Methods that can’t be used right now are disabled, not hidden."),
];

const mobileScreens: Screen[] = [
  phone("m-pay", "Payment", "Total, cash received, Card and Other in one column.", 440, 956),
  phone("m-pay-surcharge", "Card + surcharge", "Confirm Card with the surcharge shown and a waive checkbox.", 440, 956),
  phone("m-pay-rounding", "Manual rounding", "Total, rounded amount and Apply in a compact dialog.", 440, 956),
  phone("m-pay-alt-currency", "Alternative currency", "Rupee, Dollar, Pound or Euro in one list.", 440, 956),
  phone("m-pay-snackbar", "Offline snackbar", "The same snackbar system, sized for phones.", 440, 956),
  phone("m-split", "Split", "Three payments, each with its own Charge button."),
  phone("m-split-paid", "Split in progress", "Paid lines are ticked; the remaining amount updates live."),
  phone("m-split-summary", "Payment summary", "Optional email for the receipt, then Complete."),
  phone("m-new-sale", "New sale", "Points earned, print receipt and New Sale."),
  phone("m-select-pos", "Select shop", "The phone version of POS setup."),
];

const palette = [
  { name: "SalesPlay Blue", hex: "#007AFF", use: "App bar, primary actions", dark: true },
  { name: "Deep Blue", hex: "#0A4FA3", use: "Pressed & status bar", dark: true },
  { name: "Error Red", hex: "#EC5454", use: "Validation & error toasts", dark: true },
  { name: "Snackbar", hex: "#363B4B", use: "Snackbar surface", dark: true },
  { name: "Ink", hex: "#1F2329", use: "Totals & body text", dark: true },
  { name: "White", hex: "#FFFFFF", use: "Ticket & payment panels" },
];

const outcomes = [
  { value: "7", label: "Payment scenarios", sub: "Cash, change, surcharge, dual price, rounding, currency and split" },
  { value: "32", label: "Snackbar variants", sub: "4 types × 2 sizes × title × dismissable, from one component" },
  { value: "40+", label: "Screens & flow boards", sub: "Tablet landscape, phone portrait and onboarding boards" },
];

const sitemap = [
  { title: "Onboarding", items: ["Splash", "Welcome", "Registration", "Sign in", "Select shop & terminal", "Create POS"] },
  { title: "Sell", items: ["Ticket", "Products & search", "Customers", "Discounts", "Delivery / dine-in"] },
  { title: "Payment", items: ["Cash & quick amounts", "Card & surcharge", "Other methods", "Split payment", "Rounding & currency"] },
  { title: "After sale", items: ["Payment summary", "Email / print receipt", "Points earned", "New sale"] },
  { title: "Settings", items: ["Printers", "Software customization", "Reports", "Shop & POS"] },
];

/* ---------- User flow diagram (SVG) ---------- */

type FlowKind = "start" | "step" | "cta" | "decision" | "end";
type FlowNode = { id: string; x: number; y: number; label: string; sub?: string; kind?: FlowKind };
type FlowEdge = { from: string; to: string; label?: string; route?: "over" };

const NODE_W = 160;
const NODE_H = 62;
const DIA = 46;

const lanes = [
  { label: "01 · Ticket", top: 0 },
  { label: "02 · Payment", top: 190 },
  { label: "03 · Close the sale", top: 380 },
];

const flowNodes: FlowNode[] = [
  { id: "ticket", x: 130, y: 95, label: "Build ticket", sub: "Items, qty, customer", kind: "start" },
  { id: "charge", x: 330, y: 95, label: "Charge", sub: "Total due shown", kind: "cta" },
  { id: "d0", x: 520, y: 95, label: "Split?", kind: "decision" },
  { id: "split", x: 720, y: 95, label: "Split payment", sub: "± payments, each line" },
  { id: "d1", x: 130, y: 285, label: "Method?", kind: "decision" },
  { id: "cash", x: 330, y: 285, label: "Cash", sub: "Quick amounts" },
  { id: "card", x: 530, y: 285, label: "Card", sub: "Surcharge shown" },
  { id: "rules", x: 730, y: 285, label: "Rules", sub: "Dual · round · FX" },
  { id: "confirm", x: 930, y: 285, label: "Confirm", sub: "Cash or card" },
  { id: "change", x: 130, y: 475, label: "Change due", sub: "Largest on screen" },
  { id: "summary", x: 330, y: 475, label: "Payment summary", sub: "Points earned" },
  { id: "d2", x: 520, y: 475, label: "Receipt?", kind: "decision" },
  { id: "send", x: 710, y: 475, label: "Email / print", sub: "Optional" },
  { id: "new", x: 920, y: 475, label: "New sale", sub: "Back to the till", kind: "end" },
];

const flowEdges: FlowEdge[] = [
  { from: "ticket", to: "charge" },
  { from: "charge", to: "d0" },
  { from: "d0", to: "split", label: "Yes" },
  { from: "d0", to: "d1", label: "No" },
  { from: "d1", to: "cash", label: "Cash" },
  { from: "d1", to: "card", label: "Card", route: "over" },
  { from: "cash", to: "card" },
  { from: "card", to: "rules" },
  { from: "rules", to: "confirm" },
  { from: "confirm", to: "change" },
  { from: "change", to: "summary" },
  { from: "summary", to: "d2" },
  { from: "d2", to: "send", label: "Yes" },
  { from: "d2", to: "new", label: "No", route: "over" },
  { from: "send", to: "new" },
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
    <div className="igc-flow" role="img" aria-label="Checkout flow: build the ticket, charge, optionally split, pick a payment method with surcharge or pricing rules, confirm, show change, then the payment summary, optional receipt and a new sale.">
      <svg viewBox="0 0 1240 570" className="igc-flow__svg">
        <defs>
          <marker id="spx-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
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
              <path d={g.d} className="igc-flow__edge" markerEnd="url(#spx-arrow)" />
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

function SitemapDiagram() {
  return (
    <div className="igc-ia" role="img" aria-label="App map: Onboarding, Sell, Payment, After sale and Settings.">
      <div className="igc-ia__root">
        <span className="e-mono">Root</span>
        SalesPlay POS
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

/* ---------- Frames ---------- */

function Tablet({ screen, label }: { screen: Screen; label?: "before" | "after" }) {
  return (
    <figure className="sp-tablet">
      <div className="sp-tablet__frame">
        <Image src={`${IMG}/${screen.file}.webp`} alt={`${screen.title} screen`} width={screen.w} height={screen.h} unoptimized />
      </div>
      {(screen.note || label) && (
        <figcaption>
          <div>
            <strong>{screen.title}</strong>
            {screen.note && <p>{screen.note}</p>}
          </div>
          {label && <b className={`bbx-label is-${label}`}>{label}</b>}
        </figcaption>
      )}
    </figure>
  );
}

function Phone({ screen }: { screen: Screen }) {
  return (
    <div className="igc-phone__frame">
      <div className="igc-phone__screen" tabIndex={0} aria-label={`${screen.title} phone screen`}>
        <Image src={`${IMG}/${screen.file}.webp`} alt={`${screen.title} phone screen`} width={screen.w} height={screen.h} unoptimized />
      </div>
    </div>
  );
}

function Board({ board }: { board: (typeof boards)[number] }) {
  return (
    <figure className={`igc-browser sp-board${board.fit ? " is-fit" : ""}`}>
      <div className="igc-browser__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>Figma · Sign-in Process</em>
      </div>
      <div className="igc-browser__view" tabIndex={0} aria-label={`${board.title}, scroll to explore`}>
        <Image src={`${IMG}/${board.file}.webp`} alt={board.title} width={board.w} height={board.h} unoptimized />
      </div>
      <figcaption>
        <div>
          <strong>{board.title}</strong>
          <p>{board.note}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/* ---------- Page ---------- */

export default function SalesPlayCaseStudy() {
  const { setActiveSection } = useActiveSectionContext();
  const [scenario, setScenario] = useState(0);
  const [board, setBoard] = useState(0);

  useEffect(() => setActiveSection("Projects"), [setActiveSection]);

  const pay = paymentScenarios[scenario];

  return (
    <main className="e-main igc spx">
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
                lines={[{ text: "SalesPlay POS", block: true }, { text: "Revamp", className: "is-soft", block: true }]}
              />
              <Reveal delay={1} as="p" className="e-lead mt-6">
                I worked across SalesPlay’s web, Android, and iOS products, including its web POS and Back Office ERP. This case study
                focuses on redesigning the Android point of sale, used by more than 100,000 businesses, to make checkout faster and more
                reliable on a tablet or phone.
              </Reveal>
              <Reveal delay={2} className="igc-chips">
                <span>POS</span>
                <span>Web POS</span>
                <span>Back Office ERP</span>
                <span>Android & iOS</span>
                <span>Payments</span>
                <span>Onboarding</span>
                <span>Design system</span>
              </Reveal>
              <Reveal delay={2} className="mt-7">
                <ArrowButton variant="white" href="https://salesplay.com/" target="_blank" rel="noopener noreferrer">
                  Visit salesplay.com
                </ArrowButton>
              </Reveal>
            </div>
            <Reveal delay={2} className="igc-hero__meta">
              <dl>
                <div>
                  <dt className="e-mono">My role</dt>
                  <dd>UI/UX design · UX research · Front-end implementation</dd>
                </div>
                <div>
                  <dt className="e-mono">Platform</dt>
                  <dd>Web POS and Back Office ERP · Android and iOS POS</dd>
                </div>
                <div>
                  <dt className="e-mono">Tools</dt>
                  <dd>Figma · Material Design · Jetpack Compose</dd>
                </div>
                <div>
                  <dt className="e-mono">AI tools</dt>
                  <dd>Claude Code · Figma MCP</dd>
                </div>
                <div>
                  <dt className="e-mono">Scope</dt>
                  <dd>Web POS, Back Office ERP, onboarding, payments, split checkout, printer setup, and error states</dd>
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
            <SplitHeading className="igc-h2" lines={[{ text: "The queue doesn’t", block: true }, { text: "wait for the POS", className: "is-soft", block: true }]} />
          </div>
          <div className="igc-prose">
            <Reveal as="p">
              SalesPlay is a free, cloud-based POS for restaurants, retail, groceries and salons in more than 100 countries. It runs on
              Android tablets, phones and POS terminals, even offline. The product does a lot, but the payment screen hadn’t kept up with how
              merchants actually take money: card surcharges, two price lists, cash rounding, tourists paying in dollars, and tables that
              split the bill.
            </Reveal>
            <Reveal as="p" delay={1}>
              I redesigned the checkout and the first-run experience: research, flows, a Material-based UI kit, tablet and phone screens,
              and a snackbar system for errors. The brief was to <strong>make every payment faster, harder to get wrong, and ready for the
              rules merchants already use</strong>.
            </Reveal>
            <Reveal delay={2} className="igc-goals">
              <div>
                <span className="e-mono">Goal 01</span>
                <p>Fewer taps for the most common sales</p>
              </div>
              <div>
                <span className="e-mono">Goal 02</span>
                <p>No accidental or wrong charges</p>
              </div>
              <div>
                <span className="e-mono">Goal 03</span>
                <p>Onboarding a new terminal in minutes</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">02 · The problem</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "What the audit", block: true }, { text: "turned up", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            I reviewed the current app screen by screen, watched how cashiers used it at the counter, and went through support tickets about
            payments. Six problems kept coming up.
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
          <SplitHeading className="igc-h2" lines={[{ text: "The payment screen,", block: true }, { text: "side by side", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The left image is the current app, as shown on its Play Store listing. The right is the redesign.
          </Reveal>
          <div className="sp-tablets mt-10">
            <Reveal>
              <Tablet screen={{ file: "old-payment", title: "Current app", note: "Method tabs, a number pad and a single CHARGE button.", w: 1351, h: 1000 }} label="before" />
            </Reveal>
            <Reveal delay={1}>
              <Tablet screen={tab("t-pay-default", "Redesign", "Pre-filled cash, quick amounts, and big Card and Other buttons.")} label="after" />
            </Reveal>
          </div>
          <div className="bbx-notes">
            <div>
              <p className="e-mono">Before</p>
              <ul>
                <li>Cash, Card and Credit hidden in small tabs</li>
                <li>Every amount typed on a keypad</li>
                <li>One CHARGE button for every method, with no confirm</li>
              </ul>
            </div>
            <div className="is-after">
              <p className="e-mono">After</p>
              <ul>
                <li>Every method visible at once, as a full-width button</li>
                <li>The total is pre-filled, with four quick cash amounts</li>
                <li>Confirm Cash and Confirm Card, then the change due in large type</li>
              </ul>
            </div>
          </div>
          <Reveal className="mt-12">
            <p className="e-mono igc-eyebrow">The current app today</p>
          </Reveal>
          <div className="sp-old">
            {oldApp.map((s) => (
              <figure key={s.file}>
                <Image src={`${IMG}/${s.file}.webp`} alt={`Current SalesPlay app: ${s.title}`} width={s.w} height={s.h} unoptimized />
                <figcaption>{s.title}</figcaption>
              </figure>
            ))}
          </div>
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
          <SplitHeading className="igc-h2" lines={[{ text: "The cashier", block: true }, { text: "and the owner", className: "is-soft", block: true }]} />
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
          <SplitHeading className="igc-h2" lines={[{ text: "An app map built", block: true }, { text: "around the sale", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Payment became its own branch with every method and rule in one place. Getting a new device ready is a short onboarding branch
            that ends at the till.
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
          <SplitHeading className="igc-h2" lines={[{ text: "From ticket", block: true }, { text: "to new sale", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Three phases and three decisions. Rules like surcharge, dual price, rounding and currency sit inside the payment phase, so the
            cashier never has to leave it.
          </Reveal>
          <Reveal delay={1} className="mt-12">
            <UserFlowDiagram />
            <p className="igc-scroll-hint e-hand" aria-hidden="true">
              swipe the diagram →
            </p>
          </Reveal>
        </div>
      </section>

      {/* Onboarding */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">08 · Onboarding</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Ready to sell", block: true }, { text: "in minutes", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Registration, sign-in and terminal setup were mapped as full flow boards for portrait phones and landscape tablets, including
            every error state. Fields validate as you type, and server problems show as toasts or snackbars.
          </Reveal>
          <div className="igc-tabs mt-10" role="tablist" aria-label="Flow boards">
            {boards.map((b, i) => (
              <button key={b.file} type="button" role="tab" aria-selected={i === board} onClick={() => setBoard(i)}>
                {b.title}
              </button>
            ))}
          </div>
          <div className="mt-8" role="tabpanel" aria-label={boards[board].title}>
            <Board key={boards[board].file} board={boards[board]} />
          </div>
          <div className="sp-phone-row sp-phones-light mt-12">
            {onboardingPhones.map((s, i) => (
              <Reveal key={s.file} delay={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4} as="figure" className="igc-phone">
                <Phone screen={s} />
                <figcaption>
                  <strong>{s.title}</strong>
                  <p>{s.note}</p>
                </figcaption>
              </Reveal>
            ))}
          </div>
          <div className="sp-tablets mt-12">
            {onboardingTablets.map((s, i) => (
              <Reveal key={s.file} delay={(i % 2) as 0 | 1}>
                <Tablet screen={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Key decisions */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">09 · Key UX decisions</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Six moves that", block: true }, { text: "speed up the counter", className: "is-soft", block: true }]} />
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

      {/* Payment explorer */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">10 · The hero flow</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "One payment screen,", block: true }, { text: "every real-world rule", className: "is-soft", block: true }]} />
          <div className="igc-wizard mt-12">
            <div className="igc-wizard__steps" role="tablist" aria-label="Payment scenarios">
              {paymentScenarios.map((s, i) => (
                <button key={s.n} type="button" role="tab" aria-selected={i === scenario} className="igc-wizard__step" onClick={() => setScenario(i)}>
                  <span className="igc-wizard__n">{s.n}</span>
                  <span>
                    <strong>{s.title}</strong>
                    {i === scenario && <span className="igc-wizard__body">{s.body}</span>}
                  </span>
                </button>
              ))}
            </div>
            <div className="igc-wizard__shot" role="tabpanel" aria-label={pay.title}>
              <Image key={pay.file} src={`${IMG}/${pay.file}.webp`} alt={`Payment scenario: ${pay.title}`} width={1280} height={800} unoptimized />
            </div>
          </div>
        </div>
      </section>

      {/* Split payment */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">11 · Split payment</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Split the bill,", block: true }, { text: "not the cashier’s focus", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Tables that pay separately were the slowest moment in a restaurant shift. The new split view sets the number of payments with
            plus and minus, then each line gets its own method, amount and Charge button. Paid lines tick off, and the remaining amount
            updates live.
          </Reveal>
          <div className="sp-tablets mt-12">
            {splitScreens.map((s, i) => (
              <Reveal key={s.file} delay={(i % 2) as 0 | 1}>
                <Tablet screen={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Printer setup */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">12 · Printer setup</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Receipt printer", block: true }, { text: "ready in four steps", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Printing used to be a support call: a long settings list, technical terms and no way to check the result. The new setup starts
            from a friendly empty state, finds paired Bluetooth printers with one Search, and groups options by job. Receipts, kitchen and
            bar tickets (KOT/BOT) and printer groups each have their own block. Technical settings move to an Advanced screen, and Test Print
            is always one tap away.
          </Reveal>
          <div className="sp-tablets sp-printer mt-12">
            {printerSteps.map((p, i) => (
              <Reveal key={p.screen.file} delay={(i % 2) as 0 | 1}>
                <span className="e-mono sp-printer__tag">{p.tag}</span>
                <Tablet screen={p.screen} />
              </Reveal>
            ))}
          </div>
          <div className="bbx-notes sp-printer__notes">
            <div>
              <p className="e-mono">Before</p>
              <ul>
                <li>One long list of printer settings</li>
                <li>Technical options mixed with everyday ones</li>
                <li>No quick way to check that it works</li>
              </ul>
            </div>
            <div className="is-after">
              <p className="e-mono">After</p>
              <ul>
                <li>Empty state → Add printer → options → advanced</li>
                <li>Toggles grouped by job, with info icons for each one</li>
                <li>Test Print and Delete printer at the bottom of every printer</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Errors & feedback */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">13 · Errors & feedback</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Clear when things", block: true }, { text: "go wrong", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            A POS can’t fail quietly. I designed one snackbar component with four types (success, info, warning and error), two sizes, and
            optional title and close button: 32 variants. Dialogs and disabled states cover the rest.
          </Reveal>
          <div className="sp-tablets mt-12">
            {errorScreens.map((s, i) => (
              <Reveal key={s.file} delay={i as 0 | 1}>
                <Tablet screen={s} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <figure className="sp-tablet">
              <div className="sp-tablet__frame" style={{ background: "#fff" }}>
                <Image src={`${IMG}/snackbars.webp`} alt="Snackbar component: success, info, warning and error in big and small sizes, with and without a title" width={1820} height={1489} unoptimized />
              </div>
              <figcaption>
                <div>
                  <strong>Snackbar component</strong>
                  <p>4 types × 2 sizes × title × dismissable, plus an action variant.</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Phone UI */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">14 · Final UI · phone</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "The same checkout,", block: true }, { text: "in one hand", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Food trucks, market stalls and delivery riders sell from a phone. The tablet’s two panels fold into one column, the total stays
            at the top, and every action button is full-width.
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

      {/* UI kit */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">15 · UI kit</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Material at heart,", block: true }, { text: "SalesPlay in tone", className: "is-soft", block: true }]} />
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
              <p className="e-mono">Typeface · Roboto</p>
              <p className="igc-ds__aa">Aa</p>
              <div className="igc-ds__scale">
                <span style={{ fontSize: "2rem", fontWeight: 600 }}>USD 1,856</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 500 }}>Total amount due</span>
                <span style={{ fontSize: "1rem", fontWeight: 500 }}>CONFIRM CASH · CARD · OTHER</span>
                <span style={{ fontSize: "0.85rem" }}>Please check your internet connection.</span>
              </div>
            </Reveal>
            <Reveal delay={2} className="igc-ds__components">
              <p className="e-mono">Components</p>
              <div className="igc-ds__demo">
                <span className="igc-btn">Confirm cash</span>
                <span className="igc-btn is-ghost">Card</span>
              </div>
              <div className="igc-ds__demo">
                <span className="igc-chip">1,860</span>
                <span className="igc-chip is-on">1,960</span>
                <span className="igc-chip">2,000</span>
                <span className="igc-qty" aria-hidden="true">
                  <em>−</em>2<em>+</em>
                </span>
              </div>
              <div className="sp-snack" aria-hidden="true">
                <span className="is-success">Payment complete</span>
                <span className="is-error">
                  Please check your internet connection <em>✕</em>
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FrontendBuild data={frontendBuilds["10"]} index="16 · Front-end development" />

      {/* Outcome */}
      <section data-ground="blue" className="igc-results e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">17 · Outcome</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "A checkout that", block: true }, { text: "keeps the queue moving", className: "is-soft", block: true }]} />
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
                <li>At a counter, a pre-filled field and four buttons beat any keypad. Cashiers notice saved taps immediately.</li>
                <li>Merchants already had rules (surcharges, two price lists, rounding). The UI’s job was to give each one a home.</li>
                <li>Error design is part of the main flow. A clear snackbar saves a refund later.</li>
              </ul>
            </Reveal>
            <Reveal delay={1} className="igc-learn">
              <p className="e-mono">What’s next</p>
              <ul>
                <li>The redesigned sale screen and product grid</li>
                <li>The KOT kitchen display in the same system</li>
                <li>Reports and the owner dashboard app</li>
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
    </main>
  );
}
