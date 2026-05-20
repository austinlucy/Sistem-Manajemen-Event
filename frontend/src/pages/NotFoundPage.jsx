import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { VintageButton, VintageCard } from '../components/Vintage'

export default function NotFoundPage() {
 return (
 <div className="min-h-screen bg-black flex items-center justify-center px-4 transition-colors duration-300">
  <motion.div
  initial={{ opacity: 0, scale: 0.9, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-center w-full max-w-2xl"
  >
  <VintageCard className="bg-black ">
   <div className="py-10 md:py-16 px-4 md:px-8">
   {/* Large 404 */}
   <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="mb-6 md:mb-8"
   >
    <h1 className="text-7xl md:text-9xl font-black text-white tracking-editorial">
    404
    </h1>
   </motion.div>

   {/* Heading */}
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="mb-8"
   >
    <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight uppercase mb-3">
    Halaman Tidak Ditemukan
    </h2>
    <p className="text-sm md:text-base text-[#666666] leading-relaxed">
    Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
    </p>
   </motion.div>

   {/* Decorative line */}
   <motion.div
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="h-[2px] bg-black my-8 w-24 mx-auto"
   ></motion.div>

   {/* Button */}
   <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
   >
    <Link to="/" className="inline-block">
    <VintageButton
     variant="primary"
     size="md"
     className="flex items-center gap-2"
    >
     <Home className="w-4 h-4" />
     <span>Kembali ke Home</span>
    </VintageButton>
    </Link>
   </motion.div>
   </div>
  </VintageCard>
  </motion.div>
 </div>
 )
}
