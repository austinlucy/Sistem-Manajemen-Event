import { createContext, useState, useCallback, useEffect } from 'react'
import { adminService } from '../services'

export const DashboardContext = createContext()

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const refreshStats = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminService.getDashboardStats()
      setStats(response.data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  // Auto-refresh every 30 seconds (reduced from 5s to save bandwidth)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if page is visible
      if (!document.hidden) {
        refreshStats()
      }
    }, 30000)

    // Also refresh when tab becomes visible
    const handleVisibility = () => {
      if (!document.hidden) {
        refreshStats()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [refreshStats])

  return (
    <DashboardContext.Provider value={{ stats, loading, error, refreshStats, lastUpdated }}>
      {children}
    </DashboardContext.Provider>
  )
}











