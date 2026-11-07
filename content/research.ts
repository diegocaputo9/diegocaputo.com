// Research papers, taken from the manuscripts in ~/Desktop/C.I. OpEx and
// ~/Desktop/Dissertation Lego Lab (Nov 2026). All three are work in progress:
// statuses say where each is headed, not that it is accepted.

export type Paper = {
  slug: string;
  title: string;
  short: string;
  authors: string;
  venue: string;
  status: string;
  year: string;
  summary: string; // one or two sentences for the home page
  abstract: { label?: string; text: string }[];
  keywords: string[];
  link?: { label: string; href: string };
  /** Under double-blind review: show title, venue and status only. */
  blind?: boolean;
};

export const blindNote = "Abstract will be shared after peer review.";

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
    status: "Manuscript prepared for submission",
    year: "2026",
    blind: true,
    summary: "Abstract will be shared after peer review.",
    abstract: [],
    keywords: [],
  },
  {
    slug: "lean-training-review",
    title:
      "Using Lean Thinking to Evaluate How Lean Manufacturing Is Taught: A Systematic Review and Waste-Based Taxonomy of Training Delivery Methods",
    short: "Using Lean thinking to evaluate how Lean is taught",
    authors: "Diego Caputo et al.",
    venue: "ASEE Annual Conference & Exposition 2027",
    status: "Work-in-progress paper",
    year: "2027",
    blind: true,
    summary: "Abstract will be shared after peer review.",
    abstract: [],
    keywords: [],
  },
  {
    slug: "tiger-motors-platform",
    title:
      "Extending Experiential Lean Manufacturing Education Beyond the Laboratory: An Immersive Digital Platform for the Electronics Manufacturing Workforce",
    short: "An immersive digital platform for Lean education",
    authors: "Diego Caputo, Gonzalo Gil, Tom Devall, Jorge Valenzuela",
    venue: "SMTA Pan Pacific Strategic Electronics Symposium 2027",
    status: "Abstract submitted",
    year: "2027",
    summary:
      "The Tiger Motors Lean Education Center, with each design decision mapped to the training waste it removes. Quiz scores rose from 50-56% to 80-86% across 148 students.",
    abstract: [
      {
        text: "Electronics manufacturers face a growing shortage of engineers and technicians who can run, diagnose and improve high-mix, high-volume assembly systems. Hands-on Lean laboratories provide that experience but require travel, scheduled sessions and limited floor space.",
      },
      {
        text: "This paper applies Lean principles to the training process itself. It presents the Tiger Motors Lean Education Center, an open web platform developed at Auburn University under the NSF IUSE: EDU program (Award DUE-2417082), and maps each design decision to the waste it removes. The platform extends a 4,000-square-foot Integrated Manufacturing Facility (linked U-shaped cells, a conveyor line, an AS/RS, kanban and heijunka pull scheduling) to learners anywhere, organized around the Lean House with a Learn, Explore, Connect model, 360° tours and video, guided 5S and value stream mapping activities, quizzes and a certificate.",
      },
      {
        text: "Teams from more than 20 organizations have trained with the program. In 2025-26, 148 students took part in the evaluation: pre/post quiz scores rose from 50-56% to 80-86% across the 5S and value stream mapping modules (p < .001, d = 1.17-1.47), and graduate students using video-based access scored comparably on the final exam to students in the in-person lab (80.6% vs. 83.4%, no significant difference).",
      },
    ],
    keywords: ["Workforce development", "Learning factory", "360° virtual laboratory", "Immersive learning", "Lean manufacturing"],
    link: { label: "Visit tigermotorslean.com", href: "https://tigermotorslean.com" },
  },
];

export const presentations = [
  {
    title: "Lean lab poster: training engineers through simulation and hands-on activities",
    venue: "Lean Six Sigma & Data Science Conference, Atlanta, GA",
    year: "2023",
    note: "Won the student Lean Kahoot challenge.",
  },
];
