import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";
import bannerBg from "../../assets/banner-laptop.png"; 

const Banner = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={` min-h-screen flex items-center overflow-hidden ${
        isDark ? "bg-[#050816]" : "bg-[#f8fafc]"
      }`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bannerBg})`,
        }}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-linear-to-b from-[#050816]/95 via-[#050816]/80 to-[#050816]"
            : "bg-linear-to-b from-white/90 via-white/80 to-white"
        }`}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-5 text-center">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className={`text-5xl font-bold leading-tight md:text-6xl lg:text-7xl ${
            isDark ? "text-white" : "text-[#111827]"
          }`}
        >
          Build Your Career With{" "}
          <span className="text-emerald-600">
            AI
          </span>
          <br />

          <span
            className={
              isDark
                ? "text-emerald-400"
                : "text-emerald-700"
            }
          >
            <Typewriter
              words={[
                "Precision",
                "Confidence",
                "Success",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
        </motion.h1>


        {/* Description */}
        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{delay:.3}}
          className={`mx-auto mt-7 max-w-2xl text-lg leading-8 ${
            isDark
              ? "text-slate-300"
              : "text-slate-600"
          }`}
        >
          Create a stronger career with resume analysis, smart job recommendations, and interview practice designed to help you succeed.
        </motion.p>


        {/* Buttons */}
        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{delay:.5}}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >

          <Link to="/dashboard/cvs">
            <button
              className="
              flex items-center justify-center gap-2
              rounded-full
              bg-emerald-600
              px-8 py-3.5
              font-semibold
              text-white
              shadow-lg
              transition
              hover:bg-emerald-700
              "
            >
              Start Your Free Trial
              <ArrowRight size={18}/>
            </button>
          </Link>


          <button
            className={`
            flex items-center justify-center gap-2
            rounded-full
            border
            px-8 py-3.5
            font-semibold
            transition
            ${
              isDark
              ?
              "border-slate-700 text-white hover:bg-slate-800"
              :
              "border-slate-300 text-slate-800 hover:bg-slate-100"
            }
            `}
          >
            <PlayCircle size={18}/>
            See How It Works
          </button>

        </motion.div>


      </div>
    </section>
  );
};

export default Banner;