import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, LogOut, Clock, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from './Logo'

export default function AdminSidebar({ onLogout }) {
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Events', icon: Calendar, path: '/admin/events' },
    { label: 'Participants', icon: Users, path: '/admin/participants' },
    { label: 'Schedules', icon: Clock, path: '/admin/schedules' },
  ]

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] p-6 fixed h-screen overflow-auto z-40"
    >
      {/* Logo */}
      <Link to="/admin" className="mb-10 block">
        <Logo size="sm" />
      </Link>

      {/* Menu */}
      <nav className="space-y-1 mb-8">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] transition-all duration-300 ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-[#737373] hover:text-white hover:bg-[#111111]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="divider-left mb-6" />

      {/* Back to Home */}
      <Link
        to="/"
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#737373] hover:text-white hover:bg-[#111111] transition-all duration-300 mb-2"
      >
        <Home className="w-4 h-4" />
        <span>Halaman Utama</span>
      </Link>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#737373] hover:text-white hover:bg-[#111111] transition-all duration-300"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </motion.aside>
  )
}
