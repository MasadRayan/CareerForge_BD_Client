import { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn, FaGithub, FaUsers, FaAward, FaEye } from "react-icons/fa";
import { useTheme } from "../../Context/ThemeProvider";

const Avatar = ({ src, name }) => {
  const [error, setError] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (error || !src) {
    return (
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-3xl font-extrabold text-white shadow-xl border-4 border-emerald-500/20 transform transition-transform duration-500 group-hover:scale-105">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setError(true)}
      className="h-28 w-28 rounded-full object-cover border-4 border-emerald-500/20 shadow-xl transition-transform duration-500 group-hover:scale-105"
    />
  );
};

const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const teamMembers = [
    {
      name: "Masad Rayan",
      role: "Backend Developer",
      bio: "Develops secure, scalable, and high-performance backend systems with clean APIs and efficient database architecture.",
      image: "https://i.ibb.co.com/mCtZPbg3/Whats-App-Image-2026-08-08-at-12-04-14-AM.jpg",
      links: {
        linkedin: "https://www.linkedin.com/in/masad-rayan/",
        github: "https://github.com/MasadRayan"
      }
    },
    {
      name: "Shakawath Hossain",
      role: "Frontend Developer",
      bio: "Builds modern, responsive, and user-friendly interfaces with a strong focus on performance, accessibility, and seamless user experience.",
      image: "https://i.ibb.co.com/gMrFQPK6/image.png",
      links: {
        linkedin: "https://www.linkedin.com/in/shakawath-hossain-3a3561300/",
        github: "https://github.com/Shakwath?tab=repositories"
      }
    },
    {
      name: "Shoriful Hoque Nobin",
      role: "Frontend Developer",
      bio: "Creates engaging, responsive, and visually polished web interfaces while ensuring smooth interactions and clean, maintainable code.",
      image: "https://i.ibb.co.com/1fVBrvkp/image.png",
      links: {
        linkedin: "https://www.linkedin.com/in/shoriful-hoque-nobin-b992b1350",
        github: "https://github.com/shoriful12win"
      }
    }
  ];

  const stats = [
    { icon: <FaUsers className="h-6 w-6 text-emerald-400" />, value: "4+", label: "Active Talents" },
    { icon: <FaAward className="h-6 w-6 text-indigo-400" />, value: "98%", label: "Success Rate" },
    { icon: <FaEye className="h-6 w-6 text-teal-400" />, value: "15+", label: "Reviews Handled" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden pt-28 pb-20 transition-colors duration-500 ${
        isDark ? "bg-[#050816] text-white" : "bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc] text-slate-900"
      }`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase text-emerald-400">
            Our Vision
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-4xl lg:text-4xl">
            Meet the Builders of{" "}
              CareerForge BD
          </h2>

          <p className={`mx-auto mt-6 max-w-2xl text-lg leading-8 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            We are dedicated to building smart AI systems and career analysis tools that guide young professional talents to unlock their true potential.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mx-auto mb-20 grid max-w-4xl grid-cols-3 gap-6 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 transition-all duration-300 ${
                isDark ? "border-slate-800 bg-[#07101F]/40" : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-2xl font-extrabold md:text-3xl">{stat.value}</div>
              <div className={`mt-1 text-xs font-medium md:text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Team Members Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 lg:gap-10"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group relative flex flex-col items-center rounded-3xl border p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? "border-slate-800 bg-[#07101F]/50 hover:border-slate-700"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Avatar placeholder */}
              <div className="mb-6 flex justify-center">
                <Avatar src={member.image} name={member.name} />
              </div>

              <h3 className="text-xl font-bold">{member.name}</h3>
              <h4 className="mt-1 text-sm font-semibold text-emerald-500 uppercase tracking-wider">{member.role}</h4>

              <p className={`mt-4 text-center text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {member.bio}
              </p>

              {/* Social Action buttons */}
              <div className="mt-8 flex justify-center gap-4">
                <a
                  href={member.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 shadow-md"
                  title="LinkedIn"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
                <a
                  href={member.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition duration-300 shadow-md ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white hover:bg-white hover:text-slate-900"
                      : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-900 hover:text-white"
                  }`}
                  title="GitHub"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;