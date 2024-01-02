import React from 'react'
import { FaPhoneVolume } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { RiWhatsappLine } from "react-icons/ri";


const ExtensionTable = ({ nData, hasMesaRole, handleEliminarExtension, handleEditExtension }) => {
  return (
    <table className="min-w-full border-2 rounded shadow-xl">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b text-left">Tipo</th>
          <th className="py-2 px-4 border-b text-left">Nombre</th>
          <th className="py-2 px-4 border-b text-left">Extension</th>
          <th className="py-2 px-4 border-b text-left">Área</th>
          <th className="py-2 px-4 border-b text-left">Sede</th>
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
                <RiWhatsappLine />
              </a>
              ) : <FaPhoneVolume />
            }
            </td>
            <td className="py-2 px-4 border-b text-left ">{extension.attributes.nombre}</td>
            <td className="py-2 px-4 border-b text-left">{extension.attributes.extension}</td>
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
    </table>
  );
};

export default ExtensionTable