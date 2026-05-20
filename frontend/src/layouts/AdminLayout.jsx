import { Outlet, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { DashboardProvider } from '../context/DashboardContext'
import { VintageAdminSidebar } from '../components/Vintage'
import AnimatedMonochromeBackground from '../components/AnimatedMonochromeBackground'

export default function AdminLayout() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative flex min-h-screen">
      {/* Global animated background */}
      <AnimatedMonochromeBackground />
      
      {/* Content overlay */}
      <div className="relative z-10 flex w-full">
        <VintageAdminSidebar onLogout={handleLogout} />
        <DashboardProvider>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </DashboardProvider>
      </div>
    </div>
  )
}
