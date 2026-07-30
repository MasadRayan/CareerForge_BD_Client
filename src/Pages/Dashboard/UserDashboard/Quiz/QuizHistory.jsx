import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Clock, CheckCircle2, XCircle,
  ArrowRight, CalendarDays, HelpCircle
} from 'lucide-react'

const DIFFICULTY_STYLES = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  hard: 'bg-error/10 text-error border-error/20',
}

const QuizHistory = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = useCallback(async () => {
    if (!user?.email) return
    try {
      const res = await axiosSecure.get('/api/quiz/history')
      if (res.data.success) setHistory(res.data.data)
      else setError('Failed to load history')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load quiz history'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [user?.email, axiosSecure])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-4">
        <div className="h-8 w-52 bg-base-content/10 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-base-content/10 rounded animate-pulse" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-base-content/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <Clock className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
        <p className="text-base font-medium text-base-content/60 mb-2">
          Could not load quiz history
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
          <h1 className="text-2xl font-bold text-base-content">Quiz History</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Review your past quiz attempts
          </p>
        </div>

        <AnimatePresence mode="wait">
          {history.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-base-content/10" />
                <span className="text-[10px] font-semibold tracking-widest text-base-content/40 uppercase">
                  {history.length} {history.length === 1 ? 'Attempt' : 'Attempts'}
                </span>
                <span className="h-px flex-1 bg-base-content/10" />
              </div>

              {history.map((item, i) => {
                const diffStyle = DIFFICULTY_STYLES[item.question?.difficulty] || ''
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-xl border border-base-content/10 bg-base-300 overflow-hidden"
                  >
                    <div className="p-4">
                      {/* Top row: verdict + question */}
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {item.is_correct ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <XCircle className="w-5 h-5 text-error" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-base-content leading-snug line-clamp-2">
                            {item.question?.question_text || 'Unknown question'}
                          </p>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center flex-wrap gap-2 mt-2.5 ml-8">
                        {item.question?.difficulty && (
                          <span
                            className={`text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border ${diffStyle}`}
                          >
                            {item.question.difficulty}
                          </span>
                        )}
                        {item.question?.role_category && (
                          <span className="text-[10px] font-medium text-base-content/40 bg-base-content/5 px-1.5 py-0.5 rounded">
                            {item.question.role_category}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-base-content/30">
                          <CalendarDays className="w-3 h-3" />
                          {formatDate(item.attempted_at)}
                        </span>
                      </div>

                      {/* Answer detail (only shown when incorrect) */}
                      {!item.is_correct && item.selected_answer && item.question?.correct_answer && (
                        <div className="mt-2.5 ml-8 text-[11px] text-base-content/40">
                          <span>
                            Your answer: <span className="font-mono font-medium text-error">{item.selected_answer.toUpperCase()}</span>
                            {' — '}Correct: <span className="font-mono font-medium text-success">{item.question.correct_answer.toUpperCase()}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <HelpCircle className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
              <p className="text-base font-medium text-base-content/60 mb-1">
                No quiz history yet
              </p>
              <p className="text-xs text-base-content/40 mb-6">
                Complete a quiz to see your attempts here
              </p>
              <button
                onClick={() => navigate('/dashboard/quiz')}
                className="rounded-xl bg-primary text-primary-content px-5 py-2 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2"
              >
                Take a Quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default QuizHistory
