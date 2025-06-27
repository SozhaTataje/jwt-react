import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axiosInstance'
import { User, Mail, Lock, Shield, Save, ArrowLeft } from 'lucide-react'

function EmpleadosForm() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  const roles = ['ADMIN', 'COORDINADOR', 'SECRETARIO']

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      loadEmpleado()
    }
  }, [id])

  const loadEmpleado = async () => {
    try {
      const response = await api.get(`/empleados/${id}`)
      const empleado = response.data
      setValue('nombre', empleado.nombre)
      setValue('email', empleado.email)
      setValue('rol', empleado.rol)
    } catch (error) {
      setError('Error al cargar empleado')
      console.error('Error:', error)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        await api.post(`/empleados/editar/${id}`, data)
      } else {
        await api.post('/empleados/crear', data)
      }
      navigate('/empleados')
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar empleado')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <User size={32} />
          <div>
            <h1>{isEdit ? 'Editar Empleado' : 'Crear Empleado'}</h1>
            <p>{isEdit ? 'Modifica la información del empleado' : 'Agrega un nuevo empleado al sistema'}</p>
          </div>
        </div>
        
        <button onClick={() => navigate('/empleados')} className="btn-secondary">
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">
                <User size={20} />
                Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                {...register('nombre', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  },
                  maxLength: {
                    value: 50,
                    message: 'El nombre no puede exceder 50 caracteres'
                  }
                })}
                className={errors.nombre ? 'error' : ''}
                placeholder="Ingresa el nombre completo"
              />
              {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={20} />
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                className={errors.email ? 'error' : ''}
                placeholder="ejemplo@email.com"
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={20} />
                {isEdit ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              </label>
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: !isEdit ? 'La contraseña es requerida' : false,
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                className={errors.password ? 'error' : ''}
                placeholder={isEdit ? 'Dejar vacío para mantener actual' : '••••••••'}
              />
              {errors.password && <span className="error-message">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rol">
                <Shield size={20} />
                Rol
              </label>
              <select
                id="rol"
                {...register('rol', {
                  required: 'El rol es requerido'
                })}
                className={errors.rol ? 'error' : ''}
              >
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
              {errors.rol && <span className="error-message">{errors.rol.message}</span>}
            </div>
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              <Save size={20} />
              {loading ? 'Guardando...' : isEdit ? 'Actualizar Empleado' : 'Crear Empleado'}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/empleados')} 
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="form-help">
          <h4>Información sobre roles:</h4>
          <ul>
            <li><strong>ADMIN:</strong> Acceso completo al sistema, puede gestionar empleados, tareas y horarios</li>
            <li><strong>COORDINADOR:</strong> Puede ver empleados, editar horarios y consultar tareas</li>
            <li><strong>SECRETARIO:</strong> Solo puede consultar empleados, horarios y tareas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EmpleadosForm
