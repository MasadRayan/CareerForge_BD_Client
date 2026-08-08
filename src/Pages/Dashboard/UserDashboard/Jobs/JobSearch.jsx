import { useEffect, useState } from 'react'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Search, Loader2, Briefcase, MapPin, Building2, Clock,
  ExternalLink, AlertCircle, FileText,
} from 'lucide-react'

const JobSearch = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.email) return
    axiosSecure
      .get(`/api/users/me/${user.email}`)
      .then((res) => {
        const role = res.data?.data?.target_role
        if (role) setQuery(role)
      })
      .catch(() => {
        // Prefill is optional — ignore failures.
      })
  }, [user?.email, axiosSecure])

  const handleSearch = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (!query.trim()) {
      toast.error('Enter a job search query')
      return
    }
    setLoading(true)
    setError(null)
    setSearched(false)
    try {
      const res = await axiosSecure.get('/api/jobs/search', { params: { q: query.trim(), limit: 20 } })
      if (res.data.success) {
        setJobs(res.data.data.jobs || [])
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Job search failed. Please try again.')
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d)) return ''
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-base-content">Find remote jobs</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Search live software roles and apply directly on the source board.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={query || 'e.g. React Developer'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-content font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-error/20 bg-error/5 p-4 text-sm text-base-content flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-error shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-base-content/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-base-content/10" />
              <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
                {jobs.length} roles
              </span>
              <span className="h-px flex-1 bg-base-content/10" />
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-2xl border border-base-content/10 bg-base-300 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base-content truncate">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-base-content/50">
                        {job.company && (
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" /> {job.company}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1.5 text-success">
                            <Briefcase className="w-3.5 h-3.5" /> {job.salary}
                          </span>
                        )}
                        {job.publication_date && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {formatDate(job.publication_date)}
                          </span>
                        )}
                      </div>
                      {job.snippet && (
                        <p className="text-sm text-base-content/60 mt-3 line-clamp-2">{job.snippet}</p>
                      )}
                      {job.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {job.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark border border-primary/30 hover:bg-primary/10 rounded-xl px-4 py-2 transition"
                    >
                      View job <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-base-content/40 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Found a role you want to prepare for? Go to CV &rarr; Analyze and paste its description to get an ATS score and roadmap.
            </p>
          </>
        )}

        {!loading && searched && jobs.length === 0 && !error && (
          <div className="text-center py-12">
            <Search className="w-10 h-10 mx-auto text-base-content/20 mb-3" />
            <p className="text-sm font-medium text-base-content/60">No jobs found</p>
            <p className="text-xs text-base-content/40 mt-1">Try a different query, e.g. your target role.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default JobSearch