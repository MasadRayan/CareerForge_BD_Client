import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAuth from "../../../../Hooks/useAuth";
import { useTheme } from "../../../../Context/ThemeProvider";

const PAGE_SIZE = 10;

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

const getInitials = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const ROLE_META = {
  admin: {
    label: "Admin",
    tileL: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/25",
    tileD: "bg-indigo-500/20 text-indigo-300 ring-indigo-400/25",
    dotL: "bg-indigo-500",
    dotD: "bg-indigo-400",
    textL: "text-indigo-600",
    textD: "text-indigo-300",
  },
  premium_user: {
    label: "Premium",
    tileL: "bg-amber-500/10 text-amber-700 ring-amber-500/25",
    tileD: "bg-amber-500/15 text-amber-300 ring-amber-400/25",
    dotL: "bg-amber-500",
    dotD: "bg-amber-400",
    textL: "text-amber-700",
    textD: "text-amber-300",
  },
  free_user: {
    label: "Free",
    tileL: "bg-slate-500/10 text-slate-600 ring-slate-500/20",
    tileD: "bg-white/6 text-slate-300 ring-white/10",
    dotL: "bg-slate-400",
    dotD: "bg-slate-500",
    textL: "text-slate-500",
    textD: "text-slate-400",
  },
};

const ROLE_OPTIONS = [
  { value: "free_user", label: "Free user", description: "Standard access" },
  { value: "premium_user", label: "Premium user", description: "Unlimited AI analysis" },
  { value: "admin", label: "Admin", description: "Manage the platform" },
];

const RoleMenu = ({ item, isDark, isSelf, onChanged }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const btnRef = useRef(null);
  const meta = ROLE_META[item.role] || ROLE_META.free_user;

  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const applyRole = async (value) => {
    if (value === item.role) {
      setOpen(false);
      return;
    }

    setBusy(true);
    try {
      const token = await user.getIdToken();
      await axios.patch(
        `http://localhost:3000/api/users/role/${item.email}`,
        { role: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`${item.name} is now ${ROLE_META[value].label}.`);
      setOpen(false);
      onChanged();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't change the role. Try again.");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const toggleMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    });
    setOpen((o) => !o);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggleMenu}
        disabled={isSelf || busy}
        aria-haspopup="menu"
        aria-expanded={open}
        title={isSelf ? "You can't change your own role" : "Change role"}
        className={`inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-medium transition disabled:pointer-events-none disabled:opacity-50 ${
          isDark
            ? "border-white/8 text-slate-300 hover:border-white/15 hover:bg-white/4"
            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isDark ? meta.dotD : meta.dotL}`} aria-hidden="true" />
        <span className={isDark ? meta.textD : meta.textL}>{meta.label}</span>
        <ChevronDown
          size={13}
          className={`opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            role="menu"
            aria-label={`Change role for ${item.name}`}
            className={`fixed z-50 w-56 overflow-hidden rounded-xl border shadow-xl backdrop-blur-xl ${
              isDark ? "border-white/10 bg-[#0F1525]/95" : "border-slate-200 bg-white/95"
            }`}
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <p
              className={`px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-widest ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Change role — {item.name}
            </p>
            <div className="p-1">
              {ROLE_OPTIONS.map((opt) => {
                const oMeta = ROLE_META[opt.value];
                const current = opt.value === item.role;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={current}
                    disabled={busy || current}
                    onClick={() => applyRole(opt.value)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition disabled:pointer-events-none ${
                      current
                        ? isDark
                          ? "bg-white/4"
                          : "bg-slate-50"
                        : isDark
                          ? "hover:bg-white/6"
                          : "hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${isDark ? oMeta.dotD : oMeta.dotL}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span
                        className={`block text-xs ${
                          isDark ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {current ? "Current role" : opt.description}
                      </span>
                    </span>
                    {current && (
                      <Check size={15} className={`shrink-0 ${isDark ? oMeta.textD : oMeta.textL}`} />
                    )}
                  </button>
                );
              })}
            </div>
            {busy && (
              <div
                className={`flex items-center gap-2 border-t px-3 py-2 text-xs ${
                  isDark ? "border-white/8 text-slate-400" : "border-slate-100 text-slate-500"
                }`}
              >
                <Loader2 size={13} className="animate-spin" />
                Saving…
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

const SkeletonRow = ({ isDark }) => (
  <tr>
    <td className="px-5 py-4">
      <div className={`h-3 w-6 animate-pulse rounded ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 animate-pulse rounded-lg ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
        <div className={`h-3 w-32 animate-pulse rounded ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
      </div>
    </td>
    <td className="px-5 py-4">
      <div className={`h-3 w-44 animate-pulse rounded ${isDark ? "bg-white/8" : "bg-slate-100"}`} />
    </td>
    <td className="px-5 py-4">
      <div className={`h-3 w-16 animate-pulse rounded ${isDark ? "bg-white/8" : "bg-slate-100"}`} />
    </td>
    <td className="px-5 py-4">
      <div className={`ml-auto h-6 w-20 animate-pulse rounded-lg ${isDark ? "bg-white/8" : "bg-slate-100"}`} />
    </td>
  </tr>
);

const AllUsers = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", page],
    enabled: !!user,
    placeholderData: keepPreviousData,

    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get(
        `http://localhost:3000/api/users/all?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data || res.data;
    },
  });

  const users = data?.users ?? [];
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

  const ink = isDark ? "text-white" : "text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const faint = isDark ? "text-slate-500" : "text-slate-400";
  const cardBg = isDark ? "bg-[#0F1525]" : "bg-white";
  const cardBorder = isDark ? "border-white/8" : "border-slate-200";
  const headBg = isDark ? "bg-white/[0.03]" : "bg-slate-50/80";
  const rowDivider = isDark ? "divide-white/6" : "divide-slate-100";
  const rowHover = isDark ? "hover:bg-white/[0.03]" : "hover:bg-indigo-50/40";
  const iconBtn = isDark
    ? "border-white/8 text-slate-400 hover:border-white/15 hover:bg-white/4 hover:text-white"
    : "border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700";

  const handleDelete = async (email, name) => {
    const result = await Swal.fire({
      title: `Remove ${name}?`,
      text: "They will lose access to the dashboard. This can't be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: isDark ? "#1e293b" : "#f1f5f9",
      background: isDark ? "#0F1525" : "#ffffff",
      color: isDark ? "#e2e8f0" : "#0f172a",
      customClass: {
        title: "text-lg font-semibold",
        popup: "rounded-2xl shadow-2xl",
        confirmButton: "rounded-lg px-5",
        cancelButton: "rounded-lg px-5 text-slate-600",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = await user.getIdToken();
      await axios.delete(
        `http://localhost:3000/api/users/delete/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`${name} was removed.`);
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refetch();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't remove the member. Try again.");
    }
  };

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const pageBtn = (active) =>
    active
      ? "inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-indigo-500 px-2 text-xs font-semibold text-white shadow-sm shadow-indigo-500/30"
      : `inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition ${
          isDark
            ? "text-slate-400 hover:bg-white/6 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`;

  const navBtn = `inline-flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:pointer-events-none disabled:opacity-35 ${iconBtn}`;

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-xl font-semibold tracking-tight ${ink}`}>All users</h1>
          <p className={`mt-1 text-sm ${muted}`}>
            {totalItems > 0
              ? `${totalItems} ${totalItems === 1 ? "person" : "people"} on CareerForge BD`
              : "People who sign up will appear here."}
          </p>
        </div>

        <button
          onClick={() => refetch()}
          title="Refresh"
          className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition ${iconBtn}`}
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </header>

      <div className={`overflow-hidden rounded-xl border shadow-sm ${cardBg} ${cardBorder}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b ${cardBorder} ${headBg}`}>
                <th scope="col" className={`w-14 px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest ${faint}`}>
                  #
                </th>
                <th scope="col" className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest ${faint}`}>
                  Name
                </th>
                <th scope="col" className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest ${faint}`}>
                  Email
                </th>
                <th scope="col" className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest ${faint}`}>
                  Role
                </th>
                <th scope="col" className="px-5 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${rowDivider}`}>
              {isLoading ? (
                <>
                  <SkeletonRow isDark={isDark} />
                  <SkeletonRow isDark={isDark} />
                  <SkeletonRow isDark={isDark} />
                  <SkeletonRow isDark={isDark} />
                  <SkeletonRow isDark={isDark} />
                  <SkeletonRow isDark={isDark} />
                </>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                      <div
                        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-white/6 text-slate-400" : "bg-slate-100 text-slate-500"}`}
                      >
                        <Users size={20} />
                      </div>
                      <p className={`text-sm font-medium ${ink}`}>No members yet</p>
                      <p className={`mt-1 text-xs ${muted}`}>
                        People who sign up will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((item, index) => {
                  const tile = isDark
                    ? (ROLE_META[item.role] || ROLE_META.free_user).tileD
                    : (ROLE_META[item.role] || ROLE_META.free_user).tileL;

                  return (
                    <tr key={item.id} className={`group transition-colors ${rowHover}`}>
                      <td className={`px-5 py-4 text-right font-mono text-xs ${faint}`}>
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ring-1 ring-inset ${tile}`}
                            aria-hidden="true"
                          >
                            {getInitials(item.name)}
                          </div>
                          <span className={`font-medium ${ink}`}>{item.name}</span>
                        </div>
                      </td>
                      <td className={`px-5 py-4 ${muted}`}>{item.email}</td>
                      <td className="px-5 py-4">
                        <RoleMenu
                          item={item}
                          isDark={isDark}
                          isSelf={item.email === user.email}
                          onChanged={refetch}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDelete(item.email, item.name)}
                            title={`Remove — ${item.name}`}
                            aria-label={`Remove ${item.name}`}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                              isDark
                                ? "border-white/8 text-slate-400 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
                                : "border-slate-200 text-slate-400 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className={`flex flex-col gap-3 border-t px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between ${cardBorder}`}>
          <p className={`text-xs ${muted}`}>
            {totalItems > 0 ? (
              <>
                Showing{" "}
                <span className={`font-mono ${ink}`}>{start}</span>
                {"\u2013"}
                <span className={`font-mono ${ink}`}>{end}</span> of{" "}
                <span className={`font-mono ${ink}`}>{totalItems}</span> members
              </>
            ) : (
              "No members"
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
                <span key={`ellipsis-${i}`} className={`px-1 text-xs ${faint}`}>
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
      </div>
    </div>
  );
};

export default AllUsers;
