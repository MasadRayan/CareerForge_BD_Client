import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bannerImg from "../../assets/banner-laptop.png";
import { useTheme } from "../../Context/ThemeProvider";
const Banner = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <section
      className={`relative overflow-hidden -mt-[92px] px-6 pt-32 pb-16 transition-colors duration-300 md:px-12 md:pt-36 md:pb-20 lg:px-20 lg:pt-40 lg:pb-24 ${
        isDark ? "bg-[#050816]" : "bg-white"
      }`}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="space-y-5">
            <h1
              className={`text-4xl font-bold leading-tight md:text-5xl xl:text-6xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Precision Path to
              <br />
              Your{" "}
              <span
                className={
                  isDark
                    ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent"
                    : "text-[#2563EB]"
                }
              >
                <Typewriter
                  words={[
                    "Dream Career.",
                    "Best CV.",
                    "Future Role.",
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={90}
                  deleteSpeed={45}
                  delaySpeed={1800}
                />
              </span>
            </h1>

            <p
              className={`max-w-xl text-lg leading-8 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Unlock your next opportunity with Bangladesh's AI-powered career
              platform. Optimize your CV, build a clear career roadmap, and
              prepare for interviews with AI-powered insights.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/dashboard/cvs">
              <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700">
                Optimize Your CV
                <ArrowRight size={18} />
              </button>
            </Link>

            <Link to="/dashboard/roadmaps">
              <button
                className={`rounded-xl border px-7 py-3 font-semibold transition ${
                  isDark
                    ? "border-slate-700 text-white hover:bg-slate-800"
                    : "border-slate-300 text-slate-800 hover:bg-slate-100"
                }`}
              >
                Explore Roadmap
              </button>
            </Link>
          </div>
        </motion.div>
                {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center lg:justify-end"
        >
          <div
            className={`overflow-hidden rounded-3xl border shadow-xl ${
              isDark
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <img
              src={bannerImg}
              alt="Career Banner"
              className="h-[320px] w-full object-cover rounded-3xl md:h-[400px] lg:h-[450px] lg:max-w-[560px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Banner;