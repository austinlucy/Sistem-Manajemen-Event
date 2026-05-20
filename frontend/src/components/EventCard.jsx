import { motion } from 'framer-motion'
import { MapPin, Calendar, Users } from 'lucide-react'

export default function EventCard({ event, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer hover:border-[#333333] hover:shadow-mono-lg transition-all duration-500 group"
    >
      {/* Banner */}
      <div className="h-48 bg-[#111111] overflow-hidden relative">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#525252] text-sm">No Banner</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-lg line-clamp-2 flex-1">{event.title}</h3>
          <span className="text-[10px] bg-[#111111] border border-[#222222] text-[#a3a3a3] px-2 py-1 ml-2 whitespace-nowrap uppercase tracking-wider font-bold">
            {event.category_name || 'Others'}
          </span>
        </div>

        <p className="text-[#737373] text-sm line-clamp-2 mb-4">{event.description}</p>

        <div className="space-y-2 text-sm text-[#a3a3a3] mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#525252]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#525252]" />
            <span>{new Date(event.event_date).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#525252]" />
            <span>Quota: {event.quota}</span>
          </div>
        </div>

        <button className="w-full py-2.5 text-xs font-bold uppercase tracking-[0.15em] bg-white text-black hover:bg-[#eeeeee] transition-colors duration-300">
          View Details
        </button>
      </div>
    </motion.div>
  )
}
