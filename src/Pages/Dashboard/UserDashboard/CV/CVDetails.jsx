import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, ExternalLink, Loader2 } from 'lucide-react'

const CVDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [cv, setCv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.email || !id) return

    axiosSecure
      .get(`/api/cv/${id}`)
      .then((res) => {
        if (res.data.success) {
          setCv(res.data.data)
        } else {
          setError('CV not found')
        }
      })
      .catch(() => setError('Failed to load CV'))
      .finally(() => setLoading(false))
  }, [user?.email, id, axiosSecure])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !cv) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <FileText className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
        <p className="text-lg font-medium text-base-content/60">{error || 'CV not found'}</p>
        <button
          onClick={() => navigate('/dashboard/cvs')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Back to CVs
        </button>
      </div>
    )
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
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

        {/* Header card */}
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/15 flex flex-col items-center justify-center font-mono text-xs leading-tight text-primary">
                <span className="text-[10px] opacity-60">v</span>
                <span className="text-lg font-bold">{cv.version_number}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-base-content">
                  CV version {cv.version_number}
                </h1>
                <p className="text-sm text-base-content/60 mt-0.5">
                  Uploaded {formatDate(cv.uploaded_at)}
                </p>
              </div>
            </div>

            {cv.file_url && (
              <a
                href={cv.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open PDF
              </a>
            )}
          </div>
        </div>

        {/* Parsed content */}
        <div className="rounded-2xl border border-base-content/10 bg-base-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px flex-1 bg-base-content/10" />
            <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
              Parsed Content
            </span>
            <span className="h-px flex-1 bg-base-content/10" />
          </div>

          {cv.raw_text ? (
            <div className="text-sm text-base-content leading-relaxed whitespace-pre-wrap font-sans">
              {cv.raw_text}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
              <p className="text-sm font-medium text-base-content/60">
                No parsed content available
              </p>
              <p className="text-xs text-base-content/40 mt-1">
                The CV text may still be processing
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default CVDetails
