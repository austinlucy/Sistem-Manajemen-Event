import { useEffect, useRef } from 'react'

export default function HeroWavesBackground() {
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
    const waves = [
      { amplitude: 40, frequency: 0.003, speed: 0.008, yOffset: 0.4, opacity: 0.08, lineWidth: 1 },
      { amplitude: 60, frequency: 0.002, speed: 0.006, yOffset: 0.45, opacity: 0.06, lineWidth: 1.5 },
      { amplitude: 30, frequency: 0.005, speed: 0.012, yOffset: 0.35, opacity: 0.1, lineWidth: 0.8 },
      { amplitude: 80, frequency: 0.0015, speed: 0.004, yOffset: 0.5, opacity: 0.04, lineWidth: 2 },
      { amplitude: 50, frequency: 0.004, speed: 0.01, yOffset: 0.42, opacity: 0.05, lineWidth: 1 },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity})`
        ctx.lineWidth = wave.lineWidth

        for (let x = 0; x <= canvas.width; x += 2) {
          const y =
            canvas.height * wave.yOffset +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * (wave.amplitude * 0.3)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      })

      // Vertical accent lines
      const numLines = 5
      for (let i = 0; i < numLines; i++) {
        const x = (canvas.width / numLines) * i + (canvas.width / numLines) / 2
        const gradient = ctx.createLinearGradient(x, 0, x, canvas.height)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.02 + Math.sin(time * 0.005 + i) * 0.015})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = 0.5
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

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
