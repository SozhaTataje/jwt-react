import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'
import { Clock, Plus, Edit, User, Calendar } from 'lucide-react'

function HorariosList() {
  const [horarios, setHorarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    loadHorarios()
  }, [])

  const loadHorarios = async () => {
    try {
      const response = await api.get('/horarios')
      setHorarios(response.data)
    } catch (error) {
      setError('Error al cargar horarios')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (day) => {
    const days = {
      'LUNES': 'Lunes',
      'MARTES': 'Martes',
      'MIERCOLES': 'Miércoles',
      'JUEVES': 'Jueves',
      'VIERNES': 'Viernes',
      'SABADO': 'Sábado',
      'DOMINGO': 'Domingo'
    }
    return days[day] || day
  }

  const formatTime = (time) => {
    return time.substring(0, 5)
  }

  const groupHorariosByEmpleado = (horarios) => {
    return horarios.reduce((acc, horario) => {
      const empleadoId = horario.empleado.id
      if (!acc[empleadoId]) {
        acc[empleadoId] = {
          empleado: horario.empleado,
          horarios: []
        }
      }
      acc[empleadoId].horarios.push(horario)
      return acc
    }, {})
  }

  const horariosGrouped = groupHorariosByEmpleado(horarios)

  if (loading) return <div className="loading">Cargando horarios...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <Clock size={32} />
          <div>
            <h1>Horarios</h1>
            <p>Gestión de horarios de trabajo de empleados</p>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <Link to="/horarios/asignar" className="btn-primary">
            <Plus size={20} />
            Asignar Horario
          </Link>
        )}
      </div>

      {Object.keys(horariosGrouped).length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h3>No hay horarios registrados</h3>
          <p>Comienza asignando el primer horario a un empleado</p>
          {user?.role === 'ADMIN' && (
            <Link to="/horarios/asignar" className="btn-primary">
              <Plus size={20} />
              Asignar Primer Horario
            </Link>
          )}
        </div>
      ) : (
        <div className="horarios-grid">
          {Object.values(horariosGrouped).map(({ empleado, horarios }) => (
            <div key={empleado.id} className="empleado-horarios-card">
              <div className="card-header">
                <div className="empleado-info">
                  <div className="user-avatar">
                    {empleado.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{empleado.nombre}</h3>
                    <p>{empleado.email}</p>
                    <span className={`role-badge ${empleado.rol.toLowerCase()}`}>
                      {empleado.rol}
                    </span>
                  </div>
                </div>
              </div>

              <div className="horarios-list">
                {horarios.map((horario) => (
                  <div key={horario.id} className="horario-item">
                    <div className="horario-day">
                      <Calendar size={16} />
                      <span>{getDayName(horario.dia)}</span>
                    </div>
                    <div className="horario-time">
                      <Clock size={16} />
                      <span>{formatTime(horario.horaInicio)} - {formatTime(horario.horaFin)}</span>
                    </div>
                    {user?.role === 'COORDINADOR' && (
                      <div className="horario-actions">
                        <Link
                          to={`/horarios/editar/${horario.id}`}
                          className="btn-icon edit"
                          title="Editar horario"
                        >
                          <Edit size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <span className="horarios-count">
                  {horarios.length} horario{horarios.length !== 1 ? 's' : ''} asignado{horarios.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de tabla alternativa */}
      <div className="table-view">
        <h3>Vista Detallada</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <User size={16} />
                  Empleado
                </th>
                <th>
                  <Calendar size={16} />
                  Día
                </th>
                <th>
                  <Clock size={16} />
                  Hora Inicio
                </th>
                <th>
                  <Clock size={16} />
                  Hora Fin
                </th>
                {user?.role === 'COORDINADOR' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <tr key={horario.id}>
                  <td>{horario.empleado.nombre}</td>
                  <td>{getDayName(horario.dia)}</td>
                  <td>{formatTime(horario.horaInicio)}</td>
                  <td>{formatTime(horario.horaFin)}</td>
                  {user?.role === 'COORDINADOR' && (
                    <td>
                      <Link
                        to={`/horarios/editar/${horario.id}`}
                        className="btn-icon-table"
                        title="Editar horario"
                      >
                        <Edit size={16} />
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default HorariosList
