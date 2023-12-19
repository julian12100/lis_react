import { createContext, useContext, useState } from "react";
import { listarextensiones, eliminarextension, crearextension, actualizarextension } from "../api/extapi";
export const ExtContext = createContext ();

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
    const [selectedExtension, setSelectedExtension] = useState(null);
    const [newExtension, setNewExtension] = useState({
        nombre: '',
        extension: '',
        area: '',
        sede: '',
        tipo: 'whatsapp', // Valor por defecto
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

      const handleEliminarExtension = async (extensionId) => {
        try {
          // Realizar la solicitud DELETE
          const response = await eliminarextension(extensionId);
          console.log(response)
          // Actualizar el estado local o recargar las extensiones después de eliminar
          const updatedExtensions = extensions.filter((extension) => extension.id !== extensionId);
          setExtensions(updatedExtensions);
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
              area: selectedExtension.attributes.area || '',
              sede: selectedExtension.attributes.sede || '',
              tipo: selectedExtension.attributes.tipo || 'whatsapp',
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
                area: newExtension.area,
                sede: newExtension.sede,
                tipo: newExtension.tipo,
              }, selectedExtension.id);
              window.location.reload();
          } else {
            // Realizar la petición POST con Axios para agregar la nueva extensión
            const response = await crearextension(newExtension)
    
            // Llamar a la función proporcionada por el padre para notificar la adición de la nueva extensión
            handleExtensionAdded(response.data.data);
          }
    
          // Limpiar el formulario después de la creación o actualización exitosa
          setNewExtension({
            nombre: '',
            extension: '',
            area: '',
            sede: '',
            tipo: 'whatsapp',
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
          setExtensions((prevExtensions) => [...prevExtensions, newExtension]);
        }
      };

      const handleEditExtension = (extension) => {
        setSelectedExtension(extension);
        setIsEditMode(true);
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
    selectedExtension}}>
        {children}
    </ExtContext.Provider>
    );
};