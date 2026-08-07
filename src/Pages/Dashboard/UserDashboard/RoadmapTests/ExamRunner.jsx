import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Loader2,
  ClipboardCheck, RotateCcw, GraduationCap, Lock, ClipboardList,
  AlertTriangle
} from 'lucide-react'

const LETTERS = ['a', 'b', 'c', 'd']

const DIFFICULTY_STYLES = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  hard: 'bg-error/10 text-error border-error/20',
}

const motionPreset = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: 'easeOut' },
}

/* ── Score ring (JetBrains Mono figure) ── */
const ScoreRing = ({ pct, passed }) => {
  const r = 54
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  const color = passed ? 'text-success' : 'text-error'

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-base-content/10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono text-3xl font-bold tracking-tight ${color}`}>{pct}%</span>
        <span className={`text-[10px] font-semibold tracking-widest uppercase mt-0.5 ${color}`}>
          {passed ? 'Passed' : 'Not passed'}
        </span>
      </div>
    </div>
  )
}

const ExamRunner = ({
  kind,
  load,
  submit,
  durationWeeks,
  backPath,
  roadmapPath,
}) => {
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const [questions, setQuestions] = useState([])
  const [passScore, setPassScore] = useState(60)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const isFinal = kind === 'final'
  const total = questions.length

  const start = useCallback(async () => {
    setStatus('loading')
    setError(null)
    setQuestions([])
    setAnswers({})
    setCurrentIndex(0)
    try {
      const res = await load()
      const data = res?.data?.data
      if (!data) throw new Error('Empty response')
      setMeta(data)
      setPassScore(data.pass_score || 60)
      if (data.already_passed) {
        setStatus('passed')
        return
      }
      const qs = data.questions || []
      if (qs.length === 0) {
        setError({ message: 'No questions are available for this test yet. Try again shortly.', reason: 'unknown' })
        setStatus('error')
        return
      }
      setQuestions(qs)
      setStatus('taking')
    } catch (err) {
      const statusCode = err?.response?.status
      const msg = err?.response?.data?.message || 'Could not load this test. Check your connection and try again.'
      let reason = 'unknown'
      if (statusCode === 403) reason = 'locked'
      else if (statusCode === 409) reason = 'tasks'
      setError({ message: msg, reason })
      setStatus('error')
    }
  }, [load])

  useEffect(() => { start() }, [start])

  const handleSelect = (letter) => {
    if (submitting) return
    setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: letter }))
  }

  const goTo = (i) => {
    if (i < 0 || i >= total) return
    setCurrentIndex(i)
  }

  const nextQuestion = () => {
    if (currentIndex < total - 1) {
      goTo(currentIndex + 1)
    } else {
      setStatus('review')
    }
  }

  const handleSubmit = async () => {
    if (submitting) return
    if (Object.keys(answers).length !== total) {
      toast.error(`Answer every question first (${Object.keys(answers).length} of ${total})`)
      return
    }
    setSubmitting(true)
    setStatus('submitting')
    try {
      const payload = questions.map((q) => ({
        question_id: q.id,
        selected_answer: answers[q.id],
      }))
      const res = await submit(payload)
      const data = res?.data?.data
      setResult(data)
      setStatus('result')
      if (data.passed) {
        toast.success(isFinal ? 'Final exam passed!' : 'Test passed — week unlocked')
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        setStatus('passed')
        toast.info(err?.response?.data?.message || 'This test has already been passed')
      } else {
        setStatus('review')
        toast.error(err?.response?.data?.message || 'Could not submit your answers. Try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetake = () => start()

  const handleBack = () => navigate(backPath)

  const showBreakdown = !isFinal && result?.answers?.length > 0
  const showNextWeekCta =
    !isFinal && result?.passed && durationWeeks && meta?.week_number != null

  /* ═══════════════ Loading ═══════════════ */
  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
          <p className="text-sm text-base-content/60">Preparing your {isFinal ? 'final exam' : 'test'}...</p>
        </div>
      </div>
    )
  }

  /* ═══════════════ Load errors (locked / tasks / already) ═══════════════ */
  if (status === 'error') {
    const isLocked = error?.reason === 'locked'
    const needsTasks = error?.reason === 'tasks'
    const Icon = isLocked ? Lock : needsTasks ? ClipboardList : AlertTriangle

    return (
      <div className="max-w-xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-base-content/10 bg-base-300 p-8 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-base-content/5 flex items-center justify-center mx-auto mb-5">
            <Icon className="w-7 h-7 text-base-content/50" />
          </div>
          <h1 className="text-lg font-bold text-base-content mb-1">
            {isLocked ? 'This test is locked' : needsTasks ? 'Daily tasks come first' : 'Test unavailable'}
          </h1>
          <p className="text-sm text-base-content/50 leading-relaxed max-w-sm mx-auto mb-6">
            {error.message}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmap
            </button>
            {needsTasks && (
              <button
                onClick={() => navigate(roadmapPath)}
                className="flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-200 px-5 py-2.5 text-sm font-medium text-base-content/60 hover:text-base-content transition"
              >
                <ClipboardCheck className="w-4 h-4" />
                Complete Tasks
              </button>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  /* ═══════════════ Already passed ═══════════════ */
  if (status === 'passed') {
    return (
      <div className="max-w-xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-base-content/10 bg-base-300 p-8 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <h1 className="text-lg font-bold text-base-content mb-1">Already passed</h1>
          <p className="text-sm text-base-content/50 max-w-sm mx-auto mb-6">
            {isFinal
              ? 'You have already completed the final exam for this roadmap.'
              : 'You have already passed this week\u2019s test. Passed tests cannot be taken again.'}
          </p>
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmap
          </button>
        </motion.div>
      </div>
    )
  }

  /* ═══════════════ Result ═══════════════ */
  if (status === 'result' && result) {
    const score = result.score ?? 0
    const passed = !!result.passed
    const correct = result.correct_count ?? 0
    const totalQ = result.total_questions ?? total
    const isLastWeek = showNextWeekCta && meta.week_number === durationWeeks

    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <div className="rounded-2xl border border-base-content/10 bg-base-300 p-8 text-center">
            <h2 className="text-lg font-bold text-base-content mb-6">
              {isFinal
                ? passed ? 'Roadmap complete' : 'Final exam'
                : passed ? `Week ${meta?.week_number} passed` : `Week ${meta?.week_number} test`}
            </h2>
            <div className="flex justify-center">
              <ScoreRing pct={score} passed={passed} />
            </div>
            <p className={`text-sm font-medium mt-3 ${passed ? 'text-success' : 'text-error'}`}>
              {result.message || (passed ? 'Passed!' : 'Not this time.')}
            </p>
            <p className="text-xs text-base-content/40 mt-1">
              {correct} of {totalQ} correct · passing score {passScore}%
            </p>

            {passed && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {isFinal && (
                  <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 text-success px-4 py-2.5 text-sm font-medium">
                    <GraduationCap className="w-4 h-4" />
                    Final exam passed — roadmap completed
                  </div>
                )}
                {!isFinal && meta?.week_number != null && (
                  <div className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 text-primary px-4 py-2.5 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {isLastWeek
                      ? 'All weekly tests passed — final exam unlocked'
                      : `Week ${meta.week_number + 1} unlocked`}
                  </div>
                )}
              </div>
            )}

            {!passed && (
              <p className="text-xs text-base-content/40 mt-4">
                You can retake this {isFinal ? 'exam' : 'test'} as many times as you need.
              </p>
            )}
          </div>

          {/* Per-question breakdown (returned only for passed weekly tests) */}
          {showBreakdown && (
            <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mb-4">
                Answer breakdown
              </p>
              <ul className="space-y-2">
                {questions.map((q, i) => {
                  const a = result.answers?.find((x) => x.question_id === q.id)
                  const ok = a?.is_correct
                  return (
                    <li
                      key={q.id}
                      className="flex items-start gap-3 text-xs leading-relaxed text-base-content/70"
                    >
                      {ok ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-success mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 text-error mt-0.5" />
                      )}
                      <span>
                        {i + 1}. {q.question_text}
                        {a && !ok && (
                          <span className="text-base-content/40">
                            {' '}— correct answer: {(a.correct_answer ?? a.selected_answer)?.toUpperCase()}
                          </span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {passed ? (
              <>
                {isFinal ? (
                  <button
                    onClick={handleBack}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Back to Roadmap
                  </button>
                ) : (
                  <>
                    {isLastWeek && (
                      <button
                        onClick={() => navigate(`${roadmapPath}/final-exam`)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                      >
                        <GraduationCap className="w-4 h-4" />
                        Take the Final Exam
                      </button>
                    )}
                    <button
                      onClick={handleBack}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-200 px-5 py-2.5 text-sm font-medium text-base-content/60 hover:text-base-content transition ${isLastWeek ? 'sm:flex-none' : ''}`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Roadmap
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-base-content/10 bg-base-200 px-5 py-2.5 text-sm font-medium text-base-content/60 hover:text-base-content transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Roadmap
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  /* ═══════════════ Review & submit ═══════════════ */
  if (status === 'review') {
    const answeredCount = Object.keys(answers).length
    const missing = questions.filter((q) => !answers[q.id])
    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div {...motionPreset} className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => goTo(0)}
              className="flex items-center gap-1.5 text-sm text-base-content/40 hover:text-base-content transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Keep editing
            </button>
            <span className="font-mono text-xs text-base-content/50">
              {answeredCount}/{total} answered
            </span>
          </div>

          <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mb-4">
              Review your answers
            </p>
            <ul className="space-y-1.5">
              {questions.map((q, i) => {
                const hasAnswer = !!answers[q.id]
                return (
                  <li key={q.id}>
                    <button
                      onClick={() => goTo(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition ${
                        hasAnswer
                          ? 'bg-base-200 hover:bg-base-content/5'
                          : 'bg-error/5 border border-error/20 hover:bg-error/10'
                      }`}
                    >
                      <span className="font-mono text-base-content/40 w-6 shrink-0">
                        {i + 1}.
                      </span>
                      <span className={`flex-1 truncate ${hasAnswer ? 'text-base-content/70' : 'text-error'}`}>
                        {q.question_text}
                      </span>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded font-mono font-semibold text-[10px] uppercase ${
                          hasAnswer ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                        }`}
                      >
                        {hasAnswer ? answers[q.id] : '—'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {missing.length > 0 && (
            <p className="text-xs text-error/80 text-center">
              {missing.length} unanswered {missing.length === 1 ? 'question' : 'questions'} — answer them to submit.
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || missing.length > 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Grading...
              </>
            ) : (
              <>
                <ClipboardCheck className="w-4 h-4" />
                Submit {total} answers
              </>
            )}
          </button>
        </motion.div>
      </div>
    )
  }

  /* ═══════════════ Submitting (between review and result) ═══════════════ */
  if (status === 'submitting') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
          <p className="text-sm text-base-content/60">Grading your answers...</p>
        </div>
      </div>
    )
  }

  /* ═══════════════ Taking the test ═══════════════ */
  const question = questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-2xl mx-auto py-8">
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
            className="flex items-center gap-1.5 text-sm text-base-content/40 hover:text-base-content transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Roadmap
          </button>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 pt-0.5">
            {isFinal ? `Final exam · ${total} questions` : `Week ${meta?.week_number} test · ${total} questions`}
          </span>
        </div>

        {/* Segment navigator */}
        <div className="flex items-center gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id]
            const isCurrent = i === currentIndex
            return (
              <button
                key={q.id}
                onClick={() => goTo(i)}
                aria-label={`Go to question ${i + 1}`}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-primary'
                    : isAnswered
                      ? 'bg-primary/40'
                      : 'bg-base-content/10 hover:bg-base-content/20'
                }`}
              />
            )
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
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-semibold text-base-content/40">
                  Q{currentIndex + 1} / {total}
                </span>
                {question.difficulty && (
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[question.difficulty] || ''}`}>
                    {question.difficulty}
                  </span>
                )}
              </div>
              <p className="text-base font-medium text-base-content leading-relaxed">
                {question.question_text}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {LETTERS.map((letter) => {
                const option = question.options?.[letter]
                if (!option) return null
                const isSelected = answers[question.id] === letter
                return (
                  <button
                    key={letter}
                    onClick={() => handleSelect(letter)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-base-content/10 bg-base-200 hover:bg-base-content/5 hover:border-base-content/25'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition ${
                        isSelected ? 'bg-primary text-primary-content' : 'bg-base-content/10 text-base-content/50'
                      }`}
                    >
                      {letter.toUpperCase()}
                    </span>
                    <span className={`text-sm flex-1 leading-snug ${isSelected ? 'font-medium text-base-content' : 'text-base-content/80'}`}>
                      {option}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom nav */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 rounded-xl border border-base-content/10 bg-base-200 px-4 py-2.5 text-sm font-medium text-base-content/60 hover:text-base-content transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex >= total - 1}
            className="flex items-center gap-1.5 rounded-xl border border-base-content/10 bg-base-200 px-4 py-2.5 text-sm font-medium text-base-content/60 hover:text-base-content transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Skip
            <ArrowRight className="w-4 h-4" />
          </button>
          {currentIndex >= total - 1 ? (
            <button
              onClick={() => setStatus('review')}
              className="flex items-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              <ClipboardCheck className="w-4 h-4" />
              Review & Submit
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-base-content/30">
          {answeredCount} of {total} answered
        </p>
      </motion.div>
    </div>
  )
}

export default ExamRunner
