import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  Map,
  ArrowRight,
  Target,
} from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your CV",
    description:
      "Start by uploading your resume so we can understand your experience, skills, and background.",
    color: "blue",
  },
  {
    number: "02",
    icon: FileText,
    title: "Add a job",
    description:
      "Paste the job description you're targeting and we'll compare it with your profile.",
    color: "purple",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Get AI insights",
    description:
      "Receive your ATS score, skill gaps, and practical recommendations to improve your chances.",
    color: "orange",
  },
  {
    number: "04",
    icon: Map,
    title: "Follow your roadmap",
    description:
      "Turn your results into a clear career roadmap with actionable steps for growth.",
    color: "emerald",
  },
];

const colorStyles = {
  blue: {
    icon: "bg-blue-500/10 text-blue-500",
    number: "bg-blue-500 text-white",
    line: "bg-blue-500",
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-500",
    number: "bg-purple-500 text-white",
    line: "bg-purple-500",
  },
  orange: {
    icon: "bg-orange-500/10 text-orange-500",
    number: "bg-orange-500 text-white",
    line: "bg-orange-500",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-500",
    number: "bg-emerald-500 text-white",
    line: "bg-emerald-500",
  },
};

export default function HowItWorks() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section
      className={`relative overflow-hidden py-16 ${
        dark ? "bg-[#050816]" : "bg-slate-50"
      }`}
    >
      {/* Subtle background */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          dark
            ? "bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_45%)]"
            : "bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.06),transparent_45%)]"
        }`}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              dark
                ? "border-slate-700 bg-slate-900/70 text-slate-400"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            Simple process
          </span>

          <h2
            className={`mt-5 font-bold tracking-tight text-4xl md:text-5xl ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            From CV to{" "}
            <span className="text-emerald-500">
              career direction
            </span>
          </h2>

          <p
            className={`mx-auto mt-4 max-w-xl text-base leading-7 ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            A simple four-step process that turns your resume and career goals
            into clear, actionable guidance.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Desktop connector */}
          <div
            className={`absolute left-[12.5%] right-[12.5%] top-10 hidden h-px lg:block ${
              dark ? "bg-slate-800" : "bg-slate-200"
            }`}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const styles = colorStyles[step.color];

              return (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.1,
                  }}
                  className="group relative"
                >
                  {/* Step icon */}
                  <div className="relative z-10 flex justify-center">
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg ${
                        dark
                          ? "border-slate-800 bg-[#0b1020]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                      >
                        <Icon size={23} strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Number */}
                    <span
                      className={`absolute right-18 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[10px] font-bold shadow-md ${styles.number}`}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className={`mt-6 rounded-2xl border p-6 text-center transition-all duration-300 ${
                      dark
                        ? "border-slate-800/80 bg-[#0a0f1d] hover:border-slate-700 hover:bg-[#0c1222]"
                        : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold ${
                        dark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        dark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute -right-5 top-9 z-20 hidden lg:flex">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                          dark
                            ? "border-slate-800 bg-[#050816] text-slate-500"
                            : "border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                      >
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom goal indicator */}

      </div>
    </section>
  );
}