import React from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from 'react-dom/client'
import router from './router/index.jsx'
import './index.css'  
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './components/AuthProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
