import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Users,
  CheckSquare,
  Clock,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="bg-purple-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
          <Home size={24} />
          <span>Gestión CRUD</span>
        </Link>

        <button
          onClick={toggleMobileMenu}
          className="lg:hidden text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden lg:flex items-center gap-6">
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/empleados" className="flex items-center gap-1 hover:text-gray-200">
                <Users size={20} />
                Empleados
              </Link>
              <Link to="/tareas" className="flex items-center gap-1 hover:text-gray-200">
                <CheckSquare size={20} />
                Tareas
              </Link>
              <Link to="/horarios/asignar" className="flex items-center gap-1 hover:text-gray-200">
                <Clock size={20} />
                Horarios
              </Link>
            </>
          )}

          {(user?.role === 'COORDINADOR' || user?.role === 'SECRETARIO') && (
            <>
              <Link to="/empleados" className="flex items-center gap-1 hover:text-gray-200">
                <Users size={20} />
                Ver Empleados
              </Link>
              <Link to="/horarios" className="flex items-center gap-1 hover:text-gray-200">
                <Clock size={20} />
                Ver Horarios
              </Link>
            </>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm">
              {user?.email} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 bg-white text-purple-600 rounded hover:bg-gray-100 transition"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="flex flex-col gap-3">
            {user?.role === 'ADMIN' && (
              <>
                <Link to="/empleados" className="flex items-center gap-2">
                  <Users size={20} />
                  Empleados
                </Link>
                <Link to="/tareas" className="flex items-center gap-2">
                  <CheckSquare size={20} />
                  Tareas
                </Link>
                <Link to="/horarios/asignar" className="flex items-center gap-2">
                  <Clock size={20} />
                  Horarios
                </Link>
              </>
            )}

            {(user?.role === 'COORDINADOR' || user?.role === 'SECRETARIO') && (
              <>
                <Link to="/empleados" className="flex items-center gap-2">
                  <Users size={20} />
                  Ver Empleados
                </Link>
                <Link to="/horarios" className="flex items-center gap-2">
                  <Clock size={20} />
                  Ver Horarios
                </Link>
              </>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm">
                {user?.email} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 bg-white text-purple-600 rounded hover:bg-gray-100"
              >
                <LogOut size={18} />
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
