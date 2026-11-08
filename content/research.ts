// Research papers, described for the site from the manuscripts in
// ~/Desktop/C.I. OpEx and ~/Desktop/Dissertation Lego Lab (Nov 2026).
// These are plain-language descriptions, not the submitted abstracts.
// All three are work in progress: statuses say where each is headed.

export type Paper = {
  slug: string;
  title: string;
  short: string;
  authors: string;
  venue: string;
  type: string;
  status: string;
  year: string;
  summary: string; // one or two sentences for the home page
  sections: { label: string; text: string }[];
  keywords: string[];
  link?: { label: string; href: string };
};

export const researchIntro = {
  dissertation:
    "My dissertation studies how Lean manufacturing training is designed, delivered and evaluated, and what changes when training itself is built with Lean principles.",
  thread:
    "The three papers below follow one line of work: what industry needs to sustain improvement, how Lean is taught today and what that teaching wastes, and a platform designed to remove that waste.",
};

export const papers: Paper[] = [
  {
    slug: "ci-opex",
    title:
      "Building Blocks for a Continuous Improvement-Driven Operational Excellence Program: A Synthesis of Systematic Literature and Industry Expert Roundtable Insights",
    short: "Building blocks for a CI-driven OpEx program",
    authors: "Diego Caputo, Caitlin Tran, Ethan Andrews, Allison Ledford, Gregory Harris",
    venue: "The TQM Journal",
    type: "Meta-review and industry roundtable",
    status: "Manuscript prepared for submission",
    year: "2026",
    summary:
      "Compares what 22 systematic reviews say about continuous improvement with what plant leaders actually prioritize, and turns the gap into a five-phase, culture-first framework.",
    sections: [
      {
        label: "Purpose",
        text: "Continuous improvement and operational excellence are well studied, but the evidence is spread across many separate reviews and is rarely checked against what practitioners say matters. This study asks what industry emphasizes when it builds a CI-driven OpEx program, and where that agrees or disagrees with the academic literature.",
      },
      {
        label: "Design",
        text: "Two evidence streams side by side: a review of 22 published systematic reviews on CI and OpEx, found through a PRISMA-guided search, and a structured roundtable with CI and OpEx leaders from cement, automotive, commercial-vehicle and wood-products manufacturing. Each speaker's input was coded against eleven themes for depth.",
      },
      {
        label: "Findings",
        text: "The literature talks mostly about methods and toolkits: Lean, Six Sigma, DMAIC. Practitioners talk about the management system that keeps improvement alive: a people-first culture, the right KPIs, sustainment, operator voice, training and standards. Sustainment stands out: central for practitioners, yet covered by only 4 of the 22 reviews.",
      },
      {
        label: "Practical implications",
        text: "A five-phase sequence for building a CI-driven OpEx program that starts with culture: foundation building, employee engagement, process implementation, sustainment, and leadership and change management.",
      },
    ],
    keywords: ["Operational excellence", "Continuous improvement", "Meta-review", "Lean", "Six Sigma", "Industry roundtable"],
  },
  {
    slug: "lean-training-review",
    title:
      "Using Lean Thinking to Evaluate How Lean Manufacturing Is Taught: A Systematic Review and Waste-Based Taxonomy of Training Delivery Methods",
    short: "Using Lean thinking to evaluate how Lean is taught",
    authors: "Diego Caputo et al.",
    venue: "ASEE Annual Conference & Exposition 2027",
    type: "Systematic literature review",
    status: "Work-in-progress paper",
    year: "2027",
    summary:
      "Treats Lean training as a production process, with the learner as the unit of flow, and maps which of the eight wastes each way of teaching Lean carries, across 104 studies.",
    sections: [
      {
        label: "Purpose",
        text: "Lean is taught through classes, hands-on games, learning factories, simulations, virtual reality, online modules and company programs. Studies of these methods usually ask whether people learned, not what the training process itself costs. This review applies Lean to Lean training: if the learner is the unit of flow, what waste does each delivery method carry?",
      },
      {
        label: "Design",
        text: "A PRISMA 2020 systematic review of Scopus, Web of Science and IEEE Xplore from 2000 to 2026. Of 9,048 records, 104 peer-reviewed studies met the criteria. Each was classified with a two-dimensional taxonomy (physical or virtual, experience-based or not) and coded for the eight wastes. Coding was drafted with AI assistance, verified by the first author and double-coded on a sample by a second reviewer.",
      },
      {
        label: "Preliminary findings",
        text: "Physical, in-person formats dominate (games 35%, learning factories 27%), and 48 studies report no evaluation or only learner opinions. Transportation and waiting show up in nearly every design. Remote formats avoid travel, but only 1 of 11 fully remote formats lets learners work with real equipment: a trade-off between access and hands-on fidelity. No study used Lean waste to evaluate training delivery.",
      },
      {
        label: "Contribution",
        text: "A map of how Lean manufacturing is taught, a reusable taxonomy of delivery methods, and a waste-based lens that educators and industry trainers can use to choose and improve training designs.",
      },
    ],
    keywords: ["Lean training", "Systematic review", "PRISMA 2020", "Eight wastes", "Learning factories", "AI-assisted coding"],
  },
  {
    slug: "tiger-motors-platform",
    title:
      "Extending Experiential Lean Manufacturing Education Beyond the Laboratory: An Immersive Digital Platform for the Electronics Manufacturing Workforce",
    short: "An immersive digital platform for Lean education",
    authors: "Diego Caputo, Gonzalo Gil, Tom Devall, Jorge Valenzuela",
    venue: "SMTA Pan Pacific Strategic Electronics Symposium 2027",
    type: "Platform design and evaluation",
    status: "Abstract submitted",
    year: "2027",
    summary:
      "The Tiger Motors Lean Education Center, with each design decision mapped to the training waste it removes. Quiz scores rose from 50-56% to 80-86% across 148 students.",
    sections: [
      {
        label: "Purpose",
        text: "Electronics and automotive manufacturers need people who can run and improve high-volume assembly systems, and Lean is learned best by doing. Hands-on labs deliver that, but they require travel, fixed schedules and floor space. This paper designs training that keeps the hands-on experience while removing those wastes.",
      },
      {
        label: "Design",
        text: "The Tiger Motors Lean Education Center, an open web platform built at Auburn under the NSF IUSE: EDU program (DUE-2417082). It brings a 4,000 sq ft Integrated Manufacturing Facility (U-shaped cells, a conveyor line, an AS/RS, kanban and heijunka pull) to any browser through the Lean House: lectures, 360° tours and video of students running the line before and after kaizen, guided 5S and value stream mapping activities, quizzes and a certificate.",
      },
      {
        label: "Results",
        text: "Teams from more than 20 organizations have trained with it, including Honda, GE Aerospace and Brose. Across 148 students in 2025-26, quiz scores rose from 50-56% to 80-86% in the 5S and value stream mapping modules (p < .001), and graduate students using video access scored about the same on the final exam as those in the physical lab (80.6% vs. 83.4%).",
      },
      {
        label: "Practical implications",
        text: "A reusable waste-to-design mapping for manufacturers and universities that want to scale experiential training without building more labs, including how to capture an existing line in 360° media and sequence content around it.",
      },
    ],
    keywords: ["Workforce development", "Learning factory", "360° virtual laboratory", "Immersive learning", "Lean manufacturing"],
    link: { label: "Visit tigermotorslean.com", href: "https://tigermotorslean.com" },
  },
];

// Released reports. Source: ~/Desktop/C.I. OpEx/07 Reports, Literature and Background/OpEx Poster.
export const reports = [
  {
    slug: "ci-opex-report",
    title: "Building an Operational Excellence Program",
    series: "ICAMS Technical Report 24-01",
    publisher: "Auburn University / ICAMS",
    date: "October 2024",
    authors: "Caitlin Tran, Allison Ledford, Ethan Andrews, Diego Caputo, Gregory Harris",
    summary:
      "Findings from a CI/OpEx roundtable with industry experts held at Auburn's Samuel Ginn College of Engineering on April 24, 2024, compared against the academic literature. An AI-assisted analysis of the transcript identifies the key characteristics of successful OpEx programs and a systematic approach for building one. It is the starting point for the TQM Journal manuscript above.",
    funding:
      "Funded by the Interdisciplinary Center for Advanced Manufacturing Systems (ICAMS) through the Industrial Base Analysis and Sustainment office of the Office of the Secretary of Defense.",
    // local copy opens in the in-page PDF viewer; source is the official ICAMS URL
    pdf: "/research/ci-opex-technical-report-24-01.pdf",
    source: "https://eng.auburn.edu/icams/CI-OpEx-Technical-Report-24-01.pdf",
    image: "/research/ci-opex-report-24-01-480.webp",
    imageSet: "/research/ci-opex-report-24-01-480.webp 480w, /research/ci-opex-report-24-01-960.webp 960w",
    alt: "Cover of ICAMS Technical Report 24-01, Building an Operational Excellence Program",
  },
];

export const presentations: {
  title: string;
  venue: string;
  year: string;
  note?: string;
  // poster PDF plus a small preview image (public/research)
  poster?: { href: string; image: string; imageSet: string; alt: string };
}[] = [
  {
    title: "Strategies for building an Operational Excellence program",
    venue: "2025 Huntsville Research Symposium, Auburn University Research and Innovation Campus, Huntsville, AL",
    year: "2025",
    note: "With Caitlin Tran, Ethan Andrews, Allison Ledford and Gregory Harris. Literature review, industry roundtable and AI-assisted analysis condensed into a five-phase OpEx framework; funded by ICAMS.",
    poster: {
      href: "/research/ci-opex-poster-2025.pdf",
      image: "/research/ci-opex-poster-2025-480.webp",
      imageSet: "/research/ci-opex-poster-2025-480.webp 480w, /research/ci-opex-poster-2025-960.webp 960w",
      alt: "Poster: Strategies for Building an Operational Excellence Program, by Caitlin Tran, Ethan Andrews, Diego Caputo, Allison Ledford and Gregory Harris",
    },
  },
  // Year and title confirmed from the poster file and the conference program
  // (Sept 19-21, 2022, Hyatt Regency Perimeter, Atlanta); the CV had "2023, to confirm".
  {
    title: "Tiger Motors Lean Education Center: Student Built, Experimental Lean Learning",
    venue: "IISE Lean Six Sigma & Data Science Conference 2022, Atlanta, GA",
    year: "2022",
    note: "Poster with Wa'ad Tarman, Victoria Ballard and Tom Devall on the student-built lean lab: lean tools, gemba learning and lab technology. Won the student Lean Kahoot challenge.",
    poster: {
      href: "/research/iise-2022-poster.pdf",
      image: "/research/iise-2022-poster-480.webp",
      imageSet: "/research/iise-2022-poster-480.webp 480w, /research/iise-2022-poster-960.webp 960w",
      alt: "Poster: Tiger Motors Lean Education Center, Student Built – Experimental Lean Learning, by Diego Caputo, Wa'ad Tarman, Victoria Ballard and Tom Devall",
    },
  },
];

// Smaller items shown under the papers on the home page: posters and reports.
// Each opens its PDF in the in-page viewer.
export const researchMaterials = [
  {
    kind: "Poster",
    title: "Strategies for building an Operational Excellence program",
    meta: "Huntsville Research Symposium · 2025",
    href: "/research/ci-opex-poster-2025.pdf",
    image: "/research/ci-opex-poster-2025-480.webp",
    imageSet: "/research/ci-opex-poster-2025-480.webp 480w, /research/ci-opex-poster-2025-960.webp 960w",
    alt: "Poster: Strategies for Building an Operational Excellence Program",
  },
  {
    kind: "Technical report",
    title: "Building an Operational Excellence Program",
    meta: "ICAMS Technical Report 24-01 · 2024",
    href: "/research/ci-opex-technical-report-24-01.pdf",
    image: "/research/ci-opex-report-24-01-480.webp",
    imageSet: "/research/ci-opex-report-24-01-480.webp 480w, /research/ci-opex-report-24-01-960.webp 960w",
    alt: "Cover of ICAMS Technical Report 24-01",
  },
  {
    kind: "Poster",
    title: "Tiger Motors Lean Education Center: student-built, experimental lean learning",
    meta: "IISE Lean Six Sigma & Data Science Conference · 2022",
    href: "/research/iise-2022-poster.pdf",
    image: "/research/iise-2022-poster-480.webp",
    imageSet: "/research/iise-2022-poster-480.webp 480w, /research/iise-2022-poster-960.webp 960w",
    alt: "Poster: Tiger Motors Lean Education Center, Student Built – Experimental Lean Learning",
  },
];
