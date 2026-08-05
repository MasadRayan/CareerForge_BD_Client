import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Ghost } from "lucide-react";
import { useTheme } from "../Context/ThemeProvider";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`min-h-screen flex items-center justify-center overflow-hidden px-5 transition-all duration-500
      ${
        isDark ? "bg-[#050816] text-white": "bg-gradient-to-br from-slate-100 via-white to-slate-200 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity:0, scale:0.8 }}
        animate={{ opacity:1, scale:1 }}
        transition={{duration:.6}}
        className={`relative z-10 max-w-xl w-full text-center p-10 rounded-3xl backdrop-blur-xl border
        ${
          isDark
          ? "bg-white/10 border-white/20 shadow-[0_0_50px_rgba(34,211,238,.2)]"
          : "bg-white/70 border-gray-200 shadow-xl"
        }`}
      >

        {/* 404 Animation */}
        <motion.div
          animate={{
            y:[0,-15,0],
          }}
          transition={{
            duration:3,
            repeat:Infinity
          }}
          className="flex justify-center"
        >
          <div
          className={`relative text-[120px] font-black tracking-widest
          ${
            isDark ? "text-cyan-400" :"text-gray-800"
          }`}
          >
            404
            <motion.div
            animate={{
              rotate:[0,360]
            }}
            transition={{
              duration:8,
              repeat:Infinity,
              ease:"linear"
            }}
            className="absolute -right-5 top-5"
            >
              <Ghost size={45}/>
            </motion.div>
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold mt-3">
        Oops! Page Not Found
        </h1>
        <p
        className={`mt-3 ${
          isDark  ?"text-gray-400" :"text-gray-600"
        }`}
        >
           The page you are looking for doesn't exist or has been moved
        </p>

        <motion.button
        whileHover={{
          scale:1.05
        }}
        whileTap={{
          scale:.95
        }}
        onClick={()=>navigate("/")}
        className={`mt-8 px-8 py-3 rounded-full flex items-center gap-2 mx-auto font-semibold
        ${
          isDark ? "bg-cyan-400 text-black hover:bg-cyan-300" : "bg-gray-900 text-white hover:bg-gray-700"
        }`}
        >
          <Home size={20}/>
          Back Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ErrorPage;