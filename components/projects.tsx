"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import Image from "next/image";
import { useSectionInView } from "@/lib/hooks";
import { useRouter } from 'next/navigation'

export default function Projects() {

    const router = useRouter();
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
        {/*<Image src={"/case_study.svg"} width={1200} height={2000} alt={"projects"}/>*/}
      <SectionHeading>My projects</SectionHeading>
      <div>
        {projectsData.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />

          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
