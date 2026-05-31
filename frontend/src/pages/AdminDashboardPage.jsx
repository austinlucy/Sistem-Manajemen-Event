import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Users, Activity, Clock, RefreshCw, Download, BarChart3, LayoutDashboard } from 'lucide-react'
import { DashboardContext } from '../context/DashboardContext'
import { adminService } from '../services'
import { VintageCard, VintageButton } from '../components/Vintage'
import HeroDashboardBackground from '../components/HeroDashboardBackground'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { stats, loading, error, refreshStats, lastUpdated } = useContext(DashboardContext)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refreshStats()
    setIsRefreshing(false)
  }

  const getLastUpdateTime = () => {
    if (!lastUpdated) return 'Never'
    const now = new Date()
    const diff = Math.floor((now - lastUpdated) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return lastUpdated.toLocaleTimeString()
  }

  const handleExportReport = async () => {
    try {
      const response = await adminService.exportReport()
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `event-hub-report-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export report:', err)
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border border-[#222222] flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-[#737373] text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { icon: CalendarDays, label: 'Total Events', value: stats?.totalEvents || 0 },
    { icon: Users, label: 'Total Peserta', value: stats?.totalParticipants || 0 },
    { icon: Activity, label: 'Event Aktif', value: stats?.activeEvents || 0 },
    { icon: Clock, label: 'Menunggu Approval', value: stats?.pendingApprovals || 0 },
  ]

  return (
    <div className="relative min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-24">
        <HeroDashboardBackground />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[1]" />

        <div className="container-editorial relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] border border-[#333333] px-5 py-2.5 mb-6">
              Admin Panel
            </span>
            <h1 className="hero-title mb-6">
              DASH
              <br />
              <span className="text-[#525252]">BOARD.</span>
            </h1>
            <p className="hero-subtitle">
              Monitor event, peserta, dan approval dalam satu panel operasional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS OVERVIEW ===== */}
      <section className="section-sm relative z-10">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-[#525252]" />
              <p className="text-xs text-[#525252] uppercase tracking-[0.1em] font-medium">
                Last updated: {getLastUpdateTime()}
              </p>
            </div>
            <VintageButton
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-[#333333] text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </VintageButton>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <VintageCard>
                <p className="text-white border-l-2 border-white pl-4 text-sm">{error}</p>
              </VintageCard>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
          >
            {statCards.map((card, i) => (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <VintageCard className="h-full min-h-[154px] group hover:border-[#333333] transition-colors duration-300">
                  <div className="flex h-full flex-col justify-between p-5 md:p-6">
                    <div className="flex items-center gap-3 min-h-[34px]">
                      <div className="w-9 h-9 bg-[#0a0a0a] border border-[#222222] flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-[#3a3a3a]">
                        <card.icon className="w-4 h-4 text-white" strokeWidth={1.7} />
                      </div>
                      <p className="text-[10px] text-[#737373] uppercase tracking-[0.16em] font-bold leading-[1.35]">
                        {card.label}
                      </p>
                    </div>

                    <motion.p
                      key={card.value}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      className="mt-7 md:mt-8 text-[44px] md:text-[52px] font-black text-white tracking-[-0.045em] leading-[0.88] tabular-nums"
                    >
                      {card.value}
                    </motion.p>
                  </div>
                </VintageCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <VintageCard className="h-full">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1a1a1a]">
                  <div className="w-8 h-8 bg-[#0a0a0a] border border-[#222222] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight uppercase">
                      Quick Actions
                    </h2>
                    <p className="text-[10px] text-[#525252] uppercase tracking-[0.1em] mt-0.5">
                      Akses cepat ke fitur utama
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <VintageButton
                    onClick={() => navigate('/admin/events')}
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Tambah Event
                  </VintageButton>
                  <VintageButton
                    onClick={() => navigate('/admin/participants')}
                    variant="secondary"
                    size="md"
                    className="w-full justify-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Registrasi
                  </VintageButton>
                  <VintageButton
                    onClick={handleExportReport}
                    variant="outline"
                    size="md"
                    className="w-full justify-center border-[#333333] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </VintageButton>
                </div>
              </VintageCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <VintageCard className="h-full">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#1a1a1a]">
                  <div className="w-8 h-8 bg-[#0a0a0a] border border-[#222222] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight uppercase">
                      Hari Ini
                    </h2>
                    <p className="text-[10px] text-[#525252] uppercase tracking-[0.1em] mt-0.5">
                      Ringkasan tanggal
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#737373] leading-relaxed">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </VintageCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
