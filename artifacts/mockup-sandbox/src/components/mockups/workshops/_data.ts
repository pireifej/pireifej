export type Cat = "ai" | "speaking" | "youth";

export type Workshop = {
  label: string;
  date: string;
  shortDate: string;
  year: string;
  location: string;
  attendees?: string;
  duration: string;
  desc: string;
  link?: string;
  cat: Cat;
};

export const workshops: Workshop[] = [
  {
    label: "The Future of School Leadership with AI",
    date: "August 25, 2025",
    shortDate: "Aug 25",
    year: "2025",
    location: "Holmdel School District",
    attendees: "20 administrators",
    duration: "1.5 hours",
    desc: "School leaders explore how AI can save them time. Each attendee picks a real admin task — newsletters, evaluation summaries — and uses an AI assistant to draft and refine it through prompt engineering.",
    link: "https://monmouthcountylib.libcal.com/event/14704222",
    cat: "ai",
  },
  {
    label: "Teen Talk: Mastering Public Speaking for Success In-Person",
    date: "July 24, 2025",
    shortDate: "Jul 24",
    year: "2025",
    location: "Hazlet Public Library",
    attendees: "20 teens",
    duration: "1 hour",
    desc: "Practical tools to help teens speak with confidence in class presentations, interviews, and leadership roles. No experience needed.",
    link: "https://monmouthcountylib.libcal.com/event/14704222",
    cat: "speaking",
  },
  {
    label: "Career Day at Indian Hill",
    date: "May 30, 2025",
    shortDate: "May 30",
    year: "2025",
    location: "Holmdel, NJ",
    attendees: "20+ per class",
    duration: "20 min × 7",
    desc: "Seven presentations to grades 4-6 at Indian Hill School to showcase software engineering and computer programming careers. Second year participating.",
    cat: "youth",
  },
  {
    label: "AI for Beginners Workshop — Red Bank",
    date: "March 6, 2025",
    shortDate: "Mar 6",
    year: "2025",
    location: "Red Bank Public Library",
    attendees: "10 adults",
    duration: "1 hour",
    desc: "A free, hands-on intro to AI: practical ways to use ChatGPT in daily life while shedding fear and demystifying the technology.",
    link: "https://www.redbanklibrary.org/calendar/aiforbeginners",
    cat: "ai",
  },
  {
    label: "AI Program with Paul Ireifej — Matawan",
    date: "February 10, 2025",
    shortDate: "Feb 10",
    year: "2025",
    location: "Matawan Aberdeen Public Library",
    attendees: "4 adults",
    duration: "1 hour",
    desc: "Curious about AI but feeling overwhelmed? A one-hour workshop to discover practical ways to use ChatGPT and demystify the technology.",
    link: "https://mapl.events.mylibrary.digital/event?id=165278",
    cat: "ai",
  },
  {
    label: "Find Your Voice — Red Bank",
    date: "February 06, 2025",
    shortDate: "Feb 6",
    year: "2025",
    location: "Red Bank Public Library",
    duration: "1 hour",
    desc: "A free workshop to discover the tools to speak with confidence, structure your message, and captivate any audience. Interactive activities, practical exercises, and real-time feedback.",
    link: "https://www.redbanklibrary.org/calendar/publicspeaking26",
    cat: "speaking",
  },
  {
    label: "Find Your Voice — Matawan",
    date: "January 15, 2025",
    shortDate: "Jan 15",
    year: "2025",
    location: "Matawan Aberdeen Public Library",
    attendees: "9 adults",
    duration: "1 hour",
    desc: "Craft a compelling speech. Enhance delivery with vocal variety and body language. Conquer stage fright with proven breathing and visualization techniques.",
    cat: "speaking",
  },
  {
    label: "Week of Respect — Franklin School",
    date: "October 9, 2024",
    shortDate: "Oct 9",
    year: "2024",
    location: "Franklin School, North Bergen, NJ",
    attendees: "100+ students",
    duration: "Two 30-min sessions",
    desc: "Volunteer keynote speaking to grades 4–8 about respect, kindness, friendship, and responsibility during NJ's Week of Respect.",
    link: "https://youtu.be/YI2_SnK2B0g",
    cat: "youth",
  },
  {
    label: "Master the Art of Public Speaking — Bell Works",
    date: "September 12, 2024",
    shortDate: "Sep 12",
    year: "2024",
    location: "Holmdel Public Library",
    attendees: "10 adults",
    duration: "1 hour",
    desc: "A transformative workshop with voluntary impromptu questions and constructive criticism. Discover your authentic voice and gain a competitive edge in communication.",
    cat: "speaking",
  },
  {
    label: "Youth Leadership Program — Coordinator",
    date: "July & August 2024",
    shortDate: "Jul – Aug",
    year: "2024",
    location: "Red Bank Public Library",
    attendees: "10 youth",
    duration: "Eight 1-hour sessions",
    desc: "Coordinated and ran the eight-session Youth Leadership Program at Red Bank Public Library.",
    link: "ylp.html",
    cat: "youth",
  },
  {
    label: "Career Day",
    date: "March 31, 2024",
    shortDate: "Mar 31",
    year: "2024",
    location: "Indian Hill School, Holmdel",
    attendees: "20+ per class",
    duration: "20 min × 7",
    desc: "Seven presentations to grades 4, 5, and 6 to showcase software engineering and computer programming careers.",
    cat: "youth",
  },
  {
    label: "Master the Art of Public Speaking — Matawan",
    date: "March 14, 2024",
    shortDate: "Mar 14",
    year: "2024",
    location: "Matawan Aberdeen Public Library",
    attendees: "9 adults",
    duration: "1 hour",
    desc: "An impromptu-driven workshop to discover your authentic voice and gain a competitive edge in communication and leadership.",
    cat: "speaking",
  },
  {
    label: "Youth Leadership Program — Guest",
    date: "March 9, 2024",
    shortDate: "Mar 9",
    year: "2024",
    location: "SCLSNJ's Somerville Library Branch",
    attendees: "15 youth",
    duration: "20 min",
    desc: "Guest presentation about impromptu speaking for the Youth Leadership Program.",
    cat: "youth",
  },
];

export const catMeta: Record<
  Cat,
  { label: string; dot: string; pill: string; ring: string; text: string; bg: string }
> = {
  ai: {
    label: "AI Literacy",
    dot: "bg-violet-400",
    pill: "bg-violet-500/15 text-violet-300 border-violet-400/30",
    ring: "border-violet-400/30",
    text: "text-violet-300",
    bg: "from-violet-500/15",
  },
  speaking: {
    label: "Public Speaking",
    dot: "bg-cyan-400",
    pill: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    ring: "border-cyan-400/30",
    text: "text-cyan-300",
    bg: "from-cyan-500/15",
  },
  youth: {
    label: "Youth & Community",
    dot: "bg-emerald-400",
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    ring: "border-emerald-400/30",
    text: "text-emerald-300",
    bg: "from-emerald-500/15",
  },
};

export const totals = {
  count: workshops.length,
  attendees: "270+",
  venues: new Set(workshops.map((w) => w.location.split(",")[0].trim())).size,
  byCat: {
    ai: workshops.filter((w) => w.cat === "ai").length,
    speaking: workshops.filter((w) => w.cat === "speaking").length,
    youth: workshops.filter((w) => w.cat === "youth").length,
  },
  yearSpan: "2024 – 2026",
};
