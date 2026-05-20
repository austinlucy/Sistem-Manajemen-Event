import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'

// Components
import AlertContainer from './components/AlertContainer'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import MyRegistrationsPage from './pages/MyRegistrationsPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminEventsPage from './pages/AdminEventsPage'
import AdminParticipantsPage from './pages/AdminParticipantsPage'
import AdminSchedulesPage from './pages/AdminSchedulesPage'
import NotFoundPage from './pages/NotFoundPage'

// Layout
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#666666] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  return (
    <>
      <AlertContainer />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route
              path="/my-registrations"
              element={
                <ProtectedRoute>
                  <MyRegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route path="/admin/participants" element={<AdminParticipantsPage />} />
            <Route path="/admin/schedules" element={<AdminSchedulesPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  )
}
