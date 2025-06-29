import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Edit, Plus, User } from 'lucide-react'
import api from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'

function TareasList() {
  const [tareas, setTareas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchTareas()
  }, [])

  const fetchTareas = async () => {
    try {
      const res = await api.get('/tareas')
      setTareas(res.data)
    } catch (err) {
      console.error(err)
      setError('Error al cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-gray-600">Cargando tareas...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="p-6">
      <div className="flex justify-center items-center mb-6 gap-8" style={{minHeight:'56px'}}>
        <h1 className="text-2xl font-bold flex items-center gap-2 m-0">
          <User size={24} />
          Lista de Tareas
        </h1>
        {user?.role === 'ADMIN' && (
          <Link
            to="/tareas/asignar"
            className="btn-asignar-tarea"
          >
            <Plus size={16} />
            Asignar Tarea
          </Link>
        )}
      </div>

      {tareas.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <p className="text-gray-500 text-center mt-8">No hay tareas registradas</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tareas.map((tarea) => (
            <div key={tarea.id} className="tarea-card">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="tarea-title">{tarea.descripcion}</h2>
                  <div className="tarea-info">
                    <span className={`tarea-estado ${tarea.estado === 'Pendiente' ? 'pendiente' : 'completada'}`}>{tarea.estado}</span>
                    <span className="tarea-fecha"><Calendar size={14} /> {tarea.fecha}</span>
                    <span className="tarea-asignado"><User size={14} /> {tarea.empleado}</span>
                  </div>
                </div>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={`/tareas/editar/${tarea.id}`}
                    className="tarea-editar"
                    title="Editar tarea"
                  >
                    <Edit size={20} />
                    <span className="tarea-editar-text">Editar</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TareasList
