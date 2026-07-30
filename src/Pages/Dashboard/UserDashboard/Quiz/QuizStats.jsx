import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  BarChart3, Loader2, HelpCircle, CheckCircle2,
  XCircle, Layers, ArrowRight
} from 'lucide-react'

const DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
const DIFFICULTY_COLORS = {
  easy: { text: 'text-success', bg: 'bg-success/10', bar: 'bg-success' },
  medium: { text: 'text-amber-500', bg: 'bg-amber-500/10', bar: 'bg-amber-500' },
  hard: { text: 'text-error', bg: 'bg-error/10', bar: 'bg-error' },
}

const getAccent = (pct) => {
  if (pct >= 80) return { text: 'text-success', bg: 'bg-success/10' }
  if (pct >= 60) return { text: 'text-amber-500', bg: 'bg-amber-500/10' }
  return { text: 'text-error', bg: 'bg-error/10' }
}

const R = 54
const C = 2 * Math.PI * R

const QuizStats = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!user?.email) return
    try {
      const res = await axiosSecure.get('/api/quiz/stats')
      if (res.data.success) setStats(res.data.data)
      else setError('Failed to load statistics')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load quiz statistics'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [user?.email, axiosSecure])

  useEffect(() => { fetchStats() }, [fetchStats])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-4">
        <div className="h-8 w-48 bg-base-content/10 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-base-content/10 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-base-content/10 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="flex justify-center py-6">
          <div className="w-40 h-40 bg-base-content/10 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-base-content/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <BarChart3 className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
        <p className="text-base font-medium text-base-content/60 mb-2">
          Could not load statistics
        </p>
        <p className="text-xs text-base-content/40 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-primary text-primary-content px-5 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!stats || stats.total_attempted === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-base-content">Quiz Statistics</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Track your quiz performance over time
            </p>
          </div>
          <div className="text-center py-16">
            <HelpCircle className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
            <p className="text-base font-medium text-base-content/60 mb-1">
              No quiz attempts yet
            </p>
            <p className="text-xs text-base-content/40 mb-6">
              Complete a quiz to see your stats here
            </p>
            <button
              onClick={() => navigate('/dashboard/quiz')}
              className="rounded-xl bg-primary text-primary-content px-5 py-2 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2"
            >
              Take a Quiz
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const {
    total_attempted,
    correct,
    incorrect,
    accuracy_percent,
    by_difficulty = { easy: { attempted: 0, correct: 0 }, medium: { attempted: 0, correct: 0 }, hard: { attempted: 0, correct: 0 } },
  } = stats

  const accent = getAccent(accuracy_percent)
  const offset = C - (accuracy_percent / 100) * C

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-base-content">Quiz Statistics</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Track your quiz performance over time
          </p>
        </div>

        {/* ── Overview cards ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-base-content/10 bg-base-300 p-4 text-center">
            <HelpCircle className="w-5 h-5 mx-auto text-base-content/30 mb-2" />
            <p className="text-2xl font-bold text-base-content">{total_attempted}</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mt-0.5">
              Attempted
            </p>
          </div>
          <div className="rounded-xl border border-base-content/10 bg-base-300 p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto text-success mb-2" />
            <p className="text-2xl font-bold text-success">{correct}</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mt-0.5">
              Correct
            </p>
          </div>
          <div className="rounded-xl border border-base-content/10 bg-base-300 p-4 text-center">
            <XCircle className="w-5 h-5 mx-auto text-error mb-2" />
            <p className="text-2xl font-bold text-error">{incorrect}</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mt-0.5">
              Incorrect
            </p>
          </div>
        </div>

        {/* ── Accuracy ring ── */}
        <div className="flex justify-center py-4">
          <div className="relative w-40 h-40">
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
                className={accent.text}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-3xl font-bold font-mono ${accent.text}`}>
                  {accuracy_percent}%
                </p>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 -mt-0.5">
                  Accuracy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Difficulty breakdown ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-4 h-4 text-base-content/40" />
            <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
              By Difficulty
            </span>
            <span className="h-px flex-1 bg-base-content/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(by_difficulty).map(([key, val]) => {
              const dc = DIFFICULTY_COLORS[key] || DIFFICULTY_COLORS.easy
              const acc = val.attempted > 0 ? Math.round((val.correct / val.attempted) * 100) : 0
              return (
                <div
                  key={key}
                  className="rounded-xl border border-base-content/10 bg-base-300 p-4"
                >
                  <p className="text-xs font-semibold text-base-content mb-3">
                    {DIFFICULTY_LABELS[key] || key}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-base-content/40">Attempted</span>
                      <span className="font-medium text-base-content">{val.attempted}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-base-content/40">Correct</span>
                      <span className="font-medium text-success">{val.correct}</span>
                    </div>
                    <div className="pt-1.5">
                      <div className="h-1.5 rounded-full bg-base-content/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dc.bar}`}
                          style={{ width: `${acc}%` }}
                        />
                      </div>
                      <p className={`text-[10px] font-medium text-right mt-0.5 ${dc.text}`}>
                        {acc}%
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QuizStats
