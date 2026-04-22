import React, {useEffect, useRef} from 'react';
import {HiMenuAlt3} from "react-icons/hi";
import {AiOutlineClose} from "react-icons/ai";
import {AnimatePresence, motion} from "framer-motion";
import {useAppSelector, useAppDispatch} from '../app/hooks';
import {useActiveSectionContext} from "@/context/active-section-context";
import {closeMenu, openMenu} from '../app/features/appState/appStateSlice';
import {links} from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const OffCanvasMenu = () => {
    const menuIsOpen = useAppSelector(state => state.appState.burgerMenuIsOpen);
    const dispatch = useAppDispatch();
    const navigation = useRef<HTMLDivElement>(null);
    const {activeSection, setActiveSection, setTimeOfLastClick} = useActiveSectionContext();

    useEffect(() => {
        if (!menuIsOpen) return;

        function handleClick(event: MouseEvent) {
            let element = event.target as HTMLElement;
            if (navigation.current && !navigation.current.contains(event.target as Node) && element.tagName.toLowerCase() !== 'svg') {
                dispatch(closeMenu());
            }
        }

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [menuIsOpen]);

    return (
        <div ref={navigation}>
            {/* Top bar */}
            <motion.div
                className='z-40 w-full flex fixed justify-between items-center top-0 left-0 px-5 h-14'
                style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderBottom: '1px solid var(--color-border)',
                }}
                initial={{y: -100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
            >
                {/* Logo */}
                <Image src="/Logo_new.png" alt="Logo" width={40} height={40} priority />

                {/* Menu toggle */}
                <button
                    className='p-2 rounded-full border transition-all'
                    style={{
                        background: 'var(--glass-bg)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                    }}
                    aria-label={menuIsOpen ? "Close menu" : "Open menu"}
                    onClick={() => dispatch(menuIsOpen ? closeMenu() : openMenu())}
                >
                    {menuIsOpen
                        ? <AiOutlineClose size={20}/>
                        : <HiMenuAlt3 size={20}/>
                    }
                </button>
            </motion.div>

            {/* Dark overlay */}
            <AnimatePresence>
                {menuIsOpen && (
                    <motion.div
                        className='fixed inset-0 z-30'
                        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => dispatch(closeMenu())}
                    />
                )}
            </AnimatePresence>

            {/* Off-canvas panel */}
            <AnimatePresence>
                {menuIsOpen && (
                    <motion.div
                        className='fixed right-0 top-0 bottom-0 w-[72%] max-w-[280px] z-40 pt-20 pb-8 px-6 overflow-y-auto'
                        style={{
                            background: 'var(--color-surface-hover)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderLeft: '1px solid var(--color-border)',
                        }}
                        initial={{x: "100%", opacity: 0}}
                        animate={{x: "0%", opacity: 1}}
                        exit={{x: "100%", opacity: 0}}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Nav links */}
                        <ul className="flex flex-col gap-1">
                            {links.map((link, i) => (
                                <motion.li
                                    className="w-full"
                                    key={link.hash}
                                    initial={{x: 40, opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                    transition={{ delay: i * 0.06, type: "spring", stiffness: 250, damping: 25 }}
                                >
                                    <Link
                                        className={clsx(
                                            "flex w-full items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200",
                                            activeSection === link.name
                                                ? "font-semibold"
                                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                        )}
                                        style={{
                                            ...(activeSection === link.name ? {
                                                background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(74,144,226,0.1))',
                                                borderLeft: '3px solid #00D4FF',
                                                color: '#00D4FF',
                                            } : {
                                                borderLeft: '3px solid transparent',
                                            })
                                        }}
                                        href={link.hash}
                                        onClick={() => {
                                            setActiveSection(link.name);
                                            setTimeOfLastClick(Date.now());
                                            dispatch(closeMenu());
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Bottom CTA */}
                        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                            <a
                                href="/CV.pdf"
                                download
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white"
                                style={{
                                    background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
                                    boxShadow: '0 4px 15px rgba(0,212,255,0.3)',
                                }}
                                onClick={() => dispatch(closeMenu())}
                            >
                                Download CV
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OffCanvasMenu;