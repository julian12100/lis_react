// src/components/Login.js
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

const Login = ({ onLogin }) => {
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'http://192.168.174.133:1337/api/auth/local/',
        {
          identifier: data.username,
          password: data.password,
        }
      );

      // Llamada a la función onLogin con los datos del usuario
      onLogin(response.data);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      // Establecer el mensaje de error en el estado
      setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen-xl mx-auto mt-2 p-2 rounded-md flex flex-col md:flex-row items-center justify-between"
    >
      {/* Logo */}
      <div className="mb-2 md:mb-0 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-700">Lis.. 🖤</h1>
        <div className="text-sm text-gray-500">Software para la gestión de TI</div>
      </div>

      {/* Formulario de inicio de sesión */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-xl md:ml-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 m-2" htmlFor="username">
          Usuario:
        </label>
        <input
          id="username"
          {...register('username')}
          type="text"
          className="w-full h-10 border p-2 rounded-md mb-2 md:mb-0 md:mr-2 text-sm"
        />

        <label className="block text-gray-700 text-sm font-bold mb-2 m-2" htmlFor="password">
          Contraseña:
        </label>
        <input
          id="password"
          {...register('password')}
          type="password"
          className="w-full h-10 border p-2 rounded-md mb-2 md:mb-0 md:mr-2 text-sm"
        />

        <button type="submit" className="bg-slate-900 text-white py-2 px-8 rounded-md md:ml-2 text-sm">
          Iniciar
        </button>
      </div>

      {/* Mostrar mensaje de error si existe */}
      {errorMessage && <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  <strong class="font-bold">Error al iniciar sesión.</strong>
  <span class="block sm:inline"> Verifica tus credenciales.</span>
  <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
  </span>
</div>}
    </form>

  );
};

export default Login;
