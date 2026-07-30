import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import {
  MessageSquareText, Brain, ArrowRight,
  RefreshCw, AlertCircle, Target, Clock
} from 'lucide-react'

const getScoreColor = (score) => {
  if (score === null || score === undefined) return 'text-base-content/40 border-base-content/20'
  if (score >= 8) return 'text-success border-success'
  if (score >= 6) return 'text-warning border-warning'
  return 'text-error border-error'
}

const getScoreBg = (score) => {
  if (score === null || score === undefined) return 'bg-base-content/10'
  if (score >= 8) return 'bg-success/10'
  if (score >= 6) return 'bg-warning/10'
  return 'bg-error/10'
}

const InterviewHistory = () => {
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const answersApi = () => axiosSecure.get('/api/behavioral-questions/answers')

  const applyAnswers = (res) => {
    if (res.data.success) {
      setAnswers(res.data.data || [])
    }
  }

  const handleError = (err) => {
    const msg = err?.response?.data?.message || 'Failed to load answer history'
    setError(msg)
    toast.error(msg)
  }

  useEffect(() => {
    let cancelled = false
    answersApi()
      .then(res => { if (!cancelled) applyAnswers(res) })
      .catch(err => { if (!cancelled) handleError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    answersApi()
      .then(applyAnswers)
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-base-content/10 rounded-xl w-48" />
          <div className="h-4 bg-base-content/10 rounded-xl w-64" />
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-base-content/10 bg-base-300 p-5 space-y-3">
              <div className="h-4 bg-base-content/10 rounded w-3/4" />
              <div className="h-3 bg-base-content/10 rounded w-1/3" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-base-content/10" />
                <div className="h-3 bg-base-content/10 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">Failed to Load History</h2>
          <p className="text-base-content/60 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (answers.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <Target className="w-16 h-16 text-base-content/30 mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">No Practice History Yet</h2>
          <p className="text-base-content/60 mb-2">
            Start practicing behavioral questions to see your answers here.
          </p>
          <p className="text-base-content/40 text-sm mb-6">
            Each answer will be evaluated with AI-powered STAR method feedback.
          </p>
          <button
            onClick={() => navigate('/dashboard/interview')}
            className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Start Practicing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
          <MessageSquareText className="w-6 h-6 text-primary" />
          Interview History
        </h1>
        <p className="text-base-content/60 text-sm mt-1">
          {answers.length} answer{answers.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      <div className="space-y-4">
        {answers.map((answer, index) => {
          const score = answer.ai_feedback?.structure_score
          const formattedDate = answer.answered_at
            ? new Date(answer.answered_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })
            : ''

          return (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => navigate(`/dashboard/interview/result/${answer.id}`, { state: { answer } })}
              className="rounded-xl border border-base-content/10 bg-base-300 p-5 hover:border-primary/30 hover:bg-base-200 transition cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${getScoreColor(score)} border-2 ${getScoreBg(score)}`}>
                  {score !== null && score !== undefined ? score : '—'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="rounded-lg bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 shrink-0">
                      {answer.category || 'General'}
                    </span>
                    {answer.ai_feedback?.star_adherence && (
                      <span className={`rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                        answer.ai_feedback.star_adherence === 'excellent' ? 'bg-success/10 text-success' :
                        answer.ai_feedback.star_adherence === 'good' ? 'bg-warning/10 text-warning' :
                        'bg-error/10 text-error'
                      }`}>
                        {answer.ai_feedback.star_adherence === 'excellent' ? 'Excellent' :
                         answer.ai_feedback.star_adherence === 'good' ? 'Good' : 'Needs Work'}
                      </span>
                    )}
                    {!answer.ai_feedback && (
                      <span className="rounded-lg bg-base-content/10 text-base-content/40 px-2.5 py-0.5 text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-base-content/80 truncate leading-relaxed">
                    {answer.question_text}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-base-content/40">
                    {formattedDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-base-content/20 group-hover:text-primary transition shrink-0 mt-1" />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/dashboard/interview')}
          className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          Continue Practicing
        </button>
      </div>
    </div>
  )
}

export default InterviewHistory
