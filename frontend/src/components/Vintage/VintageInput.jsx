import { motion } from 'framer-motion'

export default function VintageInput({
  label,
  error,
  required = false,
  type = 'text',
  placeholder,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={`w-full ${containerClassName}`}
    >
      {label && (
        <label className="block text-[10px] md:text-xs font-bold text-white mb-2 uppercase tracking-[0.15em]">
          {label}
          {required && <span className="text-[#666666] ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 text-sm bg-[#0a0a0a] border border-[#222222] text-white
          placeholder-[#444444] outline-none
          transition-all duration-300
          focus:border-[#555555] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.05)]
          ${error ? 'border-white ring-2 ring-white/10' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-[#888888]"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}
