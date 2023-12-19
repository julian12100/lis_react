import React from 'react'
import Login from './Login'
import logoImevi from '../img/logo-imevi-svg.svg';

function Athentic({ user, onLogin, onLogout }) {

  return (
    <>
    {user ? (
      <>
      <div className="max-w-screen-xl mx-auto mt-2 p-2 rounded-md flex flex-col md:flex-row items-center justify-between">
  {/* Logo */}
  <div className="mb-2 md:mb-0 flex flex-col items-center">
  <img src={logoImevi} alt="Logo IMEVI" width="200" height="200" className='py-4 pr-4' />
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
      className="bg-imeviColor hover:bg-blue-800 text-white py-2 px-8 m-5 rounded-md text-sm"
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