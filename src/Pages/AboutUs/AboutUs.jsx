import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Hammer, Route, ShieldCheck } from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

/* ------------------------------------------------------------------ */
/*  Motion primitives — one reveal, reused everywhere                  */
/* ------------------------------------------------------------------ */

const useReveal = () => {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? undefined : { opacity: 0, y: 16 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15% 0px" },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  };
};

const Reveal = ({ delay = 0, className, children }) => {
  const reveal = useReveal();
  return (
    <motion.div
      {...reveal}
      transition={{ ...reveal.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Small shared pieces                                                */
/* ------------------------------------------------------------------ */

const Eyebrow = ({ children }) => (
  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-500">
    {children}
  </span>
);

const Rule = ({ isDark }) => (
  <hr className={isDark ? "border-white/10" : "border-slate-900/10"} />
);

/* Wordmark: flat, typographic, no rotating rings */
const Wordmark = ({ isDark }) => (
  <div className="inline-flex items-baseline gap-2 select-none">
    <span
      className={`text-[15px] font-semibold tracking-tight ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      CareerForge
    </span>
    <span className="rounded-sm bg-emerald-500/12 px-1.5 py-[2px] font-mono text-[10px] font-semibold tracking-[0.18em] text-emerald-500">
      BD
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const STAGES = [
  {
    num: "01",
    element: "Steel",
    body:
      "Every student here starts with more ambition than guidance. The talent is abundant and sharp — it's the direction that's missing.",
  },
  {
    num: "02",
    element: "Heat",
    body:
      "Heat shapes the metal: an AI that reads where you are, a roadmap for where you're going, and practice that tests you until the skill holds.",
  },
  {
    num: "03",
    element: "Seal",
    body:
      "A certificate means nothing unless someone can check it. Every seal we issue is public, verifiable, and earned.",
  },
];

const STATIONS = [
  {
    id: "STN-01",
    icon: Route,
    title: "The blueprint",
    body:
      "AI career roadmaps and CV analysis that lay out the exact steps between where you are and where you want to be.",
  },
  {
    id: "STN-02",
    icon: Hammer,
    title: "The forge",
    body:
      "Skill practice that tests you the way the real world does, with feedback specific enough to act on.",
  },
  {
    id: "STN-03",
    icon: ShieldCheck,
    title: "The seal",
    body:
      "Certificates issued on a passing score, each carrying a code anyone can verify at CareerForge BD.",
  },
];

const FACTS = [
  { value: "10", label: "Questions per assessment" },
  { value: "60%", label: "Score required to earn a seal" },
  { value: "100%", label: "Certificates verifiable online" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const t = {
    page: isDark ? "bg-[#050816] text-slate-100" : "bg-white text-slate-900",
    heading: isDark ? "text-white" : "text-slate-900",
    body: isDark ? "text-slate-400" : "text-slate-600",
    subtle: isDark ? "text-slate-500" : "text-slate-500",
    hairline: isDark ? "border-white/10" : "border-slate-900/10",
    inset: isDark ? "bg-white/[0.02]" : "bg-slate-50",
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${t.page}`}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-40 md:pb-24">
        <Reveal>
          <Wordmark isDark={isDark} />
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal delay={0.05} className="md:col-span-7">
            <h1
              className={`text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-[3.75rem] ${t.heading}`}
            >
              Forged in Bangladesh,
              <br className="hidden sm:block" />{" "}
              <span className="text-emerald-500">strong enough</span> for the
              world.
            </h1>
          </Reveal>

          <Reveal delay={0.12} className="md:col-span-5 md:pt-3">
            <p className={`text-lg leading-8 ${t.body}`}>
              CareerForge BD turns untapped talent into verified skill. We map
              the path, apply the heat, and seal the result — so a young
              professional can prove exactly what they're able to do.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Start your path
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/dashboard"
                className={`text-sm font-medium underline-offset-4 transition-colors hover:underline ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                See what we build
              </Link>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── Mission ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6">
        <Rule isDark={isDark} />
        <div className="grid gap-8 py-16 md:grid-cols-12 md:gap-12 md:py-20">
          <Reveal className="md:col-span-3">
            <Eyebrow>Mission</Eyebrow>
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-9">
            <p
              className={`text-pretty text-2xl font-medium leading-[1.35] tracking-[-0.01em] md:text-[1.75rem] ${t.heading}`}
            >
              Close the gap between ambition and guidance — with an AI that
              reads where you are, a roadmap that shows where you're going, and
              a seal that proves the skill.
            </p>
            <p className={`mt-6 max-w-2xl leading-7 ${t.body}`}>
              We're a small team of builders — frontend, backend, design and AI —
              working on one problem: making skill real, measurable and trusted
              across Bangladesh and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Forge line ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6">
        <Rule isDark={isDark} />
        <div className="grid gap-8 py-16 md:grid-cols-12 md:gap-12 md:py-20">
          <Reveal className="md:col-span-3">
            <Eyebrow>How we work</Eyebrow>
            <h2
              className={`mt-4 text-2xl font-semibold tracking-[-0.01em] ${t.heading}`}
            >
              The forge line
            </h2>
            <p className={`mt-3 text-sm leading-6 ${t.subtle}`}>
              A career is made the way metal is: raw material, then heat, then a
              mark that proves its worth.
            </p>
          </Reveal>

          <ol className="md:col-span-9">
            {STAGES.map((stage, i) => (
              <Reveal key={stage.num} delay={i * 0.06}>
                <li
                  className={`grid grid-cols-[3rem_1fr] gap-6 border-t py-8 first:border-t-0 first:pt-0 md:grid-cols-[4rem_1fr] ${t.hairline}`}
                >
                  <span className="font-mono text-sm tabular-nums text-emerald-500">
                    {stage.num}
                  </span>
                  <div>
                    <h3
                      className={`text-lg font-semibold tracking-[-0.01em] ${t.heading}`}
                    >
                      {stage.element}
                    </h3>
                    <p className={`mt-2 max-w-xl leading-7 ${t.body}`}>
                      {stage.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Stations ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6">
        <Rule isDark={isDark} />
        <div className="py-16 md:py-20">
          <Reveal className="max-w-xl">
            <Eyebrow>What we build</Eyebrow>
            <h2
              className={`mt-4 text-2xl font-semibold tracking-[-0.01em] md:text-3xl ${t.heading}`}
            >
              Three stations, one forge
            </h2>
          </Reveal>

          <div
            className={`mt-10 grid divide-y overflow-hidden rounded-xl border md:grid-cols-3 md:divide-x md:divide-y-0 ${t.hairline} ${
              isDark ? "divide-white/10" : "divide-slate-900/10"
            }`}
          >
            {STATIONS.map((station, i) => {
              const Icon = station.icon;
              return (
                <Reveal key={station.id} delay={i * 0.06}>
                  <article
                    className={`group h-full p-7 transition-colors md:p-8 ${
                      isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon
                        className="h-5 w-5 text-emerald-500"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500">
                        {station.id}
                      </span>
                    </div>
                    <h3
                      className={`mt-8 text-lg font-semibold tracking-[-0.01em] ${t.heading}`}
                    >
                      {station.title}
                    </h3>
                    <p className={`mt-3 text-sm leading-6 ${t.body}`}>
                      {station.body}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Facts ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6">
        <Rule isDark={isDark} />
        <dl className="grid gap-10 py-14 sm:grid-cols-3 md:py-16">
          {FACTS.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 0.06}>
              <div>
                <dt
                  className={`text-4xl font-semibold tabular-nums tracking-[-0.02em] ${t.heading}`}
                >
                  {fact.value}
                </dt>
                <dd className={`mt-2 text-sm leading-6 ${t.subtle}`}>
                  {fact.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ── Seal promise ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6">
        <Rule isDark={isDark} />
        <div className="grid gap-8 py-16 md:grid-cols-12 md:gap-12 md:py-20">
          <Reveal className="md:col-span-3">
            <Eyebrow>The seal</Eyebrow>
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-9">
            <h2
              className={`max-w-2xl text-2xl font-semibold leading-snug tracking-[-0.01em] md:text-3xl ${t.heading}`}
            >
              We don't sell certificates. We make them worth something.
            </h2>
            <p className={`mt-5 max-w-2xl leading-7 ${t.body}`}>
              Pass a skill assessment and you earn a certificate with a
              verification code anyone can check at CareerForge BD. Employers
              trust the seal because they can confirm it themselves — no email
              chains, no doubt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                to="/dashboard"
                className={`group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors ${
                  isDark
                    ? "border-white/15 text-white hover:bg-white/5"
                    : "border-slate-900/15 text-slate-900 hover:bg-slate-50"
                }`}
              >
                Explore the forge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span
                className={`inline-flex items-center gap-2 text-sm ${t.subtle}`}
              >
                <ShieldCheck
                  className="h-4 w-4 text-emerald-500"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                Verification code on every certificate
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <Reveal>
          <div
            className={`relative overflow-hidden rounded-2xl border px-8 py-14 md:px-14 md:py-20 ${t.hairline} ${t.inset}`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
            />
            <div className="max-w-2xl">
              <Eyebrow>Forge your career</Eyebrow>
              <h2
                className={`mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-4xl ${t.heading}`}
              >
                Bring your metal. Leave a seal.
              </h2>
              <p className={`mt-5 leading-7 ${t.body}`}>
                One roadmap, a few focused assessments, and a verifiable mark
                that says exactly what you can do.
              </p>
              <Link
                to="/signup"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
};

export default AboutUs;
