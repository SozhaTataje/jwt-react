import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Users, CheckSquare, Clock, Home, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-purple-700 text-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <Home size={24} />
          Gestión CRUD
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden lg:flex items-center gap-6">
          {/* Menú según rol */}
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/empleados" className="hover:text-gray-300 flex items-center gap-1">
                <Users size={18} /> Empleados
              </Link>
              <Link to="/tareas" className="hover:text-gray-300 flex items-center gap-1">
                <CheckSquare size={18} /> Tareas
              </Link>
              <Link to="/horarios/asignar" className="hover:text-gray-300 flex items-center gap-1">
                <Clock size={18} /> Horarios
              </Link>
            </>
          )}
          {(user?.role === 'COORDINADOR' || user?.role === 'SECRETARIO') && (
            <>
              <Link to="/empleados" className="hover:text-gray-300 flex items-center gap-1">
                <Users size={18} /> Ver Empleados
              </Link>
              <Link to="/horarios" className="hover:text-gray-300 flex items-center gap-1">
                <Clock size={18} /> Ver Horarios
              </Link>
            </>
          )}

          {/* Usuario */}
          <span className="text-sm">{user?.email} ({user?.role})</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-white text-purple-700 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-purple-600 px-4 pb-4">
          <div className="flex flex-col gap-3">
            {user?.role === 'ADMIN' && (
              <>
                <Link to="/empleados" className="flex items-center gap-2">
                  <Users size={18} /> Empleados
                </Link>
                <Link to="/tareas" className="flex items-center gap-2">
                  <CheckSquare size={18} /> Tareas
                </Link>
                <Link to="/horarios/asignar" className="flex items-center gap-2">
                  <Clock size={18} /> Horarios
                </Link>
              </>
            )}
            {(user?.role === 'COORDINADOR' || user?.role === 'SECRETARIO') && (
              <>
                <Link to="/empleados" className="flex items-center gap-2">
                  <Users size={18} /> Ver Empleados
                </Link>
                <Link to="/horarios" className="flex items-center gap-2">
                  <Clock size={18} /> Ver Horarios
                </Link>
              </>
            )}
            <div className="mt-4 border-t border-white pt-3 flex justify-between items-center">
              <span className="text-sm">{user?.email} ({user?.role})</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-white text-purple-700 px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                <LogOut size={16} /> Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
