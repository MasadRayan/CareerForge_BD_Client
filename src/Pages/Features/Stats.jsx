import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import useAxios from "../../Hooks/useAxios";
import { useTheme } from "../../Context/ThemeProvider";

const STAT_META = [
  {
    id: "cvsAnalyzed",
    label: "CVs Analyzed",
    description: "Resume Intelligence",
  },
  {
    id: "starRewrites",
    label: "STAR Rewrites",
    description: "AI Optimization",
  },
  {
    id: "careerRoadmaps",
    label: "Career Roadmaps",
    description: "Growth Planning",
  },
  {
    id: "mockInterviews",
    label: "Mock Interviews",
    description: "Interview Practice",
  },
  {
    id: "totalUsers",
    label: "Total Users",
    description: "Growing Community",
  },
];

const Stats = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const axios = useAxios();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    axios
      .get("/api/analytics/public")
      .then((res) => {
        if (!cancelled && res.data.success) setValues(res.data.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [axios]);

  const stats = STAT_META.map((stat) => ({
    ...stat,
    value: values[stat.id] ?? 0,
  }));

  return (
    <section
      className={`py-16 transition-colors duration-500 ${isDark ? "bg-[#050816]" : "bg-slate-50"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark
                ? "border-slate-700 bg-slate-900/70 text-slate-400"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            Career impact
          </span>

          <h2
            className={`mt-5 text-4xl font-bold tracking-tight md:text-5xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            The numbers speak{" "}
            <span className="text-emerald-500">for themselves</span>
          </h2>

          <p
            className={`mx-auto mt-4 max-w-xl text-base leading-7 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Helping job seekers build stronger applications, identify skill
            gaps, and make smarter career decisions with confidence.
          </p>
        </motion.div>

        <div className="grid gap-6 mt-10 md:mt-0 grid-cols-1 lg:grid-cols-5">
          {loading
            ? STAT_META.map((stat) => (
                <div
                  key={stat.id}
                  className={`animate-pulse rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white shadow-lg"}`}
                >
                  <div
                    className={`h-10 w-20 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-200"}`}
                  />
                  <div
                    className={`mt-4 h-4 w-32 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-200"}`}
                  />
                  <div
                    className={`mt-2 h-3 w-24 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-100"}`}
                  />
                </div>
              ))
            : stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                >
                  <StatCard {...stat} isDark={isDark} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
