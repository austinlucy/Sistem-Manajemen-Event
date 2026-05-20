import { useMousePosition } from '../hooks/useMousePosition'
import { motion } from 'framer-motion'

export default function GlowOrb() {
  const { x, y } = useMousePosition()

  return (
    <motion.div
      className="fixed w-80 h-80 rounded-full pointer-events-none z-0"
      style={{
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)',
        left: x - 160,
        top: y - 160,
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 1.5 }}
    />
  )
}











