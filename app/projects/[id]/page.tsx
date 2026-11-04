import type { Metadata } from "next";
import ProjectCaseStudyPage from "@/components/project-page";
import { projectsData } from "@/lib/data";
import { PERSON, SITE_URL } from "@/lib/site";

type Props = { params: { id: string } };

const findProject = (id: string) => projectsData.find((p) => String(p.id) === id);

export function generateStaticParams() {
  return projectsData.map((p) => ({ id: String(p.id) }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = findProject(params.id);
  if (!project) return { title: "Project not found", robots: { index: false } };

  const title = "hasDetailedCaseStudy" in project && project.hasDetailedCaseStudy
    ? `${project.title} – ${project.category} UI/UX Case Study`
    : `${project.title} – ${project.category}`;
  const description = `${project.description.slice(0, 150).trim()}… A project by ${PERSON.name}.`;
  const image = (project.imageUrl as { src?: string })?.src;
  const url = `/projects/${project.id}`;

  return {
    title,
    description,
    keywords: [PERSON.name, project.title, project.category, ...project.tags],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} | ${PERSON.name}`,
      description,
      authors: [PERSON.name],
      ...(image ? { images: [{ url: image, alt: `${project.title} by ${PERSON.name}` }] } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title} | ${PERSON.name}`, description, ...(image ? { images: [image] } : {}) },
  };
}

export default function Page({ params }: Props) {
  const project = findProject(params.id);
  const image = (project?.imageUrl as { src?: string } | undefined)?.src;
  const jsonLd = project && {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.description,
    genre: project.category,
    keywords: project.tags.join(", "),
    url: `${SITE_URL}/projects/${project.id}`,
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
    author: { "@id": `${SITE_URL}/#person`, "@type": "Person", name: PERSON.name, url: SITE_URL },
  };
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <ProjectCaseStudyPage />
    </>
  );
}
