import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

const FinalCTA = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`py-16 transition-colors duration-500 ${isDark ? "bg-[#050816]" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 p-12 text-center text-white md:p-16"
        >
          {/* Soft ring decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/20"
          />

          <div className="relative z-10">
            <p className="mb-3 font-data text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-100">
              Forged in Bangladesh · Verified skills
            </p>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Your next role is one roadmap away
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-emerald-50">
              Get your ATS score, follow a roadmap built for you, and earn skills an employer can
              actually verify — all in one place.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 font-semibold text-emerald-700 shadow-lg transition duration-300 hover:bg-emerald-50"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-9 py-4 font-semibold text-white transition duration-300 hover:bg-white/10"
              >
                Explore the dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;