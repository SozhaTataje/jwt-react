import api from '../api/axiosInstance.js';

const AuthService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  }
}

export default AuthService
