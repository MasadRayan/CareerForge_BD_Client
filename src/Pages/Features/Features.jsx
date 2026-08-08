import { motion } from "framer-motion";
import {
  FileSearch,
  BrainCircuit,
  WandSparkles,
  Route,
  Mic,
} from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

const features = [
  {
    icon: FileSearch,
    title: "ATS Score",
    text: "Analyze your CV compatibility and improve your hiring chances.",
    style: "from-blue-500/20 to-cyan-500/10",
    iconBg: "from-blue-500 to-cyan-400",
  },
  {
    icon: BrainCircuit,
    title: "Skill Gap",
    text: "Discover missing skills required for your dream job.",
    style: "from-purple-500/20 to-pink-500/10",
    iconBg: "from-purple-500 to-pink-500",
  },
  {
    icon: WandSparkles,
    title: "STAR Rewrite",
    text: "Convert your experience into powerful STAR format.",
    style: "from-orange-500/20 to-yellow-500/10",
    iconBg: "from-orange-500 to-yellow-400",
  },
  {
    icon: Route,
    title: "Career Roadmap",
    text: "Follow a personalized AI career growth roadmap.",
    style: "from-emerald-500/20 to-green-500/10",
    iconBg: "from-emerald-500 to-green-400",
  },
  {
    icon: Mic,
    title: "Mock Interview",
    text: "Practice interviews with AI feedback and improvement tips.",
    style: "from-red-500/20 to-rose-500/10",
    iconBg: "from-red-500 to-rose-400",
  },
];

const Features = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`py-16 transition-colors duration-500 ${isDark ? "bg-[#050816]" : "bg-slate-50"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark
                ? "border-slate-700 bg-slate-900/70 text-slate-400"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            AI Powered Features
          </span>

          <h2
            className={`mt-5 font-bold tracking-tight text-4xl md:text-5xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Everything You Need To{" "}
            <span className="text-emerald-500">Get Hired</span>
          </h2>

          <p
            className={`mx-auto mt-4 max-w-xl text-base leading-7 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Smart AI tools to analyze, improve and accelerate your career.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -12, rotateX: 5 }}
                className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-500 ${isDark ? "border-white/10 bg-white/5 backdrop-blur-xl hover:shadow-xl" : "border-slate-200 bg-white shadow-lg hover:shadow-xl"}`}
              >
                {/* Background Glow */}


                <div className={`absolute inset-0 bg-linear-to-br ${feature.style} opacity-0 transition duration-500 group-hover:opacity-100`} />



                {/* Number */}

                <span
                  className={`absolute right-4 top-3 text-5xl font-bold opacity-10 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  0{index + 1}
                </span>

                {/* Icon */}

                <motion.div

                  animate={{rotate:[0,5,-5,0]}}
                  transition={{duration:4,repeat:Infinity}}
                  className={`relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${feature.iconBg} text-white shadow-lg`}
                >
                  <Icon size={24} />
                </motion.div>

                {/* Title */}

                <h3
                  className={`relative text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {feature.title}
                </h3>

                {/* Text */}

                <p
                  className={`relative mt-2 text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {feature.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
