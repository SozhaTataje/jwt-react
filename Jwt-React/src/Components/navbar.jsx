import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <nav className="navbar-clean">
      <div className="navbar-container">
        <div className="navbar-links">
          {user?.role === 'ADMIN' && (
            <>
              <Link
                to="/empleados"
                className={`navbar-link${
                  location.pathname === '/empleados' ? ' active' : ''
                }`}
              >
                Empleados
              </Link>
              <Link
                to="/tareas"
                className={`navbar-link${
                  location.pathname === '/tareas' ? ' active' : ''
                }`}
              >
                Tareas
              </Link>
              <Link
                to="/horarios/asignar"
                className={`navbar-link${
                  location.pathname === '/horarios/asignar' ? ' active' : ''
                }`}
              >
                Horarios
              </Link>
            </>
          )}
          {(user?.role === 'COORDINADOR' || user?.role === 'SECRETARIO') && (
            <>
              <Link
                to="/empleados"
                className={`navbar-link${
                  location.pathname === '/empleados' ? ' active' : ''
                }`}
              >
                Ver Empleados
              </Link>
              <Link
                to="/horarios"
                className={`navbar-link${
                  location.pathname === '/horarios' ? ' active' : ''
                }`}
              >
                Ver Horarios
              </Link>
            </>
          )}
        </div>
        <div className="navbar-title">Usuario:</div>
        <div className="navbar-links">
          {user && (
            <>
              <span className="navbar-user">
                {user.email} ({user.role})
              </span>
              <button
                className="navbar-link"
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                }}
                onClick={logout}
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
