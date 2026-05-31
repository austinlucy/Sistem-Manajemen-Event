import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import useAlert from '../../hooks/useAlert'
import Logo from '../Logo'
import { notificationService } from '../../services'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/api'
const BASE_URL = API_URL.replace('/api', '')

export default function RetroNavbar() {
  const { user, logout } = useAuth()
  const { showAlert } = useAlert()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getMyNotifications()
        const data = response.data?.data ?? response.data
        setNotifications(Array.isArray(data) ? data : [])
      } catch (err) {
        console.warn('Notifications unavailable:', err?.message)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(item => !item.is_read).length

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await notificationService.markRead(notification.id)
        setNotifications(prev => prev.map(item => item.id === notification.id ? { ...item, is_read: 1 } : item))
      }
    } catch (err) {
      console.warn('Failed to mark notification read:', err?.message)
    }
  }

  const handleLogout = () => {
    logout()
    showAlert('You have been logged out. See you soon!', 'info')
    navigate('/login')
  }

  const navLinks = [
    { label: 'Dashboard', href: '/' },
    { label: 'Event', href: '/events' },
    ...(user && user.role !== 'admin' ? [{ label: 'Jadwal', href: '/my-registrations' }] : []),
  ]

  const isActive = (href) => location.pathname === href
  const photoUrl = user?.photo
    ? `${BASE_URL}${user.photo.startsWith('/') ? '' : '/'}${user.photo}`
    : null

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500
        ${scrolled 
          ? 'bg-black/95 border-b border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.03)]' 
          : 'bg-black/70 border-b border-white/5'}
      `}
      style={{ backdropFilter: 'blur(20px) saturate(1.5)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/">
              <Logo size="sm" />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Link
                  to={link.href}
                  className={`
                    relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em]
                    transition-all duration-300
                    ${isActive(link.href)
                      ? 'text-white'
                      : 'text-[#666666] hover:text-white'
                    }
                  `}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-px bg-white"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className="hidden md:flex p-2.5 text-[#555555] hover:text-white transition-colors duration-300"
            >
              <Search className="w-[16px] h-[16px]" />
            </motion.button>

            {/* Notification */}
            {user && (
              <div className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(prev => !prev)}
                  className="flex p-2.5 text-[#555555] hover:text-white transition-colors duration-300 relative"
                >
                  <Bell className="w-[16px] h-[16px]" />
                  {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center">{unreadCount}</span>}
                </motion.button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute right-0 top-full mt-3 w-80 max-h-96 overflow-auto border border-white/10 bg-black/95 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
                      style={{ backdropFilter: 'blur(18px) saturate(1.4)' }}
                    >
                      <div className="border-b border-white/10 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white">Notifikasi</p>
                      </div>
                      <div className="p-2">
                        {notifications.length === 0 ? (
                          <p className="px-3 py-6 text-center text-xs text-[#737373]">Belum ada notifikasi</p>
                        ) : notifications.map(notification => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full border-b border-white/5 px-3 py-3 text-left transition-colors hover:bg-white/5 ${notification.is_read ? 'opacity-60' : 'opacity-100'}`}
                          >
                            <p className="text-xs font-bold text-white">{notification.title}</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-[#737373]">{notification.message}</p>
                            <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-[#525252]">{new Date(notification.created_at).toLocaleString('id-ID')}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative hidden sm:block"
                ref={profileMenuRef}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className={`flex items-center gap-2.5 border px-2.5 py-2 transition-all duration-300 group
                    ${showProfileMenu ? 'border-white/30 bg-white/[0.04]' : 'border-white/10 hover:border-white/25 hover:bg-white/[0.03]'}`}
                >
                  <div className="w-8 h-8 overflow-hidden border border-[#333333] bg-[#0a0a0a] flex items-center justify-center transition-colors duration-300 group-hover:border-white/45">
                    {photoUrl ? (
                      <img src={photoUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#888888] group-hover:text-white transition-colors" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left leading-none">
                    <span className="block max-w-[120px] truncate text-xs font-semibold text-[#d4d4d4] tracking-wide group-hover:text-white transition-colors">
                      {user.name}
                    </span>
                    <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#666666]">
                      {user.role || 'User'}
                    </span>
                  </div>
                  <ChevronDown className={`hidden lg:block h-3.5 w-3.5 text-[#666666] transition-transform duration-300 ${showProfileMenu ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-3 w-64 overflow-hidden border border-white/10 bg-black/95 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
                      style={{ backdropFilter: 'blur(18px) saturate(1.4)' }}
                    >
                      <div className="border-b border-white/10 p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 overflow-hidden border border-white/15 bg-[#0a0a0a] flex items-center justify-center">
                            {photoUrl ? (
                              <img src={photoUrl} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-5 w-5 text-[#777777]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">{user.name}</p>
                            <p className="truncate text-[11px] text-[#737373] mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            navigate('/profile')
                          }}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#888888] transition-all duration-300 hover:bg-white/5 hover:text-white"
                        >
                          <Settings className="h-4 w-4" strokeWidth={1.6} />
                          Profile Saya
                        </button>

                        {user.role === 'admin' && (
                          <button
                            onClick={() => {
                              setShowProfileMenu(false)
                              navigate('/admin')
                            }}
                            className="flex w-full items-center gap-3 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#888888] transition-all duration-300 hover:bg-white/5 hover:text-white"
                          >
                            <User className="h-4 w-4" strokeWidth={1.6} />
                            Admin Panel
                          </button>
                        )}

                        <div className="my-2 h-px bg-white/10" />

                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            handleLogout()
                          }}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#666666] transition-all duration-300 hover:bg-white/5 hover:text-white"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={1.6} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-[#cccccc] transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#666666] hover:text-white transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block border-t border-white/5"
            >
              <div className="py-4">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
                  <input
                    type="text"
                    placeholder="Search events, schedules, participants..."
                    className="w-full bg-[#0a0a0a] border border-[#222222] text-white placeholder-[#444444] 
                               px-4 py-3 pl-11 text-sm outline-none
                               focus:border-[#555555] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.05)]
                               transition-all duration-300"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/5 bg-black/95"
              style={{ backdropFilter: 'blur(20px)' }}
            >
              <div className="px-4 py-6 space-y-0.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        block px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300
                        ${isActive(link.href)
                          ? 'bg-white/5 text-white border-l-2 border-white'
                          : 'text-[#666666] hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {user ? (
                  <>
                    <div className="border-t border-white/10 pt-4 mt-4 space-y-0.5">
                      <div className="mb-4 flex items-center gap-3 px-4 py-3 border border-white/10 bg-white/[0.02]">
                        <div className="h-10 w-10 overflow-hidden border border-white/15 bg-[#0a0a0a] flex items-center justify-center">
                          {photoUrl ? (
                            <img src={photoUrl} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-[#777777]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{user.name}</p>
                          <p className="truncate text-[11px] text-[#737373]">{user.email}</p>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-xs font-bold text-[#888888] uppercase tracking-[0.15em] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Profile Saya
                      </Link>

                      {user.role === 'admin' && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 text-xs font-bold text-white uppercase tracking-[0.15em] bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            Admin Panel
                          </Link>
                        </motion.div>
                      )}
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-[#666666] uppercase tracking-[0.15em] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Logout
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block text-center px-4 py-3 border border-[#333333] text-white text-xs font-bold uppercase tracking-[0.2em] hover:border-white transition-colors duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block text-center px-4 py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#cccccc] transition-colors duration-300"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
