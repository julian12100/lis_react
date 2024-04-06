// Importar los módulos y funciones necesarios de React y otras bibliotecas
import { createContext, useContext, useState, useEffect } from "react";
import { listarextensiones, eliminarextension, crearextension, actualizarextension, obtenerBanner, fetchDataCategorias, fetchDataSedes, API_URL_CATEGORIAS, API_URL_SEDES } from "../api/extapi";
// Crear y exportar un contexto para compartir el estado entre componentes
export const ExtContext = createContext();
import { toast } from 'sonner';
import { AiFillCloseCircle } from "react-icons/ai";
import axios from "axios";

// Función personalizada para utilizar el contexto
export const useExten = () => {
  const context = useContext(ExtContext)
  if (!context) {
    throw new Error("el useExten no se encuentra dentro del ExtContextProvider")
  }
  return context;
}

// Proveedor del contexto que envuelve a los componentes hijos
export const ExtContextProvider = ({ children }) => {

  // Estados necesarios para la gestión de la aplicación
  const [extensions, setExtensions] = useState([]);
  const [uniqueSedes, setUniqueSedes] = useState([]);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredExtensions, setFilteredExtensions] = useState([]);
  const [bannerText, setBannerText] = useState('');
  const [selectedExtension, setSelectedExtension] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const [categorias, setCategorias] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [nuevoItem, setNuevoItem] = useState('');
  const [mostrarCampos, setMostrarCampos] = useState(false);
  const [editandoItemId, setEditandoItemId] = useState(null);
  const [itemEditado, setItemEditado] = useState('');

  const [newExtension, setNewExtension] = useState({
    nombre: '',
    extension: '',
    correo: '',
    area: '',
    dispositivo: '',
    sede: '',
    tipo: 'local', // Valor por defecto
  });

  // Función para obtener y cargar las extensiones desde la API
  const fetchExtensions = async () => {
    try {
      const response = await listarextensiones();
      setExtensions(response.data.data);

      // Obtener sedes únicas
      const uniqueSedes = [...new Set(response.data.data.map(extension => extension.attributes.sede))];
      setUniqueSedes(uniqueSedes);

    } catch (error) {
      console.error('Error fetching extensions:', error);
    }
  };

  // Funciones para manejar la ordenación de las extensiones por diferentes criterios
  const handleOrdenarPorSede = () => {
    const sortedData = [...filteredExtensions].sort((b, a) =>
      ordenAscendente
        ? a.attributes.sede.toLowerCase().localeCompare(b.attributes.sede.toLowerCase())
        : b.attributes.sede.toLowerCase().localeCompare(a.attributes.sede.toLowerCase())
    );
    setFilteredExtensions(sortedData);
    setOrdenAscendente(!ordenAscendente); // Cambiar el estado para alternar el orden
  };

  const handleOrdenarPorDispositivo = () => {
    const sortedData = [...filteredExtensions].sort((a, b) => {
      const dispositivoA = a.attributes.dispositivo ? a.attributes.dispositivo.toLowerCase() : null;
      const dispositivoB = b.attributes.dispositivo ? b.attributes.dispositivo.toLowerCase() : null;

      if (dispositivoA === null && dispositivoB === null) {
        return 0; // Ambos son nulos, considerarlos iguales
      }

      if (dispositivoA === null) {
        return ordenAscendente ? 1 : -1; // Mover los nulos al final si es ascendente, al principio si es descendente
      }

      if (dispositivoB === null) {
        return ordenAscendente ? -1 : 1; // Mover los nulos al principio si es ascendente, al final si es descendente
      }

      return ordenAscendente
        ? dispositivoA.localeCompare(dispositivoB)
        : dispositivoB.localeCompare(dispositivoA);
    });

    setFilteredExtensions(sortedData);
    setOrdenAscendente(!ordenAscendente);
  };

  const handleOrdenarPorNombre = () => {
    const sortedData = [...filteredExtensions].sort((a, b) =>
      ordenAscendente
        ? a.attributes.nombre.toLowerCase().localeCompare(b.attributes.nombre.toLowerCase())
        : b.attributes.nombre.toLowerCase().localeCompare(a.attributes.nombre.toLowerCase())
    );
    setFilteredExtensions(sortedData);
    setOrdenAscendente(!ordenAscendente); // Cambiar el estado para alternar el orden
  };

  const handleOrdenarPorExtension = () => {
    const sortedData = [...filteredExtensions].sort((a, b) => {
      const extensionA = parseFloat(a.attributes.extension);
      const extensionB = parseFloat(b.attributes.extension);

      // Si los valores no son numéricos, no se pueden comparar, así que devolver 0.
      if (isNaN(extensionA) || isNaN(extensionB)) {
        return 0;
      }

      return ordenAscendente
        ? extensionA - extensionB
        : extensionB - extensionA;
    });

    setFilteredExtensions(sortedData);
    setOrdenAscendente(!ordenAscendente);
  };

  const handleOrdenarPorArea = () => {
    const sortedData = [...filteredExtensions].sort((a, b) =>
      ordenAscendente
        ? a.attributes.area.toLowerCase().localeCompare(b.attributes.area.toLowerCase())
        : b.attributes.area.toLowerCase().localeCompare(a.attributes.area.toLowerCase())
    );
    setFilteredExtensions(sortedData);
    setOrdenAscendente(!ordenAscendente); // Cambiar el estado para alternar el orden
  };

  const handleOrdenarPorCorreo = () => {
    const sortedData = [...filteredExtensions].sort((a, b) => {
      const correoA = a.attributes.correo ? a.attributes.correo.toLowerCase() : null;
      const correoB = b.attributes.correo ? b.attributes.correo.toLowerCase() : null;

      if (correoA === null && correoB === null) {
        return 0; // Ambos son nulos, considerarlos iguales
      }

      if (correoA === null) {
        return ordenAscendente ? 1 : -1; // Mover los nulos al final si es ascendente, al principio si es descendente
      }

      if (correoB === null) {
        return ordenAscendente ? -1 : 1; // Mover los nulos al principio si es ascendente, al final si es descendente
      }

      return ordenAscendente
        ? correoA.localeCompare(correoB)
        : correoB.localeCompare(correoA);
    });

    setFilteredExtensions(sortedData);
    setOrdenAscendente(!ordenAscendente);
  };

  // Función para obtener los banners desde la API
  const obtenerbanners = async () => {
    try {
      const banner = await obtenerBanner();

      setBannerText(banner);
    } catch (error) {
      // Manejar el error aquí si es necesario
    }
  };

  // Función para manejar la eliminación de una extensión
  const handleEliminarExtension = async (extensionId) => {
    try {
      // Realizar la solicitud DELETE
      const response = await eliminarextension(extensionId);
      console.log(response)
      // Actualizar el estado local o recargar las extensiones después de eliminar
      const updatedExtensions = extensions.filter((extension) => extension.id !== extensionId);
      setExtensions(updatedExtensions);
      toast.success('Extension eliminada correctamente', {
        icon: <AiFillCloseCircle className="text-2xl" />,
        style: {
          background: '#FF6347',
        },
        className: 'class',
      });

    } catch (error) {
      console.error('Error al eliminar la extensión:', error);
    }
  };

  // Función para crear una nueva extensión
  const crearExtension = async () => {
    try {
      const response = await crearextension(newExtension)
    } catch (error) {

    }
  };

  // Función para obtener opciones de las extensiones
  const fetchOptions = async () => {
    try {
      const response = await listarextensiones()
      const uniqueTipos = [...new Set(response.data.data.map(extension => extension.attributes.tipo))];
      setTipoOptions(uniqueTipos);
    } catch (error) {
      console.error('Error fetching extension options:', error);
    }
  };

  // Función para cargar datos cuando se edita una extensión
  const modedition = () => {
    if (isEditMode && selectedExtension) {
      setNewExtension({
        nombre: selectedExtension.attributes.nombre || '',
        extension: selectedExtension.attributes.extension || '',
        correo: selectedExtension.attributes.correo || '',
        area: selectedExtension.attributes.area || '',
        dispositivo: selectedExtension.attributes.dispositivo || '',
        sede: selectedExtension.attributes.sede || '',
        tipo: selectedExtension.attributes.tipo || 'local',
      });

    }
  }
  // Función para manejar cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExtension((prevExtension) => ({
      ...prevExtension,
      [name]: value,
    }));
  };

  // Función para manejar el envío de formularios
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
        await actualizarextension({
          nombre: newExtension.nombre,
          extension: newExtension.extension,
          correo: newExtension.correo,
          area: newExtension.area,
          dispositivo: newExtension.dispositivo,
          sede: newExtension.sede,
          tipo: newExtension.tipo,
        }, selectedExtension.id);
        fetchExtensions();
        setIsEditMode(false);
        toast.success('Extension actualizada exitosamente');
      } else {
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
      await crearextension(newExtension, config);
      toast.success('Extensión creada exitosamente');
      fetchExtensions();
      }

      // Limpiar el formulario después de la creación o actualización exitosa
      setNewExtension({
        nombre: '',
        extension: '',
        correo: '',
        area: '',
        dispositivo: '',
        sede: '',
        tipo: 'local',
      });
    } catch (error) {
      console.error(isEditMode ? 'Error al actualizar la extensión:' : 'Error al agregar la extensión:', error);
    }
  };

  // Función para manejar la adición o actualización de una extensión
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

  // Función para editar una extensión
  const handleEditExtension = (extension) => {
    setSelectedExtension(extension);
    setIsEditMode(true);
  };

  // Función para manejar cambios en el banner
  const handleInputBanner = (event) => {
    setBannerText(event.target.value);
  };

  // Efecto secundario para cargar categorías y sedes al montar el componente
  useEffect(() => {
    fetchDataCategorias(setCategorias);
    fetchDataSedes(setSedes);
  }, []);

  const handleCrearClick = (url, setData, nombreCampo, setNuevoItemTabla, setMostrarCamposTabla) => {
    setMostrarCamposTabla(true);
    setNuevoItemTabla('');
  };
  
  const handleGuardarClick = async (url, setData, nombreCampo, setNuevoItemTabla, nuevoItemTabla, setMostrarCamposTabla) => {
    try {
      const response = await axios.post(url, { data: { [nombreCampo]: nuevoItemTabla } });
      setData((prevData) => [...prevData, response.data.data]);
      setMostrarCamposTabla(false);
      setNuevoItemTabla(''); // Limpiar solo el nuevo item de la tabla específica
    } catch (error) {
      console.error(`Error al crear nuevo item (${url}):`, error);
    }
  };

  const handleEditarClick = (itemId, itemNombre) => {
    setEditandoItemId(itemId);
    setItemEditado(itemNombre);
  };

  const handleCancelarEdicion = () => {
    setEditandoItemId(null);
    setItemEditado('');
  };

  const handleActualizarClick = async (url, itemId, nombreCampo, setData) => {
    try {
      await axios.put(`${url}/${itemId}`, { data: { [nombreCampo]: itemEditado } });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === itemId
            ? { ...item, attributes: { [nombreCampo]: itemEditado } }
            : item
        )
      );
      setEditandoItemId(null);
      setItemEditado('');
    } catch (error) {
      console.error(`Error al actualizar item (${url}):`, error);
    }
  };

  const handleEliminarClick = async (url, itemId, setData) => {
    try {
      await axios.delete(`${url}/${itemId}`);
      setData((prevData) => prevData.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(`Error al eliminar item (${url}):`, error);
    }
  };

  // Proporcionar el estado y funciones necesarios a través del contexto
  return (
    <ExtContext.Provider value={{
      extensions,
      fetchExtensions,
      uniqueSedes,
      handleEliminarExtension,
      newExtension,
      crearExtension,
      fetchOptions,
      tipoOptions,
      modedition,
      isEditMode,
      handleInputChange,
      handleFormSubmit,
      handleExtensionAdded,
      handleEditExtension,
      selectedExtension,
      obtenerbanners,
      bannerText,
      handleInputBanner,
      setFilteredExtensions,
      filteredExtensions,
      handleOrdenarPorSede,
      handleOrdenarPorNombre,
      handleOrdenarPorExtension,
      ordenAscendente,
      setOrdenAscendente,
      handleOrdenarPorArea,
      handleOrdenarPorCorreo,
      handleOrdenarPorDispositivo,
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
      handleEliminarClick
    }}>
      {children}
    </ExtContext.Provider>
  );
};