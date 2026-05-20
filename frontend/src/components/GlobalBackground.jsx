export default function GlobalBackground() {
  return (
    <div id="global-bg-container" className="fixed inset-0 overflow-hidden -z-50">
      {/* Premium Gradient Sky to Dark */}
      <div className="absolute inset-0 bg-light-surfaceb from-gray-300 via-gray-500 to-dk-pure" />

      {/* Layered Mountain Landscape */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#888888', stopOpacity: 1}} />
            <stop offset="40%" style={{stopColor: '#555555', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#111111', stopOpacity: 1}} />
          </linearGradient>
          
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#1a1a1a', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#0a0a0a', stopOpacity: 1}} />
          </linearGradient>

          <filter id="blur-mountains">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* Sky gradient background */}
        <rect width="1200" height="800" fill="url(#skyGradient)" />

        {/* Far mountains - Very dark silhouette */}
        <path
          d="M 0,350 Q 150,280 300,320 Q 450,280 600,350 Q 750,300 900,330 Q 1050,280 1200,350 L 1200,420 L 0,420 Z"
          fill="#1a1a1a"
          opacity="0.9"
          filter="url(#blur-mountains)"
        />

        {/* Mid mountains - Dark with more details */}
        <path
          d="M 0,400 Q 100,300 200,350 Q 300,250 420,340 Q 550,280 650,360 Q 780,290 900,380 Q 1050,320 1200,400 L 1200,500 L 0,500 Z"
          fill="#252525"
          opacity="0.95"
        />

        {/* Near mountains - Darker, more defined */}
        <path
          d="M 0,480 L 80,350 L 150,420 L 220,320 L 300,450 L 400,280 L 500,460 L 600,300 L 700,470 L 800,310 L 900,450 L 1000,340 L 1100,480 L 1200,400 L 1200,600 L 0,600 Z"
          fill="#0f0f0f"
          opacity="1"
        />

        {/* Lake/Water reflection */}
        <rect x="0" y="520" width="1200" height="120" fill="url(#waterGradient)" />

        {/* Water shimmer lines */}
        <line x1="0" y1="540" x2="1200" y2="540" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="0" y1="560" x2="1200" y2="560" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1="0" y1="580" x2="1200" y2="580" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      </svg>

      {/* Foreground Grass Silhouettes */}
      <svg className="absolute bottom-0 w-full h-1/3" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 300">
        <defs>
          <pattern id="grassPattern" x="0" y="0" width="100" height="300" patternUnits="userSpaceOnUse">
            {/* Grass cluster 1 */}
            <line x1="10" y1="300" x2="8" y2="250" stroke="#0a0a0a" strokeWidth="1.5" />
            <line x1="15" y1="300" x2="14" y2="240" stroke="#0a0a0a" strokeWidth="1.2" />
            <line x1="20" y1="300" x2="19" y2="260" stroke="#0a0a0a" strokeWidth="1.5" />
            <line x1="25" y1="300" x2="23" y2="235" stroke="#0a0a0a" strokeWidth="1.3" />
            <line x1="30" y1="300" x2="28" y2="250" stroke="#0a0a0a" strokeWidth="1.4" />
            {/* Grass cluster 2 */}
            <line x1="45" y1="300" x2="43" y2="245" stroke="#0a0a0a" strokeWidth="1.5" />
            <line x1="50" y1="300" x2="49" y2="255" stroke="#0a0a0a" strokeWidth="1.2" />
            <line x1="55" y1="300" x2="54" y2="240" stroke="#0a0a0a" strokeWidth="1.4" />
            <line x1="60" y1="300" x2="58" y2="265" stroke="#0a0a0a" strokeWidth="1.3" />
            <line x1="65" y1="300" x2="63" y2="250" stroke="#0a0a0a" strokeWidth="1.5" />
            {/* Grass cluster 3 */}
            <line x1="80" y1="300" x2="78" y2="260" stroke="#0a0a0a" strokeWidth="1.3" />
            <line x1="85" y1="300" x2="84" y2="235" stroke="#0a0a0a" strokeWidth="1.5" />
            <line x1="90" y1="300" x2="88" y2="250" stroke="#0a0a0a" strokeWidth="1.4" />
          </pattern>
        </defs>
        
        {/* Multiple layers of grass for depth */}
        <rect width="1200" height="300" fill="url(#grassPattern)" opacity="0.8" />
        <rect width="1200" height="300" fill="url(#grassPattern)" opacity="0.5" style={{transform: 'scaleY(0.6)'}} />
      </svg>

      {/* Animated Light Rays */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          animation: 'light-sweep 15s ease-in-out infinite',
        }}
      />

      {/* Soft Vignette Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes light-sweep {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(0); opacity: 0.2; }
        }

        @keyframes float-mountains {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        #global-bg-container {
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}











