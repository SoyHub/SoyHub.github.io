import type { Profile } from "@/content/profile.types";

export const jsonLd = (p: Profile, site: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site}/#person`,
      name: p.header.name,
      jobTitle: "Full-Stack Engineer",
      email: `mailto:${p.header.email}`,
      url: site,
      image: `${site}/photo.png`,
      worksFor: { "@type": "Organization", name: "Capgemini" },
      address: { "@type": "PostalAddress", addressLocality: "Turin", addressCountry: "IT" },
      sameAs: [p.header.linkedin, p.header.github],
      knowsAbout: [
        "Java",
        "Spring Boot",
        "React Native",
        "Kubernetes",
        "Legacy modernisation",
        "LLM tooling",
      ],
      knowsLanguage: ["ar", "en", "it", "ru"],
      alumniOf: { "@type": "CollegeOrUniversity", name: "University of the People" },
    },
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: site,
      name: p.header.name,
      author: { "@id": `${site}/#person` },
      inLanguage: "en",
    },
  ],
});
