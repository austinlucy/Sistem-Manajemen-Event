import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-ed-sm p-6 border border-ed-border bg-ed-light"
    >
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-ed-dark flex-shrink-0" />
        <div className="flex-1">
          <p className="text-ed-dark text-sm">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-ed-sm bg-ed-black text-white hover:bg-ed-dark transition text-xs font-semibold uppercase tracking-wider"
          >
            Retry
          </button>
        )}
      </div>
    </motion.div>
  )
}
