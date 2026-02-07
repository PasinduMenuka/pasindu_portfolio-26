import React, {useEffect, useRef, useState} from 'react';
import {HiMenuAlt3} from "react-icons/hi";
import {AiOutlineClose} from "react-icons/ai";
import {AnimatePresence, motion} from "framer-motion";
import {useAppSelector, useAppDispatch} from '../app/hooks'
import {useActiveSectionContext} from "@/context/active-section-context";

import {closeMenu, openMenu} from '../app/features/appState/appStateSlice'
import {links} from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";

const OffCanvasMenu = () => {
    const menuIsOpen = useAppSelector(state => state.appState.burgerMenuIsOpen)
    const dispatch = useAppDispatch()
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
        // clean up
        return () => window.removeEventListener("click", handleClick);
    }, [menuIsOpen]);

    return (<div ref={navigation} className='bg-amber-200'>
            <motion.div
                className='z-40 w-full flex fixed justify-end items-center top-0 left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0 rounded-none border border-white border-opacity-40 bg-white bg-opacity-95 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem]  sm:rounded-full dark:bg-gray-950 dark:border-black/40 dark:bg-opacity-75 px-3'
                initial={{y: -100, x: "-50%", opacity: 0}}
                animate={{y: 0, x: "-50%", opacity: 1}}
            >

                {
                    menuIsOpen ? (<AiOutlineClose name={"icon"} size={25} onClick={() => dispatch(closeMenu())}/>) : (
                        <HiMenuAlt3 name={"icon"} size={25} onClick={() => dispatch(openMenu())}/>)

                }
            </motion.div>
            {
                menuIsOpen &&
                <AnimatePresence mode={"wait"} onExitComplete={() => null} initial={true}>
                    <motion.div
                        className='fixed min-h-screen w-[60%] z-40 top-[3rem] right-0 rounded-none border border-white border-opacity-40 bg-white bg-opacity-95 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:w-[36rem] sm:rounded-full dark:bg-gray-950 dark:border-black/40 dark:bg-opacity-75 py-10'
                        initial={{x: "50%", opacity: 0}}
                        animate={{x: "0%", opacity: 1}}
                        exit={{x: "50%", opacity: 0}}
                    >
                        <ul className="flex px-2 flex-col w-full flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:flex-nowrap sm:gap-5">
                            {links.map((link) => (
                                <motion.li
                                    className="flex items-center justify-center relative w-full"
                                    key={link.hash}
                                    initial={{x: 100, opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                >
                                    <Link
                                        className={clsx(
                                            "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition dark:text-gray-500 dark:hover:text-gray-300",
                                            {
                                                "text-gray-950 dark:text-gray-200":
                                                    activeSection === link.name,
                                            }
                                        )}
                                        href={link.hash}
                                        onClick={() => {
                                            setActiveSection(link.name);
                                            setTimeOfLastClick(Date.now());
                                            dispatch(closeMenu())
                                        }}
                                    >
                                        {link.name}

                                        {link.name === activeSection && (
                                            <motion.span
                                                className="bg-gray-100 rounded-full absolute inset-0 -z-10 dark:bg-gray-800"
                                                layoutId="activeSection"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 30,
                                                }}
                                            ></motion.span>
                                        )}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>
            }
        </div>

    );
};

export default OffCanvasMenu;