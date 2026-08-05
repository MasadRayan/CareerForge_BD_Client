import { useRef, useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeProvider";
import useUserRole from "../Hooks/useUserRole";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  FileText,
  BarChart3,
  Map,
  HelpCircle,
  TrendingUp,
  Clock,
  MessageSquare,
  History,
  Activity,
  CreditCard,
  Receipt,
  Settings,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COMMON_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/profile", label: "My Profile", icon: User },
];

const USER_NAV = [
  { section: "Career Tools" },
  { to: "/dashboard/cvs", label: "My CVs", icon: FileText, end: true },
  { to: "/dashboard/analyses", label: "Analyses", icon: BarChart3 },
  { to: "/dashboard/roadmaps", label: "Roadmaps", icon: Map },
  { section: "Assessments" },
  { to: "/dashboard/quiz", label: "Quiz", icon: HelpCircle, end: true },
  { to: "/dashboard/quiz/stats", label: "Quiz Stats", icon: TrendingUp },
  { to: "/dashboard/quiz/history", label: "Quiz History", icon: Clock },
  { to: "/dashboard/interview", label: "Behavioral Test", icon: MessageSquare, end: true },
  { to: "/dashboard/interview/history", label: "Behavioral Test History", icon: History },
  { section: "Progress" },
  { to: "/dashboard/readiness", label: "Readiness Score", icon: Activity },
  { section: "Account" },
  { to: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { to: "/dashboard/payment-history", label: "Payment History", icon: Receipt },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV = [
  { section: "Admin" },
  { to: "/dashboard/admin/users", label: "All Users", icon: Users },
];

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const { role, roleLoading } = useUserRole();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isUser = role === "free_user" || role === "premium_user";
  const isAdmin = role === "admin";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const handleLogout = async () => {
    try {
      await logOut();
      setSidebarOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? isDark
          ? "bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/5"
          : "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/5"
        : isDark
        ? "text-slate-400 hover:bg-white/4 hover:text-slate-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const iconClass = ({ isActive }) =>
    `flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
      isActive
        ? isDark
          ? "bg-indigo-500/20 text-indigo-300"
          : "bg-indigo-100 text-indigo-600"
        : isDark
        ? "text-slate-500 group-hover:text-slate-300"
        : "text-slate-400 group-hover:text-slate-700"
    }`;

  const sectionLabelClass = `px-4 pt-4 pb-1 text-[11px] font-semibold tracking-widest uppercase ${
    isDark ? "text-slate-600" : "text-slate-400"
  }`;

  const renderNavItems = (items) =>
    items.map((item, i) => {
      if (item.section) {
        return (
          <p key={`section-${item.section}`} className={sectionLabelClass}>
            {item.section}
          </p>
        );
      }
      const Icon = item.icon;
      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setSidebarOpen(false)}
          className={navClass}
        >
          {({ isActive }) => (
            <>
              <div className={iconClass({ isActive })}>
                <Icon size={16} />
              </div>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      );
    });

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0B0F1A]" : "bg-[#F8FAFC]"} lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]`}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:transition-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDark ? "border-r border-white/6 bg-[#0B0F1A]" : "border-r border-slate-200 bg-white"}`}
      >
        {/* Forge glow header */}
        <div className="relative overflow-hidden border-b px-4 pb-4 pt-6">
          <div
            className={`pointer-events-none absolute inset-0 ${
              isDark
                ? "bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_50%)]"
                : "bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.06),transparent_50%)]"
            }`}
          />
          <div
            className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl ${
              isDark ? "bg-indigo-500/10" : "bg-indigo-400/10"
            }`}
          />

          <Link to="/" className="group relative flex items-center gap-3">
            <div className="relative flex h-9 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20 transition duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
              <span className="text-sm font-extrabold tracking-wide">CF</span>
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            </div>
            <div>
              <h1
                className={`text-base font-bold tracking-tight sm:text-lg ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Career<span className="text-indigo-500">Forge</span>
              </h1>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`absolute right-4 top-4 rounded-lg p-1.5 transition lg:hidden ${
              isDark
                ? "text-slate-400 hover:bg-white/5 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* User card */}
        <div
          className={`mx-4 mt-4 rounded-xl border p-3 ${
            isDark
              ? "border-white/6 bg-white/3"
              : "border-indigo-100 bg-indigo-50/50"
          }`}
        >
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.displayName || "User"}
                className="h-10 w-10 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {user?.displayName || "User"}
              </p>
              <p
                className={`truncate text-xs ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {user?.email || "Signed in"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 space-y-0.5 px-4 overflow-y-auto">
          {renderNavItems(COMMON_NAV)}

          {!roleLoading && isUser && renderNavItems(USER_NAV)}

          {!roleLoading && isAdmin && renderNavItems(ADMIN_NAV)}
        </nav>

        {/* Bottom section */}
        <div
          className={`border-t px-4 py-4 ${
            isDark ? "border-white/6" : "border-slate-200"
          }`}
        >
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              isDark
                ? "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                : "text-slate-500 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <LogOut size={16} />
            Sign out
          </button>
          <p
            className={`mt-3 text-center text-[10px] tracking-wider uppercase ${
              isDark ? "text-slate-700" : "text-slate-400"
            }`}
          >
            CareerForge BD &mdash; v1.0
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header
          className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 lg:px-8 ${
            isDark
              ? "border-white/6 bg-[#0B0F1A]/80 backdrop-blur-xl"
              : "border-slate-200 bg-white/80 backdrop-blur-xl"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`rounded-lg p-2 transition lg:hidden ${
                isDark
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div
              className={`h-5 w-px lg:hidden ${
                isDark ? "bg-white/6" : "bg-slate-200"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`rounded-lg p-2 transition ${
                isDark
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Right side: user dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition ${
                  isDark
                    ? "border-white/6 hover:bg-white/4"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.displayName || "User"}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                    {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span
                  className={`hidden text-sm font-medium sm:block ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {user?.displayName || "User"}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  } ${isDark ? "text-slate-500" : "text-slate-400"}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border shadow-xl ${
                      isDark
                        ? "border-white/6 bg-[#0F1525]"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                        isDark
                          ? "text-slate-300 hover:bg-white/4 hover:text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <User size={15} />
                      My Profile
                    </Link>
                    <div
                      className={`h-px ${
                        isDark ? "bg-white/6" : "bg-slate-200"
                      }`}
                    />
                    <button
                      onClick={handleLogout}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition hover:bg-red-500/10`}
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
