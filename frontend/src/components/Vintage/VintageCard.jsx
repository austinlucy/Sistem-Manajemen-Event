import { motion } from 'framer-motion'

export default function VintageCard({
  children,
  className = '',
  hover = true,
  animate = true,
  delay = 0,
  glow = false,
  ...props
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      whileInView={animate ? { opacity: 1, y: 0 } : {}}
      whileHover={hover ? {
        y: -4,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: glow
          ? '0 0 40px rgba(255, 255, 255, 0.08), 0 0 80px rgba(255, 255, 255, 0.04)'
          : '0 8px 32px rgba(255, 255, 255, 0.05)',
      } : {}}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true }}
      className={`
        relative overflow-hidden
        bg-[#111111] border border-white/[0.08]
        shadow-[0_18px_48px_rgba(0,0,0,0.28)]
        transition-all duration-300 ease-out
        break-inside-avoid
        ${className}
      `}
      {...props}
    >
      {/* Subtle inner gradient on hover */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
