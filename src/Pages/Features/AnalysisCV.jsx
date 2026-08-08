import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, FileSearch, WandSparkles } from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

const bullets = [
  {
    icon: FileSearch,
    title: "ATS Score",
    text: "See how your CV reads to the software recruiters use every day.",
    bg: "from-emerald-500 to-teal-400",
  },
  {
    icon: BrainCircuit,
    title: "Skill Gap",
    text: "Spot the missing skills and keywords for the exact role you want.",
    bg: "from-teal-500 to-cyan-400",
  },
  {
    icon: WandSparkles,
    title: "STAR Rewrite",
    text: "Turn plain bullet points into outcomes a recruiter actually notices.",
    bg: "from-emerald-600 to-green-400",
  },
];

const formatBars = [
  { label: "Format & structure", value: 95 },
  { label: "Keywords & skills", value: 78 },
  { label: "Experience phrasing", value: 64 },
];

const AnalysisCV = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reduced = useReducedMotion();

  const score = 82;
  const radius = 56;
  const C = 2 * Math.PI * radius;

  return (
    <section className={`py-16 transition-colors duration-500 ${isDark ? "bg-[#050816]" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ── Copy ─────────────────────────────────────── */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                isDark
                  ? "border-slate-700 bg-slate-900/70 text-slate-400"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              Analyze your CV
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Know your ATS score{" "}
              <span className="text-emerald-500">
                before a recruiter does
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`mt-4 max-w-xl text-base leading-7 ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Upload your CV, paste a job description, and get an instant breakdown — the
              score software sees, plus exactly what to fix before you apply.
            </motion.p>

            <ul className="mt-8 space-y-5">
              {bullets.map((bullet, index) => {
                const Icon = bullet.icon;
                return (
                  <motion.li
                    key={bullet.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${bullet.bg} text-white shadow-lg`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {bullet.title}
                      </h3>
                      <p className={`mt-0.5 text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {bullet.text}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                to="/dashboard/cvs"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 font-semibold text-white transition duration-300 hover:bg-emerald-700"
              >
                Analyze your CV
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/compare"
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition duration-300 ${
                  isDark
                    ? "border border-slate-700 text-white hover:bg-white hover:text-slate-900"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white"
                }`}
              >
                Compare CV with jobs
              </Link>
            </motion.div>
          </div>

          {/* ── Mock ATS report ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <div
              className={`rounded-3xl border p-7 shadow-xl ${
                isDark ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-slate-200 bg-white shadow-lg"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="font-data text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
                  ATS Report
                </p>
                <span className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.18em] text-emerald-500">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>

              {/* Gauge */}
              <div className="mt-6 flex justify-center">
                <div className="relative h-40 w-40">
                  <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                    <defs>
                      <linearGradient id="ats-gauge" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke={isDark ? "#1e293b" : "#e2e8f0"}
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="url(#ats-gauge)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={C}
                      initial={reduced ? { strokeDashoffset: C * (1 - score / 100) } : { strokeDashoffset: C }}
                      whileInView={{ strokeDashoffset: C * (1 - score / 100) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-data text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {score}
                    </span>
                    <span className="font-data text-[10px] uppercase tracking-[0.18em] text-emerald-500">
                      / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown bars */}
              <div className="mt-7 space-y-4">
                {formatBars.map((bar, index) => (
                  <div key={bar.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className={`font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {bar.label}
                      </span>
                      <span className="font-data text-emerald-500">{bar.value}%</span>
                    </div>
                    <div className={`h-2 overflow-hidden rounded-full ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                      <motion.div
                        initial={reduced ? { width: `${bar.value}%` } : { width: 0 }}
                        whileInView={{ width: `${bar.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 + index * 0.15, ease: "easeOut" }}
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -right-4 -top-4 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-500 backdrop-blur-xl"
            >
              Instant · under 30s
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisCV;