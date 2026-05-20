import { motion } from 'framer-motion'

export default function Logo({ size = 'md', animated = false, inverted = false, className = '' }) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm', wordmark: 'text-[10px]' },
    md: { container: 'w-10 h-10', text: 'text-lg', wordmark: 'text-xs' },
    lg: { container: 'w-14 h-14', text: 'text-2xl', wordmark: 'text-sm' },
    xl: { container: 'w-20 h-20', text: 'text-3xl', wordmark: 'text-base' },
  }

  const s = sizes[size] || sizes.md

  const Container = animated ? motion.div : 'div'
  const containerProps = animated
    ? { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', stiffness: 120 } }
    : {}

  const bgColor = inverted ? 'bg-white' : 'bg-black'
  const textColor = inverted ? 'text-white' : 'text-black'
  const markColor = inverted ? '#000000' : '#ffffff'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Container
        {...containerProps}
        className={`${s.container} ${bgColor} flex items-center justify-center relative overflow-hidden border ${inverted ? 'border-white/20' : 'border-black/10'}`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-[68%] h-[68%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M8 8H31V13H14V17.5H27V22.5H14V27H31V32H8V8Z" fill={markColor} />
          <path d="M32 8H36V32H32V8Z" fill={markColor} opacity="0.35" />
          <path d="M4 8H7V32H4V8Z" fill={markColor} opacity="0.35" />
        </svg>
      </Container>
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-black ${textColor} tracking-[-0.04em] uppercase`}>
          Event
        </span>
        <span className={`${s.wordmark} font-black ${textColor} tracking-[0.25em] uppercase`}>
          Hub
        </span>
      </div>
    </div>
  )
}
