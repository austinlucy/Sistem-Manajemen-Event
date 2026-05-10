import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Menu, X, LogOut, User, TicketIcon } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-slate-700"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <TicketIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white hidden sm:inline">Campus Events</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
            <Link to="/events" className="text-slate-300 hover:text-white transition">Events</Link>
            {user && (
              <Link to="/my-registrations" className="text-slate-300 hover:text-white transition">
                My Registrations
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">{user.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-slate-700 pb-4"
          >
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                to="/"
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/events"
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
              {user && (
                <>
                  <Link
                    to="/my-registrations"
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
                    onClick={() => setIsOpen(false)}
                  >
                    My Registrations
                  </Link>
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition text-left"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
