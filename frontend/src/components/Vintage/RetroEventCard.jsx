import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Users, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import VintageCard from './VintageCard'
import { getEventImageData, resolveEventImageUrl } from '../../utils/eventImageMapper'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/api'
const BASE_URL = API_URL.replace('/api', '')

export default function RetroEventCard({ event, isRegistered, onRegister, onUnregister }) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const eventDate = new Date(event.event_date)
  const isUpcoming = eventDate > new Date()

  const imageData = getEventImageData(event)
  const finalImageUrl = resolveEventImageUrl(event, BASE_URL)
  const fallbackImageUrl = imageData.fallback

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoading(false)
  }, [])

  return (
    <VintageCard
      className="h-full flex flex-col overflow-hidden group cursor-pointer !p-0"
      hover
    >
      {/* Image Container */}
      <div className="relative h-52 md:h-56 overflow-hidden bg-[#111111] border-b border-white/[0.06]">
        <AnimatePresence>
          {imageLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-10"
            >
              <div className="w-full h-full skeleton-mono" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.img
          src={imageError ? fallbackImageUrl : finalImageUrl}
          alt={imageData.alt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          style={{ filter: 'grayscale(0.2)' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoading ? 0 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold text-black uppercase tracking-[0.2em] bg-white"
        >
          {imageData.categoryLabel.toUpperCase()}
        </motion.div>

        {isRegistered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-white text-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            ✓ Registered
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5 md:p-6 lg:p-7">
        {/* Title */}
        <h3 className="min-h-[44px] text-base md:text-[17px] font-bold text-white mb-3 leading-snug tracking-tight line-clamp-2 group-hover:text-[#cccccc] transition-colors">
          <Link to={`/events/${event.id}`} className="inline-flex items-center gap-1">
            {event.title}
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </Link>
        </h3>

        {/* Description */}
        {event.description && (
          <p className="min-h-[44px] text-sm text-[#666666] mb-5 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="space-y-3 mb-5 text-sm text-[#888888]">
          <div className="flex items-center gap-2.5">
            <Calendar size={14} className="text-[#444444] flex-shrink-0" />
            <span className="text-xs">{eventDate.toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-[#444444] flex-shrink-0" />
              <span className="line-clamp-1 text-xs">{event.location}</span>
            </div>
          )}
          {event.participant_count !== undefined && (
            <div className="flex items-center gap-2.5">
              <Users size={14} className="text-[#444444] flex-shrink-0" />
              <span className="text-xs">{event.participant_count} peserta</span>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="mt-auto pt-5 border-t border-white/[0.06]">
          {isRegistered ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onUnregister && onUnregister(event.id)}
              className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] bg-[#1a1a1a] text-white border border-[#333333] hover:bg-[#222222] transition-colors"
            >
              Batalkan Pendaftaran
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onRegister && onRegister(event.id)}
              disabled={!isUpcoming}
              className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] bg-white text-black border border-white hover:bg-transparent hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isUpcoming ? 'Daftar Sekarang' : 'Event Selesai'}
            </motion.button>
          )}
        </div>
      </div>
    </VintageCard>
  )
}
