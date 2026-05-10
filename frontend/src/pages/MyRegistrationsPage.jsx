import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Ticket, Download } from 'lucide-react'
import { registrationService } from '../services'
import ErrorMessage from '../components/ErrorMessage'

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🎫</div>
          <p className="text-slate-400">Loading your registrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">My Registrations</h1>
        <p className="text-slate-400">Manage your event registrations</p>
      </motion.div>

      {error && <ErrorMessage message={error} onRetry={fetchRegistrations} />}

      {registrations.length === 0 ? (
        <div className="glass rounded-lg p-12 text-center">
          <Ticket className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-white mb-2">No Registrations Yet</h2>
          <p className="text-slate-400">You haven't registered for any events. Browse events to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-lg p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-bold text-lg">{reg.event_title}</h3>
                <p className="text-slate-400 text-sm">Registered: {new Date(reg.registered_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-400">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    reg.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                    reg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {reg.status || 'Pending'}
                  </span>
                </div>
                <button className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
