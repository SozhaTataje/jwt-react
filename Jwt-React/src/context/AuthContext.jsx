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
      // Decodificar el token para obtener info del usuario
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
      
        const userData = {
          email: payload.sub,
          role:  payload.rol.slice(5) // Por defecto, ya que el JWT no incluye rol en tu implementación
        }
        
        console.log(userData)
        console.log(payload)
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

      // Decodificar token para obtener información del usuario
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userData = {
        email: payload.sub,
        role: 'ADMIN' // Temporalmente hardcodeado, necesitarías modificar el backend para incluir rol en JWT
      }

      setUser(userData)
      setIsAuthenticated(true)
      return { success: true }
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