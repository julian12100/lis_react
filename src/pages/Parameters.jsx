// Importar las bibliotecas y componentes necesarios de React y otras librerías
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { useExten } from '../context/ExtContext';
import { API_URL_CATEGORIAS, API_URL_SEDES } from "../api/extapi";

// Componente funcional para los botones de acciones en la tabla 
const AccionesBotones = ({
  editandoItemId,
  itemNombre,
  handleEditarClick,
  handleCancelarEdicion,
  handleActualizarClick,
  handleEliminarClick
}) => (
  <>
    {editandoItemId === null ? (
      // Botones de edición y eliminación si no se está editando
      <>
        <button
          className="bg-blue-700 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded inline-flex items-center m-2"
          onClick={() => handleEditarClick(itemNombre)}
        >
          <RxUpdate />
        </button>
        <button
          className="bg-red-700 hover:bg-red-200 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={() => handleEliminarClick(itemNombre)}
        >
          <RiDeleteBin2Fill />
        </button>
      </>
    ) : (
      // Botones de confirmación y cancelación si se está editando

      <>
        <button
          className="bg-green-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={() => handleActualizarClick(itemNombre)}
        >
          <IoMdCheckmarkCircleOutline />
        </button>
        <button
          className="bg-gray-700 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded inline-flex items-center m-2"
          onClick={handleCancelarEdicion}
        >
          <MdOutlineCancel />
        </button>
      </>
    )}
  </>
);

// Componente funcional para la tabla
const Table = ({ data, editandoItemId, itemEditado, handleEditarClick, handleCancelarEdicion, handleActualizarClick, handleEliminarClick, nombreCampo, setData, apiUrl }) => (
  <div className="overflow-x-auto mx-auto">
    <table className="min-w-full bg-white rounded shadow-md border">
      <thead>
        <tr>
          <th className="border-b p-2">ID</th>
          <th className="border-b p-2">{nombreCampo}</th>
          <th className="border-b p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td className="border-b p-2">{item.id}</td>
            <td className="border-b p-2">
              {editandoItemId === item.id ? (
                // Campo de edición si se está editando
                <input
                  className='border-2 border-blue-700 rounded p-1'
                  type="text"
                  value={itemEditado !== undefined ? itemEditado : item.attributes[nombreCampo]}
                  onChange={(e) => handleEditarClick(item.id, e.target.value)}
                />
              ) : (
                // Mostrar el valor normal si no se está editando
                item.attributes[nombreCampo]
              )}
            </td>
            <td className="border-b p-2">
              {/* Componente de botones de acciones */}
              <AccionesBotones
                editandoItemId={editandoItemId}
                itemNombre={item.id}
                handleEditarClick={handleEditarClick}
                handleCancelarEdicion={handleCancelarEdicion}
                handleActualizarClick={() => handleActualizarClick(item.id)}
                handleEliminarClick={() => handleEliminarClick(item.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Componente principal para la gestión de parámetros
const Parameters = () => {

  // Extraer funciones y datos del contexto utilizando el hook personalizado useExten
  const {
    categorias,
    setCategorias,
    sedes,
    setSedes,
    nuevoItem,
    setNuevoItem,
    mostrarCampos,
    setMostrarCampos,
    editandoItemId,
    setEditandoItemId,
    itemEditado,
    setItemEditado,
    handleCrearClick,
    handleGuardarClick,
    handleEditarClick,
    handleCancelarEdicion,
    handleActualizarClick,
    handleEliminarClick,
  } = useExten()

  // Estado local para almacenar los datos de la tabla
  const [data, setData] = useState([]);  // Agrega esta línea
  const [mostrarCamposCategorias, setMostrarCamposCategorias] = useState(false);
  const [mostrarCamposSedes, setMostrarCamposSedes] = useState(false);
  const [nuevoItemCategoria, setNuevoItemCategoria] = useState('');
  const [nuevoItemSede, setNuevoItemSede] = useState('');
  // Función para renderizar la tabla con datos dinámicos
  const renderTable = (data, nombreCampo, setData, apiUrl, mostrarCampos, setMostrarCampos, nuevoItem, setNuevoItem) => (
    <Table
      data={data}
      editandoItemId={editandoItemId}
      itemEditado={itemEditado}
      handleEditarClick={handleEditarClick}
      handleCancelarEdicion={handleCancelarEdicion}
      handleActualizarClick={(itemId) => handleActualizarClick(apiUrl, itemId, nombreCampo, setData)}
      handleEliminarClick={(itemId) => handleEliminarClick(apiUrl, itemId, setData)}
      nombreCampo={nombreCampo}
      setData={setData}
      apiUrl={apiUrl}
      mostrarCampos={mostrarCampos}
      setMostrarCampos={setMostrarCampos}
      nuevoItem={nuevoItem}
      setNuevoItem={setNuevoItem}
    />
  );
  // JSX del componente principal
  return (
    <div className="grid grid-cols-2 gap-4 m-8">
       {/* Sección para la gestión de categorías */}
      <div className="container mx-auto mt-8 p-4 rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4 font-custom">Lista de Categorías</h1>
        <button
  className="bg-blue-700 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-3 text-xs"
  onClick={() => handleCrearClick(API_URL_CATEGORIAS, setCategorias, 'categoria', setNuevoItemCategoria, setMostrarCamposCategorias)}
>
  Crear Nueva Categoría
</button>

{mostrarCamposCategorias && (
  <div>
    <input
      className="border-2 border-blue-700 rounded p-1 m-2"
      type="text"
      placeholder="Nueva categoria"
      value={nuevoItemCategoria}
      onChange={(e) => setNuevoItemCategoria(e.target.value)}
    />
    <button
      className="bg-green-700 hover:bg-green-200 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-3 text-xs"
      onClick={() => handleGuardarClick(API_URL_CATEGORIAS, setCategorias, 'categoria', setNuevoItemCategoria, nuevoItemCategoria, setMostrarCamposCategorias)}
    >
      Guardar
    </button>
  </div>
)}
        {/* Renderizar la tabla de categorías con datos dinámicos */}
        {Array.isArray(categorias) && categorias.length > 0 ? (
          renderTable(categorias, 'categoria', setCategorias, API_URL_CATEGORIAS)
        ) : (
          <p className="text-gray-600">No se encontraron categorías</p>
        )}
      </div>
      {/* Sección para la gestión de sedes */}
      <div className="container mx-auto mt-8 p-4 rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4 font-custom">Lista de Sedes</h1>
        <button
  className="bg-blue-700 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-3 text-xs"
  onClick={() => handleCrearClick(API_URL_SEDES, setSedes, 'sede', setNuevoItemSede, setMostrarCamposSedes)}
>
  Crear Nueva Sede
</button>

{mostrarCamposSedes && (
  <div>
    <input
      className="border-2 border-blue-700 rounded p-1 m-2"
      type="text"
      placeholder="Nueva sede"
      value={nuevoItemSede}
      onChange={(e) => setNuevoItemSede(e.target.value)}
    />
    <button
      className="bg-green-700 hover:bg-green-200 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-3 text-xs"
      onClick={() => handleGuardarClick(API_URL_SEDES, setSedes, 'sede', setNuevoItemSede, nuevoItemSede, setMostrarCamposSedes)}
    >
      Guardar
    </button>
  </div>
)}
         {/* Renderizar la tabla de sedes con datos dinámicos */}
        {Array.isArray(sedes) && sedes.length > 0 ? (
          renderTable(sedes, 'sede', setSedes, API_URL_SEDES)
        ) : (
          <p className="text-gray-600">No se encontraron sedes</p>
        )}
      </div>
    </div>
  );
};

export default Parameters;
