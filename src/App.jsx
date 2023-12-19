import { Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect, lazy } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from './components/Navbar';
import Athentic from './components/Athentic';
import { useExten } from '../src/context/ExtContext';

const Home = lazy (() => import("./pages/Home"));
const Analytics = lazy (() => import("./pages/Analytics"));
const Extension = lazy (() => import("./pages/Extension"));

function App() {
  const [user, setUser] = useState(null);

  const {} = useExten()

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

          <Extension user={user} />

        } />



        <Route path='/' element={<Navigate to="/extensiones" />} />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              redirectTo="/extensiones"
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
