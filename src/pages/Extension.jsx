// Extension.js
import React, { useState, useEffect } from 'react';
import ExtensionForm from '../components/ExtensionForm';
import '../index.css';
import axios from 'axios';
import { useExten } from '../context/ExtContext';
import ExtensionTable from '../components/ExtensionTable';
import Pdf from '../components/Pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Toaster, toast } from 'sonner';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';


function Extension(user) {

  const { extensions, fetchExtensions, ordenAscendente, categorias, sedes, setOrdenAscendente, uniqueSedes, handleOrdenarPorDispositivo, handleOrdenarPorSede, handleOrdenarPorExtension, handleOrdenarPorArea, handleOrdenarPorCorreo, handleOrdenarPorNombre, handleEliminarExtension, handleEditExtension, obtenerbanners, bannerText, handleInputBanner, setFilteredExtensions, filteredExtensions, isEditMode } = useExten()

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSede, setSelectedSede] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [dataQt, setDataQt] = useState(25);
  const [currentPage, setcurrentPage] = useState(1)
  const [response, setResponse] = useState(null);



  // Función para verificar si el usuario tiene el rol "Mesa"
  const hasMesaRole = () => user && user.user && user.user.roles && user.user.roles.includes('mesa');

  useEffect(() => {

    obtenerbanners();
    fetchExtensions();
  }, []);

  // variables creadas para el control de la paginacion 
  const indexfin = currentPage * dataQt
  const indexini = indexfin - dataQt
  const nData = filteredExtensions.slice(indexini, indexfin)
  const nPages = Math.ceil(filteredExtensions.length / dataQt)
  const next = () => {
    if (currentPage !== nPages) setcurrentPage(currentPage + 1)
  }
  const prev = () => {
    if (currentPage !== 1) setcurrentPage(currentPage - 1)
  }
  // control para la eliminacion de extensiones

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
      .filter((extension) =>
        (!selectedSede || extension.attributes.sede === selectedSede) &&
        (!selectedArea || extension.attributes.area === selectedArea)
      ).sort((a, b) => {
        // Ordenar por orden alfabético de la columna "sede"
        const sedeA = a.attributes.sede.toLowerCase();
        const sedeB = b.attributes.sede.toLowerCase();
        if (sedeA < sedeB) {
          return -1;
        }
        if (sedeA > sedeB) {
          return 1;
        }
        return 0;
      });

    setFilteredExtensions(filteredData);
  }, [searchTerm, extensions, selectedSede, selectedArea]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setcurrentPage(1);
  };

  const handleSedeChange = (e) => {
    setSelectedSede(e.target.value);
    setcurrentPage(1);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    setcurrentPage(1);
  };

  const handlePutRequest = () => {
    // Realiza la solicitud PUT con el nuevo texto del banner
    axios.put('http://172.16.2.15:1339/api/banner', {
      data: {
        banner: bannerText
      }
    })
      .then(response => {
        setResponse(response.data);
        toast.success('Banner actualizado exitosamente');
      })
      .catch(error => {
        console.error('Error al realizar la solicitud PUT:', error);
      });
  };

  const changepage = (e) => { setDataQt(e.target.value) };

  const content = (
    <>
      <Toaster
        position='top-right'
        toastOptions={{

          style: {
            background: '#BBFF9A',
            fontSize: '15px',
          },
          className: 'className',
        }}
      />
      <div className='text-center m-2'>

        <h1 className="text-4xl font-bold font-custom mb-2 m-2">Lista de Extensiones</h1>
        {!hasMesaRole() ? (
          <div className="w-full p-4">
            <p className="text-justify p-4">
              {bannerText}
            </p>
          </div>
        ) : (

          <div className='p-5'>
            <textarea
              className='w-full border-2 m-4 p-3'
              value={bannerText}
              onChange={handleInputBanner}
              rows={4} // Puedes ajustar el número de filas según tus necesidades
              cols={40} // Puedes ajustar el número de columnas según tus necesidades
            />
            <br />
            <button className='bg-imeviColor hover:bg-blue-800 text-white py-1 px-2 rounded' onClick={handlePutRequest}>Actualizar banner</button>

          </div>

        )}

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
          {sedes.map((sedes, index) => (
            <option key={index} value={sedes.attributes.sede}>
              {sedes.attributes.sede}
            </option>
          ))}
        </select>
        {/* Cuadro de filtro para las áreas */}
        <label htmlFor="areaFilter" className="mb-2">
          Filtrar por Área:
        </label>
        <select
          id="areaFilter"
          value={selectedArea}
          onChange={handleAreaChange}
          className="border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-2 py-1 mb-4 m-4"
        >
          <option value="">Todas las Áreas</option>
          {categorias.map((categoria, index) => (
            <option key={index} value={categoria.attributes.categoria}>
              {categoria.attributes.categoria}
            </option>
          ))}
        </select>

        <PDFDownloadLink document={<Pdf filtrosede={filteredExtensions} />} fileName="extensiones_imevi.pdf">
          {({ loading, url, error, blob }) => (
            loading ? (
              <button className="bg-imeviColor hover:bg-blue-800 text-white font-bold py-1 px-2 rounded">
                Generando...
              </button>
            ) : (
              <button className="bg-imeviColor hover:bg-blue-800 text-white font-bold py-1 px-2 rounded">
                🖨️ Imprimir!
              </button>
            )
          )}
        </PDFDownloadLink>


      </div>

      {/* Lista de extensiones */}
      <ExtensionTable
        nData={nData}
        handleOrdenarPorSede={handleOrdenarPorSede}
        handleOrdenarPorNombre={handleOrdenarPorNombre}
        handleOrdenarPorExtension={handleOrdenarPorExtension}
        handleOrdenarPorArea={handleOrdenarPorArea}
        handleOrdenarPorCorreo={handleOrdenarPorCorreo}
        hasMesaRole={hasMesaRole}
        ordenAscendente={ordenAscendente}
        handleEliminarExtension={handleEliminarExtension}
        handleEditExtension={handleEditExtension}
        handleOrdenarPorDispositivo={handleOrdenarPorDispositivo}
        isEditMode={isEditMode}
      />
      <div className="flex items-center justify-center space-x-4">
        <h3
          onClick={prev}
          className="cursor-pointer bg-imeviColor text-white px-2 py-1 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600 m-3"
        >
          Anterior
        </h3>
        <h3 className="text-gray-600 p-5 font-bold">
          {currentPage} / {nPages}

        </h3>
        <h3
          onClick={next}
          className="cursor-pointer bg-imeviColor text-white px-2 py-1 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-600 m-3"
        >
          Siguiente
        </h3>
        <select onChange={(e) => changepage(e)} name="post" id="post"
          className="border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-2 py-1 mb-4 m-4">
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
        </select>
      </div>
    </>
  );
  return (
    <div className="flex m-10">
      {/* Barra lateral */}
      {hasMesaRole() && (
        <div className="w-1/4 p-4 mt-17">
          <ExtensionForm />
        </div>
      )}
      <div className="mb-4 flex items-center justify-center mt-5">
        {/*<img src={footerlogo} alt="Logo IMEVI" width="200" height="200" className='py-4 pr-4' />*/}
      </div>


      {/* Contenido principal */}
      {!hasMesaRole() ? (
        <div className="w-full p-4">
          {content}
        </div>
      ) : (
        <div className="w-3/4 p-4">
          {content}
        </div>
      )}

    </div>
  );
}

export default Extension;
