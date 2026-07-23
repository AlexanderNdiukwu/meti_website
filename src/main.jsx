import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import ToastContainer from './components/ToastContainer'
import './index.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </StrictMode>,
)
