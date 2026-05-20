import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import Logo from './Logo'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    ...(user ? [{ to: '/my-registrations', label: 'My Registrations' }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-solid' : 'glass'
      }`}
    >
      <div className="container-editorial">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link to="/">
            <Logo size="sm" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${
                  isActive(link.to) ? 'text-white' : 'text-[#737373] hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#737373] border border-[#222222] hover:border-[#444444] hover:text-white transition-all duration-300"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium">{user.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#525252] hover:text-white transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-medium uppercase tracking-[0.1em] text-[#737373] hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] bg-white text-black hover:bg-[#eeeeee] transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-[#1a1a1a]"
            style={{ background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(24px)' }}
          >
            <div className="container-editorial py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
                    isActive(link.to) ? 'text-white bg-[#111111]' : 'text-[#737373] hover:text-white hover:bg-[#0a0a0a]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#1a1a1a] space-y-2">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#737373]"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#737373] w-full"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#737373]"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] bg-white text-black text-center"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
