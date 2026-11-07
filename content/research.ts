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
    status: "Manuscript prepared for submission",
    year: "2026",
    summary:
      "A meta-review of 22 CI/OpEx systematic reviews compared with a cross-industry practitioner roundtable, ending in a five-phase, culture-first framework.",
    abstract: [
      {
        label: "Purpose",
        text: "Continuous improvement (CI) and operational excellence (OpEx) are well established, yet the evidence is fragmented across many systematic literature reviews (SLRs) and is rarely compared with what practitioners prioritize. This study identifies what industry emphasizes when building CI-driven OpEx programs and how this compares with the review literature.",
      },
      {
        label: "Design",
        text: "A two-stream design combines a meta-review of 22 CI/OpEx SLRs identified through a PRISMA-guided search with a structured roundtable of CI/OpEx leaders from cement, automotive, commercial-vehicle and wood-products manufacturing. Eleven speakers' contributions were coded against eleven themes on a three-point depth scale.",
      },
      {
        label: "Findings",
        text: "The literature describes CI/OpEx mainly through formal methodologies and statistical toolkits such as Lean, Six Sigma and DMAIC. Practitioners instead foreground the management system that makes improvement last: people-first culture, KPI structure, sustainment, operator voice, training and standards. Sustainment, central for practitioners, is reported in only 4 of the 22 reviews.",
      },
      {
        label: "Practical implications",
        text: "A five-phase framework (foundation building, employee engagement, process implementation, sustainment, and leadership and change management) offers a culture-first sequence for building and sustaining a CI-driven OpEx program.",
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
    status: "Work-in-progress paper",
    year: "2027",
    summary:
      "A PRISMA 2020 review of 104 Lean training studies that treats training as a production process, with the learner as the unit of flow, and codes the eight wastes in each delivery method.",
    abstract: [
      {
        text: "Lean manufacturing is taught through classroom courses, hands-on games, learning factories, computer simulations, virtual reality, online modules and company programs. Studies of these methods usually report learner satisfaction or knowledge gains, but they rarely examine the training process itself. This paper treats a training program as a production process, with the learner as the unit of flow, and asks what Lean waste each delivery method carries.",
      },
      {
        text: "A systematic review reported according to PRISMA 2020 searched Scopus, Web of Science and IEEE Xplore (2000 to 2026). Of 9,048 records, 104 peer-reviewed studies met the eligibility criteria at full text. Each study was coded for its delivery method and for the presence, mitigation or non-determinability of each of the eight wastes; coding was drafted with AI assistance, verified by the first author and double-coded on a sample by a second reviewer.",
      },
      {
        text: "Physical, co-located formats dominate the evidence (physical games 35%, learning factories 27%), and 48 of 104 studies report no evaluation or only learner perceptions. Transportation is present in 98 studies and waiting in 99. Remote delivery avoids transportation, but only 1 of the 11 fully remote studies lets learners work with real equipment. No included study uses Lean waste to evaluate how training is delivered. The paper contributes a map of how Lean is trained, a two-dimensional taxonomy of delivery methods and a waste-based lens for evaluating training designs.",
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
    status: "Abstract submitted",
    year: "2027",
    summary:
      "The Tiger Motors Lean Education Center, with each design decision mapped to the training waste it removes. Quiz scores rose from 50-56% to 80-86% across 148 students.",
    abstract: [
      {
        text: "Electronics manufacturers face a growing shortage of engineers and technicians who can run, diagnose and improve high-mix, high-volume assembly systems. Hands-on Lean laboratories provide that experience but require travel, scheduled sessions and limited floor space. A companion review of 104 Lean training studies found transportation in 98 training designs and waiting in 99.",
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
