// Log of events, outreach and tabling. NOT rendered yet: seed for a future
// "Events & outreach" page. Original photos live in /Photos (gitignored);
// export web copies to public/events/ when the page is built.

export type EventLog = {
  name: string;
  date: string; // ISO date
  place: string;
  role: string;
  with?: string[];
  what: string;
  photo?: string; // file name inside /Photos
  source?: string;
};

export const events: EventLog[] = [
  {
    name: "Southern Automotive Quality Summit 2024 (AAMA + AIAG)",
    date: "2024-04-18",
    place: "Barber Vintage Motorsports Museum, Leeds, Alabama",
    role: "Exhibitor, Auburn Engineering Online table",
    with: ["Dr. Tom Devall"],
    what: "Tabled for Auburn Engineering Online, promoting the Tiger Motors lab, our lean research, industry cohorts and graduate certificates.",
    photo: "2024-04-18 Southern Automotive Quality Summit/Diego and Dr. Devall, Auburn Engineering Online table.jpg",
    source: "https://blog.aiag.org/its-that-time-again-registration-is-now-available-for-our-2024-southern-automotive-quality-summit",
  },
];
