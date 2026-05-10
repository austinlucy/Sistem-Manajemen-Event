import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Upload } from 'lucide-react'
import { eventService } from '../services'
import ErrorMessage from '../components/ErrorMessage'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    quota: '',
    event_date: '',
    category_id: '',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventService.getAllEvents({ limit: 100 })
      setEvents(response.data.data || [])
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    try {
      await eventService.createEvent(formData)
      setFormData({ title: '', description: '', location: '', quota: '', event_date: '', category_id: '' })
      setShowForm(false)
      fetchEvents()
    } catch (err) {
      setError('Failed to create event')
    }
  }

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await eventService.deleteEvent(id)
        fetchEvents()
      } catch (err) {
        setError('Failed to delete event')
      }
    }
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Events</h1>
          <p className="text-slate-400">Create and manage campus events</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </motion.div>

      {error && <ErrorMessage message={error} onRetry={fetchEvents} />}

      {/* Add Event Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddEvent}
          className="glass rounded-lg p-6 mb-8 space-y-4"
        >
          <input
            type="text"
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg glass border border-slate-600 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg glass border border-slate-600 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 rounded-lg glass border border-slate-600 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500"
            required
          />
          <input
            type="number"
            placeholder="Quota"
            value={formData.quota}
            onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
            className="w-full px-4 py-2 rounded-lg glass border border-slate-600 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500"
            required
          />
          <input
            type="datetime-local"
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg glass border border-slate-600 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition font-medium">
              Create Event
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-lg bg-slate-600/20 text-slate-300 hover:bg-slate-600/30 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin text-4xl mb-4">📅</div>
          <p className="text-slate-400">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="glass rounded-lg p-12 text-center">
          <p className="text-slate-400">No events yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-lg p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-white font-bold">{event.title}</h3>
                <p className="text-slate-400 text-sm">{event.location} • {new Date(event.event_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
