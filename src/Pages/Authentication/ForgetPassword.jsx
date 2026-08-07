import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import auth from "../../Firebase/firebase.init";
import { useTheme } from "../../Context/ThemeProvider";

const ForgetPassword = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Pre-fill email if passed from Sign In page state
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Password reset email sent!");
        setEmailSent(true);
      })
      .catch((error) => {
        const errorMessage = error.message || "Failed to send reset email";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center pt-24 px-5 transition-colors duration-500 ${
        dark
          ? "bg-[#050816]"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
      }`}
    >
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className={`rounded-4xl border p-8 shadow-xl backdrop-blur-2xl transition-all duration-300 ${
            dark
              ? "border-slate-700 bg-slate-900/70"
              : "border-white/70 bg-white/80"
          }`}
        >
          {/* Header Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <KeyRound className="h-8 w-8" />
            </div>
          </div>

          {!emailSent ? (
            <>
              {/* Heading */}
              <div className="mb-6 text-center">
                <h1
                  className={`text-2xl font-bold tracking-tight ${
                    dark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Forgot Password?
                </h1>
                <p className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  No worries! Enter your email address below and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${
                      dark ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <div
                    className={`flex items-center rounded-2xl border px-4 transition ${
                      dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
                    }`}
                  >
                    <Mail className={`h-5 w-5 ${dark ? "text-slate-500" : "text-slate-400"}`} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-2xl bg-transparent px-3 py-3 outline-none placeholder:text-slate-400 ${
                        dark ? "text-white" : "text-slate-850"
                      }`}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="mb-6 text-center">
                <h1
                  className={`text-2xl font-bold tracking-tight ${
                    dark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Check Your Inbox
                </h1>
                <p className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  We have sent a password reset link to <strong className="text-blue-500">{email}</strong>.
                  Please check your inbox and follow the instructions in the email.
                </p>
              </div>

              <div className="space-y-3">
                {/* Open Gmail button */}
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 text-center"
                >
                  Open Gmail
                </a>

                {/* Resend option */}
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className={`w-full py-2.5 text-sm font-semibold transition hover:underline ${
                    dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Didn't receive the email? Resend link
                </button>
              </div>
            </>
          )}

          {/* Back to Login Link */}
          <div className="mt-6 border-t border-slate-700/20 pt-5 text-center">
            <Link
              to="/signin"
              className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                dark ? "text-slate-450 hover:text-white" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ForgetPassword;
