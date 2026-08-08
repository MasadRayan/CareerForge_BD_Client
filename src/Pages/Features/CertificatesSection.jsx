import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Award, BadgeCheck, Download, ShieldCheck } from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

const GRADIENT = "linear-gradient(135deg, #6366f1, #8b5cf6)";

const steps = [
  {
    num: "01",
    title: "Pick a skill",
    text: "Choose one of the skills you're building on your profile.",
  },
  {
    num: "02",
    title: "Pass the assessment",
    text: "Answer 10 questions. Score 60% or more to earn the seal.",
  },
  {
    num: "03",
    title: "Share your seal",
    text: "Download the PDF — every code is verifiable at CareerForge BD.",
  },
];

const CertificatesSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`py-16 transition-colors duration-500 ${isDark ? "bg-[#050816]" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark
                ? "border-slate-700 bg-slate-900/70 text-slate-400"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            Earn verifiable skills
          </span>

          <h2
            className={`mt-5 font-bold tracking-tight text-4xl md:text-5xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Skills that don't{" "}
            <span className="text-emerald-500">just sound true</span>
          </h2>

          <p
            className={`mx-auto mt-4 max-w-xl text-base leading-7 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Pass a skill assessment and walk away with a certificate any
            employer can check — not a claim, a verification code.
          </p>
        </motion.div>

        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* ── Mock certificate ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div
              className={`relative overflow-hidden rounded-2xl border shadow-xl transition-transform duration-500 hover:-translate-y-1 ${
                isDark ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-slate-200 bg-white shadow-lg"
              }`}
            >
              {/* Seal hairline — the brand's proof mark */}
              <div className="h-1 shrink-0 bg-linear-to-r from-indigo-500 via-violet-500 to-emerald-500" />

              <div className="flex flex-col items-center p-7 text-center">
                <div
                  aria-hidden
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ background: GRADIENT }}
                >
                  <Award className="h-6 w-6" />
                </div>

                <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-base-content">
                  Frontend Web Development
                </h3>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-data text-3xl font-bold tracking-tight text-base-content">82</span>
                  <span className="font-data text-[10px] uppercase tracking-[0.18em] text-base-content/40">/ 100</span>
                </div>

                {/* Verified chip */}
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-data text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>

                {/* Code box */}
                <div className="mt-5 w-full rounded-xl border border-base-content/10 bg-base-200/60 px-3 py-2.5">
                  <p className="font-data text-[9px] uppercase tracking-[0.2em] text-base-content/40">
                    Certification code
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <code className="font-data text-sm font-semibold text-base-content">CFC-8F3A92B4</code>
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-auto flex w-full items-center justify-between pt-5 text-[11px]">
                  <span className="font-data text-base-content/40">Issued Aug 2026</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-base-content/60">
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </span>
                </div>
              </div>
            </div>

            {/* Floating verification note */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-5 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 font-data text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-500 backdrop-blur-xl"
            >
              CFC-8F3A92B4 · Checkable anywhere
            </motion.div>
          </motion.div>

          {/* ── Steps + CTA ──────────────────────────────── */}
          <div>
            <ol className="space-y-6">
              {steps.map((step, index) => {
                return (
                  <motion.li
                    key={step.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.12 }}
                    className="flex items-start gap-4"
                  >
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-400 font-data text-sm font-bold text-white shadow-lg">
                      {step.num}
                    </div>
                    <div className="pt-1">
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{step.title}</h3>
                      <p className={`mt-1 text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {step.text}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                to="/dashboard/certificates"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 font-semibold text-white transition duration-300 hover:bg-emerald-700"
              >
                Earn your first certificate
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span
                className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                60% to pass
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;