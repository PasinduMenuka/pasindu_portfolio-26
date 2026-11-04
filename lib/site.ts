// Single source for SEO identity. Change SITE_URL here when a custom domain is added.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://pasindu.vercel.app").replace(/\/$/, "");

export const PERSON = {
  name: "Pasindu Sannasuriya",
  shortName: "Pasindu",
  jobTitle: "Senior UI/UX Engineer & Product Designer",
  email: "sannasuriyapm@gmail.com",
  country: "Sri Lanka",
  image: "/hero-portrait.png",
  // Public profiles that should be linked to this site (Google uses these to connect the name).
  // Fill in the real profile URLs; empty entries are skipped.
  linkedin: "https://www.linkedin.com/in/pasindu-sannasuriya-245a98113/",
  github: "https://github.com/PasinduMenuka",
  sameAs: [
    "https://www.linkedin.com/in/pasindu-sannasuriya-245a98113/",
    "https://github.com/PasinduMenuka",
    // "https://www.behance.net/<your-handle>",
    // "https://dribbble.com/<your-handle>",
  ] as string[],
  knowsAbout: [
    "UI/UX Design",
    "Product Design",
    "Figma",
    "Design Systems",
    "IoT Dashboard Design",
    "E-commerce UX",
    "POS UX",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "AI-assisted design and development",
  ],
};

export const SITE_TITLE = `${PERSON.name} – Senior UI/UX Engineer & Product Designer`;
export const SITE_DESCRIPTION =
  "Pasindu Sannasuriya is a Senior UI/UX Engineer and Product Designer from Sri Lanka with 5+ years designing and building IoT dashboards, e-commerce and POS products in Figma, Next.js and React.";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON.name,
        alternateName: PERSON.shortName,
        jobTitle: PERSON.jobTitle,
        url: SITE_URL,
        image: `${SITE_URL}${PERSON.image}`,
        email: `mailto:${PERSON.email}`,
        address: { "@type": "PostalAddress", addressCountry: "LK" },
        nationality: PERSON.country,
        knowsAbout: PERSON.knowsAbout,
        ...(PERSON.sameAs.length ? { sameAs: PERSON.sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: PERSON.name,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#person` },
        inLanguage: "en",
      },
    ],
  };
}
