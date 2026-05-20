import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedPageBackground({ variant = 'default' }) {
  const canvasRef = useRef(null)

  const variants = {
    default: {
      particles: { color: 'rgba(99, 102, 241, ', opacity: 0.3 },
      background: 'from-slate-950 via-slate-900 to-slate-950',
      shapes: [
        { color: '#F3F3F3/20 #F3F3F3/20', duration: 25 },
        { color: 'from-#D3D3D3/15 #E5E5E5/15', duration: 30 },
        { color: '#E5E5E5/15 to-#D3D3D3/15', duration: 35 },
      ],
    },
    admin: {
      particles: { color: 'rgba(168, 85, 247, ', opacity: 0.3 },
      background: 'from-slate-950 via-purple-900/20 to-slate-950',
      shapes: [
        { color: '#F3F3F3/20 to-#D3D3D3/20', duration: 25 },
        { color: '#E5E5E5/15 to-blue-500/15', duration: 30 },
        { color: 'from-pink-500/10 to-rose-500/10', duration: 35 },
      ],
    },
    event: {
      particles: { color: 'rgba(59, 130, 246, ', opacity: 0.3 },
      background: 'from-slate-950 via-blue-900/10 to-slate-950',
      shapes: [
        { color: 'from-#D3D3D3/20 to-cyan-500/20', duration: 25 },
        { color: 'from-cyan-500/15 to-blue-500/15', duration: 30 },
        { color: '#F3F3F3/10 #F3F3F3/10', duration: 35 },
      ],
    },
  }

  const config = variants[variant] || variants.default

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = `${config.particles.color}${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [config.particles])

  return (
    <>
      {/* Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ opacity: 0.4 }}
      />

      {/* Floating Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {config.shapes.map((shape, idx) => (
          <motion.div
            key={idx}
            initial={{ x: idx === 0 ? -100 : idx === 1 ? 100 : 0, y: idx === 0 ? -100 : 100 }}
            animate={{
              x: idx === 0 ? 0 : idx === 1 ? -100 : 50,
              y: idx === 0 ? 0 : idx === 1 ? -100 : -50,
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className={`absolute bg-light-surface ${shape.color} rounded-full blur-3xl`}
            style={{
              width: idx === 0 ? '300px' : idx === 1 ? '350px' : '280px',
              height: idx === 0 ? '300px' : idx === 1 ? '350px' : '280px',
              top: idx === 0 ? '-5%' : idx === 1 ? '50%' : 'auto',
              left: idx === 0 ? '-5%' : 'auto',
              right: idx === 1 ? '-5%' : 'auto',
              bottom: idx === 2 ? '10%' : 'auto',
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className={`fixed inset-0 z-0 bg-light-surface ${config.background} pointer-events-none`} />
    </>
  )
}













