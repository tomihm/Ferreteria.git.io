import { useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogo } from '../products/catalogo.js';
import { categorias } from '../products/categorias.js';
import { descuento } from '../utils/ofertas.js';
import TarjetaProducto from '../components/TarjetaProducto.jsx';

const formatoPeso = (valor) => `$${valor.toLocaleString('es-CL')}`;

const textosCategoria = {
  construccion: 'Cemento, arena, ladrillo, fierro y tableros',
  herramientas: 'Taladros, esmeriles, sierras y lijadoras',
  manuales: 'Martillos, alicates, niveles y huinchas',
  gasfiteria: 'Tubos PVC, fittings y llaves de paso',
  electricidad: 'Cables, automáticos, enchufes y ampolletas',
  general: 'Tornillos, siliconas y seguridad',
};

const pasos = [
  { titulo: 'Revisa el stock', texto: 'Cada producto muestra las unidades que hay en bodega ahora mismo. Si dice disponible, está.' },
  { titulo: 'Arma tu pedido', texto: 'Agrega lo que necesites al carrito y elige entre retirar en el mesón o pedir despacho.' },
  { titulo: 'Paga como te acomode', texto: 'Al contado, o a 30 días con crédito si eres contratista con cuenta habilitada.' },
];

// los mismos cuatro que se mostraban antes en el inicio
const masPedidos = ['CON-001', 'HER-001', 'MAN-001', 'ELE-003'];

// chips para cambiar los productos de la seccion "los mas pedidos"
const chips = [
  { id: '', nombre: 'Más vendidos' },
  { id: 'herramientas', nombre: 'Herramientas' },
  { id: 'construccion', nombre: 'Construcción' },
  { id: 'electricidad', nombre: 'Electricidad' },
  { id: 'general', nombre: 'Seguridad y ferretería' },
];

// las cuatro ofertas con mas descuento van en la franja naranja
const ofertasDestacadas = catalogo
  .filter((p) => p.precioNormal)
  .sort((a, b) => descuento(b) - descuento(a))
  .slice(0, 4);

const productoHero = catalogo.find((p) => p.codigo === 'HER-003');

function IconoCamion() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 4h13v11H1zM14 8h4l4 4v3h-8z" /><circle cx="5.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconoTarjeta() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  );
}

function Main() {
  const [chip, setChip] = useState('');

  const destacados = chip === ''
    ? catalogo.filter((p) => masPedidos.includes(p.codigo))
    : catalogo.filter((p) => p.categoria === chip).slice(0, 4);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="inicio-hero">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <p className="ceja ceja--punto">Ferretería de oficio en La Serena</p>
              <h1 className="inicio-hero__titulo">
                Todo para tu <span className="resaltado">obra</span>, en un solo lugar
              </h1>
              <p className="inicio-hero__texto">
                Materiales, herramientas y ferretería para contratistas y hogares. Mira el
                stock disponible y arma tu pedido sin tener que llamar por teléfono.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
                <Link to="/catalogo" className="btn btn-dark btn-mayus">Ver catálogo</Link>
                <Link to="/catalogo?ofertas=1" className="link-flecha">Ver ofertas</Link>
              </div>
              <ul className="garantias list-unstyled">
                <li><span className="garantias__icono"><IconoCamion /></span>Despacho gratis sobre $150.000</li>
                <li><span className="garantias__icono"><IconoReloj /></span>Retiro el mismo día</li>
                <li><span className="garantias__icono"><IconoTarjeta /></span>Crédito a 30 días</li>
              </ul>
            </div>

            <div className="col-lg-6">
              <div className="inicio-hero__vitrina">
                <Link to={`/producto/${productoHero.id}`} className="inicio-hero__foto">
                  <img src={import.meta.env.BASE_URL + productoHero.imagen} alt={productoHero.nombre} />
                </Link>
                <div className="inicio-hero__chip">
                  <strong>22</strong>
                  <span>años en La Serena<br />desde 2004</span>
                </div>
                <div className="inicio-hero__oferta">
                  <p className="ceja ceja--punto ceja--clara mb-1">Oferta de temporada</p>
                  <p className="inicio-hero__oferta-titulo">Hasta 25% off</p>
                  <p className="mb-0 small">Herramientas eléctricas y seguridad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FRANJA DE OFERTAS ============ */}
      <section className="franja-ofertas">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <p className="ceja ceja--oscura">Ofertas de temporada · hasta agotar stock</p>
              <h2 className="franja-ofertas__titulo">Hasta 25% off en herramientas para la obra</h2>
              <p className="mb-4">
                Sierras, esmeriles, lijadoras y elementos de seguridad a precio rebajado, con
                la misma garantía y despacho de siempre.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-4">
                <Link to="/catalogo?ofertas=1" className="btn btn-dark btn-mayus">Ver ofertas</Link>
                <span className="franja-ofertas__nota"><IconoCamion /> Despacho gratis sobre $150.000</span>
              </div>
            </div>
            <div className="col-lg-5">
              <ul className="ofertas-mini list-unstyled mb-0">
                {ofertasDestacadas.map((p) => (
                  <li key={p.codigo}>
                    <Link to={`/producto/${p.id}`} className="ofertas-mini__item">
                      <span className="ofertas-mini__nombre">{p.nombre}</span>
                      <span className="ofertas-mini__precio">{formatoPeso(p.precio)} · -{descuento(p)}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOS MAS PEDIDOS ============ */}
      <section className="py-5 my-lg-4">
        <div className="container">
          <p className="ceja">Lo que más sale</p>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <h2 className="seccion-titulo">Los más <span className="resaltado">pedidos</span>.</h2>
              <p className="text-body-secondary mb-0">Lo que se llevan nuestros maestros cada semana, con reposición diaria.</p>
            </div>
            <Link to="/catalogo" className="link-flecha">Ver todo el catálogo</Link>
          </div>

          <div className="chips mb-4" role="group" aria-label="Filtrar productos destacados">
            {chips.map((c) => (
              <button key={c.id} type="button" className={`chip${chip === c.id ? ' chip--activo' : ''}`}
                aria-pressed={chip === c.id} onClick={() => setChip(c.id)}>
                {c.nombre}
              </button>
            ))}
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

      {/* ============ CATEGORIAS ============ */}
      <section className="py-5 bg-white">
        <div className="container">
          <p className="ceja">Qué vendemos</p>
          <h2 className="seccion-titulo mb-4">Más de 800 referencias en bodega.</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
            {categorias.map((c) => (
              <div className="col" key={c.id}>
                <Link to={`/catalogo?categoria=${c.id}`} className="categoria-link">
                  <span>
                    <span className="categoria-link__nombre">{c.nombre}</span>
                    <span className="categoria-link__texto">{textosCategoria[c.id]}</span>
                  </span>
                  <span className="categoria-link__flecha" aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMO COMPRAR ============ */}
      <section className="py-5">
        <div className="container">
          <p className="ceja">Cómo funciona</p>
          <h2 className="seccion-titulo mb-4">Comprar aquí, en tres pasos.</h2>
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

      {/* ============ DESPACHO ============ */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <p className="ceja">Despacho</p>
              <h2 className="seccion-titulo mb-3">¿Llegamos hasta tu obra?</h2>
              <p className="mb-4">
                Cubrimos 12 km a la redonda desde Av. Balmaceda, lo que incluye La
                Serena y buena parte de Coquimbo. Revisa tu dirección en el
                mapa antes de hacer el pedido.
              </p>
              <Link to="/contacto" className="link-flecha">Ver mapa de cobertura</Link>
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
