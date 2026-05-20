import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Users, Ticket, CheckCircle, User, Clock } from 'lucide-react'
import { eventService, registrationService } from '../services'
import { AuthContext } from '../context/AuthContext'
import useAlert from '../hooks/useAlert'
import { VintageButton, VintageCard } from '../components/Vintage'
import { getEventImageData, resolveEventImageUrl } from '../utils/eventImageMapper'
import HeroConstellationBackground from '../components/HeroConstellationBackground'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const BASE_URL = API_URL.replace('/api', '')

export default function EventDetailPage() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const { showAlert } = useAlert()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)
  const [heroError, setHeroError] = useState(false)

  const imageData = event ? getEventImageData(event) : null
  const heroImageUrl = event ? resolveEventImageUrl(event, BASE_URL) : ''
  const heroFallbackUrl = imageData?.fallback || ''

  useEffect(() => {
    fetchEventDetail()
  }, [id])

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await eventService.getEventById(id)
      setEvent(response.data)

      try {
        const schedResponse = await eventService.getEventSchedules(id)
        setSchedules(schedResponse.data || [])
      } catch (schedErr) {
        setSchedules([])
      }

      if (user) {
        const registrationsRes = await registrationService.getMyRegistrations()
        const isReg = registrationsRes.data.some(r => r.event_id == id)
        setIsRegistered(isReg)
      }
    } catch (err) {
      console.error('Failed to fetch event:', err)
      setError('Failed to load event details')
      showAlert('Failed to load event details', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setRegistering(true)
      setError('')
      await registrationService.registerEvent(id)
      showAlert(`Berhasil mendaftar untuk "${event.title}"!`, 'success')
      setIsRegistered(true)
      setSuccess(`Berhasil mendaftar untuk "${event.title}"!`)
      setTimeout(() => navigate('/my-registrations'), 1500)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to register'
      setError(errorMsg)
      showAlert(errorMsg, 'error')
    } finally {
      setRegistering(false)
    }
  }

  const handleHeroLoad = useCallback(() => setHeroLoading(false), [])
  const handleHeroError = useCallback(() => {
    setHeroError(true)
    setHeroLoading(false)
  }, [])

  const formatScheduleTime = (dt) => {
    if (!dt) return '-'
    return new Date(dt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border border-[#333333] flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-sm text-[#737373]">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <VintageCard className="text-center p-10">
          <p className="text-white text-lg mb-2">Event tidak ditemukan</p>
          <p className="text-[#737373] text-sm mb-6">Event yang kamu cari mungkin sudah dihapus</p>
          <VintageButton variant="outline" onClick={() => navigate('/events')}>
            Kembali ke Events
          </VintageButton>
        </VintageCard>
      </div>
    )
  }

  const registeredCount = event.registered_count || 0
  const remainingQuota = Math.max(0, event.quota - registeredCount)
  const percentage = Math.min(100, Math.round((registeredCount / event.quota) * 100)) || 0

  return (
    <div className="relative min-h-screen">
      {/* ===== HERO BACKGROUND ===== */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden">
        <HeroConstellationBackground />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[1]" />
      </div>

      <div className="relative z-10 pt-24 pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/events')}
          className="container-editorial mb-8 text-sm text-[#737373] hover:text-white transition-colors duration-300 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Events
        </motion.button>

        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Hero Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-48 md:h-72 lg:h-96 overflow-hidden border border-[#1a1a1a]"
            >
              <AnimatePresence>
                {heroLoading && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-10"
                  >
                    <div className="w-full h-full skeleton" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.img
                src={heroError ? heroFallbackUrl : heroImageUrl}
                alt={imageData?.alt || event.title}
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(0.3)' }}
                onLoad={handleHeroLoad}
                onError={handleHeroError}
                initial={{ opacity: 0 }}
                animate={{ opacity: heroLoading ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {imageData && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 left-4 px-4 py-2 text-[10px] font-bold text-black uppercase tracking-[0.2em] bg-white"
                >
                  {imageData.categoryLabel.toUpperCase()}
                </motion.div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Title & Category */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex gap-2 md:gap-3 flex-wrap mb-4">
                    <span className="inline-block px-3 md:px-4 py-1.5 text-[10px] font-bold text-black uppercase tracking-[0.2em] bg-white">
                      {event.category_name || 'Event'}
                    </span>
                    {new Date(event.event_date) > new Date() ? (
                      <span className="inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-[0.2em] bg-[#111111] border border-[#222222]">
                        <CheckCircle className="w-3 h-3" />
                        Upcoming
                      </span>
                    ) : (
                      <span className="inline-block px-3 md:px-4 py-1.5 text-[10px] font-bold text-[#737373] uppercase tracking-[0.2em] bg-[#111111] border border-[#222222]">
                        Selesai
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-[-0.03em] leading-tight uppercase">
                    {event.title}
                  </h1>
                </motion.div>

                {/* Messages */}
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert-error">
                    <p className="text-white text-sm">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-white" />
                    <p className="text-white text-sm">{success}</p>
                  </motion.div>
                )}

                {/* Event Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <VintageCard>
                    <div className="card-pad">
                      <h2 className="card-title card-divider">
                        Detail Event
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
                      {[
                        { Icon: Calendar, label: 'Tanggal & Waktu', value: new Date(event.event_date).toLocaleString('id-ID') },
                        { Icon: MapPin, label: 'Lokasi', value: event.location },
                        { Icon: Users, label: 'Sisa Kuota', value: `${remainingQuota} slot tersedia` },
                        { Icon: Ticket, label: 'Status Pendaftaran', value: isRegistered ? 'Terdaftar' : 'Belum terdaftar' },
                      ].map(({ Icon, label, value }, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-10 h-10 bg-[#0a0a0a] border border-[#222222] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] text-[#737373] uppercase tracking-[0.15em] font-bold">{label}</p>
                            <p className="font-medium text-white text-sm mt-0.5">{value}</p>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </VintageCard>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <VintageCard>
                    <div className="card-pad">
                      <h2 className="card-title card-divider">
                        Tentang Event
                      </h2>
                      <p className="text-[#a3a3a3] leading-7 text-sm md:text-[15px]">{event.description}</p>
                    </div>
                  </VintageCard>
                </motion.div>

                {/* Schedules / Rundown */}
                {schedules.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <VintageCard>
                      <div className="card-pad">
                        <h2 className="card-title card-divider flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Rundown Acara
                        </h2>
                        <div className="space-y-4">
                          {schedules.map((schedule, idx) => (
                            <div key={schedule.id} className={`flex items-start gap-4 pb-4 ${idx !== schedules.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                              <div className="w-10 h-10 bg-[#0a0a0a] border border-[#222222] flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">{idx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-bold text-white">{schedule.activity_name}</h3>
                                <p className="text-xs text-[#737373] mt-1">
                                  {formatScheduleTime(schedule.start_time)} - {formatScheduleTime(schedule.end_time)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </VintageCard>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <VintageCard>
                  <div className="card-pad space-y-6">
                    {/* Register Button */}
                    <VintageButton
                      onClick={handleRegister}
                      disabled={registering || isRegistered || new Date(event.event_date) < new Date()}
                      isLoading={registering}
                      variant={isRegistered ? 'secondary' : 'primary'}
                      size="md"
                      className="w-full"
                    >
                      {isRegistered ? 'Sudah Terdaftar' : 'Daftar Sekarang'}
                    </VintageButton>

                    {/* Quota */}
                    <div className="border-t border-white/[0.08] pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] text-[#737373] uppercase tracking-[0.15em] font-bold">Kuota</p>
                        <p className="font-bold text-white text-sm">{percentage}%</p>
                      </div>
                      <div className="w-full bg-[#0a0a0a] border border-[#1a1a1a] h-2 overflow-hidden">
                        <motion.div
                          className="bg-white h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-[#737373] mt-3">
                        <span className="font-semibold text-white">{registeredCount}</span> / <span className="font-semibold">{event.quota}</span> terdaftar
                      </p>
                    </div>

                    {/* Organizer */}
                    <div className="border-t border-white/[0.08] pt-6">
                      <p className="text-[10px] text-[#737373] uppercase tracking-[0.15em] font-bold mb-3">Dikelola oleh</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0a0a0a] border border-[#222222] flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-medium text-white text-sm">{event.admin_name || 'Admin'}</p>
                      </div>
                    </div>
                  </div>
                </VintageCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
