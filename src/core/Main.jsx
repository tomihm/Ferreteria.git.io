import { Link } from 'react-router-dom';
import { catalogo } from '../products/catalogo.js';
import TarjetaProducto from '../components/TarjetaProducto.jsx';

const categorias = [
  { id: 'construccion', nombre: 'Materiales de Construcción', texto: 'Cemento, arena, ladrillo, fierro y tableros' },
  { id: 'herramientas', nombre: 'Herramientas Eléctricas', texto: 'Taladros, esmeriles, sierras y lijadoras' },
  { id: 'manuales', nombre: 'Herramientas Manuales', texto: 'Martillos, alicates, niveles y huinchas' },
  { id: 'gasfiteria', nombre: 'Gasfitería', texto: 'Tubos PVC, fittings y llaves de paso' },
  { id: 'electricidad', nombre: 'Electricidad', texto: 'Cables, automáticos, enchufes y ampolletas' },
  { id: 'general', nombre: 'Ferretería General', texto: 'Tornillos, siliconas y seguridad' },
];

const pasos = [
  { titulo: 'Revisa el stock', texto: 'Cada producto muestra las unidades que hay en bodega ahora mismo. Si dice disponible, está.' },
  { titulo: 'Arma tu pedido', texto: 'Agrega lo que necesites al carrito y elige entre retirar en el mesón o pedir despacho.' },
  { titulo: 'Paga como te acomode', texto: 'Al contado, o a fin de mes si tienes cuenta corriente habilitada como contratista.' },
];

// los mismos cuatro que se mostraban antes en el inicio
const masPedidos = ['CON-001', 'HER-001', 'MAN-001', 'ELE-003'];

function Main() {
  const destacados = catalogo.filter((p) => masPedidos.includes(p.codigo));

  return (
    <>
      <section className="hero text-light">
        <div className="container py-5">
          <div className="col-lg-8 py-lg-4">
            <h1 className="display-5 fw-bold mb-3">Todo para tu obra, en un solo lugar</h1>
            <p className="lead mb-4">
              22 años en La Serena abasteciendo a contratistas y hogares. Mira el
              stock disponible y arma tu pedido sin tener que llamar por teléfono.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn btn-primary btn-lg">Ver catálogo</Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">Entrar a mi cuenta</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold">Qué vendemos</h2>
          <p className="text-body-secondary mb-4">Más de 800 referencias en bodega</p>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
            {categorias.map((c) => (
              <div className="col" key={c.id}>
                <Link to={`/catalogo#${c.id}`} className="categoria-link card card-body h-100">
                  <h3 className="h5 mb-1">{c.nombre}</h3>
                  <p className="text-body-secondary small mb-0">{c.texto}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
            <div>
              <h2 className="fw-bold">Los más pedidos</h2>
              <p className="text-body-secondary mb-0">Lo que se llevan nuestros maestros cada semana</p>
            </div>
            <Link to="/catalogo" className="btn btn-outline-dark">Ver todo el catálogo</Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {destacados.map((p) => (
              <div className="col" key={p.codigo}>
                <TarjetaProducto producto={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold mb-4">Cómo funciona comprar aquí</h2>
          <ol className="pasos row g-4 list-unstyled mb-0">
            {pasos.map((paso, i) => (
              <li className="col-md-4" key={paso.titulo}>
                <span className="pasos__numero">{i + 1}</span>
                <h3 className="h5">{paso.titulo}</h3>
                <p className="mb-0">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <h2 className="fw-bold mb-3">¿Despachamos hasta tu obra?</h2>
              <p className="mb-4">
                Cubrimos 12 km a la redonda desde Av. Balmaceda, lo que incluye La
                Serena y buena parte de Coquimbo. Revisa tu dirección en el
                mapa antes de hacer el pedido.
              </p>
              <Link to="/contacto" className="btn btn-primary">Ver mapa de cobertura</Link>
            </div>
            <div className="col-lg-5">
              <div className="card bg-dark text-light">
                <div className="card-body p-4">
                  <h3 className="h5 text-primary">Horario de atención</h3>
                  <p className="mb-3">
                    Lunes a viernes · 8:30 a 19:00
                    <br />
                    Sábado · 9:00 a 14:00
                    <br />
                    Domingo · cerrado
                  </p>
                  <a href="tel:+56512214455" className="fw-bold link-light">+56 51 221 4455</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
export default Main
