  // Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";

function Navbar({ user }) {
    const [navbar, setNavbar] = useState(false);
  
    // Función para verificar si el usuario tiene el rol "Mesa"
    const hasMesaRole = () => user && user.roles && user.roles.includes('mesa');

    //{hasMesaRole() && (
    //  <li className="text-white py-2 px-4 pt-1 lg:mr-7 hover:text-white/25 transition duration-500 ease-in-out">
    //    <Link to="/extensiones">Extensiones</Link>
    //  </li>
    //)}
  
    return (
      <>
        <nav className="py-2 relative pl-6 pr-6">
          <div className="bg-slate-900 w-full justify-between mx-auto md:items-center md:flex px-8 rounded-md">
            <div>
              <div className="flex items-center justify-between md:block">
                <div className="md:hidden">
                  <button
                    className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                    onClick={() => setNavbar(!navbar)}
                  >
                    {navbar ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div
                className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                  navbar ? 'block' : 'hidden'
                }`}
              >
                <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                
                {hasMesaRole() && (
 <li className="text-white py-2 px-4 pt-1 lg:mr-7 hover:text-white/25 transition duration-500 ease-in-out">  
                    <Link to="/">🏡 Inicio</Link>
                  </li>
                )}
                
                 

                  {hasMesaRole() && (
                  <li className="text-white py-2 px-4 pt-1 lg:mr-7 hover:text-white/25 transition duration-500 ease-in-out">
                    <Link to="/analytics">Analytics</Link>
                  </li>
                  )}
                 
                    <li className="text-white py-2 px-4 pt-1 lg:mr-7 hover:text-white/25 transition duration-500 ease-in-out">
                      <Link to="/extensiones">☎️ Extensiones</Link>
                    </li>
               
                  
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
  
  export default Navbar;