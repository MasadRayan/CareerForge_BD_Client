import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import { useTheme } from "../../Context/ThemeProvider";

const PricingSection = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [billingPeriod, setBillingPeriod] = useState("annual"); // "monthly" or "annual"

  const handlePlanSelection = (planType) => {
    if (planType === "free") {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/signin", { state: { from: { pathname: "/dashboard" } } });
      }
    } else if (planType === "premium") {
      if (user) {
        navigate("/dashboard/subscription");
      } else {
        // Must be a private route: redirect to signin and then send them directly to subscription checkout
        navigate("/signin", {
          state: { from: { pathname: "/dashboard/subscription" } },
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section
      className={`relative overflow-hidden py-16 transition-colors duration-500 ${
        isDark
          ? "bg-[#050816] text-white"
          : "bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc] text-slate-900"
      }`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark
                ? "border-slate-700 bg-slate-900/70 text-slate-400"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            Pricing Plans
          </span>

          <h2
            className={`mt-5 font-bold tracking-tight text-4xl md:text-5xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Invest in your future with{" "}
            <span className="text-emerald-500">smart guidance</span>
          </h2>

          <p
            className={`mx-auto mt-4 max-w-xl text-base leading-7 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Pick the plan that fits where you are in your career — upgrade
            whenever you need more.
          </p>

          {/* Toggle Switch */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${
                billingPeriod === "monthly"
                  ? isDark
                    ? "text-white"
                    : "text-slate-900"
                  : "text-slate-400"
              }`}
            >
              Billed Monthly
            </span>

            <button
              onClick={() =>
                setBillingPeriod(
                  billingPeriod === "monthly" ? "annual" : "monthly",
                )
              }
              className="relative inline-flex h-7.5 w-14.5 items-center rounded-full bg-slate-700 transition-colors duration-300 focus:outline-none"
            >
              <span
                className={`inline-block h-5.5 w-5.5 transform rounded-full bg-emerald-500 transition-transform duration-300 ${
                  billingPeriod === "annual"
                    ? "translate-x-7.5"
                    : "translate-x-1"
                }`}
              />
            </button>

            <span
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300 ${
                billingPeriod === "annual"
                  ? isDark
                    ? "text-white"
                    : "text-slate-900"
                  : "text-slate-400"
              }`}
            >
              Billed Annually
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-xs font-bold text-emerald-400">
                Save 16%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-10"
        >
          {/* Card 1: Free Plan */}
          <motion.div
            variants={itemVariants}
            className={`group relative flex flex-col justify-between rounded-3xl border p-8 shadow-md transition-all duration-305 hover:-translate-y-1 hover:shadow-xl ${
              isDark
                ? "border-slate-800 bg-[#07101F]/40 hover:border-slate-700"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Career Kickstart
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100"
                  }`}
                >
                  Free Tier
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Build the foundations of your professional career profile.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-extrabold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  BDT 0
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  / forever
                </span>
              </div>

              {/* Feature List */}
              <ul className="mt-8 space-y-4 border-t border-slate-700/25 pt-6">
                {[
                  "5 CV analyses per month",
                  "Basic quiz bank access",
                  "Standard AI mock interview",
                  "Email support only",
                ].map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-slate-400"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      <Check size={12} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handlePlanSelection("free")}
                className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition duration-300 ${
                  isDark
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                Get Started
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Premium Plan */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-emerald-500 via-teal-400 to-indigo-600 shadow-xl group"
          >
            {/* inner card with dark background */}
            <div
              className={`flex h-full flex-col justify-between rounded-[22.5px] p-8 ${
                isDark ? "bg-[#0B1224]" : "bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Career Accelerator
                  </h3>
                  <span className="rounded-full bg-amber-400/25 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Full suite of tools to multiply your career search success.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {billingPeriod === "annual" ? "BDT 5,000" : "BDT 499"}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    {billingPeriod === "annual" ? "/ year" : "/ month"}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="mt-8 space-y-4 border-t border-slate-750/25 pt-6">
                  {[
                    "Unlimited CV analyses & scores",
                    "Full Quiz Bank + details analytics",
                    "Unlimited AI mock interviews",
                    "STAR method rewritten recommendations",
                    "Personalized & detailed roadmap guides",
                    "24/7 priority support access",
                  ].map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-3 text-sm ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check size={12} className="stroke-[3]" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handlePlanSelection("premium")}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-sm font-bold text-white shadow-lg transition duration-300 hover:opacity-95 hover:shadow-emerald-500/25"
                >
                  Upgrade to Premium
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
