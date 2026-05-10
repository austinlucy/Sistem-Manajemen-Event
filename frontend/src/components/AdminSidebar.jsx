import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, LogOut, TicketIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminSidebar({ onLogout }) {
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Events', icon: Calendar, path: '/admin/events' },
    { label: 'Participants', icon: Users, path: '/admin/participants' },
  ]

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 p-6 fixed h-screen overflow-auto"
    >
      {/* Logo */}
      <Link to="/admin" className="flex items-center space-x-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <TicketIcon className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-white text-lg">Admin</span>
      </Link>

      {/* Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-700/50 transition"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </motion.aside>
  )
}
