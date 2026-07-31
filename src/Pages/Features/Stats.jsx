import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import useAxios from "../../Hooks/useAxios";
import { useTheme } from "../../Context/ThemeProvider";

const STAT_META = [
  {
    key: "cvsAnalyzed",
    label: "CVs Analyzed",
    description: "Resume Intelligence",
  },
  {
    key: "starRewrites",
    label: "STAR Rewrites",
    description: "AI Optimization",
  },
  {
    key: "careerRoadmaps",
    label: "Career Roadmaps",
    description: "Growth Planning",
  },
  {
    key: "mockInterviews",
    label: "Mock Interviews",
    description: "Interview Practice",
  },
  {
    key: "totalUsers",
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
    value: values[stat.key] ?? 0,
  }));

  return (
    <section className={`py-20 transition-colors duration-500 ${isDark ? "bg-[#050816]" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className={`text-3xl font-bold md:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}>
            Built To Accelerate Your Career
          </h2>

          <p className={`mt-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Smart AI tools helping job seekers improve, prepare and get hired.
          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

          {loading
            ? STAT_META.map((stat) => (
                <div
                  key={stat.label}
                  className={`animate-pulse rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white shadow-lg"}`}
                >
                  <div className={`h-10 w-20 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                  <div className={`mt-4 h-4 w-32 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                  <div className={`mt-2 h-3 w-24 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                </div>
              ))
            : stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }}>
                  <StatCard {...stat} isDark={isDark} />
                </motion.div>
              ))}

        </div>

      </div>
    </section>
  );
};

export default Stats;
