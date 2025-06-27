import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axiosInstance'
import { Clock, User, Calendar, Save, ArrowLeft } from 'lucide-react'

function HorariosForm() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [empleados, setEmpleados] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  const dias = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIERCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' },
    { value: 'SABADO', label: 'Sábado' },
    { value: 'DOMINGO', label: 'Domingo' }
  ]

  useEffect(() => {
    if (!isEdit) {
      loadEmpleados()
    }
    if (id) {
      setIsEdit(true)
      loadHorario()
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

  const loadHorario = async () => {
    try {
      const response = await api.get(`/horarios/${id}`)
      const horario = response.data
      setValue('dia', horario.dia)
      setValue('horaInicio', horario.horaInicio)
      setValue('horaFin', horario.horaFin)
      if (horario.empleado) {
        setValue('empleadoId', horario.empleado.id)
      }
    } catch (error) {
      setError('Error al cargar horario')
      console.error('Error:', error)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        await api.post(`/horarios/editar/${id}`, {
          dia: data.dia,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin
        })
      } else {
        await api.post('/horarios/asignar', {
          dia: data.dia,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          empleadoId: data.empleadoId
        })
      }
      navigate('/horarios')
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.includes('5 tareas')) {
        setError('No se puede asignar horario: el empleado ya tiene 5 tareas asignadas')
      } else {
        setError(error.response?.data?.message || 'Error al guardar horario')
      }
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const horaInicio = watch('horaInicio')

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <Clock size={32} />
          <div>
            <h1>{isEdit ? 'Editar Horario' : 'Asignar Horario'}</h1>
            <p>{isEdit ? 'Modifica el horario de trabajo' : 'Asigna un nuevo horario a un empleado'}</p>
          </div>
        </div>

        <button onClick={() => navigate('/horarios')} className="btn-secondary">
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-grid">
            {!isEdit && (
              <div className="form-group span-2">
                <label htmlFor="empleadoId">
                  <User size={20} />
                  Empleado
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
                      {empleado.nombre} ({empleado.email})
                    </option>
                  ))}
                </select>
                {errors.empleadoId && <span className="error-message">{errors.empleadoId.message}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="dia">
                <Calendar size={20} />
                Día de la Semana
              </label>
              <select
                id="dia"
                {...register('dia', {
                  required: 'El día es requerido'
                })}
                className={errors.dia ? 'error' : ''}
              >
                <option value="">Selecciona un día</option>
                {dias.map((dia) => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>
              {errors.dia && <span className="error-message">{errors.dia.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="horaInicio">
                <Clock size={20} />
                Hora de Inicio
              </label>
              <input
                id="horaInicio"
                type="time"
                {...register('horaInicio', {
                  required: 'La hora de inicio es requerida'
                })}
                className={errors.horaInicio ? 'error' : ''}
              />
              {errors.horaInicio && <span className="error-message">{errors.horaInicio.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="horaFin">
                <Clock size={20} />
                Hora de Fin
              </label>
              <input
                id="horaFin"
                type="time"
                {...register('horaFin', {
                  required: 'La hora de fin es requerida',
                  validate: (value) => {
                    if (horaInicio && value <= horaInicio) {
                      return 'La hora de fin debe ser posterior a la hora de inicio'
                    }
                    return true
                  }
                })}
                className={errors.horaFin ? 'error' : ''}
              />
              {errors.horaFin && <span className="error-message">{errors.horaFin.message}</span>}
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              <Save size={20} />
              {loading ? 'Guardando...' : isEdit ? 'Actualizar Horario' : 'Asignar Horario'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/horarios')}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="form-help">
          <h4>Información importante:</h4>
          <ul>
            <li>Solo se puede asignar horario si el empleado tiene menos de 5 tareas</li>
            <li>La hora de fin debe ser posterior a la hora de inicio</li>
            <li>Se pueden asignar múltiples horarios por empleado para diferentes días</li>
            <li>Los coordinadores pueden editar horarios existentes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HorariosForm
