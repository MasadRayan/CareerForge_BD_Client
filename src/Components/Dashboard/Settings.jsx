import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import { useTheme } from "../../Context/ThemeProvider";
import { Sun, Moon, User, Mail, ExternalLink } from "lucide-react";

const MicroPreview = ({ isDark }) => (
  <div
    className={`rounded-lg border-2 overflow-hidden transition-colors duration-500 ${
      isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white"
    }`}
    style={{ width: 180, height: 100 }}
  >
    <div
      className={`h-5 flex items-center px-2 gap-1 transition-colors duration-500 ${
        isDark ? "bg-zinc-800" : "bg-zinc-100"
      }`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      <div
        className={`ml-auto text-[7px] font-medium transition-colors duration-500 ${
          isDark ? "text-zinc-400" : "text-zinc-500"
        }`}
      >
        careerforge
      </div>
    </div>
    <div className="p-2 flex gap-1.5">
      <div
        className={`w-3 h-3 rounded transition-colors duration-500 ${
          isDark ? "bg-zinc-700" : "bg-zinc-300"
        }`}
      />
      <div className="flex-1 space-y-1">
        <div
          className={`h-1.5 rounded transition-colors duration-500 ${
            isDark ? "bg-zinc-700" : "bg-zinc-300"
          }`}
          style={{ width: "70%" }}
        />
        <div
          className={`h-1.5 rounded transition-colors duration-500 ${
            isDark ? "bg-zinc-700" : "bg-zinc-300"
          }`}
          style={{ width: "45%" }}
        />
        <div
          className={`h-1.5 rounded transition-colors duration-500 ${
            isDark ? "bg-purple-500/50" : "bg-indigo-400/50"
          }`}
          style={{ width: "55%" }}
        />
      </div>
    </div>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    toast.success(`${theme === "dark" ? "Light" : "Dark"} mode activated`, {
      id: "theme-toast",
    });
  };

  const sections = [
    {
      id: "appearance",
      title: "Appearance",
      content: (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-content">
                Color scheme
              </p>
              <p className="text-xs text-base-content/50 mt-0.5">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex items-center px-0.5 ${
                isDark ? "bg-primary" : "bg-base-content/20"
              }`}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-base-300 shadow-sm flex items-center justify-center transition-transform duration-300 ${
                  isDark ? "translate-x-7" : "translate-x-0"
                }`}
              >
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>
            </button>
          </div>

          <div>
            <p className="text-xs text-base-content/40 mb-2">Preview</p>
            <MicroPreview isDark={isDark} />
          </div>
        </div>
      ),
    },
    {
      id: "account",
      title: "Account",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-base-content truncate">
                {user?.email || "No email"}
              </p>
              <p className="text-xs text-base-content/50">Email address</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/profile")}
            className="w-full rounded-xl border border-base-content/10 bg-base-200 hover:bg-base-300 transition px-4 py-2.5 text-sm font-medium text-base-content flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-base-content/50" />
              View profile
            </span>
            <ExternalLink className="w-4 h-4 text-base-content/30 group-hover:text-base-content/60 transition" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-base-content">Settings</h1>
        <p className="text-sm text-base-content/50 mt-1">
          Control your preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="rounded-xl border border-base-content/10 bg-base-300 border-l-2 border-l-primary p-5"
          >
            <h2 className="text-base font-semibold text-base-content mb-5 pb-3 border-b border-base-content/10">
              {section.title}
            </h2>
            {section.content}
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-base-content/30 mt-10">
        Changes are saved automatically
      </p>
    </div>
  );
};

export default Settings;
