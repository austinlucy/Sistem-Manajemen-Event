import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Check, Calendar } from 'lucide-react'
import { eventService } from '../services'
import { VintageCard, VintageButton, VintageInput } from '../components/Vintage'
import AdminHeroBackground from '../components/AdminHeroBackground'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: '',
    location: '',
    quota: '',
    event_date: '',
    category_id: '',
  })
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventService.getAllEvents({ limit: 100 })
      const eventsData = response.data?.data ?? response.data
      setEvents(Array.isArray(eventsData) ? eventsData : [])
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', banner: '', location: '', quota: '', event_date: '', category_id: '' })
    setBannerFile(null)
    setBannerPreview('')
    setEditingEvent(null)
    setShowForm(false)
  }

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Hanya file gambar yang diperbolehkan (jpg, png, gif, webp)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
      return
    }
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
    setError('')
  }

  const validateForm = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const eventDate = new Date(formData.event_date)
    if (eventDate < now) {
      setError('Tanggal event tidak boleh di masa lalu')
      return false
    }
    return true
  }

  const buildEventFormData = () => {
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('description', formData.description)
    fd.append('location', formData.location)
    fd.append('quota', formData.quota)
    fd.append('event_date', formData.event_date)
    if (formData.category_id) fd.append('category_id', formData.category_id)
    if (bannerFile) {
      fd.append('banner', bannerFile)
    } else if (formData.banner) {
      fd.append('banner', formData.banner)
    }
    return fd
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      await eventService.createEvent(buildEventFormData())
      resetForm()
      setSuccess('✓ Event created successfully!')
      fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event')
    }
  }

  const handleUpdateEvent = async (e) => {
    e.preventDefault()
    if (!editingEvent) return
    if (!validateForm()) return
    try {
      await eventService.updateEvent(editingEvent.id, buildEventFormData())
      resetForm()
      setSuccess('✓ Event updated successfully!')
      fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event')
    }
  }

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id)
        setSuccess('✓ Event deleted successfully!')
        fetchEvents()
      } catch (err) {
        setError('Failed to delete event')
      }
    }
  }

  const startEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title || '',
      description: event.description || '',
      banner: event.banner || '',
      location: event.location || '',
      quota: event.quota || '',
      event_date: event.event_date ? event.event_date.slice(0, 16) : '',
      category_id: event.category_id || '',
    })
    setBannerFile(null)
    setBannerPreview(event.banner || '')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen">
      <section className="relative min-h-[42vh] flex items-center overflow-hidden pt-20">
        <AdminHeroBackground variant="events" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[1]" />
        <div className="container-editorial relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] border border-[#333333] px-5 py-2.5 mb-6">
              Event Management
            </span>
            <h1 className="hero-title mb-6">
              KELOLA
              <br />
              <span className="text-[#525252]">EVENT.</span>
            </h1>
            <p className="hero-subtitle">
              Buat, edit, dan arsipkan event kampus dengan tampilan editorial yang konsisten.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-sm relative z-10">
        <div className="container-editorial">
        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between gap-3 mb-8"
        >
          <VintageButton
            onClick={() => {
              if (showForm && editingEvent) {
                resetForm()
              } else {
                setShowForm(!showForm)
                setEditingEvent(null)
                setFormData({ title: '', description: '', banner: '', location: '', quota: '', event_date: '', category_id: '' })
              }
            }}
            variant="primary"
            size="md"
            className="w-full md:w-auto"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            {showForm ? 'Tutup Form' : 'Tambah Event'}
          </VintageButton>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 border-l-2 border-white bg-[#0a0a0a]"
          >
            <p className="text-white text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 border-l-2 border-white bg-[#0a0a0a] flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white text-sm">{success}</span>
          </motion.div>
        )}

        {/* Add/Edit Event Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <VintageCard>
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white mb-6">
                {editingEvent ? 'Edit Event' : 'Event Baru'}
              </h3>
              <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent} className="space-y-5">
                <VintageInput
                  label="Nama Event"
                  placeholder="e.g., Campus Music Festival"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                {/* Banner File Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.15em]">
                    Banner Event
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleBannerChange}
                      className="w-full px-4 py-3 text-sm bg-[#0a0a0a] border border-[#222222] text-white file:text-white file:bg-[#111111] file:border file:border-[#333333] file:px-3 file:py-1 file:mr-3 file:text-xs file:uppercase file:tracking-wider file:cursor-pointer outline-none focus:border-[#555555] transition-all duration-300"
                    />
                    {bannerPreview && (
                      <div className="relative h-32 bg-[#111111] border border-[#1a1a1a] overflow-hidden">
                        <img
                          src={bannerPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setBannerPreview('')}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.15em]">
                    Deskripsi
                    <span className="text-[#525252] ml-1">*</span>
                  </label>
                  <textarea
                    placeholder="Deskripsi event..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-[#0a0a0a] border border-[#222222] text-white placeholder-[#525252] outline-none focus:border-[#555555] transition-all duration-300 h-24 resize-none"
                    required
                  />
                </div>
                <VintageInput
                  label="Lokasi"
                  placeholder="e.g., Auditorium Kampus"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
                <VintageInput
                  label="Kuota"
                  type="number"
                  placeholder="100"
                  value={formData.quota}
                  onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                  required
                />
                <VintageInput
                  label="Tanggal & Waktu"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
                <div className="flex gap-3 pt-4 border-t border-[#1a1a1a]">
                  <VintageButton type="submit" variant="primary" size="md" className="flex-1">
                    {editingEvent ? 'Update Event' : 'Buat Event'}
                  </VintageButton>
                  <VintageButton
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={resetForm}
                  >
                    Batal
                  </VintageButton>
                </div>
              </form>
            </VintageCard>
          </motion.div>
        )}

        {/* Events List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 border border-[#222222] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-[#737373] text-sm">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <VintageCard>
            <p className="text-center text-[#737373] text-sm py-8">
              Belum ada event. Buat event pertama untuk memulai!
            </p>
          </VintageCard>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <VintageCard>
                  <div className="flex items-center justify-between gap-4 p-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white tracking-tight truncate">{event.title}</h3>
                      <p className="text-xs text-[#737373] mt-1.5">
                        {event.location} • {new Date(event.event_date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEdit(event)}
                        className="p-2.5 bg-[#0a0a0a] border border-[#222222] text-white hover:bg-[#111111] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2.5 bg-[#0a0a0a] border border-[#222222] text-white hover:bg-white hover:text-black transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </VintageCard>
              </motion.div>
            ))}
          </motion.div>
        )}
        </div>
      </section>
    </div>
  )
}
