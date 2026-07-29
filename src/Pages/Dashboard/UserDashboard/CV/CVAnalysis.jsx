import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Loader2, Target, CheckCircle2, XCircle, Lightbulb, FileText, AlertTriangle } from 'lucide-react'

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

const CVAnalysis = () => {
  const { id: cvId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [title, setTitle] = useState('')
  const [rawText, setRawText] = useState('')
  const [cv, setCv] = useState(null)
  const [cvLoading, setCvLoading] = useState(true)
  const [cvError, setCvError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)

  useEffect(() => {
    if (!user?.email || !cvId) return
    axiosSecure
      .get(`/api/cv/${cvId}`)
      .then((res) => {
        if (res.data.success) setCv(res.data.data)
        else setCvError('CV not found')
      })
      .catch(() => setCvError('Failed to load CV'))
      .finally(() => setCvLoading(false))
  }, [user?.email, cvId, axiosSecure])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !rawText.trim()) {
      toast.error('Title and job description text are required')
      return
    }

    setSubmitting(true)
    setAnalysisError(null)

    try {
      const jdRes = await axiosSecure.post('/api/jd', {
        title: title.trim(),
        raw_text: rawText.trim(),
      })

      if (!jdRes.data.success) {
        toast.error('Failed to create job description')
        setSubmitting(false)
        return
      }

      const jdId = jdRes.data.data.id
      const analysisRes = await axiosSecure.post('/api/analysis', {
        cv_id: cvId,
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
    setAnalysisError(null)
  }

  if (cvLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (cvError) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <FileText className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
        <p className="text-lg font-medium text-base-content/60">{cvError}</p>
        <button
          onClick={() => navigate('/dashboard/cvs')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Back to CVs
        </button>
      </div>
    )
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

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
          onClick={() => navigate(`/dashboard/cvs/${cvId}`)}
          className="flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CV
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-base-content">CV Analysis</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Compare your CV against a job description
          </p>
        </div>

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
        {!analysis && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-base-content/10 bg-base-300 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px flex-1 bg-base-content/10" />
              <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
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
                className="w-full py-3 px-6 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm hover:from-indigo-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* ATS Score */}
              <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6 text-center">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <span className="h-px flex-1 max-w-16 bg-base-content/10" />
                  <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
                    ATS Score
                  </span>
                  <span className="h-px flex-1 max-w-16 bg-base-content/10" />
                </div>
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(analysis.ats_score)} mb-3`}>
                  <span className={`text-3xl font-bold font-mono ${getScoreColor(analysis.ats_score)}`}>
                    {analysis.ats_score}
                  </span>
                </div>
                <p className="text-sm text-base-content/60">
                  {analysis.ats_score >= 80
                    ? 'Strong match — your CV aligns well with this role'
                    : analysis.ats_score >= 60
                    ? 'Moderate match — some areas need improvement'
                    : 'Weak match — consider tailoring your CV for this role'}
                </p>
              </div>

              {/* Keyword Match */}
              {analysis.keyword_match_breakdown && (
                <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-base-content/10" />
                    <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
                      Keyword Match
                    </span>
                    <span className="h-px flex-1 bg-base-content/10" />
                  </div>

                  {analysis.keyword_match_breakdown.matched_keywords?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Matched
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.keyword_match_breakdown.matched_keywords.map((kw) => (
                          <span key={kw} className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.keyword_match_breakdown.missing_keywords?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-error mb-2 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        Missing
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.keyword_match_breakdown.missing_keywords.map((kw) => (
                          <span key={kw} className="px-2.5 py-1 rounded-full bg-error/10 text-error text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.keyword_match_breakdown.formatting_issues?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-amber-500 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Formatting Issues
                      </p>
                      <ul className="space-y-1">
                        {analysis.keyword_match_breakdown.formatting_issues.map((issue, i) => (
                          <li key={i} className="text-xs text-base-content/60 flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-amber-500/60 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.keyword_match_breakdown.missing_sections?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-base-content/60 mb-2">
                        Missing Sections
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.keyword_match_breakdown.missing_sections.map((s) => (
                          <span key={s} className="px-2.5 py-1 rounded-full bg-base-content/10 text-base-content/50 text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Gap Skills */}
              {analysis.gap_skills?.length > 0 && (
                <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-px flex-1 bg-base-content/10" />
                    <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
                      Gap Skills
                    </span>
                    <span className="h-px flex-1 bg-base-content/10" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.gap_skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-full border border-error/20 bg-error/5 text-error text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-base-content/40 mt-3">
                    Consider adding these skills to your CV to improve your match score
                  </p>
                </div>
              )}

              {/* Rewrite Suggestions */}
              {analysis.rewrite_suggestions?.length > 0 && (
                <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-px flex-1 bg-base-content/10" />
                    <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
                      Rewrite Suggestions
                    </span>
                    <span className="h-px flex-1 bg-base-content/10" />
                  </div>
                  <div className="space-y-4">
                    {analysis.rewrite_suggestions.map((suggestion, i) => (
                      <div key={i} className="rounded-xl border border-base-content/10 bg-base-200 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-base-content/60">Suggestion {i + 1}</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] font-semibold tracking-wider text-base-content/40 uppercase mb-0.5">Original</p>
                            <p className="text-sm text-base-content/70 bg-base-content/5 rounded-lg px-3 py-2">
                              {suggestion.original}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold tracking-wider text-success uppercase mb-0.5">Suggested</p>
                            <p className="text-sm text-base-content bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
                              {suggestion.suggested}
                            </p>
                          </div>
                          {suggestion.explanation && (
                            <p className="text-xs text-base-content/40 italic">
                              {suggestion.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Created date + new analysis */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-base-content/40">
                  Analysis ran {formatDate(analysis.created_at)}
                </p>
                <button
                  onClick={handleReset}
                  className="text-sm text-primary hover:underline"
                >
                  Run another analysis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CVAnalysis
