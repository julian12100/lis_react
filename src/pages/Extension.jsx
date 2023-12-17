// Extension.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExtensionForm from '../components/ExtensionForm';
import '../index.css';
import logoImevi from '../img/logo-imevi-svg.svg';

function Extension(user) {
  const [extensions, setExtensions] = useState([]);
  const [filteredExtensions, setFilteredExtensions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uniqueSedes, setUniqueSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState('');
  const [selectedExtension, setSelectedExtension] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataQt, setDataQt] = useState(10);
  const [currentPage, setcurrentPage] = useState(1)

  // Función para verificar si el usuario tiene el rol "Mesa"
  const hasMesaRole = () => user && user.user && user.user.roles && user.user.roles.includes('mesa');

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const response = await axios.get('http://192.168.174.133:1337/api/extensions');
        setExtensions(response.data.data);

        // Obtener sedes únicas
        const uniqueSedes = [...new Set(response.data.data.map(extension => extension.attributes.sede))];
        setUniqueSedes(uniqueSedes);

        
        // Obtener opciones para el desplegable de tipo
        const uniqueTipos = [...new Set(response.data.data.map(extension => extension.attributes.tipo))];
        
      } catch (error) {
        console.error('Error fetching extensions:', error);
      }
    };

    fetchExtensions();
  }, []);
  
  // variables creadas para el control de la paginacion 
  const indexfin = currentPage * dataQt
  const indexini = indexfin - dataQt
  const nData = filteredExtensions.slice(indexini, indexfin)
  const nPages = Math.ceil(filteredExtensions.length / dataQt)
  const next = () => {
    if(currentPage !== nPages) setcurrentPage(currentPage + 1)
  }
  const prev = () => {
    if(currentPage !== 1) setcurrentPage (currentPage - 1)
  }

  // control para la eliminacion de extensiones
  const handleEliminarExtension = async (extensionId) => {
    try {
      // Realizar la solicitud DELETE
      await axios.delete(`http://192.168.174.133:1337/api/extensions/${extensionId}`);
  
      // Actualizar el estado local o recargar las extensiones después de eliminar
      const updatedExtensions = extensions.filter((extension) => extension.id !== extensionId);
      setExtensions(updatedExtensions);
    } catch (error) {
      console.error('Error al eliminar la extensión:', error);
    }
  };

  useEffect(() => {
    // Aplicar filtros y búsqueda
    const filteredData = extensions
      .filter((extension) =>
        Object.values(extension.attributes).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((extension) => !selectedSede || extension.attributes.sede === selectedSede);

    setFilteredExtensions(filteredData);
  }, [searchTerm, extensions, selectedSede]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSedeChange = (e) => {
    setSelectedSede(e.target.value);
  };

  const handleExtensionAdded = (newExtension) => {
    // If in edit mode, update the extension
    if (isEditMode) {
      setSelectedExtension(null);
      setIsEditMode(false);
    } else {
      // If not in edit mode, add the new extension
      setExtensions((prevExtensions) => [...prevExtensions, newExtension]);
    }
  };

  const handleEditExtension = (extension) => {
    setSelectedExtension(extension);
    setIsEditMode(true);
  };
  
  return (
    <div className="flex m-10">
      {/* Barra lateral */}
      <div className="w-1/4 p-4 mt-17">
        <div className="mb-4 flex items-center justify-center">
          <img src={logoImevi} alt="Logo IMEVI" width="200" height="200" className='py-4 pr-4' />
        </div>
        {hasMesaRole() && (
          <ExtensionForm
            onExtensionAdded={handleExtensionAdded}
            selectedExtension={selectedExtension}
            isEditMode={isEditMode}
          />
        )}
        
        <p className="text-justify">
          Bienvenido al directorio de extensiones telefónicas de IMEVI SAS. Aquí encontrarás la información de contacto de nuestros empleados,
          organizada de manera fácil de usar. Utiliza la barra de búsqueda y los filtros para encontrar rápidamente la información que necesitas.
          ¡Gracias por utilizar nuestra plataforma!
        </p>
      </div>

      {/* Contenido principal */}
      <div className="w-3/4 p-4">
        <div className='text-center'>
          <h1 className="text-4xl font-bold font-custom mb-4 m-4">Lista de Extensiones</h1>
          <label htmlFor="search" className="mb-2">
            Buscar:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar..."
            className="border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-2 py-1 mb-4 m-4"
          />
          {/* Cuadro de filtro para las sedes */}
          <label htmlFor="sedeFilter" className="mb-2">
            Filtrar por Sede:
          </label>
          <select
            id="sedeFilter"
            value={selectedSede}
            onChange={handleSedeChange}
            className="border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-2 py-1 mb-4 m-4"
          >
            <option value="">Todas las Sedes</option>
            {uniqueSedes.map((sede, index) => (
              <option key={index} value={sede}>
                {sede}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de extensiones */}
        <table className="min-w-full border-2 rounded shadow-xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-justify">Tipo</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Extension</th>
              <th className="py-2 px-4 border-b">Área</th>
              <th className="py-2 px-4 border-b">Sede</th>
              {hasMesaRole() && (
                <th className="py-2 px-4 border-b">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {nData.map((extension) => (
              <tr key={extension.id}>
                <td className="py-2 px-4 border-b text-center">
                {extension.attributes.tipo === 'whatsapp' ? (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                <path fill="#f2faff" d="M3.515,21.833L3.41,21.652c-1.175-2.034-1.795-4.356-1.794-6.717C1.62,7.527,7.649,1.5,15.058,1.5 c3.594,0.001,6.971,1.4,9.508,3.94c2.537,2.539,3.935,5.915,3.935,9.507c-0.004,7.409-6.033,13.437-13.441,13.437 c-2.249-0.002-4.471-0.567-6.429-1.636l-0.174-0.095l-6.745,1.769L3.515,21.833z"></path><path fill="#788b9c" d="M15.058,2L15.058,2c3.46,0.001,6.711,1.348,9.154,3.793C26.655,8.239,28,11.489,28,14.946 c-0.003,7.133-5.809,12.937-12.946,12.937c-2.16-0.001-4.299-0.545-6.184-1.574l-0.349-0.19L8.137,26.22l-5.715,1.498l1.52-5.552 l0.11-0.403l-0.209-0.362c-1.131-1.958-1.728-4.194-1.727-6.466C2.12,7.803,7.925,2,15.058,2 M15.058,1 C7.374,1,1.12,7.252,1.117,14.935c-0.001,2.456,0.64,4.854,1.861,6.967L1,29.125l7.391-1.938 c2.036,1.111,4.329,1.695,6.663,1.696h0.006c7.683,0,13.938-6.252,13.941-13.936c0-3.724-1.449-7.226-4.081-9.86 C22.287,2.452,18.787,1.001,15.058,1L15.058,1z"></path><path fill="#79ba7e" d="M15.055,25.883c-1.827-0.001-3.634-0.461-5.227-1.33l-1.046-0.57L7.63,24.285l-2.364,0.62l0.605-2.21	l0.331-1.208l-0.626-1.085c-0.955-1.654-1.459-3.544-1.459-5.465C4.119,8.906,9.027,4.001,15.057,4	c2.926,0.001,5.674,1.14,7.74,3.207C24.862,9.274,26,12.023,26,14.946C25.997,20.977,21.089,25.883,15.055,25.883z"></path><path fill="#fff" d="M21.101,17.717c-0.332-0.165-1.96-0.967-2.263-1.077c-0.304-0.111-0.525-0.165-0.745,0.165	c-0.221,0.332-0.855,1.077-1.048,1.298c-0.193,0.221-0.386,0.248-0.718,0.083c-0.332-0.165-1.399-0.516-2.664-1.644	c-0.985-0.878-1.65-1.962-1.843-2.294c-0.193-0.332-0.021-0.51,0.145-0.676c0.149-0.149,0.332-0.387,0.497-0.58	c0.165-0.193,0.221-0.332,0.332-0.552s0.055-0.415-0.028-0.58c-0.083-0.165-0.745-1.796-1.022-2.458	C11.477,8.756,11.203,8.844,11,8.834c-0.193-0.01-0.414-0.011-0.635-0.011c-0.221,0-0.58,0.083-0.883,0.415	C9.179,9.569,8.323,10.37,8.323,12s1.187,3.205,1.352,3.426c0.165,0.221,2.335,3.565,5.659,5c0.79,0.341,1.408,0.545,1.888,0.698	c0.793,0.252,1.515,0.216,2.087,0.131c0.637-0.095,1.96-0.801,2.235-1.574c0.276-0.773,0.276-1.437,0.193-1.574	C21.654,17.966,21.433,17.883,21.101,17.717z"></path>
              </svg>
              ) : <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
              <linearGradient id="0_HTEE9QzyKb~SwdZ1fZaa_ssvbWITVTVC5_gr1" x1="-52.5" x2="-52.5" y1="80.987" y2="76.259" gradientTransform="rotate(90 24 92)" gradientUnits="userSpaceOnUse"><stop offset=".3" stopColor="#9c6500"></stop><stop offset=".651" stopColor="#f2d33a"></stop></linearGradient><rect width="5" height="7" x="35" y="12" fill="url(#0_HTEE9QzyKb~SwdZ1fZaa_ssvbWITVTVC5_gr1)"></rect><linearGradient id="0_HTEE9QzyKb~SwdZ1fZab_ssvbWITVTVC5_gr2" x1="-45" x2="-45" y1="80.987" y2="76.259" gradientTransform="rotate(90 24 92)" gradientUnits="userSpaceOnUse"><stop offset=".3" stopColor="#1a7317"></stop><stop offset=".65" stopColor="#6dd669"></stop></linearGradient><rect width="5" height="8" x="35" y="19" fill="url(#0_HTEE9QzyKb~SwdZ1fZab_ssvbWITVTVC5_gr2)"></rect><linearGradient id="0_HTEE9QzyKb~SwdZ1fZac_ssvbWITVTVC5_gr3" x1="-37" x2="-37" y1="80.987" y2="76.259" gradientTransform="rotate(90 24 92)" gradientUnits="userSpaceOnUse"><stop offset=".3" stopColor="#0670ad"></stop><stop offset=".65" stopColor="#08b7e8"></stop></linearGradient><rect width="5" height="8" x="35" y="27" fill="url(#0_HTEE9QzyKb~SwdZ1fZac_ssvbWITVTVC5_gr3)"></rect><linearGradient id="0_HTEE9QzyKb~SwdZ1fZad_ssvbWITVTVC5_gr4" x1="-29" x2="-29" y1="80.987" y2="76.28" gradientTransform="rotate(90 24 92)" gradientUnits="userSpaceOnUse"><stop offset=".301" stopColor="#5829a1"></stop><stop offset=".65" stopColor="#8f4fe8"></stop></linearGradient><path fill="url(#0_HTEE9QzyKb~SwdZ1fZad_ssvbWITVTVC5_gr4)" d="M40,41v-6h-5v8h3C39.105,43,40,42.105,40,41z"></path><linearGradient id="0_HTEE9QzyKb~SwdZ1fZae_ssvbWITVTVC5_gr5" x1="-59.5" x2="-59.5" y1="80.987" y2="76.259" gradientTransform="rotate(90 24 92)" gradientUnits="userSpaceOnUse"><stop offset=".302" stopColor="#a63f62"></stop><stop offset=".65" stopColor="#e86b97"></stop></linearGradient><path fill="url(#0_HTEE9QzyKb~SwdZ1fZae_ssvbWITVTVC5_gr5)" d="M40,7c0-1.105-0.895-2-2-2h-3v7h5V7z"></path><linearGradient id="0_HTEE9QzyKb~SwdZ1fZaf_ssvbWITVTVC5_gr6" x1="13.132" x2="31.365" y1="4.584" y2="42.374" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fc7d5b"></stop><stop offset=".091" stopColor="#f87855"></stop><stop offset=".683" stopColor="#df5731"></stop><stop offset="1" stopColor="#d64b24"></stop></linearGradient><path fill="url(#0_HTEE9QzyKb~SwdZ1fZaf_ssvbWITVTVC5_gr6)" d="M37,7c0-1.105-0.895-2-2-2H10C8.895,5,8,5.895,8,7v34c0,1.105,0.895,2,2,2h25	c1.105,0,2-0.895,2-2V7z"></path><radialGradient id="0_HTEE9QzyKb~SwdZ1fZag_ssvbWITVTVC5_gr7" cx="23" cy="18" r="5" gradientUnits="userSpaceOnUse"><stop offset=".486"></stop><stop offset="1" stopOpacity="0"></stop></radialGradient><circle cx="23" cy="18" r="5" fill="url(#0_HTEE9QzyKb~SwdZ1fZag_ssvbWITVTVC5_gr7)" opacity=".15"></circle><path d="M16,31v2.114C16,34.155,16.845,35,17.886,35h10.227C29.155,35,30,34.155,30,33.114V31	c0-5-3.134-8-7-8S16,26,16,31z" opacity=".05"></path><path d="M16.5,30.626l0,2.431c0,0.797,0.646,1.443,1.443,1.443h10.114c0.797,0,1.443-0.646,1.443-1.443V30.5	c0-4.188-2.96-7.05-6.592-6.999C19.333,23.551,16.5,26.483,16.5,30.626z" opacity=".07"></path><circle cx="23" cy="18" r="4" fill="#fff"></circle><path fill="#fff" d="M29,30c0-3.375-2.787-6.099-6.185-5.997C19.532,24.101,17,26.966,17,30.252V33c0,0.552,0.448,1,1,1	h10c0.552,0,1-0.448,1-1V30z"></path>
              </svg>}
                </td>
                <td className="py-2 px-4 border-b text-center">{extension.attributes.nombre}</td>
                <td className="py-2 px-4 border-b text-center">{extension.attributes.extension}</td>
                <td className="py-2 px-4 border-b text-center">{extension.attributes.area}</td>
                <td className="py-2 px-4 border-b text-center">{extension.attributes.sede}</td>
                {hasMesaRole() && (
                  <>
                    <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleEliminarExtension(extension.id)}
                      className="bg-red-200 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
<linearGradient id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1" x1="7.534" x2="27.557" y1="7.534" y2 ="27.557" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f44f5a"></stop><stop offset=".443" stopColor="#ee3d4a"></stop><stop offset="1" stopColor="#e52030"></stop></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)" d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"></path><linearGradient id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2" x1="27.373" x2="40.507" y1="27.373" y2="40.507" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#a8142e"></stop><stop offset=".179" stopColor="#ba1632"></stop><stop offset=".243" stopColor="#c21734"></stop></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)" d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"></path>
</svg>
                    </button>
                    <button
                      onClick={() => handleEditExtension(extension)}
                      className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center m-2"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
<linearGradient id="I93pW93qJSUhtSDIz1RZKa_m8gRP2AQ4AOX_gr1" x1="-248" x2="-238" y1="-234" y2="-234" gradientTransform="rotate(180 -112 -112)" gradientUnits="userSpaceOnUse"><stop offset=".266" stopColor="#199ae0"></stop><stop offset=".582" stopColor="#1898de"></stop><stop offset=".745" stopColor="#1590d6"></stop><stop offset=".873" stopColor="#1083c9"></stop><stop offset=".982" stopColor="#0870b7"></stop><stop offset="1" stopColor="#076cb3"></stop></linearGradient><path fill="url(#I93pW93qJSUhtSDIz1RZKa_m8gRP2AQ4AOX_gr1)" d="M14,13h9c0.552,0,1-0.448,1-1V8c0-0.552-0.448-1-1-1h-9V13z"></path><linearGradient id="I93pW93qJSUhtSDIz1RZKb_m8gRP2AQ4AOX_gr2" x1="3.924" x2="17.001" y1="8.199" y2="41.867" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#32bdef"></stop><stop offset="1" stopColor="#1ea2e4"></stop></linearGradient><path fill="url(#I93pW93qJSUhtSDIz1RZKb_m8gRP2AQ4AOX_gr2)" d="M18.19,32H14V7l-4.828,4.828C8.421,12.579,8,13.596,8,14.657V32H3.81	c-0.72,0-1.08,0.87-0.571,1.379l6.701,6.701c0.586,0.586,1.536,0.586,2.121,0l6.701-6.701C19.271,32.87,18.91,32,18.19,32z"></path><linearGradient id="I93pW93qJSUhtSDIz1RZKc_m8gRP2AQ4AOX_gr3" x1="-365" x2="-355" y1="-231.472" y2="-231.472" gradientTransform="translate(389 269.472)" gradientUnits="userSpaceOnUse"><stop offset=".266" stopColor="#199ae0"></stop><stop offset=".582" stopColor="#1898de"></stop><stop offset=".745" stopColor="#1590d6"></stop><stop offset=".873" stopColor="#1083c9"></stop><stop offset=".982" stopColor="#0870b7"></stop><stop offset="1" stopColor="#076cb3"></stop></linearGradient><path fill="url(#I93pW93qJSUhtSDIz1RZKc_m8gRP2AQ4AOX_gr3)" d="M34,35h-9c-0.552,0-1,0.448-1,1v4c0,0.552,0.448,1,1,1h9V35z"></path><linearGradient id="I93pW93qJSUhtSDIz1RZKd_m8gRP2AQ4AOX_gr4" x1="32.313" x2="44" y1="7.663" y2="40.775" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#32bdef"></stop><stop offset="1" stopColor="#1ea2e4"></stop></linearGradient><path fill="url(#I93pW93qJSUhtSDIz1RZKd_m8gRP2AQ4AOX_gr4)" d="M29.81,16H34v25l4.828-4.828c0.75-0.75,1.172-1.768,1.172-2.828V16h4.19	c0.72,0,1.08-0.87,0.571-1.379L38.061,7.92c-0.586-0.586-1.536-0.586-2.121,0l-6.701,6.701C28.729,15.13,29.09,16,29.81,16z"></path>
</svg>
                    </button>
                     
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center space-x-4">
  <h3
    onClick={prev}
    className="cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 m-3"
  >
    Anterior
  </h3>
  <h3 className="text-gray-600 p-5 font-bold">
    {currentPage} / {nPages}
  </h3>
  <h3
    onClick={next}
    className="cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 m-3"
  >
    Siguiente
  </h3>
</div>
      </div>
    </div>
  );
}

export default Extension;
