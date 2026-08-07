import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardCheck,
  RotateCcw,
  Award,
  Copy,
  Check,
  Download,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";

const LETTERS = ["a", "b", "c", "d"];
const PASS_SCORE = 60;

const motionPreset = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: "easeOut" },
};

/* ── Score ring (JetBrains Mono figure) ── */
const ScoreRing = ({ pct, passed }) => {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = passed ? "text-success" : "text-error";

  return (
    <div className="relative h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-base-content/10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-mono text-3xl font-bold tracking-tight ${color}`}
        >
          {pct}%
        </span>
        <span
          className={`mt-0.5 text-[10px] font-semibold tracking-widest uppercase ${color}`}
        >
          {passed ? "Passed" : "Not passed"}
        </span>
      </div>
    </div>
  );
};

const CertificateTest = () => {
  const { skill } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [status, setStatus] = useState("starting");
  const [error, setError] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const total = questions.length;

  const load = useCallback(async () => {
    try {
      const res = await axiosSecure.post("/api/certificate/test", { skill });
      const data = res?.data?.data;
      if (!data) throw new Error("Empty response");
      setAttemptId(data.attempt_id);
      const qs = data.questions || [];
      if (qs.length === 0) {
        setError({
          message:
            "No questions are available for this skill yet. Try again shortly.",
          reason: "unknown",
        });
        setStatus("error");
        return;
      }
      setQuestions(qs);
      setStatus("taking");
    } catch (err) {
      const statusCode = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        "Could not start the test. Check your connection and try again.";
      let reason = "unknown";
      if (statusCode === 403) reason = "skill";
      else if (statusCode === 502) reason = "ai";
      setError({ message: msg, reason });
      setStatus("error");
    }
  }, [axiosSecure, skill]);

  const start = useCallback(() => {
    setStatus("starting");
    setError(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setAttemptId(null);
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const handleBack = () => navigate("/dashboard/certificates");

  const handleSelect = (letter) => {
    if (submitting) return;
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: letter,
    }));
  };

  const goTo = (i) => {
    if (i < 0 || i >= total) return;
    setCurrentIndex(i);
  };

  const nextQuestion = () => {
    if (currentIndex < total - 1) {
      goTo(currentIndex + 1);
    } else {
      setStatus("review");
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (Object.keys(answers).length !== total) {
      toast.error(
        `Answer every question first (${Object.keys(answers).length} of ${total})`,
      );
      return;
    }
    setSubmitting(true);
    setStatus("submitting");
    try {
      const payload = questions.map((q) => ({
        question_id: q.id,
        selected_answer: answers[q.id],
      }));
      const res = await axiosSecure.post(
        `/api/certificate/test/${attemptId}/submit`,
        { answers: payload },
      );
      const data = res?.data?.data;
      setResult(data);
      setStatus("result");
      if (data.passed) toast.success("Test passed. Certificate issued.");
    } catch (err) {
      if (err?.response?.status === 409) {
        setStatus("error");
        setError({
          message:
            err?.response?.data?.message ||
            "This test has already been submitted.",
          reason: "submitted",
        });
      } else {
        setStatus("review");
        toast.error(
          err?.response?.data?.message || "Could not submit your answers. Try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.certificate) return;
    try {
      await navigator.clipboard.writeText(result.certificate.cert_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      toast.success("Certification code copied");
    } catch {
      toast.error("Could not copy the code");
    }
  };

  /* ═══════════════ Starting ═══════════════ */
  if (status === "starting") {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-8 flex flex-col items-center gap-4">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <p className="text-sm text-base-content/60">
            Preparing your {skill} test...
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════ Error ═══════════════ */
  if (status === "error") {
    const isSkill = error?.reason === "skill";
    const isSubmitted = error?.reason === "submitted";
    const Icon = isSkill
      ? BadgeCheck
      : isSubmitted
        ? CheckCircle2
        : AlertTriangle;

    return (
      <div className="mx-auto max-w-xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-base-content/10 bg-base-300 p-8 text-center"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-base-content/5">
            <Icon className="h-7 w-7 text-base-content/50" />
          </div>
          <h1 className="mb-1 text-lg font-bold text-base-content">
            {isSkill
              ? "This skill isn't certifiable"
              : isSubmitted
                ? "Already submitted"
                : "Test unavailable"}
          </h1>
          <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-base-content/50">
            {error.message}
          </p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Certificates
            </button>
            {!isSkill && !isSubmitted && (
              <button
                onClick={start}
                className="flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-200 px-5 py-2.5 text-sm font-medium text-base-content/60 transition hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ═══════════════ Result ═══════════════ */
  if (status === "result" && result) {
    const score = result.score ?? 0;
    const passed = !!result.passed;
    const correct = result.correct_count ?? 0;
    const totalQ = result.total_questions ?? total;
    const cert = result.certificate;

    return (
      <div className="mx-auto max-w-2xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <div className="rounded-2xl border border-base-content/10 bg-base-300 p-8 text-center">
            <h2 className="mb-6 text-lg font-bold text-base-content">
              {passed ? "Certificate issued" : `${skill} test`}
            </h2>
            <div className="flex justify-center">
              <ScoreRing pct={score} passed={passed} />
            </div>
            <p
              className={`mt-3 text-sm font-medium ${
                passed ? "text-success" : "text-error"
              }`}
            >
              {result.message ||
                (passed ? "Passed!" : "Not this time.")}
            </p>
            <p className="mt-1 text-xs text-base-content/40">
              {correct} of {totalQ} correct · passing score {PASS_SCORE}%
            </p>

            {passed && cert && (
              <div className="mt-6 flex flex-col items-center gap-4">
                {/* Certificate record */}
                <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/60">
                  <div className="h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-emerald-500" />
                  <div className="flex flex-col items-center p-5 text-center">
                    <div
                      aria-hidden
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      }}
                    >
                      <Award className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-xs text-base-content/50">
                      {cert.skill}
                    </p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-mono text-xl font-bold tracking-tight text-base-content">
                        {cert.score}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-base-content/40">
                        / 100
                      </span>
                    </div>
                    <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-300 px-3 py-2">
                      <code className="font-mono truncate text-sm font-semibold text-base-content">
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
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={cert.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-200 px-5 py-2.5 text-sm font-medium text-base-content/60 transition hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    View all certificates
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {!passed && (
              <p className="mt-6 text-xs text-base-content/40">
                You can retry this test as many times as you need.
              </p>
            )}
          </div>

          {/* Per-question breakdown */}
          {result.answers?.length > 0 && (
            <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-base-content/40">
                Answer breakdown
              </p>
              <ul className="space-y-2">
                {questions.map((q, i) => {
                  const a = result.answers.find((x) => x.question_id === q.id);
                  const ok = a?.is_correct;
                  return (
                    <li
                      key={q.id}
                      className="flex items-start gap-3 text-xs leading-relaxed text-base-content/70"
                    >
                      {ok ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                      )}
                      <span>
                        {i + 1}. {q.question_text}
                        {a && !ok && a.correct_answer && (
                          <span className="text-base-content/40">
                            {" "}
                            — correct answer:{" "}
                            {a.correct_answer?.toUpperCase()}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!passed && (
            <div className="flex flex-col gap-2">
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-200 px-5 py-2.5 text-sm font-medium text-base-content/60 transition hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Certificates
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  /* ═══════════════ Review & submit ═══════════════ */
  if (status === "review") {
    const answeredCount = Object.keys(answers).length;
    const missing = questions.filter((q) => !answers[q.id]);
    return (
      <div className="mx-auto max-w-2xl py-8">
        <motion.div {...motionPreset} className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => goTo(0)}
              className="flex items-center gap-1.5 text-sm text-base-content/40 transition hover:text-base-content"
            >
              <ArrowLeft className="h-4 w-4" />
              Keep editing
            </button>
            <span className="font-mono text-xs text-base-content/50">
              {answeredCount}/{total} answered
            </span>
          </div>

          <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
            <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-base-content/40">
              Review your answers
            </p>
            <ul className="space-y-1.5">
              {questions.map((q, i) => {
                const hasAnswer = !!answers[q.id];
                return (
                  <li key={q.id}>
                    <button
                      onClick={() => goTo(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                        hasAnswer
                          ? "bg-base-200 hover:bg-base-content/5"
                          : "border border-error/20 bg-error/5 hover:bg-error/10"
                      }`}
                    >
                      <span className="w-6 shrink-0 font-mono text-base-content/40">
                        {i + 1}.
                      </span>
                      <span
                        className={`flex-1 truncate ${
                          hasAnswer
                            ? "text-base-content/70"
                            : "text-error"
                        }`}
                      >
                        {q.question_text}
                      </span>
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                          hasAnswer
                            ? "bg-primary/10 text-primary"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {hasAnswer ? answers[q.id] : "—"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {missing.length > 0 && (
            <p className="text-center text-xs text-error/80">
              {missing.length} unanswered{" "}
              {missing.length === 1 ? "question" : "questions"} — answer them to
              submit.
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || missing.length > 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Grading...
              </>
            ) : (
              <>
                <ClipboardCheck className="h-4 w-4" />
                Submit {total} answers
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  /* ═══════════════ Submitting ═══════════════ */
  if (status === "submitting") {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-base-content/10 bg-base-300 p-8">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <p className="text-sm text-base-content/60">
            Grading your answers...
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════ Taking the test ═══════════════ */
  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-2xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-base-content/40 transition hover:text-base-content"
          >
            <ArrowLeft className="h-4 w-4" />
            Certificates
          </button>
          <span className="pt-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-base-content/40">
            {total} questions · pass at {PASS_SCORE}%
          </span>
        </div>

        {/* Skill intro */}
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-base-content">
            {skill}
          </h1>
          <p className="mt-0.5 text-xs text-base-content/50">
            Answer every question. You need at least {PASS_SCORE}% to earn the
            certificate.
          </p>
        </div>

        {/* Segment navigator */}
        <div className="flex items-center gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = i === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => goTo(i)}
                aria-label={`Go to question ${i + 1}`}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  isCurrent
                    ? "bg-primary"
                    : isAnswered
                      ? "bg-primary/40"
                      : "bg-base-content/10 hover:bg-base-content/20"
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
            className="space-y-5"
          >
            {/* Question card */}
            <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-base-content/40">
                  Q{currentIndex + 1} / {total}
                </span>
                {question?.difficulty && (
                  <span className="rounded border border-base-content/10 bg-base-200 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-base-content/50">
                    {question.difficulty}
                  </span>
                )}
              </div>
              <p className="text-base font-medium leading-relaxed text-base-content">
                {question.question_text}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {LETTERS.map((letter) => {
                const option = question.options?.[letter];
                if (!option) return null;
                const isSelected = answers[question.id] === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => handleSelect(letter)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-base-content/10 bg-base-200 hover:border-base-content/25 hover:bg-base-content/5"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${
                        isSelected
                          ? "bg-primary text-primary-content"
                          : "bg-base-content/10 text-base-content/50"
                      }`}
                    >
                      {letter.toUpperCase()}
                    </span>
                    <span
                      className={`flex-1 text-sm leading-snug ${
                        isSelected
                          ? "font-medium text-base-content"
                          : "text-base-content/80"
                      }`}
                    >
                      {option}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom nav */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-base-content/10 bg-base-200 px-4 py-2.5 text-sm font-medium text-base-content/60 transition hover:text-base-content disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex >= total - 1}
            className="flex items-center gap-1.5 rounded-xl border border-base-content/10 bg-base-200 px-4 py-2.5 text-sm font-medium text-base-content/60 transition hover:text-base-content disabled:cursor-not-allowed disabled:opacity-30"
          >
            Skip
            <ArrowRight className="h-4 w-4" />
          </button>
          {currentIndex >= total - 1 ? (
            <button
              onClick={() => setStatus("review")}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ClipboardCheck className="h-4 w-4" />
              Review & Submit
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-content transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-base-content/30">
          {answeredCount} of {total} answered
        </p>
      </motion.div>
    </div>
  );
};

export default CertificateTest;
