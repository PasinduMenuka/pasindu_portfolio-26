"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CountUp, HandTag, Reveal, SplitHeading } from "@/components/motion/reveal";
import ArrowButton from "@/components/arrow-button";
import { useActiveSectionContext } from "@/context/active-section-context";
import FrontendBuild from "@/components/case-studies/frontend-build";
import { frontendBuilds } from "@/lib/frontend-builds";

// "old-*" screens come from the previous dashboard design (the "UI Design.Old" page in Figma);
// every other screen is the redesign. All are pre-compressed WebP.
const IMG = "/projects/ses-portal";

type Screen = { file: string; title: string; note: string; w: number; h: number };

const s = (file: string, title: string, note: string, h = 895, w = 1553): Screen => ({ file, title, note, w, h });

/* ---------- Content ---------- */

const research = [
  { title: "Stakeholder interviews", body: "25+ facility managers, energy analysts and operations teams across multi-site businesses." },
  { title: "Workflow analysis", body: "Mapped how HVAC monitoring, incident tracking and maintenance actually ran day to day." },
  { title: "Pain point audit", body: "Walked every screen of the old dashboard and logged where people slowed down or made mistakes." },
  { title: "Competitive review", body: "Honeywell Forge, Johnson Controls, Schneider Electric and BuildingOS for enterprise dashboard patterns." },
];

const auditFindings = [
  { title: "Too much data, no priority", body: "Every unit, sensor and alert had the same weight. Operators couldn’t tell a critical fault from a normal reading." },
  { title: "Engineering-first screens", body: "Unit pages showed raw DLC settings, uplink logs and register values, built for the firmware team and not for facility managers." },
  { title: "Buried P1 incidents", body: "Critical alerts sat in flat, unsorted tables, so the most urgent problems were the easiest to miss." },
  { title: "Slow site-to-site navigation", body: "Jumping between 100+ sites meant going back to a list every time, which slowed incident tracking." },
  { title: "Risky manual control", body: "Temperature changes had no duration, no confirmation and no feedback while the device applied them." },
  { title: "Complex configuration", body: "Creating a site, zones and devices was one long form, so new operators made setup errors." },
];

const comparisons: { id: string; label: string; before: Screen; after: Screen; was: string[]; now: string[] }[] = [
  {
    id: "summary",
    label: "Site summary",
    before: s("old-site-summary", "Site summary · before", "", 1375, 1534),
    after: s("site-summary", "Site summary · after", "", 1368, 1556),
    was: ["Weather, units and badges in one dense row", "Filters spread across the header", "Hard to scan 100+ sites"],
    now: ["One row per site with Offline, P1, P2, Work order and Incident counts", "Quick filter chips for status and P-level", "Export and Create Site in one place"],
  },
  {
    id: "units",
    label: "Units",
    before: s("old-units", "Units · before", "", 949, 1534),
    after: s("site-units", "Units · after", "", 1305, 1553),
    was: ["Site list hidden behind a back button", "Red rows with no explanation", "Actions as tiny icons"],
    now: ["All sites stay in a left rail with P1/P2 badges", "Live weather, power and energy saved in the header", "Clear status, set point and work-order columns"],
  },
  {
    id: "control",
    label: "Unit control",
    before: s("old-dlc3-unit", "DLC 3 unit settings · before", "", 1020, 1551),
    after: s("override-duration", "Temperature override · after", "", 885),
    was: ["Raw DLC 3 registers and modes", "Arrows to nudge a set point", "No duration or confirmation"],
    now: ["One Temperature Override dialog", "Pick a duration: 1 hour to 20 minutes", "Apply shows an Applying… state on the row"],
  },
  {
    id: "devices",
    label: "Devices",
    before: s("old-device-zones", "Devices & zones · before", "", 972),
    after: s("devices", "Devices · after", "", 961),
    was: ["Device actions as a row of coloured buttons", "Zones and devices mixed in one table", "Technical IDs everywhere"],
    now: ["Zones, Devices and Gateways as tabs", "Search, type and zone filters", "Device name first, technical IDs second"],
  },
  {
    id: "roles",
    label: "Roles",
    before: s("old-add-roles", "Add role · before", "", 895),
    after: s("role-add", "Add role · after", "", 903),
    was: ["Permissions picked from a dropdown", "No view of what a role can do"],
    now: ["A permissions matrix: view, create, update, delete, execute, send, receive", "Duplicate a role to start from an existing one"],
  },
];

const personas = [
  {
    name: "Sarah Martinez",
    role: "Facility operations manager, 45",
    quote: "I need to monitor 100+ sites at a glance and instantly see which ones need attention.",
    goals: ["Real-time system health", "Critical alerts that stand out", "Faster decisions"],
    pains: ["Too much data, no priority", "Slow incident tracking", "Manual HVAC monitoring"],
  },
  {
    name: "James Lee",
    role: "Energy analyst, 35",
    quote: "I want to track energy trends and stop demand spikes before they happen.",
    goals: ["Cut energy costs", "Prevent demand spikes", "Track every asset"],
    pains: ["Limited chart interaction", "No proactive control", "Metrics hard to compare"],
  },
];

const process = [
  { title: "Discover", sub: "Research & audit", items: ["25+ stakeholder interviews", "Workflow mapping", "Audit of the old dashboard"] },
  { title: "Define", sub: "Priorities", items: ["Two primary personas", "Severity model: P1, P2, WO", "Module map of 7 areas"] },
  { title: "Design", sub: "Flows & UI", items: ["Information architecture", "Guided wizards", "Slate Mono design system"] },
  { title: "Validate", sub: "Usability tests", items: ["12 facility managers", "8 first-time operators", "10 HVAC technicians"] },
  { title: "Deliver", sub: "Build & handoff", items: ["58 redesigned screens", "80+ components", "Next.js front end"] },
];

const sitemap = [
  { title: "Monitor", items: ["Site View", "Site summary", "Notifications", "Battery monitor"] },
  { title: "Site", items: ["HVAC units", "Refrigerators", "Smart sockets", "Generators", "Temperature override"] },
  { title: "Incidents", items: ["Incident list", "Incident detail", "Work orders", "Activity timeline"] },
  { title: "Setup", items: ["Create site wizard", "Vendors", "Zones", "Devices & gateways", "Advanced settings"] },
  { title: "Admin", items: ["Roles & permissions", "Users", "Invitations", "Customers", "Audit log"] },
];

const decisions = [
  { title: "Severity before everything", body: "One colour language across the product: red for P1, amber for P2, blue for work orders and teal for healthy. Operators find the problem before they read a word." },
  { title: "Sites always in reach", body: "A persistent left rail lists every site with its P1 and P2 badges, so moving between sites never means going back to a list." },
  { title: "Safe remote control", body: "Temperature overrides use a dialog with a duration and a clear Apply. The row then shows Applying… until the device confirms." },
  { title: "One pattern for every device", body: "HVAC, refrigerators, smart sockets and generators share the same tabs, tables, add dialogs and trend charts." },
  { title: "Guided setup", body: "Creating a site is a 4-step wizard: details, configuration, facility team and business hours. Vendors can be created without leaving it." },
  { title: "Progressive disclosure", body: "Technical settings like DLC registers and uplinks move to Advanced Settings. The default view shows what a manager needs." },
];

const controlSteps = [
  { n: "01", title: "Spot the problem", body: "The unit table shows status, zone temperature, set point, supply air and work orders. A P1 row is highlighted in red.", file: "site-units", h: 1305 },
  { n: "02", title: "Open override", body: "Temperature Override opens over the table, with the current set point already filled in.", file: "override-dialog", h: 1159 },
  { n: "03", title: "Choose a duration", body: "Pick how long the override lasts. When time runs out, the unit goes back to its schedule, so nothing is left on by mistake.", file: "override-duration", h: 885 },
  { n: "04", title: "See it apply", body: "The row turns amber with Applying… until the device confirms, so the operator knows the command was received.", file: "override-applying", h: 1151 },
];

const wizardSteps = [
  { n: "01", title: "Site details", body: "Customer, nickname, contact, time zone and address, grouped in the order people think about them.", file: "wizard-1", h: 1033 },
  { n: "02", title: "Site configuration", body: "Platform type, install type, gateway and network settings, with notes in a rich-text field.", file: "wizard-2", h: 1078 },
  { n: "03", title: "Facility team", body: "Pick vendors from a searchable table, or create a new vendor in a dialog without losing progress.", file: "wizard-3-selected", h: 1486 },
  { n: "04", title: "Business hours", body: "Default hours per weekday, so schedules and alerts know when the building is in use.", file: "wizard-4-hours", h: 930 },
  { n: "05", title: "New vendor", body: "Vendor details and contacts in one dialog, opened from step 3.", file: "vendor-create", h: 885 },
];

const deviceTypes = [
  {
    id: "fridge",
    label: "Refrigerators",
    body: "Temperature, humidity and battery for every fridge and cold room, a trend chart with thresholds, and email or SMS alerts when a unit drifts.",
    screens: [s("fridge-trend", "Temperature trend", "Temperature and humidity over time, with thresholds marked.", 1075), s("fridge-config", "Fridge configuration", "Upper and lower thresholds, buffers and who gets notified.", 1136)],
  },
  {
    id: "socket",
    label: "Smart sockets",
    body: "Turn plugged-in equipment on and off, schedule it around business hours, and see energy use by day, week or month.",
    screens: [s("socket-schedule", "Schedule settings", "Turn-on and turn-off times with a live preview.", 885), s("socket-energy", "Energy use", "Daily consumption, cost and runtime for one socket.", 1095)],
  },
  {
    id: "generator",
    label: "Generators",
    body: "Backup power on the same pattern: a list with temperature and humidity readings, and an Add Generator dialog.",
    screens: [s("generators", "Generators", "Each generator with its latest readings.", 877), s("generator-add", "Add generator", "The same add-device dialog pattern.", 885)],
  },
  {
    id: "battery",
    label: "Battery monitor",
    body: "Every battery-powered sensor in one table, with Normal, Low and Critical counts at the top so replacements can be planned.",
    screens: [s("battery", "Battery monitor", "Battery level, last seen and prediction for every device.", 1071), s("notifications", "Notifications", "Every email and SMS sent, with status and template.", 885)],
  },
];

const screenGroups: { id: string; label: string; screens: Screen[] }[] = [
  {
    id: "monitor",
    label: "Monitor",
    screens: [
      s("site-view", "Site View", "KPIs, the issue donut, 7-day system metrics and P1/P2/WO status cards.", 2400, 1302),
      s("site-summary", "Site summary", "Every site with its offline, P1, P2, work-order and incident counts.", 1368, 1556),
      s("notifications", "Notifications", "A searchable log of every alert sent.", 885),
      s("battery", "Battery monitor", "Normal, low and critical battery counts and a device table.", 1071),
    ],
  },
  {
    id: "control",
    label: "HVAC control",
    screens: [
      s("site-units", "HVAC units", "Live unit table with status, temperatures and work orders.", 1305),
      s("unit-selected", "Unit selected", "The selected unit stays highlighted while you act on it.", 1151),
      s("override-dialog", "Override (off)", "Override switched off, with the current set point.", 1159),
      s("override-applying", "Applying", "The amber Applying… state on the row.", 1151),
    ],
  },
  {
    id: "incidents",
    label: "Incidents",
    screens: [
      s("incidents", "Incidents", "Totals by P-level, in-progress, resolved and late responses, with filters.", 1984),
      s("incidents-filtered", "Active filters", "Filters show as chips you can clear one by one.", 2049),
      s("incident-detail", "Incident detail", "Details, attachments, comments and an activity timeline.", 871),
      s("work-order-create", "Create work order", "A work order from the incident, with location and recipients.", 899),
      s("incident-work-order", "Incident + work order", "The work order sits next to the incident it came from.", 867),
    ],
  },
  {
    id: "setup",
    label: "Sites & devices",
    screens: [
      s("zones", "Zones", "The zones of a site, with search and quick actions.", 887),
      s("zone-add", "Add zone", "One field and Add.", 903),
      s("devices", "Devices", "Devices by type and zone, with status and profile.", 961),
      s("device-add-gateway", "Add device", "Device details, with gateway settings when needed.", 1373),
      s("gateways", "Gateways", "Gateways with their online state and last update.", 905),
      s("site-advanced", "Advanced settings", "Technical settings, moved out of the main view.", 1049),
      s("vendor-edit", "Edit vendor", "Vendor details and contacts.", 885),
    ],
  },
  {
    id: "devices",
    label: "Other devices",
    screens: [
      s("fridges", "Refrigerators", "Fridges and cold rooms with temperature, humidity and battery.", 1646),
      s("fridge-config-2", "Refrigerator configuration", "Thresholds and notifications per unit.", 1202),
      s("sockets", "Smart sockets", "Sockets with on/off state and energy today.", 1468),
      s("socket-add", "Add smart socket", "The shared add-device dialog.", 895),
    ],
  },
  {
    id: "admin",
    label: "Admin",
    screens: [
      s("roles", "Manage roles", "Roles with edit, duplicate and delete.", 877),
      s("role-duplicate", "Duplicate role", "Start a new role from an existing permission set.", 903),
      s("users", "Manage users", "Users with role, organisation and status.", 877),
      s("user-edit", "Edit user", "Role, organisation and sites as chips.", 895),
      s("invitations", "Invitations", "Pending invites with resend and delete.", 887),
      s("invite-user", "Invite user", "Name, email, organisation and role.", 895),
      s("customers", "Customers", "Customers with status and group.", 877),
      s("audit-log", "Audit log", "Who did what, when and where.", 877),
      s("audit-detail", "Audit log detail", "The full record, including IP address and source.", 885),
    ],
  },
];

const allScreens = screenGroups.flatMap((g) => g.screens);

const palette = [
  { name: "Teal", hex: "#069999", use: "Primary actions, healthy state", dark: true },
  { name: "Slate 900", hex: "#1A1D23", use: "Page background (dark)", dark: true },
  { name: "Slate 800", hex: "#23262D", use: "Cards & panels (dark)", dark: true },
  { name: "Critical", hex: "#FB2C36", use: "P1 incidents & errors", dark: true },
  { name: "Warning", hex: "#E5A800", use: "P2 incidents & applying" },
  { name: "Success", hex: "#10B981", use: "Online & positive trends", dark: true },
];

const results = [
  { value: "45%", label: "Faster task completion", sub: "Across monitoring, control and incident tasks" },
  { value: "60%", label: "Fewer user errors", sub: "Guided wizards and confirmed overrides" },
  { value: "3–5s", label: "To spot an anomaly", sub: "Measured in usability tests with 12 facility managers" },
];

/* ---------- User flow diagram (SVG) ---------- */

type FlowKind = "start" | "step" | "cta" | "decision" | "end";
type FlowNode = { id: string; x: number; y: number; label: string; sub?: string; kind?: FlowKind };
type FlowEdge = { from: string; to: string; label?: string; route?: "over" };

const NODE_W = 160;
const NODE_H = 62;
const DIA = 46;

const lanes = [
  { label: "01 · Notice", top: 0 },
  { label: "02 · Act", top: 190 },
  { label: "03 · Resolve", top: 380 },
];

const flowNodes: FlowNode[] = [
  { id: "view", x: 130, y: 95, label: "Site View", sub: "KPIs & P1/P2 cards", kind: "start" },
  { id: "p1", x: 330, y: 95, label: "P1 card", sub: "Filtered site list" },
  { id: "site", x: 530, y: 95, label: "Site", sub: "Sites rail + units" },
  { id: "unit", x: 730, y: 95, label: "Unit row", sub: "Status & set point", kind: "cta" },
  { id: "d1", x: 130, y: 285, label: "Fix remotely?", kind: "decision" },
  { id: "ovr", x: 330, y: 285, label: "Override", sub: "Set point + duration" },
  { id: "apply", x: 530, y: 285, label: "Applying…", sub: "Until device confirms" },
  { id: "d2", x: 720, y: 285, label: "Resolved?", kind: "decision" },
  { id: "inc", x: 130, y: 475, label: "Incident", sub: "Details & timeline" },
  { id: "wo", x: 330, y: 475, label: "Work order", sub: "Vendor notified" },
  { id: "track", x: 530, y: 475, label: "Track", sub: "Comments & status" },
  { id: "done", x: 730, y: 475, label: "Resolved", sub: "Logged in audit", kind: "end" },
];

const flowEdges: FlowEdge[] = [
  { from: "view", to: "p1" },
  { from: "p1", to: "site" },
  { from: "site", to: "unit" },
  { from: "unit", to: "d1" },
  { from: "d1", to: "ovr", label: "Yes" },
  { from: "ovr", to: "apply" },
  { from: "apply", to: "d2" },
  { from: "d2", to: "done", label: "Yes" },
  { from: "d1", to: "inc", label: "No" },
  { from: "inc", to: "wo" },
  { from: "wo", to: "track" },
  { from: "track", to: "done" },
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
  if (a.x === b.x) {
    // Straight down within the same column.
    return { d: `M${a.x} ${a.y + halfH(a)} V${b.y - halfH(b) - 4}`, lx: a.x + 26, ly: (a.y + b.y) / 2 };
  }
  // Wraps to the next lane along the lane boundary.
  const mid = (a.y + b.y) / 2;
  return { d: `M${a.x} ${a.y + halfH(a)} V${mid} H${b.x} V${b.y - halfH(b) - 4}`, lx: (a.x + b.x) / 2, ly: mid - 8 };
}

function UserFlowDiagram() {
  const byId = Object.fromEntries(flowNodes.map((n) => [n.id, n]));
  return (
    <div className="igc-flow" role="img" aria-label="Flow from noticing a P1 alert on Site View, to fixing a unit remotely with a temperature override, or raising an incident and work order, until it is resolved.">
      <svg viewBox="0 0 900 570" className="igc-flow__svg">
        <defs>
          <marker id="ses-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className="igc-flow__head" />
          </marker>
        </defs>
        {lanes.map((l, i) => (
          <g key={l.label}>
            <rect x="0" y={l.top} width="900" height="190" className={i % 2 ? "igc-flow__lane is-alt" : "igc-flow__lane"} />
            <text x="882" y={l.top + 20} textAnchor="end" className="igc-flow__lane-label">
              {l.label}
            </text>
          </g>
        ))}
        {flowEdges.map((e) => {
          const g = edgeGeometry(byId[e.from], byId[e.to], e.route);
          return (
            <g key={`${e.from}-${e.to}`}>
              <path d={g.d} className="igc-flow__edge" markerEnd="url(#ses-arrow)" />
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
    <div className="igc-ia" role="img" aria-label="Information architecture: Monitor, Site, Incidents, Setup and Admin.">
      <div className="igc-ia__root">
        <span className="e-mono">Root</span>
        SES Portal
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

function BrowserFrame({ screen, onOpen, label }: { screen: Screen; onOpen?: () => void; label?: "before" | "after" }) {
  return (
    <figure className="igc-browser">
      <div className="igc-browser__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>dashboard.saveenergysystems.com</em>
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

/** Tabbed step list on the left, screen on the right. */
function StepExplorer({ steps, label }: { steps: { n: string; title: string; body: string; file: string; h: number }[]; label: string }) {
  const [i, setI] = useState(0);
  const cur = steps[i];
  return (
    <div className="igc-wizard">
      <div className="igc-wizard__steps" role="tablist" aria-label={label}>
        {steps.map((st, idx) => (
          <button key={st.n} type="button" role="tab" aria-selected={idx === i} className="igc-wizard__step" onClick={() => setI(idx)}>
            <span className="igc-wizard__n">{st.n}</span>
            <span>
              <strong>{st.title}</strong>
              {idx === i && <span className="igc-wizard__body">{st.body}</span>}
            </span>
          </button>
        ))}
      </div>
      <div className="igc-wizard__shot" role="tabpanel" aria-label={cur.title}>
        <Image key={cur.file} src={`${IMG}/${cur.file}.webp`} alt={`${label}: ${cur.title}`} width={1553} height={cur.h} unoptimized />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function SesPortalCaseStudy() {
  const { setActiveSection } = useActiveSectionContext();
  const [compare, setCompare] = useState(comparisons[0].id);
  const [device, setDevice] = useState(deviceTypes[0].id);
  const [group, setGroup] = useState(screenGroups[0].id);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => setActiveSection("Projects"), [setActiveSection]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepLightbox = useCallback(
    (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + allScreens.length) % allScreens.length)),
    []
  );

  const activeCompare = comparisons.find((c) => c.id === compare) ?? comparisons[0];
  const activeDevice = deviceTypes.find((d) => d.id === device) ?? deviceTypes[0];
  const activeGroup = screenGroups.find((g) => g.id === group) ?? screenGroups[0];

  return (
    <main className="e-main igc sesx">
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
                lines={[{ text: "HVAC Energy", block: true }, { text: "Management Revamp", className: "is-soft", block: true }]}
              />
              <Reveal delay={1} as="p" className="e-lead mt-6">
                A redesign of the Save Energy Systems portal, an IoT platform that monitors and controls HVAC, refrigeration and power across
                100+ commercial sites. The old dashboard showed everything at once. The new one shows what needs attention first, and makes
                acting on it safe.
              </Reveal>
              <Reveal delay={2} className="igc-chips">
                <span>IoT dashboard</span>
                <span>HVAC & energy</span>
                <span>UX research</span>
                <span>Design system</span>
                <span>Next.js build</span>
              </Reveal>
              <Reveal delay={2} className="mt-7">
                <ArrowButton variant="white" href="https://saveenergysystems.com/" target="_blank" rel="noopener noreferrer">
                  Visit saveenergysystems.com
                </ArrowButton>
              </Reveal>
            </div>
            <Reveal delay={2} className="igc-hero__meta">
              <dl>
                <div>
                  <dt className="e-mono">My role</dt>
                  <dd>Senior UI/UX Engineer: research, design & front end</dd>
                </div>
                <div>
                  <dt className="e-mono">Timeline</dt>
                  <dd>12 weeks · Sep – Dec 2025</dd>
                </div>
                <div>
                  <dt className="e-mono">Team</dt>
                  <dd>5 engineers, 2 PMs, 1 designer (me), 1 QA</dd>
                </div>
                <div>
                  <dt className="e-mono">Tools</dt>
                  <dd>Figma · FigJam · Next.js · Tailwind · shadcn/ui · Recharts</dd>
                </div>
                <div>
                  <dt className="e-mono">Scope</dt>
                  <dd>58 screens, 80+ components, Slate Mono theme</dd>
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
            <SplitHeading className="igc-h2" lines={[{ text: "A powerful platform", block: true }, { text: "that was hard to use", className: "is-soft", block: true }]} />
          </div>
          <div className="igc-prose">
            <Reveal as="p">
              Save Energy Systems uses AI-driven controllers (DLC) and sensors to cut HVAC energy use in gyms, dealerships, retail and
              offices. The portal behind it could do almost anything: live temperatures, unit control, incidents, work orders, devices and
              permissions. But it was built from the engineering side out. Facility managers saw raw registers and long tables, and critical
              alerts looked the same as everything else.
            </Reveal>
            <Reveal as="p" delay={1}>
              Over 12 weeks I redesigned the portal end to end: research, information architecture, flows, a dark Slate Mono design system
              and 58 screens, then helped build it in Next.js. The brief was to <strong>improve operational visibility, make HVAC control
              proactive and safe, and make a complex IoT system easy to use every day</strong>.
            </Reveal>
            <Reveal delay={2} className="igc-goals">
              <div>
                <span className="e-mono">Goal 01</span>
                <p>See what needs attention in seconds</p>
              </div>
              <div>
                <span className="e-mono">Goal 02</span>
                <p>Control units remotely, without risk</p>
              </div>
              <div>
                <span className="e-mono">Goal 03</span>
                <p>Simple setup for sites, zones and devices</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Research & problem */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">02 · Research & the problem</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Everything visible,", block: true }, { text: "nothing obvious", className: "is-soft", block: true }]} />
          <div className="igc-grid-2 mt-12">
            {research.map((r, i) => (
              <Reveal key={r.title} delay={(i % 2) as 0 | 1} className="igc-card">
                <span className="igc-card__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={1} as="p" className="e-lead mt-12">
            Six problems came up again and again:
          </Reveal>
          <div className="igc-grid-3 mt-8">
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
          <SplitHeading className="igc-h2" lines={[{ text: "The old dashboard,", block: true }, { text: "side by side", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The left frame is the previous dashboard design. The right is the redesign. Scroll inside either frame to see the whole page.
          </Reveal>
          <div className="igc-tabs mt-10" role="tablist" aria-label="Screens to compare">
            {comparisons.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={c.id === compare} onClick={() => setCompare(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="mt-8" role="tabpanel" aria-label={activeCompare.label}>
            <div className="bbx-compare">
              <BrowserFrame key={activeCompare.before.file} screen={activeCompare.before} label="before" />
              <BrowserFrame key={activeCompare.after.file} screen={activeCompare.after} label="after" />
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
        </div>
      </section>

      {/* Process */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">04 · The process</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Five stages,", block: true }, { text: "tested with real operators", className: "is-soft", block: true }]} />
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
          <SplitHeading className="igc-h2" lines={[{ text: "The operator", block: true }, { text: "and the analyst", className: "is-soft", block: true }]} />
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

      {/* IA + nav */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">06 · Information architecture</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Five areas,", block: true }, { text: "one sidebar", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Dozens of pages were regrouped into five areas that match the job: monitor, act on a site, handle incidents, set things up, and
            administer. The sidebar collapses to icons so tables get the full width.
          </Reveal>
          <div className="ses-pair mt-12" style={{ alignItems: "center" }}>
            <Reveal>
              <SitemapDiagram />
            </Reveal>
            <Reveal delay={1} className="ses-nav-shot">
              <Image src={`${IMG}/nav.webp`} alt="Sidebar navigation, collapsed and expanded" width={622} height={1306} unoptimized />
            </Reveal>
          </div>
        </div>
      </section>

      {/* User flow */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">07 · User flow</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "From alert", block: true }, { text: "to resolved", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The main loop for an operator: notice a P1, get to the unit in two clicks, fix it remotely if possible, and otherwise raise an
            incident and a work order without leaving the site.
          </Reveal>
          <Reveal delay={1} className="mt-12">
            <UserFlowDiagram />
            <p className="igc-scroll-hint e-hand" aria-hidden="true">
              swipe the diagram →
            </p>
          </Reveal>
        </div>
      </section>

      {/* Key decisions */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">08 · Key UX decisions</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Six moves that made", block: true }, { text: "complex feel simple", className: "is-soft", block: true }]} />
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

      {/* Hero flow: control */}
      <section data-ground="ink" className="igc-dark e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">09 · The hero flow</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Remote control", block: true }, { text: "you can trust", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Changing a building’s temperature from a browser used to mean editing DLC registers. Now it’s four clear steps with a time limit
            and live feedback.
          </Reveal>
          <div className="mt-12">
            <StepExplorer steps={controlSteps} label="Temperature override" />
          </div>
        </div>
      </section>

      {/* Create site wizard */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">10 · Guided setup</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "A new site", block: true }, { text: "in four steps", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            In tests with 8 first-time operators, the 4-step wizard cut setup errors and confusion. Each step has a progress marker, required
            fields are clear, and vendors can be created inside the flow.
          </Reveal>
        </div>
      </section>
      <section data-ground="ink" className="igc-dark e-section" style={{ paddingTop: 0 }}>
        <div className="e-container">
          <div className="pt-12">
            <StepExplorer steps={wizardSteps} label="Create new site" />
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">11 · Incidents & work orders</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "P1s that can’t", block: true }, { text: "get buried", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            The incidents page opens with totals for P1, P2, in progress, resolved and late responses. Filters become removable chips. Each
            incident has details, attachments, comments and a timeline, and a work order can be created from it in one dialog.
          </Reveal>
          <div className="ses-pair mt-12">
            <Reveal>
              <BrowserFrame screen={s("incidents", "Incidents", "Severity totals, filters and a sortable list.", 1984)} />
            </Reveal>
            <Reveal delay={1}>
              <BrowserFrame screen={s("incident-work-order", "Incident with work order", "The work order sits next to the incident it came from.", 867)} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Device types */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">12 · Beyond HVAC</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Every device,", block: true }, { text: "one pattern", className: "is-soft", block: true }]} />
          <Reveal delay={1} as="p" className="e-lead mt-6">
            Refrigerators, smart sockets, generators and batteries were added as tabs on the same site page. Once you know one device type,
            you know them all.
          </Reveal>
          <div className="igc-tabs mt-10" role="tablist" aria-label="Device types">
            {deviceTypes.map((d) => (
              <button key={d.id} type="button" role="tab" aria-selected={d.id === device} onClick={() => setDevice(d.id)}>
                {d.label}
              </button>
            ))}
          </div>
          <div className="mt-6" role="tabpanel" aria-label={activeDevice.label}>
            <p className="e-lead">{activeDevice.body}</p>
            <div className="ses-pair mt-8">
              {activeDevice.screens.map((sc) => (
                <BrowserFrame key={sc.file} screen={sc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final UI gallery */}
      <section data-ground="white" className="g-white e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">13 · Final UI</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "58 screens,", block: true }, { text: "one system", className: "is-soft", block: true }]} />
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
            {activeGroup.screens.map((sc) => (
              <BrowserFrame key={sc.file} screen={sc} onOpen={() => setLightbox(allScreens.indexOf(sc))} />
            ))}
          </div>
        </div>
      </section>

      {/* Design system */}
      <section data-ground="white" className="igc-blush e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">14 · Slate Mono design system</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Dark by default,", block: true }, { text: "loud only when it matters", className: "is-soft", block: true }]} />
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
              <p className="e-mono">Typeface · SF Pro / system UI</p>
              <p className="igc-ds__aa">Aa</p>
              <div className="igc-ds__scale">
                <span style={{ fontSize: "2rem", fontWeight: 700 }}>100 sites</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 600 }}>Temperature Override</span>
                <span style={{ fontSize: "1rem", fontWeight: 500 }}>Zone temp · Set point · Supply</span>
                <span style={{ fontSize: "0.85rem" }}>4px / 8px grid, rounded-2xl cards, pill badges.</span>
              </div>
            </Reveal>
            <Reveal delay={2} className="igc-ds__components">
              <p className="e-mono">Severity system</p>
              <div className="ses-sev" aria-hidden="true">
                <span className="is-p1">
                  <b>P1</b> Critical · Offline unit
                </span>
                <span className="is-p2">
                  <b>P2</b> Warning · Temperature drift
                </span>
                <span className="is-wo">
                  <b>WO</b> Work order open
                </span>
                <span className="is-ok">
                  <b>OK</b> Online & healthy
                </span>
              </div>
              <ul className="igc-ds__list">
                <li>80+ components, atomic structure</li>
                <li>Dark & light mode tokens</li>
                <li>50+ Lucide icons</li>
                <li>WCAG 2.1 AA contrast</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <FrontendBuild data={frontendBuilds["7"]} index="15 · Front-end development" />

      {/* Results */}
      <section data-ground="blue" className="igc-results e-section">
        <div className="e-container">
          <Reveal>
            <p className="e-mono igc-eyebrow">16 · Results</p>
          </Reveal>
          <SplitHeading className="igc-h2" lines={[{ text: "Calmer screens,", block: true }, { text: "faster response", className: "is-soft", block: true }]} />
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
                <li>Enterprise dashboards need a strong visual hierarchy. A severity colour system cuts decision time more than any chart.</li>
                <li>Multi-step flows reduce mistakes in configuration-heavy systems like site and zone setup.</li>
                <li>Remote control needs feedback: an Applying… state builds more trust than a success toast.</li>
                <li>Dark themes suit monitoring tools that stay open for a whole shift.</li>
              </ul>
            </Reveal>
            <Reveal delay={1} className="igc-learn">
              <p className="e-mono">What’s next</p>
              <ul>
                <li>Predictive alerts from the FDD (fault detection) engine</li>
                <li>A mobile companion for technicians on site</li>
                <li>Energy reports per site and customer</li>
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
