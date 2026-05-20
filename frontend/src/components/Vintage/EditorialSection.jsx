import { motion } from 'framer-motion'

export default function EditorialSection({
  title,
  subtitle,
  children,
  layout = 'default',
  className = '',
  containerClassName = '',
}) {
  const layoutClasses = {
    default: '',
    hero: 'min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center',
    split: 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center',
    full: 'w-full',
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`py-14 md:py-20 lg:py-24 ${containerClassName}`}
    >
      <div className={`container-editorial ${layoutClasses[layout]}`}>
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-9 md:mb-12"
          >
            <div className="divider-editorial mb-5"></div>
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-[-0.03em] uppercase mb-3 md:mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Content */}
        <div className={className}>
          {children}
        </div>
      </div>
    </motion.section>
  )
}
