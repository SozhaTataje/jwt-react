import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))

        let userRole = 'ADMIN'
        if (payload.rol) {
          userRole = payload.rol.replace('ROLE_', '')
        }

        const userData = {
          email: payload.sub,
          role: userRole
        }

        console.log('Token payload:', payload)
        console.log('User data:', userData)

        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error al decodificar token:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const token = response.data

      localStorage.setItem('token', token)

      const payload = JSON.parse(atob(token.split('.')[1]))

      let userRole = 'ADMIN'
      if (payload.rol) {
        userRole = payload.rol.replace('ROLE_', '')
      }

      const userData = {
        email: payload.sub,
        role: userRole
      }

      console.log('Login successful, payload:', payload)
      console.log('User data:', userData)

      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, rol: userRole }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: error.response?.data || 'Error al iniciar sesión'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
