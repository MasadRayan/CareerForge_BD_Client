import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import ExamRunner from './ExamRunner'

const FinalExam = () => {
  const { id: roadmapId } = useParams()
  const axiosSecure = useAxiosSecure()

  const load = useCallback(async () => {
    const res = await axiosSecure.get(`/api/roadmap/${roadmapId}/final-exam`)
    return res
  }, [axiosSecure, roadmapId])

  const submit = useCallback(
    async (answers) => {
      const res = await axiosSecure.post(`/api/roadmap/${roadmapId}/final-exam/submit`, {
        answers,
      })
      return res
    },
    [axiosSecure, roadmapId],
  )

  return (
    <ExamRunner
      kind="final"
      load={load}
      submit={submit}
      backPath={`/dashboard/roadmaps/${roadmapId}`}
      roadmapPath={`/dashboard/roadmaps/${roadmapId}`}
    />
  )
}

export default FinalExam
