import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function RetroModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) {
  const sizeClasses = {
    sm: 'max-w-xs md:max-w-md',
    md: 'max-w-sm md:max-w-2xl',
    lg: 'max-w-sm md:max-w-4xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full px-4 md:px-0"
          >
            <div className={`${sizeClasses[size]} card-editorial max-h-[90vh] overflow-y-auto mx-auto`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-5 md:mb-6 pb-4 border-b border-ed-border gap-3">
                <h2 className="text-lg md:text-2xl font-bold text-ed-black tracking-tight break-words flex-1">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-ed-muted hover:text-ed-black transition-colors flex-shrink-0 p-1 rounded-full hover:bg-ed-light"
                  title="Close"
                >
                  <X size={20} className="md:w-5 md:h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-5 md:mb-6 text-sm md:text-base">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-2 md:gap-3 pt-4 border-t border-ed-border flex-wrap">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
