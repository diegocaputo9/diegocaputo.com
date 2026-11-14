// All site copy lives here so it can be edited without touching components.
// Sources: resume + academic CV (Nov 2026), lab notes, tigermotorslean.com.

export const site = {
  name: "Diego Caputo",
  role: "Industrial & Systems Engineer",
  title: "PhD Student, Industrial & Systems Engineering",
  org: "Auburn University",
  location: "Auburn, Alabama",
  url: "https://diegocaputo.com",
  // Shown as the big quote in the hero. Replace with Diego's own words any time.
  headline: "Lean systems, taught on the floor and built with AI.",
  // Hero portrait: a cut-out headshot (transparent background, WebP or PNG,
  // about 900 x 1125) in /public, e.g. "/portrait.webp". Empty = placeholder.
  portrait: "",
  intro:
    "PhD student at Auburn University. I teach lean manufacturing, lead improvement projects, and build AI-assisted tools for industrial engineering.",
  focus: ["Lean manufacturing", "Six Sigma / DMAIC", "AI in industrial engineering", "Engineering education"],
  // Cloudflare Web Analytics site tag (public, it ships in the page HTML)
  cfAnalyticsToken: "65d6b6c92bab4c4ea35b1b1d99d177dc",
  links: {
    linkedin: "https://www.linkedin.com/in/diegorcaputo/",
    github: "https://github.com/diegocaputo9",
    orcid: "https://orcid.org/0009-0009-5492-0076",
    scholar: "", // TODO: Google Scholar profile URL (shows automatically once set)
    researchgate: "", // TODO: ResearchGate profile URL (shows automatically once set)
    email: "hello@diegocaputo.com", // Namecheap forwarder to his Gmail (Gmail itself stays private)
    resume: "/Diego-Caputo-Resume.pdf", // built from resume/resume.html (no phone, no Gmail)
  },
  // "Invite me to speak" form: FormSubmit emails the entries to hello@ (the
  // first submission sends a one-time activation email there)
  inviteEndpoint: "https://formsubmit.co/ajax/hello@diegocaputo.com",
};

// Shown in the hero. Official names checked Nov 2026: Auburn ISE graduate
// certificate (bulletin.auburn.edu) and Villanova's Lean Six Sigma Black Belt
// (villanova.edu professional studies).
export const credentials: {
  mark: string;
  kind: "green" | "black" | "cert" | "badge";
  title: string;
  issuer: string;
  status?: string;
  /** photo of the certificate (PDF), opened in the site's PDF viewer */
  href?: string;
}[] = [
  {
    mark: "/work/international-green-belt-badge.webp",
    kind: "badge",
    title: "International Lean Six Sigma Green Belt",
    issuer: "Auburn University & THWS, Germany 2026",
  },
  {
    mark: "/work/auburn-green-belt-badge.webp",
    kind: "badge",
    title: "Lean Six Sigma Green Belt",
    issuer: "Auburn University, Dec 2023",
    href: "/certificates/auburn-lean-six-sigma-green-belt-2023.pdf",
  },
  {
    mark: "/work/villanova-v.svg",
    kind: "badge",
    title: "Lean Six Sigma Black Belt",
    issuer: "Villanova University",
    status: "Starts 2027",
  },
  {
    mark: "",
    kind: "cert",
    title: "Modeling and Data Analytics",
    issuer: "Graduate certificate, Auburn University, Aug 2025",
    href: "/certificates/auburn-modeling-and-data-analytics-certificate-2025.pdf",
  },
];

// Real figures from resume, CV and notes.
export const stats = [
  { value: "10", unit: "years", label: "across engineering, data and instruction" },
  { value: "60-80", unit: "students", label: "taught per semester in Lean Systems" },
  { value: "170→230", unit: "members", label: "SME chapter growth as president" },
  { value: "3", unit: "countries", label: "with Lean Six Sigma programs: USA, Germany, Spain" },
];

// "Teaching & speaking" band under the stats. Originals live in /Photos (gitignored).
export const speaking = {
  title: "Teaching & speaking",
  lede: "In Auburn's Lean Systems course I run every lab and give lectures each semester for 60 to 80 engineers, and I present research and products to academic and industry audiences.",
  cta: { label: "Invite me to speak" },
  // interactive 3D lesson (components/FlowLab.tsx): the classic one-piece flow exercise
  lesson: {
    title: "A lean lesson you can run",
    teaser: "One-piece flow against batches, in 3D",
    text: "Ten parts, three stations, one minute per step. The two lines differ in one thing only: how many parts move at a time. Watch when the first part comes out, and when the whole order is done.",
    tags: ["One-piece flow", "Batch and queue", "Lead time", "Work in process"],
  },
  photos: [
    {
      name: "lean-lecture",
      width: 2000,
      height: 1125,
      position: "50% 55%",
      alt: "Diego Caputo lecturing on the 7 wastes of lean in an Auburn lecture hall",
      kicker: "Teaching",
      title: "Lean Systems lecture: the 7 wastes",
      meta: "Auburn University, INSY 5800/6800",
    },
    {
      name: "systems-showdown",
      width: 2000,
      height: 1333,
      position: "44% 40%",
      alt: "Diego Caputo presenting ChapterCore at the INCOSE Systems Showdown",
      kicker: "Speaking",
      title: "ChapterCore pitch, INCOSE Systems Showdown",
      meta: "First place, 2026",
    },
  ],
};

export const featured = {
  title: "Tiger Motors Lean Education Center",
  kind: "Featured project",
  role: "Lead Platform Developer",
  grant: "$400K NSF grant", // award 2417082: $399,694 estimated total (api.nsf.gov)
  href: "https://tigermotorslean.com",
  image: "/work/tiger-motors-1456.webp",
  imageSet: "/work/tiger-motors-800.webp 800w, /work/tiger-motors-1456.webp 1456w",
  // one exact 28.068 s cycle of the site's hero animation, recorded frame by frame
  video: "/work/tiger-motors-loop.mp4", // 1200 px, 2.9 MB, lazy-loaded
  summary:
    "An immersive digital learning environment for Auburn's 4,000 sq ft Integrated Manufacturing Facility, a lab that simulates high-volume automotive production.",
  points: [
    "Designed and developed the platform end to end, from the site to the learning modules",
    "360° tours of the lab and of students running the production system",
    "Learning modules organized around the Lean House, with a completion certificate",
    "Funded by a $400,000 NSF IUSE: EDU grant (DUE-2417082)",
    "Used by industry and academic partners such as Honda, GE Aerospace and Brose",
  ],
};

// A photo or figure opened in the full-screen viewer (components/Gallery).
export type GalleryItem = {
  thumb: string; // small file shown on the card
  thumbSet?: string; // responsive variants of the thumb (hero only)
  src: string; // full-size file, loaded only when the viewer opens
  alt: string;
  caption: string;
  short?: string; // label under a strip thumbnail
  position?: string; // object-position for cropped thumbnails
  width: number;
  height: number;
};

export type Project = {
  title: string;
  kind: string;
  summary: string;
  year: string;
  size: "lg" | "md";
  visual: "plant" | "germany" | "ai" | "asrs" | "standard" | "app";
  photo?: GalleryItem & { credit: string }; // fills the card's visual slot
  gallery?: { label: string; items: GalleryItem[]; wide?: boolean }; // thumbnails under the text (wide: one full-width figure)
  image?: {
    src: string;
    srcSet: string;
    alt: string;
    credit: string;
    width: number;
    height: number;
    // whole page, opened from the thumbnail; preview loads first, src only on demand
    full: { preview: string; src: string; alt: string; width: number; height: number };
  };
  badge?: { src: string; alt: string };
  press?: { outlet: string; title: string; date: string; href: string };
};

export const projects: Project[] = [
  {
    title: "Lean Six Sigma Green Belt programs",
    kind: "Program Director",
    year: "Ongoing",
    summary:
      "Green Belt programs in the United States, Germany and Spain: instruction, industry partnerships and student DMAIC projects, including a vacuum production line at BSH Bosch. Germany 2026 graduates earned the International Lean Six Sigma Green Belt, issued by Auburn and THWS. 2027: Italy, Germany and Spain with new partner companies.",
    size: "lg",
    visual: "germany",
    image: {
      src: "/work/germany-2026-mainpost-1280.webp",
      srcSet: "/work/germany-2026-mainpost-640.webp 640w, /work/germany-2026-mainpost-1280.webp 1280w",
      alt: "Newspaper clipping from the Rhön- und Saalepost: the Auburn Germany 2026 cohort in front of the Pax Bräu brewery in Oberelsbach",
      credit: "Rhön- und Saalepost, 11 June 2026. Photo: Markus Büttner",
      width: 1280,
      height: 513,
      full: {
        preview: "/work/germany-2026-newspaper-720.webp",
        src: "/work/germany-2026-newspaper-3000.webp",
        alt: "Front page of the Rhön- und Saalepost, 11 June 2026, with the article “Prozess-Turbo in einer kleinen Brauerei” about the Auburn cohort",
        width: 3000,
        height: 4000,
      },
    },
    badge: {
      src: "/work/international-green-belt-badge.webp",
      alt: "International Lean Six Sigma Green Belt badge, issued by Auburn University and THWS",
    },
    press: {
      outlet: "Main-Post",
      title: "Prozess-Turbo durch US-Team: Für Pax Bräu in Oberelsbach werden schnelle Lösungen gefunden",
      date: "June 2026",
      href: "https://www.mainpost.de/rhoengrabfeld/kreuzberg/oberelsbach-prozess-turbo-in-oberelsbach-us-team-nimmt-pax-braeu-unter-die-lupe-und-findet-schnelle-loesungen-2-114220703",
    },
    // From the team's Define/Measure report (Summer 2026). The Define storyboard is
    // left out on purpose: it shows BSH cost-per-defect, volumes and an ERP screen.
    gallery: {
      label: "BSH Bosch project · Define & Measure",
      items: [
        {
          thumb: "/work/bosch/team-thumb.webp",
          src: "/work/bosch/team.webp",
          alt: "Diego Caputo and Auburn Green Belt students in safety vests on the BSH Bosch injection molding floor",
          caption: "The project team on the BSH Bosch production floor, Germany 2026",
          short: "Project team",
          width: 1024,
          height: 768,
        },
        {
          thumb: "/work/bosch/measure-thumb.webp",
          src: "/work/bosch/measure.webp",
          alt: "Measure phase storyboard: key metrics, baseline findings, defect category breakdown and current state process map",
          caption: "Measure storyboard: key metrics, baseline findings and current state",
          short: "Measure storyboard",
          width: 2048,
          height: 1152,
        },
        {
          thumb: "/work/bosch/process-map-thumb.webp",
          src: "/work/bosch/process-map.webp",
          alt: "Current state process map of the injection molding line, from material prep through startup validation to good output and regrind",
          caption: "Current state process map of the injection molding line",
          short: "Process map",
          width: 938,
          height: 1330,
        },
        {
          thumb: "/work/bosch/pareto-thumb.webp",
          src: "/work/bosch/pareto.webp",
          alt: "Pareto chart of defect categories, with potential streak-related defects highlighted in red",
          caption: "Pareto of defect categories, streak-related defects highlighted",
          short: "Defect Pareto",
          width: 810,
          height: 899,
        },
      ],
    },
  },
  {
    title: "Sawmill process diagnostics",
    kind: "AURPI research",
    year: "Ongoing",
    summary:
      "Mapped and assessed continuous process manufacturing, including sawmill operations, to find improvement opportunities for Auburn's Rural Partnership Institute.",
    size: "md",
    visual: "plant",
    photo: {
      thumb: "/work/sawmill/log-yard-800.webp",
      thumbSet: "/work/sawmill/log-yard-800.webp 800w, /work/sawmill/log-yard-1200.webp 1200w",
      src: "/work/sawmill/log-yard-1200.webp",
      alt: "Aerial view of a sawmill: the log yard with stacked logs and a loader, conveyors, the mill buildings and a rail line",
      caption: "The sawmill and its log yard, where the process flow starts",
      credit: "Partner sawmill, aerial view",
      width: 1200,
      height: 799,
    },
    gallery: {
      label: "Process flow for the VSM",
      wide: true,
      items: [
        {
          thumb: "/work/sawmill/process-flow.webp",
          src: "/work/sawmill/process-flow.webp",
          alt: "Process flow chart in eight steps: log arrival, stem deck and debarker, merchandizer (cycle time 23.4 s per stem), chip and saw line (2.6 s per log), vertical saw and board edging, sorter and stacker, dry kilns (marked as the step that sets the pace) and planer mill",
          caption: "Process flow for the value stream map: eight steps from log arrival to the planer mill; the dry kilns set the pace",
          short: "Eight steps from log arrival to the planer mill. The dry kilns set the pace.",
          width: 1333,
          height: 261,
        },
      ],
    },
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
    photo: {
      thumb: "/work/chaptercore-showdown-800.webp",
      thumbSet: "/work/chaptercore-showdown-800.webp 800w, /work/chaptercore-showdown-1600.webp 1600w",
      src: "/work/chaptercore-showdown-2400.webp",
      alt: "Diego Caputo presenting ChapterCore at the INCOSE Systems Showdown",
      caption: "Presenting ChapterCore at the INCOSE Systems Showdown, 23 March 2026",
      credit: "INCOSE Systems Showdown, 23 March 2026",
      width: 2400,
      height: 1600,
    },
  },
];

export type Role = {
  role: string;
  org: string;
  place: string;
  period: string;
  points: string[];
  // ISO 3166 codes, rendered as flag chips under the points
  countries?: { code: "DE" | "ES" | "US"; name: string }[];
  certificate?: CertRef; // quiet link under the points
  // Longer account shown when the role's "+" is opened.
  // DRAFT written from the résumé and site notes (Nov 2026); Diego will replace it.
  details?: string[];
};

// A certificate PDF in public/certificates, linked (not displayed) where it's relevant.
export type CertRef = { label: string; href: string };

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
    certificate: {
      label: "CITI Responsible Conduct of Research, 2022",
      href: "/certificates/citi-responsible-conduct-of-research-2022.pdf",
    },
    details: [
      "I'm the lead developer of the Tiger Motors Lean Education Center, the NSF-funded (DUE-2417082) learning platform for Auburn's Integrated Manufacturing Facility. I designed and built the site, the 360° lab tours, the Lean House learning modules and the completion certificate.",
      "For the Auburn University Rural Partnership Institute, I map and assess process manufacturing operations such as sawmills and identify where they can improve.",
      "I also run systematic literature reviews for my dissertation and journal manuscripts, and build websites, analytics utilities and teaching tools with AI-assisted development.",
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
    details: [
      "I run every lab in Lean Systems for 60 to 80 engineers each semester, plus summer project cohorts of about 20, in Auburn's 4,000 sq ft Integrated Manufacturing Facility.",
      "In each lab, students run the production line, we discuss the results, they apply a lean tool such as 5S, Kanban or SMED, and then run it again to measure the change.",
      "I also give a couple of lectures each semester, evaluate student work against technical criteria and advise the Kaizen projects.",
    ],
  },
  {
    role: "Program Director, International Lean Six Sigma Green Belt",
    org: "Auburn University",
    place: "USA, Germany & Spain",
    period: "2025 - Present",
    points: [
      "Designed a 3-week Lean Six Sigma module with a full DMAIC project and deliverables",
      "Led a Six Sigma project on a BSH Bosch vacuum production line",
      "Programs run in the United States, Germany and Spain; Italy, Germany and Spain planned for 2027",
    ],
    details: [
      "I designed the three-week Lean Six Sigma module that students complete abroad, built around a full DMAIC project and its deliverables, and I teach it on site.",
      "I handle program logistics and industry partnerships and supervise student improvement projects at partner companies, including a Six Sigma project on a BSH Bosch vacuum production line.",
      "Cohorts ran in Germany and in Pamplona, Spain, in 2025 and 2026. Germany 2026 graduates earned the International Lean Six Sigma Green Belt, issued by Auburn and THWS.",
    ],
    countries: [
      { code: "DE", name: "Germany" },
      { code: "ES", name: "Spain" },
      { code: "US", name: "USA" },
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
    details: [
      "I wrote and reviewed prompts and responses used to train and evaluate AI models, checking the engineering and technical accuracy of their outputs and giving structured feedback against quality guidelines.",
      "The role was remote and self-directed, with set quality standards and deadlines.",
    ],
  },
  {
    role: "Data Specialist",
    org: "Bank Superintendence",
    place: "Dominican Republic",
    period: "2021",
    points: [
      "Executive dashboards for senior leadership",
      "Reusable ETL pipelines that cut about one week from each reporting cycle",
    ],
    details: [
      "I designed executive dashboards that senior leadership used for decision making.",
      "I built reusable ETL pipelines that cut data preparation by about one week in every reporting cycle, using Excel and Power BI.",
    ],
    certificate: {
      label: "Business Intelligence with Excel and Power BI, PUCMM, 2021",
      href: "/certificates/pucmm-business-intelligence-power-bi-2021.pdf",
    },
  },
  {
    role: "Engineer III, Processes",
    org: "Claro Dominicana",
    place: "Dominican Republic",
    period: "2017 - 2021",
    points: [
      "Analyzed and automated service provisioning processes",
      "Started as Senior Process/Data Analyst (2017 - 2018)",
    ],
    details: [
      "I joined Claro as a Senior Process/Data Analyst and was promoted to Engineer III in the processes team in 2018.",
      "I analyzed the provisioning processes for operating system services, assessed requirements and feasibility, and automated steps to make service activation more efficient.",
    ],
  },
  {
    role: "Production Supervisor",
    org: "IE Industrial Electric",
    place: "Dominican Republic",
    period: "2016",
    points: ["Supervised about 50 operators against production, safety and quality targets"],
    details: [
      "I supervised about 50 plant operators against production, safety and quality requirements, and coordinated daily production schedules with limited resources.",
    ],
  },
];

export const leadership: { title: string; period: string; text: string; certificate?: CertRef }[] = [
  {
    title: "President, SME Auburn",
    period: "2025 - 2026",
    text: "Grew membership from 170 to 230, doubled the officer board from 5 to 10, raised $8,000+ in funding and grants, and organized 6+ events. Now graduate advisor.",
  },
  {
    title: "Vice President, SHPE Auburn",
    period: "2023 - 2024",
    text: "Society of Hispanic Professional Engineers, Auburn University chapter.",
    certificate: {
      label: "Certified Chapter Leader, SHPE NILA 2022",
      href: "/certificates/shpe-nila-chapter-leader-2022.pdf",
    },
  },
  {
    title: "Industry and outreach",
    period: "2022 - 2026",
    text: "Took the Lean Systems class to a Kia plant visit. Lab tours for E-Day, visiting candidates, a DoD panel and Boy Scouts training day. Senior design judge for 4 teams.",
  },
];

// Coverage by Auburn Engineering news.
// image: lead photo of each article (og:image), self-hosted as 16:9 WebP in public/news
export const news: {
  title: string;
  date: string;
  source: string;
  href: string;
  note: string;
  image: string;
  imageAlt: string;
  lang?: string;
}[] = [
  {
    title: "Prozess-Turbo durch US-Team: Für Pax Bräu in Oberelsbach werden schnelle Lösungen gefunden",
    date: "Jun 2026",
    source: "Main-Post",
    href: "https://www.mainpost.de/rhoengrabfeld/kreuzberg/oberelsbach-prozess-turbo-in-oberelsbach-us-team-nimmt-pax-braeu-unter-die-lupe-und-findet-schnelle-loesungen-2-114220703",
    note: "The Germany 2026 Lean Six Sigma cohort improved processes at five companies in one week, ending at the Pax Bräu brewery. In German.",
    image: "mainpost",
    imageAlt: "Auburn students and professors in front of the Pax Bräu brewery in Oberelsbach",
    lang: "de",
  },
  {
    title: "ISE grad student wins Systems Showdown competition",
    date: "Apr 2026",
    source: "Auburn Engineering",
    href: "https://eng.auburn.edu/news/2026/04/ise-grad-student-wins-systems-showdown-competition",
    note: "First place at INCOSE's Systems Showdown with ChapterCore, a platform for running student organizations.",
    image: "showdown",
    imageAlt: "Diego Caputo holding the Systems Showdown winner's check with Auburn Engineering faculty",
  },
  {
    title: "Cub Scouts earn modular design badges through ISE lab",
    date: "Mar 2026",
    source: "Auburn Engineering",
    href: "https://eng.auburn.edu/news/2026/03/cub-scouts-earn-modular-design-badges-through-ise-lab",
    note: "Cub Scout Pack 29 earned its Modular Design Adventure badge in the Tiger Motors Lab, building with interchangeable, standardized parts.",
    image: "cubscouts",
    imageAlt: "Cub Scouts holding Lego cars in the Tiger Motors Lab with Diego Caputo, Tom Devall and their den leader",
  },
  {
    title: "Auburn Engineering hosts continuous improvement industry roundtable",
    date: "Jun 2024",
    source: "Auburn Engineering",
    href: "https://eng.auburn.edu/news/2024/06/auburn-engineering-hosts-continuous-improvement-industry-roundtable.html",
    note: "Leaders from Honda, Holcim, Brose, Navistar and others on building an operational excellence culture.",
    image: "roundtable",
    imageAlt: "Industry leaders around a conference table at the continuous improvement roundtable",
  },
  {
    title: "ISE graduate student presented Lean Engineering Award",
    date: "Feb 2023",
    source: "Auburn Engineering",
    href: "https://eng.auburn.edu/news/2023/02/ise-graduate-student-presented-lean-engineering-award",
    note: "Named the 2022 JT Black Lean Engineering Student of the Year.",
    image: "jtblack",
    imageAlt: "Diego Caputo receiving the JT Black Lean Engineering award",
  },
];

// level: graduation-cap rank mark (1 bar bachelor's, 2 master's, 3 doctorate in platinum)
// certificate: graduate certificates get a certificate icon instead of a cap, plus a quiet link to the PDF
export const education: {
  degree: string;
  school: string;
  year: string;
  level: 0 | 1 | 2 | 3;
  certificate?: CertRef;
}[] = [
  { degree: "PhD, Industrial & Systems Engineering", school: "Auburn University", year: "Expected 2027", level: 3 },
  { degree: "MS, Industrial & Systems Engineering", school: "Auburn University", year: "2026", level: 2 },
  {
    degree: "Master of Engineering Management",
    school: "Auburn University",
    year: "2023",
    level: 2,
    certificate: { label: "Diploma", href: "/certificates/auburn-master-engineering-management-diploma-2023.pdf" },
  },
  {
    degree: "Graduate Certificate, Modeling and Data Analytics",
    school: "Auburn University",
    year: "2025",
    level: 0,
    certificate: { label: "Certificate", href: "/certificates/auburn-modeling-and-data-analytics-certificate-2025.pdf" },
  },
  { degree: "BS, Industrial Engineering", school: "PUCMM, Dominican Republic", year: "2017", level: 1 },
];

// years: per-year links shown in one line (e.g. each IPC winners list)
export const honors: {
  title: string;
  year: string;
  href?: string;
  years?: { label: string; href: string }[];
  certificate?: CertRef;
}[] = [
  {
    title: "Winner, INCOSE Systems Showdown",
    year: "2026",
    href: "https://eng.auburn.edu/news/2026/04/ise-grad-student-wins-systems-showdown-competition",
  },
  {
    title: "JT Black Lean Engineering Student of the Year",
    year: "2022",
    href: "https://eng.auburn.edu/news/2023/02/ise-graduate-student-presented-lean-engineering-award",
    certificate: { label: "Award certificate", href: "/certificates/auburn-jt-black-lean-engineering-award-2022.pdf" },
  },
  {
    title: "IPC Scholarship",
    year: "2023, 2024, 2025",
    years: [
      { label: "2023", href: "https://www.electronicsfoundation.org/2023-scholarship-winners" },
      { label: "2024", href: "https://www.electronicsfoundation.org/2024-scholarship-winners" },
      { label: "2025", href: "https://www.electronicsfoundation.org/2025-scholarship-winners" },
    ],
  },
  {
    title: "Lean Six Sigma Green Belt",
    year: "Auburn University, 2023",
    certificate: { label: "Certificate", href: "/certificates/auburn-lean-six-sigma-green-belt-2023.pdf" },
  },
];

// Full list for /certificates (not on the home page). Files live in public/certificates.
// The main credentials (Green Belts, graduate certificate) come from `credentials` above.
export const certificates: {
  group: "Leadership, data and research" | "Other training";
  title: string;
  issuer: string;
  date: string;
  note?: string;
  href: string;
  lang?: string;
}[] = [
  {
    group: "Leadership, data and research",
    title: "Certified Chapter Leader, Auburn University Chapter",
    issuer: "SHPE, 36th National Institute for Leadership Advancement (NILA)",
    date: "Jul 2022",
    href: "/certificates/shpe-nila-chapter-leader-2022.pdf",
  },
  {
    group: "Leadership, data and research",
    title: "Responsible Conduct of Research",
    issuer: "CITI Program, under requirements set by Auburn University",
    date: "Oct 2022",
    note: "Valid through Oct 2025",
    href: "/certificates/citi-responsible-conduct-of-research-2022.pdf",
  },
  {
    group: "Leadership, data and research",
    title: "Business Intelligence with Excel and Power BI",
    issuer: "TEP, Pontificia Universidad Católica Madre y Maestra (PUCMM)",
    date: "Mar 2021",
    note: "27-hour specialized course. Certificate in Spanish",
    href: "/certificates/pucmm-business-intelligence-power-bi-2021.pdf",
  },
  {
    group: "Other training",
    title: "Phish or Treat? Phishing Edition",
    issuer: "KnowBe4 security awareness training",
    date: "Oct 2022",
    href: "/certificates/knowbe4-phishing-2022.pdf",
  },
  {
    group: "Other training",
    title: "Don't Be Like Rick: Two-Factor Authentication",
    issuer: "KnowBe4 security awareness training",
    date: "Oct 2022",
    href: "/certificates/knowbe4-two-factor-authentication-2022.pdf",
  },
  {
    group: "Other training",
    title: "Nueva Normalidad Laboral: Colaboradores",
    issuer: "Capacítate para el Empleo (CARSO)",
    date: "Jul 2020",
    note: "Certificate in Spanish",
    href: "/certificates/carso-nueva-normalidad-laboral-2020.pdf",
    lang: "es",
  },
  {
    group: "Other training",
    title: "Salary Negotiation: Learn the Negotiation Mindset",
    issuer: "Udemy",
    date: "Sep 2017",
    href: "/certificates/udemy-salary-negotiation-2017.pdf",
  },
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

// "Outside the lab": Diego's drone side business. Both visuals on the page are
// placeholders (generated terrain, drawn thermal scene) until real projects exist.
export const outside = {
  title: "Drones for engineering",
  brand: {
    name: "DDrone",
    logo: "/outside/ddrone-logo.png",
    instagram: { handle: "@ddronerd", href: "https://www.instagram.com/ddronerd/" },
    youtube: { label: "YouTube", href: "https://www.youtube.com/c/DiegoCaputoDrone" },
  },
  lede: "Outside research, I run DDrone, a side business flying drones for engineering work. It's the same habit as the lab: measure first, then decide. Every flight ends in data an engineer can use. On weekends I race with the Auburn Flyers, Auburn's cycling team.",
  photogrammetry: {
    title: "Photogrammetry and 3D terrain",
    text: "Georeferenced flights capture hundreds of overlapping high-resolution photos. Stitching them together produces photo-accurate 3D models and height-accurate topographic maps that can be measured, planned on and compared over time.",
    tags: ["Georeferenced capture", "Image stitching", "3D models", "Topographic maps", "Contours"],
  },
  thermal: {
    title: "Thermal inspection",
    text: "Thermal imaging shows what the eye can't: leaks, failed insulation, trapped moisture and energy losses across roofs, buildings and plant equipment. One flight becomes a ranked list of fixes.",
    tags: ["Leak detection", "Heat loss", "Energy efficiency", "Building envelope"],
  },
  // Auburn Flyers: Auburn University's club cycling race team (SECCC, USA Cycling).
  // Originals in /Photos/Auburn Flyers cycling (gitignored).
  cycling: {
    title: "Auburn Flyers cycling",
    text: "I'm an active member of the Auburn Flyers, Auburn University's cycling race team in the Southeastern Collegiate Cycling Conference (USA Cycling). The same lean habits show up on the bike: plan the work, read the data, improve every week.",
    roles: [
      { title: "Road captain", detail: "Former captain and leader of the road cycling division." },
      { title: "Training", detail: "Coordinated team training rides and race preparation." },
      { title: "Race hosting", detail: "Helped host collegiate road and mountain bike races in Auburn for the conference." },
      { title: "Racing", detail: "Raced for Auburn at conference road events across the Southeast." },
    ],
    tags: ["Team leadership", "Road racing", "Event operations", "USA Cycling collegiate"],
    photos: [
      {
        thumb: "/outside/cycling/auburn-kit-thumb.webp",
        src: "/outside/cycling/auburn-kit.webp",
        alt: "Diego Caputo in the Auburn cycling kit with his bike at a race",
        caption: "After a race in the Auburn kit",
        width: 924,
        height: 2000,
        position: "50% 30%",
      },
      {
        thumb: "/outside/cycling/finish-thumb.webp",
        src: "/outside/cycling/finish.webp",
        alt: "Diego Caputo riding toward the finish line of a road race",
        caption: "Riding to the finish line",
        width: 1170,
        height: 780,
      },
      {
        thumb: "/outside/cycling/race-start-thumb.webp",
        src: "/outside/cycling/race-start.webp",
        alt: "Auburn Flyers riders rolling out at the start of a road race at sunset",
        caption: "Race start with the Auburn Flyers",
        width: 2000,
        height: 1500,
        position: "58% 50%",
      },
      {
        thumb: "/outside/cycling/golden-hour-thumb.webp",
        src: "/outside/cycling/golden-hour.webp",
        alt: "Diego Caputo, number 308, with Auburn teammates before a race at golden hour",
        caption: "Before the start, number 308",
        width: 1500,
        height: 2000,
      },
      {
        thumb: "/outside/cycling/staging-thumb.webp",
        src: "/outside/cycling/staging.webp",
        alt: "Riders from Auburn and other schools lining up before a collegiate road race",
        caption: "Lining up with riders from across the conference",
        width: 2000,
        height: 1500,
      },
      {
        thumb: "/outside/cycling/teammates-thumb.webp",
        src: "/outside/cycling/teammates.webp",
        alt: "Diego Caputo and an Auburn Flyers teammate on their bikes before a race",
        caption: "With a teammate before a road race",
        width: 1125,
        height: 1500,
      },
    ] as GalleryItem[],
  },
};
