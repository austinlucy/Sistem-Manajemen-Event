import { motion } from 'framer-motion'

export default function LoadingCard() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="glass rounded-lg overflow-hidden p-6"
    >
      <div className="h-48 bg-slate-700 rounded mb-4 animate-pulse"></div>
      <div className="h-4 bg-slate-700 rounded mb-3 animate-pulse"></div>
      <div className="h-4 bg-slate-700 rounded mb-4 w-3/4 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-700 rounded animate-pulse"></div>
        <div className="h-3 bg-slate-700 rounded animate-pulse"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2 animate-pulse"></div>
      </div>
    </motion.div>
  )
}
