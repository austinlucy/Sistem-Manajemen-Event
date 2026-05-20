import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { VintageButton, VintageInput, VintageCard } from '../components/Vintage'

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
 const navigate = useNavigate()

 const handleSubmit = async (e) => {
 e.preventDefault()
 setError('')

 if (password !== confirmPassword) {
  setError('Passwords do not match')
  return
 }

 if (password.length < 6) {
  setError('Password must be at least 6 characters')
  return
 }

 setLoading(true)
 try {
  await register(name, email, password)
  navigate('/')
 } catch (err) {
  setError(err.message || err)
 } finally {
  setLoading(false)
 }
 }

 const passwordMatch = password && confirmPassword && password === confirmPassword
 const passwordValid = password.length >= 6

 return (
 <div className="min-h-screen bg-light-surface from-dk-pure via-dk-bg to-dk-surface flex items-center justify-center px-4 py-8">
  <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  className="w-full max-w-md"
  >
  <motion.div
   initial={{ opacity: 0, y: -20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: 0.1, duration: 0.5 }}
   className="text-center mb-12"
  >
   <div className="inline-flex items-center justify-center mb-6 p-4 bg-dk-hover rounded-sm border-2 border-dk-textSecondary">
   <span className="text-4xl">✨</span>
   </div>
   <h1 className="text-4xl font-bold text-dk-textSecondary font-display mb-2">
   Join Our Community
   </h1>
   <p className="text-dk-textMuted font-serif">
   Create your account to start exploring campus events
   </p>
  </motion.div>

  <VintageCard>
   <form onSubmit={handleSubmit} className="space-y-5">
   {error && (
    <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 border-l-4 border-dk-textSecondary bg-dk-hover"
    >
    <p className="text-dk-textSecondary font-serif text-sm">{error}</p>
    </motion.div>
   )}

   {/* Full Name */}
   <VintageInput
    label="Full Name"
    placeholder="John Doe"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
   />

   {/* Email */}
   <VintageInput
    label="Email Address"
    type="email"
    placeholder="john@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
   />

   {/* Password */}
   <div>
    <label className="block text-sm font-semibold text-dk-textSecondary mb-2 font-serif">
    Password
    <span className="text-dk-textSecondary ml-1">*</span>
    </label>
    <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    viewport={{ once: true }}
    className="relative"
    >
    <input
     type={showPassword ? 'text' : 'password'}
     value={password}
     onChange={(e) => setPassword(e.target.value)}
     placeholder="••••••••"
     required
     className="input-vintage pr-12"
    />
    <button
     type="button"
     onClick={() => setShowPassword(!showPassword)}
     className="absolute right-3 top-1/2 -translate-y-1/2 text-dk-textMuted hover:text-dk-textSecondary transition-colors"
    >
     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
    </motion.div>
    {password && (
    <p className={`mt-2 text-xs font-serif ${passwordValid ? 'text-dk-textSecondary' : 'text-dk-textSecondary'}`}>
     {passwordValid ? '✓ Password is strong' : '✗ Minimum 6 characters'}
    </p>
    )}
   </div>

   {/* Confirm Password */}
   <div>
    <label className="block text-sm font-semibold text-dk-textSecondary mb-2 font-serif">
    Confirm Password
    <span className="text-dk-textSecondary ml-1">*</span>
    </label>
    <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    viewport={{ once: true }}
    className="relative"
    >
    <input
     type={showConfirm ? 'text' : 'password'}
     value={confirmPassword}
     onChange={(e) => setConfirmPassword(e.target.value)}
     placeholder="••••••••"
     required
     className="input-vintage pr-12"
    />
    <button
     type="button"
     onClick={() => setShowConfirm(!showConfirm)}
     className="absolute right-3 top-1/2 -translate-y-1/2 text-dk-textMuted hover:text-dk-textSecondary transition-colors"
    >
     {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
    </motion.div>
    {confirmPassword && (
    <p className={`mt-2 text-xs font-serif flex items-center gap-1 ${passwordMatch ? 'text-dk-textSecondary' : 'text-dk-textSecondary'}`}>
     {passwordMatch ? (
     <>
      <Check size={14} /> Passwords match
     </>
     ) : (
     <>
      <X size={14} /> Passwords don't match
     </>
     )}
    </p>
    )}
   </div>

   {/* Submit Button */}
   <VintageButton
    type="submit"
    variant="primary"
    size="md"
    isLoading={loading}
    className="w-full mt-6"
    disabled={loading || !passwordMatch || !passwordValid}
   >
    {loading ? 'Creating Account...' : 'Create Account'}
   </VintageButton>

   <div className="flex items-center gap-4 my-6">
    <div className="flex-1 h-px bg-dk-border"></div>
    <span className="text-sm text-dk-textMuted font-serif">OR</span>
    <div className="flex-1 h-px bg-dk-border"></div>
   </div>

   <p className="text-center text-dk-textMuted font-serif">
    Already have an account?{' '}
    <Link
    to="/login"
    className="text-dk-textSecondary hover:text-dk-textMuted font-semibold transition-colors"
    >
    Sign in
    </Link>
   </p>
   </form>

   <motion.div
   initial={{ opacity: 0 }}
   whileInView={{ opacity: 1 }}
   transition={{ delay: 0.3 }}
   viewport={{ once: true }}
   className="mt-8 pt-8 border-t-2 border-dk-border"
   >
   <p className="text-xs text-dk-textFade font-serif text-center mb-2">
    By creating an account, you agree to our
   </p>
   <p className="text-xs text-center font-serif">
    <a href="#" className="text-dk-textSecondary hover:underline">Terms of Service</a>
    {' '} and {' '}
    <a href="#" className="text-dk-textSecondary hover:underline">Privacy Policy</a>
   </p>
   </motion.div>
  </VintageCard>

  <motion.div
   initial={{ opacity: 0, y: 10 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: 0.4 }}
   className="mt-8 text-center"
  >
   <Link
   to="/"
   className="inline-flex items-center gap-2 text-dk-textMuted hover:text-dk-textSecondary transition-colors font-serif"
   >
   ← Back to Home
   </Link>
  </motion.div>
  </motion.div>
 </div>
 )
}















