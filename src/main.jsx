import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './core/Layout.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Contacto from './pages/Contacto.jsx'
import MisPedidos from './pages/MisPedidos.jsx'
import Panel from './pages/Panel.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'catalogo', element: <Catalogo /> },
      { path: 'nosotros', element: <Nosotros /> },
      { path: 'contacto', element: <Contacto /> },
      { path: 'mis-pedidos', element: <MisPedidos /> },
      { path: 'panel', element: <Panel /> },
      { path: 'producto/:id', element: <ProductoDetalle /> },
      { path: '*', element: <div>404 Not Found</div> }
    ],
  },
], {
  basename: import.meta.env.BASE_URL
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
