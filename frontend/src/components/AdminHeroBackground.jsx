import { useEffect, useRef } from 'react'

const CONFIG = {
  events: { mode: 'matrix', density: 18 },
  participants: { mode: 'network', density: 34 },
  schedules: { mode: 'time', density: 10 },
}

export default function AdminHeroBackground({ variant = 'events' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const config = CONFIG[variant] || CONFIG.events
    let animationId
    let time = 0
    let dpr = window.devicePixelRatio || 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const drawMatrix = (w, h) => {
      const cols = Math.ceil(w / config.density)
      for (let i = 0; i < cols; i++) {
        const x = i * config.density
        const offset = (time * 55 + i * 47) % (h + 120)
        ctx.strokeStyle = `rgba(255,255,255,${0.025 + (i % 4) * 0.008})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(x, Math.max(0, offset - 140))
        ctx.lineTo(x, offset)
        ctx.stroke()

        if (i % 3 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.12)'
          ctx.fillRect(x - 1, offset, 2, 2)
        }
      }
    }

    const drawNetwork = (w, h) => {
      const nodes = Array.from({ length: config.density }, (_, i) => ({
        x: (Math.sin(i * 12.989 + time * 0.35) * 0.5 + 0.5) * w,
        y: (Math.cos(i * 7.233 + time * 0.28) * 0.5 + 0.5) * h,
      }))

      nodes.forEach((a, i) => {
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 145) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 145) * 0.06})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      })

      nodes.forEach((node, i) => {
        ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.sin(time + i) * 0.04})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, i % 5 === 0 ? 2 : 1.2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const drawTime = (w, h) => {
      const cx = w * 0.72
      const cy = h * 0.45
      for (let i = 0; i < config.density; i++) {
        const r = 35 + i * 34 + Math.sin(time + i) * 5
        ctx.strokeStyle = `rgba(255,255,255,${0.06 - i * 0.004})`
        ctx.lineWidth = 0.7
        ctx.beginPath()
        ctx.arc(cx, cy, r, time * (0.25 + i * 0.02), Math.PI * 1.45 + time * (0.25 + i * 0.02))
        ctx.stroke()
      }

      for (let i = 0; i < 18; i++) {
        const angle = time * 0.45 + (Math.PI * 2 * i) / 18
        const r = 80 + (i % 4) * 38
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.fillRect(x, y, 2, 2)
      }
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      time += 0.01
      ctx.clearRect(0, 0, w, h)

      ctx.fillStyle = 'rgba(255,255,255,0.018)'
      for (let x = 0; x < w; x += 48) ctx.fillRect(x, 0, 1, h)
      for (let y = 0; y < h; y += 48) ctx.fillRect(0, y, w, 1)

      if (config.mode === 'network') drawNetwork(w, h)
      else if (config.mode === 'time') drawTime(w, h)
      else drawMatrix(w, h)

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [variant])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
