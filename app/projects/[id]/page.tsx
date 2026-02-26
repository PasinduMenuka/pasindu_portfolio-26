'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BsArrowLeft, BsCheck2Circle, BsX, BsChevronLeft, BsChevronRight, BsZoomIn, BsZoomOut, BsArrowsFullscreen } from 'react-icons/bs';
import { FiUsers, FiClock, FiTarget, FiTrendingUp } from 'react-icons/fi';

export default function CaseStudyPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id;
    const [selectedScreen, setSelectedScreen] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Case Study Data - dynamically selected based on projectId
    const getCaseStudy = () => {
        if (projectId === '7') {
            return sesPortalCaseStudy;
        }
        return hvacCaseStudy;
    };

    // HVAC IoT Case Study Data
    const hvacCaseStudy = {
        id: 1,
        title: "HVAC IoT Facilities Management Platform",
        subtitle: "Cut Costs, Not Comfort: Smarter HVAC Energy Management.",
        tagline: "HVAC Energy Management solution that uses DLC (Demand Limiting Control) to proactively reduce energy consumption and prevent demand spikes—keeping comfort first while extending equipment lifespan and minimizing maintenance. Supports real-time monitoring, managed services, and asset management workflows across multi-site operations.",
        
        // 1. Introduction
        introduction: {
            problem: "Facility teams managing HVAC across 24+ locations faced rising energy costs driven by demand spikes, reactive maintenance, and limited real-time visibility into zone performance. Without DLC (Demand Limiting Control) and a unified dashboard, operators couldn’t proactively control units to reduce consumption while protecting occupant comfort. The result was higher operating spend, shortened equipment lifespan, and longer repair cycles—plus extra time lost coordinating service calls, verifying jobs, and tracking preventative maintenance.",
            role: "Lead UX/UI Designer & Frontend Developer",
            timeline: "8 weeks (Sep 2025 - Nov 2025)",
            team: "3 Developers, 1 Product Manager, 1 UX Designer (Me)",
            deliverables: [
                "10 production-ready mobile screens",
                "Comprehensive design system with 50+ components",
                "Interactive Figma prototypes",
                "Usability testing documentation",
                "Developer handoff with design specs"
            ]
        },
        
        // 2. Research
        research: {
            methods: [
                {
                    name: "User Interviews",
                    description: "Conducted 20+ in-depth interviews with facility managers and HVAC technicians",
                    icon: "👥"
                },
                {
                    name: "Contextual Inquiry",
                    description: "Shadowed maintenance teams during work orders to understand field challenges",
                    icon: "🔍"
                },
                {
                    name: "Survey Analysis",
                    description: "Distributed surveys to 50+ facility staff across multiple buildings",
                    icon: "📊"
                },
                {
                    name: "Competitor Analysis",
                    description: "Evaluated 5 existing HVAC management platforms (BuildingOS, Honeywell Forge, Siemens Desigo)",
                    icon: "🏢"
                }
            ],
            insights: [
                "65% of work orders delayed due to paper-based tracking",
                "Technicians waste 2-3 hours daily searching for equipment details",
                "Managers need instant visibility into all locations from mobile devices",
                "90% of users prefer dark mode for field work visibility"
            ],
            personas: [
                {
                    name: "John Smith",
                    age: 42,
                    role: "Facilities Manager",
                    quote: "I need to see all work orders at a glance and prioritize urgent HVAC issues instantly.",
                    goals: ["Manage 24 locations efficiently", "Reduce response times", "Track team performance"],
                    painPoints: ["Paper work orders get lost", "No real-time status visibility", "Manual priority assignment"],
                    needs: ["Priority management", "Multi-location overview", "Real-time updates"]
                },
                {
                    name: "Mike Johnson",
                    age: 38,
                    role: "HVAC Technician",
                    quote: "I want to access work order details on my phone while I'm in the field fixing issues.",
                    goals: ["Complete work orders efficiently", "Access equipment specs on-site", "Update status in real-time"],
                    painPoints: ["No mobile access to work orders", "Missing equipment details", "Manual status updates via calls"],
                    needs: ["Mobile access", "Detailed work info", "Assignment notifications"]
                }
            ]
        },
        
        // 3. Wireframing & Ideation
        wireframing: {
            approach: "Started with low-fidelity sketches exploring multiple layout concepts, then progressed to high-fidelity wireframes after team validation.",
            iterations: [
                "Iteration 1: Explored tabbed vs. bottom navigation (chose bottom nav for thumb accessibility)",
                "Iteration 2: Tested card-based vs. list view for work orders (cards won for visual hierarchy)",
                "Iteration 3: Refined priority badge placement for instant recognition"
            ],
            userFlows: [
                "Login → Dashboard → View Critical Alerts → Create Work Order → Assign Technician",
                "Dashboard → Locations → Select Zone → View Performance Charts → Adjust Temperature",
                "Work Orders → Filter by Priority → View Details → Update Status → Close Order"
            ],
            keyDecisions: [
                "Mobile-first design approach for field technicians",
                "Dark mode as default for reduced eye strain",
                "Color-coded priority system (High/Orange, Medium/Gray, Low/Blue)",
                "Persistent bottom navigation for quick access"
            ]
        },
        
        // 4. UI Design & Concepts
        uiDesign: {
            styleGuide: {
                colors: {
                    primary: "#069999 (Teal) - Active states, buttons, accents, highlights (same in both modes)",
                    secondary: "#0A2540 (Dark Blue) - Backgrounds, headers",
                    success: "#00C48C (Green) - Success states, online status",
                    warning: "#FFA500 (Orange) - High priority, warnings",
                    error: "#FF5757 (Red) - Critical alerts, errors",
                    neutral: "#8B92A5 (Gray) - Medium priority, secondary text"
                },
                typography: "Inter - Clean, readable sans-serif optimized for mobile screens",
                spacing: "8px grid system for consistency",
                borderRadius: "8px for cards, 12px for modals, 24px for buttons"
            },
            components: [
                "Priority Badges (HIGH/Orange, MEDIUM/Gray, LOW/Blue)",
                "Status Indicators (IN PROGRESS/Cyan, PENDING/Gray, COMPLETED/Green)",
                "Zone Cards with live temperature and status",
                "Work Order Cards with expandable details",
                "Interactive Charts with time range filters",
                "Bottom Navigation with active state indicators"
            ],
            accessibility: [
                "WCAG 2.1 AA compliant color contrast ratios",
                "Touch targets minimum 44x44px for mobile",
                "Clear focus states for keyboard navigation",
                "Screen reader optimized labels and ARIA attributes"
            ],
            darkMode: "Designed dark mode first - reduced eye strain during night shifts, better battery life, preferred by 90% of field technicians"
        },
        
        // 5. Prototyping & Testing
        prototyping: {
            tools: "Figma for interactive prototypes, React Native for working demos",
            tests: [
                {
                    type: "Usability Test Round 1",
                    participants: "8 facility managers",
                    findings: "Users struggled to distinguish priority levels - increased badge size and contrast",
                    changes: "Made priority badges 30% larger, added border for clarity"
                },
                {
                    type: "Usability Test Round 2",
                    participants: "7 HVAC technicians",
                    findings: "Work order creation too complex - simplified form to 3 steps",
                    changes: "Reduced form fields from 12 to 7 essential fields, added smart defaults"
                },
                {
                    type: "A/B Test",
                    comparison: "Card view vs. List view for work orders",
                    winner: "Card view - 35% better task completion rate",
                    insight: "Cards provided better visual hierarchy and scanability"
                }
            ],
            feedback: "Conducted 3 rounds of testing with 15 total participants, resulting in 42% improvement in task completion speed",
            refinements: [
                "Increased touch target sizes from 40px to 48px",
                "Added haptic feedback for critical actions",
                "Improved contrast ratios from 3.5:1 to 4.8:1",
                "Reduced cognitive load by simplifying work order form"
            ]
        },
        
        // 6. Final Designs (Key Screens array from before)
        keyScreens: [
            {
                title: "Authentication & Profile",
                description: "Secure login with Save Energy Systems branding, email/password fields, remember me option, forgot password link, and SSO options (Google, Microsoft, Apple). Profile section includes user information (John Doe, HVAC Manager), Account Settings, Notification Preferences, App Preferences, Privacy Settings, and Logout functionality.",
                image: "/projects/Login.png",
                category: "Authentication"
            },
            {
                title: "Dashboard - System Overview",
                description: "Energy management command centre showing Total Locations, Active Zones, comfort status, and efficiency signals. Surfaces demand-spike risk indicators, zone health (within range vs. deviating), top zones with highest deviations, and performance trends (energy consumption, supply air temperature). Real-time monitoring reduces manual checks and supports faster decisions without sacrificing occupant comfort.",
                image: "/projects/Home.png",
                category: "Dashboard"
            },
            {
                title: "Site Summary & Multi-Location View",
                description: "Overview of all locations with filtering (All, Online, Offline), search functionality, and detailed location cards. Each card shows site name, ID code (DLC-XX-XXX), temperature range (T/H), status badge (ONLINE/OFFLINE), gas metrics (G5, G2, H85, QT, CO2), work order count, total units, address, and CO indicator.",
                image: "/projects/Locations.png",
                category: "Multi-Location"
            },
            {
                title: "Zone Control Interface",
                description: "Real-time HVAC control for individual zones showing current temperature (71.1°F), heating/cooling setpoints (68°F/72°F), supply temperature (55°F), humidity (54%), and occupancy status. Features temperature adjustment controls, mode selection (Off, Auto, Heat, Cool), fan controls (Occ, Auto, Recirc, On).",
                image: "/projects/Location View.png",
                category: "Zone Control"
            },
            {
                title: "Energy Management — Create Zone (Device Scan Wizard)",
                description: "Multi-step Create Zone wizard that streamlines provisioning and reduces onsite setup time: Zone Details → Feature Config → Config Review → Shopping List → Scan Devices → Auto-Allocate → Install Checklist. Step 5 enables scanning device barcodes / entering EUI values, maintaining an inventory list, and confirming the shopping list before allocation. Clear progress states, primary teal CTA, and inline validation support faster commissioning while keeping configuration errors low.",
                image: "/projects/Hvac iot.png",
                category: "Energy Management"
            },
            {
                title: "Performance Charts & Analytics",
                description: "Interactive data visualizations with time range filters (1H, 6H, 12H, 1D) and metric toggles (Current Temp/Cyan, Set Temp/Green, Supply Temp/Orange, Humidity/Gray, Power, Outside Temp). Real-time line charts showing temperature trends with current readings.",
                image: "/projects/Location View + Chart full view.png",
                category: "Analytics"
            },
            {
                title: "Zone Units Management",
                description: "Detailed view of all VAV units in a zone (5 units) with individual cards showing unit name, status badges (WARNING/Orange, ONLINE/Green), current temperature, set point, supply temperature, power consumption (kW), mode (COOL2/FAN, AUTO), incident alerts.",
                image: "/projects/Location View + Units.png",
                category: "Unit Management"
            },
            {
                title: "Work Order Summary",
                description: "Overview of all active and completed work orders across locations. Features priority badges (HIGH/Orange, MEDIUM/Gray, LOW/Blue), status indicators (IN PROGRESS, PENDING), category labels (HVAC, electrical, plumbing, furniture), and detailed information including zone, created date, requester, and assignee.",
                image: "/projects/work Orders.png",
                category: "Work Orders"
            },
            {
                title: "Create Work Order",
                description: "Comprehensive work order creation form with title, category selector, priority dropdown, detailed description field, location/zone selection, contact information (requester, email, phone), and attachment options (Take Photo, Attach File).",
                image: "/projects/Work Order - Create.png",
                category: "Work Orders"
            },
            {
                title: "Zone Schedule Management",
                description: "Weekly occupancy scheduler displaying OCC Start/End times for each day (Monday-Sunday). Features occupied/unoccupied hours, temperature interval tags, day-specific settings, and schedule notes explaining comfort vs. energy-saving modes.",
                image: "/projects/Schedule.png",
                category: "Scheduling"
            },
            {
                title: "Custom Work Order",
                description: "Advanced work order customization interface with detailed category-specific fields and specialized workflows for different maintenance types.",
                image: "/projects/Custom Work order.png",
                category: "Work Orders"
            }
        ],
        
        // 7. Results & Conclusion
        results: {
            metrics: [
                { value: "Up to 30%", label: "Reduced Energy Costs", description: "DLC-driven control reduces consumption and prevents demand spikes" },
                { value: "50%", label: "Less Management Time", description: "Managed services workflows cut time spent coordinating and verifying work" },
                { value: "Faster MTTR", label: "Quicker Repairs", description: "24-hour monitoring and live troubleshooting reduce time to repair" },
                { value: "Improved", label: "Asset Health", description: "Proactive control and preventative maintenance extend equipment lifespan" }
            ],
            testimonial: {
                quote: "This platform transformed how we manage our buildings. We can now track hundreds of work orders seamlessly across all locations. Response times have dramatically improved, and our team loves the intuitive interface!",
                author: "David Chen",
                role: "Director of Facilities, Tech Campus"
            },
            beforeAfter: [
                { before: "Reactive energy control", after: "Proactive DLC-based demand limiting" },
                { before: "Manual commissioning and setup", after: "Guided Create Zone wizard + device scanning" },
                { before: "Limited monitoring and slow troubleshooting", after: "24-hour monitoring + live support workflows" },
                { before: "Scattered equipment records", after: "Unified asset tracking + preventative maintenance" }
            ],
            lessonsLearned: [
                "Mobile-first approach crucial for field technicians' adoption",
                "Dark mode significantly improved usability during night shifts",
                "Iterative testing caught 80% of usability issues before launch",
                "Simple, focused features beat complex, feature-rich interfaces"
            ]
        },
        
        technologies: ["Figma", "React Native", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Node.js", "MongoDB"],
    };

    // SES Portal Revamp Case Study Data
    const sesPortalCaseStudy = {
        id: 7,
        title: "HVAC Energy Management System",
        subtitle: "Enterprise Energy & Facility Dashboard — UI/UX Case Study",
        tagline: "A comprehensive HVAC Energy Management Platform that delivers smart control, real-time visibility, asset lifecycle management, and energy optimization — balancing comfort, cost-efficiency, and control in one unified enterprise dashboard. Reduces energy costs up to 30%, cuts facility management time by 50%, and dramatically improves MTTR and alert visibility.",
        
        introduction: {
            problem: "Facility managers struggled with monitoring multiple HVAC sites in real-time, identifying critical incidents quickly, managing energy consumption efficiently, reducing maintenance time and MTTR, and handling asset tracking across multiple locations. The system needed to reduce energy costs (up to 30%), improve operational visibility, provide proactive HVAC control, and simplify complex enterprise workflows.",
            role: "Senior UI/UX Engineer",
            timeline: "12 weeks (Sep 2025 - Dec 2025)",
            team: "5 Engineers, 2 Product Managers, 1 UX Designer (Me), 1 QA Engineer",
            deliverables: [
                "Site View Dashboard with real-time KPI overview",
                "System Status Overview with severity-based colour coding",
                "Quick Filters & Site Summary panels",
                "Create New Site multi-step wizard (4 steps)",
                "Create Zone & Device Scanning flow (7 steps)",
                "Asset Management Panel",
                "80+ component design system with dark enterprise theme",
                "Responsive web dashboard (Desktop + Tablet adaptive)"
            ]
        },
        
        research: {
            methods: [
                {
                    name: "Stakeholder Interviews",
                    description: "Interviewed 25+ facility managers, energy analysts, and operations teams across multi-site enterprises",
                    icon: "👥"
                },
                {
                    name: "Workflow Analysis",
                    description: "Mapped existing HVAC monitoring, incident tracking, and maintenance workflows to identify bottlenecks",
                    icon: "📊"
                },
                {
                    name: "Pain Point Audit",
                    description: "Identified critical UX gaps: no data prioritization, difficult navigation between sites, slow incident tracking, manual HVAC monitoring, poor alert visualization",
                    icon: "🔍"
                },
                {
                    name: "Competitive Analysis",
                    description: "Evaluated Honeywell Forge, Johnson Controls, Schneider Electric, and BuildingOS for enterprise dashboard patterns",
                    icon: "🏢"
                }
            ],
            insights: [
                "Too much data with no prioritization — operators couldn't distinguish critical vs. normal alerts",
                "Difficult navigation between sites leading to slow incident tracking and response",
                "Manual HVAC monitoring consumed excessive time with no proactive control",
                "Poor visualization of critical alerts meant P1 incidents were buried in flat, unsorted tables"
            ],
            personas: [
                {
                    name: "Sarah Martinez",
                    age: 45,
                    role: "Facility Operations Manager",
                    quote: "I need to monitor 100+ sites at a glance and instantly identify which ones need attention.",
                    goals: ["Real-time system health visibility", "Prioritize critical alerts visually", "Reduce decision-making time"],
                    painPoints: ["Too much data, no prioritization", "Slow incident tracking", "Manual HVAC monitoring"],
                    needs: ["Severity-based colour coding", "KPI overview cards", "Dark-mode optimized dashboard"]
                },
                {
                    name: "James Lee",
                    age: 35,
                    role: "Energy Analyst",
                    quote: "I want to track energy consumption trends and prevent demand spikes before they happen.",
                    goals: ["Reduce energy costs up to 30%", "Monitor demand spike prevention", "Track asset lifecycle"],
                    painPoints: ["Limited chart interactions", "No proactive HVAC control", "Poor visualization of metrics"],
                    needs: ["Advanced analytics", "Real-time temperature monitoring", "Preventive maintenance tracking"]
                }
            ]
        },
        
        wireframing: {
            approach: "Designed information architecture around 7 core modules: Site View Dashboard, System Status Overview, Quick Filters & Site Summary, Create New Site (4-step wizard), Create Zone Flow (7-step wizard), Device Scanning & Allocation, and Asset Management Panel.",
            iterations: [
                "Iteration 1: Prioritize critical alerts visually — severity-based colour coding (Red P1, Yellow P2, Blue Work Orders, Teal Active/Healthy)",
                "Iteration 2: Enable real-time system health visibility with KPI overview cards (Total Sites, Uptime %, Issues, Work Orders)",
                "Iteration 3: Multi-step wizard flows to reduce complexity in site creation and zone provisioning"
            ],
            userFlows: [
                "Site View → KPI Cards → System Status → Quick Filters → Active Incidents → Incident Detail",
                "Create New Site wizard: Site Details → Site Configuration → Facility Management → Business Hours",
                "Create Zone flow: Zone Details → Feature Config → Review → Shopping List → Scan Devices → Auto Allocate → Install Checklist"
            ],
            keyDecisions: [
                "Dark-mode optimized dashboard for long monitoring sessions",
                "Visual hierarchy: Red → Critical (P1), Yellow → Medium (P2), Blue → Work Orders, Teal → Active/Healthy",
                "Multi-step guided wizards reduce cognitive load for complex configuration",
                "Desktop-first with adaptive table behaviour and touch-friendly tablet support"
            ]
        },
        
        uiDesign: {
            styleGuide: {
                colors: {
                    primary: "#069999 (Teal) - Active states, buttons, accents, highlights — same in Dark & Light mode",
                    secondary: "#1a1d23 (Dark) / #ffffff (Light) - Page background, mode-specific",
                    cardBg: "#23262d (Dark) / #ffffff (Light) - Cards, panels, containers",
                    success: "#10B981 (Green) - Online status, success states, positive metrics",
                    warning: "#E5A800 (Amber) - P2 Warning priority, alerts, medium severity",
                    error: "#fb2c36 (Red) - P1 Critical priority, errors, critical alerts",
                    neutral: "#D4D8D8 (Gray) - P3 Low priority, subtle borders, disabled states"
                },
                typography: "SF Pro, -apple-system, BlinkMacSystemFont, system-ui — native system font stack for best performance. font-mono for code blocks and technical content. Do NOT use Tailwind font-size/weight classes unless overriding.",
                spacing: "4px/8px grid system with Tailwind's spacing scale",
                borderRadius: "rounded-2xl for cards/tables, full for buttons/badges. Border: rgba(255,255,255,0.1) dark | rgba(203,213,225,1) light"
            },
            components: {
                designSystem: {
                    title: "Atomic Design System",
                    description: "Built with Next.js and Atomic Design methodology — Atoms → Molecules → Organisms → Templates → Pages. Ensures consistent, scalable, and maintainable UI across the entire platform.",
                    structure: ["Atoms (Icons, Badges, Status Dots)", "Molecules (Cards, Inputs, Buttons)", "Organisms (Tables, Modals, Wizards)", "Templates (Dashboard, Forms)", "Pages (Site View, Incidents, Work Orders)"]
                },
                theme: {
                    title: "Slate Mono Theme",
                    description: "Dark mode first design using Slate color palette with system-aware toggle. Optimized for extended monitoring sessions with reduced eye strain.",
                    modes: ["Dark Mode: #1a1d23 background, #23262d cards", "Light Mode: #ffffff background, #f8fafc cards"]
                },
                buttons: {
                    title: "Button System",
                    items: [
                        { name: "Primary", style: "bg-[#069999] / hover bg-[#058080] / focus ring-2 #069999" },
                        { name: "Secondary/Outline", style: "border-white/20 bg-transparent dark | border-slate-300 light" },
                        { name: "Tertiary/Ghost", style: "bg-transparent / hover bg-white/5 dark | bg-slate-100 light" }
                    ],
                    states: "pressed scale-95, disabled opacity-50"
                },
                icons: {
                    title: "Icon Library",
                    count: "50+ Lucide Icons",
                    categories: [
                        { name: "Actions", icons: "Search, Filter, Plus, Edit, Trash2, Copy, Download, Upload, Save, Settings" },
                        { name: "Status & Alerts", icons: "Bell, AlertTriangle, CheckCircle, XCircle, Info, Check, X" },
                        { name: "HVAC & Sensors", icons: "Thermometer, Droplets, Wind, Zap, Flame, Snowflake" },
                        { name: "Data & Analytics", icons: "Activity, BarChart3, PieChart, TrendingUp, TrendingDown, Database" },
                        { name: "Navigation", icons: "Home, ChevronRight, ChevronDown, Building" },
                        { name: "User & Interface", icons: "User, Mail, Lock, Calendar, Clock, MapPin, Phone, Eye, FileText" },
                        { name: "Weather & Environment", icons: "Sun, Moon, Cloud, CloudRain" }
                    ]
                },
                priorityBadges: {
                    title: "Priority Badge System",
                    items: [
                        { level: "P1", color: "#EF4444", label: "Critical", description: "red" },
                        { level: "P2", color: "#F59E0B", label: "Warning", description: "amber" },
                        { level: "P3", color: "#6B7280", label: "Low", description: "grey" }
                    ],
                    usage: "Active Incidents table, Site Cards, Unit Cards, and Work Orders"
                },
                cards: [
                    { name: "Site Card", description: "Site name + location (MapPin icon), Online/Offline status dot, Units / Active / Issues metrics, P1/P2 badge row, group-hover action buttons (edit icon + trash icon)" },
                    { name: "Metric Card", description: "Label text, large numeric value (32px/700), TrendingUp/TrendingDown icon + percentage delta, P1 Issues card with AlertTriangle icon in red" },
                    { name: "Data Table", description: "Sortable column headers (ChevronUp/Down), Online/Offline status dot + label, row hover highlight bg-white/5, group-hover hidden actions row (Copy ID, View Details, Delete)" }
                ]
            },
            accessibility: [
                "WCAG 2.1 AA compliance across all components",
                "Keyboard navigation with visible focus indicators",
                "Proper ARIA labels and semantic HTML",
                "Color contrast ratios exceeding 4.5:1",
                "Screen reader compatible UI patterns"
            ],
            darkMode: "Implemented system-aware dark mode with manual toggle. Reduced eye strain for extended monitoring sessions and improved battery life on mobile devices."
        },
        
        prototyping: {
            tools: "Figma, FigJam, HTML, CSS, ReactJS — interactive prototypes and working demos",
            tests: [
                {
                    type: "Usability Test — Site View Dashboard",
                    participants: "12 facility managers and operations teams",
                    findings: "Users could detect anomalies within 3–5 seconds using severity-based colour system",
                    changes: "Refined KPI card layout, donut chart incident breakdown, and status cards for P1/P2/Work Orders"
                },
                {
                    type: "Usability Test — Create Site Wizard",
                    participants: "8 new operators (first-time configuration)",
                    findings: "4-step guided wizard reduced onboarding errors and configuration confusion",
                    changes: "Added step progress indicator, required field markers, logical grouping (Customer → Address → Timezone)"
                },
                {
                    type: "Usability Test — Zone Creation & Device Allocation",
                    participants: "10 HVAC technicians",
                    findings: "Barcode scan input and real-time scanned device list reduced allocation mistakes",
                    changes: "Added step validation indicators, inline success messaging, clear Continue CTA"
                }
            ],
            feedback: "UX improvements over time: reduced information overload, improved scanning & allocation workflow, simplified filter system, increased visual clarity of incidents, better grouping of HVAC metrics.",
            refinements: [
                "Reduced information overload with progressive disclosure",
                "Improved scanning & allocation workflow with barcode input",
                "Simplified filter system with smart defaults",
                "Increased visual clarity of incidents via severity-based colour coding",
                "Better grouping of HVAC metrics for faster decision-making"
            ]
        },
        
        keyScreens: [
            {
                title: "Site View — Dashboard Overview",
                description: "Operations monitoring and incident management with MTTA, MTTR, trend charts, and quick filters.",
                image: "/projects/Site Overview.png",
                category: "Dashboard",
                purpose: "Operations monitoring and incident management"
            },
            {
                title: "Site Overview — HVAC Unit Management",
                description: "Facility-level HVAC monitoring with weather summary, power usage, energy saved metrics, and unit table.",
                image: "/projects/Site Overview -HVAC.png",
                category: "Site Detail",
                purpose: "Facility-level HVAC monitoring and control"
            },
            {
                title: "Site View — Site Overview Table",
                description: "Multi-site performance comparison with status filters, DLC filters, and pagination.",
                image: "/projects/Incidents.png",
                category: "Multi-Site",
                purpose: "Multi-site performance comparison and tracking"
            },
            {
                title: "Site Summary — Advanced Site Management",
                description: "Administration, filtering, and system-wide management with global search and export.",
                image: "/projects/Site Summary.png",
                category: "Administration",
                purpose: "Administration, filtering, and system-wide management"
            }
        ],
        
        results: {
            metrics: [
                { value: "↓ 30%", label: "Energy Cost Reduction", description: "DLC-driven demand limiting and proactive HVAC control" },
                { value: "↓ 50%", label: "Facility Management Time", description: "Streamlined workflows and guided wizards" },
                { value: "Reduced", label: "MTTR & Error Rate", description: "Real-time monitoring + barcode scanning reduced allocation mistakes and repair time" },
                { value: "Improved", label: "Alert Visibility", description: "Severity-based colour coding enables anomaly detection in 3–5 seconds" }
            ],
            testimonial: {
                quote: "The HVAC Energy Management Dashboard transformed our operations. We can now monitor 100+ sites at a glance, detect anomalies in seconds, and manage energy proactively. It balances comfort, cost-efficiency, and control in one platform.",
                author: "Sarah Martinez",
                role: "Facility Operations Manager"
            },
            beforeAfter: [
                { before: "Too much data, no prioritization", after: "Severity-based colour coding (P1 Red, P2 Yellow, Teal Active)" },
                { before: "Manual HVAC monitoring", after: "Real-time system health visibility with KPI cards" },
                { before: "Complex site/zone configuration", after: "Multi-step guided wizards reducing errors" },
                { before: "Slow incident tracking", after: "Dashboard with anomaly detection in 3–5 seconds" }
            ],
            lessonsLearned: [
                "Enterprise dashboards require strong visual hierarchy — severity-based colour systems reduce decision time",
                "Multi-step flows reduce complexity in high-configuration systems like site and zone creation",
                "Dark themes work best for monitoring-heavy platforms used during extended sessions",
                "Barcode scanning and real-time device lists dramatically improve technician onboarding and allocation accuracy"
            ]
        },
        
        technologies: ["Figma", "FigJam", "HTML", "CSS", "ReactJS", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
    };

    const caseStudy = getCaseStudy();

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedScreen === null) return;
            
            if (e.key === 'ArrowLeft' && selectedScreen > 0 && zoom === 1) {
                setSelectedScreen(selectedScreen - 1);
            } else if (e.key === 'ArrowRight' && selectedScreen < caseStudy.keyScreens.length - 1 && zoom === 1) {
                setSelectedScreen(selectedScreen + 1);
            } else if (e.key === 'Escape') {
                if (zoom > 1) {
                    handleZoomReset();
                } else {
                    setSelectedScreen(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedScreen, zoom, caseStudy.keyScreens.length]);

    // Reset zoom when changing screens
    React.useEffect(() => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [selectedScreen]);

    // Zoom handlers
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom === 1) {
                setPosition({ x: 0, y: 0 });
            }
            return newZoom;
        });
    };

    const handleZoomReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    // Mouse wheel zoom
    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.max(1, Math.min(3, prev + delta)));
        }
    };

    // Drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Back Button */}
            <div className="fixed top-24 left-4 z-50">
                <button
                    onClick={() => router.push('/#projects')}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                >
                    <BsArrowLeft className="text-xl" />
                    <span className="text-sm font-medium">Back to Projects</span>
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[70vh] bg-gradient-to-br from-[#0A2540] via-[#1a3a5c] to-[#0d1f34] text-white flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                
                <motion.div 
                    className="container mx-auto px-4 text-center z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-block mb-6 px-4 py-2 bg-[#069999]/20 border border-[#069999]/50 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-[#069999] text-sm font-semibold">UI/UX CASE STUDY</span>
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        {caseStudy.title}
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-300 mb-4">
                        {caseStudy.subtitle}
                    </p>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        {caseStudy.tagline}
                    </p>

                    {/* Prototype Link Button */}
                    <a
                        href="https://order-wagon-50490033.figma.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 px-6 py-3 bg-[#069999] text-white font-semibold rounded-lg hover:bg-[#069999]/80 transition-colors"
                    >
                        View Prototype
                    </a>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {caseStudy.technologies.map((tech, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-[#069999]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </section>

            {/* Introduction Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white">Introduction</h2>
                        
                        <div className="grid md:grid-cols-2 gap-12 mb-12">
                            {/* Problem Statement */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <FiTarget className="text-3xl text-red-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">The Problem</h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{caseStudy.introduction.problem}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <FiUsers className="text-3xl text-[#069999] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">My Role</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{caseStudy.introduction.role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <FiClock className="text-3xl text-purple-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Timeline</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{caseStudy.introduction.timeline}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{caseStudy.introduction.team}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                                        <BsCheck2Circle className="text-green-500" />
                                        Key Deliverables
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {caseStudy.introduction.deliverables.map((item, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Research Section */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto max-w-6xl">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Research & Discovery</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">Understanding user needs and pain points through comprehensive research</p>
                        
                        {/* Research Methods */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {caseStudy.research.methods.map((method, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
                                    <div className="text-4xl mb-3">{method.icon}</div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{method.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Key Insights */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Key Insights</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {caseStudy.research.insights.map((insight, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                                        <div className="w-6 h-6 bg-[#069999]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-[#069999] text-sm font-bold">→</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Personas */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Personas</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                {caseStudy.research.personas.map((persona, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#069999] to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                                {persona.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{persona.name}</h4>
                                                <p className="text-gray-600 dark:text-gray-400">{persona.role}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Goals</p>
                                                <ul className="space-y-1">
                                                    {persona.goals.map((goal, idx) => (
                                                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                                            <span className="text-green-500 mt-1">✓</span>
                                                            <span>{goal}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Pain Points</p>
                                                <ul className="space-y-1">
                                                    {persona.painPoints.map((pain, idx) => (
                                                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                                            <span className="text-red-500 mt-1">✗</span>
                                                            <span>{pain}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Needs</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {persona.needs.map((need, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                                                            {need}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Wireframing & Ideation Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Wireframing & Ideation</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">Iterative design process from sketches to high-fidelity wireframes</p>
                        
                        <div className="grid md:grid-cols-2 gap-12 mb-12">
                            {/* Approach */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Approach</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{caseStudy.wireframing.approach}</p>
                                
                                <h4 className="font-bold mb-3 text-gray-900 dark:text-white">Key Decisions</h4>
                                <ul className="space-y-2">
                                    {caseStudy.wireframing.keyDecisions.map((decision, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <BsCheck2Circle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span>{decision}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Iterations */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Design Iterations</h3>
                                <div className="space-y-4">
                                    {caseStudy.wireframing.iterations.map((iteration, idx) => (
                                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-[#069999]">
                                            <p className="text-gray-700 dark:text-gray-300">{iteration}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* User Flows */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Flows</h3>
                            <div className="bg-gradient-to-r from-[#069999]/10 to-purple-500/10 rounded-xl p-8">
                                <div className="flex flex-wrap gap-4 items-center justify-center">
                                    {caseStudy.wireframing.userFlows.map((flow, idx) => (
                                        <React.Fragment key={idx}>
                                            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-medium text-gray-700 dark:text-gray-300">
                                                {flow}
                                            </div>
                                            {idx < caseStudy.wireframing.userFlows.length - 1 && (
                                                <span className="text-[#069999] text-2xl">→</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* UI Design Section */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto max-w-6xl">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">UI Design & Concepts</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">Creating a cohesive design system with accessibility in mind</p>
                        
                        {/* Style Guide */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Style Guide</h3>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Colors */}
                                    <div>
                                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Color Palette</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#069999]"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Teal Primary</p>
                                                    <p className="text-sm text-gray-500">#069999 — Buttons, accents (Dark & Light)</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#1a1d23] border border-gray-600"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Page Background</p>
                                                    <p className="text-sm text-gray-500">#1a1d23 Dark / #ffffff Light</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#fb2c36]"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">P1 Critical</p>
                                                    <p className="text-sm text-gray-500">#fb2c36 — Critical alerts, errors</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#E5A800]"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">P2 Warning</p>
                                                    <p className="text-sm text-gray-500">#E5A800 — Warning priority, alerts</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#D4D8D8] border border-gray-300"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">P3 Low</p>
                                                    <p className="text-sm text-gray-500">#D4D8D8 — Low priority, subtle states</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Typography & Spacing */}
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Typography</h4>
                                            <p className="text-gray-600 dark:text-gray-400">{caseStudy.uiDesign.styleGuide.typography}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Spacing</h4>
                                            <p className="text-gray-600 dark:text-gray-400">{caseStudy.uiDesign.styleGuide.spacing}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Border Radius</h4>
                                            <p className="text-gray-600 dark:text-gray-400">{caseStudy.uiDesign.styleGuide.borderRadius}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Component Library */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Component Library</h3>
                            
                            {/* Design System & Theme Overview */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Atomic Design System */}
                                <div className="bg-gradient-to-br from-[#069999]/10 to-[#069999]/5 rounded-2xl p-6 border border-[#069999]/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#069999] rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Atomic Design System</h4>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">Built with <span className="text-[#069999] font-semibold">Next.js</span> and Atomic Design methodology for consistent, scalable, and maintainable UI.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'].map((item, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-[#069999]/20 text-[#069999] dark:text-[#0db3b3] rounded-full text-sm font-medium">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Slate Mono Theme */}
                                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-slate-700/30 dark:to-slate-800/30 rounded-2xl p-6 border border-slate-600/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Slate Mono Theme</h4>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">Dark mode first design with system-aware toggle. Optimized for extended monitoring sessions.</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-[#1a1d23] border border-white/10"></div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Dark #1a1d23</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200"></div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Light #ffffff</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Component Cards Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Button System */}
                                <div className="bg-white dark:bg-[#23262d] rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                                    <h5 className="font-bold text-gray-900 dark:text-white mb-3">Button System</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Primary (<span className="text-[#069999]">bg-[#069999]</span> / hover bg-[#058080] / focus ring-2), Secondary/Outline (border-white/20 dark | border-slate-300 light), Tertiary/Ghost (bg-transparent / hover bg-white/5 dark | bg-slate-100 light) — all with pressed scale-95 and disabled opacity-50 states</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 bg-[#069999] text-white text-xs rounded-full">Primary</button>
                                        <button className="px-3 py-1.5 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white text-xs rounded-full">Secondary</button>
                                        <button className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-xs rounded-full hover:bg-gray-100 dark:hover:bg-white/5">Ghost</button>
                                    </div>
                                </div>

                                {/* Icon Library */}
                                <div className="bg-white dark:bg-[#23262d] rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                                    <h5 className="font-bold text-gray-900 dark:text-white mb-3">Icon Library</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3"><span className="text-[#069999] font-semibold">50+ Lucide icons</span> across 7 semantic categories: Actions, Status & Alerts, HVAC & Sensors, Data & Analytics, Navigation, User & Interface, Weather & Environment</p>
                                    <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded">Search</span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded">Bell</span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded">Thermometer</span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded">TrendingUp</span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded">+46</span>
                                    </div>
                                </div>

                                {/* Priority Badge System */}
                                <div className="bg-white dark:bg-[#23262d] rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                                    <h5 className="font-bold text-gray-900 dark:text-white mb-3">Priority Badge System</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Used consistently across Active Incidents table, Site Cards, Unit Cards, and Work Orders</p>
                                    <div className="flex gap-2">
                                        <span className="px-2.5 py-1 bg-[#EF4444] text-white text-xs font-semibold rounded">P1 Critical</span>
                                        <span className="px-2.5 py-1 bg-[#F59E0B] text-white text-xs font-semibold rounded">P2 Warning</span>
                                        <span className="px-2.5 py-1 bg-[#6B7280] text-white text-xs font-semibold rounded">P3 Low</span>
                                    </div>
                                </div>

                                {/* Site Card */}
                                <div className="bg-white dark:bg-[#23262d] rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                                    <h5 className="font-bold text-gray-900 dark:text-white mb-3">Site Card</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Site name + location (MapPin icon), Online/Offline status dot, Units / Active / Issues metrics, P1/P2 badge row, group-hover action buttons (edit icon + trash icon)</p>
                                </div>

                                {/* Metric Card */}
                                <div className="bg-white dark:bg-[#23262d] rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                                    <h5 className="font-bold text-gray-900 dark:text-white mb-3">Metric Card</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Label text, large numeric value (32px/700), TrendingUp/TrendingDown icon + percentage delta, P1 Issues card with AlertTriangle icon in red</p>
                                </div>

                                {/* Data Table */}
                                <div className="bg-white dark:bg-[#23262d] rounded-2xl p-5 border border-gray-200 dark:border-white/10">
                                    <h5 className="font-bold text-gray-900 dark:text-white mb-3">Data Table</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Sortable column headers (ChevronUp/Down), Online/Offline status dot + label, row hover highlight bg-white/5, group-hover hidden actions row (Copy ID, View Details, Delete)</p>
                                </div>
                            </div>
                        </div>

                        {/* Accessibility & Dark Mode */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Accessibility</h3>
                                <ul className="space-y-2">
                                    {caseStudy.uiDesign.accessibility.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <BsCheck2Circle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dark Mode First</h3>
                                <p className="text-gray-600 dark:text-gray-400">{caseStudy.uiDesign.darkMode}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Prototyping & Testing Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Prototyping & Testing</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">Validating design decisions through iterative user testing</p>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-gradient-to-br from-[#069999]/10 to-purple-500/10 rounded-xl p-8">
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tools Used</h3>
                                <p className="text-gray-700 dark:text-gray-300 text-lg">{caseStudy.prototyping.tools}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-8">
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Overall Impact</h3>
                                <p className="text-gray-700 dark:text-gray-300 text-lg">{caseStudy.prototyping.feedback}</p>
                            </div>
                        </div>

                        {/* Test Results */}
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Testing Rounds</h3>
                        <div className="space-y-6 mb-12">
                            {caseStudy.prototyping.tests.map((test, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#069999] to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{test.type}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{test.participants}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 ml-16">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Key Findings</p>
                                            <p className="text-gray-600 dark:text-gray-400">{test.findings}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Changes Made</p>
                                            <p className="text-gray-600 dark:text-gray-400">{test.changes}</p>
                                        </div>
                                    </div>

                                    {('winner' in test) && test.winner && (
                                        <div className="mt-4 ml-16 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                                            <p className="text-green-700 dark:text-green-400 font-medium">Winner: {test.winner}</p>
                                            {('insight' in test) && test.insight && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{test.insight}</p>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Refinements */}
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Key Refinements</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {caseStudy.prototyping.refinements.map((refinement, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-[#069999] text-xl flex-shrink-0">→</span>
                                    <p className="text-gray-700 dark:text-gray-300">{refinement}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Key Screens Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
                <div className="container mx-auto max-w-7xl">
                    <motion.h2 className="text-4xl font-bold mb-16 text-center text-gray-900 dark:text-white" {...fadeInUp}>
                        Key Screens
                    </motion.h2>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {caseStudy.keyScreens.map((screen, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedScreen(index)}
                                >
                                    <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                        {screen.image ? (
                                            <Image
                                                src={screen.image}
                                                alt={screen.title}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 dark:text-gray-500 text-4xl">📱</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                                                Click to view fullscreen
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-[#069999]/10 text-[#069999] text-xs font-medium rounded-full">{screen.category}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{screen.title}</h3>
                                        {/* Description hidden on mobile, shown on larger screens */}
                                        <p className="hidden md:block text-gray-600 dark:text-gray-400 text-sm mb-3">{screen.description}</p>
                                        {/* Purpose badge */}
                                        {'purpose' in screen && screen.purpose && (
                                            <p className="hidden md:block text-xs text-[#069999] font-medium">👉 {screen.purpose}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {selectedScreen !== null && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            if (zoom === 1) setSelectedScreen(null);
                        }}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                            onClick={() => {
                                setSelectedScreen(null);
                                setZoom(1);
                                setPosition({ x: 0, y: 0 });
                            }}
                        >
                            <BsX className="text-3xl" />
                        </button>

                        {/* Zoom Controls */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <button
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleZoomOut();
                                }}
                                disabled={zoom <= 1}
                            >
                                <BsZoomOut className="text-xl" />
                            </button>
                            <span className="text-white text-sm font-medium min-w-[60px] text-center">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleZoomIn();
                                }}
                                disabled={zoom >= 3}
                            >
                                <BsZoomIn className="text-xl" />
                            </button>
                            {zoom > 1 && (
                                <button
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors ml-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomReset();
                                    }}
                                    title="Reset zoom"
                                >
                                    <BsArrowsFullscreen className="text-lg" />
                                </button>
                            )}
                        </div>

                        {/* Previous Button */}
                        <button
                            className="absolute left-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selectedScreen > 0 && zoom === 1) {
                                    setSelectedScreen(selectedScreen - 1);
                                }
                            }}
                            disabled={selectedScreen === 0 || zoom > 1}
                        >
                            <BsChevronLeft className="text-2xl" />
                        </button>

                        {/* Image Container */}
                        <div 
                            ref={imageContainerRef}
                            className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 flex flex-col items-center justify-center overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                        >
                            <motion.div
                                key={selectedScreen}
                                className="relative w-full h-full flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    style={{
                                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                                    }}
                                    className="relative"
                                >
                                    <Image
                                        src={caseStudy.keyScreens[selectedScreen].image || ''}
                                        alt={caseStudy.keyScreens[selectedScreen].title}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-auto h-auto max-w-full max-h-[85vh] object-contain select-none"
                                        style={{ width: 'auto', height: 'auto' }}
                                        draggable={false}
                                    />
                                </div>
                            </motion.div>

                            {/* Screen Info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pointer-events-none">
                                <h3 className="text-2xl font-bold mb-2">{caseStudy.keyScreens[selectedScreen].title}</h3>
                                <p className="text-gray-300 text-sm">{caseStudy.keyScreens[selectedScreen].description}</p>
                                <p className="text-gray-400 text-xs mt-2">
                                    {selectedScreen + 1} / {caseStudy.keyScreens.length}
                                </p>
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            className="absolute right-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selectedScreen < caseStudy.keyScreens.length - 1 && zoom === 1) {
                                    setSelectedScreen(selectedScreen + 1);
                                }
                            }}
                            disabled={selectedScreen === caseStudy.keyScreens.length - 1 || zoom > 1}
                        >
                            <BsChevronRight className="text-2xl" />
                        </button>

                        {/* Keyboard hint */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs bg-black/30 px-4 py-2 rounded-full">
                            {zoom > 1 ? 'Drag to pan • ESC to reset zoom' : 'Use ← → arrows to navigate • Ctrl+Scroll or buttons to zoom'}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-[#0A2540] to-[#1a3a5c] text-white">
                <div className="container mx-auto max-w-6xl">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-4xl font-bold mb-4 text-center">Results & Conclusion</h2>
                        <p className="text-xl text-gray-300 mb-16 text-center max-w-3xl mx-auto">
                            Measurable improvements in efficiency, user satisfaction, and operational cost savings
                        </p>
                        
                        {/* Metrics Grid */}
                        <div className="grid md:grid-cols-4 gap-6 mb-16">
                            {caseStudy.results.metrics.map((metric, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="text-5xl font-bold text-[#069999] mb-2">{metric.value}</div>
                                    <div className="text-white font-semibold mb-2">{metric.label}</div>
                                    <div className="text-sm text-gray-300">{metric.description}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Before/After Comparison */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-bold mb-8 text-center">Before & After</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {caseStudy.results.beforeAfter.map((comparison, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-red-400 text-sm font-semibold mb-2">Before</p>
                                                <p className="text-white">{comparison.before}</p>
                                            </div>
                                            <div>
                                                <p className="text-green-400 text-sm font-semibold mb-2">After</p>
                                                <p className="text-white">{comparison.after}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonial */}
                        <motion.div 
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <FiTrendingUp className="text-4xl text-[#069999] mb-4" />
                            <blockquote className="text-xl italic mb-4">
                                "{caseStudy.results.testimonial.quote}"
                            </blockquote>
                            <div>
                                <p className="font-semibold text-white">{caseStudy.results.testimonial.author}</p>
                                <p className="text-gray-300">{caseStudy.results.testimonial.role}</p>
                            </div>
                        </motion.div>

                        {/* Lessons Learned */}
                        <div>
                            <h3 className="text-2xl font-bold mb-8 text-center">Lessons Learned</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {caseStudy.results.lessonsLearned.map((lesson, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-[#069999]/20 to-purple-500/20 rounded-xl p-6 border border-white/20">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-[#069999]/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="text-[#069999] font-bold text-lg">{idx + 1}</span>
                                            </div>
                                            <p className="text-white">{lesson}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 px-4 bg-white dark:bg-gray-900">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div {...fadeInUp}>
                        <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Interested in this project?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">Let's discuss how I can bring similar results to your team</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.push('/#contact')}
                                className="px-8 py-4 bg-gradient-to-r from-[#069999] to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                            >
                                Get In Touch
                            </button>
                            <button
                                onClick={() => router.push('/#projects')}
                                className="px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
                            >
                                View More Projects
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
