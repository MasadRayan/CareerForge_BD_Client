import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  CreditCard,
  FileSearch,
  FileText,
  GraduationCap,
  RefreshCw,
  Sparkles,
  TrendingDown,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../../Components/LoadingSpinner/LoadingSpinner";
import { useTheme } from "../../../../Context/ThemeProvider";
import { ScrollRestoration } from "react-router";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatBDT = (value, compact = false) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "symbol",
    maximumFractionDigits: compact ? 1 : 0,
    ...(compact
      ? { notation: "compact", compactDisplay: "short" }
      : {}),
  }).format(Number(value) || 0);

const formatMonth = (month) => {
  const raw = String(month ?? "");
  if (/^\d{4}-\d{2}$/.test(raw)) {
    const [y, m] = raw.split("-").map(Number);
    return `${MONTHS[m - 1] || m} '${String(y).slice(2)}`;
  }
  return raw;
};

const accent = {
  text: { dark: "text-emerald-300", light: "text-emerald-700" },
  chip: { dark: "bg-emerald-500/15 text-emerald-300", light: "bg-emerald-50 text-emerald-700" },
  soft: { dark: "bg-emerald-500/10", light: "bg-emerald-500/10" },
  glow: "shadow-emerald-500/20",
  line: { dark: "#34D399", light: "#10B981" },
};

const GRADIENT = "bg-linear-to-r from-emerald-500 via-teal-500 to-indigo-500";

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const reduceMotion = useReducedMotion();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/analytics/admin");
      return res.data.data;
    },
  });

  const totalUsers = data?.totalUsers ?? 0;
  const activeSubscribers = data?.activeSubscribers ?? 0;
  const mrr = data?.mrr ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;
  const churnRate = Number(data?.churnRate) || 0;
  const newSignupsThisMonth = data?.newSignupsThisMonth ?? 0;
  const newSubscriptionsThisMonth = data?.newSubscriptionsThisMonth ?? 0;

  const revenueByMonth = (data?.revenueByMonth ?? [])
    .map(({ month, revenue }) => ({
      month: String(month ?? ""),
      revenue: Number(revenue) || 0,
    }))
    .filter((d) => d.month !== "")
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({ month: formatMonth(d.month), revenue: d.revenue }));

  const rawSplit = data?.userSplit ?? {};
  const userSplit = Object.entries(rawSplit).map(([key, value]) => ({
    key,
    name:
      key === "free_user" ? "Free" : key === "premium_user" ? "Premium" : "Admin",
    value: Number(value) || 0,
    fill: key === "premium_user" ? "#F5C04B" : key === "admin" ? "#10B981" : "#7A87A8",
  }));
  const splitTotal = userSplit.reduce((sum, s) => sum + s.value, 0);

  const conversion = totalUsers > 0
    ? Math.round((activeSubscribers / totalUsers) * 100)
    : 0;

  const output = [
    { label: "CVs uploaded", value: data?.totalCvs ?? 0, icon: FileText },
    { label: "ATS analyses", value: data?.totalAnalyses ?? 0, icon: FileSearch },
    { label: "Learning roadmaps", value: data?.totalRoadmaps ?? 0, icon: GraduationCap },
  ];
  const maxOutput = Math.max(1, ...output.map((o) => o.value));

  const t = {
    panel: isDark
      ? "bg-[#0F1525] border-white/[0.07]"
      : "bg-white border-slate-200/80",
    ink: isDark ? "text-[#E8ECF8]" : "text-[#10162B]",
    muted: isDark ? "text-[#9AA3C0]" : "text-[#5A6582]",
    faint: isDark ? "text-[#5F6B8F]" : "text-[#94A0BC]",
    grid: isDark ? "rgba(255,255,255,0.07)" : "rgba(16,22,43,0.08)",
    tick: isDark ? "#8A94B4" : "#7A87A8",
  };

  const noMotion = reduceMotion;
  const ease = { duration: noMotion ? 0 : 0.5, ease: "easeOut" };
  const reveal = (delay = 0) => ({
    initial: noMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: noMotion ? { duration: 0 } : { ...ease, delay },
  });

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className={`rounded-xl border px-3 py-2.5 shadow-xl backdrop-blur ${
          isDark
            ? "border-emerald-400/10 bg-[#0B0F1A]/95"
            : "border-emerald-600/10 bg-white/95"
        }`}
      >
        {label && (
          <p className={`text-[10px] font-medium uppercase tracking-widest ${t.faint}`}>
            {label}
          </p>
        )}
        {payload.map((p, i) => (
          <p key={i} className={`mt-1 font-data text-sm font-semibold ${t.ink}`}>
            {p.name ? `${p.name} · ` : ""}
            {formatBDT(Number(p.value))}
          </p>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.soft} ${accent.text[isDark ? "dark" : "light"]}`}>
          <Activity className="h-6 w-6" />
        </div>
        <p className="mt-5 text-base font-semibold">Couldn't load analytics</p>
        <p className="mt-1 max-w-sm text-sm text-base-content/50">
          Check your connection, then try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <RefreshCw className="h-4 w-4" />
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.header {...reveal(0)} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`font-data text-[11px] font-medium uppercase tracking-[0.2em] ${accent.text[isDark ? "dark" : "light"]}`}>
            CareerForge BD · Operations
          </p>
          <h2 className={`mt-2 text-2xl font-bold text-primary tracking-tight sm:text-3xl ${t.ink}`}>
            Business overview
          </h2>
          <p className={`mt-1 text-sm ${t.muted}`}>
            Revenue, growth, and what members are building — updated just now.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-data text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-60 ${
            isDark
              ? "border-white/10 text-[#9AA3C0] hover:border-white/20 hover:text-white"
              : "border-slate-200 text-[#5A6582] hover:border-slate-300 hover:text-[#10162B]"
          }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing" : "Refresh"}
        </button>
      </motion.header>

      {/* Hero: headline revenue + growth ledger */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
        {/* Headline revenue */}
        <motion.section
          {...reveal(0.05)}
          className={`relative overflow-hidden rounded-2xl border p-6 md:col-span-2 lg:col-span-3 ${t.panel}`}
        >
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${
              isDark ? "bg-emerald-500/15" : "bg-emerald-500/10"
            }`}
          />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className={`font-data text-[10px] font-medium uppercase tracking-[0.2em] ${t.faint}`}>
                  Revenue · Headline
                </p>
                <p
                  className={`mt-3 font-data text-4xl font-bold tracking-tight sm:text-5xl ${accent.text[isDark ? "dark" : "light"]}`}
                  style={
                    isDark
                      ? { textShadow: "0 0 32px rgba(99,102,241,0.35)" }
                      : undefined
                  }
                >
                  {formatBDT(totalRevenue)}
                </p>
                <p className={`mt-1 font-data text-xs ${t.muted}`}>
                  monthly recurring revenue
                </p>
              </div>

              <div className="flex gap-6">
                <div>
                  <p className={`font-data text-[10px] uppercase tracking-widest ${t.faint}`}>
                    Active subs
                  </p>
                  <p className={`mt-1 font-data text-lg font-semibold ${t.ink}`}>
                    {activeSubscribers.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscriber conversion */}
            <div className="mt-8">
              <div className="flex items-end justify-between">
                <p className={`font-data text-[10px] uppercase tracking-widest ${t.faint}`}>
                  Subscriber conversion
                </p>
                <p className={`font-data text-xs font-semibold ${t.ink}`}>
                  {conversion}%
                </p>
              </div>
              <div
                className={`mt-2 h-2.5 w-full overflow-hidden rounded-full ${
                  isDark ? "bg-white/6" : "bg-slate-200/70"
                }`}
              >
                <motion.div
                  className={`h-full rounded-full ${GRADIENT}`}
                  initial={noMotion ? { width: `${conversion}%` } : { width: "0%" }}
                  animate={{ width: `${conversion}%` }}
                  transition={{ duration: noMotion ? 0 : 1, ease: "easeOut" }}
                />
              </div>
              <p className={`mt-2 font-data text-xs ${t.muted}`}>
                {activeSubscribers.toLocaleString("en-US")} of{" "}
                {totalUsers.toLocaleString("en-US")} members are on a paid plan
              </p>
            </div>
          </div>
        </motion.section>

        {/* Growth ledger */}
        <motion.section
          {...reveal(0.1)}
          className={`rounded-2xl border p-6 md:col-span-2 lg:col-span-2 ${t.panel}`}
        >
          <p className={`font-data text-[10px] font-medium uppercase tracking-[0.2em] ${t.faint}`}>
            This month
          </p>
          <h3 className={`mt-2 text-lg font-semibold ${t.ink}`}>Growth ledger</h3>

          <div className={`mt-5 divide-y ${isDark ? "divide-white/[0.07]" : "divide-slate-200/80"}`}>
            {[
              {
                label: "New signups",
                value: `+${newSignupsThisMonth.toLocaleString("en-US")}`,
                chip: accent.chip[isDark ? "dark" : "light"],
                icon: UserPlus,
              },
              {
                label: "New subscriptions",
                value: `+${newSubscriptionsThisMonth.toLocaleString("en-US")}`,
                chip: "bg-[#F5C04B]/10 text-[#F5C04B]",
                icon: CreditCard,
              },
              {
                label: "Churn rate",
                value: `${(churnRate * 100).toFixed(1)}%`,
                chip: "bg-[#F87171]/10 text-[#F87171]",
                icon: TrendingDown,
              },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className={`group flex items-center gap-3 py-3.5 transition-colors ${isDark ? "hover:bg-white/3" : "hover:bg-slate-50"}`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${row.chip}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={`text-sm font-medium ${t.muted} ${isDark ? "group-hover:text-white" : "group-hover:text-[#10162B]"}`}>
                    {row.label}
                  </span>
                  <span className={`ml-auto font-data text-sm font-semibold ${t.ink}`}>
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Revenue over time + member mix */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
        <motion.section
          {...reveal(0.1)}
          className={`rounded-2xl border p-6 md:col-span-2 lg:col-span-3 ${t.panel}`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className={`font-data text-[10px] font-medium uppercase tracking-[0.2em] ${t.faint}`}>
                Revenue · Per month
              </p>
              <h3 className={`mt-2 text-lg font-semibold ${t.ink}`}>Revenue over time</h3>
            </div>
            <p className={`font-data text-[10px] uppercase tracking-widest ${t.faint}`}>
              ৳ BDT
            </p>
          </div>

          {revenueByMonth.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent.soft} ${accent.text[isDark ? "dark" : "light"]}`}>
                <Activity className="h-5 w-5" />
              </div>
              <p className={`mt-4 text-sm font-semibold ${t.ink}`}>No revenue recorded yet</p>
              <p className={`mt-1 max-w-xs text-xs ${t.muted}`}>
                The trend fills in once the first payments land.
              </p>
            </div>
          ) : (
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A5B4FC" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={t.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: t.tick, fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    axisLine={{ stroke: t.grid }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: t.tick, fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    axisLine={false}
                    tickLine={false}
                    width={64}
                    domain={[0, "auto"]}
                    tickFormatter={(v) => formatBDT(v, true)}
                  />
                  <Tooltip
                    content={renderTooltip}
                    cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#revenueBar)"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.section>

        {/* Member mix */}
        <motion.section
          {...reveal(0.15)}
          className={`rounded-2xl border p-6 md:col-span-2 lg:col-span-2 ${t.panel}`}
        >
          <p className={`font-data text-[10px] font-medium uppercase tracking-[0.2em] ${t.faint}`}>
            Members · By plan
          </p>
          <h3 className={`mt-2 text-lg font-semibold ${t.ink}`}>Member mix</h3>

          <div className="relative mx-auto mt-4 h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={3}
                  cornerRadius={4}
                  stroke="none"
                  isAnimationActive={!noMotion}
                >
                  {userSplit.map((s) => (
                    <Cell key={s.key} fill={s.fill} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-data text-2xl font-bold ${t.ink}`}>
                {totalUsers.toLocaleString("en-US")}
              </span>
              <span className={`font-data text-[10px] uppercase tracking-widest ${t.faint}`}>
                Members
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {userSplit.map((s) => {
              const pct = splitTotal > 0 ? Math.round((s.value / splitTotal) * 100) : 0;
              return (
                <div key={s.key} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className={`text-sm ${t.muted}`}>{s.name}</span>
                  <span className={`ml-auto font-data text-sm font-semibold ${t.ink}`}>
                    {s.value.toLocaleString("en-US")}
                  </span>
                  <span className={`w-9 text-right font-data text-xs ${t.faint}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Output + members */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
        <motion.section
          {...reveal(0.15)}
          className={`rounded-2xl border p-6 md:col-span-2 lg:col-span-3 ${t.panel}`}
        >
          <p className={`font-data text-[10px] font-medium uppercase tracking-[0.2em] ${t.faint}`}>
            Content · Lifetime
          </p>
          <h3 className={`mt-2 text-lg font-semibold ${t.ink}`}>What members create</h3>

          <div className="mt-6 space-y-5">
            {output.map((o, i) => {
              const Icon = o.icon;
              const pct = (o.value / maxOutput) * 100;
              const top = o.value === maxOutput;
              return (
                <div key={o.label}>
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-2 text-sm ${t.muted}`}>
                      <Icon className="h-4 w-4" />
                      {o.label}
                    </span>
                    <span className={`font-data text-sm font-semibold ${t.ink}`}>
                      {o.value.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className={`mt-2 h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-white/6" : "bg-slate-200/70"}`}>
                    <motion.div
                      className={`h-full rounded-full ${
                        top
                          ? GRADIENT
                          : isDark
                            ? "bg-[#4A5A8F]"
                            : "bg-[#B9C3E0]"
                      }`}
                      initial={noMotion ? { width: `${pct}%` } : { width: "0%" }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: noMotion ? 0 : 0.8, ease: "easeOut", delay: 0.1 + i * 0.08 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Members headline */}
        <motion.section
          {...reveal(0.2)}
          className={`rounded-2xl border p-6 md:col-span-2 lg:col-span-2 ${t.panel}`}
        >
          <p className={`font-data text-[10px] font-medium uppercase tracking-[0.2em] ${t.faint}`}>
            Members · Headcount
          </p>
          <h3 className={`mt-2 text-lg font-semibold ${t.ink}`}>Members</h3>

          <p className={`mt-6 font-data text-4xl font-bold tracking-tight ${t.ink}`}>
            {totalUsers.toLocaleString("en-US")}
          </p>
          <p className={`mt-1 font-data text-xs ${t.muted}`}>
            total members · +{newSignupsThisMonth.toLocaleString("en-US")} this month
          </p>

          <div className={`mt-6 flex h-3 w-full overflow-hidden rounded-full ${isDark ? "bg-white/6" : "bg-slate-200/70"}`}>
            {userSplit.map((s) => {
              const w = splitTotal > 0 ? (s.value / splitTotal) * 100 : 0;
              return (
                <motion.div
                  key={s.key}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ backgroundColor: s.fill }}
                  initial={noMotion ? { width: `${w}%` } : { width: "0%" }}
                  animate={{ width: `${w}%` }}
                  transition={{ duration: noMotion ? 0 : 0.8, ease: "easeOut", delay: 0.2 }}
                />
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {userSplit.map((s) => {
              const pct = splitTotal > 0 ? Math.round((s.value / splitTotal) * 100) : 0;
              return (
                <span key={s.key} className="flex items-center gap-1.5 font-data text-xs">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className={t.muted}>{s.name}</span>
                  <span className={t.ink}>{pct}%</span>
                </span>
              );
            })}
          </div>

          <div className={`mt-6 rounded-xl border p-4 ${t.panel}`}>
            <p className={`flex items-center gap-2 font-data text-xs ${t.muted}`}>
              <Sparkles className="h-3.5 w-3.5 text-[#F5C04B]" />
              {conversion}% of members pay for premium
            </p>
            <p className={`mt-1 flex items-center gap-2 font-data text-xs ${t.muted}`}>
              <Users className={`h-3.5 w-3.5 ${accent.text[isDark ? "dark" : "light"]}`} />
              {activeSubscribers.toLocaleString("en-US")} active subscriptions
            </p>
          </div>
        </motion.section>
      </div>
      <ScrollRestoration></ScrollRestoration>
    </div>
  );
};

export default AdminDashboardHome;