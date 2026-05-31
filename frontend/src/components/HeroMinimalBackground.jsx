import { useEffect, useRef } from 'react'

export default function HeroMinimalBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationId
    let particles = []
    let mouse = { x: 0, y: 0 }
    let time = 0

    const createParticles = () => {
      const area = canvas.width * canvas.height
      const count = Math.min(72, Math.max(34, Math.floor(area / 22000)))
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.5 + 0.55,
        pulse: Math.random() * Math.PI * 2,
        depth: 0.45 + Math.random() * 0.75,
        index
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createParticles()
    }

    const onMouseMove = (event) => {
      mouse = {
        x: (event.clientX / window.innerWidth - 0.5) * 18,
        y: (event.clientY / window.innerHeight - 0.5) * 18
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    const drawGrid = () => {
      const spacing = 44
      const offset = (time * 0.08) % spacing
      ctx.lineWidth = 0.5
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'

      for (let x = -spacing; x < canvas.width + spacing; x += spacing) {
        ctx.beginPath()
        ctx.moveTo(x + offset + mouse.x * 0.18, 0)
        ctx.lineTo(x + offset + mouse.x * 0.18, canvas.height)
        ctx.stroke()
      }

      for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, y + offset + mouse.y * 0.18)
        ctx.lineTo(canvas.width, y + offset + mouse.y * 0.18)
        ctx.stroke()
      }
    }

    const drawOrbits = () => {
      const cx = canvas.width * 0.28 + mouse.x * 0.45
      const cy = canvas.height * 0.48 + mouse.y * 0.45
      const rings = [150, 235, 330]

      rings.forEach((radius, index) => {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate((time * (index % 2 ? -0.0009 : 0.0007)) + index * 0.55)
        ctx.beginPath()
        ctx.ellipse(0, 0, radius, radius * (0.42 + index * 0.08), 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,255,255,${0.035 - index * 0.006})`
        ctx.lineWidth = 1
        ctx.stroke()

        const dotAngle = time * 0.006 * (index + 1) + index * 2
        const dx = Math.cos(dotAngle) * radius
        const dy = Math.sin(dotAngle) * radius * (0.42 + index * 0.08)
        ctx.beginPath()
        ctx.arc(dx, dy, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.22)'
        ctx.shadowBlur = 12
        ctx.shadowColor = 'rgba(255,255,255,0.22)'
        ctx.fill()
        ctx.restore()
      })
    }

    const drawParticles = () => {
      particles.forEach((p, i) => {
        if (!prefersReducedMotion) {
          p.x += p.vx * p.depth
          p.y += p.vy * p.depth
        }

        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20
        if (p.y < -20) p.y = canvas.height + 20
        if (p.y > canvas.height + 20) p.y = -20

        const x = p.x + mouse.x * p.depth
        const y = p.y + mouse.y * p.depth
        const alpha = 0.13 + Math.sin(time * 0.018 + p.pulse) * 0.055

        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const qx = q.x + mouse.x * q.depth
          const qy = q.y + mouse.y * q.depth
          const dx = x - qx
          const dy = y - qy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 135

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.055
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(qx, qy)
            ctx.strokeStyle = `rgba(255,255,255,${opacity})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      })
    }

    const drawShapes = () => {
      const shapes = [
        { x: 0.78, y: 0.22, s: 78, r: 0.0012 },
        { x: 0.1, y: 0.78, s: 118, r: -0.0008 },
        { x: 0.62, y: 0.74, s: 52, r: 0.0015 }
      ]

      shapes.forEach((shape, index) => {
        const x = canvas.width * shape.x + mouse.x * (index + 1) * 0.55
        const y = canvas.height * shape.y + mouse.y * (index + 1) * 0.55
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(time * shape.r)
        ctx.strokeStyle = `rgba(255,255,255,${0.035 + index * 0.012})`
        ctx.lineWidth = 1
        ctx.shadowBlur = 26
        ctx.shadowColor = 'rgba(255,255,255,0.06)'
        ctx.strokeRect(-shape.s / 2, -shape.s / 2, shape.s, shape.s)
        ctx.restore()
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const radial = ctx.createRadialGradient(
        canvas.width * 0.2 + mouse.x,
        canvas.height * 0.45 + mouse.y,
        0,
        canvas.width * 0.2,
        canvas.height * 0.45,
        canvas.width * 0.8
      )
      radial.addColorStop(0, 'rgba(255,255,255,0.055)')
      radial.addColorStop(0.42, 'rgba(255,255,255,0.018)')
      radial.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGrid()
      drawOrbits()
      drawShapes()
      drawParticles()

      time += prefersReducedMotion ? 0.15 : 1
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-90"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
