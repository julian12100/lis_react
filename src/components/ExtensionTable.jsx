import React from 'react'
import { FaPhoneVolume } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { RiWhatsappLine } from "react-icons/ri";
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import Extension from './../pages/Extension';

const ExtensionTable = ({ nData, hasMesaRole, ordenAscendente, handleOrdenarPorDispositivo, handleOrdenarPorArea, handleOrdenarPorCorreo, handleOrdenarPorNombre, handleOrdenarPorExtension, handleEliminarExtension, handleEditExtension, handleOrdenarPorSede }) => {

  const tablaextensiones = (
    <>

      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-left">Tipo</th>
          <th
            className="py-2 px-4 border-b text-left cursor-pointer"
            onClick={handleOrdenarPorNombre}
          >
            <div className="flex items-center">
              {ordenAscendente ? <AiOutlineArrowUp className="mr-1" /> : <AiOutlineArrowDown className="mr-1" />}
              Nombre
            </div>
          </th>
          <th
            className="py-2 px-4 border-b text-left cursor-pointer"
            onClick={handleOrdenarPorExtension}
          >
            <div className="flex items-center">
              {ordenAscendente ? <AiOutlineArrowUp className="mr-1" /> : <AiOutlineArrowDown className="mr-1" />}
              Extension
            </div>
          </th>
          <th
            className="py-2 px-4 border-b text-left cursor-pointer"
            onClick={handleOrdenarPorDispositivo}
          >
            <div className="flex items-center">
              {ordenAscendente ? <AiOutlineArrowUp className="mr-1" /> : <AiOutlineArrowDown className="mr-1" />}
              Dispositivo
            </div>
          </th>
          <th
        className="py-2 px-4 border-b text-left cursor-pointer"
        onClick={handleOrdenarPorCorreo}
      >
        <div className="flex items-center">
          {ordenAscendente ? <AiOutlineArrowUp className="mr-1" /> : <AiOutlineArrowDown className="mr-1" />}
          Correo
        </div>
      </th>
      <th
        className="py-2 px-4 border-b text-left cursor-pointer"
        onClick={handleOrdenarPorArea}
      >
        <div className="flex items-center">
          {ordenAscendente ? <AiOutlineArrowUp className="mr-1" /> : <AiOutlineArrowDown className="mr-1" />}
          Area
        </div>
      </th>
          <th
            className="py-2 px-4 border-b text-left cursor-pointer"
            onClick={handleOrdenarPorSede}
          >
            <div className="flex items-center">
              {ordenAscendente ? <AiOutlineArrowUp className="mr-1" /> : <AiOutlineArrowDown className="mr-1" />}
              Sede
            </div>
          </th>
          {hasMesaRole() && (
            <th className="py-2 px-4 border-b">Acciones</th>
          )}
        </tr>
      </thead>
      <tbody>
        {nData.map((extension) => (
          <tr key={extension.id}>
            <td className="py-2 px-4 border-b text-left">
              {extension.attributes.tipo === 'whatsapp' ? (
                <a href={`https://api.whatsapp.com/send?phone=57${extension.attributes.extension}`} target="_blank" rel="noopener noreferrer">
                  <RiWhatsappLine className="text-3xl" />
                </a>
              ) : <FaPhoneVolume className="text-2xl" />
              }
            </td>
            <td className="py-2 px-4 border-b text-left ">{extension.attributes.nombre}</td>
            <td className="py-2 px-4 border-b text-left font-bold">{extension.attributes.extension}</td>
            <td className="py-2 px-4 border-b text-left">{extension.attributes.dispositivo}</td>
            <td className="py-2 px-4 border-b text-left">{extension.attributes.correo}</td>
            <td className="py-2 px-4 border-b text-left">{extension.attributes.area}</td>
            <td className="py-2 px-4 border-b text-left">{extension.attributes.sede}</td>
            {hasMesaRole() && (
              <>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleEliminarExtension(extension.id)}
                    className="bg-red-700 hover:bg-red-200 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <RiDeleteBin2Fill />

                  </button>
                  <button
                    onClick={() => handleEditExtension(extension)}
                    className="bg-blue-700 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded inline-flex items-center m-2"
                  >
                    <RxUpdate />

                  </button>

                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </>
  )

  return (
    <>
      {!hasMesaRole() ? (
        <div className="flex justify-center">
          <table className="w-4/5  border-2 rounded shadow-xl">
            {tablaextensiones}
          </table>
        </div>


      ) : (
        <table className="min-w-full border-2 rounded shadow-xl">
          {tablaextensiones}
        </table>
      )}
    </>

  );
};

export default ExtensionTable