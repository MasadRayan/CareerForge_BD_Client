import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../../../Context/AuthProvider";
import { useTheme } from "../../../../Context/ThemeProvider";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import {
  Award,
  BadgeCheck,
  Check,
  Copy,
  Download,
  ArrowRight,
} from "lucide-react";

const ACC = { dark: "#818cf8", light: "#4f46e5" };
const GRADIENT = "linear-gradient(135deg, #6366f1, #8b5cf6)";

const SectionTag = ({ acc, count, children }) => (
  <div className="mb-4 flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: acc }} />
    <span className="font-data text-[10px] font-semibold uppercase tracking-[0.18em] text-base-content/45">
      {children}
    </span>
    {count != null && (
      <span className="font-data text-[10px] text-base-content/35">{count}</span>
    )}
    <span className="h-px flex-1 bg-base-content/8" />
  </div>
);

const CertCard = ({ cert, index, reduced }) => {
  const [copied, setCopied] = useState(false);

  const issued = new Date(cert.issued_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cert.cert_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      toast.success("Certification code copied");
    } catch {
      toast.error("Could not copy the code");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: reduced ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.1, 0, 1],
        delay: index * 0.05,
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-base-content/10 bg-base-300"
    >
      {/* Seal hairline — indigo → violet → emerald */}
      <div className="h-1 shrink-0 bg-linear-to-r from-indigo-500 via-violet-500 to-emerald-500" />

      <div className="flex flex-1 flex-col items-center p-6 text-center">
        {/* Seal medallion */}
        <div
          aria-hidden
          className="flex h-12 w-12 items-center justify-center rounded-full text-white"
          style={{ background: GRADIENT }}
        >
          <Award className="h-5 w-5" />
        </div>

        {/* Skill + score */}
        <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-base-content">
          {cert.skill}
        </h3>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-data text-2xl font-bold tracking-tight text-base-content">
            {cert.score}
          </span>
          <span className="font-data text-[10px] uppercase tracking-[0.18em] text-base-content/40">
            / 100
          </span>
        </div>

        {/* Certification code — the serial */}
        <div className="mt-5 w-full rounded-xl border border-base-content/10 bg-base-200/60 px-3 py-2.5">
          <p className="font-data text-[9px] uppercase tracking-[0.2em] text-base-content/40">
            Certification code
          </p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <code className="font-data truncate text-sm font-semibold text-base-content">
              {cert.cert_number}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Copy certification code"
              title="Copy code"
              className="shrink-0 rounded-md p-1 text-base-content/40 transition hover:bg-base-content/5 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-auto flex w-full items-center justify-between pt-5 text-[11px]">
          <span className="font-data text-base-content/40">Issued {issued}</span>
          <a
            href={cert.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </a>
        </div>
      </div>
    </motion.article>
  );
};

const Certificates = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const prefersReduced = useReducedMotion();

  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const acc = isDark ? ACC.dark : ACC.light;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 0.1, 0, 1] },
    },
  };

  const email = user?.email;

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    (async () => {
      try {
        const [certRes, profileRes] = await Promise.all([
          axiosSecure.get("/api/certificate"),
          axiosSecure.get(`/api/users/me/${email}`),
        ]);
        if (cancelled) return;
        setCertificates(certRes.data?.data || []);
        setSkills(profileRes.data?.data?.skills || []);
      } catch (err) {
        if (!cancelled)
          toast.error(
            err?.response?.data?.message || "Failed to load your certificates",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email, axiosSecure]);

  const certForSkill = (skill) =>
    certificates.find((c) => c.skill.toLowerCase() === skill.toLowerCase());

  const startTest = (skill) =>
    navigate(`/dashboard/certificates/test/${encodeURIComponent(skill)}`);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-6 py-4">
        <div className="h-5 w-40 rounded bg-base-content/10" />
        <div className="h-10 w-64 rounded bg-base-content/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-64 rounded-2xl bg-base-content/8" />
          <div className="h-64 rounded-2xl bg-base-content/8" />
          <div className="h-64 rounded-2xl bg-base-content/8" />
        </div>
        <div className="h-10 w-48 rounded bg-base-content/10" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-16 rounded-xl bg-base-content/8" />
          <div className="h-16 rounded-xl bg-base-content/8" />
          <div className="h-16 rounded-xl bg-base-content/8" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-4">
      {/* Breadcrumb eyebrow */}
      <div className="mb-6 flex items-center gap-2 font-data text-[11px] uppercase tracking-[0.2em] text-base-content/40">
        <span>CareerForge</span>
        <span className="text-base-content/25">/</span>
        <span style={{ color: acc }}>Skill Certificates</span>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="space-y-10"
      >
        {/* ── Header ── */}
        <motion.header variants={item}>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-base-content sm:text-3xl">
            Skill Certificates
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-base-content/60">
            Pass a 10-question test for a skill on your profile and earn a
            verifiable certificate you can share with employers.
          </p>
        </motion.header>

        {/* ── Earned credentials ── */}
        <motion.section variants={item}>
          <SectionTag acc={acc} count={certificates.length}>
            Earned credentials
          </SectionTag>

          {certificates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert, i) => (
                <CertCard
                  key={cert.id}
                  cert={cert}
                  index={i}
                  reduced={prefersReduced}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-base-content/12 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-base-content/5">
                <Award className="h-5 w-5 text-base-content/30" />
              </div>
              <p className="mt-4 text-sm font-medium text-base-content/60">
                No certificates yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-base-content/40">
                Pass a skill test below and your first verifiable credential
                will appear here.
              </p>
            </div>
          )}
        </motion.section>

        {/* ── Certify a skill ── */}
        <motion.section variants={item}>
          <SectionTag acc={acc} count={skills.length}>
            Certify a skill
          </SectionTag>

          {skills.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, i) => {
                const earned = certForSkill(skill);
                return (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.25, 0.1, 0, 1],
                      delay: i * 0.05,
                    }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-base-content/10 bg-base-300 px-4 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          earned ? "bg-base-content/25" : ""
                        }`}
                        style={earned ? undefined : { background: acc }}
                      />
                      <span
                        className={`truncate text-sm font-medium ${
                          earned
                            ? "text-base-content/50"
                            : "text-base-content"
                        }`}
                      >
                        {skill}
                      </span>
                    </div>

                    {earned ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 font-data text-[10px] font-semibold uppercase tracking-wider text-success">
                        <BadgeCheck className="h-3 w-3" />
                        {earned.score}
                      </span>
                    ) : (
                      <button
                        onClick={() => startTest(skill)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        Start test
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-base-content/12 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-base-content/5">
                <BadgeCheck className="h-5 w-5 text-base-content/30" />
              </div>
              <p className="mt-4 text-sm font-medium text-base-content/60">
                Add skills to start certifying
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-base-content/40">
                Certificates are earned per skill. Add skills to your profile —
                or extract them from your CV — then come back here to start a
                test.
              </p>
              <button
                onClick={() => navigate("/dashboard/updateprofile")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Add skills
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Certificates;
