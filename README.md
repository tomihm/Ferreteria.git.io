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
- AWS S3 (sitio estático) para el despliegue, y GitHub Pages como respaldo

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

Para que el login, los pedidos y el panel funcionen tiene que estar corriendo el backend en http://localhost:8080 (ver su README). Si el backend está en otra dirección, copia `.env.example` como `.env.local` y cambia `VITE_API_URL`.

## Pruebas

```bash
npm test            # modo watch
npm test -- --run   # una sola vez
```

## Despliegue en AWS (S3)

El backend va en una EC2 por `http://<IP>:8080`. El frontend se publica como sitio estático en un bucket S3, que también es `http://`: si el sitio se sirviera por `https` (como GitHub Pages), el navegador bloquearía las llamadas al backend.

1. Crear el bucket y dejarlo público como sitio web (una sola vez, con la AWS CLI del Learner Lab):

```bash
BUCKET=los-maestros-web-<algo-unico>
aws s3 mb s3://$BUCKET
aws s3api put-public-access-block --bucket $BUCKET \
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
aws s3 website s3://$BUCKET --index-document index.html --error-document index.html
aws s3api put-bucket-policy --bucket $BUCKET --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}"
```

2. Compilar con la IP pública de la EC2 y subir:

```bash
VITE_API_URL=http://<IP-PUBLICA-EC2>:8080 npm run build:s3
aws s3 sync dist s3://$BUCKET --delete
```

3. El sitio queda en `http://$BUCKET.s3-website-us-east-1.amazonaws.com`. Esa misma URL va en `CORS_ORIGIN` del `app.env` del backend.

`--error-document index.html` hace que al recargar `/catalogo` o `/panel` cargue la aplicación en vez de dar error.
Si se reinicia el laboratorio cambia la IP de la EC2: hay que repetir el paso 2 (o usar una Elastic IP).

## GitHub Pages

Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml`, que instala las dependencias, corre las pruebas y, si pasan, compila y publica el sitio en GitHub Pages.
Si alguna prueba falla, el sitio no se actualiza. En Pages el catálogo se ve con los datos locales; el login y las compras necesitan el sitio en S3.
