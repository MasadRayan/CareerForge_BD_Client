import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Camera, Check, Loader2 } from 'lucide-react'
import { AuthContext } from '../../Context/AuthProvider'
import useAxiosSecure from '../../Hooks/useAxiosSecure'

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
]

const UpdateProfile = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const [currentProfile, setCurrentProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [photoError, setPhotoError] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', experience_level: '', photoURL: '' },
  })

  const watchedPhotoURL = watch('photoURL')

  useEffect(() => {
    setPhotoError(false)
  }, [watchedPhotoURL])

  useEffect(() => {
    if (!user?.email) return

    axiosSecure
      .get(`/api/users/me/${user.email}`)
      .then((res) => {
        if (res.data.success) {
          const profile = res.data.data
          setCurrentProfile(profile)
          setValue('name', profile.name || '')
          setValue('experience_level', profile.experience_level || '')
          setValue('photoURL', profile.photoURL || '')
        }
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoadingProfile(false))
  }, [user?.email, axiosSecure, setValue])

  const onSubmit = async (data) => {
    if (!user?.email) return
    setSubmitting(true)

    try {
      const payload = {}
      if (data.name !== currentProfile?.name) payload.name = data.name
      if (data.experience_level !== currentProfile?.experience_level) payload.experience_level = data.experience_level
      if (data.photoURL !== currentProfile?.photoURL) payload.photoURL = data.photoURL

      if (Object.keys(payload).length === 0) {
        toast.error('No changes to save')
        setSubmitting(false)
        return
      }

      const res = await axiosSecure.patch(`/api/users/update/${user.email}`, payload)

      if (res.data.success) {
        toast.success('Profile updated successfully')
        navigate('/dashboard/profile')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        Please login to view your profile.
      </div>
    )
  }

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <div className="bg-base-300 rounded-2xl border border-base-content/10 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-36 h-36 rounded-full overflow-hidden bg-base-content/20 border-2 border-primary/30 mb-4">
              {watchedPhotoURL && !photoError ? (
                <img
                  src={watchedPhotoURL}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-base-content/40">
                  <Camera className="w-12 h-12" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold text-base-content">Update Profile</h1>
            <p className="text-sm text-base-content/60 mt-1">Update your career identity</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-base-content/20" />
                <span className="text-xs font-medium tracking-widest text-base-content/40 uppercase">Identity</span>
                <span className="h-px flex-1 bg-base-content/20" />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1.5">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  placeholder={currentProfile?.name || 'Enter your full name'}
                  className="w-full px-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                />
                {errors.name && (
                  <p className="text-xs text-error mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-base-content/20" />
                <span className="text-xs font-medium tracking-widest text-base-content/40 uppercase">Career</span>
                <span className="h-px flex-1 bg-base-content/20" />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1.5">
                  Experience Level
                </label>
                <select
                  {...register('experience_level')}
                  className="w-full px-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                >
                  <option value="">Select level</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px flex-1 bg-base-content/20" />
                <span className="text-xs font-medium tracking-widest text-base-content/40 uppercase">Media</span>
                <span className="h-px flex-1 bg-base-content/20" />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1.5">
                  Photo URL
                </label>
                <input
                  {...register('photoURL')}
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2.5 rounded-xl border border-base-content/20 bg-base-200 text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                />
                <p className="text-xs text-base-content/40 mt-1">
                  Paste a link to your professional headshot
                </p>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm hover:from-indigo-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default UpdateProfile
