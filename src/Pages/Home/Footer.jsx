import { Link } from "react-router-dom";
import { useTheme } from "../../Context/ThemeProvider";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`border-t transition-all duration-300 ${
        isDark
          ? "bg-[#050816] border-white/10 text-slate-300"
          : "bg-white border-slate-200 text-slate-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          <div>
            <Link to="/">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "[#0f172A]"
                }`}>
              CareerForge <span className="text-emerald-500">BD</span>
              </h2>
            </Link>
            <p
              className={`mt-2 text-sm max-w-sm ${
                isDark ? "[#0f172a]" : "text-slate-500"
              }`}
            >
              AI-powered career platform helping students and job seekers build
              better careers.
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <Link to="/terms" className="hover:text-indigo-500">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-indigo-500">
              Privacy
            </Link>
            <Link to="/contact" className="hover:text-indigo-500">
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}
        >
          <p className="text-sm">
            © 2026 CareerForge BD. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 flex-wrap">

        <a
          href="https://www.visa.com/"
          target="_blank"
          rel="noreferrer"
          className={badgeClass(isDark)}
        >
          <FaCcVisa className="text-2xl text-[#1A1F71]" />
        </a>

        <a
          href="https://www.mastercard.com/"
          target="_blank"
          rel="noreferrer"
          className={badgeClass(isDark)}
        >
          <FaCcMastercard className="text-2xl text-[#EB001B]" />
        </a>

        <a
          href="https://www.paypal.com/"
          target="_blank"
          rel="noreferrer"
          className={badgeClass(isDark)}
        >
          <FaCcPaypal className="text-2xl text-[#0070BA]" />
        </a>
        <a
          href="https://www.bkash.com/"
          target="_blank"
          rel="noreferrer"
          className={badgeClass(isDark)}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#E2136E]" />
            <span className="font-semibold text-[#E2136E]">bKash</span>
          </div>
        </a>

        <a
          href="https://www.nagad.com.bd/"
          target="_blank"
          rel="noreferrer"
          className={badgeClass(isDark)}
        >
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#F58220]" />
            <span className="font-semibold text-[#F58220]">Nagad</span>
          </div>
        </a>
      </div>
          
        </div>

      </div>
    </footer>
  );
};
function badgeClass(isDark) {
  return `transition-all duration-300 hover:scale-110 ${
    isDark ? "hover:opacity-80" : "hover:opacity-70"
  }`;
}

export default Footer;