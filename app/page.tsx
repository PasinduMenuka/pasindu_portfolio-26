import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import About from "@/components/about";
import Collaborations from "@/components/collaborations";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import Skills from "@/components/skills";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="e-main">
      <Intro />
      <About />
      <Projects />
      <Collaborations />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
