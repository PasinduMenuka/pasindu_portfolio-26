import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectsListing from "@/components/projects-listing";
import { PERSON } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects & UI/UX Case Studies",
  description: `UI/UX case studies and front-end builds by ${PERSON.name}: IoT energy dashboards, e-commerce revamps, gift cards and POS systems, designed in Figma and built with Next.js.`,
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: `Projects & UI/UX Case Studies | ${PERSON.name}` },
};

export default function Page() {
  return (
    <Suspense>
      <ProjectsListing />
    </Suspense>
  );
}
