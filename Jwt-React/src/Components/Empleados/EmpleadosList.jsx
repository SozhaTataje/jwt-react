import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import { Users, Plus, Edit, Trash2, Mail, User } from 'lucide-react'

function EmpleadosList() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    loadEmpleados()
  }, [])

  const loadEmpleados = async () => {
    try {
      const response = await api.get('/empleados')
      setEmpleados(response.data)
    } catch (error) {
      setError('Error al cargar empleados')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await api.get(`/empleados/eliminar/${id}`)
        setEmpleados(empleados.filter(emp => emp.id !== id))
      } catch (error) {
        setError('Error al eliminar empleado')
        console.error('Error:', error)
      }
    }
  }

  if (loading) return <div className="loading">Cargando empleados...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <Users size={32} />
          <div>
            <h1>Empleados</h1>
            <p>Gestión de empleados del sistema</p>
          </div>
        </div>
        
        {user?.role === 'ADMIN' && (
          <Link to="/empleados/crear" className="btn-primary">
            <Plus size={20} />
            Nuevo Empleado
          </Link>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th><User size={16} /> Nombre</th>
              <th><Mail size={16} /> Email</th>
              <th>Rol</th>
              <th>Tareas Asignadas</th>
              {user?.role === 'ADMIN' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {empleado.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span>{empleado.nombre}</span>
                  </div>
                </td>
                <td>{empleado.email}</td>
                <td>
                  <span className={`role-badge ${empleado.rol.toLowerCase()}`}>
                    {empleado.rol}
                  </span>
                </td>
                <td>
                  <span className="tasks-count">
                    {empleado.tareas?.length || 0} tareas
                  </span>
                </td>
                {user?.role === 'ADMIN' && (
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/empleados/editar/${empleado.id}`} 
                        className="btn-icon edit"
                        title="Editar empleado"
                      >
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(empleado.id)}
                        className="btn-icon delete"
                        title="Eliminar empleado"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {empleados.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <h3>No hay empleados registrados</h3>
            <p>Comienza agregando tu primer empleado al sistema</p>
            {user?.role === 'ADMIN' && (
              <Link to="/empleados/crear" className="btn-primary">
                <Plus size={20} />
                Crear Primer Empleado
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmpleadosList
