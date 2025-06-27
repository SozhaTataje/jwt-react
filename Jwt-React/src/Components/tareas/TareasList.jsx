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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User size={24} />
          Lista de Tareas
        </h1>
        {user?.role === 'ADMIN' && (
          <Link
            to="/tareas/asignar"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Asignar Tarea
          </Link>
        )}
      </div>

      {tareas.length === 0 ? (
        <p className="text-gray-500">No hay tareas registradas</p>
      ) : (
        <div className="grid gap-4">
          {tareas.map((tarea) => (
            <div key={tarea.id} className="bg-white shadow p-4 rounded border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{tarea.descripcion}</h2>
                  <p className="text-sm text-gray-600">Estado: <strong>{tarea.estado}</strong></p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar size={14} />
                    Fecha: {tarea.fecha}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <User size={14} />
                    Asignado a: {tarea.empleado?.nombre}
                  </p>
                </div>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={`/tareas/editar/${tarea.id}`}
                    className="text-blue-500 hover:text-blue-700"
                    title="Editar tarea"
                  >
                    <Edit size={20} />
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
