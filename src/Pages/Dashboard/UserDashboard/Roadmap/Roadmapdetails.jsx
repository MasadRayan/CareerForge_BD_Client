import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Route, ChevronLeft, Loader2, CalendarDays, Clock,
  CheckCircle2, Circle, ExternalLink, Play, FileText,
  BookOpen, GraduationCap, Trash2, CheckCheck, X,
  AlertCircle
} from 'lucide-react'

const STATUS_STYLES = {
  active: 'bg-success/10 text-success border-success/20',
  completed: 'bg-base-content/5 text-base-content/40 border-base-content/10',
  abandoned: 'bg-error/10 text-error border-error/20',
}

const RESOURCE_ICONS = {
  video: Play,
  article: FileText,
  docs: BookOpen,
  course: GraduationCap,
}

const STATUS_ACTIONS = [
  { label: 'Mark Complete', status: 'completed', icon: CheckCheck },
  { label: 'Abandon', status: 'abandoned', icon: X },
]

const Roadmapdetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [togglingTask, setTogglingTask] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchRoadmap = useCallback(async () => {
    if (!user?.email || !id) return
    try {
      const res = await axiosSecure.get(`/api/roadmap/${id}`)
      if (res.data.success) setRoadmap(res.data.data)
      else setError('Roadmap not found')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load roadmap'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [user?.email, id, axiosSecure])

  useEffect(() => { fetchRoadmap() }, [fetchRoadmap])

  const handleToggleTask = async (taskId) => {
    setTogglingTask(taskId)

    // Optimistic update — flip locally, no re-fetch
    setRoadmap((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        weeks: prev.weeks.map((week) => ({
          ...week,
          dailyTasks: week.dailyTasks?.map((task) =>
            task.id === taskId
              ? { ...task, is_completed: true, completed_at: new Date().toISOString() }
              : task,
          ),
        })),
      }
    })

    try {
      await axiosSecure.patch(`/api/roadmap/${id}/tasks/${taskId}`)
      toast.success('Task completed!')
    } catch (err) {
      // Revert on failure
      setRoadmap((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          weeks: prev.weeks.map((week) => ({
            ...week,
            dailyTasks: week.dailyTasks?.map((task) =>
              task.id === taskId
                ? { ...task, is_completed: false, completed_at: null }
                : task,
            ),
          })),
        }
      })
      toast.error(err?.response?.data?.message || 'Failed to update task')
    } finally {
      setTogglingTask(null)
    }
  }

  const handleStatusUpdate = async (status) => {
    setUpdatingStatus(true)

    // Save IDs of incomplete tasks for potential revert
    const newlyCompletedTaskIds =
      status === 'completed'
        ? (roadmap?.weeks?.flatMap((w) =>
            w.dailyTasks?.filter((t) => !t.is_completed).map((t) => t.id),
          ) ?? [])
        : []

    // Optimistic update
    if (status === 'completed') {
      setRoadmap((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          status: 'completed',
          weeks: prev.weeks.map((week) => ({
            ...week,
            dailyTasks: week.dailyTasks?.map((task) =>
              task.is_completed
                ? task
                : { ...task, is_completed: true, completed_at: new Date().toISOString() },
            ),
          })),
        }
      })
    } else {
      setRoadmap((prev) => {
        if (!prev) return prev
        return { ...prev, status }
      })
    }

    try {
      await axiosSecure.patch(`/api/roadmap/${id}`, { status })
      toast.success(`Roadmap marked as ${status}`)
    } catch (err) {
      // Revert on failure
      if (status === 'completed') {
        setRoadmap((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            status: 'active',
            weeks: prev.weeks.map((week) => ({
              ...week,
              dailyTasks: week.dailyTasks?.map((task) =>
                newlyCompletedTaskIds.includes(task.id)
                  ? { ...task, is_completed: false, completed_at: null }
                  : task,
              ),
            })),
          }
        })
      } else {
        setRoadmap((prev) => {
          if (!prev) return prev
          return { ...prev, status: 'active' }
        })
      }
      toast.error(err?.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this roadmap?')) return
    try {
      const res = await axiosSecure.delete(`/api/roadmap/${id}`)
      if (res.data.success) {
        toast.success('Roadmap deleted')
        navigate('/dashboard/roadmaps')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed')
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  // ── Computed progress ──
  const weeks = roadmap?.weeks ?? []
  const totalTasks = weeks.reduce(
    (sum, w) => sum + (w.dailyTasks?.length ?? 0),
    0,
  )
  const completedTasks = weeks.reduce(
    (sum, w) =>
      sum + (w.dailyTasks?.filter((t) => t.is_completed)?.length ?? 0),
    0,
  )
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Weeks where every task is done
  const completedWeeks = weeks.filter(
    (w) => w.dailyTasks?.length > 0 && w.dailyTasks.every((t) => t.is_completed),
  ).length

  // First week with incomplete tasks = "current"
  const currentWeekIndex = weeks.findIndex(
    (w) => !w.dailyTasks?.every((t) => t.is_completed),
  )

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Back */}
        <div className="h-8 w-24 bg-base-content/10 rounded-lg animate-pulse" />

        {/* Header skeleton */}
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-base-content/10 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-base-content/10 rounded animate-pulse" />
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full bg-base-content/10 rounded-full animate-pulse" />
          {/* Timeline dots */}
          <div className="flex gap-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-1 bg-base-content/10 rounded animate-pulse" />
                <div className="w-5 h-5 rounded-full bg-base-content/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Week card skeletons */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-base-content/10 bg-base-300 overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-base-content/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-base-content/10 animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-base-content/10 rounded animate-pulse" />
                <div className="h-3 w-56 bg-base-content/10 rounded animate-pulse" />
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-7 w-24 bg-base-content/10 rounded-lg animate-pulse" />
                <div className="h-7 w-28 bg-base-content/10 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-1.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="h-9 bg-base-content/10 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Error / not found ──
  if (error || !roadmap) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
        <p className="text-base font-medium text-base-content/60 mb-2">
          Could not load roadmap
        </p>
        <p className="text-xs text-base-content/40 mb-6">
          {error || 'Roadmap not found'}
        </p>
        <button
          onClick={() => navigate('/dashboard/roadmaps')}
          className="rounded-xl bg-primary text-primary-content px-5 py-2 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Roadmaps
        </button>
      </div>
    )
  }

  // ── Full week card ──
  const WeekCard = ({ week, weekIndex }) => {
    const isCurrent = weekIndex === currentWeekIndex
    const weekCompleted =
      week.dailyTasks?.length > 0 &&
      week.dailyTasks.every((t) => t.is_completed)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: weekIndex * 0.06, duration: 0.35 }}
        className="rounded-xl border border-base-content/10 bg-base-300 overflow-hidden"
      >
        {/* Week header */}
        <div
          className={`px-5 py-3.5 flex items-center gap-3 border-b border-base-content/10 ${
            weekCompleted ? 'bg-primary/5' : ''
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              weekCompleted
                ? 'bg-primary text-primary-content'
                : isCurrent
                  ? 'bg-primary/20 text-primary'
                  : 'bg-base-content/10 text-base-content/50'
            }`}
          >
            {weekCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              week.week_number
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-base-content">
              Week {week.week_number}
            </h3>
            <p className="text-xs text-base-content/50 mt-0.5 truncate">
              {week.topic_summary}
            </p>
          </div>
          {week.start_date && (
            <span className="text-[10px] text-base-content/30 font-mono whitespace-nowrap shrink-0">
              {formatDate(week.start_date)}
            </span>
          )}
        </div>

        {/* Week body */}
        <div className="p-5 space-y-5">
          {/* Resources */}
          {week.resources?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-base-content/30 uppercase mb-2">
                Resources
              </p>
              <div className="flex flex-wrap gap-2">
                {week.resources.map((res) => {
                  const Icon = RESOURCE_ICONS[res.type] || FileText
                  return (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-base-content/10 bg-base-200 text-xs text-base-content/60 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="max-w-[180px] truncate">
                        {res.title}
                      </span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-0 -ml-1.5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Daily tasks */}
          {week.dailyTasks?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-base-content/30 uppercase mb-2">
                Daily Tasks
              </p>
              <div className="space-y-1">
                {week.dailyTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      if (!task.is_completed) handleToggleTask(task.id)
                    }}
                    disabled={task.is_completed || togglingTask === task.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition bg-base-200 hover:bg-primary/5 disabled:cursor-not-allowed group/task"
                  >
                    {togglingTask === task.id ? (
                      <Loader2 className="w-4 h-4 shrink-0 text-primary animate-spin" />
                    ) : task.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="w-4 h-4 shrink-0 text-base-content/30 group-hover/task:text-primary transition-colors" />
                    )}
                    <span
                      className={`text-xs leading-relaxed ${
                        task.is_completed
                          ? 'line-through text-base-content/30'
                          : 'text-base-content/70 group-hover/task:text-base-content'
                      }`}
                    >
                      {task.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty week state */}
          {(!week.resources || week.resources.length === 0) &&
            (!week.dailyTasks || week.dailyTasks.length === 0) && (
              <p className="text-xs text-base-content/30 text-center py-4">
                No content for this week yet
              </p>
            )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* ── Back link ── */}
        <button
          onClick={() => navigate('/dashboard/roadmaps')}
          className="flex items-center gap-1.5 text-sm text-base-content/40 hover:text-base-content transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Roadmaps
        </button>

        {/* ── Journey header ── */}
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Route className="w-5 h-5 text-primary shrink-0" />
                <h1 className="text-xl font-bold text-base-content">
                  {roadmap.duration_weeks}-Week Learning Plan
                </h1>
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${
                    STATUS_STYLES[roadmap.status]
                  }`}
                >
                  {roadmap.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-base-content/40 mt-2">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                  Created {formatDate(roadmap.created_at)}
                </span>
                <span className="w-1 h-1 rounded-full bg-base-content/20 shrink-0" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {roadmap.duration_weeks} weeks
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-base-content/40 mb-1.5">
              <span>
                {completedTasks} of {totalTasks} tasks completed
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-base-content/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>

          {/* ══ Journey Timeline (signature element) ══ */}
          <div className="mt-6 pt-2 px-2">
            <div className="relative">
              {/* Background track */}
              <div className="absolute left-0 right-0 top-[14px] h-0.5 bg-base-content/10 rounded-full" />

              {/* Progress fill */}
              {completedWeeks > 0 && (
                <motion.div
                  className="absolute left-0 top-[14px] h-0.5 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedWeeks / weeks.length) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* Station dots */}
              <div className="flex items-center justify-between relative">
                {weeks.map((week, i) => {
                  const weekCompleted =
                    week.dailyTasks?.length > 0 &&
                    week.dailyTasks.every((t) => t.is_completed)
                  const isCurrent = i === currentWeekIndex

                  return (
                    <div key={week.id} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 z-10 ${
                          weekCompleted
                            ? 'bg-primary text-primary-content scale-100'
                            : isCurrent
                              ? 'bg-primary/15 text-primary border-2 border-primary animate-pulse'
                              : 'bg-base-content/10 text-base-content/30 scale-95'
                        }`}
                      >
                        {weekCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          week.week_number
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-semibold ${
                          weekCompleted || isCurrent
                            ? 'text-base-content/50'
                            : 'text-base-content/20'
                        }`}
                      >
                        W{week.week_number}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Status controls + Delete */}
          {roadmap.status === 'active' && (
            <div className="mt-5 pt-4 border-t border-base-content/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {STATUS_ACTIONS.map((action) => (
                  <button
                    key={action.status}
                    onClick={() => handleStatusUpdate(action.status)}
                    disabled={updatingStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition disabled:opacity-30"
                  >
                    {updatingStatus ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <action.icon className="w-3.5 h-3.5" />
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-error/60 hover:text-error hover:bg-error/10 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}

          {/* Read-only footer for non-active roadmaps */}
          {roadmap.status !== 'active' && (
            <div className="mt-5 pt-4 border-t border-base-content/10 flex items-center justify-between">
              <span className="text-xs text-base-content/30 italic">
                This roadmap is marked as {roadmap.status}
              </span>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-error/60 hover:text-error hover:bg-error/10 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ── Week cards ── */}
        {weeks.length > 0 ? (
          <AnimatePresence>
            {weeks.map((week, i) => (
              <WeekCard key={week.id} week={week} weekIndex={i} />
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 mx-auto text-base-content/20 mb-3" />
            <p className="text-sm text-base-content/60">
              No weeks found in this roadmap
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Roadmapdetails
