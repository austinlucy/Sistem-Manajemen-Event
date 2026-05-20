import { useEffect, useRef } from 'react'

export default function HeroDashboardBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const lines = 24
    const points = 60

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      time += 0.008

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < lines; i++) {
        const yBase = (h / lines) * i + (h / lines) * 0.5
        const opacity = 0.03 + Math.sin(time * 0.5 + i * 0.3) * 0.02

        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.01, opacity)})`
        ctx.lineWidth = 0.5

        for (let j = 0; j <= points; j++) {
          const x = (w / points) * j
          const wave1 = Math.sin(time * 1.2 + j * 0.15 + i * 0.5) * 8
          const wave2 = Math.cos(time * 0.8 + j * 0.1 + i * 0.3) * 5
          const y = yBase + wave1 + wave2

          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // Floating particles
      const particleCount = 40
      for (let i = 0; i < particleCount; i++) {
        const px = ((i * 137.5 + time * 20) % w)
        const py = ((i * 73.3 + Math.sin(time + i) * 30) % h)
        const size = 1 + Math.sin(time * 2 + i) * 0.5
        const alpha = 0.1 + Math.sin(time + i * 0.5) * 0.08

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Vertical accent lines
      for (let i = 0; i < 8; i++) {
        const x = (w / 8) * i + (w / 16)
        const alpha = 0.02 + Math.sin(time * 0.5 + i) * 0.015
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.005, alpha)})`
        ctx.lineWidth = 0.5
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1 }}
    />
  )
}
