import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Users, CheckSquare, Clock, Plus, Eye } from 'lucide-react'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'COORDINADOR' ? 'Coordinador' : 'Secretario'}</h1>
        <p>Sistema de Gestión de Tareas y Empleados</p>
      </div>

      <div className="dashboard-grid">
        {user?.role === 'ADMIN' && (
          <>
            <div className="dashboard-card">
              <div className="card-icon">
                <Users size={32} />
              </div>
              <h3>Gestión de Empleados</h3>
              <p>Crear, editar y gestionar empleados del sistema</p>
              <div className="card-actions">
                <Link to="/empleados" className="btn-secondary">
                  <Eye size={16} />
                  Ver Empleados
                </Link>
                <Link to="/empleados/crear" className="btn-primary">
                  <Plus size={16} />
                  Nuevo Empleado
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <CheckSquare size={32} />
              </div>
              <h3>Gestión de Tareas</h3>
              <p>Asignar y gestionar tareas para empleados</p>
              <div className="card-actions">
                <Link to="/tareas" className="btn-secondary">
                  <Eye size={16} />
                  Ver Tareas
                </Link>
                <Link to="/tareas/asignar" className="btn-primary">
                  <Plus size={16} />
                  Asignar Tarea
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <Clock size={32} />
              </div>
              <h3>Gestión de Horarios</h3>
              <p>Asignar horarios a empleados</p>
              <div className="card-actions">
                <Link to="/horarios" className="btn-secondary">
                  <Eye size={16} />
                  Ver Horarios
                </Link>
                <Link to="/horarios/asignar" className="btn-primary">
                  <Plus size={16} />
                  Asignar Horario
                </Link>
              </div>
            </div>
          </>
        )}

        {(user?.role === 'COORDINADOR' || user?.role === 'SECRETARIO') && (
          <>
            <div className="dashboard-card">
              <div className="card-icon">
                <Users size={32} />
              </div>
              <h3>Empleados</h3>
              <p>Consultar información de empleados</p>
              <div className="card-actions">
                <Link to="/empleados" className="btn-primary">
                  <Eye size={16} />
                  Ver Empleados
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <Clock size={32} />
              </div>
              <h3>Horarios</h3>
              <p>Consultar horarios de trabajo</p>
              <div className="card-actions">
                <Link to="/horarios" className="btn-primary">
                  <Eye size={16} />
                  Ver Horarios
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h4>Tu Rol: {user?.role}</h4>
          <div className="role-permissions">
            {user?.role === 'ADMIN' && (
              <ul>
                <li>✓ Gestionar empleados (crear, editar, eliminar)</li>
                <li>✓ Gestionar tareas (asignar, editar, eliminar)</li>
                <li>✓ Asignar horarios</li>
                <li>✓ Acceso completo al sistema</li>
              </ul>
            )}
            {user?.role === 'COORDINADOR' && (
              <ul>
                <li>✓ Ver empleados</li>
                <li>✓ Ver y editar horarios</li>
                <li>✓ Consultar tareas</li>
              </ul>
            )}
            {user?.role === 'SECRETARIO' && (
              <ul>
                <li>✓ Ver empleados</li>
                <li>✓ Ver horarios</li>
                <li>✓ Consultar tareas</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard