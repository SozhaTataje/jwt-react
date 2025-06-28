import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axiosInstance'
import { CheckSquare, User, Calendar, FileText, Save, ArrowLeft } from 'lucide-react'

function TareasForm() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [empleados, setEmpleados] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  const estados = ['Pendiente', 'En progreso', 'Completada']

  useEffect(() => {
    loadEmpleados()
    if (id) {
      setIsEdit(true)
      loadTarea()
    }
  }, [id])

  const loadEmpleados = async () => {
    try {
      const response = await api.get('/empleados')
      setEmpleados(response.data)
    } catch (error) {
      console.error('Error al cargar empleados:', error)
    }
  }

  const loadTarea = async () => {
    try {
      const response = await api.get(`/tareas/${id}`)
      const tarea = response.data
      setValue('descripcion', tarea.descripcion)
      setValue('estado', tarea.estado)
      setValue('fecha', tarea.fecha)
      setValue('empleadoId', tarea.empleado.id)
    } catch (error) {
      setError('Error al cargar tarea')
      console.error('Error:', error)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        const tareaData = {
          descripcion: data.descripcion,
          estado: data.estado,
          fecha: data.fecha,
          empleado: { id: data.empleadoId }
        }
        await api.put(`/tareas/${id}`, tareaData)
      } else {
        await api.post('/tareas/asignar', {
          descripcion: data.descripcion,
          estado: data.estado,
          fecha: data.fecha,
          empleadoId: data.empleadoId
        })
      }
      navigate('/tareas')
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar tarea')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <CheckSquare size={32} />
          <div>
            <h1>{isEdit ? 'Editar Tarea' : 'Asignar Tarea'}</h1>
            <p>{isEdit ? 'Modifica la información de la tarea' : 'Asigna una nueva tarea a un empleado'}</p>
          </div>
        </div>
        
        <button onClick={() => navigate('/tareas')} className="btn-secondary">
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label htmlFor="descripcion">
                <FileText size={20} />
                Descripción
              </label>
              <textarea
                id="descripcion"
                rows={4}
                {...register('descripcion', {
                  required: 'La descripción es requerida',
                  minLength: {
                    value: 5,
                    message: 'La descripción debe tener al menos 5 caracteres'
                  },
                  maxLength: {
                    value: 200,
                    message: 'La descripción no puede exceder 200 caracteres'
                  }
                })}
                className={errors.descripcion ? 'error' : ''}
                placeholder="Describe la tarea a realizar..."
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="estado">
                <CheckSquare size={20} />
                Estado
              </label>
              <select
                id="estado"
                {...register('estado', {
                  required: 'El estado es requerido'
                })}
                className={errors.estado ? 'error' : ''}
              >
                <option value="">Selecciona un estado</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              {errors.estado && <span className="error-message">{errors.estado.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fecha">
                <Calendar size={20} />
                Fecha
              </label>
              <input
                id="fecha"
                type="date"
                {...register('fecha', {
                  required: 'La fecha es requerida',
                  validate: (value) => {
                    const today = new Date().toISOString().split('T')[0]
                    return value >= today || 'La fecha debe ser hoy o en el futuro'
                  }
                })}
                className={errors.fecha ? 'error' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.fecha && <span className="error-message">{errors.fecha.message}</span>}
            </div>

            <div className="form-group span-2">
              <label htmlFor="empleadoId">
                <User size={20} />
                Empleado Asignado
              </label>
              <select
                id="empleadoId"
                {...register('empleadoId', {
                  required: 'Debe seleccionar un empleado'
                })}
                className={errors.empleadoId ? 'error' : ''}
              >
                <option value="">Selecciona un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre} ({empleado.email}) - {empleado.tareas?.length || 0} tareas asignadas
                  </option>
                ))}
              </select>
              {errors.empleadoId && <span className="error-message">{errors.empleadoId.message}</span>}
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              <Save size={20} />
              {loading ? 'Guardando...' : isEdit ? 'Actualizar Tarea' : 'Asignar Tarea'}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/tareas')} 
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="form-help">
          <h4>Información importante:</h4>
          <ul>
            <li>Cada empleado puede tener máximo 5 tareas asignadas</li>
            <li>La fecha debe ser igual o posterior al día actual</li>
            <li>La descripción debe ser clara y específica</li>
            <li>Puedes cambiar el estado de la tarea en cualquier momento</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TareasForm
