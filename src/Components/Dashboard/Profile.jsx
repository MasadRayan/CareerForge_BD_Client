import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail, User, Pencil } from "lucide-react";
import { AuthContext } from "../../Context/AuthProvider";
import { useTheme } from "../../Context/ThemeProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// Theme accent — indigo, matching the dashboard navigation's active state
// (indigo-400/indigo-300 on dark, indigo-600/indigo-700 on light).
const ACC = { dark: "#818cf8", light: "#4f46e5" };
const PREMIUM = { dark: "#fbbf24", light: "#f59e0b" };
const GRADIENT = "linear-gradient(135deg, #6366f1, #8b5cf6)";

const ROLE_LABELS = {
  free_user: "Free Member",
  premium_user: "Premium",
  admin: "Admin",
};

const EXP_LABELS = {
  entry: "Entry Level",
  junior: "Junior",
  mid: "Mid Level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

const SectionTag = ({ children, acc }) => (
  <div className="mb-4 flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: acc }} />
    <span className="font-data text-[10px] font-semibold uppercase tracking-[0.18em] text-base-content/45">
      {children}
    </span>
    <span className="h-px flex-1 bg-base-content/8" />
  </div>
);

const Field = ({ label, value, muted }) => (
  <div className="min-w-0">
    <p className="font-data text-[10px] uppercase tracking-[0.18em] text-base-content/40">
      {label}
    </p>
    <p
      className={`mt-1.5 truncate text-sm font-medium ${
        muted ? "text-base-content/40" : "text-base-content"
      }`}
    >
      {value || "Not set"}
    </p>
  </div>
);

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const prefersReduced = useReducedMotion();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const acc = isDark ? ACC.dark : ACC.light;
  const premium = isDark ? PREMIUM.dark : PREMIUM.light;

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/api/users/me/${user.email}`)
      .then((res) => {
        if (res.data.success) setProfile(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      })
      .finally(() => setLoadingProfile(false));
  }, [user?.email, axiosSecure]);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 0.1, 0, 1] },
    },
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-300 text-base-content/30">
          <User className="h-6 w-6" />
        </div>
        <h2 className="font-display mt-5 text-xl font-semibold text-base-content">
          This page is only for signed-in members
        </h2>
        <p className="mt-2 text-sm text-base-content/50">
          Sign in to see and edit your professional profile.
        </p>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-6 py-4">
        <div className="h-5 w-32 rounded bg-base-content/10" />
        <div className="h-40 rounded-3xl bg-base-content/8" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-36 rounded-2xl bg-base-content/8" />
          <div className="h-36 rounded-2xl bg-base-content/8" />
        </div>
        <div className="h-48 rounded-2xl bg-base-content/8" />
        <div className="h-14 rounded-2xl bg-base-content/8" />
      </div>
    );
  }

  const displayName = profile?.name || user?.displayName || "User";
  const photo = profile?.photoURL || user?.photoURL || "";
  const hasPhoto = Boolean(photo);
  const displayEmail = profile?.email || user?.email || "";

  const target = profile?.target_role || "";
  const exp = profile?.experience_level || "";
  const expLabel = EXP_LABELS[exp] || "";
  const roleKey = profile?.role || "free_user";
  const roleLabel = ROLE_LABELS[roleKey] || roleKey;
  const roleColor =
    roleKey === "premium_user" ? premium : roleKey === "admin" ? acc : null;

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CF";

  const handleEdit = () => navigate("/dashboard/updateprofile");

  return (
    <div className="mx-auto max-w-3xl py-4">
      {/* Breadcrumb eyebrow */}
      <div className="mb-6 flex items-center gap-2 font-data text-[11px] uppercase tracking-[0.2em] text-base-content/40">
        <span>CareerForge</span>
        <span className="text-base-content/25">/</span>
        <span style={{ color: acc }}>My Profile</span>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="space-y-6"
      >
        {/* ── Forged identity record (signature) ─────────────── */}
        <motion.section
          variants={item}
          className="relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-300/60 p-6 sm:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)"
                : "radial-gradient(circle, rgba(99,102,241,0.10), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Medallion */}
            <div className="relative shrink-0">
              <div
                className="h-24 w-24 rounded-full p-0.75"
                style={{
                  background: `linear-gradient(135deg, ${acc}, transparent 62%)`,
                }}
              >
                <div className="h-full w-full overflow-hidden rounded-full bg-base-200 ring-1 ring-white/10">
                  {hasPhoto ? (
                    <img
                      src={photo}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-base-content/70"
                      style={{
                        backgroundColor: isDark ? "#1a212c" : "#eef1f6",
                      }}
                    >
                      {initials}
                    </div>
                  )}
                </div>
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full"
                style={{
                  background: roleColor || "currentColor",
                  boxShadow: `0 0 0 3px ${isDark ? "#0B0F1A" : "#F8FAFC"}`,
                }}
              />
            </div>

            {/* Name + role spec */}
            <div className="min-w-0 flex-1">
              <p className="font-data text-[10px] uppercase tracking-[0.24em] text-base-content/45">
                Identity Record
              </p>
              <h1 className="font-display mt-1.5 text-3xl font-semibold tracking-tight text-base-content sm:text-4xl">
                {displayName}
              </h1>
              <div
                className="mt-3 h-0.75 w-14 rounded-full"
                style={{ background: acc }}
              />
              <div className="font-data mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                <p>
                  <span className="text-base-content/40">grade / </span>
                  <span
                    className={
                      expLabel ? "text-base-content" : "text-base-content/40"
                    }
                  >
                    {expLabel || "Not set"}
                  </span>
                </p>
              </div>
            </div>

            {/* Role badge */}
            <div className="self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-base-content/12 px-3 py-1 font-data text-[11px] uppercase tracking-wider text-base-content/65">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: roleColor || "currentColor" }}
                />
                {roleLabel}
              </span>
            </div>
          </div>
        </motion.section>

        {/* ── Details ────────────────────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2">
          <motion.section
            variants={item}
            className="rounded-2xl border border-base-content/10 bg-base-300/60 p-5 sm:p-6"
          >
            <SectionTag acc={acc}>Contact</SectionTag>
            <div className="space-y-5">
              <Field
                label="Name"
                value={displayName}
                muted={!profile?.name && !user?.displayName}
              />
              <div className="min-w-0">
                <p className="font-data text-[10px] uppercase tracking-[0.18em] text-base-content/40">
                  Email
                </p>
                <p className="mt-1.5 flex items-center gap-2 truncate text-sm font-medium text-base-content">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-base-content/40" />
                  <span className="truncate">
                    {displayEmail || "Not provided"}
                  </span>
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={item}
            className="rounded-2xl border border-base-content/10 bg-base-300/60 p-5 sm:p-6"
          >
            <SectionTag acc={acc}>Positioning</SectionTag>
            <div className="space-y-5">
              <Field label="Experience" value={expLabel} muted={!expLabel} />
            </div>
          </motion.section>
        </div>

        {/* ── Skills / toolkit ───────────────────────────────── */}
        <motion.section
          variants={item}
          className="rounded-2xl border border-base-content/10 bg-base-300/60 p-5 sm:p-6"
        >
          <SectionTag acc={acc}>Toolkit</SectionTag>
          {profile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full border border-base-content/12 bg-base-200/40 px-3 py-1.5 font-data text-xs text-base-content/80"
                >
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ background: acc }}
                  />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-base-content/12 p-6 text-center">
              <p className="font-data text-xs text-base-content/45">
                No skills on your profile yet
              </p>
              <p className="mt-1 text-xs text-base-content/30">
                Add skills so job matches can see what you can do.
              </p>
            </div>
          )}
        </motion.section>

        {/* ── Edit action ────────────────────────────────────── */}
        {/* <motion.button
          variants={item}
          whileTap={{ scale: prefersReduced ? 1 : 0.99 }}
          onClick={handleEdit}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.button> */}
        <motion.button
          variants={item}
          whileTap={{ scale: prefersReduced ? 1 : 0.99 }}
          onClick={handleEdit}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base-300 disabled:opacity-50"
          style={{ background: GRADIENT }}
        >
          <Pencil className="h-4 w-4" />
          Edit profile
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
