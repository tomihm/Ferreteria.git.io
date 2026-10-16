import { Link } from 'react-router-dom';

const servicios = [
    { titulo: 'Materiales de obra', texto: 'Cemento, arena, ladrillo, fierro y tableros con despacho el mismo día en La Serena y Coquimbo.' },
    { titulo: 'Herramientas de marca', texto: 'Bosch, Makita, DeWalt, Stanley y Bahco, con garantía directa del importador.' },
    { titulo: 'Cuenta corriente', texto: 'Los contratistas frecuentes compran durante el mes y pagan una sola vez a fin de mes.' },
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
                <div className="container">
                    <h1>Quiénes somos</h1>
                    <p className="mb-0">Un negocio familiar de La Serena que lleva 22 años atendiendo obras.</p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4 g-lg-5">
                        <article className="col-lg-6">
                            <h2 className="h3 mb-3">La ferretería</h2>
                            <p>Abrimos en 2004 en Av. Balmaceda con un mesón, una bodega chica y la idea de tener siempre el material que el maestro necesita el mismo día que lo pide.</p>
                            <p>Hoy somos cuatro personas: el dueño, su hijo y dos empleados de planta. El catálogo pasó de unas 100 referencias a más de 800, entre materiales de construcción, herramientas eléctricas y manuales, gasfitería, electricidad y ferretería general.</p>
                            <p className="mb-0">Atendemos a dos tipos de cliente. El particular que llega a arreglar algo en la casa, y el contratista que compra por volumen y necesita saber si hay stock antes de mover la camioneta. Esta plataforma nació justamente para ese segundo caso.</p>
                        </article>

                        <article className="col-lg-6">
                            <h2 className="h3 mb-3">En qué estamos trabajando</h2>
                            <p>Durante años el inventario vivió en una planilla Excel que se actualizaba al final del día, y las cuentas corrientes en un cuaderno. Eso funcionaba cuando éramos más chicos.</p>
                            <p className="mb-0">Con 30 a 50 llamadas diarias solo para consultar stock, el teléfono dejó de dar abasto. Este sitio resuelve eso: el stock se ve en línea, el pedido queda registrado y la cuenta corriente se lleva sola.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-dark text-light">
                <div className="container">
                    <h2 className="h3 mb-4">Números de la ferretería</h2>
                    <dl className="row g-4 mb-0">
                        {numeros.map((n) => (
                            <div className="col-6 col-lg-3" key={n.label}>
                                <dt className="fw-normal text-white-50 small">{n.label}</dt>
                                <dd className="display-6 fw-bold text-primary mb-0">{n.valor}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <h2 className="h3 mb-4">Cómo trabajamos</h2>
                    <div className="row g-4">
                        {servicios.map((s) => (
                            <article className="col-md-4" key={s.titulo}>
                                <h3 className="h5">{s.titulo}</h3>
                                <p className="mb-0">{s.texto}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5 bg-white">
                <div className="container">
                    <h2 className="h3">¿Necesitas material para tu próxima obra?</h2>
                    <p className="text-body-secondary">Revisa el catálogo o escríbenos y te cotizamos.</p>
                    <div className="d-flex flex-wrap gap-2">
                        <Link to="/catalogo" className="btn btn-primary">Ver catálogo</Link>
                        <Link to="/contacto" className="btn btn-outline-dark">Contactar</Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Nosotros;
