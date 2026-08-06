import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HelpCircle, Play, Loader2, CheckCircle2, XCircle,
  ArrowRight, BarChart3, Clock, RotateCcw
} from 'lucide-react'

const ROLE_CATEGORIES = [
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'devops', label: 'DevOps' },
  { value: 'data-science', label: 'Data Science' },
]

const DIFFICULTIES = [
  { value: '', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

const QUESTION_COUNTS = [10, 20]

const DIFFICULTY_STYLES = {
  easy: 'bg-success/10 text-success',
  medium: 'bg-amber-500/10 text-amber-500',
  hard: 'bg-error/10 text-error',
}

const R = 54
const C = 2 * Math.PI * R

const getAccent = (pct) => {
  if (pct >= 80) return 'text-success'
  if (pct >= 60) return 'text-amber-500'
  return 'text-error'
}

const Quiz = () => {
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [phase, setPhase] = useState('setup')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  const [roleCategory, setRoleCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [qCount, setQCount] = useState(10)

  const activeStyle = 'bg-primary text-primary-content border-primary'
  const inactiveStyle = 'bg-base-200 text-base-content/60 border-base-content/10 hover:border-base-content/30'

  const startQuiz = async () => {
    if (!roleCategory) {
      toast.error('Select a role category')
      return
    }
    setLoading(true)
    try {
      const params = { role_category: roleCategory, limit: qCount }
      if (difficulty) params.difficulty = difficulty
      const res = await axiosSecure.get('/api/quiz', { params })
      if (res.data.success) {
        if (!res.data.data.questions || res.data.data.questions.length === 0) {
          toast.error('No questions found for this combination')
          setLoading(false)
          return
        }
        setQuestions(res.data.data.questions)
        setCurrentIndex(0)
        setSelectedOption(null)
        setLastResult(null)
        setCorrectCount(0)
        setPhase('active')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOption = async (option) => {
    if (submitting || lastResult) return
    setSubmitting(true)
    setSelectedOption(option)

    try {
      const q = questions[currentIndex]
      const res = await axiosSecure.post('/api/quiz/attempt', {
        question_id: q.id,
        selected_answer: option,
        shuffle: q.shuffle,
      })
      if (res.data.success) {
        setLastResult(res.data.data)
        if (res.data.data.is_correct) {
          setCorrectCount((prev) => prev + 1)
          toast.success('Correct!')
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit answer')
      setSelectedOption(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setLastResult(null)
    } else {
      setPhase('completed')
    }
  }

  const handleRestart = () => {
    setPhase('setup')
    setQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setLastResult(null)
    setCorrectCount(0)
  }

  const total = questions.length
  const isLastQuestion = currentIndex === total - 1

  /* ═══════════════════ SETUP PHASE ═══════════════════ */
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* ── Header ── */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-base-content">Practice Quiz</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Test your knowledge across tech domains
            </p>
          </div>

          {/* ── Role Category ── */}
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-3 block">
              Role Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setRoleCategory(cat.value)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium border transition-all ${
                    roleCategory === cat.value ? activeStyle : inactiveStyle
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Difficulty ── */}
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-3 block">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.label}
                  onClick={() => setDifficulty(d.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium border transition-all ${
                    (d.value === '' && !difficulty) || difficulty === d.value
                      ? activeStyle
                      : inactiveStyle
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Question Count ── */}
          <div>
            <label className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-3 block">
              Questions
            </label>
            <div className="flex gap-2">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setQCount(n)}
                  className={`rounded-lg px-5 py-2 text-sm font-medium border transition-all ${
                    qCount === n ? activeStyle : inactiveStyle
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* ── Start Button ── */}
          <button
            onClick={startQuiz}
            disabled={loading || !roleCategory}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Quiz
              </>
            )}
          </button>
        </motion.div>
      </div>
    )
  }

  /* ═══════════════════ RESULTS PHASE ═══════════════════ */
  if (phase === 'completed') {
    const correct = correctCount
    const incorrect = total - correct
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    const accent = getAccent(accuracy)
    const offset = C - (accuracy / 100) * C

    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* ── Score Hero ── */}
          <div className="text-center py-6">
            <h2 className="text-lg font-bold text-base-content mb-6">Quiz Complete</h2>
            <div className="relative w-36 h-36 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r={R}
                  fill="none" stroke="currentColor" strokeWidth="8"
                  className="text-base-content/10"
                />
                <motion.circle
                  cx="60" cy="60" r={R}
                  fill="none" stroke="currentColor" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={accent}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold font-mono ${accent}`}>
                  {accuracy}%
                </span>
              </div>
            </div>
            <p className={`text-sm font-medium mt-2 ${accent}`}>
              {accuracy >= 80 ? 'Strong performance' : accuracy >= 60 ? 'Getting there' : 'Keep practicing'}
            </p>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-base-content/10 bg-base-300 p-3 text-center">
              <p className="text-2xl font-bold text-base-content">{total}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mt-0.5">
                Total
              </p>
            </div>
            <div className="rounded-xl border border-base-content/10 bg-base-300 p-3 text-center">
              <p className="text-2xl font-bold text-success">{correct}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mt-0.5">
                Correct
              </p>
            </div>
            <div className="rounded-xl border border-base-content/10 bg-base-300 p-3 text-center">
              <p className="text-2xl font-bold text-error">{incorrect}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mt-0.5">
                Incorrect
              </p>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="space-y-2">
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Try Another Quiz
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/dashboard/quiz/stats')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-base-content/10 bg-base-300 px-4 py-2 text-xs font-medium text-base-content/60 hover:text-base-content hover:bg-base-content/5 transition"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Stats
              </button>
              <button
                onClick={() => navigate('/dashboard/quiz/history')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-base-content/10 bg-base-300 px-4 py-2 text-xs font-medium text-base-content/60 hover:text-base-content hover:bg-base-content/5 transition"
              >
                <Clock className="w-3.5 h-3.5" />
                History
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ═══════════════════ ACTIVE QUIZ PHASE ═══════════════════ */
  const currentQuestion = questions[currentIndex]

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* ── Progress Bar ── */}
      <div className="flex items-center gap-1.5 mb-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
              i < currentIndex
                ? 'bg-primary'
                : i === currentIndex
                  ? 'bg-primary/50'
                  : 'bg-base-content/10'
            }`}
          />
        ))}
      </div>

      {/* ── Question Meta ── */}
      <div className="flex items-center justify-between text-xs text-base-content/40 mb-4">
        <span>
          Question {currentIndex + 1} of {total}
        </span>
        {currentQuestion.difficulty && (
          <span
            className={`px-2 py-0.5 rounded font-medium ${
              DIFFICULTY_STYLES[currentQuestion.difficulty] || ''
            }`}
          >
            {currentQuestion.difficulty.charAt(0).toUpperCase() +
              currentQuestion.difficulty.slice(1)}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Question Card (flashcard) ── */}
          <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6 relative overflow-hidden mb-4">
            <span
              className="absolute -top-4 -right-2 text-[120px] font-bold text-base-content/4 select-none pointer-events-none leading-none"
              aria-hidden
            >
              {currentIndex + 1}
            </span>
            <p className="text-base font-medium text-base-content leading-relaxed">
              {currentQuestion.question_text}
            </p>
          </div>

          {/* ── Options ── */}
          <div className="space-y-2">
            {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
              const isSelected = selectedOption === key
              const isCorrectOption = lastResult?.correct_answer === key
              const isWrongOption = lastResult && isSelected && !lastResult.is_correct
              const showResult = !!lastResult

              let optionStyle =
                'border-base-content/10 bg-base-200 hover:bg-base-content/5 hover:border-base-content/20'
              if (showResult && isCorrectOption) {
                optionStyle = 'border-success bg-success/10'
              } else if (showResult && isWrongOption) {
                optionStyle = 'border-error bg-error/10'
              } else if (isSelected && submitting) {
                optionStyle = 'border-primary bg-primary/5'
              }

              let badgeContent
              if (submitting && isSelected) {
                badgeContent = <Loader2 className="w-4 h-4 animate-spin" />
              } else if (showResult && isCorrectOption) {
                badgeContent = <CheckCircle2 className="w-4 h-4" />
              } else if (showResult && isWrongOption) {
                badgeContent = <XCircle className="w-4 h-4" />
              } else {
                badgeContent = key.toUpperCase()
              }

              let badgeStyle =
                'bg-base-content/10 text-base-content/50'
              if (showResult && isCorrectOption) {
                badgeStyle = 'bg-success text-success-content'
              } else if (showResult && isWrongOption) {
                badgeStyle = 'bg-error text-error-content'
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  disabled={submitting || !!lastResult}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all disabled:cursor-default ${optionStyle}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${badgeStyle}`}
                  >
                    {badgeContent}
                  </div>
                  <span
                    className={`text-sm flex-1 leading-snug ${
                      showResult && (isCorrectOption || isWrongOption)
                        ? 'font-medium text-base-content'
                        : 'text-base-content/80'
                    }`}
                  >
                    {value}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── Feedback Banner + Next ── */}
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <div
                className={`rounded-xl p-3 text-sm font-medium border ${
                  lastResult.is_correct
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-error/10 text-error border-error/20'
                }`}
              >
                {lastResult.is_correct
                  ? 'Correct!'
                  : `Not quite — the answer was ${lastResult.correct_answer.toUpperCase()}`}
              </div>
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                {isLastQuestion ? 'See Results' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Quiz
