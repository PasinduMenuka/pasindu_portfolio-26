import type { MetadataRoute } from "next";
import { projectsData } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified },
    { url: `${SITE_URL}/projects`, lastModified },
    ...projectsData.map((p) => ({ url: `${SITE_URL}/projects/${p.id}`, lastModified })),
  ];
}
