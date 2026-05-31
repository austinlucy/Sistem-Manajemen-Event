import { motion } from 'framer-motion'
import { MapPin, Calendar, Users } from 'lucide-react'
import { resolveEventImageUrl } from '../utils/eventImageMapper'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/api'
const BASE_URL = API_URL.replace('/api', '')

export default function EventCard({ event, onClick }) {
  const finalImageUrl = resolveEventImageUrl(event, BASE_URL)
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer hover:border-[#333333] hover:shadow-mono-lg transition-all duration-500 group"
    >
      {/* Banner */}
      <div className="h-48 bg-[#111111] overflow-hidden relative">
        <img
          src={finalImageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23111111" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23525252"%3ENo Banner%3C/text%3E%3C/svg%3E'
          }}
        />
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
