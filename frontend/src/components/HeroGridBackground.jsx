import { useEffect, useRef } from 'react'

export default function HeroGridBackground() {
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
    const gridSize = 60
    const nodes = []

    // Create grid nodes
    const cols = Math.ceil(window.innerWidth / gridSize) + 1
    const rows = Math.ceil(window.innerHeight / gridSize) + 1

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        nodes.push({
          x: i * gridSize,
          y: j * gridSize,
          baseX: i * gridSize,
          baseY: j * gridSize,
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.01,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw horizontal lines
      for (let j = 0; j < rows; j++) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
        ctx.lineWidth = 0.5

        for (let i = 0; i < cols; i++) {
          const node = nodes[i * rows + j]
          if (!node) continue
          const offsetY = Math.sin(time * node.speed + node.phase) * 3
          if (i === 0) {
            ctx.moveTo(node.x, node.y + offsetY)
          } else {
            ctx.lineTo(node.x, node.y + offsetY)
          }
        }
        ctx.stroke()
      }

      // Draw vertical lines
      for (let i = 0; i < cols; i++) {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
        ctx.lineWidth = 0.5

        for (let j = 0; j < rows; j++) {
          const node = nodes[i * rows + j]
          if (!node) continue
          const offsetX = Math.cos(time * node.speed + node.phase) * 3
          if (j === 0) {
            ctx.moveTo(node.x + offsetX, node.y)
          } else {
            ctx.lineTo(node.x + offsetX, node.y)
          }
        }
        ctx.stroke()
      }

      // Draw pulsing dots at intersections
      nodes.forEach((node, idx) => {
        if (idx % 3 !== 0) return
        const pulse = Math.sin(time * 0.02 + node.phase) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1 * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.06 * pulse})`
        ctx.fill()
      })

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
