import axios from "axios";

export const listarextensiones = async () =>
    await axios.get('http://192.168.18.233:1337/api/extensions');

export const crearextension = async (newExtension) =>
    await axios.post('http://192.168.18.233:1337/api/extensions', {
        data: {
          nombre: newExtension.nombre,
          extension: newExtension.extension,
          area: newExtension.area,
          sede: newExtension.sede,
          tipo: newExtension.tipo,
        },
      });

export const eliminarextension = async (id) =>
    await axios.delete(`http://192.168.18.233:1337/api/extensions/${id}`);

export const actualizarextension = async (updatedExtension, id) =>
    await axios.put(`http://192.168.18.233:1337/api/extensions/${id}`, {
      data: {
        nombre: updatedExtension.nombre,
        extension: updatedExtension.extension,
        area: updatedExtension.area,
        sede: updatedExtension.sede,
        tipo: updatedExtension.tipo,
      },
    });