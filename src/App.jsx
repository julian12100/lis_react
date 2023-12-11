import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Extension from './pages/Extension'
import Home from './pages/Home'
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import Athentic from './components/Athentic';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario almacenado en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      // Si hay un usuario, establecer el estado del usuario con los datos recuperados del localStorage
      setUser(storedUser);
    }
  }, []); // El efecto se ejecuta solo en el montaje inicial

  const handleLogin = (userData) => {
    setUser({
      id: userData.user.id,
      username: userData.user.username,
      email: userData.user.email,
      jwt: userData.jwt,
      confirmed: userData.user.confirmed,
      nombre: userData.user.nombre,
      roles: userData.user.roles || [], // Si no hay roles, establecer como array vacío
    });

    // Almacenar los datos del usuario en localStorage
    localStorage.setItem('user', JSON.stringify({
      id: userData.user.id,
      username: userData.user.username,
      email: userData.user.email,
      confirmed: userData.user.confirmed,
      nombre: userData.user.nombre,
      roles: userData.user.roles || [],
    }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      <Athentic user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <Navbar user={user} />
      <Routes>
        <Route path='/extensiones' element={

          <Extension />

        } />



        <Route path='/' element={<Home />} />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              redirectTo="/"
              isAllowed={!!user && user.confirmed}
            >
              <Analytics />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>

  )
}

export default App
