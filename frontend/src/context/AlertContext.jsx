import { createContext, useState, useCallback } from 'react'

export const AlertContext = createContext()

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  const showAlert = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    const alert = { id, message, type }
    
    setAlerts(prev => [...prev, alert])

    if (duration > 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id))
      }, duration)
    }

    return id
  }, [])

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  const value = {
    alerts,
    showAlert,
    removeAlert,
    clearAlerts
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  )
}











