import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, Map, Flag } from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

const steps = [
  [Upload, "Upload CV", "Upload your resume.", "from-blue-500 to-cyan-400"],
  [FileText, "Job Description", "Add job requirements.", "from-purple-500 to-pink-500"],
  [Sparkles, "AI Analysis", "Get ATS score & suggestions.", "from-orange-400 to-amber-500"],
  [Map, "Career Roadmap", "Follow your growth path.", "from-green-400 to-emerald-500"],
];

export default function HowItWorks() {

  const {theme}=useTheme();
  const dark=theme==="dark";
  return (
    <section className={`py-14 ${dark?"bg-[#050816]":"bg-slate-50"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-emerald-500 text-sm tracking-widest">
            SIMPLE PROCESS
          </p>
          <h2 className={`text-3xl font-bold mt-2 ${dark?"text-white":"text-slate-900"}`}>
            Your Career Roadmap
          </h2>
        </div>
        {/* Desktop */}
        <div className="hidden md:block relative">
          <svg
            className="absolute top-10 w-full h-40"
            viewBox="0 0 1000 180"
            fill="none"
          >
            <path
              d="M40 90 C180 20 260 160 400 90 C540 20 650 160 780 90 C850 55 900 70 940 90"
              stroke={dark?"#334155":"#cbd5e1"}
              strokeWidth="22"
              strokeLinecap="round"
            />
            <motion.path
              d="M40 90 C180 20 260 160 400 90 C540 20 650 160 780 90 C850 55 900 70 940 90"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="10 12"
              strokeLinecap="round"
              animate={{strokeDashoffset:[100,0]}}
              transition={{
                duration:3,
                repeat:Infinity,
                ease:"linear"
              }}
            />
            <circle cx="40" cy="90" r="9" fill="#10b981"/>
            <g transform="translate(930 35)">
              <line y2="60" stroke={dark?"white":"black"} strokeWidth="4"/>
              <path d="M0 0L35 12L0 24Z" fill="#ef4444"/>
            </g>
          </svg>
          <div className="relative grid grid-cols-4">
            {steps.map(([Icon,title,text,color],i)=>(
              <motion.div
                key={title}
                initial={{opacity:0,y:i%2?30:-30}}
                whileInView={{opacity:1,y:0}}
                transition={{delay:i*.15}}
                className={`text-center ${i%2?"mt-20":""}`}
              >
                <span className="text-blue-500 text-sm font-bold">
                  0{i+1}
                </span>
                <div className={`mx-auto mt-3 w-14 h-14 rounded-full bg-linear-to-br ${color} flex items-center justify-center text-white shadow-xl`}>
                  <Icon size={25}/>
                </div>
                <h3 className={`mt-3 font-bold ${dark?"text-white":"text-slate-900"}`}>
                  {title}
                </h3>
                <p className={`text-sm mt-1 px-3 ${dark?"text-slate-400":"text-slate-600"}`}>
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Mobile */}
        <div className="md:hidden relative space-y-7">
          <div className="absolute left-7 top-0 h-full w-0.5 bg-blue-500/40"/>
          {steps.map(([Icon,title,text,color],i)=>(
            <div key={title} className="flex gap-5 relative">
              <div className={`z-10 w-14 h-14 rounded-full bg-linear-to-br ${color} flex items-center justify-center text-white`}>
                <Icon size={24}/>
              </div>
              <div>
                <span className="text-blue-500 text-sm">
                  0{i+1}
                </span>
                <h3 className={`font-bold ${dark?"text-white":"text-slate-900"}`}>
                  {title}
                </h3>
                <p className="text-sm text-slate-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 text-red-500 font-bold">
            <Flag size={22}/>
            Career Goal
          </div>
        </div>
      </div>
    </section>
  );
}