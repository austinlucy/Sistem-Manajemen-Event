import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Camera, CheckCircle } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { userService } from '../services'
import { EditorialSection, VintageButton, VintageCard, VintageInput } from '../components/Vintage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const BASE_URL = API_URL.replace('/api', '')

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const response = await userService.updateProfile(formData)
      const updatedUser = response.data?.user
      if (updatedUser && setUser) {
        setUser(prev => ({
          ...prev,
          ...updatedUser,
          photo: updatedUser.photo ?? prev?.photo ?? null
        }))
      }
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Only image files are allowed (jpg, png, gif, webp)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    try {
      setPhotoLoading(true)
      setError('')
      setSuccess('')
      const uploadForm = new FormData()
      uploadForm.append('photo', file)

      const response = await userService.uploadPhoto(uploadForm)
      const photoPath = response.data?.user?.photo || response.data?.photoPath || ''

      if (photoPath && setUser) {
        setUser(prev => ({
          ...prev,
          ...(response.data?.user || {}),
          photo: photoPath
        }))
      }
      setSuccess('Photo uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo')
    } finally {
      setPhotoLoading(false)
    }
  }

  const photoUrl = user?.photo
    ? `${BASE_URL}${user.photo.startsWith('/') ? '' : '/'}${user.photo}`
    : null

  return (
    <div className="min-h-screen py-8 md:py-12">
      <EditorialSection
        title="Profil Saya"
        subtitle="Kelola informasi akun dan foto profil"
      >
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-7">
          {/* Photo Card */}
          <VintageCard>
            <div className="card-pad">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <div className="w-28 h-28 md:w-36 md:h-36 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-[#444444]" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-black border border-white flex items-center justify-center cursor-pointer hover:bg-[#cccccc] transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </motion.div>

                <div className="text-center">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-[#666666] mt-1">{user?.email}</p>
                  <span className="inline-block mt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] bg-white text-black">
                    {user?.role || 'User'}
                  </span>
                </div>

                {photoLoading && (
                  <p className="text-xs text-[#666666] animate-pulse">Uploading photo...</p>
                )}
              </div>
            </div>
          </VintageCard>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-l-2 border-white bg-[#0a0a0a]"
            >
              <p className="text-white text-sm">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-l-2 border-white bg-[#0a0a0a] flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-white" />
              <p className="text-white text-sm">{success}</p>
            </motion.div>
          )}

          {/* Profile Form */}
          <VintageCard>
            <form onSubmit={handleSubmit} className="card-pad space-y-6">
              <h2 className="card-title card-divider">
                Edit Profil
              </h2>

              <VintageInput
                label="Nama Lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama lengkap"
                required
              />

              <VintageInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />

              <VintageButton
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full"
              >
                Simpan Perubahan
              </VintageButton>
            </form>
          </VintageCard>
        </div>
      </EditorialSection>
    </div>
  )
}
