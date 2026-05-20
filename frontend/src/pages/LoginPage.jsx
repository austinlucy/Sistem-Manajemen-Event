import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Shield } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import useAlert from '../hooks/useAlert'
import { VintageButton } from '../components/Vintage'
import Logo from '../components/Logo'
import HeroMinimalBackground from '../components/HeroMinimalBackground'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAdminMode, setIsAdminMode] = useState(false)
  const { login, adminLogin } = useContext(AuthContext)
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = isAdminMode
        ? await adminLogin(username, password)
        : await login(username, password)

      showAlert(`Welcome back, ${user.name}!`, 'success')
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      const errorMsg = err.message || err
      setError(errorMsg)
      showAlert(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

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
            Sistem manajemen event kampus yang modern dan profesional
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
          {/* Mode Toggle */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  !isAdminMode
                    ? 'bg-white text-black'
                    : 'text-[#525252] hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                User Login
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  isAdminMode
                    ? 'bg-white text-black'
                    : 'text-[#525252] hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Login
              </button>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373]">
              {isAdminMode ? 'Admin access' : 'Welcome back'}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-3 mb-2">
              {isAdminMode ? 'Masuk Admin' : 'Masuk ke Akun'}
            </h1>
            <p className="text-sm text-[#737373]">
              {isAdminMode
                ? 'Akses dashboard administrasi event'
                : 'Masukkan kredensial untuk mengakses dashboard'}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                variants={itemVariants}
                className="alert-error"
              >
                <p className="text-white text-sm">{error}</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.15em]">
                {isAdminMode ? 'Email Admin' : 'Username atau Email'}
              </label>
              <input
                type="text"
                placeholder={isAdminMode ? 'admin@gmail.com' : 'johndoe'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  placeholder="••••••••"
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <VintageButton
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full"
              >
                Masuk
              </VintageButton>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-[#1a1a1a]">
            <p className="text-center text-sm text-[#737373]">
              Belum punya akun?{' '}
              <Link to="/register" className="text-white hover:underline font-medium transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
