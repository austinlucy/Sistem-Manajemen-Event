import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { adminService } from '../services'

export default function AdminParticipantsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    if (selectedEvent) {
      fetchRegistrations(selectedEvent)
    }
  }, [selectedEvent])

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
      if (selectedEvent) {
        fetchRegistrations(selectedEvent)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Manage Participants</h1>
        <p className="text-slate-400">Approve or reject event registrations</p>
      </motion.div>

      <div className="glass rounded-lg p-6 space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">👥</div>
            <p className="text-slate-400">Loading participants...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No participants to manage. Select an event first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600"
              >
                <div>
                  <p className="text-white font-medium">{reg.user_name}</p>
                  <p className="text-slate-400 text-sm">{reg.user_email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reg.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                    reg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {reg.status || 'Pending'}
                  </span>
                  {reg.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(reg.id, 'approved')}
                        className="p-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(reg.id, 'rejected')}
                        className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
