// Case study for /work/tiger-motors. Sources: SMTA Pan Pacific 2027 abstract,
// tigermotorslean.com, resume/CV and Diego's LinkedIn posts (Alumni Council, THWS).

export const tigerMotors = {
  kind: "Case study",
  title: "Tiger Motors Lean Education Center",
  lede: "Lean is learned by doing, but a hands-on lab only reaches the people who can travel to it. We put Auburn's automotive learning factory in a browser and measured whether people still learn.",
  href: "https://tigermotorslean.com",
  image: "/work/tiger-motors-1456.webp",
  imageSet: "/work/tiger-motors-800.webp 800w, /work/tiger-motors-1456.webp 1456w",
  facts: [
    ["Role", "Lead platform developer, graduate research assistant, lead author"],
    ["Team", "Tom Devall, Gonzalo Gil, Jorge Valenzuela"],
    ["Funding", "$400K NSF IUSE: EDU grant, DUE-2417082"],
    ["Period", "2024 - present"],
  ],
  numbers: [
    { value: "148", unit: "students", label: "in the 2025-26 evaluation" },
    { value: "+30", unit: "pts", label: "quiz gain in the 5S and VSM modules (50-56% to 80-86%)" },
    { value: "20+", unit: "orgs", label: "trained with it, including Honda, GE Aerospace and Brose" },
    { value: "4,000", unit: "sq ft", label: "learning factory captured in 360°" },
  ],
  sections: [
    {
      label: "The problem",
      text: "Electronics and automotive manufacturers need people who can run and improve high-volume assembly systems. Auburn's Integrated Manufacturing Facility teaches exactly that, but a physical lab means travel, fixed schedules and limited floor space. Those are wastes in their own right, and they cap how many people can learn this way.",
    },
    {
      label: "The lab",
      text: "A 4,000 sq ft facility modeled on Toyota- and Honda-style production: U-shaped cells, a conveyor line, an automated storage and retrieval system, and kanban and heijunka pull. Students build Lego cars on it and improve the line run by run.",
    },
    {
      label: "What we built",
      text: "An open web platform organized around the Lean House. Each module pairs a short lecture with 360° tours of the lab, video of students running the line before and after kaizen, guided 5S and value stream mapping activities, a quiz, and a completion certificate. Every design decision is mapped to the training waste it removes.",
    },
    {
      label: "Results",
      text: "Across 148 students, quiz scores rose from 50-56% to 80-86% in the 5S and value stream mapping modules (p < .001). Graduate students with video access scored about the same on the final exam as those in the physical lab (80.6% vs. 83.4%). Teams from more than 20 organizations have trained with it.",
    },
  ],
  role: [
    "Lead developer of the platform: designed and built the site, the 360° tours and the learning modules",
    "Introduced the platform to faculty and students at THWS in Germany during International Teaching Week 2025",
    "Presented the project's progress to Auburn's Alumni Engineering Council",
    "Lead author of the SMTA Pan Pacific 2027 paper on the platform's design and evaluation",
  ],
  keywords: ["Learning factory", "360° virtual lab", "Lean House", "5S", "Value stream mapping", "Workforce development"],
};
