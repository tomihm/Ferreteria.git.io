import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cargarMisPedidos } from '../mocks/misPedidosMocks.js';

function MisPedidos() {
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let activo = true;
        cargarMisPedidos()
            .then((datosCargados) => {
                if (activo) setDatos(datosCargados);
            })
            .catch(() => {
                if (activo) setError(true);
            });
        return () => {
            activo = false;
        };
    }, []);

    const kpis = datos?.kpis ?? [];
    const movimientos = datos?.movimientos ?? [];
    const pedidos = datos?.pedidos ?? [];

    return (
        <>
            <section className="pagina-titulo">
                <div className="container">
                    <h1>Mis pedidos</h1>
                    <p className="mb-0">Juan Pérez · contratista@correo.cl</p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            No pudimos cargar tus pedidos. Recarga la página o llámanos al +56 51 221 4455.
                        </div>
                    )}

                    {!datos && !error && (
                        <p className="text-body-secondary" role="status">
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                            Cargando tus pedidos...
                        </p>
                    )}

                    {datos && (
                        <>
                            <h2 className="h4 mb-3">Cuenta corriente</h2>
                            <div className="row row-cols-2 row-cols-lg-4 g-3 mb-5">
                                {kpis.map((k) => (
                                    <div className="col" key={k.label}>
                                        <div className="card card-body h-100">
                                            <p className="small text-body-secondary mb-1">{k.label}</p>
                                            <p className="fs-5 fw-bold mb-0">{k.valor}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="h4 mb-3">Movimientos de cuenta corriente</h2>
                            <div className="table-responsive bg-white rounded mb-5">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Documento</th>
                                            <th>Detalle</th>
                                            <th>Cargo</th>
                                            <th>Abono</th>
                                            <th>Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimientos.map((m) => (
                                            <tr key={m.documento + m.fecha}>
                                                <td>{m.fecha}</td>
                                                <td>{m.documento}</td>
                                                <td>{m.detalle}</td>
                                                <td>{m.cargo}</td>
                                                <td>{m.abono}</td>
                                                <td>{m.saldo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="h4 mb-3">Historial de pedidos</h2>

                            {pedidos.length === 0 && (
                                <p>Todavía no tienes pedidos. Cuando compres, aparecerán aquí.</p>
                            )}

                            {pedidos.map((p) => (
                                <article className="card mb-4" key={p.numero}>
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                            <div>
                                                <h3 className="h5 mb-0">Pedido {p.numero}</h3>
                                                <p className="small text-body-secondary mb-0">
                                                    {p.fecha} · {p.entrega}
                                                </p>
                                            </div>
                                            <span className={`badge ${p.claseBadge}`}>{p.estado}</span>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-sm align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th>Cantidad</th>
                                                        <th>Precio</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {p.items.map((it) => (
                                                        <tr key={it.producto}>
                                                            <td>{it.producto}</td>
                                                            <td>{it.cantidad}</td>
                                                            <td>{it.precio}</td>
                                                            <td>{it.subtotal}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                            <span className="badge text-bg-light border">{p.pago}</span>
                                            <strong className="fs-5">Total: {p.total}</strong>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </>
                    )}

                    <Link to="/catalogo" className="btn btn-primary">Hacer un nuevo pedido</Link>

                </div>
            </section>
        </>
    );
}

export default MisPedidos;
