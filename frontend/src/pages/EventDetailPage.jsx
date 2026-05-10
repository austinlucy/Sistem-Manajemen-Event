import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react'
import { eventService, registrationService } from '../services'
import { AuthContext } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

export default function EventDetailPage() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    fetchEventDetail()
  }, [id])

  const fetchEventDetail = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await eventService.getEventById(id)
      setEvent(response.data)

      // check apakah user sudah register
      if (user) {
        const registrationsRes = await registrationService.getMyRegistrations()
        const isReg = registrationsRes.data.some(r => r.event_id == id)
        setIsRegistered(isReg)
      }
    } catch (err) {
      console.error('Failed to fetch event:', err)
      setError('Failed to load event details')
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
      setSuccess('Successfully registered for event!')
      setIsRegistered(true)
      setTimeout(() => navigate('/my-registrations'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full glass">
            <div className="animate-spin">⚡</div>
          </div>
          <p className="text-slate-400">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="py-8">
        <ErrorMessage message="Event not found" />
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="mb-6 text-slate-400 hover:text-white transition text-sm"
      >
        ← Back to Events
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Banner */}
        <div className="h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden">
          {event.banner ? (
            <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white/50 text-center">No Banner</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-sm">
                {event.category_name || 'Event'}
              </span>
            </div>

            {error && <ErrorMessage message={error} />}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-300"
              >
                ✓ {success}
              </motion.div>
            )}

            {/* Details */}
            <div className="glass rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Date & Time</p>
                    <p className="text-white font-medium">{new Date(event.event_date).toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white font-medium">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Quota</p>
                    <p className="text-white font-medium">{event.quota} slots</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <p className="text-white font-medium">{new Date(event.event_date) > new Date() ? 'Upcoming' : 'Finished'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-slate-300 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-6 sticky top-24 space-y-4"
            >
              <button
                onClick={handleRegister}
                disabled={registering || isRegistered || new Date(event.event_date) < new Date()}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  isRegistered
                    ? 'bg-green-500/20 text-green-300 cursor-default'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                }`}
              >
                {registering ? 'Registering...' : isRegistered ? '✓ Already Registered' : 'Register Now'}
              </button>

              <div className="space-y-3 border-t border-slate-700 pt-4">
                <div>
                  <p className="text-slate-400 text-sm">Quota</p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">65 / 100 registered</p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-xs text-slate-400 mb-2">Organized by</p>
                <p className="text-white font-medium">{event.admin_name || 'Admin'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
