// Importar la biblioteca 'axios' para realizar solicitudes HTTP
import axios from "axios";

// Definir las URL base para las categorías y sedes
export const API_URL_CATEGORIAS = 'http://172.16.2.15:1339/api/categorias';
export const API_URL_SEDES = 'http://172.16.2.15:1339/api/sedes';

// Función para obtener la lista de extensiones desde la API
export const listarextensiones = async () =>
  await axios.get('http://172.16.2.15:1339/api/extensions');

// Función para obtener el banner desde la API
export const obtenerBanner = async () => {
  try {
    const response = await axios.get('http://172.16.2.15:1339/api/banner');
    // Devolver el banner extraído de la respuesta
    return response.data.data.attributes.banner;
  } catch (error) {
    // Manejar errores al obtener la información inicial
    console.error('Error al obtener la información inicial:', error);
    throw error;
  }
};

// Función para crear una nueva extensión mediante una solicitud POST
export const crearextension = async (newExtension) =>
  await axios.post('http://172.16.2.15:1339/api/extensions', {
    data: {
      nombre: newExtension.nombre,
      extension: newExtension.extension,
      correo: newExtension.correo,
      area: newExtension.area,
      dispositivo: newExtension.dispositivo,
      sede: newExtension.sede,
      tipo: newExtension.tipo,
    },
  });

// Función para eliminar una extensión mediante una solicitud DELETE
export const eliminarextension = async (id) =>
  await axios.delete(`http://172.16.2.15:1339/api/extensions/${id}`);

// Función para actualizar una extensión mediante una solicitud PUT
export const actualizarextension = async (updatedExtension, id) =>
  await axios.put(`http://172.16.2.15:1339/api/extensions/${id}`, {
    data: {
      nombre: updatedExtension.nombre,
      extension: updatedExtension.extension,
      correo: updatedExtension.correo,
      area: updatedExtension.area,
      dispositivo: updatedExtension.dispositivo,
      sede: updatedExtension.sede,
      tipo: updatedExtension.tipo,
    },
  });

// Función para obtener y cargar datos de categorías desde la API
export const fetchDataCategorias = async (setData) => {
  try {
    const response = await axios.get(API_URL_CATEGORIAS);
    setData(response.data.data);
  } catch (error) {
    console.error(`Error al obtener datos de la API (${API_URL_CATEGORIAS}):`, error);
  }
};

// Función para obtener y cargar datos de sedes desde la API
export const fetchDataSedes = async (setData) => {
  try {
    const response = await axios.get(API_URL_SEDES);
    // Actualizar el estado local con los datos de sedes
    setData(response.data.data);
  } catch (error) {
    // Manejar errores al obtener datos de la API de sedes
    console.error(`Error al obtener datos de la API (${API_URL_SEDES}):`, error);
  }
};

