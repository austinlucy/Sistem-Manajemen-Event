import { motion } from 'framer-motion'

export default function VintageButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-4 md:px-5 py-2 md:py-2.5 text-[10px]',
    md: 'px-5 md:px-7 py-2.5 md:py-3 text-[11px] md:text-xs',
    lg: 'px-7 md:px-9 py-3.5 md:py-4 text-xs md:text-sm w-full md:w-auto',
  }

  const variantClasses = {
    primary: `
      bg-white text-black border border-white
      hover:bg-transparent hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
      disabled:opacity-40 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-[#1a1a1a] text-white border border-[#333333]
      hover:border-[#555555] hover:bg-[#222222]
      disabled:opacity-40
    `,
    outline: `
      bg-transparent text-white border border-[#333333]
      hover:border-white hover:bg-white hover:text-black
      hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
      disabled:opacity-40
    `,
    ghost: `
      bg-transparent text-[#888888] border border-transparent
      hover:text-white
      disabled:opacity-40
    `,
    danger: `
      bg-[#1a1a1a] text-white border border-[#333333]
      hover:border-white hover:bg-white hover:text-black
      disabled:opacity-40
    `,
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden font-bold uppercase tracking-[0.2em] text-center
        transition-all duration-300 ease-out
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {/* Hover sweep effect */}
      <span 
        className="absolute inset-0 -translate-x-full hover:translate-x-0 transition-transform duration-500 ease-out opacity-10 bg-gradient-to-r from-transparent via-white to-transparent"
        aria-hidden="true"
      />
      
      {isLoading ? (
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          LOADING
        </span>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </motion.button>
  )
}
