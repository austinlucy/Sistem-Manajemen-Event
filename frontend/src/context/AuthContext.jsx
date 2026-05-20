import { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const normalizeUser = (user) => {
    if (!user) return user

    const role = user.role || 'user'
    let parsedProfile = null
    try {
      const storedProfile = localStorage.getItem(`user_profile_${user.id}_${role}`)
      parsedProfile = storedProfile ? JSON.parse(storedProfile) : null
    } catch {
      localStorage.removeItem(`user_profile_${user.id}_${role}`)
    }

    return {
      ...user,
      name: parsedProfile?.name || user.name || '',
      email: parsedProfile?.email || user.email || '',
      photo: user.photo || parsedProfile?.photo || null
    }
  }

  const persistUser = (user) => {
    if (user) {
      const normalizedUser = normalizeUser(user)
      const role = normalizedUser.role || 'user'
      localStorage.setItem('user', JSON.stringify(normalizedUser))
      localStorage.setItem(`user_profile_${normalizedUser.id}_${role}`, JSON.stringify({
        name: normalizedUser.name,
        email: normalizedUser.email,
        photo: normalizedUser.photo || null
      }))
      return normalizedUser
    }

    localStorage.removeItem('user')
    return null
  }

  const [user, setUserState] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? normalizeUser(JSON.parse(storedUser)) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const setUser = (value) => {
    setUserState(prev => {
      const nextUser = typeof value === 'function' ? value(prev) : value
      return persistUser(nextUser)
    })
  }

  // Check token saat app pertama load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      // set header
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      // ambil data user terbaru dari server
      verifyToken(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(prev => ({
        ...prev,
        ...response.data.user,
        name: prev?.name || response.data.user?.name || '',
        email: prev?.email || response.data.user?.email || '',
        photo: response.data.user?.photo || prev?.photo || null
      }))
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return user
    } catch (error) {
      throw error.response?.data?.message || 'Login failed'
    }
  }

  const adminLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login-admin', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return user
    } catch (error) {
      throw error.response?.data?.message || 'Admin login failed'
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return user
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed'
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUserState(null)
    delete api.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    setUser,
    token,
    isLoading,
    login,
    adminLogin,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
