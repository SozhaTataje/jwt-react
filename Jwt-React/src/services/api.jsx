import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

// Empleados
export const empleadosService = {
  getAll: () => axios.get(`${API_URL}/empleados`),
  getById: (id) => axios.get(`${API_URL}/empleados/${id}`),
  create: (empleado) => axios.post(`${API_URL}/empleados/crear`, empleado),
  update: (id, empleado) => axios.post(`${API_URL}/empleados/editar/${id}`, empleado),
  delete: (id) => axios.get(`${API_URL}/empleados/eliminar/${id}`)
}

// Tareas
export const tareasService = {
  getAll: () => axios.get(`${API_URL}/tareas`),
  getById: (id) => axios.get(`${API_URL}/tareas/${id}`),
  create: (tarea) => axios.post(`${API_URL}/tareas/asignar`, null, { params: tarea }),
  update: (id, tarea) => axios.post(`${API_URL}/tareas/editar/${id}`, tarea),
  delete: (id) => axios.get(`${API_URL}/tareas/eliminar/${id}`),
  getByEmpleado: (empleadoId) => axios.get(`${API_URL}/tareas/por-empleado/${empleadoId}`)
}

// Horarios
export const horariosService = {
  getAll: () => axios.get(`${API_URL}/horarios`),
  getById: (id) => axios.get(`${API_URL}/horarios/${id}`),
  create: (horario) => axios.post(`${API_URL}/horarios/asignar`, horario),
  update: (id, horario) => axios.post(`${API_URL}/horarios/editar/${id}`, horario),
  delete: (id) => axios.get(`${API_URL}/horarios/eliminar/${id}`)
}