import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Route, Plus, Trash2, Loader2,
  Clock, CalendarDays, ArrowRight,
  AlertCircle, X
} from 'lucide-react'

const STATUS_STYLES = {
  active: {
    badge: 'bg-success/10 text-success border-success/20',
    bar: 'bg-success',
  },
  completed: {
    badge: 'bg-base-content/5 text-base-content/40 border-base-content/10',
    bar: 'bg-base-content/20',
  },
  abandoned: {
    badge: 'bg-error/10 text-error border-error/20',
    bar: 'bg-error',
  },
}

const Roadmap = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [analyses, setAnalyses] = useState([])
  const [loadingAnalyses, setLoadingAnalyses] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState('')
  const [durationWeeks, setDurationWeeks] = useState('')

  const fetchRoadmaps = useCallback(async () => {
    if (!user?.email) return
    try {
      const res = await axiosSecure.get('/api/roadmap')
      if (res.data.success) setRoadmaps(res.data.data)
    } catch {
      toast.error('Failed to load roadmaps')
    } finally {
      setLoading(false)
    }
  }, [user?.email, axiosSecure])

  useEffect(() => { fetchRoadmaps() }, [fetchRoadmaps])

  const openCreateModal = async () => {
    setShowCreateModal(true)
    setLoadingAnalyses(true)
    setSelectedAnalysis('')
    setDurationWeeks('')
    try {
      const res = await axiosSecure.get('/api/analysis')
      if (res.data.success) setAnalyses(res.data.data)
    } catch {
      toast.error('Failed to load analyses')
    } finally {
      setLoadingAnalyses(false)
    }
  }

  const handleCreate = async () => {
    if (!selectedAnalysis) {
      toast.error('Please select an analysis')
      return
    }
    setCreating(true)
    try {
      const payload = { analysis_id: selectedAnalysis }
      if (durationWeeks) payload.duration_weeks = parseInt(durationWeeks, 10)

      const res = await axiosSecure.post('/api/roadmap', payload)
      if (res.data.success) {
        toast.success('Roadmap generated successfully')
        setShowCreateModal(false)
        fetchRoadmaps()
        navigate(`/dashboard/roadmaps/${res.data.data.id}`)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to generate roadmap'
      toast.error(msg)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this roadmap?')) return
    setDeleting(id)
    try {
      const res = await axiosSecure.delete(`/api/roadmap/${id}`)
      if (res.data.success) {
        toast.success('Roadmap deleted')
        setRoadmaps((prev) => prev.filter((r) => r.id !== id))
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-4">
        <div className="h-8 w-52 bg-base-content/10 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-base-content/10 rounded animate-pulse" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-base-content/10 rounded-xl animate-pulse" />
          ))}
        </div>
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">My Roadmaps</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Track your learning journey week by week
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-primary text-primary-content px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            New Roadmap
          </button>
        </div>

        {/* ── Roadmap list ── */}
        <AnimatePresence mode="wait">
          {roadmaps.length > 0 ? (
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
                  {roadmaps.length} {roadmaps.length === 1 ? 'Roadmap' : 'Roadmaps'}
                </span>
                <span className="h-px flex-1 bg-base-content/10" />
              </div>

              {roadmaps.map((roadmap, i) => {
                const style = STATUS_STYLES[roadmap.status] || STATUS_STYLES.active
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative flex items-center gap-4 rounded-xl border border-base-content/10 bg-base-300 p-4 overflow-hidden"
                  >
                    {/* Status route bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`}
                    />

                    {/* Icon */}
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Route className="w-5 h-5 text-primary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-base-content">
                          {roadmap.duration_weeks}-Week Plan
                        </span>
                        <span
                          className={`text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border ${style.badge}`}
                        >
                          {roadmap.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-base-content/40 mt-1.5">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                          {formatDate(roadmap.created_at)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-base-content/20 shrink-0" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          {roadmap.duration_weeks} weeks
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/roadmaps/${roadmap.id}`)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-base-content/40 hover:text-primary hover:bg-primary/10 transition"
                      >
                        View
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(roadmap.id)}
                        disabled={deleting === roadmap.id}
                        className="p-2 rounded-lg text-base-content/40 hover:text-error hover:bg-error/10 transition disabled:opacity-30"
                        title="Delete roadmap"
                      >
                        {deleting === roadmap.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
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
              <Route className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
              <p className="text-base font-medium text-base-content/60 mb-1">
                No roadmaps yet
              </p>
              <p className="text-xs text-base-content/40 mb-6">
                Generate a roadmap from one of your CV analyses to start your
                learning journey
              </p>
              <button
                onClick={openCreateModal}
                className="rounded-xl bg-primary text-primary-content px-5 py-2 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Roadmap
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Create Modal ── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={() => !creating && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-base-content/10 bg-base-300 p-6 shadow-xl"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-base-content">
                    Generate Roadmap
                  </h2>
                  <p className="text-sm text-base-content/60 mt-1">
                    Select an analysis to build your learning plan
                  </p>
                </div>
                <button
                  onClick={() => !creating && setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingAnalyses ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : analyses.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-10 h-10 mx-auto text-base-content/20 mb-3" />
                  <p className="text-sm font-medium text-base-content/60">
                    No analyses found
                  </p>
                  <p className="text-xs text-base-content/40 mt-1 mb-5">
                    Run a CV analysis first to generate a roadmap
                  </p>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      navigate('/dashboard/cvs')
                    }}
                    className="rounded-xl bg-primary text-primary-content px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                  >
                    Go to CVs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Analysis selector */}
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-2">
                      Analysis
                    </label>
                    <select
                      value={selectedAnalysis}
                      onChange={(e) => setSelectedAnalysis(e.target.value)}
                      className="w-full rounded-xl border border-base-content/20 bg-base-200 px-3 py-2.5 text-sm text-base-content outline-none focus:border-primary transition"
                    >
                      <option value="">Select an analysis...</option>
                      {analyses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.job_title || 'Untitled'}
                          {a.ats_score != null ? ` — Score: ${a.ats_score}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-2">
                      Duration{' '}
                      <span className="font-normal normal-case tracking-normal text-base-content/30">
                        (optional — computed from interview date)
                      </span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                      placeholder="e.g. 8"
                      className="w-full rounded-xl border border-base-content/20 bg-base-200 px-3 py-2.5 text-sm text-base-content outline-none placeholder:text-base-content/20 focus:border-primary transition"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleCreate}
                    disabled={creating || !selectedAnalysis}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-content px-4 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-40 mt-6"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Route className="w-4 h-4" />
                        Generate Roadmap
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Roadmap
