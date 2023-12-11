import React from 'react'
import Login from './Login'

function Athentic({ user, onLogin, onLogout }) {

  return (
    <>
    {user ? (
      <>
      <div className="max-w-screen-xl mx-auto mt-2 p-2 rounded-md flex flex-col md:flex-row items-center justify-between">
  {/* Logo */}
  <div className="mb-2 md:mb-0 flex flex-col items-center">
    <h1 className="text-2xl font-bold text-gray-700">Lis.. 🖤</h1>
    <div className="text-sm text-gray-500">Software para la gestión de TI</div>
  </div>

  {/* Formulario de inicio de sesión */}
  <div className="flex flex-col md:flex-row items-center w-full max-w-xl md:ml-4">
    {/* Otros elementos del formulario aquí */}

    {/* Botón de Cerrar sesión */}
    <div className="mb-2 md:mb-0 flex flex-col items-center justify-end pl-10">
  <div className="flex items-center text-sm text-gray-500">
  <div className="mb-2 md:mb-0 flex flex-col  pl-10">
    <div className="text-sm text-gray-500">Bienvenid@:</div>
    <b>🎅 {user.nombre}</b>
  </div>
    
    
    <button
      type="submit"
      className="bg-slate-900 text-white py-2 px-8 m-5 rounded-md text-sm"
      onClick={onLogout}
    >
      Cerrar sesión
    </button>
  </div>
</div>

    </div>
</div>
      </>

        
      ) : (
        <Login onLogin={onLogin} />
      )}
    </>
  )
}

export default Athentic