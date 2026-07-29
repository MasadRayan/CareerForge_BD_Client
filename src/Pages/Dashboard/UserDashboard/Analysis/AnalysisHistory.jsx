import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { BarChart3, Loader2, Target, ArrowRight, FileText } from 'lucide-react'

const getScoreColor = (score) => {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-amber-500'
  return 'text-error'
}

const getScoreBg = (score) => {
  if (score >= 80) return 'bg-success/10'
  if (score >= 60) return 'bg-amber-500/10'
  return 'bg-error/10'
}

const getScoreLabel = (score) => {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Moderate'
  return 'Weak'
}

const AnalysisHistory = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.email) return
    axiosSecure
      .get('/api/analysis')
      .then((res) => {
        if (res.data.success) setAnalyses(res.data.data)
        else setError('Failed to load analyses')
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Failed to load analysis history'
        setError(msg)
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }, [user?.email, axiosSecure])

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-4">
        <div className="h-8 w-56 bg-base-content/10 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-base-content/10 rounded animate-pulse" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-base-content/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <BarChart3 className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
        <p className="text-base font-medium text-base-content/60 mb-2">Could not load analysis history</p>
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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-base-content">Analysis History</h1>
          <p className="text-sm text-base-content/60 mt-1">
            View all your past CV analyses and track your progress
          </p>
        </div>

        <AnimatePresence mode="wait">
          {analyses.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-base-content/10" />
                <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
                  {analyses.length} {analyses.length === 1 ? 'Analysis' : 'Analyses'}
                </span>
                <span className="h-px flex-1 bg-base-content/10" />
              </div>

              {analyses.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group flex items-center gap-4 rounded-xl border border-base-content/10 bg-base-300 p-4"
                >
                  {/* Score badge */}
                  <div
                    className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${getScoreBg(item.ats_score)}`}
                  >
                    <span className={`text-lg font-bold font-mono ${getScoreColor(item.ats_score)}`}>
                      {item.ats_score}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-base-content truncate">
                      {item.job_title || 'Untitled Analysis'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-base-content/40 mt-0.5">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">CV {item.cv_version ? `v${item.cv_version}` : ''}</span>
                      <span className="w-1 h-1 rounded-full bg-base-content/20 shrink-0" />
                      <span>{formatDate(item.created_at)}</span>
                      <span className="w-1 h-1 rounded-full bg-base-content/20 shrink-0" />
                      <span className={`font-medium ${getScoreColor(item.ats_score)}`}>
                        {getScoreLabel(item.ats_score)}
                      </span>
                    </div>
                  </div>

                  {/* View action */}
                  <button
                    onClick={() => navigate(`/dashboard/cvs/${item.cv_id}/analysis`, { state: { analysisId: item.id } })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-base-content/40 hover:text-primary hover:bg-primary/10 transition"
                  >
                    Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Target className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
              <p className="text-base font-medium text-base-content/60 mb-1">No analyses yet</p>
              <p className="text-xs text-base-content/40 mb-6">
                Run your first CV analysis to see results here
              </p>
              <button
                onClick={() => navigate('/dashboard/cvs')}
                className="rounded-xl bg-primary text-primary-content px-5 py-2 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2"
              >
                Go to CVs
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default AnalysisHistory
