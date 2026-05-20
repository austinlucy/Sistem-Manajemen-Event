import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, Clock, LogOut, ChevronRight, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '../Logo'

export default function VintageAdminSidebar({ onLogout }) {
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Events', icon: Calendar, path: '/admin/events' },
    { label: 'Participants', icon: Users, path: '/admin/participants' },
    { label: 'Schedules', icon: Clock, path: '/admin/schedules' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full md:w-64 lg:w-72 bg-[#0a0a0a]/90 border-r border-white/5 p-4 md:p-5 lg:p-6 flex-shrink-0 flex flex-col sticky top-0 h-screen md:max-h-screen overflow-y-auto"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Logo */}
      <Link to="/" className="mb-8 md:mb-10 group block transition-transform duration-300 hover:translate-x-0.5" title="Kembali ke Website">
        <Logo size="sm" inverted className="[&>div:first-child]:transition-colors [&>div:first-child]:duration-300 group-hover:[&>div:first-child]:border-white/45 [&>div:last-child>span]:text-white" />
      </Link>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-white/20 to-transparent mb-6 md:mb-8"></div>

      {/* Menu Label */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#444444] mb-4 px-3 hidden md:block font-bold">
        Menu
      </p>

      {/* Menu */}
      <nav className="space-y-0.5 mb-6 md:mb-8 flex-1">
        {menuItems.map((item, idx) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.08 }}
          >
            <Link
              to={item.path}
              className={`
                flex items-center gap-3 px-3 md:px-4 py-3 transition-all duration-300
                font-bold text-[11px] uppercase tracking-[0.1em]
                ${isActive(item.path)
                  ? 'bg-white text-black'
                  : 'text-[#666666] hover:text-white hover:bg-white/5 hover:translate-x-1'
                }
              `}
              title={item.label}
            >
              <item.icon size={16} className="flex-shrink-0" strokeWidth={1.5} />
              <span className="hidden md:inline">{item.label}</span>
              {isActive(item.path) && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto hidden md:block" />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-white/10 to-transparent my-4 md:my-6"></div>

      {/* Back to website */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to="/"
          className="mb-2 w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-3
                     text-[#666666] hover:text-white hover:bg-white/5
                     transition-all duration-300 font-bold text-[11px] uppercase tracking-[0.1em]
                     border border-white/5 hover:border-white/20"
          title="Kembali ke Website"
        >
          <ArrowLeft size={16} className="flex-shrink-0" strokeWidth={1.5} />
          <span className="hidden md:inline">Kembali ke Website</span>
        </Link>
      </motion.div>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-3 
                   text-[#555555] hover:text-white hover:bg-white/5 
                   transition-all duration-300 font-bold text-[11px] uppercase tracking-[0.1em]
                   border border-white/5 hover:border-white/20"
        title="Logout"
      >
        <LogOut size={16} className="flex-shrink-0" strokeWidth={1.5} />
        <span className="hidden md:inline">Logout</span>
      </motion.button>
    </motion.aside>
  )
}
