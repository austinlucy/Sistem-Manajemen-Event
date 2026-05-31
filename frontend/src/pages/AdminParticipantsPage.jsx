import { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Download } from 'lucide-react'
import { adminService, eventService } from '../services'
import { AuthContext } from '../context/AuthContext'
import { VintageCard } from '../components/Vintage'
import AdminHeroBackground from '../components/AdminHeroBackground'

export default function AdminParticipantsPage() {
  const { user } = useContext(AuthContext)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      fetchRegistrations(selectedEvent)
    } else {
      setRegistrations([])
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
      setError('')
      const response = await eventService.getAllEvents({ limit: 100 })
      const eventsData = response.data?.data ?? response.data
      const eventList = Array.isArray(eventsData) ? eventsData : []

      // Halaman kelola peserta hanya bisa mengelola event milik admin yang sedang login.
      // Jika semua event ditampilkan, tombol approve/reject akan kena 403 Unauthorized dari backend.
      const ownedEvents = eventList.filter(event => !event.admin_id || String(event.admin_id) === String(user?.id))
      setEvents(ownedEvents)
    } catch (e) {
      console.error('Failed to fetch events:', e)
      setError(e.response?.data?.message || 'Gagal memuat daftar event')
    }
  }

  const fetchRegistrations = async (eventId) => {
    try {
      setLoading(true)
      setError('')
      const response = await adminService.getRegistrations(eventId)
      setRegistrations(response.data || [])
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
      setRegistrations([])
      setError(err.response?.data?.message || 'Gagal memuat peserta event')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (registrationId, status) => {
    try {
      setError('')
      setUpdatingId(registrationId)
      await adminService.updateRegistrationStatus(registrationId, status)
      setSuccess(`✓ Peserta ${status === 'approved' ? 'diterima' : 'ditolak'}!`)
      if (selectedEvent) {
        fetchRegistrations(selectedEvent)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      setError(err.response?.data?.message || 'Gagal mengubah status peserta')
    } finally {
      setUpdatingId(null)
    }
  }

  const exportParticipantsCsv = () => {
    const selectedTitle = events.find(event => String(event.id) === String(selectedEvent))?.title || 'event'
    const headers = ['Nama', 'Email', 'Status', 'Tanggal Daftar']
    const rows = registrations.map(reg => [
      reg.user_name,
      reg.user_email,
      reg.status || 'pending',
      reg.registered_at ? new Date(reg.registered_at).toLocaleString('id-ID') : ''
    ])
    const escapeCsv = (value) => {
      const str = value == null ? '' : String(value)
      return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
    }
    const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `peserta-${selectedTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative min-h-screen">
      <section className="relative min-h-[42vh] flex items-center overflow-hidden pt-20">
        <AdminHeroBackground variant="participants" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[1]" />
        <div className="container-editorial relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] border border-[#333333] px-5 py-2.5 mb-6">
              Participant Control
            </span>
            <h1 className="hero-title mb-6">
              KELOLA
              <br />
              <span className="text-[#525252]">PESERTA.</span>
            </h1>
            <p className="hero-subtitle">
              Review pendaftaran, validasi peserta, dan jaga kapasitas event tetap terkendali.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-sm relative z-10">
        <div className="container-editorial">
        {/* Success */}
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

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 border-l-2 border-red-400 bg-[#0a0a0a] flex items-center gap-2"
          >
            <X className="w-4 h-4 text-red-300 flex-shrink-0" />
            <span className="text-red-100 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Event Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
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

        {/* Participants List */}
        <div>
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 border border-[#222222] flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
              </div>
              <p className="text-[#737373] text-sm">Loading peserta...</p>
            </div>
          ) : registrations.length === 0 ? (
            <VintageCard>
              <p className="text-center text-[#737373] text-sm py-8">
                Belum ada peserta. Pilih event terlebih dahulu.
              </p>
            </VintageCard>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="mb-5 flex justify-end">
                <button
                  onClick={exportParticipantsCsv}
                  className="flex items-center gap-2 border border-[#333333] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-black transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
              {registrations.map((reg, i) => {
                const status = (reg.status || 'pending').toLowerCase()
                const isUpdating = updatingId === reg.id

                return (
                <motion.div
                  key={reg.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <VintageCard>
                    <div className="flex items-center justify-between gap-4 p-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{reg.user_name}</p>
                        <p className="text-xs text-[#737373] mt-1">{reg.user_email}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] border ${
                            status === 'approved'
                              ? 'bg-white text-black border-white'
                              : status === 'pending'
                              ? 'bg-[#0a0a0a] text-white border-[#222222]'
                              : 'bg-[#111111] text-[#737373] border-[#222222]'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                        {status === 'pending' && (
                          <div className="flex gap-1.5">
                            <motion.button
                              type="button"
                              whileHover={{ scale: isUpdating ? 1 : 1.05 }}
                              whileTap={{ scale: isUpdating ? 1 : 0.95 }}
                              onClick={() => updateStatus(reg.id, 'approved')}
                              disabled={isUpdating}
                              className="p-2 bg-white text-black hover:bg-[#eeeeee] transition disabled:cursor-not-allowed disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              type="button"
                              whileHover={{ scale: isUpdating ? 1 : 1.05 }}
                              whileTap={{ scale: isUpdating ? 1 : 0.95 }}
                              onClick={() => updateStatus(reg.id, 'rejected')}
                              disabled={isUpdating}
                              className="p-2 bg-[#0a0a0a] text-white hover:bg-[#111111] transition border border-[#222222] disabled:cursor-not-allowed disabled:opacity-50"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </VintageCard>
                </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
        </div>
      </section>
    </div>
  )
}
