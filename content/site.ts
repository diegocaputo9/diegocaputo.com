// All site copy lives here so it can be edited without touching components.
// Sources: resume + academic CV (Nov 2026), lab notes, tigermotorslean.com.

export const site = {
  name: "Diego Caputo",
  role: "Industrial & Systems Engineer",
  title: "PhD Candidate, Industrial & Systems Engineering",
  org: "Auburn University",
  location: "Auburn, Alabama",
  url: "https://diegocaputo.com",
  headline: "Lean systems, taught on the floor and built with AI.",
  intro:
    "PhD candidate at Auburn University. I teach lean manufacturing, lead improvement projects, and build AI-assisted tools for industrial engineering.",
  focus: ["Lean manufacturing", "Six Sigma / DMAIC", "AI in industrial engineering", "Engineering education"],
  // Cloudflare Web Analytics site tag (public, it ships in the page HTML)
  cfAnalyticsToken: "65d6b6c92bab4c4ea35b1b1d99d177dc",
  links: {
    linkedin: "https://www.linkedin.com/in/diegorcaputo/",
    github: "https://github.com/diegocaputo9",
    email: "", // left empty on purpose: add a public address to show an Email button
    resume: "", // drop resume.pdf into /public and set "/resume.pdf" to show a Résumé button
  },
};

// Real figures from resume, CV and notes.
export const stats = [
  { value: "10", unit: "years", label: "across engineering, data and instruction" },
  { value: "60-80", unit: "students", label: "taught per semester in Lean Systems" },
  { value: "170→230", unit: "members", label: "SME chapter growth as president" },
  { value: "2", unit: "countries", label: "Lean Six Sigma programs led abroad" },
];

export const featured = {
  title: "Tiger Motors Lean Education Center",
  kind: "Featured project",
  href: "https://tigermotorslean.com",
  image: "/work/tiger-motors.jpg",
  summary:
    "An immersive digital learning environment for Auburn's 4,000 sq ft Integrated Manufacturing Facility, a lab that simulates high-volume automotive production.",
  points: [
    "360° tours of the lab and of students running the production system",
    "Learning modules organized around the Lean House, with a completion certificate",
    "Supported by the NSF IUSE: EDU program (DUE 2417082)",
    "Used by industry and academic partners such as Honda, GE Aerospace and Brose",
  ],
};

export type Project = {
  title: string;
  kind: string;
  summary: string;
  year: string;
  size: "lg" | "md";
  visual: "plant" | "germany" | "ai" | "asrs" | "standard" | "app";
};

export const projects: Project[] = [
  {
    title: "Lean Six Sigma Green Belt abroad",
    kind: "Program director",
    year: "2025-2026",
    summary:
      "Led an international Green Belt program in Germany and Pamplona, Spain: instruction, industry partnerships and student DMAIC projects, including a vacuum production line at BSH Bosch.",
    size: "lg",
    visual: "germany",
  },
  {
    title: "Sawmill process diagnostics",
    kind: "AURPI research",
    year: "Ongoing",
    summary:
      "Mapped and assessed continuous process manufacturing, including sawmill operations, to find improvement opportunities for Auburn's Rural Partnership Institute.",
    size: "md",
    visual: "plant",
  },
  {
    title: "AI-assisted engineering tools",
    kind: "Software",
    year: "Ongoing",
    summary:
      "Websites, data utilities, Lean and 5S templates and teaching platforms in Python and R, built with AI-assisted development workflows.",
    size: "md",
    visual: "ai",
  },
  {
    title: "Senior design advising",
    kind: "Capstone projects",
    year: "Spring 2026",
    summary:
      "Advised teams optimizing ASRS material handling routes, and building standard work, validation against customer demand and barcode integration for a manufacturing cell.",
    size: "lg",
    visual: "asrs",
  },
  {
    title: "Lab standard work system",
    kind: "Lean lab operations",
    year: "Summer 2024",
    summary:
      "Built a centralized, standardized library of run instructions for every lab, the foundation of TA standard work. Supervised contractors installing the new lab floor.",
    size: "md",
    visual: "standard",
  },
  {
    title: "ChapterCore",
    kind: "INCOSE Systems Showdown winner",
    year: "2026",
    summary:
      "A centralized management platform for student organizations: communication, records and leadership handovers in one app, with attendance-based points that reward engagement. First place out of Auburn's student teams.",
    size: "md",
    visual: "app",
  },
];

export type Role = {
  role: string;
  org: string;
  place: string;
  period: string;
  points: string[];
};

export const experience: Role[] = [
  {
    role: "Graduate Research Assistant",
    org: "Auburn University",
    place: "Auburn, AL",
    period: "2022 - Present",
    points: [
      "Immersive 360° training modules for an NSF-funded digital manufacturing education project",
      "Process mapping and assessment of sawmills for the Rural Partnership Institute",
      "Systematic literature reviews for dissertation and journal manuscripts",
    ],
  },
  {
    role: "Graduate Teaching Assistant, Lean Systems",
    org: "Auburn University (INSY 5800/6800)",
    place: "Auburn, AL",
    period: "2022 - Present",
    points: [
      "Lab lead for 5S, Kaizen and manufacturing cell labs; production run pre/post discussions",
      "Lectures and simulations on 5S, Kanban, JIT, SMED, Heijunka, A3 and the 7 wastes",
      "Kaizen advising that helped student projects raise OEE to target",
    ],
  },
  {
    role: "Program Director, Lean Six Sigma Green Belt",
    org: "Auburn University Abroad",
    place: "Germany & Spain",
    period: "2025 - 2026",
    points: [
      "Designed a 3-week Lean Six Sigma module with a full DMAIC project and deliverables",
      "Led a Six Sigma project on a BSH Bosch vacuum production line",
    ],
  },
  {
    role: "AI Trainer Specialist",
    org: "Outlier",
    place: "Remote",
    period: "2024 - 2025",
    points: [
      "Trained and evaluated AI models, checking engineering accuracy of outputs against quality guidelines",
    ],
  },
  {
    role: "Data Specialist",
    org: "Bank Superintendence",
    place: "Dominican Republic",
    period: "2021 - 2022",
    points: [
      "Executive dashboards for senior leadership",
      "Reusable ETL pipelines that cut about one week from each reporting cycle",
    ],
  },
  {
    role: "Systems Engineer II",
    org: "Claro Dominicana",
    place: "Dominican Republic",
    period: "2017 - 2021",
    points: ["Analyzed and automated service provisioning processes"],
  },
  {
    role: "Production Supervisor",
    org: "IE Industrial Electric",
    place: "Dominican Republic",
    period: "2016 - 2017",
    points: ["Supervised about 50 operators against production, safety and quality targets"],
  },
];

export const leadership = [
  {
    title: "President, SME Auburn",
    period: "2025 - 2026",
    text: "Grew membership from 170 to 230, doubled the officer board from 5 to 10, raised $8,000+ in funding and grants, and organized 6+ events. Now graduate advisor.",
  },
  {
    title: "Vice President, SHPE Auburn",
    period: "2023 - 2024",
    text: "Society of Hispanic Professional Engineers, Auburn University chapter.",
  },
  {
    title: "Industry and outreach",
    period: "2022 - 2026",
    text: "Took the Lean Systems class to a Kia plant visit. Lab tours for E-Day, visiting candidates, a DoD panel and Boy Scouts training day. Senior design judge for 4 teams.",
  },
];

// Coverage by Auburn Engineering news.
export const news = [
  {
    title: "ISE grad student wins Systems Showdown competition",
    date: "Apr 2026",
    source: "Auburn Engineering",
    href: "https://eng.auburn.edu/news/2026/04/ise-grad-student-wins-systems-showdown-competition",
    note: "First place at INCOSE's Systems Showdown with ChapterCore, a platform for running student organizations.",
  },
  {
    title: "Auburn Engineering hosts continuous improvement industry roundtable",
    date: "Jun 2024",
    source: "Auburn Engineering",
    href: "https://eng.auburn.edu/news/2024/06/auburn-engineering-hosts-continuous-improvement-industry-roundtable.html",
    note: "Leaders from Honda, Holcim, Brose, Navistar and others on building an operational excellence culture.",
  },
  {
    title: "ISE graduate student presented Lean Engineering Award",
    date: "Feb 2023",
    source: "Auburn Engineering",
    href: "https://eng.auburn.edu/news/2023/02/ise-graduate-student-presented-lean-engineering-award",
    note: "Named the 2022 JT Black Lean Engineering Student of the Year.",
  },
];

export const education = [
  { degree: "PhD, Industrial & Systems Engineering", school: "Auburn University", year: "Expected 2027" },
  { degree: "MS, Industrial & Systems Engineering", school: "Auburn University", year: "2026" },
  { degree: "Master of Engineering Management", school: "Auburn University", year: "2023" },
  { degree: "BS, Industrial Engineering", school: "PUCMM, Dominican Republic", year: "2017" },
];

export const honors: { title: string; year: string; href?: string }[] = [
  {
    title: "Winner, INCOSE Systems Showdown",
    year: "2026",
    href: "https://eng.auburn.edu/news/2026/04/ise-grad-student-wins-systems-showdown-competition",
  },
  {
    title: "JT Black Lean Engineering Student of the Year",
    year: "2022",
    href: "https://eng.auburn.edu/news/2023/02/ise-graduate-student-presented-lean-engineering-award",
  },
  { title: "IPC Scholarship", year: "2023, 2024, 2025" },
  { title: "Lean Six Sigma Green Belt", year: "Auburn University" },
];

export const about = {
  body: "I grew up in a family of engineers and started my career in the Dominican Republic. Now I'm finishing a PhD at Auburn on how lean manufacturing is taught and evaluated. I've supervised a plant floor, built data pipelines for a bank regulator, and today I teach lean inside a working automotive learning lab.",
  ai: "I use AI the way a good engineer uses any tool: to see the system faster. That means AI-assisted software for analysis and training, evaluating models for technical accuracy, and teaching engineers to use it with judgment.",
  research: [
    "Lean manufacturing training and evaluation",
    "Continuous improvement and operational excellence",
    "AI applications in industrial engineering",
    "Digital and experiential manufacturing education",
  ],
  languages: "English and Spanish",
};
