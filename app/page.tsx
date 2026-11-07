import { About } from "@/components/About";
import { Backdrop } from "@/components/Backdrop";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Featured } from "@/components/Featured";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Leadership } from "@/components/Leadership";
import { Nav } from "@/components/Nav";
import { ResearchSnippet } from "@/components/ResearchSnippet";
import { Stats } from "@/components/Stats";
import { Work } from "@/components/Work";
import { about, honors, site } from "@/content/site";

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
  knowsAbout: [...site.focus, ...about.research],
  knowsLanguage: ["English", "Spanish"],
  award: honors.map((h) => h.title),
  identifier: { "@type": "PropertyValue", propertyID: "ORCID", value: "0009-0009-5492-0076" },
  sameAs: [site.links.linkedin, site.links.github, site.links.orcid, site.links.scholar, site.links.researchgate].filter(
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
        <Featured />
        <Work />
        <ResearchSnippet />
        <Experience />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
