import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react'
import { adminService } from '../services'
import ErrorMessage from '../components/ErrorMessage'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminService.getDashboardStats()
      setStats(response.data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📊</div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { icon: Calendar, label: 'Total Events', value: stats?.totalEvents || 0, color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Total Participants', value: stats?.totalParticipants || 0, color: 'from-purple-500 to-purple-600' },
    { icon: TrendingUp, label: 'Active Events', value: stats?.activeEvents || 0, color: 'from-green-500 to-green-600' },
    { icon: BarChart3, label: 'Pending Approvals', value: stats?.pendingApprovals || 0, color: 'from-yellow-500 to-yellow-600' },
  ]

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your event overview.</p>
      </motion.div>

      {error && <ErrorMessage message={error} onRetry={fetchStats} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition font-medium">
            + Add New Event
          </button>
          <button className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition font-medium">
            View Registrations
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition font-medium">
            Export Report
          </button>
        </div>
      </motion.div>
    </div>
  )
}
