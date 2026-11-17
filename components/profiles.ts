import { site } from "@/content/site";
import { OrcidIcon, ResearchGateIcon, ScholarIcon, WebOfScienceIcon } from "./BrandIcons";

// Academic profiles; entries with an empty link in content/site.ts are hidden.
export const academicProfiles = [
  { label: "ORCID", href: site.links.orcid, Icon: OrcidIcon },
  { label: "Web of Science", href: site.links.webofscience, Icon: WebOfScienceIcon },
  { label: "Google Scholar", href: site.links.scholar, Icon: ScholarIcon },
  { label: "ResearchGate", href: site.links.researchgate, Icon: ResearchGateIcon },
].filter((p) => p.href);
