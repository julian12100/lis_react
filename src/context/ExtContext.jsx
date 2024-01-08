import { createContext, useContext, useState } from "react";
import { listarextensiones, eliminarextension, crearextension, actualizarextension, obtenerBanner } from "../api/extapi";
export const ExtContext = createContext ();
import { toast } from 'sonner';
import { AiFillCloseCircle } from "react-icons/ai";

export const useExten = () => {
    const context = useContext(ExtContext)
    if (!context){
        throw new Error ("el useExten no se encuentra dentro del ExtContextProvider")
    }
    return context;
}

export const ExtContextProvider = ({ children }) => {

    const [extensions, setExtensions] = useState([]);
    const [uniqueSedes, setUniqueSedes] = useState([]);
    const [sedeOptions, setSedeOptions] = useState([]);
    const [tipoOptions, setTipoOptions] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [filteredExtensions, setFilteredExtensions] = useState([]);
    const [bannerText, setBannerText] = useState('');
    const [selectedExtension, setSelectedExtension] = useState(null);
    const [ordenAscendente, setOrdenAscendente] = useState(true);
    
    const [newExtension, setNewExtension] = useState({
        nombre: '',
        extension: '',
        correo: '',
        area: '',
        sede: '',
        tipo: 'local', // Valor por defecto
      });

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

      const handleOrdenarPorSede = () => {
        const sortedData = [...filteredExtensions].sort((b, a) =>
          ordenAscendente
            ? a.attributes.sede.toLowerCase().localeCompare(b.attributes.sede.toLowerCase())
            : b.attributes.sede.toLowerCase().localeCompare(a.attributes.sede.toLowerCase())
        );
        setFilteredExtensions(sortedData);
        setOrdenAscendente(!ordenAscendente); // Cambiar el estado para alternar el orden
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
    
      const obtenerbanners = async () => {
        try {
          const banner = await obtenerBanner();
         
          setBannerText(banner);
        } catch (error) {
          // Manejar el error aquí si es necesario
        }
      };

      const handleEliminarExtension = async (extensionId) => {
        try {
          // Realizar la solicitud DELETE
          const response = await eliminarextension(extensionId);
          console.log(response)
          // Actualizar el estado local o recargar las extensiones después de eliminar
          const updatedExtensions = extensions.filter((extension) => extension.id !== extensionId);
          setExtensions(updatedExtensions);
          toast.success('Extension eliminada correctamente', {
            icon: <AiFillCloseCircle className="text-2xl"/>,
            style: {
              background: '#FF6347',
            },
            className: 'class',
          });

        } catch (error) {
          console.error('Error al eliminar la extensión:', error);
        }
      };

      const crearExtension = async () => {
        try{
            const response = await crearextension(newExtension)
        }catch(error){

        }
      };
      
      const fetchOptions = async () => {
        try {
          const response = await listarextensiones()
          const uniqueSedes = [...new Set(response.data.data.map(extension => extension.attributes.sede))];
          const uniqueTipos = [...new Set(response.data.data.map(extension => extension.attributes.tipo))];
          setSedeOptions(uniqueSedes);
          setTipoOptions(uniqueTipos);
        } catch (error) {
          console.error('Error fetching extension options:', error);
        }
      };

      const modedition = () => {
        if (isEditMode && selectedExtension) {
            setNewExtension({
              nombre: selectedExtension.attributes.nombre || '',
              extension: selectedExtension.attributes.extension || '',
              correo: selectedExtension.attributes.correo || '',
              area: selectedExtension.attributes.area || '',
              sede: selectedExtension.attributes.sede || '',
              tipo: selectedExtension.attributes.tipo || 'local',
            });
            
          }
      }

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExtension((prevExtension) => ({
          ...prevExtension,
          [name]: value,
        }));
      };

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
                sede: newExtension.sede,
                tipo: newExtension.tipo,
              }, selectedExtension.id);
              fetchExtensions();
              setIsEditMode(false);
              toast.success('Extension actualizada exitosamente');
          } else {
            // Realizar la petición POST con Axios para agregar la nueva extensión
            const response = await crearextension(newExtension)
            
            // Llamar a la función proporcionada por el padre para notificar la adición de la nueva extensión
            handleExtensionAdded(response.data.data);
            toast.success('Extension creada exitosamente');
            fetchExtensions();
          }
    
          // Limpiar el formulario después de la creación o actualización exitosa
          setNewExtension({
            nombre: '',
            extension: '',
            correo: '',
            area: '',
            sede: '',
            tipo: 'local',
          });
        } catch (error) {
          console.error(isEditMode ? 'Error al actualizar la extensión:' : 'Error al agregar la extensión:', error);
        }
      };

      const handleExtensionAdded = (newExtension) => {
        // If in edit mode, update the extension
        if (isEditMode) {
          setSelectedExtension(null);
          setIsEditMode(false);
        } else {
          // If not in edit mode, add the new extension
          setExtensions((prevExtensions) =>[...prevExtensions, newExtension]);
        }
      };

      const handleEditExtension = (extension) => {
        setSelectedExtension(extension);
        setIsEditMode(true);
      };

      const handleInputBanner = (event) => {
        setBannerText(event.target.value);
      };

    return (
    <ExtContext.Provider value={{extensions, 
    fetchExtensions, 
    uniqueSedes, 
    handleEliminarExtension, 
    newExtension, 
    crearExtension, 
    fetchOptions, 
    sedeOptions, 
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
    handleOrdenarPorCorreo
   }}>
        {children}
    </ExtContext.Provider>
    );
};