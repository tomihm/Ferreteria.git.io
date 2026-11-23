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
- AWS S3 (sitio estático) o GitHub Pages para el despliegue

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

## Despliegue en AWS (S3)

El backend va en una EC2 con HTTPS (`https://<ip-con-guiones>.sslip.io`, ver `DEPLOY.md` del backend). Como el backend tiene HTTPS, el sitio funciona igual desde S3 o desde GitHub Pages.

La dirección del backend no queda dentro del build: se lee de `config.js`, que está al lado de `index.html`. Si la dirección cambia, basta con cambiar ese archivo, sin recompilar.

1. Crear el bucket y dejarlo público como sitio web (una sola vez, con la AWS CLI del Learner Lab):

```bash
BUCKET=los-maestros-web-<algo-unico>
aws s3 mb s3://$BUCKET
aws s3api put-public-access-block --bucket $BUCKET \
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
aws s3 website s3://$BUCKET --index-document index.html --error-document index.html
aws s3api put-bucket-policy --bucket $BUCKET --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}"
```

2. Compilar, poner la dirección del backend y subir:

```bash
npm run build:s3
echo "window.CONFIG = { API_URL: 'https://<ip-con-guiones>.sslip.io' };" > dist/config.js
aws s3 sync dist s3://$BUCKET --delete
```

3. El sitio queda en `http://$BUCKET.s3-website-us-east-1.amazonaws.com`. Esa URL va en `CORS_ORIGIN` del `app.env` del backend.

Para cambiar solo la dirección del backend:

```bash
echo "window.CONFIG = { API_URL: 'https://<nueva-ip-con-guiones>.sslip.io' };" > config.js
aws s3 cp config.js s3://$BUCKET/config.js --cache-control no-cache
```

`--error-document index.html` hace que al recargar `/catalogo` o `/panel` cargue la aplicación en vez de dar error.

## GitHub Pages

Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml`, que instala las dependencias, corre las pruebas y, si pasan, compila y publica el sitio en GitHub Pages.
Si alguna prueba falla, el sitio no se actualiza.
La dirección del backend se configura en **Settings → Secrets and variables → Actions → Variables** con el nombre `API_URL` (por ejemplo `https://54-12-34-56.sslip.io`, o la URL de Render si el backend está ahí); el workflow la escribe en `config.js`. `https://tomihm.github.io` tiene que estar en `CORS_ORIGIN` del backend.
