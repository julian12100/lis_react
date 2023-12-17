// ExtensionForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExtensionForm({ onExtensionAdded, isEditMode, selectedExtension }) {
  const [newExtension, setNewExtension] = useState({
    nombre: '',
    extension: '',
    area: '',
    sede: '',
    tipo: 'whatsapp', // Valor por defecto
  });
  const [sedeOptions, setSedeOptions] = useState([]);
  const [tipoOptions, setTipoOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://192.168.174.133:1337/api/extensions');
        const uniqueSedes = [...new Set(response.data.data.map(extension => extension.attributes.sede))];
        const uniqueTipos = [...new Set(response.data.data.map(extension => extension.attributes.tipo))];
        setSedeOptions(uniqueSedes);
        setTipoOptions(uniqueTipos);
      } catch (error) {
        console.error('Error fetching extension options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Si estamos en modo de edición, actualizamos el estado con la extensión seleccionada
    if (isEditMode && selectedExtension) {
      setNewExtension({
        nombre: selectedExtension.attributes.nombre || '',
        extension: selectedExtension.attributes.extension || '',
        area: selectedExtension.attributes.area || '',
        sede: selectedExtension.attributes.sede || '',
        tipo: selectedExtension.attributes.tipo || 'whatsapp',
      });
    }
  }, [isEditMode, selectedExtension]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExtension((prevExtension) => ({
      ...prevExtension,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validar que los campos requeridos no estén vacíos
    if (!newExtension.nombre || !newExtension.extension || !newExtension.area || !newExtension.sede) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    try {
      // Determinar si estamos en modo de edición o adición
      if (isEditMode) {
        // Realizar la petición PUT para actualizar la extensión existente
        await axios.put(`http://192.168.174.133:1337/api/extensions/${selectedExtension.id}`, {
          data: {
            nombre: newExtension.nombre,
            extension: newExtension.extension,
            area: newExtension.area,
            sede: newExtension.sede,
            tipo: newExtension.tipo,
          },
        });
      } else {
        // Realizar la petición POST con Axios para agregar la nueva extensión
        const response = await axios.post('http://192.168.174.133:1337/api/extensions', {
          data: {
            nombre: newExtension.nombre,
            extension: newExtension.extension,
            area: newExtension.area,
            sede: newExtension.sede,
            tipo: newExtension.tipo,
          },
        });

        // Llamar a la función proporcionada por el padre para notificar la adición de la nueva extensión
        onExtensionAdded(response.data.data);
      }

      // Limpiar el formulario después de la creación o actualización exitosa
      setNewExtension({
        nombre: '',
        extension: '',
        area: '',
        sede: '',
        tipo: 'whatsapp',
      });
    } catch (error) {
      console.error(isEditMode ? 'Error al actualizar la extensión:' : 'Error al agregar la extensión:', error);
    }
  };

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
        <label htmlFor="area" className="block text-gray-600 text-sm font-medium mb-1">
          Área:
        </label>
        <input
          type="text"
          id="area"
          name="area"
          value={newExtension.area}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
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
          <option value="">Seleccionar Sede</option>
          {sedeOptions.map((sede, index) => (
            <option key={index} value={sede}>
              {sede}
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
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        {isEditMode ? 'Guardar Cambios' : 'Agregar Extensión'}
      </button>
    </form>
  );
}

export default ExtensionForm;
