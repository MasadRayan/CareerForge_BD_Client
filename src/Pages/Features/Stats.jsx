import { motion } from "framer-motion";
import StatCard from "./StatCard";
import { useTheme } from "../../Context/ThemeProvider";

const stats = [
  {
    value: 2500,
    label: "CVs Analyzed",
    description: "Resume Intelligence",
  },
  {
    value: 1200,
    label: "Skills Discovered",
    description: "Skill Analysis",
  },
  {
    value: 5000,
    label: "STAR Rewrites",
    description: "AI Optimization",
  },
  {
    value: 850,
    label: "Career Roadmaps",
    description: "Growth Planning",
  },
  {
    value: 700,
    label: "Mock Interviews",
    description: "Interview Practice",
  },
];


const Stats = () => {

  const { theme } = useTheme();
  const isDark = theme === "dark";


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

          {stats.map((stat,index)=>(
            <motion.div key={stat.label} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*0.12}}>
              <StatCard {...stat} isDark={isDark}/>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Stats;