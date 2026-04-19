import { useState } from "react";
import {
  Sparkles,
  Mic2,
  Users,
  ArrowRight,
  Calendar,
  MapPin,
  CheckCircle2,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { workshops, catMeta, type Cat, type Workshop } from "./_data";

type ProgramKey = Cat;

type ProgramConfig = {
  key: ProgramKey;
  Icon: typeof Sparkles;
  accent: string;
  glow: string;
  ring: string;
  text: string;
  title: string;
  tagline: string;
  audience: string;
  promise: string;
  bullets: string[];
};

const configs: ProgramConfig[] = [
  {
    key: "ai",
    Icon: Sparkles,
    accent: "from-violet-500/20 via-slate-900 to-slate-900",
    glow: "shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]",
    ring: "border-violet-400/30",
    text: "text-violet-300",
    title: "AI Literacy Series",
    tagline: "Demystifying AI for educators, leaders, and curious adults.",
    audience: "Educators · Library patrons · School leadership",
    promise:
      "A practical, no-jargon onramp. Attendees leave with prompts, workflows, and the confidence to use AI in real work.",
    bullets: [
      "Hands-on with ChatGPT, Claude, and Gemini",
      "Bring-your-own real task — leave with a finished draft",
      "Frameworks for evaluating AI output critically",
    ],
  },
  {
    key: "speaking",
    Icon: Mic2,
    accent: "from-cyan-500/20 via-slate-900 to-slate-900",
    glow: "shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]",
    ring: "border-cyan-400/30",
    text: "text-cyan-300",
    title: "Public Speaking Programs",
    tagline: "Find your voice, structure your message, captivate any room.",
    audience: "Teens · Adults · Professionals",
    promise:
      "Interactive labs combining impromptu drills, real-time feedback, and proven frameworks for stage fright, structure, and delivery.",
    bullets: [
      "Compelling speech structure: intro, body, conclusion",
      "Vocal variety, body language, and stage presence",
      "Breath, visualization, and stage-fright techniques",
    ],
  },
  {
    key: "youth",
    Icon: Users,
    accent: "from-emerald-500/20 via-slate-900 to-slate-900",
    glow: "shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]",
    ring: "border-emerald-400/30",
    text: "text-emerald-300",
    title: "Youth & Community Leadership",
    tagline:
      "Career inspiration, respect, and leadership programs for K–12 audiences.",
    audience: "Grades 4–12 · Youth Leadership Programs",
    promise:
      "Multi-session coordination and one-off keynotes that meet kids where they are — career talks, leadership coaching, and Week-of-Respect programming.",
    bullets: [
      "Career Day talks: software engineering for grades 4–6",
      "Youth Leadership Program — coordinator & guest speaker",
      "Week of Respect keynote — kindness, friendship, responsibility",
    ],
  },
];

function pickFeatured(items: Workshop[]) {
  return items[0];
}

function ProgramCard({
  cfg,
  items,
  expanded,
  onToggle,
}: {
  cfg: ProgramConfig;
  items: Workshop[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = cfg.Icon;
  const featured = pickFeatured(items);
  const others = items.filter((i) => i !== featured);

  return (
    <div
      className={`rounded-3xl border ${cfg.ring} bg-gradient-to-br ${cfg.accent} ${cfg.glow} p-8 flex flex-col`}
    >
      <div
        className={`w-12 h-12 rounded-2xl bg-white/5 border ${cfg.ring} flex items-center justify-center mb-5 ${cfg.text}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div
        className={`text-xs uppercase tracking-[0.2em] font-semibold ${cfg.text} mb-2`}
      >
        Signature Program
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
        {cfg.title}
      </h3>
      <p className="text-slate-200 text-sm mb-5 leading-relaxed">{cfg.tagline}</p>

      <div className="text-xs uppercase tracking-widest text-slate-300 mb-2">
        For
      </div>
      <div className="text-sm text-slate-100 mb-6">{cfg.audience}</div>

      <div className="text-xs uppercase tracking-widest text-slate-300 mb-2">
        The Promise
      </div>
      <p className="text-sm text-slate-200 leading-relaxed mb-5">{cfg.promise}</p>

      <ul className="space-y-2.5 mb-6">
        {cfg.bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2.5 text-sm text-slate-100"
          >
            <CheckCircle2
              className={`w-4 h-4 ${cfg.text} mt-0.5 flex-shrink-0`}
            />
            {b}
          </li>
        ))}
      </ul>

      {/* Featured engagement */}
      <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 mt-auto">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300 mb-2">
          Featured Engagement
        </div>
        <div className="text-sm font-semibold text-white mb-3 leading-snug">
          {featured.label}
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> {featured.shortDate} · {featured.year}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3" /> {featured.attendees ?? "Open"}
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <MapPin className="w-3 h-3" /> {featured.location}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div>
          <div className={`text-2xl font-bold ${cfg.text}`}>{items.length}</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-300">
            sessions delivered
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="text-sm text-white inline-flex items-center gap-1.5 hover:gap-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full px-1"
        >
          {expanded ? "Hide all sessions" : "View all sessions"}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div className="mt-5 pt-5 border-t border-slate-800">
        <div className="text-[10px] uppercase tracking-widest text-slate-300 mb-3">
          {expanded
            ? `All ${items.length} sessions`
            : `Also in this series · ${others.length} more`}
        </div>
        {expanded ? (
          <ul className="space-y-3">
            {items.map((i) => (
              <li
                key={`${i.label}-${i.date}`}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-3"
              >
                <div className="text-sm text-white font-medium leading-snug">
                  {i.label}
                </div>
                <div className="text-xs text-slate-300 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  <span>{i.shortDate} · {i.year}</span>
                  <span>·</span>
                  <span>{i.location}</span>
                  {i.attendees && <><span>·</span><span>{i.attendees}</span></>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-1.5">
            {others.slice(0, 3).map((o) => (
              <li key={`${o.label}-${o.date}`} className="text-xs text-slate-200">
                · {o.label}
              </li>
            ))}
            {others.length > 3 && (
              <li className="text-xs text-slate-300 italic">
                + {others.length - 3} more sessions in archive
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export function SignaturePrograms() {
  const [expanded, setExpanded] = useState<Record<ProgramKey, boolean>>({
    ai: false,
    speaking: false,
    youth: false,
  });

  const grouped: Record<ProgramKey, Workshop[]> = {
    ai: workshops.filter((w) => w.cat === "ai"),
    speaking: workshops.filter((w) => w.cat === "speaking"),
    youth: workshops.filter((w) => w.cat === "youth"),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Inter']">
      <div className="max-w-7xl mx-auto px-10 pt-16 pb-10">
        <div className="flex items-center gap-3 text-slate-300 text-xs uppercase tracking-[0.25em] font-semibold mb-4">
          <span className="h-px w-10 bg-slate-500" />
          Workshops & Speaking
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight mb-4 max-w-3xl">
          Three signature programs.{" "}
          <span className="text-slate-300">One mission:</span> people leaving
          the room more capable than they walked in.
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Every workshop pulls from one of three signature programs — built
          over {workshops.length} engagements across schools, libraries, and
          community spaces in Monmouth County and beyond.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-10 pb-16 grid grid-cols-3 gap-6 items-start">
        {configs.map((cfg) => (
          <ProgramCard
            key={cfg.key}
            cfg={cfg}
            items={grouped[cfg.key]}
            expanded={expanded[cfg.key]}
            onToggle={() =>
              setExpanded((s) => ({ ...s, [cfg.key]: !s[cfg.key] }))
            }
          />
        ))}
      </div>

      {/* CTA strip */}
      <div className="max-w-7xl mx-auto px-10 pb-20">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-slate-700 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-slate-100" />
            </div>
            <div>
              <div className="text-xl font-semibold text-white mb-1">
                Have an audience that needs one of these?
              </div>
              <div className="text-sm text-slate-300">
                Sessions are tailored to your group, venue, and time. Most are
                offered free to community partners.
              </div>
            </div>
          </div>
          <a
            href="#book"
            className="bg-white text-slate-950 font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Book Paul to Speak <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
