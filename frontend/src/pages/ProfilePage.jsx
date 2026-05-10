import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Camera } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { userService } from '../services'

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await userService.updateProfile(formData)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('photo', file)
      await userService.uploadPhoto(formData)
      setSuccess('Photo uploaded successfully!')
    } catch (err) {
      setError('Failed to upload photo')
    }
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your account information</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-300 text-sm"
        >
          ✓ {success}
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="glass rounded-lg p-6 space-y-6"
      >
        {/* Photo Section */}
        <div className="text-center pb-6 border-b border-slate-700">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition cursor-pointer">
            <Camera className="w-4 h-4" />
            <span>Change Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Form Fields */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-lg glass border border-slate-600 focus:border-indigo-500 focus:outline-none text-white transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-lg glass border border-slate-600 focus:border-indigo-500 focus:outline-none text-white transition"
              disabled
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t border-slate-700">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
