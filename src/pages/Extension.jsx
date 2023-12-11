import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Extension() {
  const [extensions, setExtensions] = useState([]);
  const [filteredExtensions, setFilteredExtensions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const response = await axios.get('http://192.168.174.133:1337/api/extensions');
        setExtensions(response.data.data);
      } catch (error) {
        console.error('Error fetching extensions:', error);
      }
    };

    fetchExtensions();
  }, []);

  useEffect(() => {
    // Aplicar filtros y búsqueda
    const filteredData = extensions.filter(extension =>
      Object.values(extension.attributes).some(
        value =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredExtensions(filteredData);
  }, [searchTerm, extensions]);

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-screen-md mx-auto">
      <h1>Lista de Extensiones</h1>

      <div className="mb-4">
        <label htmlFor="search" className="mr-2">
          Buscar:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar por cualquier campo"
          className="border border-gray-300 px-2 py-1"
        />
        
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b"></th>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Extension</th>
            <th className="py-2 px-4 border-b">Área</th>
            <th className="py-2 px-4 border-b">Sede</th>
          </tr>
        </thead>
        <tbody>
          {filteredExtensions.map(extension => (
            <tr key={extension.id}>
              <td className="py-2 px-4 border-b"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                <path fill="#f2faff" d="M3.515,21.833L3.41,21.652c-1.175-2.034-1.795-4.356-1.794-6.717C1.62,7.527,7.649,1.5,15.058,1.5 c3.594,0.001,6.971,1.4,9.508,3.94c2.537,2.539,3.935,5.915,3.935,9.507c-0.004,7.409-6.033,13.437-13.441,13.437 c-2.249-0.002-4.471-0.567-6.429-1.636l-0.174-0.095l-6.745,1.769L3.515,21.833z"></path><path fill="#788b9c" d="M15.058,2L15.058,2c3.46,0.001,6.711,1.348,9.154,3.793C26.655,8.239,28,11.489,28,14.946 c-0.003,7.133-5.809,12.937-12.946,12.937c-2.16-0.001-4.299-0.545-6.184-1.574l-0.349-0.19L8.137,26.22l-5.715,1.498l1.52-5.552 l0.11-0.403l-0.209-0.362c-1.131-1.958-1.728-4.194-1.727-6.466C2.12,7.803,7.925,2,15.058,2 M15.058,1 C7.374,1,1.12,7.252,1.117,14.935c-0.001,2.456,0.64,4.854,1.861,6.967L1,29.125l7.391-1.938 c2.036,1.111,4.329,1.695,6.663,1.696h0.006c7.683,0,13.938-6.252,13.941-13.936c0-3.724-1.449-7.226-4.081-9.86 C22.287,2.452,18.787,1.001,15.058,1L15.058,1z"></path><path fill="#79ba7e" d="M15.055,25.883c-1.827-0.001-3.634-0.461-5.227-1.33l-1.046-0.57L7.63,24.285l-2.364,0.62l0.605-2.21	l0.331-1.208l-0.626-1.085c-0.955-1.654-1.459-3.544-1.459-5.465C4.119,8.906,9.027,4.001,15.057,4	c2.926,0.001,5.674,1.14,7.74,3.207C24.862,9.274,26,12.023,26,14.946C25.997,20.977,21.089,25.883,15.055,25.883z"></path><path fill="#fff" d="M21.101,17.717c-0.332-0.165-1.96-0.967-2.263-1.077c-0.304-0.111-0.525-0.165-0.745,0.165	c-0.221,0.332-0.855,1.077-1.048,1.298c-0.193,0.221-0.386,0.248-0.718,0.083c-0.332-0.165-1.399-0.516-2.664-1.644	c-0.985-0.878-1.65-1.962-1.843-2.294c-0.193-0.332-0.021-0.51,0.145-0.676c0.149-0.149,0.332-0.387,0.497-0.58	c0.165-0.193,0.221-0.332,0.332-0.552s0.055-0.415-0.028-0.58c-0.083-0.165-0.745-1.796-1.022-2.458	C11.477,8.756,11.203,8.844,11,8.834c-0.193-0.01-0.414-0.011-0.635-0.011c-0.221,0-0.58,0.083-0.883,0.415	C9.179,9.569,8.323,10.37,8.323,12s1.187,3.205,1.352,3.426c0.165,0.221,2.335,3.565,5.659,5c0.79,0.341,1.408,0.545,1.888,0.698	c0.793,0.252,1.515,0.216,2.087,0.131c0.637-0.095,1.96-0.801,2.235-1.574c0.276-0.773,0.276-1.437,0.193-1.574	C21.654,17.966,21.433,17.883,21.101,17.717z"></path>
              </svg></td>
              <td className="py-2 px-4 border-b">{extension.id}</td>
              <td className="py-2 px-4 border-b">{extension.attributes.nombre}</td>
              <td className="py-2 px-4 border-b">{extension.attributes.extension}</td>
              <td className="py-2 px-4 border-b">{extension.attributes.area}</td>
              <td className="py-2 px-4 border-b">{extension.attributes.sede}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Extension;
