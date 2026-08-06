import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useTheme } from "../../../../Context/ThemeProvider";

const PAGE_SIZE = 10;
const PLAN_PRICE = 5000;

const formatBDT = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysLeft = (endDate) => {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
};

const getInitials = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("...");
  if (end < totalPages) pages.push(totalPages);

  return pages;
};

const SkeletonRow = ({ isDark }) => (
  <tr className={`border-t ${isDark ? "border-white/[0.06]" : "border-slate-100"}`}>
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 animate-pulse rounded-xl ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
        <div className="space-y-2">
          <div className={`h-3 w-28 animate-pulse rounded ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
          <div className={`h-2.5 w-36 animate-pulse rounded ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`} />
        </div>
      </div>
    </td>
    <td className="px-5 py-4">
      <div className={`h-6 w-20 animate-pulse rounded-lg ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`} />
    </td>
    <td className="px-5 py-4">
      <div className={`h-5 w-16 animate-pulse rounded ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`} />
    </td>
    <td className="px-5 py-4">
      <div className={`ml-auto h-5 w-20 animate-pulse rounded ${isDark ? "bg-white/[0.08]" : "bg-slate-100"}`} />
    </td>
    <td className="px-5 py-4">
      <div className={`ml-auto h-3 w-40 animate-pulse rounded ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`} />
    </td>
  </tr>
);

const AllPayments = () => {
  const axiosSecure = useAxiosSecure();
  const { isDark } = useTheme();
  const reduceMotion = useReducedMotion();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["adminPayments", search, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await axiosSecure.get("/api/subscription/all-payments", {
        params: { search, page, limit: PAGE_SIZE },
      });
      return res.data.data || res.data;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Couldn't load payments. Check your connection.");
    }
  }, [isError]);

  const payments = useMemo(() => data?.payments ?? [], [data]);
  const pagination = data?.pagination ?? {
    currentPage: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const totalItems = pagination.totalItems;
  const totalPages = pagination.totalPages;
  const start = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalItems);
  const hasSearch = search !== "";

  const t = {
    panel: isDark
      ? "bg-[#0F1525] border-white/[0.07]"
      : "bg-white border-slate-200/80",
    ink: isDark ? "text-[#E8ECF8]" : "text-[#10162B]",
    muted: isDark ? "text-[#9AA3C0]" : "text-[#5A6582]",
    faint: isDark ? "text-[#5F6B8F]" : "text-[#94A0BC]",
    hairline: isDark ? "border-white/[0.06]" : "border-slate-100",
    rowHover: isDark ? "hover:bg-white/[0.03]" : "hover:bg-indigo-50/50",
    accent: isDark ? "text-indigo-300" : "text-indigo-700",
  };

  const statusMeta = (statusKey) => {
    const k = statusKey === "canceled" ? "cancelled" : statusKey;
    switch (k) {
      case "active":
        return {
          label: "Active",
          dot: isDark ? "bg-emerald-400" : "bg-emerald-500",
          text: isDark ? "text-emerald-300" : "text-emerald-600",
          pulse: true,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          dot: isDark ? "bg-amber-400" : "bg-amber-500",
          text: isDark ? "text-amber-300" : "text-amber-600",
          pulse: false,
        };
      case "expired":
        return {
          label: "Expired",
          dot: isDark ? "bg-rose-400" : "bg-rose-500",
          text: isDark ? "text-rose-300" : "text-rose-600",
          pulse: false,
        };
      default:
        return {
          label: statusKey || "Unknown",
          dot: isDark ? "bg-slate-500" : "bg-slate-400",
          text: isDark ? "text-slate-300" : "text-slate-500",
          pulse: false,
        };
    }
  };

  const noMotion = reduceMotion;
  const reveal = (delay = 0) => ({
    initial: noMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: noMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay },
  });

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const pageBtn = (active) =>
    active
      ? "inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-indigo-500 px-2 font-data text-xs font-semibold text-white shadow-sm shadow-indigo-500/30"
      : `inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-data text-xs font-medium transition ${
          isDark
            ? "text-slate-400 hover:bg-white/6 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`;

  const iconBtn = `inline-flex h-9 items-center justify-center rounded-lg border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
    isDark
      ? "border-white/[0.08] text-slate-400 hover:border-white/15 hover:bg-white/[0.04] hover:text-white"
      : "border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
  }`;

  const navBtn = `inline-flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:pointer-events-none disabled:opacity-35 ${
    isDark
      ? "border-white/[0.08] text-slate-400 hover:border-white/15 hover:bg-white/[0.04] hover:text-white"
      : "border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
  }`;

  const renderBody = () => {
    if (isLoading) {
      return (
        <>
          <SkeletonRow isDark={isDark} />
          <SkeletonRow isDark={isDark} />
          <SkeletonRow isDark={isDark} />
          <SkeletonRow isDark={isDark} />
          <SkeletonRow isDark={isDark} />
          <SkeletonRow isDark={isDark} />
        </>
      );
    }

    if (payments.length === 0) {
      return (
        <tr>
          <td colSpan={5}>
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                  isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <CreditCard size={20} />
              </div>
              <p className={`text-sm font-semibold ${t.ink}`}>
                {hasSearch ? "No payments match your search" : "No payments yet"}
              </p>
              <p className={`mt-1 max-w-xs text-xs ${t.muted}`}>
                {hasSearch
                  ? "Try a different name, email, or Stripe ID."
                  : "Every subscription record across the platform will appear here."}
              </p>
              {hasSearch && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                  className={`mt-5 inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition ${iconBtn}`}
                >
                  <X size={14} />
                  Clear search
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    }

    return payments.map((record, idx) => {
      const statusKey = record.status?.toLowerCase() || "";
      const meta = statusMeta(statusKey);
      const daysLeft = getDaysLeft(record.currentPeriodEnd);
      const startDate = record.started_at || record.created_at;
      const user = record.user || {};
      const initialsTile = isDark
        ? "bg-linear-to-br from-indigo-500 to-violet-600 text-white ring-white/10"
        : "bg-linear-to-br from-indigo-500 to-violet-600 text-white ring-white/20";

      return (
        <motion.tr
          key={record.id}
          initial={noMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={noMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut", delay: idx * 0.04 }}
          className={`group border-t transition-colors ${t.hairline} ${t.rowHover}`}
        >
          {/* Member */}
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  referrerPolicy="no-referrer"
                  src={user.photoURL}
                  alt={user.name || "User"}
                  className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white ring-1 ${initialsTile}`}
                >
                  {getInitials(user.name)}
                </div>
              )}
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${t.ink}`}>
                  {user.name || "Unknown"}
                </p>
                <p className={`truncate text-xs ${t.faint}`}>{user.email || "—"}</p>
              </div>
            </div>
          </td>

          {/* Plan */}
          <td className="px-5 py-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
                isDark ? "bg-amber-500/15 text-amber-300" : "bg-amber-500/10 text-amber-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-amber-400" : "bg-amber-500"}`} />
              {record.plan || "premium"}
            </span>
          </td>

          {/* Status */}
          <td className="px-5 py-4">
            <span className={`inline-flex items-center gap-2 text-xs font-medium ${meta.text}`}>
              <span className="relative flex h-2 w-2">
                {meta.pulse && (
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping ${meta.dot}`}
                  />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${meta.dot}`} />
              </span>
              {meta.label}
            </span>
          </td>

          {/* Amount */}
          <td className="px-5 py-4 text-right">
            <p className={`font-data text-base font-semibold tabular-nums ${t.ink}`}>
              {formatBDT(PLAN_PRICE)}
            </p>
            <p className={`font-data text-[10px] uppercase tracking-widest ${t.faint}`}>
              per year
            </p>
          </td>

          {/* Term */}
          <td className="px-5 py-4 text-right">
            <p className={`font-data text-[11px] ${t.muted}`}>
              {formatDate(startDate)}
              <span className={`mx-1 ${t.faint}`}>→</span>
              {formatDate(record.currentPeriodEnd)}
            </p>
            {statusKey === "active" && daysLeft !== null && (
              <span
                className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  isDark ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-500/10 text-emerald-700"
                }`}
              >
                <Clock className="h-3 w-3" />
                {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
              </span>
            )}
            {statusKey === "expired" && (
              <p className={`mt-1.5 font-data text-[10px] uppercase tracking-widest ${t.faint}`}>
                ended
              </p>
            )}
          </td>
        </motion.tr>
      );
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.header {...reveal(0)} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`font-data text-[11px] font-medium uppercase tracking-[0.2em] ${t.accent}`}>
            CareerForge BD · Revenue ledger
          </p>
          <h1 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${t.ink}`}>
            All payments
          </h1>
          <p className={`mt-1 text-sm ${t.muted}`}>
            {totalItems > 0
              ? `${totalItems} subscription ${totalItems === 1 ? "record" : "records"} · fixed ${formatBDT(PLAN_PRICE)}/month`
              : "Every subscription record across the platform."}
          </p>
        </div>

        <button
          onClick={() => refetch()}
          title="Refresh"
          disabled={isFetching}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 font-data text-xs font-medium transition disabled:opacity-60 ${iconBtn}`}
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.header>

      {/* Search */}
      <motion.div {...reveal(0.05)} className="relative max-w-sm">
        <Search
          size={15}
          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${t.faint}`}
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search name, email, or Stripe ID"
          className={`h-9 w-full rounded-lg border pl-9 pr-3 font-data text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/25 ${
            isDark
              ? "border-white/[0.08] bg-white/[0.03] text-white placeholder:text-slate-500 focus:border-indigo-400/50"
              : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
          }`}
        />
      </motion.div>

      {/* Ledger */}
      <motion.div
        {...reveal(0.1)}
        className={`overflow-hidden rounded-2xl border shadow-sm ${t.panel}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`${isDark ? "bg-white/[0.02]" : "bg-slate-50/60"}`}>
                {["Member", "Plan", "Status", "Amount", "Term"].map((label, i) => (
                  <th
                    key={label}
                    scope="col"
                    className={`px-5 py-3.5 font-data text-[10px] font-semibold uppercase tracking-[0.18em] ${t.faint} ${
                      i >= 3 ? "text-right" : ""
                    }`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className={isDark ? "divide-white/[0.06]" : "divide-slate-100/70"}>
              {renderBody()}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className={`flex flex-col gap-3 border-t px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between ${
            isDark ? "border-white/6" : "border-slate-100"
          }`}
        >
          <p className={`font-data text-xs ${t.muted}`}>
            {totalItems > 0 ? (
              <>
                Showing{" "}
                <span className={`font-semibold ${t.ink}`}>{start}</span>
                {"\u2013"}
                <span className={`font-semibold ${t.ink}`}>{end}</span> of{" "}
                <span className={`font-semibold ${t.ink}`}>{totalItems}</span> records
              </>
            ) : (
              "No records"
            )}
          </p>

          <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className={navBtn}
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className={`px-1 font-data text-xs ${t.faint}`}>
                  {"\u2026"}
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                  className={pageBtn(p === page)}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={totalPages === 0 || page >= totalPages}
              aria-label="Next page"
              className={navBtn}
            >
              <ChevronRight size={15} />
            </button>
          </nav>
        </div>
      </motion.div>
    </div>
  );
};

export default AllPayments;