import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import {
  Loader2, Sparkles, Crown, CheckCircle2, XCircle,
  AlertCircle, RefreshCw, CreditCard, CalendarDays,
  ShieldCheck, BarChart3, Brain, Map, MessageSquareText,
  Star
} from 'lucide-react'

const Subscription = () => {
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const statusApi = () => axiosSecure.get('/api/subscription/status')

  const applyStatus = (res) => {
    if (res.data.success) {
      setStatus(res.data.data)
    }
  }

  const handleError = (err) => {
    const msg = err?.response?.data?.message || 'Failed to load subscription status'
    setError(msg)
    toast.error(msg)
  }

  useEffect(() => {
    let cancelled = false
    statusApi()
      .then(res => { if (!cancelled) applyStatus(res) })
      .catch(err => { if (!cancelled) handleError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpgrade = async () => {
    setCheckingOut(true)
    try {
      const res = await axiosSecure.post('/api/subscription/checkout')
      if (res.data.success && res.data.data?.paymentURL) {
        window.location.href = res.data.data.paymentURL
      } else {
        toast.error('Failed to create checkout session')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to start checkout'
      toast.error(msg)
    } finally {
      setCheckingOut(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    statusApi()
      .then(res => applyStatus(res))
      .catch(err => handleError(err))
      .finally(() => setLoading(false))
  }

  const isPremium = status?.isSubscribed && status?.status === 'active'
  const periodEnd = status?.currentPeriodEnd
  let daysRemaining = null
  if (periodEnd) {
    const now = new Date()
    const end = new Date(periodEnd)
    daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
  }

  if (loading && !status) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-base-content/10 rounded-xl w-48" />
          <div className="h-4 bg-base-content/10 rounded-xl w-72" />
          <div className="rounded-xl border border-base-content/10 bg-base-300 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-base-content/10" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-base-content/10 rounded w-40" />
                <div className="h-4 bg-base-content/10 rounded w-64" />
              </div>
            </div>
            <div className="h-3 bg-base-content/10 rounded w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !status) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h2 className="text-xl font-semibold text-base-content mb-2">Failed to Load Subscription</h2>
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

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Subscription
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            {isPremium ? 'You\'re on the Premium plan — enjoy full access to all features' : 'Choose the plan that fits your career goals'}
          </p>
        </div>
        {isPremium && (
          <span className="rounded-lg bg-success/10 text-success border border-success/20 px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            Premium Active
          </span>
        )}
      </div>

      {isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-success/20 bg-success/5 p-6 mb-8"
        >
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7 text-success" />
            </div>
            <div className="flex-1 min-w-50">
              <h2 className="text-lg font-semibold text-base-content mb-1">Premium Plan Active</h2>
              <p className="text-sm text-base-content/60 mb-3">
                You have full access to all features including unlimited analyses, AI feedback, and detailed roadmaps.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {daysRemaining !== null && (
                  <span className="flex items-center gap-1.5 text-base-content/70">
                    <CalendarDays className="w-4 h-4" />
                    {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                  </span>
                )}
                {periodEnd && (
                  <span className="flex items-center gap-1.5 text-base-content/50 text-xs">
                    Renews {new Date(periodEnd).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-success text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-renewing
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/payment-history')}
              className="rounded-xl border border-base-content/20 text-base-content px-4 py-2 text-sm font-medium hover:bg-base-300 transition shrink-0"
            >
              View History
            </button>
          </div>
        </motion.div>
      )}

      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-base-content/10 bg-base-300 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
                <Crown className="w-5 h-5 text-warning" />
                Premium Plan
              </h2>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm text-base-content/50">BDT</span>
                <span className="text-2xl font-bold text-base-content">5,000</span>
                <span className="text-sm text-base-content/50">/year</span>
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={checkingOut}
             className="rounded-xl bg-linear-to-r from-primary via-emerald-500 to-amber-400 text-primary-content px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center gap-2">
              {checkingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Upgrade to Premium
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-base-content/10 bg-base-300 p-6"
      >
        <h3 className="text-sm font-semibold text-base-content mb-4">
          {isPremium ? 'Premium features' : 'What you get with Premium'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: BarChart3, label: 'CV Analyses', free: '5 / month', premium: 'Unlimited' },
            { icon: Brain, label: 'Quiz Bank', free: 'Basic questions', premium: 'Full bank + Analytics' },
            { icon: MessageSquareText, label: 'Interview Practice', free: 'Standard', premium: 'Unlimited + AI Feedback' },
            { icon: Star, label: 'STAR Method Feedback', free: 'Not available', premium: 'AI-powered' },
            { icon: Map, label: 'Learning Roadmaps', free: 'Not available', premium: 'Detailed & personalized' },
            { icon: ShieldCheck, label: 'Support', free: 'Email only', premium: 'Priority support' },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-base-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-base-content">{item.label}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-base-content/40">
                  <XCircle className="w-3 h-3" />
                  Free: {item.free}
                </div>
                <div className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  Premium: {item.premium}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Subscription
