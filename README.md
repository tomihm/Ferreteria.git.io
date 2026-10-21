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
- GitHub Actions + GitHub Pages para el despliegue

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
├── mocks/       Datos de prueba que simulan las respuestas del backend
├── products/    Listado de productos
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

## Pruebas

```bash
npm test            # modo watch
npm test -- --run   # una sola vez
```

## Despliegue

Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml`, que instala las dependencias, corre las pruebas y, si pasan, compila y publica el sitio en GitHub Pages.
Si alguna prueba falla, el sitio no se actualiza.
