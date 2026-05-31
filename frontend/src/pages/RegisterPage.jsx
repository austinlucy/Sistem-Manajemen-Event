import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import useAlert from '../hooks/useAlert'
import { VintageButton } from '../components/Vintage'
import Logo from '../components/Logo'
import HeroMinimalBackground from '../components/HeroMinimalBackground'
import AuthBrandPanel from '../components/AuthBrandPanel'

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
    <div className="min-h-screen overflow-hidden bg-black text-white relative">
      <HeroMinimalBackground />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(255,255,255,0.045),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_32%,rgba(255,255,255,0.025))]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-black/35 to-black" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.06fr_0.94fr]">
        <AuthBrandPanel />

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
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative overflow-hidden border border-white/10 bg-black/55 p-5 shadow-[0_36px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7 md:p-8"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-white/[0.055] blur-3xl" />

              <div className="relative mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">
                  Create Account
                </span>
                <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.055em] text-white md:text-5xl">
                  Buat Akun Baru
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  Isi data diri kamu untuk mulai menggunakan sistem Event Hub.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-5">
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
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="Minimal 6 karakter"
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
                  {password && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {passwordValid ? (
                        <Check className="h-3.5 w-3.5 text-white/70" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-white/35" />
                      )}
                      <span className={`text-[11px] ${passwordValid ? 'text-white/65' : 'text-white/35'}`}>
                        Minimal 6 karakter
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      required
                      className="login-input pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/38 transition-colors duration-300 hover:text-white"
                      aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {passwordMatch ? (
                        <Check className="h-3.5 w-3.5 text-white/70" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-white/35" />
                      )}
                      <span className={`text-[11px] ${passwordMatch ? 'text-white/65' : 'text-white/35'}`}>
                        Password cocok
                      </span>
                    </div>
                  )}
                </div>

                <VintageButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  disabled={!passwordValid || !passwordMatch}
                  className="login-submit !mt-7 w-full"
                >
                  Daftar
                </VintageButton>
              </form>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-center text-sm leading-6 text-white/52">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="font-bold text-white underline-offset-4 transition-colors hover:text-white/75 hover:underline">
                    Masuk sekarang
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
