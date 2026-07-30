import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'

export default function useDashboardData() {
  const axiosSecure = useAxiosSecure()

  const analytics = useQuery({
    queryKey: ['user-dashboard-analytics'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/analytics/status')
      return res.data.data || res.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const history = useQuery({
    queryKey: ['user-dashboard-readiness-history'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/readiness-score/history')
      return res.data.data || []
    },
    staleTime: 5 * 60 * 1000,
  })

  const quizStats = useQuery({
    queryKey: ['user-dashboard-quiz-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/quiz/stats')
      return res.data.data || null
    },
    staleTime: 5 * 60 * 1000,
  })

  return {
    analytics: analytics.data ?? null,
    history: history.data ?? [],
    quizStats: quizStats.data ?? null,
    isLoading: analytics.isLoading || history.isLoading || quizStats.isLoading,
    isError: analytics.isError || history.isError || quizStats.isError,
    error: analytics.error || history.error || quizStats.error,
  }
}
