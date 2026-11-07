// All site copy lives here so it can be edited without touching components.
// Items marked DRAFT are placeholders written from project names only:
// replace them with real descriptions, dates and links.

export const site = {
  name: "Diego Caputo",
  role: "Industrial & Systems Engineer",
  location: "Auburn, Alabama",
  url: "https://diegocaputo.com",
  headline: "I make complex operations simple to run.",
  intro:
    "Lean and continuous improvement at Auburn University, from plant-floor diagnostics to research.",
  focus: ["Lean", "Continuous improvement", "Process design", "Operations"],
  links: {
    github: "https://github.com/diegocaputo9",
    linkedin: "", // TODO: add LinkedIn profile URL
    email: "", // TODO: add a public email (e.g. hello@diegocaputo.com via Namecheap forwarding)
    resume: "", // TODO: drop resume.pdf into /public and set "/resume.pdf"
  },
};

export type Project = {
  title: string;
  kind: string;
  summary: string;
  year?: string;
  href?: string;
  size: "lg" | "md" | "sm";
  visual: "grid" | "rings" | "bars" | "flow";
};

// DRAFT: titles come from your project folders; summaries need your words.
export const projects: Project[] = [
  {
    title: "Sawmill plant diagnostic",
    kind: "Industry project",
    summary: "A plant-wide diagnostic of a sawmill operation: flow, constraints and where to improve first.",
    size: "lg",
    visual: "flow",
  },
  {
    title: "Lego Lab",
    kind: "Dissertation research",
    summary: "Research lab work behind my dissertation.",
    size: "md",
    visual: "grid",
  },
  {
    title: "Rural Partnership Institute",
    kind: "Auburn University",
    summary: "Engineering support for rural partners through Auburn's Rural Partnership Institute.",
    size: "md",
    visual: "rings",
  },
  {
    title: "Continuous Improvement & OpEx",
    kind: "Operational excellence",
    summary: "Lean tools and continuous improvement programs applied to real operations.",
    size: "lg",
    visual: "bars",
  },
];

export const about = {
  // DRAFT: rewrite in your own voice.
  body: "I'm an industrial and systems engineer focused on lean and continuous improvement. I like walking the floor, measuring what actually happens, and turning it into processes people can run without friction.",
  pillars: [
    { title: "See the system", text: "Map the real flow before changing anything." },
    { title: "Measure honestly", text: "Data from the floor, not from assumptions." },
    { title: "Improve in small steps", text: "Kaizen over big-bang redesigns." },
    { title: "Make it stick", text: "Standard work and visual management that teams own." },
  ],
};
