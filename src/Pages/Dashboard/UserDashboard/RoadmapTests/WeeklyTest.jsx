import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import ExamRunner from './ExamRunner'

const WeeklyTest = () => {
  const { id: roadmapId, weekId } = useParams()
  const axiosSecure = useAxiosSecure()

  const [durationWeeks, setDurationWeeks] = useState(null)
  const [roadmapLoaded, setRoadmapLoaded] = useState(false)
  const [roadmapStatus, setRoadmapStatus] = useState('active')

  const load = useCallback(async () => {
    const res = await axiosSecure.get(`/api/roadmap/${roadmapId}/weeks/${weekId}/test`)
    return res
  }, [axiosSecure, roadmapId, weekId])

  const submit = useCallback(
    async (answers) => {
      const res = await axiosSecure.post(
        `/api/roadmap/${roadmapId}/weeks/${weekId}/test/submit`,
        { answers },
      )
      return res
    },
    [axiosSecure, roadmapId, weekId],
  )

  useEffect(() => {
    let cancelled = false
    axiosSecure
      .get(`/api/roadmap/${roadmapId}`)
      .then((res) => {
        if (cancelled || !res?.data?.success) return
        const data = res.data.data
        setDurationWeeks(data.duration_weeks ?? null)
        setRoadmapStatus(data.status ?? 'active')
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setRoadmapLoaded(true)
      })
    return () => { cancelled = true }
  }, [axiosSecure, roadmapId])

  if (!roadmapLoaded) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
          <p className="text-sm text-base-content/60">Loading week...</p>
        </div>
      </div>
    )
  }

  if (roadmapStatus === 'completed') {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-sm text-base-content/50">
          This roadmap is already completed. Weekly tests are locked.
        </p>
      </div>
    )
  }

  return (
    <ExamRunner
      kind="weekly"
      load={load}
      submit={submit}
      durationWeeks={durationWeeks}
      backPath={`/dashboard/roadmaps/${roadmapId}`}
      roadmapPath={`/dashboard/roadmaps/${roadmapId}`}
    />
  )
}

export default WeeklyTest
