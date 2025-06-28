import axios from 'axios'

const API_URL = 'http://localhost:8080'

const authService = {
  login: (email, password) => {
    return axios.post(`${API_URL}/auth/login`, {
      email,
      password
    })
  }
}

// Interceptor para agregar token a las requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas de error (ej: token expirado)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { authService }