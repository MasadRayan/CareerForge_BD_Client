import { Link } from "react-router-dom";
import { useTheme } from "../../Context/ThemeProvider";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaLinkedinIn,
  FaGithub,
  FaFacebookF,
} from "react-icons/fa";
import { BadgeCheck, ArrowUp } from "lucide-react";

/* ---------------------------------- data ---------------------------------- */

const PLATFORM_LINKS = [
  { label: "AI Career Roadmap", to: "/dashboard/roadmaps" },
  { label: "CV Analysis", to: "/dashboard/cvs" },
  { label: "Skill Certificates", to: "/dashboard/certificates" },
  { label: "Mock Interviews", to: "/dashboard/interview" },
  { label: "Tests & Quizzes", to: "/dashboard/quiz" },
  { label: "Readiness Score", to: "/dashboard/readiness" },
  { label: "Job Search", to: "/dashboard/jobs" },
];

const COMPANY_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Help & Support", to: "/contact" },
  { label: "Sign in", to: "/signin" },
  { label: "Create account", to: "/signup" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/careerforgebd", Icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com/careerforgebd", Icon: FaGithub },
  { label: "Facebook", href: "https://www.facebook.com/careerforgebd", Icon: FaFacebookF },
];

const PAYMENTS = [
  { label: "Visa", href: "https://www.visa.com/", render: () => <FaCcVisa className="text-2xl text-[#1A1F71]" /> },
  { label: "Mastercard", href: "https://www.mastercard.com/", render: () => <FaCcMastercard className="text-2xl text-[#EB001B]" /> },
  { label: "PayPal", href: "https://www.paypal.com/", render: () => <FaCcPaypal className="text-2xl text-[#0070BA]" /> },
  {
    label: "bKash",
    href: "https://www.bkash.com/",
    render: () => (
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#E2136E]" />
        <span className="text-sm font-semibold text-[#E2136E]">bKash</span>
      </span>
    ),
  },
  {
    label: "Nagad",
    href: "https://www.nagad.com.bd/",
    render: () => (
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#F58220]" />
        <span className="text-sm font-semibold text-[#F58220]">Nagad</span>
      </span>
    ),
  },
];

/* -------------------------------- primitives ------------------------------- */

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-sm";

const ForgeSeal = ({ isDark }) => (
  <span
    aria-hidden="true"
    className={`grid h-9 w-9 place-items-center rounded-full border ${
      isDark ? "border-emerald-400/40 bg-emerald-400/10" : "border-emerald-500/30 bg-emerald-500/10"
    }`}
  >
    <span className="h-3.5 w-3.5 rotate-45 rounded-xs bg-linear-to-br from-emerald-400 to-teal-500" />
  </span>
);

const FooterColumn = ({ title, links, isDark, columns = 1 }) => (
  <nav aria-label={title}>
    <h3
      className={`text-xs font-semibold uppercase tracking-[0.14em] ${
        isDark ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {title}
    </h3>
    <ul
      className={`mt-4 space-y-2.5 text-sm ${
        columns === 2 ? "sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:gap-y-2.5" : ""
      }`}
    >
      {links.map(({ label, to }) => (
        <li key={label}>
          <Link
            to={to}
            className={`${focusRing} inline-block transition-colors hover:text-emerald-500 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

/* --------------------------------- footer --------------------------------- */

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const hairline = isDark ? "border-white/10" : "border-slate-200";
  const iconBtn = `${focusRing} grid h-9 w-9 place-items-center rounded-full border transition-colors ${
    isDark
      ? "border-white/10 text-slate-300 hover:border-emerald-400/50 hover:text-emerald-400"
      : "border-slate-200 text-slate-600 hover:border-emerald-500/50 hover:text-emerald-600"
  }`;

  return (
    <footer
      className={`border-t transition-colors duration-300 ${hairline} ${
        isDark ? "bg-[#050816] text-slate-300" : "bg-white text-slate-700"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* A–D: main grid */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* A. Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className={`${focusRing} inline-flex items-center gap-3`}>
              <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                CareerForge <span className="text-emerald-500">BD</span>
              </span>
            </Link>

            <p className={`mt-4 max-w-sm text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              AI-powered career platform helping students and job seekers build better careers.
            </p>

            <p
              className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                isDark
                  ? "border-emerald-400/25 bg-emerald-400/5 text-emerald-300"
                  : "border-emerald-500/25 bg-emerald-500/5 text-emerald-700"
              }`}
            >
              <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Certificates verifiable at CareerForge BD
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={iconBtn}
                  >
                    <Icon className="text-sm" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* B. Platform */}
          <div className="lg:col-span-4">
            <FooterColumn title="Platform" links={PLATFORM_LINKS} isDark={isDark} columns={2} />
          </div>

          {/* C. Company */}
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={COMPANY_LINKS} isDark={isDark} />
          </div>

          {/* D. Legal & Support */}
          <div className="lg:col-span-2">
            <FooterColumn title="Legal & Support" links={LEGAL_LINKS} isDark={isDark} />
          </div>
        </div>

        {/* E. Payment methods */}
        <div className={`mt-12 border-t pt-6 ${hairline}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3
              className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Payment methods
            </h3>
            <ul className="flex flex-wrap items-center gap-3">
              {PAYMENTS.map(({ label, href, render }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={`${focusRing} flex h-10 items-center justify-center rounded-md border px-3 transition-colors ${
                      isDark
                        ? "border-white/10 bg-white/5 hover:border-white/20"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {render()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* F. Bottom bar */}
        <div
          className={`mt-6 flex flex-col items-center gap-4 border-t pt-6 text-sm sm:flex-row sm:justify-between ${hairline}`}
        >
          <p className={isDark ? "text-slate-400" : "text-slate-500"}>
            © 2026 CareerForge BD. All Rights Reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className={`flex items-center gap-2 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Forged in Bangladesh
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className={`${iconBtn} h-9 w-9`}
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
