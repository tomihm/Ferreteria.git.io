import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cargarMisPedidos } from '../mocks/misPedidosMocks.js';

function MisPedidos() {
    const [datos, setDatos] = useState(null);

    useEffect(() => {
        let activo = true;
        cargarMisPedidos().then((datosCargados) => {
            if (activo) setDatos(datosCargados);
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
                <div className="contenedor">
                    <h1>Mis pedidos</h1>
                    <p>Juan Pérez · contratista@correo.cl</p>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">

                    <h2 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>Cuenta corriente</h2>
                    <div className="kpi-grid">
                        {kpis.map((k) => (
                            <div className="kpi" key={k.label}>
                                <p className="kpi__label">{k.label}</p>
                                <p className="kpi__valor" style={{ fontSize: '1.1rem' }}>{k.valor}</p>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '1.3rem', margin: '34px 0 14px' }}>Movimientos de cuenta corriente</h2>
                    <div className="tabla-scroll mb-3">
                        <table className="tabla">
                            <thead>
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

                    <h2 style={{ fontSize: '1.3rem', margin: '34px 0 14px' }}>Historial de pedidos</h2>

                    {pedidos.map((p) => (
                        <article className="tarjeta mb-3" key={p.numero}>
                            <div className="tarjeta__cuerpo">
                                <div className="flex-entre mb-2">
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>Pedido {p.numero}</h3>
                                        <p style={{ fontSize: '.85rem', color: 'var(--gris-500)' }}>
                                            {p.fecha} · {p.entrega}
                                        </p>
                                    </div>
                                    <span className={`badge ${p.claseBadge}`}>{p.estado}</span>
                                </div>
                                <div className="tabla-scroll">
                                    <table className="tabla" style={{ minWidth: '420px' }}>
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
                                <div className="flex-entre mt-2">
                                    <span className="badge badge--neutro">{p.pago}</span>
                                    <strong style={{ fontSize: '1.15rem' }}>Total: {p.total}</strong>
                                </div>
                            </div>
                        </article>
                    ))}

                    <div className="texto-centro mt-3">
                        <Link to="/catalogo" className="btn btn--primario">Hacer un nuevo pedido</Link>
                    </div>

                </div>
            </section>
        </>
    );
}

export default MisPedidos;
