import { useRef, useState } from "react";
import bannerImg from "../../assets/banner-laptop.png";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useTheme } from "../../Context/ThemeProvider";
import { ArrowRight, Star, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Banner = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [transform, setTransform] = useState(
    "perspective(1800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
  );
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x - width / 2) / width) * 16;
    const rotateX = -((y - height / 2) / height) * 16;
    setTransform(
      `perspective(1800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`,
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(1800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    );
  };

  return (
    <section
  className={`relative isolate overflow-hidden px-6 md:px-12 lg:px-20 pt-32 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24 -mt-[92px]
    transition-colors duration-300 ${isDark ? "bg-[#050816]" : "bg-[#fffaf2]"}
  `}>
      {/* ================= BACKGROUND ================= */}
      <div
        className={`absolute inset-0 -z-20 ${
          isDark ? "bg-[#050816]" : "bg-white"
        }`}
      />
      {/* Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {isDark && (
          <>
            <div className="absolute left-[-10%] top-[-8%] h-105 w-105 rounded-full bg-cyan-500/20 blur-[120px]" />
            <div className="absolute right-[-8%] top-[10%] h-105 w-105 rounded-full bg-violet-600/20 blur-[120px]" />
            <div className="absolute left-[30%] bottom-[-10%] h-95 w-95 rounded-full bg-blue-500/20 blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%)]" />
          </>
        )}
      </div>

      {/* Grid */}
      {isDark && (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mask-[radial-gradient(circle_at_center,black,transparent_78%)]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
              backgroundSize: "42px 42px",
            }}
          />
        </div>
      )}
      {/* spotlight */}
      {isDark && (
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-10 -z-10 h-95 w-95 -translate-x-1/2 rounded-full bg-white/10 blur-[120px]"
        />
      )}

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* ================= LEFT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-7"
        >
          <div className="space-y-5">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className={`max-w-3xl font-bold leading-tight tracking-tight
            text-3xl md:text-4xl lg:text-5xl xl:text-[56px]
            ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Precision Path to
              <br />
              <span className={isDark ? "text-white" : "text-slate-900"}>
                Your{" "}
              </span>
              <span
                className={`inline-block text-[0.9em] italic ${
                  isDark
                    ? "bg-linear-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent"
                    : "text-slate-900"
                }`}
              >
                <Typewriter
                  words={["Dream Career.", "Best CV.", "Future Role."]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={90}
                  deleteSpeed={45}
                  delaySpeed={1800}
                />
              </span>
            </motion.h1>
n
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className={`max-w-2xl text-base leading-8 md:text-lg ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Unlock your next opportunity with Bangladesh's AI Powered career
              platform optimize your CV for ATS, build a clear career roadmap,
              and practice smarter with interview intelligence built for modern
              job seekers.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="flex flex-col gap-4 pt-2 sm:flex-row"
          >
            <Link to={"/dashboard/cvs"}>
              <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(249,115,22,0.28)] transition duration-300 hover:-translate-y-1 dark:from-cyan-400 dark:via-blue-500 dark:to-violet-500 dark:shadow-[0_12px_40px_rgba(59,130,246,0.35)]">
                Optimize Your CV
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>

            <Link to={'/dashboard/roadmaps'}>
            <button
              className={`rounded-2xl border px-7 py-3.5 text-sm font-semibold shadow-lg backdrop-blur-xl transition duration-300 ${
                isDark
                  ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
                  : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white"
              }`}
            >
              Explore Roadmap
            </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* ================= RIGHT 3D VISUAL ================= */}
        <motion.div
          initial={{ opacity: 0, x: 45 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-155">
            {/* glows */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -top-10 right-0 h-40 w-40 rounded-full blur-3xl ${
                isDark ? "bg-cyan-400/20" : "bg-amber-300/30"
              }`}
            />
            <motion.div
              animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute bottom-10 left-0 h-40 w-40 rounded-full blur-3xl ${
                isDark ? "bg-violet-500/20" : "bg-rose-300/30"
              }`}
            />

            {/* 3D wrapper */}
            <div
              className="group relative perspective-[1800px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* outer glow ring */}
              <div
                className={`absolute -inset-4.5 rounded-[34px] blur-2xl ${
                  isDark
                    ? "bg-linear-to-r from-cyan-400/25 via-blue-500/25 to-violet-500/25"
                    : "bg-linear-to-r from-amber-300/30 via-orange-300/30 to-rose-300/30"
                }`}
              />

              <motion.div
                ref={cardRef}
                style={{ transform, transformStyle: "preserve-3d" }}
                className={`relative overflow-hidden rounded-[30px] border backdrop-blur-2xl transition-transform duration-200 ${
                  isDark
                    ? "border-white/15 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
                    : "border-slate-200/70 bg-white/65 shadow-[0_30px_100px_rgba(15,23,42,0.12)]"
                }`}
              >
                {/* shine */}
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-linear-to-b to-transparent ${
                    isDark ? "from-white/30" : "from-white/50"
                  }`}
                  style={{ transform: "translateZ(50px)" }}
                />

                {/* image */}
                <div
                  className="relative"
                  style={{ transform: "translateZ(35px)" }}
                >
                  <img
                    src={bannerImg}
                    alt="Career Banner"
                    className="h-90 w-full object-cover md:h-115"
                  />
                  <div
                    className={`absolute inset-0 bg-linear-to-tr ${
                      isDark
                        ? "from-[#050816]/40 via-transparent to-cyan-400/10"
                        : "from-white/10 via-transparent to-amber-200/20"
                    }`}
                  />
                  <div
                    className={`absolute inset-x-0 bottom-0 h-32 bg-linear-to-t to-transparent ${
                      isDark ? "from-[#050816]/60" : "from-white/50"
                    }`}
                  />
                </div>

                {/* top badge */}
                <div
                  className={`absolute left-5 top-5 z-30 rounded-2xl border px-4 py-3 backdrop-blur-xl ${
                    isDark
                      ? "border-white/20 bg-black/25 text-white"
                      : "border-slate-200/70 bg-white/75 text-slate-900"
                  }`}
                  style={{ transform: "translateZ(70px)" }}
                >
                  <div
                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${
                      isDark ? "text-cyan-200" : "text-amber-600"
                    }`}
                  >
                    <Star className="h-4 w-4" />
                    Career Intelligence
                  </div>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isDark ? "text-white/90" : "text-slate-800"
                    }`}
                  >
                    AI insights in real time
                  </p>
                </div>

                {/* bottom ATS card */}
                <div
                  className={`absolute bottom-5 left-1/2 z-30 w-[92%] -translate-x-1/2 rounded-3xl border p-4 shadow-2xl backdrop-blur-2xl sm:p-5 ${
                    isDark
                      ? "border-white/15 bg-white/12"
                      : "border-slate-200/70 bg-white/75"
                  }`}
                  style={{ transform: "translateZ(85px)" }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${
                          isDark
                            ? "bg-cyan-400/15 text-cyan-300"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        <BadgeCheck className="h-6 w-6" />
                      </div>

                      <div>
                        <p
                          className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            isDark ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          ATS Readiness
                        </p>
                        <h3
                          className={`text-xl font-bold sm:text-2xl ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          92% Match Score
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                        +12% improved
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
