import { useState } from "react";
import {
  Sparkles,
  Mic2,
  Users,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { workshops, catMeta, totals, type Cat, type Workshop } from "./_data";

const catIcon: Record<Cat, typeof Sparkles> = {
  ai: Sparkles,
  speaking: Mic2,
  youth: Users,
};

function groupByYear(items: Workshop[]) {
  const byYear: Record<string, Workshop[]> = {};
  for (const w of items) {
    if (!byYear[w.year]) byYear[w.year] = [];
    byYear[w.year].push(w);
  }
  return Object.entries(byYear)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, items]) => ({ year, items }));
}

function Stat({ n, l, sub }: { n: string; l: string; sub?: string }) {
  return (
    <div className="p-7">
      <div className="text-4xl font-bold text-white tracking-tight">{n}</div>
      <div className="text-xs uppercase tracking-widest text-slate-300 mt-2">
        {l}
      </div>
      {sub && <div className="text-xs text-slate-300 mt-1">{sub}</div>}
    </div>
  );
}

function CatBar() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {(Object.keys(catMeta) as Cat[]).map((k) => {
        const m = catMeta[k];
        const Icon = catIcon[k];
        const count = totals.byCat[k];
        return (
          <div
            key={k}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${m.pill} border flex items-center justify-center`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{m.label}</div>
              <div className="text-xs text-slate-300">{count} workshops</div>
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
        <div className="grid grid-cols-3 gap-y-2 gap-x-4 text-xs text-slate-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {w.shortDate}
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
  const grouped = groupByYear(workshops);
  const currentYear = grouped[0]?.year;
  const [openYears, setOpenYears] = useState<Record<string, boolean>>(
    Object.fromEntries(grouped.map((g) => [g.year, g.year === currentYear])),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Inter']">
      <div className="max-w-5xl mx-auto px-10 pt-16 pb-8">
        <div className="flex items-center gap-3 text-amber-400 text-xs uppercase tracking-[0.25em] font-semibold mb-4">
          <span className="h-px w-10 bg-amber-400/60" />
          Workshops & Speaking
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight mb-4">
          Three years on stage.{" "}
          <span className="text-amber-400">One growing</span> community impact.
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          A complete record of every workshop, keynote, and youth program — who
          came, where, and how long. Built up engagement by engagement across
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
            <Stat n={String(totals.count)} l="Workshops" sub={totals.yearSpan} />
            <Stat n={totals.attendees} l="Attendees" sub="Reached so far" />
            <Stat
              n={String(totals.venues)}
              l="NJ Venues"
              sub="Schools & libraries"
            />
            <Stat
              n="3"
              l="Program Tracks"
              sub="AI · Speaking · Youth"
            />
          </div>
          <div className="px-7 pb-7">
            <CatBar />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-10 pb-16">
        {grouped.map((y) => {
          const isOpen = !!openYears[y.year];
          return (
            <div key={y.year} className="mb-6">
              <button
                type="button"
                onClick={() =>
                  setOpenYears((s) => ({ ...s, [y.year]: !s[y.year] }))
                }
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between mb-5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-lg px-1 py-1"
              >
                <div className="flex items-baseline gap-4">
                  <h2 className="text-3xl font-bold text-white">{y.year}</h2>
                  <div className="text-sm text-slate-300">
                    {y.items.length} engagements
                  </div>
                </div>
                <div className="text-slate-300 inline-flex items-center gap-2 text-sm">
                  {isOpen ? "Collapse year" : "Expand year"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              {isOpen && (
                <div className="relative">
                  <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-800" />
                  {y.items.map((w, i) => (
                    <TimelineItem key={`${y.year}-${i}`} w={w} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 flex items-center justify-between mt-4">
          <div>
            <div className="text-base font-semibold text-white mb-1">
              Want to add your venue to the timeline?
            </div>
            <div className="text-sm text-slate-300">
              Sessions are tailored to your audience, length, and goals.
            </div>
          </div>
          <a
            href="#book"
            className="bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-amber-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Book Paul to Speak <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
