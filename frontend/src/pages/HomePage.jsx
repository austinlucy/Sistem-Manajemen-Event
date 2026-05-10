import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Calendar, Users, TrendingUp } from 'lucide-react'
import { eventService } from '../services'
import EventCard from '../components/EventCard'
import LoadingCard from '../components/LoadingCard'
import ErrorMessage from '../components/ErrorMessage'

export default function HomePage() {
  const [latestEvents, setLatestEvents] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await eventService.getAllEvents({ limit: 8 })
      const events = response.data.data || []

      // pisahkan latest dan upcoming
      const now = new Date()
      const upcoming = events.filter(e => new Date(e.event_date) > now)
      const latest = events.slice(0, 4)

      setLatestEvents(latest)
      setUpcomingEvents(upcoming.slice(0, 4))
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="glass rounded-xl p-8 md:p-12 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover <span className="gradient-text">Amazing Events</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Join thousands of students in exciting campus events. Network, learn, and have fun with our comprehensive event management platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/events')}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition"
              >
                Explore Events
              </motion.button>
              <button className="px-8 py-3 rounded-lg border border-indigo-500/50 text-indigo-300 font-medium hover:bg-indigo-500/10 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {[
          { icon: Calendar, label: 'Active Events', value: '50+' },
          { icon: Users, label: 'Total Participants', value: '2K+' },
          { icon: TrendingUp, label: 'Events This Month', value: '15+' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.section>

      {error && <ErrorMessage message={error} onRetry={fetchEvents} />}

      {/* Latest Events */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Latest Events</h2>
          <button
            onClick={() => navigate('/events')}
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
