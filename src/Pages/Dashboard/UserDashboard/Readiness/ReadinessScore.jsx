import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import {
  Loader2, RefreshCw, AlertCircle, Target, FileText,
  Map, MessageSquareText, TrendingUp, TrendingDown,
  Minus, ChevronDown, ChevronUp, Brain, CalendarDays
} from 'lucide-react'

const getScoreColor = (score) => {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-error'
}

const getScoreBg = (score) => {
  if (score >= 80) return 'bg-success/10 border-success'
  if (score >= 60) return 'bg-warning/10 border-warning'
  return 'bg-error/10 border-error'
}

const getScoreRing = (score) => {
  if (score >= 80) return 'stroke-success'
  if (score >= 60) return 'stroke-warning'
  return 'stroke-error'
}

const getScoreBadge = (score) => {
  if (score >= 80) return { bg: 'bg-success/10 text-success', label: 'Ready for Interview' }
  if (score >= 60) return { bg: 'bg-warning/10 text-warning', label: 'Getting There' }
  return { bg: 'bg-error/10 text-error', label: 'Needs Work' }
}

const getScoreInfo = (score) => {
  if (score >= 80) return {
    label: 'Ready for Interview',
    description: 'Your profile is well-prepared across all areas. You\'re ready to start interviewing with confidence.',
    emoji: 'high'
  }
  if (score >= 60) return {
    label: 'Getting There',
    description: 'Good progress! Keep working on the remaining areas to boost your overall readiness.',
    emoji: 'medium'
  }
  return {
    label: 'Needs Work',
    description: 'Focus on completing CV analysis, roadmap tasks, and interview practice to improve your score.',
    emoji: 'low'
  }
}

const ScoreRing = ({ score, size = 160 }) => {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-base-content/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getScoreRing(score)} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold font-mono ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-[10px] text-base-content/40 mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

const TrendIcon = ({ current, previous }) => {
  if (!previous || previous === 0) return null
  if (current > previous) return <TrendingUp className="w-4 h-4 text-success" />
  if (current < previous) return <TrendingDown className="w-4 h-4 text-error" />
  return <Minus className="w-4 h-4 text-base-content/40" />
}

const ReadinessScore = () => {
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [score, setScore] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [expandedSub, setExpandedSub] = useState(false)

  const scoreApi = () => axiosSecure.get('/api/readiness-score')
  const historyApi = () => axiosSecure.get('/api/readiness-score/history')

  const applyScore = (res) => {
    if (res.data.success) {
      setScore(res.data.data)
    }
  }

  const applyHistory = (res) => {
    if (res.data.success) {
      setHistory(res.data.data || [])
    }
  }

  const handleError = (err) => {
    const msg = err?.response?.data?.message || 'Failed to load readiness score'
    setError(msg)
    toast.error(msg)
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([scoreApi(), historyApi()])
      .then(([scoreRes, historyRes]) => {
        if (cancelled) return
        applyScore(scoreRes)
        applyHistory(historyRes)
      })
      .catch(err => { if (!cancelled) handleError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    setRefreshing(true)
    setError(null)
    Promise.all([scoreApi(), historyApi()])
      .then(([scoreRes, historyRes]) => {
        applyScore(scoreRes)
        applyHistory(historyRes)
        toast.success('Score recalculated!')
      })
      .catch(err => {
        const msg = err?.response?.data?.message || 'Failed to recalculate'
        toast.error(msg)
      })
      .finally(() => setRefreshing(false))
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-base-content/10 rounded-xl w-48" />
          <div className="flex items-center gap-8">
            <div className="w-40 h-40 rounded-full bg-base-content/10" />
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-base-content/10 rounded-xl w-40" />
              <div className="h-4 bg-base-content/10 rounded-xl w-64" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-base-content/10 bg-base-300 p-5 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-base-content/10" />
                <div className="h-6 bg-base-content/10 rounded w-16" />
                <div className="h-2 bg-base-content/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && !score) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">Failed to Load Score</h2>
          <p className="text-base-content/60 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const s = score || {}
  const composite = s.composite_score ?? 0
  const atsScore = s.ats_component ?? 0
  const roadmapScore = s.roadmap_component ?? 0
  const interviewScore = s.interview_component ?? 0
  const subScores = s.sub_scores || {}
  const scoreInfo = getScoreInfo(composite)
  const badge = getScoreBadge(composite)

  const formattedDate = s.calculated_at
    ? new Date(s.calculated_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : null

  const hasNoData = composite === 0 && atsScore === 0 && roadmapScore === 0 && interviewScore === 0

  const componentCards = [
    {
      icon: FileText,
      label: 'ATS Analysis',
      score: atsScore,
      href: '/dashboard/analyses',
      hint: 'Upload and analyze your CV against job descriptions.'
    },
    {
      icon: Map,
      label: 'Roadmap Progress',
      score: roadmapScore,
      href: '/dashboard/roadmaps',
      hint: 'Follow your personalized learning roadmap.'
    },
    {
      icon: MessageSquareText,
      label: 'Interview Prep',
      score: interviewScore,
      subScores: [
        { label: 'Quiz Accuracy', value: subScores.quiz_accuracy },
        { label: 'Behavioral Score', value: subScores.behavioral_score }
      ],
      onClickSub: () => setExpandedSub(!expandedSub),
      expanded: expandedSub,
      href: '/dashboard/interview',
      hint: 'Practice behavioral questions and take quizzes.'
    }
  ]

  const getTrend = (idx) => {
    if (idx === history.length - 1) return null
    return {
      current: history[idx].composite_score,
      previous: history[idx + 1].composite_score
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Readiness Score
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Your overall job readiness calculated from CV analysis, roadmap progress, and interview preparation
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-xl border border-base-content/20 text-base-content px-4 py-2.5 text-sm font-medium hover:bg-base-300 transition disabled:opacity-50 flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Recalculate
        </button>
      </div>

      {hasNoData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-base-content/10 bg-base-300 p-12 text-center"
        >
          <Target className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">No Readiness Data Yet</h2>
          <p className="text-base-content/60 mb-2 max-w-md mx-auto">
            Your readiness score is calculated from three areas. Complete each one to see your score.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => navigate('/dashboard/analyses')}
              className="rounded-xl bg-primary text-primary-content px-5 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Analyze Your CV
            </button>
            <button
              onClick={() => navigate('/dashboard/roadmaps')}
              className="rounded-xl border border-base-content/20 text-base-content px-5 py-2.5 text-sm font-medium hover:bg-base-300 transition flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              Start a Roadmap
            </button>
            <button
              onClick={() => navigate('/dashboard/interview')}
              className="rounded-xl border border-base-content/20 text-base-content px-5 py-2.5 text-sm font-medium hover:bg-base-300 transition flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4" />
              Practice Interviews
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-base-content/10 bg-base-300 p-8 mb-8"
          >
            <div className="flex items-center gap-8 flex-wrap">
              <ScoreRing score={composite} />

              <div className="flex-1 min-w-[200px]">
                <span className={`inline-block rounded-lg px-3 py-1 text-xs font-medium mb-3 ${badge.bg}`}>
                  {badge.label}
                </span>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {scoreInfo.description}
                </p>
                {formattedDate && (
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-base-content/40">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Last calculated: {formattedDate}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {componentCards.map((card, i) => {
              const color = getScoreColor(card.score)
              const barColor = card.score >= 80 ? 'bg-success' : card.score >= 60 ? 'bg-warning' : 'bg-error'

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="rounded-xl border border-base-content/10 bg-base-300 p-5"
                >
                  <div
                    onClick={() => navigate(card.href)}
                    className="flex items-center gap-3 mb-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center group-hover:bg-primary/10 transition">
                      <card.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-base-content group-hover:text-primary transition">
                      {card.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl font-bold font-mono ${color}`}>{card.score}</span>
                    <span className="text-xs text-base-content/40">/ 100</span>
                  </div>

                  <div className="w-full bg-base-200 rounded-full h-2.5 mb-3">
                    <div
                      className={`${barColor} h-2.5 rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${card.score}%` }}
                    />
                  </div>

                  {card.score === 0 && (
                    <p className="text-xs text-base-content/40 leading-relaxed">{card.hint}</p>
                  )}

                  {card.subScores && (
                    <div className="mt-3 pt-3 border-t border-base-content/10">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedSub(!expandedSub) }}
                        className="flex items-center gap-1 text-xs text-base-content/50 hover:text-base-content transition mb-2"
                      >
                        {expandedSub ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        Sub-scores
                      </button>

                      {expandedSub && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-1.5"
                        >
                          {card.subScores.map((sub, si) => (
                            <div key={si} className="flex items-center justify-between text-xs">
                              <span className="text-base-content/60">{sub.label}</span>
                              {sub.value !== null && sub.value !== undefined ? (
                                <span className={`font-mono font-medium ${getScoreColor(sub.value)}`}>
                                  {sub.value}
                                </span>
                              ) : (
                                <span className="text-base-content/30">N/A</span>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-xl border border-base-content/10 bg-base-300 p-6"
            >
              <h2 className="text-base font-semibold text-base-content mb-4">Score History</h2>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {history.map((record, idx) => {
                  const trend = getTrend(idx)
                  const date = record.calculated_at
                    ? new Date(record.calculated_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                      })
                    : ''
                  const bgColor = getScoreBg(record.composite_score)

                  return (
                    <div key={record.id || idx} className="flex flex-col items-center shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-mono border-2 ${bgColor}`}>
                        {record.composite_score}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-xs text-base-content/60">{date}</span>
                        {trend && (
                          <TrendIcon current={trend.current} previous={trend.previous} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

export default ReadinessScore
