import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    explore: [
      { label: 'Home', to: '/' },
      { label: 'Events', to: '/events' },
      { label: 'My Registrations', to: '/my-registrations' },
    ],
    account: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'Profile', to: '/profile' },
    ],
  }

  return (
    <footer className="border-t border-[#1a1a1a] bg-black">
      <div className="container-editorial">
        {/* Main Footer */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="mb-6 block">
              <Logo size="sm" />
            </Link>
            <p className="text-[#737373] text-sm leading-relaxed max-w-sm mb-8">
              Sistem manajemen event kampus untuk mengelola kegiatan,
              peserta, dan jadwal secara modern dan efisien.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[#333333] to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">
                Since 2024
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252] mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1 text-sm text-[#737373] hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252] mb-6">
              Account
            </h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-1 text-sm text-[#737373] hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1a1a1a] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#525252]">
            &copy; {currentYear} Campus Event Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#525252] hover:text-[#737373] cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="text-[11px] text-[#525252] hover:text-[#737373] cursor-pointer transition-colors">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
