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
export const crearextension = async (newExtension, config) => 

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
  }, config);

// Función para eliminar una extensión mediante una solicitud DELETE
export const eliminarextension = async (id) => {
  try {
    // Obtener el token JWT del almacenamiento local
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.jwt) {
      throw new Error('Token JWT no encontrado en el localStorage');
    }
    const token = storedUser.jwt;

    // Configurar los encabezados para incluir el token JWT
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Realizar la solicitud DELETE con Axios para eliminar la extensión
    await axios.delete(`http://172.16.2.15:1339/api/extensions/${id}`, config);
  } catch (error) {
    console.error('Error al eliminar la extensión:', error);
    throw error; // Propaga el error para que pueda ser manejado en el código que llama a esta función
  }
};

// Función para actualizar una extensión mediante una solicitud PUT
export const actualizarextension = async (updatedExtension, id) => {
  try {
    // Obtener el token JWT del almacenamiento local
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.jwt) {
      throw new Error('Token JWT no encontrado en el localStorage');
    }
    const token = storedUser.jwt;

    // Configurar los encabezados para incluir el token JWT
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Realizar la solicitud PUT con Axios para actualizar la extensión
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
    }, config);
  } catch (error) {
    console.error('Error al actualizar la extensión:', error);
    throw error; // Propaga el error para que pueda ser manejado en el código que llama a esta función
  }
};

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

