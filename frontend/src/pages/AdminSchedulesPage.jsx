import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Clock, Trash2, Edit2, Check, Calendar } from 'lucide-react'
import { eventService, adminService } from '../services'
import { VintageCard, VintageButton, VintageInput } from '../components/Vintage'
import useAlert from '../hooks/useAlert'
import AdminHeroBackground from '../components/AdminHeroBackground'

export default function AdminSchedulesPage() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    activity_name: '',
    start_time: '',
    end_time: '',
  })
  const { showAlert } = useAlert()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      fetchSchedules(selectedEvent)
    } else {
      setSchedules([])
    }
  }, [selectedEvent])

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

  const fetchSchedules = async (eventId) => {
    try {
      setLoading(true)
      const response = await adminService.getSchedules(eventId)
      setSchedules(response.data || [])
    } catch (err) {
      console.error('Failed to fetch schedules:', err)
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()
    if (!selectedEvent) return

    try {
      if (editingId) {
        await adminService.updateSchedule(editingId, formData)
        setSuccess('Schedule updated successfully!')
        showAlert('Schedule updated successfully!', 'success')
      } else {
        await adminService.createSchedule(selectedEvent, formData)
        setSuccess('Schedule created successfully!')
        showAlert('Schedule created successfully!', 'success')
      }
      setFormData({ activity_name: '', start_time: '', end_time: '' })
      setShowForm(false)
      setEditingId(null)
      fetchSchedules(selectedEvent)
    } catch (err) {
      setError('Failed to save schedule')
      showAlert('Failed to save schedule', 'error')
    }
  }

  const handleEditSchedule = (schedule) => {
    setFormData({
      activity_name: schedule.activity_name,
      start_time: schedule.start_time ? schedule.start_time.slice(0, 16) : '',
      end_time: schedule.end_time ? schedule.end_time.slice(0, 16) : '',
    })
    setEditingId(schedule.id)
    setShowForm(true)
  }

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return

    try {
      await adminService.deleteSchedule(scheduleId)
      setSuccess('Schedule deleted successfully!')
      showAlert('Schedule deleted successfully!', 'success')
      fetchSchedules(selectedEvent)
    } catch (err) {
      setError('Failed to delete schedule')
      showAlert('Failed to delete schedule', 'error')
    }
  }

  const formatDateTime = (dt) => {
    if (!dt) return '-'
    return new Date(dt).toLocaleString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="relative min-h-screen">
      <section className="relative min-h-[42vh] flex items-center overflow-hidden pt-20">
        <AdminHeroBackground variant="schedules" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[1]" />
        <div className="container-editorial relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] border border-[#333333] px-5 py-2.5 mb-6">
              Schedule Timeline
            </span>
            <h1 className="hero-title mb-6">
              KELOLA
              <br />
              <span className="text-[#525252]">JADWAL.</span>
            </h1>
            <p className="hero-subtitle">
              Susun rundown event dengan alur waktu yang rapi, jelas, dan mudah dipantau.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-sm relative z-10">
        <div className="container-editorial">
        {/* Event Selector */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <VintageCard>
            <label className="block text-[10px] font-bold text-white mb-3 uppercase tracking-[0.15em]">
              Pilih Event
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-[#0a0a0a] border border-[#222222] text-white outline-none focus:border-[#555555] transition-all duration-300"
            >
              <option value="">-- Pilih Event --</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </VintageCard>
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

        {/* Add Button */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between gap-3 mb-8"
          >
            <VintageButton
              onClick={() => {
                setShowForm(!showForm)
                setEditingId(null)
                setFormData({ activity_name: '', start_time: '', end_time: '' })
              }}
              variant="primary"
              size="md"
              className="w-full md:w-auto"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              {showForm ? 'Tutup Form' : 'Tambah Jadwal'}
            </VintageButton>
          </motion.div>
        )}

        {/* Add/Edit Form */}
        {showForm && selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <VintageCard>
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white mb-6">
                {editingId ? 'Edit Jadwal' : 'Jadwal Baru'}
              </h3>
              <form onSubmit={handleAddSchedule} className="space-y-5">
                <VintageInput
                  label="Nama Aktivitas"
                  placeholder="e.g., Pembukaan, Sesi 1, Coffee Break"
                  value={formData.activity_name}
                  onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VintageInput
                    label="Waktu Mulai"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                  <VintageInput
                    label="Waktu Selesai"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-[#1a1a1a]">
                  <VintageButton type="submit" variant="primary" size="md" className="flex-1">
                    {editingId ? 'Update' : 'Simpan'}
                  </VintageButton>
                  <VintageButton
                    type="button"
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({ activity_name: '', start_time: '', end_time: '' })
                    }}
                  >
                    Batal
                  </VintageButton>
                </div>
              </form>
            </VintageCard>
          </motion.div>
        )}

        {/* Schedules List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 border border-[#222222] flex items-center justify-center">
              <Clock className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-[#737373] text-sm">Loading jadwal...</p>
          </div>
        ) : !selectedEvent ? (
          <VintageCard>
            <p className="text-center text-[#737373] text-sm py-8">
              Pilih event untuk melihat dan mengelola jadwal
            </p>
          </VintageCard>
        ) : schedules.length === 0 ? (
          <VintageCard>
            <p className="text-center text-[#737373] text-sm py-8">
              Belum ada jadwal untuk event ini. Tambah jadwal pertama!
            </p>
          </VintageCard>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {schedules.map((schedule, i) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <VintageCard>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[#737373]" />
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {schedule.activity_name}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-[#737373]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Mulai: {formatDateTime(schedule.start_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Selesai: {formatDateTime(schedule.end_time)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditSchedule(schedule)}
                        className="p-2.5 bg-[#0a0a0a] border border-[#222222] text-white hover:bg-[#111111] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteSchedule(schedule.id)}
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
