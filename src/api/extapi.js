import axios from "axios";

export const listarextensiones = async () =>
  await axios.get('http://172.16.2.15:1339/api/extensions');

export const obtenerBanner = async () => {
  try {
    const response = await axios.get('http://172.16.2.15:1339/api/banner');
    return response.data.data.attributes.banner;
  } catch (error) {
    console.error('Error al obtener la información inicial:', error);
    throw error; // Puedes manejar el error aquí o dejar que el componente lo maneje
  }
};

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

export const eliminarextension = async (id) =>
  await axios.delete(`http://172.16.2.15:1339/api/extensions/${id}`);

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
