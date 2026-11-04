'use client'
import React, { useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { projectsData } from '@/lib/data';
import Project from '@/components/project';
import ArrowButton from '@/components/arrow-button';
import { HandTag, Reveal, SplitHeading } from '@/components/motion/reveal';
import { useActiveSectionContext } from '@/context/active-section-context';

const urls = [
    "/projects/hvac_dashboard.png", // id: 1 - HVAC IoT (but has detailed case study, won't use this)
    "/projects/aimGame.svg",        // id: 2 - Aim Game
    "/projects/citreas.svg",        // id: 3 - Life Line
    "/projects/lifeLine.svg",       // id: 4 - MediQem
    "/projects/mediCem.svg",        // id: 5 - MyStartup
    "/projects/myStartUp.svg",      // id: 6 - RCB
    "/projects/rcb.png",
];

/** Full-page image view for projects without a detailed case study (/projects?id=N). */
function ProjectImage({ id }: { id: number }) {
    return (
        <div className="flex justify-center absolute top-0 py-10 sm:py-0">
            <Image
                src={urls[id - 1]}
                width={0}
                height={0}
                onLoadingComplete={(image) => image.classList.remove('animate-pulse')}
                sizes="100vw" alt={"project_1"}
                className='animate-pulse bg-slate-500 min-h-screen'
                style={{ width: '100vw', height: 'auto'}}/>
        </div>
    );
}

/** Every project in one grid (/projects). */
function Portfolio() {
    const { setActiveSection } = useActiveSectionContext();

    useEffect(() => setActiveSection("Projects"), [setActiveSection]);

    return (
        <main className="e-main">
            <section data-ground="blue" className="g-blue e-portfolio__hero">
                <div className="e-container">
                    <Reveal>
                        <Link href="/#projects" className="e-portfolio__back">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                <path d="M12 7H2m4-4L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back home
                        </Link>
                    </Reveal>
                    <Reveal>
                        <HandTag>the full archive</HandTag>
                    </Reveal>
                    <SplitHeading
                        as="h1"
                        className="e-portfolio__title"
                        lines={[{ text: "My portfolio,", block: true }, { text: "every project", className: "is-soft", block: true }]}
                    />
                    <Reveal delay={1} as="p" className="e-lead mt-7">
                        {projectsData.length} projects across IoT, SaaS, healthcare and nonprofit. From research and flows to
                        high-fidelity design and production front-end. Pick one to see the full story.
                    </Reveal>
                </div>
            </section>

            <section data-ground="ink" className="g-ink e-section">
                <div className="e-container e-portfolio__grid">
                    {projectsData.map((project, i) => (
                        <Reveal key={project.id} delay={(i % 3) as 0 | 1 | 2}>
                            <Project {...project} />
                        </Reveal>
                    ))}
                </div>
            </section>

            <section data-ground="white" className="g-white e-section e-portfolio__cta">
                <div className="e-container">
                    <SplitHeading lines={[{ text: "Like what you see?" }]} />
                    <Reveal delay={1} as="p" className="e-lead mx-auto mt-6">
                        I&apos;m open to new roles and freelance projects. Tell me what you&apos;re building.
                    </Reveal>
                    <Reveal delay={2} className="mt-8 flex justify-center">
                        <ArrowButton variant="blue" href="/#contact">Get in touch</ArrowButton>
                    </Reveal>
                </div>
            </section>
        </main>
    );
}

export default function Projects() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    return id !== null ? <ProjectImage id={parseInt(id)} /> : <Portfolio />;
}
