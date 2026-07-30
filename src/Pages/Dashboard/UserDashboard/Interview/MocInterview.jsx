import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import {
  Loader2, Brain, Lightbulb, Star, ChevronLeft, ChevronRight,
  RefreshCw, MessageSquareText, Sparkles, AlertCircle, Filter,
  CheckCircle2
} from 'lucide-react'

const CATEGORIES = [
  'Teamwork', 'Leadership', 'Problem Solving', 'Communication',
  'Conflict Resolution', 'Adaptability', 'Time Management',
  'Creativity', 'Decision Making', 'Customer Service'
]

const getScoreColor = (score) => {
  if (score >= 8) return 'text-success border-success bg-success/10'
  if (score >= 6) return 'text-warning border-warning bg-warning/10'
  return 'text-error border-error bg-error/10'
}

const getStarBadge = (adherence) => {
  if (adherence === 'excellent') return { bg: 'bg-success/10', text: 'text-success', label: 'Excellent' }
  if (adherence === 'good') return { bg: 'bg-warning/10', text: 'text-warning', label: 'Good' }
  return { bg: 'bg-error/10', text: 'text-error', label: 'Needs Improvement' }
}

const MocInterview = () => {
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [pagination, setPagination] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fetchingMore, setFetchingMore] = useState(false)
  const [error, setError] = useState(null)
  const [answeredMap, setAnsweredMap] = useState({})

  const currentQuestion = questions[currentIndex]
  const isAnswered = currentQuestion ? !!answeredMap[currentQuestion.id] : false
  const feedback = isAnswered ? answeredMap[currentQuestion.id] : null
  const totalDisplayed = questions.length
  const totalAnswered = Object.keys(answeredMap).length
  const allDone = totalDisplayed > 0 && totalAnswered >= totalDisplayed && !pagination?.hasNextPage

  const questionApi = (category, page = 1) => {
    const params = { page, limit: 10 }
    if (category) params.category = category
    return axiosSecure.get('/api/behavioral-questions', { params })
  }

  const applyQuestionData = (res) => {
    if (!res.data.success) return
    const fetched = res.data.data.questions
    setQuestions(fetched)
    setPagination(res.data.data.pagination)
    setCurrentIndex(0)
    setAnsweredMap({})
    setAnswerText('')
    const cats = [...new Set(fetched.map(q => q.category).filter(Boolean))]
    setCategories(prev => {
      const merged = new Set([...prev, ...cats])
      return [...merged]
    })
  }

  useEffect(() => {
    let cancelled = false
    questionApi(selectedCategory)
      .then(res => { if (!cancelled) applyQuestionData(res) })
      .catch(err => {
        if (cancelled) return
        const msg = err?.response?.data?.message || 'Failed to load questions'
        setError(msg)
        toast.error(msg)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [selectedCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryChange = (e) => {
    const cat = e.target.value
    setSelectedCategory(cat)
    setLoading(true)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      toast.error('Please write an answer before submitting')
      return
    }
    if (answerText.length > 5000) {
      toast.error('Answer is too long (max 5000 characters)')
      return
    }
    if (!currentQuestion) return

    setSubmitting(true)
    try {
      const res = await axiosSecure.post(
        `/api/behavioral-questions/${currentQuestion.id}/answer`,
        { answer_text: answerText.trim() }
      )
      if (res.data.success) {
        const aiFeedback = res.data.data.ai_feedback || {
          structure_score: 0,
          star_adherence: 'needs_improvement',
          strengths: [],
          suggestions: [],
          improved_example: ''
        }
        setAnsweredMap(prev => ({
          ...prev,
          [currentQuestion.id]: {
            answer_text: res.data.data.answer_text || answerText.trim(),
            ...aiFeedback
          }
        }))
        setAnswerText('')
        toast.success('Answer submitted! Check your feedback below.')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit answer'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const navigateToQuestion = (index) => {
    setCurrentIndex(index)
    setAnswerText('')
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigateToQuestion(currentIndex - 1)
    }
  }

  const handleLoadMore = async () => {
    if (!pagination?.hasNextPage) return
    setFetchingMore(true)
    try {
      const nextPage = pagination.currentPage + 1
      const params = { page: nextPage, limit: 10 }
      if (selectedCategory) params.category = selectedCategory
      const res = await axiosSecure.get('/api/behavioral-questions', { params })
      if (res.data.success) {
        setQuestions(prev => [...prev, ...res.data.data.questions])
        setPagination(res.data.data.pagination)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load more questions')
    } finally {
      setFetchingMore(false)
    }
  }

  const handleReset = () => {
    setSelectedCategory('')
    setAnswerText('')
    setAnsweredMap({})
    setCurrentIndex(0)
    setLoading(true)
    setError(null)
    questionApi('', 1)
      .then(applyQuestionData)
      .catch(err => {
        const msg = err?.response?.data?.message || 'Failed to load questions'
        setError(msg)
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-base-content/10 rounded-xl w-48" />
          <div className="h-4 bg-base-content/10 rounded-xl w-64" />
          <div className="rounded-xl border border-base-content/10 bg-base-300 p-6 space-y-4">
            <div className="h-4 bg-base-content/10 rounded w-3/4" />
            <div className="h-4 bg-base-content/10 rounded w-1/2" />
            <div className="h-32 bg-base-content/10 rounded-xl" />
            <div className="h-10 bg-base-content/10 rounded-xl w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">Failed to Load Questions</h2>
          <p className="text-base-content/60 mb-6">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              questionApi(selectedCategory)
                .then(applyQuestionData)
                .catch(err => {
                  const msg = err?.response?.data?.message || 'Failed to load questions'
                  setError(msg)
                  toast.error(msg)
                })
                .finally(() => setLoading(false))
            }}
            className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <Brain className="w-16 h-16 text-base-content/30 mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">No Questions Found</h2>
          <p className="text-base-content/60 mb-2">
            {selectedCategory
              ? `No questions available for "${selectedCategory}" category.`
              : 'No interview questions are available right now.'}
          </p>
          <p className="text-base-content/40 text-sm mb-6">Try a different category or check back later.</p>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Show All Categories
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Mock Interview
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Practice behavioral questions with AI-powered feedback
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/interview/history')}
            className="rounded-xl border border-base-content/20 text-base-content px-4 py-2 text-sm font-medium hover:bg-base-300 transition flex items-center gap-2"
          >
            <MessageSquareText className="w-4 h-4" />
            History
          </button>
          <button
            onClick={handleReset}
            className="rounded-xl border border-base-content/20 text-base-content px-4 py-2 text-sm font-medium hover:bg-base-300 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-base-content/40" />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="select select-bordered bg-base-300 text-base-content rounded-xl border border-base-content/10 px-4 py-2 text-sm focus:outline-none focus:border-primary"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          {categories.filter(c => !CATEGORIES.includes(c)).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm text-base-content/60">
        <span>
          Question {currentIndex + 1} of {totalDisplayed}
          {pagination?.totalItems > totalDisplayed && ` (${pagination.totalItems} total)`}
        </span>
        <span>{totalAnswered} answered</span>
      </div>

      <div className="w-full bg-base-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${totalDisplayed > 0 ? (totalAnswered / totalDisplayed) * 100 : 0}%` }}
        />
      </div>

      {allDone ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-base-content/10 bg-base-300 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-semibold text-base-content mb-2">All Questions Answered!</h2>
          <p className="text-base-content/60 mb-2">
            You have completed all {totalAnswered} questions
            {selectedCategory && ` in "${selectedCategory}"`}.
          </p>
          <p className="text-base-content/40 text-sm mb-6">
            Review your answers in the history tab or practice with a different category.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard/interview/history')}
              className="rounded-xl border border-base-content/20 text-base-content px-6 py-2.5 text-sm font-medium hover:bg-base-300 transition flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4" />
              View History
            </button>
            <button
              onClick={handleReset}
              className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Practice Again
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={`${currentQuestion.id}-${isAnswered ? 'feedback' : 'answering'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-base-content/10 bg-base-300 p-6"
              >
                <span className="inline-block rounded-lg bg-primary/10 text-primary text-xs font-medium px-3 py-1 mb-4">
                  {currentQuestion.category || 'General'}
                </span>

                <h2 className="text-lg font-semibold text-base-content mb-6 leading-relaxed">
                  {currentQuestion.question_text}
                </h2>

                {!isAnswered ? (
                  <>
                    <div className="rounded-lg bg-info/10 text-info text-xs p-3 mb-4 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>
                        Use the <strong>STAR method</strong> (Situation, Task, Action, Result) to structure your answer.
                      </span>
                    </div>

                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={6}
                      maxLength={5000}
                      className="w-full rounded-xl border border-base-content/10 bg-base-200 text-base-content p-4 text-sm focus:outline-none focus:border-primary transition resize-y min-h-40 placeholder:text-base-content/30"
                      disabled={submitting}
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-base-content/40">
                      <span>{answerText.length}/5000 characters</span>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={handleSubmit}
                        disabled={submitting || !answerText.trim()}
                        className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Submit Answer
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : feedback && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-base-content/60 mb-2">Your Answer</h3>
                      <div className="rounded-xl border border-base-content/10 bg-base-200 p-4 text-sm text-base-content/80 whitespace-pre-wrap">
                        {feedback.answer_text || 'Answer not available'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${getScoreColor(feedback.structure_score)} border-2`}>
                        {feedback.structure_score}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-base-content">Structure Score</div>
                        <div className="text-xs text-base-content/60">Out of 10</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-base-content/60 mb-2">STAR Adherence</h3>
                      <span className={`inline-block rounded-lg px-3 py-1 text-xs font-medium ${getStarBadge(feedback.star_adherence).bg} ${getStarBadge(feedback.star_adherence).text}`}>
                        {getStarBadge(feedback.star_adherence).label}
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
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-base-content/60 mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary" />
                          Improved Example
                        </h3>
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-base-content/80 whitespace-pre-wrap leading-relaxed">
                          {feedback.improved_example}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="rounded-xl border border-base-content/20 text-base-content px-4 py-2 text-sm font-medium hover:bg-base-300 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {pagination?.hasNextPage && currentIndex === questions.length - 1 && isAnswered && (
                <button
                  onClick={handleLoadMore}
                  disabled={fetchingMore}
                  className="rounded-xl border border-base-content/20 text-base-content px-4 py-2 text-sm font-medium hover:bg-base-300 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {fetchingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Load More
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={currentIndex >= questions.length - 1 && !pagination?.hasNextPage}
                className="rounded-xl bg-primary text-primary-content px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MocInterview
