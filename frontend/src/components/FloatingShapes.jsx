import { motion } from 'framer-motion'

export default function FloatingShapes() {
  const shapes = [
    { 
      id: 1, 
      initial: { x: -100, y: -100 },
      animate: { x: 0, y: 0 },
      transition: { duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' },
      className: 'w-72 h-72 bg-light-surface #F3F3F3/30 #F3F3F3/30 rounded-full blur-3xl',
      style: { top: '-10%', left: '-5%' }
    },
    { 
      id: 2, 
      initial: { x: 100, y: 100 },
      animate: { x: -100, y: -100 },
      transition: { duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' },
      className: 'w-96 h-96 bg-light-surface from-#D3D3D3/20 #F3F3F3/20 rounded-full blur-3xl',
      style: { top: '50%', right: '-5%' }
    },
    { 
      id: 3, 
      initial: { x: 0, y: 0 },
      animate: { x: 50, y: -50 },
      transition: { duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'linear' },
      className: 'w-64 h-64 bg-light-surface #F3F3F3/20 to-#D3D3D3/20 rounded-full blur-3xl',
      style: { bottom: '10%', left: '10%' }
    },
  ]

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={shape.initial}
          animate={shape.animate}
          transition={shape.transition}
          className={`absolute ${shape.className}`}
          style={shape.style}
        />
      ))}
    </div>
  )
}













