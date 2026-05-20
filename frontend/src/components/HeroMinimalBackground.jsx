import { useEffect, useRef } from 'react'

export default function HeroMinimalBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Subtle diagonal lines
      const spacing = 80
      const offset = (time * 0.2) % spacing

      for (let i = -canvas.height; i < canvas.width + canvas.height; i += spacing) {
        const x = i + offset
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
        ctx.lineWidth = 0.5
        ctx.moveTo(x, 0)
        ctx.lineTo(x - canvas.height, canvas.height)
        ctx.stroke()
      }

      // Subtle horizontal accent
      const yCenter = canvas.height * 0.5
      const gradient = ctx.createLinearGradient(0, yCenter - 100, 0, yCenter + 100)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.015)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, yCenter - 100, canvas.width, 200)

      time++
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}
