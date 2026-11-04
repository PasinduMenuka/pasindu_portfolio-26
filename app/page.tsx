import About from "@/components/about";
import Collaborations from "@/components/collaborations";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import ProjectInvolvement from "@/components/project-involvement";
import Projects from "@/components/projects";
import Skills from "@/components/skills";

export const metadata = {
    title: "Pasindu Sannasuriya | Personal Portfolio",
    description: "Pasindu is a Senior UI/UX Engineer, Senior Web Developer, and AI-driven Product Designer with 5+ years of experience.",
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
      <ProjectInvolvement />
      <Contact />
    </main>
  );
}
