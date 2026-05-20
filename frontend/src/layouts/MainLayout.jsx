import { Outlet } from 'react-router-dom'
import { RetroNavbar, VintageFooter } from '../components/Vintage'
import AnimatedMonochromeBackground from '../components/AnimatedMonochromeBackground'

export default function MainLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Global animated background */}
      <AnimatedMonochromeBackground />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <RetroNavbar />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
            <Outlet />
          </div>
        </main>
        <VintageFooter />
      </div>
    </div>
  )
}
