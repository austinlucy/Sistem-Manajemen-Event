import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { adminService, eventService } from '../services'
import { VintageCard } from '../components/Vintage'
import AdminHeroBackground from '../components/AdminHeroBackground'

export default function AdminParticipantsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
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
      const response = await eventService.getAllEvents()
      const eventsData = response.data?.data ?? response.data
      setEvents(Array.isArray(eventsData) ? eventsData : [])
    } catch (e) {
      console.error('Failed to fetch events:', e)
    }
  }

  const fetchRegistrations = async (eventId) => {
    try {
      setLoading(true)
      const response = await adminService.getRegistrations(eventId)
      setRegistrations(response.data || [])
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (registrationId, status) => {
    try {
      await adminService.updateRegistrationStatus(registrationId, status)
      setSuccess(`✓ Peserta ${status === 'approved' ? 'diterima' : 'ditolak'}!`)
      if (selectedEvent) {
        fetchRegistrations(selectedEvent)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
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
              {registrations.map((reg, i) => (
                <motion.div
                  key={i}
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
                            reg.status === 'approved'
                              ? 'bg-white text-black border-white'
                              : reg.status === 'pending'
                              ? 'bg-[#0a0a0a] text-white border-[#222222]'
                              : 'bg-[#111111] text-[#737373] border-[#222222]'
                          }`}
                        >
                          {reg.status ? reg.status.charAt(0).toUpperCase() + reg.status.slice(1) : 'Pending'}
                        </span>
                        {reg.status === 'pending' && (
                          <div className="flex gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateStatus(reg.id, 'approved')}
                              className="p-2 bg-white text-black hover:bg-[#eeeeee] transition"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateStatus(reg.id, 'rejected')}
                              className="p-2 bg-[#0a0a0a] text-white hover:bg-[#111111] transition border border-[#222222]"
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
              ))}
            </motion.div>
          )}
        </div>
        </div>
      </section>
    </div>
  )
}
