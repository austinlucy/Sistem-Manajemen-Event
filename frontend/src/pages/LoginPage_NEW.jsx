import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { VintageButton, VintageInput, VintageCard } from '../components/Vintage'

export default function LoginPage() {
 const [username, setUsername] = useState('')
 const [password, setPassword] = useState('')
 const [showPassword, setShowPassword] = useState(false)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')
 const { login } = useContext(AuthContext)
 const navigate = useNavigate()

 const handleSubmit = async (e) => {
 e.preventDefault()
 setError('')
 setLoading(true)

 try {
  const user = await login(username, password)
  if (user.role === 'admin') {
  navigate('/admin')
  } else {
  navigate('/')
  }
 } catch (err) {
  setError(err.message || err)
 } finally {
  setLoading(false)
 }
 }

 return (
 <div className="min-h-screen bg-light-surface from-dk-pure via-dk-bg to-dk-surface flex items-center justify-center px-4 py-8">
  <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  className="w-full max-w-md"
  >
  {/* Header */}
  <motion.div
   initial={{ opacity: 0, y: -20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: 0.1, duration: 0.5 }}
   className="text-center mb-12"
  >
   <div className="inline-flex items-center justify-center mb-6 p-4 bg-dk-hover rounded-sm border-2 border-dk-textSecondary">
   <span className="text-4xl">📅</span>
   </div>
   <h1 className="text-4xl font-bold text-dk-textSecondary font-display mb-2">
   Welcome Back
   </h1>
   <p className="text-dk-textMuted font-serif">
   Sign in to discover amazing campus events
   </p>
  </motion.div>

  {/* Form Card */}
  <VintageCard>
   <form onSubmit={handleSubmit} className="space-y-6">
   {/* Error Message */}
   {error && (
    <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 border-l-4 border-dk-textSecondary bg-dk-hover"
    >
    <p className="text-dk-textSecondary font-serif text-sm">{error}</p>
    </motion.div>
   )}

   {/* Username Field */}
   <VintageInput
    label="Username or Email"
    placeholder="johndoe"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    required
    error={error && !username ? 'Username required' : ''}
   />

   {/* Password Field */}
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
    {error && !password && (
    <motion.p
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     className="mt-2 text-sm text-dk-textSecondary font-serif"
    >
     Password required
    </motion.p>
    )}
   </div>

   {/* Submit Button */}
   <VintageButton
    type="submit"
    variant="primary"
    size="md"
    isLoading={loading}
    className="w-full"
    disabled={loading}
   >
    {loading ? 'Signing In...' : 'Sign In'}
   </VintageButton>

   {/* Divider */}
   <div className="flex items-center gap-4 my-6">
    <div className="flex-1 h-px bg-dk-border"></div>
    <span className="text-sm text-dk-textMuted font-serif">OR</span>
    <div className="flex-1 h-px bg-dk-border"></div>
   </div>

   {/* Register Link */}
   <p className="text-center text-dk-textMuted font-serif">
    Don't have an account?{' '}
    <Link
    to="/register"
    className="text-dk-textSecondary hover:text-dk-textMuted font-semibold transition-colors"
    >
    Create one
    </Link>
   </p>
   </form>

   {/* Footer */}
   <motion.div
   initial={{ opacity: 0 }}
   whileInView={{ opacity: 1 }}
   transition={{ delay: 0.3 }}
   viewport={{ once: true }}
   className="mt-8 pt-8 border-t-2 border-dk-border text-center text-xs text-dk-textFade font-serif"
   >
   <p>We keep your information secure and private.</p>
   <p className="mt-2">Privacy Policy • Terms of Service</p>
   </motion.div>
  </VintageCard>

  {/* Back Button */}
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















