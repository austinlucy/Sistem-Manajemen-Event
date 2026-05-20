export default function AnimatedEditorialBackground() {
  return (
    <div 
      className="fixed inset-0 -z-50 w-full h-full overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F9F9F9 50%, #F3F3F3 100%)',
      }}
    >
      {/* Animated SVG Background */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          mixBlendMode: 'overlay',
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="noise-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" />
          </filter>

          <linearGradient id="subtle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0.02 }} />
            <stop offset="50%" style={{ stopColor: '#000000', stopOpacity: 0.01 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.02 }} />
          </linearGradient>

          <pattern id="grid-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#E5E5E5" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>

        {/* Subtle grid background */}
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Flowing organic lines */}
        <g opacity="0.15" stroke="#000000" strokeWidth="0.5" fill="none">
          <path d="M 0,200 Q 300,100 600,200 T 1200,200" style={{ animation: 'flow-wave-1 20s ease-in-out infinite' }} />
          <path d="M 0,400 Q 300,300 600,400 T 1200,400" style={{ animation: 'flow-wave-2 25s ease-in-out infinite' }} />
          <path d="M 0,600 Q 300,500 600,600 T 1200,600" style={{ animation: 'flow-wave-3 30s ease-in-out infinite' }} />
        </g>

        {/* Abstract flowing shapes */}
        <g opacity="0.08">
          <ellipse cx="20%" cy="30%" rx="200" ry="150" fill="#000000" style={{ animation: 'drift 25s ease-in-out infinite' }} />
          <ellipse cx="80%" cy="70%" rx="180" ry="200" fill="#000000" style={{ animation: 'drift-reverse 30s ease-in-out infinite' }} />
          <ellipse cx="40%" cy="80%" rx="150" ry="120" fill="#000000" style={{ animation: 'drift 28s ease-in-out infinite' }} />
        </g>
      </svg>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: '#000000',
            opacity: Math.random() * 0.1 + 0.02,
            animation: `float-particle ${Math.random() * 15 + 20}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* CSS Animations */}
      <style>{`
        @keyframes flow-wave-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes flow-wave-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        @keyframes flow-wave-3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(30px, -20px); }
          66% { transform: translate(-20px, 30px); }
        }
        @keyframes drift-reverse {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(-30px, 20px); }
          66% { transform: translate(20px, -30px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.02; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.08; }
        }
      `}</style>
    </div>
  )
}





