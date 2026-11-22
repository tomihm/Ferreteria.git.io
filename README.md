# Ferretería Los Maestros

Sitio web de la Ferretería Los Maestros.
Permite revisar el catálogo y el stock en línea, armar el carrito, seguir los pedidos y la cuenta corriente, y administrar la tienda desde un panel.

Sitio publicado: https://tomihm.github.io/Ferreteria.git.io/

## Integrantes

- Tomás Hernández
- Diego
- Dario Rojas

## Tecnologías

- React 19 + Vite
- React Router (`react-router-dom`)
- Vitest + Testing Library para las pruebas
- Backend Spring Boot (repo `backend_ferreteria`) con la API REST
- GitHub Pages para el sitio y Render para el backend

## Páginas

| Ruta | Página |
|------|--------|
| `/` | Inicio |
| `/catalogo` | Catálogo de productos |
| `/producto/:id` | Detalle de un producto |
| `/carrito` | Carrito de compras |
| `/mis-pedidos` | Pedidos y cuenta corriente del cliente |
| `/panel` | Panel de administración |
| `/nosotros` | Quiénes somos |
| `/contacto` | Contacto y zona de despacho |

## Estructura

```
src/
├── core/        Header, Footer, Layout y página de inicio
├── pages/       Páginas del sitio y sus pruebas (*.test.jsx)
├── api/         Llamadas al backend (catálogo, sesión, pedidos, panel, contacto)
├── context/     Sesión, carrito y catálogo compartidos entre páginas
├── products/    Catálogo local, se usa si el backend no responde
├── utils/       Validaciones de formularios (RUT, correo, teléfono...)
└── main.jsx     Rutas de la aplicación
assets/          Páginas HTML originales, antes de migrar a React
```

## Cómo ejecutarlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

El sitio queda en http://localhost:5173/

Para que el login, los pedidos y el panel funcionen tiene que estar corriendo el backend en http://localhost:8080 (ver su README). Si el backend está en otra dirección, copia `.env.example` como `.env.local` y cambia `VITE_API_URL` (en producción manda `config.js`).

## Pruebas

```bash
npm test            # modo watch
npm test -- --run   # una sola vez
```

## GitHub Pages

Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml`, que instala las dependencias, corre las pruebas y, si pasan, compila y publica el sitio en GitHub Pages.
Si alguna prueba falla, el sitio no se actualiza.
La dirección del backend se configura en **Settings → Secrets and variables → Actions → Variables** con el nombre `API_URL` (por ejemplo `https://los-maestros.onrender.com`); el workflow la escribe en `config.js`. `https://tomihm.github.io` tiene que estar en `CORS_ORIGIN` del backend.
La dirección no queda dentro del build: si cambia, basta con cambiar la variable y volver a ejecutar el workflow.
