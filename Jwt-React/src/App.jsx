import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './Components/login';
import EmpleadosForm from './components/empleados/EmpleadosForm'
import EmpleadosList from './components/empleados/EmpleadosList'
import TareasList from './Components/tareas/TareasList'
import TareasForm from './components/tareas/TareasForm'
import Dashboard from './Components/Dashboard'
import HorariosList from './components/horarios/HorariosList'
import HorariosForm from './components/horarios/HorariosForm'
import Navbar from './Components/navbar'
import './App.css'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <div className="error">No tienes permisos para acceder a esta página</div>
  }

  return children
}

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Rutas de Empleados */}
          <Route path="/empleados" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COORDINADOR', 'SECRETARIO']}>
              <EmpleadosList />
            </ProtectedRoute>
          } />
          <Route path="/empleados/crear" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EmpleadosForm />
            </ProtectedRoute>
          } />
          <Route path="/empleados/editar/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EmpleadosForm />
            </ProtectedRoute>
          } />

          {/* Rutas de Tareas */}
          <Route path="/tareas" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COORDINADOR', 'SECRETARIO']}>
              <TareasList />
            </ProtectedRoute>
          } />
          <Route path="/tareas/asignar" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <TareasForm />
            </ProtectedRoute>
          } />
          <Route path="/tareas/editar/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <TareasForm />
            </ProtectedRoute>
          } />

          {/* Rutas de Horarios */}
          <Route path="/horarios" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COORDINADOR', 'SECRETARIO']}>
              <HorariosList />
            </ProtectedRoute>
          } />
          <Route path="/horarios/asignar" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <HorariosForm />
            </ProtectedRoute>
          } />
          <Route path="/horarios/editar/:id" element={
            <ProtectedRoute allowedRoles={['COORDINADOR']}>
              <HorariosForm />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App