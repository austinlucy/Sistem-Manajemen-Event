import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import useAlert from '../hooks/useAlert'

export default function AlertContainer() {
  const { alerts, removeAlert } = useAlert()

  const getAlertStyles = (type) => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-white',
          icon: CheckCircle,
          iconColor: 'text-white',
          text: 'text-white',
          close: 'hover:bg-white/10'
        }
      case 'error':
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-white',
          icon: AlertCircle,
          iconColor: 'text-white',
          text: 'text-white',
          close: 'hover:bg-white/10'
        }
      case 'warning':
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-[#555555]',
          icon: AlertTriangle,
          iconColor: 'text-[#888888]',
          text: 'text-white',
          close: 'hover:bg-white/10'
        }
      default:
        return {
          bg: 'bg-[#0a0a0a]',
          border: 'border-[#333333]',
          icon: Info,
          iconColor: 'text-[#666666]',
          text: 'text-white',
          close: 'hover:bg-white/10'
        }
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="max-w-md mx-auto px-4 pt-4 space-y-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => {
            const styles = getAlertStyles(alert.type)
            const Icon = styles.icon

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`${styles.bg} border-l-2 ${styles.border} ${styles.text} p-4 flex items-center gap-3 border border-white/5`}
              >
                <Icon className={`${styles.iconColor} w-5 h-5 flex-shrink-0`} />
                <p className="flex-1 text-sm">{alert.message}</p>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className={`flex-shrink-0 ${styles.close} transition-colors p-1 text-[#666666] hover:text-white`}
                  aria-label="Close alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
