import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Lightbulb, AlertTriangle, History } from 'lucide-react'

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

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const AnalysisResults = ({ analysis, viewingExisting = false, onReset }) => {
  const navigate = useNavigate()

  return (
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
                    <span className="mt-1 w-1 h-1 rounded-full bg-amber-500/60 shrink-0" />
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

      {/* Created date + actions */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-base-content/40">
          Analysis ran {formatDate(analysis.created_at)}
        </p>
        <div className="flex items-center gap-4">
          {viewingExisting && (
            <button
              onClick={() => navigate('/dashboard/analysesHistory')}
              className="flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              All Analyses
            </button>
          )}
          <button
            onClick={onReset}
            className="text-sm text-primary hover:underline"
          >
            {viewingExisting ? 'New analysis for this CV' : 'Run another analysis'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AnalysisResults
