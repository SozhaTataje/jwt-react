import React from "react"
import Footer from "./Footer"
import Navbar from "./navbar"


const Home = ({ usuario }) => {
  const nombre = usuario?.nombre || "invitado"
  const rol = usuario?.role || "visitante"

  return (
    <>
      <Navbar />
      <main className="p-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold">¡Bienvenido, {nombre}!</h1>
          <p className="mt-2 text-lg">
            Has ingresado como <span className="font-semibold uppercase">{rol}</span>. Disfruta de tu experiencia en el sistema.
          </p>
        </div>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Gestión de Tareas</h2>
            <p className="text-gray-600">
              Asigna, edita y organiza tareas según los empleados del sistema.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Horarios Asignados</h2>
            <p className="text-gray-600">
              Visualiza y administra los horarios de trabajo por cada colaborador.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home
