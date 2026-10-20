"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { projectsData } from "@/lib/data";
import { ArrowIcon } from "@/components/arrow-button";

type ProjectProps = (typeof projectsData)[number] & { hasDetailedCaseStudy?: boolean };

export default function Project({ id, title, category, summary, imageUrl, hasDetailedCaseStudy }: ProjectProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="e-card"
      onClick={() => router.push(hasDetailedCaseStudy ? `/projects/${id}` : `/projects?id=${id}`)}
    >
      <div className="e-card__media">
        <Image src={imageUrl} alt={`${title} project preview`} fill sizes="(max-width: 768px) 82vw, 28vw" quality={85} />
        <span className="e-card__badge">
          View {hasDetailedCaseStudy ? "case study" : "project"}
          <ArrowIcon />
        </span>
      </div>
      <div className="e-card__meta">
        <h3 className="e-card__title">{title}</h3>
        <span className="e-card__tag e-mono">{category}</span>
      </div>
      <p className="e-card__summary">{summary}</p>
    </button>
  );
}
