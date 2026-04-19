import {
  Sparkles,
  Mic2,
  Users,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

type Cat = "ai" | "speaking" | "youth";

type Workshop = {
  label: string;
  date: string;
  location: string;
  attendees?: string;
  duration: string;
  cat: Cat;
};

const catMeta: Record<Cat, { label: string; dot: string; pill: string; Icon: typeof Sparkles }> = {
  ai: {
    label: "AI Literacy",
    dot: "bg-violet-400",
    pill: "bg-violet-500/15 text-violet-300 border-violet-400/30",
    Icon: Sparkles,
  },
  speaking: {
    label: "Public Speaking",
    dot: "bg-cyan-400",
    pill: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    Icon: Mic2,
  },
  youth: {
    label: "Youth & Community",
    dot: "bg-emerald-400",
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Icon: Users,
  },
};

const years: { year: string; items: Workshop[] }[] = [
  {
    year: "2025",
    items: [
      {
        label: "The Future of School Leadership with AI",
        date: "Aug 25",
        location: "Holmdel School District",
        attendees: "20 administrators",
        duration: "1.5 hrs",
        cat: "ai",
      },
      {
        label: "Teen Talk: Mastering Public Speaking for Success In-Person",
        date: "Jul 24",
        location: "Hazlet Public Library",
        attendees: "20 teens",
        duration: "1 hr",
        cat: "speaking",
      },
      {
        label: "Career Day at Indian Hill",
        date: "May 30",
        location: "Holmdel, NJ",
        attendees: "20+ per class",
        duration: "20 min × 7",
        cat: "youth",
      },
      {
        label: "AI for Beginners Workshop — Red Bank",
        date: "Mar 6",
        location: "Red Bank Public Library",
        attendees: "10 adults",
        duration: "1 hr",
        cat: "ai",
      },
      {
        label: "AI Program with Paul Ireifej — Matawan",
        date: "Feb 10",
        location: "Matawan Aberdeen Public Library",
        attendees: "4 adults",
        duration: "1 hr",
        cat: "ai",
      },
      {
        label: "Find Your Voice — Red Bank",
        date: "Feb 6",
        location: "Red Bank Public Library",
        duration: "1 hr",
        cat: "speaking",
      },
      {
        label: "Find Your Voice — Matawan",
        date: "Jan 15",
        location: "Matawan Aberdeen Public Library",
        attendees: "9 adults",
        duration: "1 hr",
        cat: "speaking",
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        label: "Week of Respect — Franklin School",
        date: "Oct 9",
        location: "Franklin School, North Bergen, NJ",
        attendees: "100+ students",
        duration: "Two 30-min sessions",
        cat: "youth",
      },
      {
        label: "Master the Art of Public Speaking — Bell Works",
        date: "Sep 12",
        location: "Holmdel Public Library",
        attendees: "10 adults",
        duration: "1 hr",
        cat: "speaking",
      },
      {
        label: "Youth Leadership Program — Coordinator",
        date: "Jul – Aug",
        location: "Red Bank Public Library",
        attendees: "10 youth",
        duration: "Eight 1-hr sessions",
        cat: "youth",
      },
      {
        label: "Career Day",
        date: "Mar 31",
        location: "Indian Hill School, Holmdel",
        attendees: "20+ per class",
        duration: "20 min × 7",
        cat: "youth",
      },
      {
        label: "Master the Art of Public Speaking — Matawan",
        date: "Mar 14",
        location: "Matawan Aberdeen Public Library",
        attendees: "9 adults",
        duration: "1 hr",
        cat: "speaking",
      },
      {
        label: "Youth Leadership Program — Guest",
        date: "Mar 9",
        location: "SCLSNJ's Somerville Library Branch",
        attendees: "15 youth",
        duration: "20 min",
        cat: "youth",
      },
    ],
  },
];

function Stat({ n, l, sub }: { n: string; l: string; sub?: string }) {
  return (
    <div className="p-7">
      <div className="text-4xl font-bold text-white tracking-tight">{n}</div>
      <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">
        {l}
      </div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

function CatBar() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {(Object.keys(catMeta) as Cat[]).map((k) => {
        const m = catMeta[k];
        const Icon = m.Icon;
        const counts = { ai: 3, speaking: 5, youth: 5 }[k];
        return (
          <div
            key={k}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-lg ${m.pill} border flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{m.label}</div>
              <div className="text-xs text-slate-400">{counts} workshops</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineItem({ w }: { w: Workshop }) {
  const m = catMeta[w.cat];
  return (
    <div className="relative pl-10 pb-7 group">
      {/* vertical line is in parent */}
      <div
        className={`absolute left-3 top-2 w-3 h-3 rounded-full ${m.dot} ring-4 ring-slate-950 group-hover:scale-125 transition`}
      />
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h4 className="text-base font-semibold text-white leading-snug">
            {w.label}
          </h4>
          <span
            className={`text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border ${m.pill} whitespace-nowrap`}
          >
            {m.label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-y-2 gap-x-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {w.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {w.duration}
          </div>
          {w.attendees && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {w.attendees}
            </div>
          )}
          <div className="flex items-center gap-1.5 col-span-3">
            <MapPin className="w-3.5 h-3.5" /> {w.location}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimelineImpact() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Inter']">
      <div className="max-w-5xl mx-auto px-10 pt-16 pb-8">
        <div className="flex items-center gap-3 text-amber-400 text-xs uppercase tracking-[0.25em] font-semibold mb-4">
          <span className="h-px w-10 bg-amber-400/60" />
          Workshops & Speaking
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight mb-4">
          Two years of work.{" "}
          <span className="text-amber-400">One growing</span> community impact.
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          A complete record of every workshop, keynote, and youth program — with
          who came, where, and how long. Built up engagement by engagement across
          Monmouth County.
        </p>
      </div>

      {/* Impact dashboard */}
      <div className="max-w-5xl mx-auto px-10 pb-10">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 overflow-hidden">
          <div className="px-7 pt-6 pb-4 flex items-center gap-2 border-b border-slate-800">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <div className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold">
              Impact Dashboard
            </div>
          </div>
          <div className="grid grid-cols-4 divide-x divide-slate-800">
            <Stat n="13" l="Workshops" sub="2024 – 2025" />
            <Stat n="270+" l="Attendees" sub="Reached so far" />
            <Stat n="9" l="NJ Venues" sub="Schools & libraries" />
            <Stat n="3" l="Program Tracks" sub="AI · Speaking · Youth" />
          </div>
          <div className="px-7 pb-7">
            <CatBar />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-10 pb-16">
        {years.map((y) => (
          <div key={y.year} className="mb-10">
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="text-3xl font-bold text-white">{y.year}</h2>
              <div className="text-sm text-slate-500">
                {y.items.length} engagements
              </div>
            </div>
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-800" />
              {y.items.map((w, i) => (
                <TimelineItem key={`${y.year}-${i}`} w={w} />
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 flex items-center justify-between mt-4">
          <div>
            <div className="text-base font-semibold text-white mb-1">
              Want to add your venue to the timeline?
            </div>
            <div className="text-sm text-slate-400">
              Sessions are tailored to your audience, length, and goals.
            </div>
          </div>
          <button className="bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-amber-300 transition">
            Book Paul to Speak <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
