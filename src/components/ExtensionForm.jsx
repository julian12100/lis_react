// ExtensionForm.js
import React, { useEffect } from 'react';
import { useExten } from '../context/ExtContext';
import { IoIosCreate } from "react-icons/io";

function ExtensionForm({ selectedExtension }) {

  const {newExtension, fetchOptions, sedeOptions, sedes, categorias, tipoOptions, modedition, isEditMode, handleInputChange, handleFormSubmit} = useExten()

  

  useEffect(() => {

    fetchOptions();
  }, []);

  useEffect(() => {
    // Si estamos en modo de edición, actualizamos el estado con la extensión seleccionada
    modedition();
  }, [isEditMode, selectedExtension]);

  return (
    <form onSubmit={handleFormSubmit} className="mb-6 max-w-md mx-auto border-2 p-6 rounded-md shadow-xl">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar Extensión' : 'Agregar Nueva Extensión'}</h2>
  
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-gray-600 text-sm font-medium mb-1">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={newExtension.nombre}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="extension" className="block text-gray-600 text-sm font-medium mb-1">
          Extensión:
        </label>
        <input
          type="text"
          id="extension"
          name="extension"
          value={newExtension.extension}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="correo" className="block text-gray-600 text-sm font-medium mb-1">
          Correo:
        </label>
        <input
          type="text"
          id="correo"
          name="correo"
          value={newExtension.correo}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="area" className="block text-gray-600 text-sm font-medium mb-1">
          Dispositivo:
        </label>
        <select
          id="dispositivo"
          name="dispositivo"
          value={newExtension.dispositivo}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Seleccionar Dispositivo</option>
          <option value="Líneas corporativas">Virtual</option>
          <option value="Servicios en salud">Fisico</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="area" className="block text-gray-600 text-sm font-medium mb-1">
          Area:
        </label>
        <select
          id="area"
          name="area"
          value={newExtension.area}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Todas las Áreas</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria.attributes.categoria}>
              {categoria.attributes.categoria}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="sede" className="block text-gray-600 text-sm font-medium mb-1">
          Sede:
        </label>
        <select
          id="sede"
          name="sede"
          value={newExtension.sede}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="">Todas las Sedes</option>
          {sedes.map((sedes, index) => (
            <option key={index} value={sedes.attributes.sede}>
              {sedes.attributes.sede}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="tipo" className="block text-gray-600 text-sm font-medium mb-1">
          Tipo:
        </label>
        <select
          id="tipo"
          name="tipo"
          value={newExtension.tipo}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          {tipoOptions.map((tipo, index) => (
            <option key={index} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-imeviColor text-white p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600"
      >
        {isEditMode ? 'Guardar Cambios' : 'Agregar Extensión'}
      </button>
    </form>
  );
}

export default ExtensionForm;
