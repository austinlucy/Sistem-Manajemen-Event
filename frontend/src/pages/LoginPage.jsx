import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Shield } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import useAlert from '../hooks/useAlert'
import { VintageButton } from '../components/Vintage'
import Logo from '../components/Logo'
import HeroMinimalBackground from '../components/HeroMinimalBackground'
import AuthBrandPanel from '../components/AuthBrandPanel'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAdminMode, setIsAdminMode] = useState(false)
  const { user, login, adminLogin } = useContext(AuthContext)
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = isAdminMode
        ? await adminLogin(username.trim(), password)
        : await login(username.trim(), password)

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
    <div className="min-h-screen overflow-hidden bg-black text-white relative">
      <HeroMinimalBackground />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(255,255,255,0.045),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_32%,rgba(255,255,255,0.025))]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-black/35 to-black" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.06fr_0.94fr]">
        <AuthBrandPanel />

        {/* RIGHT LOGIN */}
        <section className="relative flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: 56, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="w-full max-w-[460px]"
          >
            <div className="mb-7 flex justify-center lg:hidden">
              <Logo size="lg" inverted={false} />
            </div>

            <motion.div
              className="relative overflow-hidden border border-white/10 bg-black/55 p-5 shadow-[0_36px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7 md:p-8"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-white/[0.055] blur-3xl" />

              {/* Mode Toggle */}
              <div className="relative mb-8 grid grid-cols-2 border border-white/10 bg-white/[0.035] p-1">
                <motion.div
                  className="absolute bottom-1 top-1 w-[calc(50%-4px)] bg-white shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
                  animate={{ x: isAdminMode ? '100%' : '0%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
                <button
                  type="button"
                  onClick={() => setIsAdminMode(false)}
                  className={`relative z-10 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.16em] transition-colors duration-300 ${
                    !isAdminMode ? 'text-black' : 'text-white/48 hover:text-white'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminMode(true)}
                  className={`relative z-10 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isAdminMode ? 'text-black' : 'text-white/48 hover:text-white'
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin Login
                </button>
              </div>

              <motion.div
                key={isAdminMode ? 'admin' : 'user'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-8"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">
                  {isAdminMode ? 'Admin access' : 'Welcome back'}
                </span>
                <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.055em] text-white md:text-5xl">
                  {isAdminMode ? 'Masuk Admin' : 'Masuk ke Akun'}
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  {isAdminMode
                    ? 'Akses dashboard administrasi event dengan kredensial resmi.'
                    : 'Masukkan kredensial untuk mengakses dashboard Event Hub.'}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-white/15 bg-white/[0.045] p-4"
                  >
                    <p className="text-sm font-medium leading-5 text-white/85">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
                    {isAdminMode ? 'Email Admin' : 'Username atau Email'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAdminMode ? 'admin@gmail.com' : 'johndoe@email.com'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="login-input pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/38 transition-colors duration-300 hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <VintageButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="login-submit !mt-7 w-full"
                >
                  Masuk
                </VintageButton>
              </form>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-center text-sm leading-6 text-white/52">
                  Belum punya akun?{' '}
                  <Link to="/register" className="font-bold text-white underline-offset-4 transition-colors hover:text-white/75 hover:underline">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
