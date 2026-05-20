import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedHeroBackground({ children, className = '' }) {
  // Generate random stars
  const stars = useMemo(() => {
    const s = []
    for (let i = 0; i < 60; i++) {
      s.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })
    }
    return s
  }, [])

  // Generate floating particles
  const particles = useMemo(() => {
    const p = []
    for (let i = 0; i < 20; i++) {
      p.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 10,
      })
    }
    return p
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Dark gradient base */}
      <div className="absolute inset-0 hero-dark-bg" />

      {/* Glowing orbs */}
      <div
        className="hero-orb w-[500px] h-[500px] bg-indigo-500/10 -top-32 -left-32"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="hero-orb w-[400px] h-[400px] bg-purple-500/10 top-1/3 right-0"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="hero-orb w-[300px] h-[300px] bg-blue-500/10 bottom-0 left-1/3"
        style={{ animationDelay: '4s' }}
      />

      {/* Stars */}
      <div className="star-field">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Mountain silhouette SVG */}
      <motion.svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{ height: '180px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <defs>
          <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#12121a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a0a0f" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 L0,120 Q60,80 120,110 T240,90 T360,100 T480,70 T600,95 T720,60 T840,90 T960,75 T1080,100 T1200,65 T1320,85 T1440,70 L1440,200 Z"
          fill="url(#mountainGrad)"
        />
        <path
          d="M0,200 L0,150 Q80,110 160,140 T320,120 T480,130 T640,100 T800,125 T960,105 T1120,130 T1280,95 T1440,110 L1440,200 Z"
          fill="#0a0a0f"
          opacity="0.7"
        />
      </motion.svg>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
