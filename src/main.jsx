import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Suspense } from "react";
import {BrowserRouter} from "react-router-dom";
import Footer from './components/Footer.jsx';
import { ExtContextProvider } from './context/ExtContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExtContextProvider>
    <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
        <App />
        <Footer/>
    </Suspense>
      
    </BrowserRouter>
    </ExtContextProvider>
  </React.StrictMode>,
)
