import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import {
  Loader2, ChevronLeft, MessageSquareText, Star, Lightbulb,
  CheckCircle2, AlertCircle, Clock, Brain
} from 'lucide-react'

const getScoreColor = (score) => {
  if (score === null || score === undefined) return 'text-base-content/40 border-base-content/20'
  if (score >= 8) return 'text-success border-success bg-success/10'
  if (score >= 6) return 'text-warning border-warning bg-warning/10'
  return 'text-error border-error bg-error/10'
}

const getStarBadgeClass = (adherence) => {
  if (adherence === 'excellent') return 'bg-success/10 text-success'
  if (adherence === 'good') return 'bg-warning/10 text-warning'
  return 'bg-error/10 text-error'
}

const getStarLabel = (adherence) => {
  if (adherence === 'excellent') return 'Excellent'
  if (adherence === 'good') return 'Good'
  return 'Needs Improvement'
}

const InterviewResult = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [answer, setAnswer] = useState(location.state?.answer || null)
  const [loading, setLoading] = useState(!answer)
  const [error, setError] = useState(null)

  const answersApi = () => axiosSecure.get('/api/behavioral-questions/answers')

  const handleAnswerResult = (res) => {
    if (!res.data.success) return
    const found = (res.data.data || []).find(a => a.id === id)
    if (found) {
      setAnswer(found)
    } else {
      setError('Answer not found.')
      toast.error('Answer not found.')
    }
  }

  const handleError = (err) => {
    const msg = err?.response?.data?.message || 'Failed to load answer'
    setError(msg)
    toast.error(msg)
  }

  useEffect(() => {
    if (answer) return
    let cancelled = false
    answersApi()
      .then(res => { if (!cancelled) handleAnswerResult(res) })
      .catch(err => { if (!cancelled) handleError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !answer) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">Answer Not Found</h2>
          <p className="text-base-content/60 mb-6">{error || 'The requested answer could not be found.'}</p>
          <button
            onClick={() => navigate('/dashboard/interview/history')}
            className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to History
          </button>
        </div>
      </div>
    )
  }

  const feedback = answer.ai_feedback
  const formattedDate = answer.answered_at
    ? new Date(answer.answered_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : ''

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate('/dashboard/interview/history')}
        className="flex items-center gap-1 text-sm text-primary hover:underline mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to History
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        <div className="rounded-xl border border-base-content/10 bg-base-300 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-lg bg-primary/10 text-primary text-xs font-medium px-3 py-1">
              {answer.category || 'General'}
            </span>
            {formattedDate && (
              <span className="text-xs text-base-content/40 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formattedDate}
              </span>
            )}
          </div>

          <h1 className="text-lg font-semibold text-base-content leading-relaxed">
            {answer.question_text}
          </h1>
        </div>

        <div className="rounded-xl border border-base-content/10 bg-base-300 p-6">
          <h2 className="text-sm font-medium text-base-content/60 mb-3 flex items-center gap-2">
            <MessageSquareText className="w-4 h-4" />
            Your Answer
          </h2>
          <div className="rounded-xl border border-base-content/10 bg-base-200 p-4 text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">
            {answer.answer_text || 'No answer text available.'}
          </div>
        </div>

        {feedback ? (
          <>
            <div className="rounded-xl border border-base-content/10 bg-base-300 p-6">
              <h2 className="text-sm font-medium text-base-content/60 mb-4">AI Feedback</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreColor(feedback.structure_score)} border-[3px]`}>
                  {feedback.structure_score}
                </div>
                <div>
                  <div className="text-base font-medium text-base-content">Structure Score</div>
                  <div className="text-sm text-base-content/60">Out of 10</div>
                  <div className="text-xs text-base-content/40 mt-1">
                    {feedback.structure_score >= 8 ? 'Well-structured answer' :
                     feedback.structure_score >= 6 ? 'Adequate structure, room for improvement' :
                     'Needs more structure'}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-base-content/60 mb-2">STAR Adherence</h3>
                <span className={`inline-block rounded-lg px-3 py-1 text-xs font-medium ${getStarBadgeClass(feedback.star_adherence)}`}>
                  {getStarLabel(feedback.star_adherence)}
                </span>
              </div>

              {feedback.strengths?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-base-content/60 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feedback.strengths.map((s, i) => (
                      <span key={i} className="rounded-lg bg-success/10 text-success text-xs px-3 py-1.5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {feedback.suggestions?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-base-content/60 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    Suggestions for Improvement
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {feedback.suggestions.map((s, i) => (
                      <span key={i} className="rounded-lg bg-warning/10 text-warning text-xs px-3 py-1.5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {feedback.improved_example && (
                <div>
                  <h3 className="text-sm font-medium text-base-content/60 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Improved Example
                  </h3>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">
                    {feedback.improved_example}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-base-content/10 bg-base-300 p-6 text-center">
            <Loader2 className="w-8 h-8 text-base-content/30 animate-spin mx-auto mb-3" />
            <p className="text-sm text-base-content/60">
              AI feedback is being generated. Please check back later.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => navigate('/dashboard/interview')}
            className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Practice More
          </button>
          <button
            onClick={() => navigate('/dashboard/interview/history')}
            className="rounded-xl border border-base-content/20 text-base-content px-6 py-2.5 text-sm font-medium hover:bg-base-300 transition flex items-center gap-2"
          >
            <MessageSquareText className="w-4 h-4" />
            All Answers
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default InterviewResult
