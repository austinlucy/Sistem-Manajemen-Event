import { motion } from 'framer-motion'

export default function LoadingCard() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="card-editorial rounded-ed overflow-hidden p-0"
    >
      <div className="h-52 md:h-56 bg-ed-light animate-pulse"></div>
      <div className="p-5 md:p-6">
        <div className="h-4 bg-ed-soft rounded mb-3 animate-pulse"></div>
        <div className="h-4 bg-ed-soft rounded mb-4 w-3/4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-3 bg-ed-soft rounded animate-pulse"></div>
          <div className="h-3 bg-ed-soft rounded animate-pulse"></div>
          <div className="h-3 bg-ed-soft rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
