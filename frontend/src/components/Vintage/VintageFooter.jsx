import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import Logo from '../Logo'

export default function VintageFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 bg-black/80 border-t border-white/5 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-4">
              <Logo size="sm" inverted className="[&>div:last-child>span]:text-white" />
            </div>
            <p className="text-sm text-[#666666] leading-relaxed mb-6">
              Sistem manajemen event kampus untuk mengelola kegiatan, peserta, jadwal, dan laporan secara lebih mudah.
            </p>
            {/* Geometric pattern */}
            <div className="flex gap-2">
              <div className="w-8 h-8 border border-white/10"></div>
              <div className="w-8 h-8 bg-white"></div>
              <div className="w-8 h-8 border border-white/10 rounded-full"></div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444444] mb-5">
              Menu Utama
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Dashboard', href: '/' },
                { label: 'Semua Event', href: '/events' },
                { label: 'Profil Saya', href: '/profile' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[#888888] hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444444] mb-5">
              Bantuan
            </h4>
            <ul className="space-y-3 text-sm">
              {['FAQ', 'Panduan', 'Kebijakan Privasi', 'Syarat & Ketentuan'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#888888] hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444444] mb-5">
              Kontak
            </h4>
            <ul className="space-y-3 text-sm text-[#888888]">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#444444] flex-shrink-0" />
                events@campus.edu
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#444444] flex-shrink-0" />
                +62 812 3456 7890
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#444444] flex-shrink-0" />
                Gedung Rektorat, Lt. 3
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-2 mt-6">
              {['Tw', 'Ig', 'Fb', 'Yt'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#666666] hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between text-[10px] text-[#444444] pt-6 md:pt-8 gap-4 md:gap-0 uppercase tracking-[0.15em]"
        >
          <p>&copy; {currentYear} Event Hub — Campus Event Management</p>
          <p className="text-[#333333]">Monochrome Edition</p>
        </motion.div>
      </div>
    </footer>
  )
}
