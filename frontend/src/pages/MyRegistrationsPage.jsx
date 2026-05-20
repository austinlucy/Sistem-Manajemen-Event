import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Download, CheckCircle, X, Ticket } from 'lucide-react'
import { registrationService } from '../services'
import useAlert from '../hooks/useAlert'
import { EditorialSection, VintageCard, RetroEventCard, VintageButton } from '../components/Vintage'

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelingId, setCancelingId] = useState(null)
  const { showAlert } = useAlert()

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await registrationService.getMyRegistrations()
      setRegistrations(response.data || [])
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
      setError('Failed to load your registrations')
      showAlert('Failed to load registrations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRegistration = async (registrationId, eventTitle) => {
    if (!window.confirm(`Apakah Anda yakin ingin membatalkan pendaftaran untuk "${eventTitle}"?`)) {
      return
    }

    try {
      setCancelingId(registrationId)
      await registrationService.cancelRegistration(registrationId)
      setRegistrations(prev => prev.filter(r => r.id !== registrationId))
      showAlert(`Pendaftaran untuk "${eventTitle}" telah dibatalkan`, 'success')
    } catch (err) {
      console.error('Failed to cancel registration:', err)
      const errorMsg = err.response?.data?.message || 'Failed to cancel registration'
      showAlert(errorMsg, 'error')
    } finally {
      setCancelingId(null)
    }
  }

  const handleDownloadTicket = (registration) => {
    const ticketContent = `
================================
      EVENT HUB - TIKET
================================

Event: ${registration.event_title}
Tanggal: ${new Date(registration.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Lokasi: ${registration.event_location || 'TBA'}
Status: ${registration.status?.toUpperCase() || 'PENDING'}

Didaftarkan oleh: ${registration.user_name || 'Guest'}
Tanggal Daftar: ${new Date(registration.created_at).toLocaleDateString('id-ID')}

================================
      TIDAK DAPAT DIPINDAH
         TANGAN
================================
    `.trim()

    const blob = new Blob([ticketContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tiket-${registration.event_title?.replace(/\s+/g, '-').toLowerCase() || 'event'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showAlert('Tiket berhasil diunduh!', 'success')
  }

  const now = new Date()
  const upcoming = registrations.filter(r => new Date(r.event_date) > now)
  const past = registrations.filter(r => new Date(r.event_date) <= now)

  const displayRegistrations = activeTab === 'upcoming' ? upcoming : past

  return (
    <div className="min-h-screen py-8 md:py-12">
      <EditorialSection
        title="Jadwal Saya"
        subtitle="Kelola pendaftaran event dan unduh tiket"
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'upcoming', label: 'Akan Datang', count: upcoming.length },
            { key: 'past', label: 'Selesai', count: past.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300
                ${activeTab === tab.key
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#666666] border border-[#222222] hover:border-white/30 hover:text-white'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 border-l-2 border-white bg-[#0a0a0a]"
          >
            <p className="text-white text-sm">{error}</p>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <VintageCard key={i} className="h-32">
                <div className="h-full skeleton-mono" />
              </VintageCard>
            ))}
          </div>
        ) : displayRegistrations.length > 0 ? (
          <div className="space-y-5">
            {displayRegistrations.map((reg, idx) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <VintageCard>
                  <div className="card-pad-sm md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-7">
                      {/* Date Box */}
                      <div className="flex-shrink-0 w-16 h-16 border border-white/10 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider">
                          {new Date(reg.event_date).toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-white">
                          {new Date(reg.event_date).getDate()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white uppercase tracking-tight truncate">
                          {reg.event_title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#666666]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(reg.event_date).toLocaleDateString('id-ID')}
                          </span>
                          {reg.event_location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {reg.event_location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`
                          px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]
                          ${reg.status === 'approved'
                            ? 'bg-white text-black'
                            : reg.status === 'pending'
                              ? 'bg-[#1a1a1a] text-[#888888] border border-[#333333]'
                              : 'bg-[#1a1a1a] text-[#666666] border border-[#333333]'
                          }
                        `}>
                          {reg.status || 'PENDING'}
                        </span>

                        {activeTab === 'upcoming' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownloadTicket(reg)}
                              className="p-2.5 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
                              title="Download Ticket"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelRegistration(reg.id, reg.event_title)}
                              disabled={cancelingId === reg.id}
                              className="p-2.5 border border-[#333333] text-[#666666] hover:text-white hover:border-white transition-colors disabled:opacity-40"
                              title="Cancel Registration"
                            >
                              {cancelingId === reg.id ? (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </VintageCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <VintageCard>
              <div className="card-pad text-center">
                <Ticket className="w-12 h-12 text-[#333333] mx-auto mb-4" />
                <p className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                  {activeTab === 'upcoming' ? 'Belum Ada Pendaftaran' : 'Tidak Ada Riwayat'}
                </p>
                <p className="text-sm text-[#666666] mb-6">
                  {activeTab === 'upcoming'
                    ? 'Anda belum mendaftar ke event apapun'
                    : 'Anda belum memiliki event yang selesai'}
                </p>
              </div>
            </VintageCard>
          </motion.div>
        )}
      </EditorialSection>
    </div>
  )
}
