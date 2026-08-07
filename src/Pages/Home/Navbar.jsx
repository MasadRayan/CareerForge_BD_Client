import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeProvider";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeProfile = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfile);

    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setProfileOpen(false);
      setMenuOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className=" sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <nav
          className={`flex h-18 items-center justify-between rounded-2xl border px-6 transition-all duration-300 ${
            scrolled
              ? isDark
                ? "border-slate-800 bg-linear-to-r from-[#07101F]/80 via-[#0B1835]/80 to-[#10284A]/80 backdrop-blur-xl shadow-xl shadow-blue-500/10"
                : "border-slate-200 bg-white/80 backdrop-blur-xl shadow-lg"
              : isDark
              ? "border-slate-800 bg-linear-to-r from-[#050816] via-[#0B1835] to-[#13284D]"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <h1
              className={`text-xl font-bold tracking-tight ${
                isDark ? "text-white" : "[#0f172A]"
              }`}
            >
              CareerForge
              <span className="ml-1 text-emerald-500">BD</span>
            </h1>

            <span
              className={`text-[11px] ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Build smarter career
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            <DesktopNavItem to="/" icon={<Home size={17} />} isDark={isDark}>
              Home
            </DesktopNavItem>

            <DesktopNavItem
              to="/about"
              icon={<Info size={17} />}
              isDark={isDark}
            >
              About
            </DesktopNavItem>

            {user && (
              <DesktopNavItem
                to="/dashboard"
                icon={<LayoutDashboard size={17} />}
                isDark={isDark}
              >
                Dashboard
              </DesktopNavItem>
            )}
          </div>
          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
                isDark
                  ? "border-[#10B981]/20 bg-[#0F172A]/70 hover:bg-[#1E293B]"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              {isDark ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>

            {!user ? (
              <>
                <Link
                  to="/signin"
                  className={`hidden rounded-xl px-4 py-2 text-sm font-medium transition lg:block ${
                    isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-[#0F172A] hover:text-[#10B981]"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="hidden rounded-xl bg-[#10B981] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#059669] hover:shadow-lg hover:shadow-[#10B981]/30 lg:block"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative hidden lg:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-3 rounded-xl border px-2.5 py-1.5 transition-all duration-300 ${
                    isDark
                      ? "border-[#10B981]/20 bg-[#0F172A]/70 hover:bg-[#1E293B]"
                      : "border-slate-200 bg-white hover:bg-slate-100"
                  }`}
                >
                  {user?.photoURL ? (
                    <img
                      referrerPolicy="no-referrer"
                      src={user.photoURL}
                      alt="profile"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="text-left">
                    <p
                      className={`max-w-32.5 truncate text-sm font-semibold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {user?.displayName || "User"}
                    </p>

                    <p
                      className={`max-w-32.5 truncate text-xs ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {user?.email}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`transition duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {profileOpen && (
                  <div
                    className={`absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border shadow-xl ${
                      isDark
                        ? "border-slate-700 bg-slate-900/95 backdrop-blur-xl"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* User Info */}
                    <div
                      className={`border-b px-5 py-4 ${
                        isDark ? "border-slate-800" : "border-slate-200"
                      }`}
                    >
                      <p
                        className={`truncate font-semibold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {user?.displayName || "User"}
                      </p>

                      <p
                        className={`truncate text-xs ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {user?.email}
                      </p>
                    </div>

                    {/* Dashboard */}
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3 transition ${
                        isDark
                          ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-5 py-3 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 lg:hidden ${
                isDark
                  ? "border-slate-700 bg-slate-900/60 hover:bg-slate-800"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`mt-3 overflow-hidden rounded-2xl border lg:hidden ${
            isDark
              ? "border-slate-800 bg-linear-to-b from-[#07101F] to-[#0C1F3F]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="space-y-2 p-4">
            <MobileNavItem
              to="/"
              icon={<Home size={18} />}
              isDark={isDark}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </MobileNavItem>

            <MobileNavItem
              to="/about"
              icon={<Info size={18} />}
              isDark={isDark}
              onClick={() => setMenuOpen(false)}
            >
              About
            </MobileNavItem>

            {user && (
              <MobileNavItem
                to="/dashboard"
                icon={<LayoutDashboard size={18} />}
                isDark={isDark}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </MobileNavItem>
            )}

            <div
              className={`my-2 border-t ${
                isDark ? "border-slate-800" : "border-slate-200"
              }`}
            />

            {!user ? (
              <>
                <Link
                  to="/signin"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-center font-medium transition ${
                    isDark
                      ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <div
                  className={`rounded-xl px-4 py-3 ${
                    isDark ? "bg-slate-900/60" : "bg-slate-100"
                  }`}
                >
                  <p
                    className={`truncate text-sm font-semibold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {user?.displayName}
                  </p>

                  <p
                    className={`truncate text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
function DesktopNavItem({ to, children, icon, isDark }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2  pb-1 text-sm font-medium transition-all duration-300 ${
          isActive
            ? "border-[#10B981] text-[#10B981]"
            : isDark
              ? "border-transparent text-slate-300 hover:border-[#10B981] hover:text-[#10B981]"
              : "border-transparent text-[#0F172A] hover:border-[#10B981] hover:text-[#10B981]"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}

function MobileNavItem({ to, children, icon, onClick, isDark }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
          isActive
            ? "bg-[#10B981] text-white"
            : isDark
              ? "text-slate-300 hover:bg-[#10B981]/10 hover:text-[#10B981]"
              : "text-[#0F172A] hover:bg-[#10B981]/10 hover:text-[#10B981]"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}
export default Navbar;
