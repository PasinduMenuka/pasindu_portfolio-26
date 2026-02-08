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

    // HVAC IoT Case Study Data
    const caseStudy = {
        id: 1,
        title: "HVAC IoT Facilities Management Platform",
        subtitle: "Redesigning HVAC Dashboard for Better Usability",
        tagline: "A comprehensive platform enabling real-time HVAC monitoring, work order management, and multi-location oversight - reducing response time by 60% and improving operational efficiency by 42%.",
        
        // 1. Introduction
        introduction: {
            problem: "Facility managers and maintenance teams across 24+ locations struggled with fragmented paper-based work order systems, lack of real-time visibility into HVAC operations, and poor communication channels. Critical maintenance requests were lost, leading to equipment failures, energy waste, and increased operational costs exceeding $200K annually.",
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
                    primary: "#00D4FF (Cyan) - Actions, links, interactive elements",
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
                description: "Centralized hub displaying Total Locations (24), Active Zones (156), Average Temperature (72.4°F), and System Efficiency (87%). Includes Zone Health chart (Within Range 78%, Deviating 22%), Top 3 Zones with Highest Deviations, Performance Trends (Energy Consumption, Supply Air Temperature), Work Order metrics (12 Pending, 8 Approved, 23 Completed), Active Alerts, Weather Context, and Recent Activity feed.",
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
                { value: "42%", label: "Faster Work Order Completion", description: "Average time reduced from 45min to 26min" },
                { value: "60%", label: "Reduced Response Time", description: "Critical issues addressed in <15min vs. 38min before" },
                { value: "85%", label: "User Satisfaction Score", description: "Post-launch NPS survey of 50+ users" },
                { value: "$200K", label: "Annual Cost Savings", description: "From improved efficiency and reduced equipment downtime" }
            ],
            testimonial: {
                quote: "This platform transformed how we manage our buildings. We can now track hundreds of work orders seamlessly across all locations. Response times have dramatically improved, and our team loves the intuitive interface!",
                author: "David Chen",
                role: "Director of Facilities, Tech Campus"
            },
            beforeAfter: [
                { before: "Paper-based work orders", after: "Digital mobile-first system" },
                { before: "65% delayed work orders", after: "98% on-time completion" },
                { before: "No real-time visibility", after: "Live dashboards with instant updates" },
                { before: "Manual priority assignment", after: "Automated smart prioritization" }
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
                        className="inline-block mb-6 px-4 py-2 bg-[#00D4FF]/20 border border-[#00D4FF]/50 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-[#00D4FF] text-sm font-semibold">UI/UX CASE STUDY</span>
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
                <div className="absolute top-20 right-20 w-64 h-64 bg-[#00D4FF]/20 rounded-full blur-3xl"></div>
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
                                    <FiUsers className="text-3xl text-[#00D4FF] mt-1 flex-shrink-0" />
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
                                        <div className="w-6 h-6 bg-[#00D4FF]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-[#00D4FF] text-sm font-bold">→</span>
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
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#00D4FF] to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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
                                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-[#00D4FF]">
                                            <p className="text-gray-700 dark:text-gray-300">{iteration}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* User Flows */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Flows</h3>
                            <div className="bg-gradient-to-r from-[#00D4FF]/10 to-purple-500/10 rounded-xl p-8">
                                <div className="flex flex-wrap gap-4 items-center justify-center">
                                    {caseStudy.wireframing.userFlows.map((flow, idx) => (
                                        <React.Fragment key={idx}>
                                            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-medium text-gray-700 dark:text-gray-300">
                                                {flow}
                                            </div>
                                            {idx < caseStudy.wireframing.userFlows.length - 1 && (
                                                <span className="text-[#00D4FF] text-2xl">→</span>
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
                                                <div className="w-12 h-12 rounded-lg bg-[#00D4FF]"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Primary</p>
                                                    <p className="text-sm text-gray-500">#00D4FF - Cyan</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#0A2540]"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Secondary</p>
                                                    <p className="text-sm text-gray-500">#0A2540 - Dark Blue</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#00C48C]"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Success</p>
                                                    <p className="text-sm text-gray-500">#00C48C - Green</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#FFA500]"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Warning</p>
                                                    <p className="text-sm text-gray-500">#FFA500 - Orange</p>
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

                        {/* Components */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Component Library</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {caseStudy.uiDesign.components.map((component, idx) => (
                                    <div key={idx} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                                        <p className="font-medium text-gray-900 dark:text-white">{component}</p>
                                    </div>
                                ))}
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
                            <div className="bg-gradient-to-br from-[#00D4FF]/10 to-purple-500/10 rounded-xl p-8">
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
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF] to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
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

                                    {test.winner && (
                                        <div className="mt-4 ml-16 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                                            <p className="text-green-700 dark:text-green-400 font-medium">Winner: {test.winner}</p>
                                            {test.insight && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{test.insight}</p>}
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
                                    <span className="text-[#00D4FF] text-xl flex-shrink-0">→</span>
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
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{screen.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{screen.description}</p>
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
                                    <div className="text-5xl font-bold text-[#00D4FF] mb-2">{metric.value}</div>
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
                            <FiTrendingUp className="text-4xl text-[#00D4FF] mb-4" />
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
                                    <div key={idx} className="bg-gradient-to-br from-[#00D4FF]/20 to-purple-500/20 rounded-xl p-6 border border-white/20">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-[#00D4FF]/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <span className="text-[#00D4FF] font-bold text-lg">{idx + 1}</span>
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
                                className="px-8 py-4 bg-gradient-to-r from-[#00D4FF] to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
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
