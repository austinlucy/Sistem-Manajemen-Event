import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { eventService } from '../services'
import {
  RetroEventCard,
  EditorialSection,
  VintageButton,
  VintageCard
} from '../components/Vintage'
import ErrorMessage from '../components/ErrorMessage'
import HeroWavesBackground from '../components/HeroWavesBackground'

export default function HomePage() {
  const [latestEvents, setLatestEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalParticipants: 0,
    eventsThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [eventsResponse, statsResponse] = await Promise.all([
        eventService.getAllEvents({ limit: 12, sort: 'date_asc' }),
        eventService.getPublicStats()
      ])
      const eventsData = eventsResponse.data?.data ?? eventsResponse.data
      const events = Array.isArray(eventsData) ? eventsData : []

      const now = new Date()
      const upcoming = events.filter(e => new Date(e.event_date) > now)
      const latest = events.slice(0, 6)

      setLatestEvents(latest)
      setUpcomingEvents(upcoming.slice(0, 6))
      setStats(statsResponse.data || {
        activeEvents: 0,
        totalParticipants: 0,
        eventsThisMonth: 0,
      })
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const SkeletonCard = () => (
    <VintageCard className="h-96 !p-0" animate={false}>
      <div className="h-full skeleton" />
    </VintageCard>
  )

  return (
    <div className="relative">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <HeroWavesBackground />

        {/* Gradient overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[1]" />

        <div className="container-editorial relative z-10 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8"
              >
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] border border-[#333333] px-5 py-2.5">
                  Campus Event System
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="hero-title mb-8"
              >
                MANAGE.
                <br />
                CREATE.
                <br />
                <span className="text-[#525252]">ORGANIZE.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="hero-subtitle mb-10"
              >
                Sistem manajemen event kampus untuk mengelola kegiatan,
                peserta, jadwal, dan laporan secara lebih mudah.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <VintageButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/events')}
                  className="flex items-center justify-center gap-2"
                >
                  Jelajahi Event
                  <ArrowRight className="w-4 h-4" />
                </VintageButton>
                <VintageButton
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('stats').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2"
                >
                  Lihat Statistik
                </VintageButton>
              </motion.div>
            </motion.div>

            {/* Right - Abstract Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Floating circles */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-0 right-8 w-32 h-32 border border-white/10 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-16 left-4 w-48 h-48 bg-[#0a0a0a] rounded-[40px] -rotate-12 border border-white/5"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-8 right-0 w-24 h-24 bg-black rounded-2xl rotate-12 border border-white/5"
                />

                {/* Cross lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-white/10 rotate-45" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-white/10 -rotate-45" />

                {/* Center card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group relative z-10 mx-auto w-64 overflow-hidden border border-white/10 bg-[#0a0a0a]/70 px-8 py-9 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-white/25 hover:shadow-[0_28px_90px_rgba(255,255,255,0.06)]"
                  style={{ backdropFilter: 'blur(18px) saturate(1.2)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.055] via-transparent to-transparent opacity-70 pointer-events-none" />
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-white/10 opacity-50" />
                  <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full border border-white/5 opacity-60" />

                  <div className="relative z-10">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[14px] border border-white/20 bg-black/35 transition-all duration-300 group-hover:scale-[1.04] group-hover:border-white/35">
                      <svg
                        viewBox="0 0 64 64"
                        className="h-10 w-10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <rect x="7" y="7" width="50" height="50" rx="8" stroke="rgba(255,255,255,0.38)" strokeWidth="1.4" />
                        <path d="M19 20H34V25H25V30H33V35H25V40H35" stroke="white" strokeWidth="3.2" strokeLinecap="square" strokeLinejoin="miter" />
                        <path d="M39 20V40M39 30H48M48 20V40" stroke="white" strokeWidth="3.2" strokeLinecap="square" strokeLinejoin="miter" />
                        <path d="M15 15H49M15 49H49" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                        <circle cx="50" cy="14" r="1.5" fill="rgba(255,255,255,0.55)" />
                      </svg>
                    </div>

                    <h3 className="mb-2.5 text-[12px] font-black uppercase tracking-[0.24em] text-white">
                      Event Hub
                    </h3>
                    <p className="mx-auto max-w-[170px] text-[10px] leading-relaxed tracking-[0.08em] text-[#737373]">
                      Kelola semua kegiatan kampus
                    </p>
                  </div>
                </motion.div>

                {/* Decorative dots */}
                <div className="absolute top-4 left-16 w-2 h-2 bg-black rounded-full border border-white/20" />
                <div className="absolute bottom-20 left-0 w-3 h-3 border border-white/20 rounded-full" />
                <div className="absolute top-32 right-4 w-1.5 h-1.5 bg-white/30 rounded-full" />

                <div className="w-full h-[400px]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section id="stats" className="section relative">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="divider-left mb-6 max-w-[120px]" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-[-0.03em] uppercase">
              Statistik
            </h2>
            <p className="text-[#737373] mt-3 text-base max-w-xl">
              Data terkini dari sistem event kampus
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              { Icon: Calendar, label: 'Total Event', value: stats.activeEvents },
              { Icon: Users, label: 'Total Peserta', value: stats.totalParticipants },
              { Icon: TrendingUp, label: 'Bulan Ini', value: stats.eventsThisMonth },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <VintageCard className="text-center py-10 md:py-12" glow>
                  <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 border border-[#333333] flex items-center justify-center">
                      <stat.Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <motion.p
                    key={stat.value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-[11px] text-[#737373] uppercase tracking-[0.15em] font-bold">
                    {stat.label}
                  </p>
                </VintageCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {/* ===== FEATURED EVENTS ===== */}
      <EditorialSection
        title="Event Terbaru"
        subtitle="Jelajahi event kampus yang sedang berlangsung"
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {latestEvents.map((event) => (
                <RetroEventCard
                  key={event.id}
                  event={event}
                  onRegister={() => {
                    if (!localStorage.getItem('token')) {
                      navigate('/login')
                    } else {
                      navigate(`/events/${event.id}`)
                    }
                  }}
                />
              ))}
            </div>

            <div className="text-center pt-10 border-t border-[#1a1a1a]">
              <VintageButton
                variant="outline"
                onClick={() => navigate('/events')}
                className="inline-flex items-center gap-2"
              >
                Lihat Semua Event
                <ArrowRight className="w-4 h-4" />
              </VintageButton>
            </div>
          </>
        )}
      </EditorialSection>

      {/* ===== UPCOMING EVENTS ===== */}
      {upcomingEvents.length > 0 && (
        <EditorialSection
          title="Akan Datang"
          subtitle="Jangan lewatkan event berikutnya"
          containerClassName="bg-[#050505]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <RetroEventCard
                key={event.id}
                event={event}
                onRegister={() => {
                  if (!localStorage.getItem('token')) {
                    navigate('/login')
                  } else {
                    navigate(`/events/${event.id}`)
                  }
                }}
              />
            ))}
          </div>
        </EditorialSection>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="section bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-[-0.03em] uppercase text-white">
              Siap Bergabung?
            </h2>
            <p className="text-base sm:text-lg mb-10 text-[#737373] leading-relaxed max-w-2xl mx-auto">
              Buat akun sekarang dan mulai jelajahi event kampus yang sesuai dengan minat kamu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <VintageButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
              >
                Buat Akun
              </VintageButton>
              <VintageButton
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Masuk
              </VintageButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
