import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeProvider";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Map,
  Info,
  Home,
  Moon,
  Sun,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    try {
      await logOut();
      setIsProfileOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef, setIsProfileOpen]);

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-4">
      <nav
        className={`relative mx-auto max-w-7xl rounded-2xl border shadow-2xl backdrop-blur-2xl transition-colors duration-300
          ${
            isDark
              ? "border-white/10 bg-slate-950/70 text-white shadow-black/20 supports-backdrop-filter:bg-slate-950/55"
              : "border-orange-200/70 bg-white/75 text-slate-900 shadow-orange-200/30 supports-backdrop-filter:bg-white/65"
          }`}
      >
        {/* decorative glow */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl ${
            isDark
              ? "bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.10),transparent_28%)]"
          }`}
        />

        <div className="relative flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25 transition duration-300 group-hover:scale-105">
                <span className="text-sm font-extrabold tracking-wide">CF</span>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
              </div>

              <div className="leading-tight">
                <h1
                  className={`text-base font-bold tracking-tight sm:text-lg ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  CareerForge <span className="text-indigo-500">BD</span>
                </h1>
                <p
                  className={`-mt-0.5 text-[11px] ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Build smarter careers
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div
              className={`hidden items-center gap-2 rounded-full border p-1 md:flex ${
                isDark
                  ? "border-white/10 bg-white/3"
                  : "border-orange-200/70 bg-orange-50/80"
              }`}
            >
              <DesktopNavItem to="/" icon={<Home size={16} />} isDark={isDark}>
                Home
              </DesktopNavItem>

              <DesktopNavItem
                to="/about"
                icon={<Info size={16} />}
                isDark={isDark}
              >
                About
              </DesktopNavItem>

              {user && (
                <>
                  <DesktopNavItem
                    to="/dashboard"
                    icon={<LayoutDashboard size={16} />}
                    isDark={isDark}
                  >
                    Dashboard
                  </DesktopNavItem>

                  <DesktopNavItem
                    to="/roadmap"
                    icon={<Map size={16} />}
                    isDark={isDark}
                  >
                    Roadmap
                  </DesktopNavItem>
                </>
              )}
            </div>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`group flex h-11 w-11 items-center justify-center rounded-2xl border transition duration-300 ${
                isDark
                  ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/8"
                  : "border-orange-200 bg-orange-50/80 text-orange-700 hover:bg-orange-100"
              }`}
            >
              <span className="transition duration-300 group-hover:rotate-12">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </span>
            </button>

            {!user ? (
              <>
                <Link
                  to="/signin"
                  className={`rounded-full border border-transparent px-4 py-2 text-sm font-medium transition ${
                    isDark
                      ? "text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                      : "text-slate-700 hover:border-orange-200 hover:bg-orange-50 hover:text-slate-900"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-2 transition duration-300 ${
                    isDark
                      ? "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]"
                      : "border-orange-200 bg-orange-50/80 hover:bg-orange-100"
                  }`}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user?.displayName || "User"}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/25"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white ring-2 ring-indigo-500/25">
                      {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="text-left">
                    <p
                      className={`max-w-[140px] truncate text-sm font-semibold ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {user?.displayName || "User"}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Personal Account
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`transition duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    } ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    className={`absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl ${
                      isDark
                        ? "border-white/10 bg-slate-900/95 shadow-black/30"
                        : "border-orange-200 bg-white/95 shadow-orange-200/30"
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden border-b px-4 py-4 ${
                        isDark ? "border-white/10" : "border-orange-100"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10" />
                      <div className="relative flex items-center gap-3">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user?.displayName || "User"}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/25"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
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
                              isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <DropdownLink
                        to="/updateprofile"
                        icon={<User size={16} />}
                        onClick={() => setIsProfileOpen(false)}
                        isDark={isDark}
                      >
                        My Profile
                      </DropdownLink>

                      <div
                        className={`my-2 h-px ${
                          isDark ? "bg-white/10" : "bg-orange-100"
                        }`}
                      />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE RIGHT */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`rounded-xl border p-2 transition ${
                isDark
                  ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={`rounded-xl border p-2 transition ${
                isDark
                  ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isOpen
              ? `max-h-[650px] border-t ${
                  isDark ? "border-white/10" : "border-orange-100"
                }`
              : "max-h-0"
          }`}
        >
          <div
            className={`px-4 py-4 backdrop-blur-2xl ${
              isDark ? "bg-slate-950/85" : "bg-white/85"
            }`}
          >
            <div className="flex flex-col gap-2">
              {user && (
                <div
                  className={`mb-2 rounded-3xl border p-4 ${
                    isDark
                      ? "border-white/10 bg-white/[0.05]"
                      : "border-orange-200 bg-orange-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user?.displayName || "User"}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/25"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white">
                        {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p
                        className={`truncate font-semibold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {user?.displayName || "User"}
                      </p>
                      <p
                        className={`truncate text-sm ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <MobileNavLink
                to="/"
                icon={<Home size={16} />}
                onClick={() => setIsOpen(false)}
                isDark={isDark}
              >
                Home
              </MobileNavLink>

              <MobileNavLink
                to="/about"
                icon={<Info size={16} />}
                onClick={() => setIsOpen(false)}
                isDark={isDark}
              >
                About
              </MobileNavLink>

              {user ? (
                <>
                  <MobileNavLink
                    to="/dashboard"
                    icon={<LayoutDashboard size={16} />}
                    onClick={() => setIsOpen(false)}
                    isDark={isDark}
                  >
                    Dashboard
                  </MobileNavLink>

                  <MobileNavLink
                    to="/roadmap"
                    icon={<Map size={16} />}
                    onClick={() => setIsOpen(false)}
                    isDark={isDark}
                  >
                    Roadmap
                  </MobileNavLink>

                  <MobileNavLink
                    to="/updateprofile"
                    icon={<User size={16} />}
                    onClick={() => setIsOpen(false)}
                    isDark={isDark}
                  >
                    My Profile
                  </MobileNavLink>

                  <button
                    onClick={handleLogout}
                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink
                    to="/signin"
                    icon={<User size={16} />}
                    onClick={() => setIsOpen(false)}
                    isDark={isDark}
                  >
                    Login
                  </MobileNavLink>

                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

function DesktopNavItem({ to, children, icon, isDark }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive
            ? isDark
              ? "bg-white/10 text-white shadow-inner"
              : "bg-white text-slate-900 shadow-sm"
            : isDark
            ? "text-slate-300 hover:bg-white/5 hover:text-white"
            : "text-slate-700 hover:bg-white hover:text-slate-900"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}

function DropdownLink({ to, children, icon, onClick, isDark }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${
        isDark
          ? "text-slate-300 hover:bg-white/5 hover:text-white"
          : "text-slate-700 hover:bg-orange-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ to, children, icon, onClick, isDark }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? isDark
              ? "border border-indigo-500/20 bg-indigo-500/15 text-white"
              : "border border-orange-200 bg-orange-50 text-orange-700"
            : isDark
            ? "text-slate-300 hover:bg-white/5 hover:text-white"
            : "text-slate-700 hover:bg-orange-50 hover:text-slate-900"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}

export default Navbar;