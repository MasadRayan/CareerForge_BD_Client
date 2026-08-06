import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../Context/AuthProvider'
import useAxiosSecure from '../../../../Hooks/useAxiosSecure'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Upload, FileText, Trash2, Eye, BarChart3, Loader2, Sparkles } from 'lucide-react'

const MAX_CVS = 3

const CVList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [extracting, setExtracting] = useState(null)

  const fileInputRef = useRef(null)

  const fetchCVs = useCallback(async () => {
    if (!user?.email) return
    try {
      const res = await axiosSecure.get('/api/cv')
      if (res.data.success) {
        setCvs(res.data.data)
      }
    } catch {
      toast.error('Failed to load CVs')
    } finally {
      setLoading(false)
    }
  }, [user?.email, axiosSecure])

  useEffect(() => {
    fetchCVs()
  }, [fetchCVs])

  const handleUpload = async (file) => {
    if (!file) return
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Only PDF and DOCX files are accepted')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axiosSecure.post('/api/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        toast.success('CV uploaded successfully')
        fetchCVs()
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this CV version?')) return
    setDeleting(id)
    try {
      const res = await axiosSecure.delete(`/api/cv/${id}`)
      if (res.data.success) {
        toast.success('CV deleted')
        setCvs((prev) => prev.filter((cv) => cv.id !== id))
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 py-8">
        <div className="h-8 w-48 bg-base-content/10 rounded-lg animate-pulse" />
        <div className="h-32 bg-base-content/10 rounded-2xl animate-pulse" />
        <div className="space-y-3 pt-4">
          <div className="h-4 w-32 bg-base-content/10 rounded animate-pulse" />
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-base-content/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-base-content">My CVs</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Upload and manage your CV versions
          </p>
        </div>

        {/* Upload zone */}
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-base-content/20 hover:border-primary/50 bg-base-300'
          } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          whileHover={{ scale: uploading ? 1 : 1.005 }}
          whileTap={{ scale: uploading ? 1 : 0.995 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files[0])}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-base-content">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-base-content">
                  Drop your CV here or click to browse
                </p>
                <p className="text-xs text-base-content/40 mt-1">
                  PDF or DOCX &middot; Max 5MB
                </p>
              </div>
              {cvs.length >= MAX_CVS && (
                <p className="text-xs text-amber-500 font-medium">
                  You have {MAX_CVS} CVs &mdash; the oldest will be replaced
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* CV list */}
        <AnimatePresence mode="wait">
          {cvs.length > 0 ? (
            <motion.div
              key="cv-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-base-content/10" />
                <span className="text-xs font-semibold tracking-widest text-base-content/40 uppercase">
                  Your CVs
                </span>
                <span className="h-px flex-1 bg-base-content/10" />
              </div>

              {cvs.map((cv, index) => {
                const isLatest = index === 0
                return (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center gap-4 rounded-xl border border-base-content/10 bg-base-300 p-4"
                  >
                    {/* Version badge */}
                    <div
                      className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono text-xs leading-tight ${
                        isLatest
                          ? 'bg-primary/15 text-primary'
                          : 'bg-base-content/8 text-base-content/40'
                      }`}
                    >
                      <span className="text-[10px] opacity-60">v</span>
                      <span className="text-sm font-bold">{cv.version_number}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-base-content/40 shrink-0" />
                        <span className="text-sm font-medium text-base-content truncate">
                          CV version {cv.version_number}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-semibold tracking-wider text-success uppercase bg-success/10 px-1.5 py-0.5 rounded">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/40 mt-0.5">
                        {formatDate(cv.uploaded_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/dashboard/cvs/${cv.id}`)}
                        className="p-2 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-content/10 transition"
                        title="View CV"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cv.id)}
                        disabled={deleting === cv.id}
                        className="p-2 rounded-lg text-base-content/40 hover:text-error hover:bg-error/10 transition disabled:opacity-30"
                        title="Delete CV"
                      >
                        {deleting === cv.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="cv-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <FileText className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
              <p className="text-sm font-medium text-base-content/60">No CVs yet</p>
              <p className="text-xs text-base-content/40 mt-1">
                Upload your first CV to get started
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default CVList
