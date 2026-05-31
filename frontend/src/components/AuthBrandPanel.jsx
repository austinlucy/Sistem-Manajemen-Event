import { motion } from 'framer-motion'

export default function AuthBrandPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -44 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex relative items-center justify-center overflow-hidden border-r border-white/10 bg-black px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.10),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_38%,rgba(255,255,255,0.025))]" />
      <div className="absolute inset-0 opacity-[0.055]" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '54px 54px'
      }} />

      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute h-[520px] w-[520px] rounded-full border border-white/[0.075]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="absolute h-[380px] w-[380px] rounded-full border border-dashed border-white/[0.08]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.045, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-64 w-64 bg-white/[0.035] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.86, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.025 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative flex h-56 w-56 xl:h-64 xl:w-64 items-center justify-center border border-white/15 bg-white/[0.045] shadow-[0_38px_140px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
          <div className="absolute inset-4 border border-white/[0.065]" />
          <div className="absolute -inset-px bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-70" />
          <svg
            viewBox="0 0 40 40"
            className="relative z-10 h-[58%] w-[58%] drop-shadow-[0_18px_46px_rgba(255,255,255,0.16)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M8 8H31V13H14V17.5H27V22.5H14V27H31V32H8V8Z" fill="white" />
            <path d="M32 8H36V32H32V8Z" fill="white" opacity="0.35" />
            <path d="M4 8H7V32H4V8Z" fill="white" opacity="0.35" />
          </svg>
        </div>

        <div className="mt-8 text-center">
          <p className="text-5xl xl:text-6xl font-black uppercase tracking-[-0.075em] text-white leading-none">
            Event
          </p>
          <p className="mt-2 text-lg xl:text-xl font-black uppercase tracking-[0.42em] text-white/55">
            Hub
          </p>
        </div>
      </motion.div>
    </motion.aside>
  )
}
