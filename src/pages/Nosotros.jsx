import { Link } from 'react-router-dom';
import MapaCobertura from '../components/MapaCobertura.jsx';

const servicios = [
    { titulo: 'Materiales de obra', texto: 'Cemento, arena, ladrillo, fierro y tableros con despacho el mismo día en La Serena y Coquimbo.', icono: <IconoLadrillo /> },
    { titulo: 'Herramientas de marca', texto: 'Bosch, Makita, DeWalt, Stanley y Bahco, con garantía directa del importador.', icono: <IconoLlave /> },
    { titulo: 'Cuenta corriente', texto: 'Los contratistas frecuentes compran durante el mes y pagan una sola vez a fin de mes.', icono: <IconoTarjeta /> },
];

const numeros = [
    { label: 'Años atendiendo', valor: '22' },
    { label: 'Referencias en catálogo', valor: '832' },
    { label: 'Radio de despacho', valor: '12 km' },
    { label: 'Personas en el equipo', valor: '4' },
];

// el dueño, su hijo y los dos empleados de planta
const equipo = [
    { nombre: 'Jorge Maestre', cargo: 'Dueño y fundador', foto: 'assets/equipo_jorge.webp' },
    { nombre: 'Matías Maestre', cargo: 'Ventas y contratistas', foto: 'assets/equipo_matias.webp' },
    { nombre: 'Rosa Tapia', cargo: 'Caja y despacho', foto: 'assets/equipo_rosa.webp' },
    { nombre: 'Luis Araya', cargo: 'Bodega', foto: 'assets/equipo_luis.webp' },
];

function IconoLadrillo() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 5h20v14H2zM2 12h20M8 5v7M16 5v7M12 12v7" />
        </svg>
    );
}

function IconoLlave() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.3-6.3M14.7 6.3 9 12l-6-6 3-3 6 6" />
        </svg>
    );
}

function IconoTarjeta() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
        </svg>
    );
}

function Nosotros() {
    return (
        <>
            <section className="nosotros-hero">
                <div className="container">
                    <h1>Quiénes somos</h1>
                    <p className="mb-0">Un negocio familiar de La Serena que lleva 22 años atendiendo obras.</p>
                </div>
            </section>

            <section className="py-5 py-lg-6 bg-white">
                <div className="container">
                    <div className="row g-4 g-lg-5 align-items-end mb-5">
                        <div className="col-lg-5">
                            <p className="ceja">La ferretería</p>
                            <h2 className="seccion-titulo mb-0">
                                <span className="text-naranja">Ferretería de oficio</span> desde 2004
                            </h2>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <p className="mb-0">Abrimos en Av. Balmaceda con un mesón, una bodega chica y la idea de tener siempre el material que el maestro necesita el mismo día que lo pide.</p>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <p className="mb-0">Hoy el catálogo pasó de unas 100 referencias a más de 800, entre obra gruesa, herramientas, gasfitería y electricidad.</p>
                        </div>
                    </div>

                    <div className="row g-4">
                        {servicios.map((s) => (
                            <article className="col-md-4" key={s.titulo}>
                                <div className="servicio">
                                    <span className="servicio__icono">{s.icono}</span>
                                    <div>
                                        <h3 className="servicio__titulo">{s.titulo}</h3>
                                        <p className="mb-0 small">{s.texto}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="row g-4 align-items-stretch mt-4 mt-lg-5">
                        <div className="col-lg-8">
                            <MapaCobertura />
                        </div>
                        <div className="col-lg-4">
                            <div className="nosotros-numeros">
                                <p className="ceja ceja--clara">Números de la ferretería</p>
                                <dl className="row g-3 mb-0">
                                    {numeros.map((n) => (
                                        <div className="col-6" key={n.label}>
                                            <dt className="fw-normal text-white-50 small">{n.label}</dt>
                                            <dd className="nosotros-numeros__valor">{n.valor}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <p className="small mb-0 mt-4">Despachamos a 12 km a la redonda desde Av. Balmaceda 1200.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-gris">
                <div className="container">
                    <div className="text-center mx-auto mb-5" style={{ maxWidth: 560 }}>
                        <p className="ceja justify-content-center">Nuestro equipo</p>
                        <h2 className="seccion-titulo">Las personas del <span className="text-naranja">mesón</span></h2>
                        <p className="text-body-secondary mb-0">
                            Cuatro personas que conocen cada pasillo de la bodega. Si no está en el
                            catálogo, pregúntanos: probablemente lo conseguimos.
                        </p>
                    </div>
                    <ul className="row row-cols-2 row-cols-lg-4 g-4 list-unstyled mb-0">
                        {equipo.map((persona) => (
                            <li className="col" key={persona.nombre}>
                                <div className="persona">
                                    <img className="persona__foto" src={import.meta.env.BASE_URL + persona.foto} alt={`Retrato de ${persona.nombre}`} loading="lazy" />
                                    <div className="persona__placa">
                                        <h3 className="persona__nombre">{persona.nombre}</h3>
                                        <p className="persona__cargo">{persona.cargo}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-8">
                            <h2 className="seccion-titulo mb-2">¿Necesitas material para tu próxima obra?</h2>
                            <p className="text-body-secondary mb-0">Revisa el catálogo o escríbenos y te cotizamos.</p>
                        </div>
                        <div className="col-lg-4 d-flex flex-wrap align-items-center gap-4 justify-content-lg-end">
                            <Link to="/catalogo" className="btn btn-dark btn-mayus">Ver catálogo</Link>
                            <Link to="/contacto" className="link-flecha">Contactar</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Nosotros;
