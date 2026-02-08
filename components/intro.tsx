"use client";

import Image from "next/image";
import React from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {BsArrowRight, BsLinkedin} from "react-icons/bs";
import {HiDownload} from "react-icons/hi";
import {FaGithubSquare} from "react-icons/fa";
import {useSectionInView} from "@/lib/hooks";
import {useActiveSectionContext} from "@/context/active-section-context";

export default function Intro() {
    const {ref} = useSectionInView("Home", 0.5);
    const {setActiveSection, setTimeOfLastClick} = useActiveSectionContext();

    return (
        <section
            ref={ref}
            id="home"
            className="mb-28 max-w-[75rem] text-center sm:mb-0 scroll-mt-[100rem] relative"
        >
            {/* Main Hero Content */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 px-4">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-black/10 dark:border-white/10 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Available for new opportunities
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                            <span className="text-gray-900 dark:text-white">Hi, I'm </span>
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                Pasindu
                            </span>
                            <motion.span
                                className="inline-block ml-2"
                                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                                transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                                👋
                            </motion.span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="font-semibold text-gray-900 dark:text-white">Senior UI/UX Engineer</span> crafting
                        user-centric digital experiences that blend elegance with functionality
                    </motion.p>

                    <motion.p
                        className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        With <span className="font-semibold text-gray-900 dark:text-white">4+ years</span> of experience
                        turning complex problems into intuitive, beautiful solutions
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link
                            href="#contact"
                            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 flex items-center gap-2 rounded-full outline-none focus:scale-105 hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md"
                            onClick={() => {
                                setActiveSection("Contact");
                                setTimeOfLastClick(Date.now());
                            }}
                        >
                            Let's work together
                            <BsArrowRight className="group-hover:translate-x-1 transition-transform"/>
                        </Link>

                        <a
                            className="group bg-white dark:bg-white/10 text-gray-900 dark:text-white px-8 py-4 flex items-center gap-2 rounded-full outline-none focus:scale-105 hover:scale-105 hover:shadow-lg active:scale-100 transition-all borderBlack shadow-md backdrop-blur-sm"
                            href="/CV.pdf"
                            download
                        >
                            Download CV
                            <HiDownload className="group-hover:translate-y-1 transition-transform"/>
                        </a>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        className="flex items-center justify-center lg:justify-start gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <a
                            className="bg-white dark:bg-white/10 p-4 text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 rounded-full focus:scale-110 hover:scale-110 active:scale-105 transition-all cursor-pointer borderBlack shadow-md hover:shadow-lg backdrop-blur-sm"
                            href="https://linkedin.com"
                            target="_blank"
                            aria-label="LinkedIn Profile"
                        >
                            <BsLinkedin className="text-xl"/>
                        </a>

                        <a
                            className="bg-white dark:bg-white/10 p-4 text-gray-700 dark:text-white/80 hover:text-gray-950 dark:hover:text-white flex items-center gap-2 rounded-full focus:scale-110 hover:scale-110 active:scale-105 transition-all cursor-pointer borderBlack shadow-md hover:shadow-lg backdrop-blur-sm"
                            href="https://github.com"
                            target="_blank"
                            aria-label="GitHub Profile"
                        >
                            <FaGithubSquare className="text-2xl"/>
                        </a>
                    </motion.div>
                </div>

                {/* Right Visual Element */}
                <motion.div
                    className="relative flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="relative">
                        {/* Decorative rings */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 90, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                        
                        {/* Main image container */}
                        <div className="relative">
                            <motion.div
                                className="relative h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image
                                    src="/projects/profile image.jpeg"
                                    alt="Pasindu Sannasuriya"
                                    width="256"
                                    height="256"
                                    quality="95"
                                    priority={true}
                                    className="h-full w-full rounded-2xl object-cover object-top shadow-2xl border-4 border-white/20 dark:border-gray-800/50"
                                />
                                {/* Subtle gradient overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
