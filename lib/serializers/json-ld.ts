import type { Profile } from "@/content/profile.types";

export const jsonLd = (p: Profile, site: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site}/#person`,
      name: p.header.name,
      jobTitle: p.header.title.split(" · ")[0],
      email: `mailto:${p.header.email}`,
      url: site,
      image: `${site}/photo.png`,
      worksFor: { "@type": "Organization", name: p.experience[0].company },
      address: {
        "@type": "PostalAddress",
        addressLocality: p.header.city,
        addressCountry: p.header.countryCode,
      },
      sameAs: [p.header.linkedin, p.header.github],
      knowsAbout: p.skills.slice(0, 4).flatMap((g) => g.items.slice(0, 2)),
      knowsLanguage: p.languages.map((l) => l.name),
      alumniOf: { "@type": "CollegeOrUniversity", name: p.education[0].where },
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
