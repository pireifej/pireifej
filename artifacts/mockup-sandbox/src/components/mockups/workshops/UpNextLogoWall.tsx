import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Mic2,
  Handshake,
  Quote,
  Star,
  GraduationCap,
} from "lucide-react";
import { workshops, catMeta, totals, type Cat } from "./_data";

const featured = workshops[0];

const highlightSelections = [
  workshops.find((w) => w.label.startsWith("Teen Talk"))!,
  workshops.find((w) => w.label.startsWith("AI for Beginners"))!,
  workshops.find((w) => w.label.startsWith("Week of Respect"))!,
];

const highlightIcon: Record<Cat, typeof Sparkles> = {
  ai: Sparkles,
  speaking: Mic2,
  youth: Handshake,
};

const venues = Array.from(new Set(workshops.map((w) => w.location)));

const stats = [
  { n: String(totals.count), l: "Workshops Delivered" },
  { n: totals.attendees, l: "Attendees Reached" },
  { n: String(venues.length), l: "NJ Venues" },
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
        <p className="text-slate-300 text-lg max-w-2xl">
          From school leadership cohorts to teen public-speaking labs, every
          session ships with practice, feedback, and something the audience can
          use Monday morning.
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
              <div className="text-emerald-300/90 text-sm font-medium mb-2">
                {catMeta[featured.cat].label}
              </div>
              <h2 className="text-3xl font-bold mb-4 leading-tight">
                {featured.label}
              </h2>
              <p className="text-slate-200 text-base leading-relaxed mb-7">
                {featured.desc}
              </p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-200 mb-8">
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
                  {featured.attendees ?? "Open enrollment"}
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {featured.duration}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="#book"
                  className="bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-emerald-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                >
                  Book Paul to Speak
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={featured.link ?? "#all-workshops"}
                  className="border border-slate-600 text-slate-100 px-6 py-3 rounded-full hover:border-slate-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  Workshop details
                </a>
              </div>
            </div>
            <div className="col-span-2 bg-slate-900/60 border-l border-slate-800 p-8 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-widest text-slate-300 mb-4">
                What you'll leave with
              </div>
              <ul className="space-y-3 text-sm text-slate-100">
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
            See all {totals.count} workshops <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {highlightSelections.map((h) => {
            const Icon = highlightIcon[h.cat];
            return (
              <div
                key={h.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-400/40 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-base font-semibold leading-snug mb-2 text-white">
                  {h.label}
                </div>
                <div className="text-sm text-slate-300">{h.location}</div>
                <div className="text-xs text-slate-300 mt-3 flex items-center gap-3">
                  <span>{h.shortDate} · {h.year}</span>
                  <span>•</span>
                  <span>{catMeta[h.cat].label}</span>
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
              <div className="text-xs uppercase tracking-widest text-slate-300 mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo wall — venues */}
      <div className="max-w-6xl mx-auto px-10 pb-14">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-300 mb-2">
            Trusted by libraries, schools, and community programs across NJ
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {venues.map((v) => (
            <div
              key={v}
              className="border border-slate-800 rounded-xl py-5 text-center text-sm text-slate-100 bg-slate-900/30 hover:bg-slate-900/60 transition"
            >
              <GraduationCap className="w-4 h-4 inline -mt-0.5 mr-2 text-emerald-400/80" />
              {v}
            </div>
          ))}
        </div>
      </div>

      {/* Complete archive */}
      <div id="all-workshops" className="max-w-6xl mx-auto px-10 pb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="text-xl font-semibold">
            Complete Archive · {totals.count} engagements
          </h3>
          <span className="text-xs uppercase tracking-widest text-slate-300">
            {totals.yearSpan}
          </span>
        </div>
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/60 text-slate-300 uppercase text-[10px] tracking-widest">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Engagement</th>
                <th className="text-left px-5 py-3 font-medium">Venue</th>
                <th className="text-left px-5 py-3 font-medium">Audience</th>
                <th className="text-left px-5 py-3 font-medium">Track</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((w, i) => (
                <tr
                  key={`${w.label}-${i}`}
                  className="border-t border-slate-800 bg-slate-950/40 hover:bg-slate-900/40 transition"
                >
                  <td className="px-5 py-3 text-slate-200 whitespace-nowrap">
                    {w.shortDate} · {w.year}
                  </td>
                  <td className="px-5 py-3 text-white">{w.label}</td>
                  <td className="px-5 py-3 text-slate-200">{w.location}</td>
                  <td className="px-5 py-3 text-slate-200">
                    {w.attendees ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-widest border px-2 py-0.5 rounded-full ${catMeta[w.cat].pill}`}
                    >
                      {catMeta[w.cat].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Testimonial */}
      <div className="max-w-6xl mx-auto px-10 pb-20">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 relative">
          <Quote className="w-10 h-10 text-emerald-400/40 absolute top-6 left-6" />
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
            <div className="text-sm text-slate-300">
              <span className="text-slate-100 font-medium">
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
