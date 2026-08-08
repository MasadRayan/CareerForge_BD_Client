import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Loader2, Target, FileText, AlertTriangle } from 'lucide-react'
import AnalysisResults from './AnalysisResults'

const CVCompare = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [cvs, setCvs] = useState([])
  const [cvsLoading, setCvsLoading] = useState(true)
  const [cvsError, setCvsError] = useState(null)
  const [selectedCvId, setSelectedCvId] = useState('')
  const [title, setTitle] = useState('')
  const [rawText, setRawText] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)

  useEffect(() => {
    if (!user?.email) return
    axiosSecure
      .get('/api/cv')
      .then((res) => {
        if (res.data.success) setCvs(res.data.data)
        else setCvsError('Failed to load CVs')
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Failed to load CVs'
        setCvsError(msg)
        toast.error(msg)
      })
      .finally(() => setCvsLoading(false))
  }, [user?.email, axiosSecure])

  const selectedCv = cvs.find((cv) => String(cv.id) === String(selectedCvId))

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCvId) {
      toast.error('Select a CV to compare against')
      return
    }
    if (!title.trim() || !rawText.trim() || !interviewDate) {
      toast.error('Title, job description, and interview date are required')
      return
    }

    setSubmitting(true)
    setAnalysisError(null)

    try {
      const jdRes = await axiosSecure.post('/api/jd', {
        title: title.trim(),
        raw_text: rawText.trim(),
        interview_date: interviewDate,
      })

      if (!jdRes.data.success) {
        toast.error('Failed to create job description')
        setSubmitting(false)
        return
      }

      const jdId = jdRes.data.data.id
      const analysisRes = await axiosSecure.post('/api/analysis', {
        cv_id: selectedCvId,
        jd_id: jdId,
      })

      if (analysisRes.data.success) {
        setAnalysis(analysisRes.data.data)
        toast.success('Analysis complete')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Analysis failed'
      if (err?.response?.status === 429) {
        setAnalysisError('limit')
      } else {
        setAnalysisError(msg)
        toast.error(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setAnalysis(null)
    setTitle('')
    setRawText('')
    setInterviewDate('')
    setAnalysisError(null)
  }

  if (cvsLoading) {
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

  if (cvsError) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <FileText className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
        <p className="text-base font-medium text-base-content/60 mb-2">Could not load your CVs</p>
        <p className="text-xs text-base-content/40 mb-6">{cvsError}</p>
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
        className="space-y-6"
      >
        {/* Back link */}
        <button
          onClick={() => navigate('/dashboard/cvs')}
          className="flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CVs
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-base-content">Compare CV with Job Description</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Pick a CV, paste the job description, and see how well you match
          </p>
        </div>

        {/* No CVs empty state */}
        {cvs.length === 0 && (
          <div className="rounded-2xl border border-base-content/10 bg-base-300 p-10 text-center">
            <FileText className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
            <p className="text-base font-medium text-base-content/80 mb-1">No CVs yet</p>
            <p className="text-xs text-base-content/40 mb-5">
              Upload a CV first so you can compare it against a job description
            </p>
            <button
              onClick={() => navigate('/dashboard/cvs')}
              className="rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white px-5 py-2 text-sm font-medium hover:from-indigo-600 hover:to-violet-600 transition"
            >
              Upload a CV
            </button>
          </div>
        )}

        {/* Rate limit error */}
        {analysisError === 'limit' && !analysis && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-3" />
            <p className="text-sm font-medium text-base-content mb-1">
              Monthly analysis limit reached
            </p>
            <p className="text-xs text-base-content/60 mb-4">
              Free tier allows 5 analyses per month. Upgrade to premium for unlimited.
            </p>
            <button
              onClick={() => navigate('/dashboard/subscription')}
              className="rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white px-5 py-2 text-sm font-medium hover:from-indigo-600 hover:to-violet-600 transition"
            >
              Upgrade to Premium
            </button>
          </div>
        )}

        {/* General analysis error banner */}
        {analysisError && analysisError !== 'limit' && !analysis && (
          <div className="rounded-2xl border border-error/20 bg-error/5 p-4 text-center">
            <p className="text-sm text-base-content">
              Analysis failed. Check the job description and try again.
            </p>
          </div>
        )}

        {/* Form (hidden after successful analysis) */}
        {cvs.length > 0 && !analysis && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-base-content/10 bg-base-300 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px flex-1 bg-base-content/10" />
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Your CV
              </span>
              <span className="h-px flex-1 bg-base-content/10" />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1.5">
                Select CV <span className="text-error">*</span>
              </label>
              <select
                value={selectedCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              >
                <option value="" disabled>
                  Choose a CV to compare...
                </option>
                {cvs.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    CV v{cv.version_number} — uploaded {formatDate(cv.uploaded_at)}
                  </option>
                ))}
              </select>
            </div>

            {selectedCv && (
              <div className="flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                <FileText className="w-5 h-5 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-base-content truncate">
                    Comparing with CV v{selectedCv.version_number}
                  </p>
                  <p className="text-xs text-base-content/50">
                    Uploaded {formatDate(selectedCv.uploaded_at)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 py-2">
              <span className="h-px flex-1 bg-base-content/10" />
              <span className="text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Job Description
              </span>
              <span className="h-px flex-1 bg-base-content/10" />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1.5">
                Interview Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1.5">
                Job Description Text
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={10}
                placeholder="Paste the full job description here..."
                className="w-full px-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors resize-y"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl bg-primary text-primary-content font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Analysis...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Run Analysis
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <AnalysisResults
              analysis={analysis}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CVCompare
