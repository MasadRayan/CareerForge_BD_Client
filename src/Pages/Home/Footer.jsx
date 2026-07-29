import { Link } from "react-router-dom";
import { useTheme } from "../../Context/ThemeProvider";
import { Mail, Send } from "lucide-react";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDark
          ? "border-white/10 bg-[#050816] text-slate-300"
          : "border-slate-200 bg-[#fffaf2] text-slate-700"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= NEWSLETTER SECTION ================= */}
        <div className="py-10 sm:py-12">
          <div
            className={`relative overflow-hidden rounded-3xl border px-5 py-8 sm:px-8 sm:py-10 lg:px-10 ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white/70 shadow-[0_10px_40px_rgba(15,23,42,0.06)]"
            }`}
          >
            {/* decorative glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 left-10 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -bottom-16 right-10 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />
            </div>

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              {/* left */}
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                    Newsletter
                  </span>
                </div>

                <h3
                  className={`text-2xl font-bold tracking-tight sm:text-3xl ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Stay updated with CareerForge BD
                </h3>

                <p
                  className={`mt-3 max-w-2xl text-sm leading-7 sm:text-base ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Get updates about AI CV analysis, interview tips, roadmap
                  features, and new platform improvements directly in your inbox.
                </p>
              </div>

              {/* right */}
              <div>
                <form className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail
                      className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-indigo-400"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/35"
                  >
                    Subscribe
                    <Send className="h-4 w-4" />
                  </button>
                </form>

                <p
                  className={`mt-3 text-xs ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  No spam. Only product updates, career resources and useful
                  announcements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN FOOTER ================= */}
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-start md:justify-between">
          {/* brand */}
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-3">
            

              <div>
                <h3
                  className={`text-lg font-bold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  CareerForge <span className="text-indigo-500">BD</span>
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Smart career platform for students & job seekers.
                </p>
              </div>
            </Link>
          </div>

          {/* footer links */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              to="/terms"
              className={`transition ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Terms & Conditions
            </Link>

            <Link
              to="/privacy"
              className={`transition ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Privacy Policy
            </Link>

            <Link
              to="/contact"
              className={`transition ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div
          className={`flex flex-col gap-4 border-t py-5 text-sm md:flex-row md:items-center md:justify-between ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}
        >
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            © 2026 CareerForge BD. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>
              We accept:
            </span>

            {/* Visa */}
            <PaymentBadge isDark={isDark}>
              <span className="text-[#1A1F71] font-black tracking-wide">VISA</span>
            </PaymentBadge>

            {/* Mastercard */}
            <PaymentBadge isDark={isDark}>
              <div className="flex items-center gap-1">
                <span className="relative inline-block h-3.5 w-3.5 rounded-full bg-[#EB001B]" />
                <span className="relative -ml-2 inline-block h-3.5 w-3.5 rounded-full bg-[#F79E1B]" />
                <span className="ml-1 font-semibold text-slate-700 dark:text-slate-200">
                  Mastercard
                </span>
              </div>
            </PaymentBadge>

            {/* PayPal */}
            <PaymentBadge isDark={isDark}>
              <span className="font-black italic text-[#0070BA]">PayPal</span>
            </PaymentBadge>

            {/* bKash */}
            <PaymentBadge isDark={isDark}>
              <span className="font-bold text-[#E2136E]">bKash</span>
            </PaymentBadge>

            {/* Nagad */}
            <PaymentBadge isDark={isDark}>
              <span className="font-bold text-[#F97316]">Nagad</span>
            </PaymentBadge>
          </div>
        </div>
      </div>
    </footer>
  );
};

function PaymentBadge({ children, isDark }) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs shadow-sm transition ${
        isDark
          ? "border border-white/10 bg-white/10 text-white"
          : "border border-slate-200 bg-white text-slate-800"
      }`}
    >
      {children}
    </div>
  );
}

export default Footer;