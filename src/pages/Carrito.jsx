import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Validar from '../utils/validaciones.js';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useSesion } from '../context/SesionContext.jsx';
import { revisarDireccion, RADIO_DESPACHO_KM } from '../utils/despacho.js';
import BuscadorDireccion from '../components/BuscadorDireccion.jsx';

const DESPACHO_GRATIS_DESDE = 150000;
const COSTO_DESPACHO = 6990;

const formatoPeso = (valor) => `$${valor.toLocaleString('es-CL')}`;
const formatoKm = (km) => `${km.toLocaleString('es-CL', { maximumFractionDigits: 1 })} km`;

// texto que se muestra bajo la direccion segun lo que respondio la revision
function mensajeRevision(revision) {
    switch (revision?.estado) {
        case 'revisando': return 'Revisando la dirección en el mapa...';
        case 'apta': return `Llegamos: queda a ${formatoKm(revision.km)} de la tienda.`;
        case 'fuera': return `Queda a ${formatoKm(revision.km)}, fuera de los ${RADIO_DESPACHO_KM} km de despacho. Puedes elegir retiro en tienda.`;
        case 'no-encontrada': return 'No encontramos esa dirección. Escribe calle, número y comuna.';
        case 'error': return 'No pudimos revisar la dirección. Revisa tu conexión e intenta de nuevo.';
        default: return null;
    }
}

// los pasos de la compra; por ahora todo pasa en esta misma pagina
const pasos = ['Carrito', 'Entrega y pago', 'Confirmación'];

function IconoTienda() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l1.5-5h15L21 9M3 9h18M3 9v11h18V9M9 20v-6h6v6" />
        </svg>
    );
}

function IconoCamion() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 4h13v11H1zM14 8h4l4 4v3h-8z" /><circle cx="5.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" />
        </svg>
    );
}

function Carrito() {
    const { items, cambiarCantidad, quitar, vaciar, totalUnidades } = useCarrito();
    const { usuario } = useSesion();
    const [entrega, setEntrega] = useState('retiro');
    const [direccion, setDireccion] = useState('');
    const [usarCC, setUsarCC] = useState(false);
    const [errorDireccion, setErrorDireccion] = useState(null);
    const [aviso, setAviso] = useState(null);
    // resultado de revisar la direccion con el mapa ({ estado, km })
    const [revision, setRevision] = useState(null);
    // la ultima consulta al mapa ({ texto, promesa }); si se pide la misma direccion se reutiliza
    const consulta = useRef(null);

    // mientras se escribe la cantidad puede quedar vacía, se cuenta como 0
    const subtotal = items.reduce((total, item) => total + item.precio * (Number(item.cantidad) || 0), 0);
    const despachoGratis = subtotal >= DESPACHO_GRATIS_DESDE;
    const despacho = entrega === 'retiro' || despachoGratis ? 0 : COSTO_DESPACHO;
    const total = subtotal + despacho;
    // el paso 2 se marca activo apenas hay algo en el carrito
    const pasoActual = items.length > 0 ? 1 : 0;

    const handleCantidad = (item, valor) => {
        if (valor === '') {
            cambiarCantidad(item.codigo, '');
            return;
        }
        // la cantidad queda entre 1 y el stock disponible
        cambiarCantidad(item.codigo, Math.min(Math.max(Number(valor), 1), item.stock));
    };

    const corregirCantidad = (item) => {
        if (item.cantidad === '') cambiarCantidad(item.codigo, 1);
    };

    const handleVaciar = () => {
        vaciar();
        setAviso(null);
    };

    const handleEntrega = (e) => {
        setEntrega(e.target.value);
        setErrorDireccion(null);
        setAviso(null);
    };

    const handleDireccion = (e) => {
        setDireccion(e.target.value);
        // si cambia el texto (o se borra), la revision anterior y su mensaje rojo ya no sirven
        setRevision(null);
        setErrorDireccion(null);
        if (aviso?.tipo === 'error') setAviso(null);
        consulta.current = null;
    };

    // al elegir de la lista ya se tienen las coordenadas: no hace falta buscarla otra vez
    const elegirDireccion = (sugerencia) => {
        const resultado = { estado: sugerencia.apta ? 'apta' : 'fuera', km: sugerencia.km, punto: sugerencia.punto };
        setDireccion(sugerencia.texto);
        setRevision(resultado);
        setErrorDireccion(sugerencia.apta ? null : mensajeRevision(resultado));
        setAviso(null);
        consulta.current = { texto: sugerencia.texto, promesa: Promise.resolve(resultado) };
    };

    // busca la direccion escrita a mano en el mapa y calcula la distancia a la tienda
    const revisar = () => {
        const texto = direccion.trim();
        if (!texto) return Promise.resolve(null);
        // al apretar confirmar justo despues de escribir, el blur ya inicio la misma consulta
        if (consulta.current?.texto === texto) return consulta.current.promesa;

        setRevision({ estado: 'revisando' });
        const actual = { texto };
        actual.promesa = revisarDireccion(texto).then((resultado) => {
            // si mientras tanto se escribio otra cosa, esta respuesta se descarta
            if (consulta.current !== actual) return null;
            setRevision(resultado);
            setErrorDireccion(resultado.estado === 'apta' ? null : mensajeRevision(resultado));
            return resultado;
        });
        consulta.current = actual;
        return actual.promesa;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            setAviso({ tipo: 'error', texto: 'Tu carrito está vacío.' });
            return;
        }

        if (entrega === 'despacho') {
            const error = Validar.requerido(direccion);
            setErrorDireccion(error);
            if (error) {
                setAviso({ tipo: 'error', texto: 'Escribe la dirección de entrega para el despacho.' });
                return;
            }

            const resultado = await revisar();
            if (resultado?.estado !== 'apta') {
                setAviso({ tipo: 'error', texto: 'La dirección de entrega no es apta para despacho.' });
                return;
            }
        }

        // TODO: conectar con el backend
        setAviso({ tipo: 'exito', texto: 'Pedido válido. La confirmación se conectará al backend en la siguiente etapa.' });
    };

    return (
        <section className="py-4 py-lg-5 bg-gris">
            <div className="container">
                <div className="compra">
                    {/* encabezado con el titulo y los pasos */}
                    <div className="compra__cabecera">
                        <h1 className="compra__titulo">Tu carrito</h1>
                        <ol className="pasos-compra">
                            {pasos.map((paso, i) => (
                                <li key={paso} className={i < pasoActual ? 'pasos-compra__paso--listo' : i === pasoActual ? 'pasos-compra__paso--actual' : ''}
                                    aria-current={i === pasoActual ? 'step' : undefined}>
                                    <span className="pasos-compra__numero" aria-hidden="true">{i < pasoActual ? '✓' : i + 1}</span>
                                    {paso}
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="row g-0">
                        {/* productos y forma de entrega */}
                        <div className="col-lg-7 compra__lado">
                            <h2 className="compra__subtitulo">Resumen del pedido</h2>
                            <p className="text-body-secondary small mb-4">Revisa las cantidades y elige cómo quieres recibir tu pedido.</p>

                            {items.length === 0 ? (
                                <div className="compra__vacio">
                                    <p className="mb-3">Tu carrito está vacío.</p>
                                    <Link to="/catalogo" className="btn btn-dark btn-mayus">Ir al catálogo</Link>
                                </div>
                            ) : (
                                <ul className="lista-compra list-unstyled">
                                    {items.map((item) => (
                                        <li key={item.codigo} className="lista-compra__item">
                                            <div className="lista-compra__foto">
                                                {item.imagen
                                                    ? <img src={import.meta.env.BASE_URL + item.imagen} alt="" />
                                                    : <span aria-hidden="true">{item.icono}</span>}
                                            </div>
                                            <div className="lista-compra__datos">
                                                <p className="lista-compra__nombre">{item.nombre}</p>
                                                <p className="small text-body-secondary mb-2">{item.codigo} · {item.marca}</p>
                                                <p className="mb-0">
                                                    <strong>{formatoPeso(item.precio * (Number(item.cantidad) || 0))}</strong>
                                                    <span className="small text-body-secondary ms-2">{formatoPeso(item.precio)} c/u</span>
                                                    {item.precioNormal && (
                                                        <del className="small text-body-secondary ms-2">
                                                            <span className="visually-hidden">Antes </span>{formatoPeso(item.precioNormal)}
                                                        </del>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="lista-compra__acciones">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm cantidad"
                                                    value={item.cantidad}
                                                    min="1"
                                                    max={item.stock}
                                                    onChange={(e) => handleCantidad(item, e.target.value)}
                                                    onBlur={() => corregirCantidad(item)}
                                                    aria-label={`Cantidad de ${item.nombre}`}
                                                />
                                                <button
                                                    type="button"
                                                    className="lista-compra__quitar"
                                                    onClick={() => quitar(item.codigo)}
                                                    aria-label={`Quitar ${item.nombre}`}
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {items.length > 0 && (
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
                                    <Link to="/catalogo" className="link-flecha">Seguir comprando</Link>
                                    <button type="button" className="btn btn-link btn-sm text-danger p-0" onClick={handleVaciar}>
                                        Vaciar carrito
                                    </button>
                                </div>
                            )}

                            <fieldset className="mt-4">
                                <legend className="compra__etiqueta">Cómo lo recibes</legend>
                                <label className={`entrega${entrega === 'retiro' ? ' entrega--activa' : ''}`}>
                                    <span className="entrega__icono"><IconoTienda /></span>
                                    <span className="entrega__texto">
                                        <strong>Retiro en tienda</strong>
                                        <span>Av. Balmaceda 1200 · listo el mismo día</span>
                                    </span>
                                    <span className="entrega__precio">Gratis</span>
                                    <input type="radio" name="entrega" value="retiro" className="form-check-input m-0"
                                        checked={entrega === 'retiro'} onChange={handleEntrega} />
                                </label>
                                <label className={`entrega${entrega === 'despacho' ? ' entrega--activa' : ''}`}>
                                    <span className="entrega__icono"><IconoCamion /></span>
                                    <span className="entrega__texto">
                                        <strong>Despacho a domicilio</strong>
                                        <span>Hasta 12 km de la tienda · 24 a 48 horas</span>
                                    </span>
                                    <span className="entrega__precio">{despachoGratis ? 'Gratis' : formatoPeso(COSTO_DESPACHO)}</span>
                                    <input type="radio" name="entrega" value="despacho" className="form-check-input m-0"
                                        checked={entrega === 'despacho'} onChange={handleEntrega} />
                                </label>
                                <p className="small text-body-secondary mb-0">
                                    El despacho es gratis en compras sobre $150.000.
                                </p>
                            </fieldset>
                        </div>

                        {/* datos de entrega, pago y total */}
                        <aside className="col-lg-5 compra__lado compra__lado--gris">
                            <h2 className="compra__subtitulo">Entrega y pago</h2>
                            <p className="text-body-secondary small mb-4">Completa los datos para confirmar tu pedido.</p>

                            <form onSubmit={handleSubmit} noValidate>
                                {usuario && (
                                    <div className="mb-3">
                                        <p className="compra__etiqueta">Comprador</p>
                                        <p className="compra__dato">{usuario.nombre}{usuario.correo && <span> · {usuario.correo}</span>}</p>
                                    </div>
                                )}

                                {entrega === 'despacho' ? (
                                    <div className="mb-3">
                                        <label htmlFor="direccionEntrega" className="compra__etiqueta">Dirección de entrega</label>
                                        <BuscadorDireccion
                                            id="direccionEntrega"
                                            value={direccion}
                                            onChange={handleDireccion}
                                            onElegir={elegirDireccion}
                                            onBlur={revisar}
                                            className={`form-control form-control-lg${errorDireccion ? ' is-invalid' : revision?.estado === 'apta' ? ' is-valid' : ''}`}
                                            describedBy="revisionDireccion"
                                        />
                                        <div id="revisionDireccion" aria-live="polite">
                                            {errorDireccion ? (
                                                <div className="invalid-feedback d-block">{errorDireccion}</div>
                                            ) : revision ? (
                                                <div className={revision.estado === 'apta' ? 'valid-feedback d-block' : 'form-text'}>{mensajeRevision(revision)}</div>
                                            ) : (
                                                <div className="form-text">
                                                    Elige tu dirección de la lista o escríbela completa; revisamos si queda dentro de los {RADIO_DESPACHO_KM} km. Mira <Link to="/contacto">el mapa de cobertura</Link>.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <p className="compra__etiqueta">Retiras en</p>
                                        <p className="compra__dato">Av. Balmaceda 1200, La Serena<span> · Lun a Vie 8:30 a 19:00</span></p>
                                    </div>
                                )}

                                {/* solo el contratista puede comprar a plazo */}
                                {usuario?.rol === 'contratista' && (
                                    <div className="form-check compra__dato mb-3">
                                        <input type="checkbox" id="usarCC" name="cuentaCorriente" className="form-check-input ms-0 me-2" checked={usarCC} onChange={(e) => setUsarCC(e.target.checked)} />
                                        <label htmlFor="usarCC" className="form-check-label">Pagar con mi crédito a 30 días</label>
                                    </div>
                                )}

                                <dl className="totales">
                                    <div><dt>Subtotal</dt><dd>{formatoPeso(subtotal)}</dd></div>
                                    <div><dt>Despacho</dt><dd>{despacho === 0 ? 'Gratis' : formatoPeso(despacho)}</dd></div>
                                    <div className="text-body-secondary small"><dt>{items.length} productos</dt><dd>{totalUnidades} unidades</dd></div>
                                    <div className="totales__total"><dt>Total</dt><dd>{formatoPeso(total)}</dd></div>
                                </dl>

                                <button type="submit" className="btn btn-dark btn-lg w-100 compra__pagar">Confirmar pedido</button>
                            </form>

                            {aviso && (
                                <div className={`alert ${aviso.tipo === 'exito' ? 'alert-success' : 'alert-danger'} mt-3 mb-0`} role="alert">{aviso.texto}</div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Carrito;
