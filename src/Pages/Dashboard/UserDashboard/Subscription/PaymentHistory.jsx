import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import {
  RefreshCw, AlertCircle, CreditCard, Crown,
  CalendarDays, Clock, ShieldCheck
} from 'lucide-react'

const STATUS_STYLES = {
  active: 'bg-success/10 text-success border-success/20',
  canceled: 'bg-warning/10 text-warning border-warning/20',
  expired: 'bg-error/10 text-error border-error/20',
  cancelled: 'bg-warning/10 text-warning border-warning/20',
}

const STATUS_LABELS = {
  active: 'Active',
  canceled: 'Cancelled',
  cancelled: 'Cancelled',
  expired: 'Expired',
}

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const historyApi = () => axiosSecure.get('/api/subscription/history')

  const applyHistory = (res) => {
    if (res.data.success) {
      setHistory(res.data.data || [])
    }
  }

  const handleError = (err) => {
    const msg = err?.response?.data?.message || 'Failed to load payment history'
    setError(msg)
    toast.error(msg)
  }

  useEffect(() => {
    let cancelled = false
    historyApi()
      .then(res => { if (!cancelled) applyHistory(res) })
      .catch(err => { if (!cancelled) handleError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    historyApi()
      .then(applyHistory)
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-base-content/10 rounded-xl w-48" />
          <div className="h-4 bg-base-content/10 rounded-xl w-64" />
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-base-content/10 bg-base-300 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-base-content/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-base-content/10 rounded w-24" />
                  <div className="h-3 bg-base-content/10 rounded w-32" />
                </div>
                <div className="h-6 bg-base-content/10 rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
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

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <CreditCard className="w-16 h-16 text-base-content/30 mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">No Payment History</h2>
          <p className="text-base-content/60 mb-2">
            You haven't made any payments yet.
          </p>
          <p className="text-base-content/40 text-sm mb-6">
            Upgrade to Premium to unlock all features and your payment history will appear here.
          </p>
          <button
            onClick={() => navigate('/dashboard/subscription')}
            className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            View Plans
          </button>
        </div>
      </div>
    )
  }

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null
    const now = new Date()
    const end = new Date(endDate)
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-primary" />
          Payment History
        </h1>
        <p className="text-base-content/60 text-sm mt-1">
          {history.length} subscription record{history.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {history.map((record, idx) => {
          const daysLeft = getDaysRemaining(record.currentPeriodEnd)
          const statusKey = record.status?.toLowerCase() || ''
          const statusStyle = STATUS_STYLES[statusKey] || 'bg-base-content/10 text-base-content/60'
          const statusLabel = STATUS_LABELS[statusKey] || record.status || 'Unknown'

          const startDate = record.startedAt || record.createdAt
          const formattedStart = startDate
            ? new Date(startDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })
            : ''

          const formattedEnd = record.currentPeriodEnd
            ? new Date(record.currentPeriodEnd).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })
            : ''

          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="rounded-xl border border-base-content/10 bg-base-300 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-warning" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="rounded-lg bg-warning/10 text-warning text-xs font-medium px-2.5 py-0.5">
                      {record.plan || 'Premium'}
                    </span>
                    <span className={`rounded-lg px-2.5 py-0.5 text-xs font-medium border ${statusStyle}`}>
                      {statusLabel}
                    </span>
                    {daysLeft !== null && statusKey === 'active' && (
                      <span className="text-xs text-base-content/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/50">
                    {formattedStart && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        Started: {formattedStart}
                      </span>
                    )}
                    {formattedEnd && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {statusKey === 'active' ? 'Renewal:' : 'Ended:'} {formattedEnd}
                      </span>
                    )}
                  </div>

                  {record.stripeSubscriptionId && (
                    <p className="text-[10px] text-base-content/20 mt-1.5 font-mono truncate">
                      ID: {record.stripeSubscriptionId}
                    </p>
                  )}
                </div>

                {statusKey === 'active' && (
                  <span className="flex items-center gap-1 text-success text-xs shrink-0 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Active
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/dashboard/subscription')}
          className="rounded-xl bg-primary text-primary-content px-6 py-2.5 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-2"
        >
          <Crown className="w-4 h-4" />
          Manage Subscription
        </button>
      </div>
    </div>
  )
}

export default PaymentHistory
