import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import useAlert from '../hooks/useAlert'
import { VintageButton } from '../components/Vintage'
import Logo from '../components/Logo'
import HeroMinimalBackground from '../components/HeroMinimalBackground'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      const errMsg = 'Passwords do not match'
      setError(errMsg)
      showAlert(errMsg, 'error')
      return
    }

    if (password.length < 6) {
      const errMsg = 'Password must be at least 6 characters'
      setError(errMsg)
      showAlert(errMsg, 'error')
      return
    }

    setLoading(true)
    try {
      const user = await register(name, email, password)
      showAlert(`Welcome, ${user.name}! Account created successfully`, 'success')
      navigate('/')
    } catch (err) {
      const errorMsg = err.message || err
      setError(errorMsg)
      showAlert(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const passwordMatch = password && confirmPassword && password === confirmPassword
  const passwordValid = password.length >= 6

  return (
    <div className="min-h-screen flex overflow-hidden bg-black">
      {/* LEFT PANEL - White with black text */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[45%] bg-white items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-black/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-black/5 rounded-full"
          />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative z-10 text-center px-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 120 }}
            className="mb-8 flex justify-center"
          >
            <Logo size="xl" inverted />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-5xl md:text-6xl font-black text-black tracking-[-0.04em] uppercase leading-[0.85] mb-6"
          >
            JOIN
            <br />
            US
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="w-16 h-0.5 bg-black mx-auto mb-6 origin-center"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-sm text-[#555555] max-w-xs mx-auto leading-relaxed"
          >
            Daftar sekarang dan mulai eksplorasi event kampus terbaik
          </motion.p>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL - Black with white text */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex-1 flex items-center justify-center px-4 py-8 relative overflow-hidden"
      >
        <HeroMinimalBackground />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373]">
              Create Account
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-3 mb-2">
              Buat Akun Baru
            </h1>
            <p className="text-sm text-[#737373]">
              Isi data diri kamu untuk mulai menggunakan sistem
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div variants={itemVariants} className="alert-error">
                <p className="text-white text-sm">{error}</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.15em]">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-mono"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.15em]">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-mono"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.15em]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="input-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex items-center gap-1.5">
                  {passwordValid ? (
                    <Check className="w-3.5 h-3.5 text-[#a3a3a3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-[#525252]" />
                  )}
                  <span className={`text-[11px] ${passwordValid ? 'text-[#a3a3a3]' : 'text-[#525252]'}`}>
                    Minimal 6 karakter
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.15em]">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  required
                  className="input-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-2 flex items-center gap-1.5">
                  {passwordMatch ? (
                    <Check className="w-3.5 h-3.5 text-[#a3a3a3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-[#525252]" />
                  )}
                  <span className={`text-[11px] ${passwordMatch ? 'text-[#a3a3a3]' : 'text-[#525252]'}`}>
                    Password cocok
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <VintageButton
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                disabled={!passwordValid || !passwordMatch}
                className="w-full"
              >
                Daftar
              </VintageButton>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-[#1a1a1a]">
            <p className="text-center text-sm text-[#737373]">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-white hover:underline font-medium transition-colors">
                Masuk sekarang
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
