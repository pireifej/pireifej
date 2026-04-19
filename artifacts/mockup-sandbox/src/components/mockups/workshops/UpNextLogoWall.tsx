import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Mic2,
  GraduationCap,
  Handshake,
  Quote,
  Star,
} from "lucide-react";

const featured = {
  category: "AI Literacy",
  label: "The Future of School Leadership with AI",
  date: "August 25, 2025",
  location: "Holmdel School District",
  attendees: "20 administrators",
  duration: "1.5 hours",
  desc: "School leaders use AI to draft real administrative work — newsletters, evaluations, family comms — refined live through prompt engineering.",
};

const highlights = [
  {
    label: "Teen Talk: Mastering Public Speaking",
    venue: "Hazlet Public Library",
    date: "Jul 2025",
    audience: "Teens",
    icon: Mic2,
  },
  {
    label: "AI for Beginners",
    venue: "Red Bank Public Library",
    date: "Mar 2025",
    audience: "Adults",
    icon: Sparkles,
  },
  {
    label: "Week of Respect Keynote",
    venue: "Franklin School, North Bergen",
    date: "Oct 2024",
    audience: "100+ students",
    icon: Handshake,
  },
];

const venues = [
  "Holmdel School District",
  "Hazlet Public Library",
  "Red Bank Public Library",
  "Matawan Aberdeen Public Library",
  "Holmdel Public Library",
  "Indian Hill School",
  "Franklin School • N. Bergen",
  "Bell Works",
  "SCLSNJ Somerville Branch",
];

const stats = [
  { n: "13", l: "Workshops Delivered" },
  { n: "270+", l: "Attendees Reached" },
  { n: "9", l: "NJ Venues" },
  { n: "100%", l: "Free to Community" },
];

const testimonial = {
  quote:
    "Paul has a rare gift for making technical ideas feel approachable. Our staff left the AI session with practical skills they used the next morning.",
  author: "Library Program Director",
  venue: "Monmouth County, NJ",
};

export function UpNextLogoWall() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Inter']">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-10 pt-16 pb-10">
        <div className="flex items-center gap-3 text-emerald-400 text-xs uppercase tracking-[0.25em] font-semibold mb-4">
          <span className="h-px w-10 bg-emerald-400/60" />
          Workshops & Speaking
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight mb-4">
          Hands-on workshops that move
          <br />
          rooms from <span className="text-emerald-400">curious</span> to{" "}
          <span className="text-emerald-400">capable.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          From school leadership cohorts to teen public-speaking labs, every session
          ships with practice, feedback, and something the audience can use Monday
          morning.
        </p>
      </div>

      {/* Featured / Up Next */}
      <div className="max-w-6xl mx-auto px-10 pb-12">
        <div className="rounded-3xl overflow-hidden border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900">
          <div className="grid grid-cols-5">
            <div className="col-span-3 p-10">
              <div className="inline-flex items-center gap-2 bg-emerald-400/15 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Engagement
              </div>
              <div className="text-emerald-300/80 text-sm font-medium mb-2">
                {featured.category}
              </div>
              <h2 className="text-3xl font-bold mb-4 leading-tight">
                {featured.label}
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-7">
                {featured.desc}
              </p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-300 mb-8">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  {featured.date}
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {featured.location}
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  {featured.attendees}
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {featured.duration}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-emerald-300 transition">
                  Book Paul to Speak
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="border border-slate-700 text-slate-200 px-6 py-3 rounded-full hover:border-slate-500 transition">
                  Workshop details
                </button>
              </div>
            </div>
            <div className="col-span-2 bg-slate-900/60 border-l border-slate-800 p-8 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-widest text-slate-500 mb-4">
                What you'll leave with
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                {[
                  "A draft of one real admin task you brought in",
                  "A reusable prompt template, vetted live",
                  "A simple framework for evaluating AI outputs",
                  "Confidence to introduce AI tools to your staff",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-emerald-400 mt-0.5">›</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3 highlight strip */}
      <div className="max-w-6xl mx-auto px-10 pb-14">
        <div className="flex items-baseline justify-between mb-6">
          <h3 className="text-xl font-semibold">Recent Highlights</h3>
          <a
            href="#all-workshops"
            className="text-sm text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
          >
            See all 13 workshops <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-400/40 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-base font-semibold leading-snug mb-2">
                  {h.label}
                </div>
                <div className="text-sm text-slate-400">{h.venue}</div>
                <div className="text-xs text-slate-500 mt-3 flex items-center gap-3">
                  <span>{h.date}</span>
                  <span>•</span>
                  <span>{h.audience}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-6xl mx-auto px-10 pb-14">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 grid grid-cols-4 divide-x divide-slate-800">
          {stats.map((s) => (
            <div key={s.l} className="p-7 text-center">
              <div className="text-3xl font-bold text-emerald-400">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo wall — venues */}
      <div className="max-w-6xl mx-auto px-10 pb-14">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2">
            Trusted by libraries, schools, and community programs across NJ
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {venues.map((v) => (
            <div
              key={v}
              className="border border-slate-800 rounded-xl py-5 text-center text-sm text-slate-300 bg-slate-900/30 hover:bg-slate-900/60 transition"
            >
              <GraduationCap className="w-4 h-4 inline -mt-0.5 mr-2 text-emerald-400/70" />
              {v}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="max-w-6xl mx-auto px-10 pb-20">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 relative">
          <Quote className="w-10 h-10 text-emerald-400/30 absolute top-6 left-6" />
          <div className="pl-14">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-emerald-400 text-emerald-400"
                />
              ))}
            </div>
            <p className="text-xl text-slate-100 leading-relaxed font-light italic mb-5">
              "{testimonial.quote}"
            </p>
            <div className="text-sm text-slate-400">
              <span className="text-slate-200 font-medium">
                {testimonial.author}
              </span>{" "}
              · {testimonial.venue}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
