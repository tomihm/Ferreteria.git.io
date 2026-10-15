import { Link } from 'react-router-dom';

const servicios = [
    { icono: '🏗️', titulo: 'Materiales de obra', texto: 'Cemento, arena, ladrillo, fierro y tableros con despacho el mismo día en La Serena y Coquimbo.' },
    { icono: '🧰', titulo: 'Herramientas de marca', texto: 'Bosch, Makita, DeWalt, Stanley y Bahco, con garantía directa del importador.' },
    { icono: '🤝', titulo: 'Cuenta corriente', texto: 'Los contratistas frecuentes compran durante el mes y pagan una sola vez a fin de mes.' },
];

const numeros = [
    { label: 'Años atendiendo', valor: '22' },
    { label: 'Referencias en catálogo', valor: '832' },
    { label: 'Radio de despacho', valor: '12 km' },
    { label: 'Personas en el equipo', valor: '4' },
];

function Nosotros() {
    return (
        <>
            <section className="pagina-titulo">
                <div className="contenedor">
                    <h1>Quiénes somos</h1>
                    <p>Un negocio familiar de La Serena que lleva 22 años atendiendo obras.</p>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">
                    <div className="grid grid--2" style={{ alignItems: 'start' }}>
                        <article>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>La ferretería</h2>
                            <p style={{ marginBottom: '14px' }}>Abrimos en 2004 en Av. Balmaceda con un mesón, una bodega chica y la idea de tener siempre el material que el maestro necesita el mismo día que lo pide.</p>
                            <p style={{ marginBottom: '14px' }}>Hoy somos cuatro personas: el dueño, su hijo y dos empleados de planta. El catálogo pasó de unas 100 referencias a más de 800, entre materiales de construcción, herramientas eléctricas y manuales, gasfitería, electricidad y ferretería general.</p>
                            <p>Atendemos a dos tipos de cliente. El particular que llega a arreglar algo en la casa, y el contratista que compra por volumen y necesita saber si hay stock antes de mover la camioneta. Esta plataforma nació justamente para ese segundo caso.</p>
                        </article>

                        <article>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>En qué estamos trabajando</h2>
                            <p style={{ marginBottom: '14px' }}>Durante años el inventario vivió en una planilla Excel que se actualizaba al final del día, y las cuentas corrientes en un cuaderno. Eso funcionaba cuando éramos más chicos.</p>
                            <p>Con 30 a 50 llamadas diarias solo para consultar stock, el teléfono dejó de dar abasto. Este sitio resuelve eso: el stock se ve en línea, el pedido queda registrado y la cuenta corriente se lleva sola.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="seccion seccion--blanca">
                <div className="contenedor">
                    <h2 className="seccion__titulo">Cómo trabajamos</h2>
                    <div className="grid grid--3 mt-3">
                        {servicios.map((s) => (
                            <article className="categoria-card" key={s.titulo}>
                                <div className="icono">{s.icono}</div>
                                <h3>{s.titulo}</h3>
                                <p>{s.texto}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">
                    <h2 className="seccion__titulo">Consejos de obra</h2>
                    <p className="seccion__subtitulo">Cómo calcular el material que necesitas antes de comprar</p>
                    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                        <div className="video-responsive">
                            <iframe
                                src="https://www.youtube.com/embed/aqz-KE-bpKQ"
                                title="Video de consejos de construcción"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            <section className="seccion seccion--blanca">
                <div className="contenedor">
                    <h2 className="seccion__titulo">Números de la ferretería</h2>
                    <div className="kpi-grid mt-3">
                        {numeros.map((n) => (
                            <div className="kpi" key={n.label}>
                                <p className="kpi__label">{n.label}</p>
                                <p className="kpi__valor">{n.valor}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor texto-centro">
                    <h2 className="seccion__titulo">¿Necesitas material para tu próxima obra?</h2>
                    <p className="seccion__subtitulo">Revisa el catálogo o escríbenos y te cotizamos.</p>
                    <Link to="/catalogo" className="btn btn--primario">Ver catálogo</Link>{' '}
                    <Link to="/contacto" className="btn btn--borde">Contactar</Link>
                </div>
            </section>
        </>
    );
}

export default Nosotros;
