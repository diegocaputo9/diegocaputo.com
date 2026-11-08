import { About } from "@/components/About";
import { Backdrop } from "@/components/Backdrop";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Featured } from "@/components/Featured";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Leadership } from "@/components/Leadership";
import { Nav } from "@/components/Nav";
import { Outside } from "@/components/Outside";
import { ResearchSnippet } from "@/components/ResearchSnippet";
import { Stats } from "@/components/Stats";
import { Speaking } from "@/components/Speaking";
import { Work } from "@/components/Work";
import { about, credentials, honors, outside, site } from "@/content/site";

// schema.org Person: lets Google show a knowledge-panel style result for your name.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.title,
  affiliation: { "@type": "CollegeOrUniversity", name: site.org },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Auburn University" },
    { "@type": "CollegeOrUniversity", name: "Pontificia Universidad Católica Madre y Maestra" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Auburn", addressRegion: "AL", addressCountry: "US" },
  knowsAbout: [...site.focus, ...about.research, "Drone photogrammetry", "Thermal imaging"],
  knowsLanguage: ["English", "Spanish"],
  award: honors.map((h) => h.title),
  // earned credentials only (the Villanova Black Belt starts in 2027)
  hasCredential: credentials
    .filter((c) => !c.status)
    .map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.kind === "cert" ? `Graduate Certificate, ${c.title}` : c.title,
      credentialCategory: c.kind === "cert" ? "Graduate certificate" : "Certification",
      recognizedBy: c.kind === "badge"
        ? [
            { "@type": "CollegeOrUniversity", name: "Auburn University" },
            { "@type": "CollegeOrUniversity", name: "Technische Hochschule Würzburg-Schweinfurt (THWS)" },
          ]
        : { "@type": "CollegeOrUniversity", name: "Auburn University" },
    })),
  identifier: { "@type": "PropertyValue", propertyID: "ORCID", value: "0009-0009-5492-0076" },
  sameAs: [site.links.linkedin, site.links.github, site.links.orcid, site.links.scholar, site.links.researchgate, outside.brand.youtube.href].filter(
    Boolean,
  ),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Backdrop />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Stats />
        <Speaking />
        <Featured />
        <Work phoneLimit={1} />
        <ResearchSnippet />
        <Experience phoneLimit={3} />
        <Leadership />
        <Outside />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
