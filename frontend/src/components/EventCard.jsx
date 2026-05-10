import { motion } from 'framer-motion'

export default function EventCard({ event, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="glass rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition group"
    >
      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden relative">
        {event.banner ? (
          <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/50 text-center">No Banner</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-lg line-clamp-2 flex-1">{event.title}</h3>
          <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-1 rounded ml-2 whitespace-nowrap">
            {event.category_name || 'Others'}
          </span>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4">{event.description}</p>

        <div className="space-y-2 text-sm text-slate-300 mb-4">
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📅</span>
            <span>{new Date(event.event_date).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>👥</span>
            <span>Quota: {event.quota}</span>
          </div>
        </div>

        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition">
          View Details
        </button>
      </div>
    </motion.div>
  )
}
