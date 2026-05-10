import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg p-6 border border-red-500/50 bg-red-500/10"
    >
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-300">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition text-sm font-medium"
          >
            Retry
          </button>
        )}
      </div>
    </motion.div>
  )
}
