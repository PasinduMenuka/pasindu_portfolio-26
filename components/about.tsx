"use client";

import React from "react";
import SectionHeading from "./section-heading";
import {motion} from "framer-motion";
import {useSectionInView} from "@/lib/hooks";

export default function About() {
    const {ref} = useSectionInView("About");

    return (
        <motion.section
            ref={ref}
            className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.175}}
            id="about"
        >
            <SectionHeading>About me</SectionHeading>
           <p className="mb-3 text-center">
            As a <span className="font-bold">Senior UI/UX Engineer</span> with{" "}
            <span className="font-bold">over 4+ years</span> of dedicated experience, I am
            passionate about creating meaningful and intuitive digital experiences that
            resonate with users. My role has been pivotal in shaping the design and
            functionality of various digital products, including{" "}
            <span className="font-bold">web applications</span> and{" "}
            <span className="font-bold">mobile apps</span>, ensuring optimal user
            engagement and satisfaction. I specialize in transforming concepts and ideas
            into visually appealing, scalable, and highly functional interfaces.
            </p>

        </motion.section>
    );
}
