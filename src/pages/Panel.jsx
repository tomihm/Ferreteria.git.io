import { useEffect, useState } from 'react';
import { cargarPanel } from '../mocks/panelMocks.js';

function estadoInventario(item) {
    if (item.stock === 0) return { texto: 'Sin stock', clase: 'text-bg-danger' };
    if (item.stock <= item.minimo) return { texto: 'Stock bajo', clase: 'text-bg-warning' };
    return { texto: 'Disponible', clase: 'text-bg-success' };
}

function Panel() {
    const [datos, setDatos] = useState(null);
    const [inventario, setInventario] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [aviso, setAviso] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let activo = true;
        cargarPanel()
            .then((datosCargados) => {
                if (!activo) return;
                setDatos(datosCargados);
                setInventario(datosCargados.inventario);
                setPedidos(datosCargados.pedidos);
                setUsuarios(datosCargados.usuarios);
            })
            .catch(() => {
                if (activo) setError(true);
            });
        return () => {
            activo = false;
        };
    }, []);

    const resumen = datos?.resumen ?? [];
    const estadosPedido = datos?.estadosPedido ?? [];
    const roles = datos?.roles ?? [];
    const masVendidos = datos?.masVendidos ?? [];
    const clientesFrecuentes = datos?.clientesFrecuentes ?? [];
    const porCobrar = datos?.porCobrar ?? [];

    const reposicion = inventario.filter((item) => item.stock <= item.minimo);

    const cambiarStock = (codigo, valor) => {
        setInventario(inventario.map((it) =>
            it.codigo === codigo ? { ...it, stock: Math.max(0, Number(valor)) } : it
        ));
    };

    const guardarStock = (item) => {
        setAviso(`Stock de "${item.producto}" actualizado a ${item.stock} unidades.`);
    };

    const cambiarEstadoPedido = (numero, estado) => {
        setPedidos(pedidos.map((p) => (p.numero === numero ? { ...p, estado } : p)));
    };

    const cambiarRol = (rut, rol) => {
        setUsuarios(usuarios.map((u) => (u.rut === rut ? { ...u, rol } : u)));
    };

    const inventarioFiltrado = inventario.filter((it) => {
        const texto = busqueda.trim().toLowerCase();
        return texto === '' ||
            it.producto.toLowerCase().includes(texto) ||
            it.codigo.toLowerCase().includes(texto);
    });

    const pedidosFiltrados = filtroEstado === ''
        ? pedidos
        : pedidos.filter((p) => p.estado === filtroEstado);

    return (
        <>
            <section className="pagina-titulo">
                <div className="container">
                    <h1>Panel de gestión</h1>
                    <p className="mb-0">Carlos Muñoz · Administrador</p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4 align-items-start">

                        <nav className="col-lg-3 panel-menu" aria-label="Secciones del panel">
                            <div className="list-group">
                                <a href="#resumen" className="list-group-item list-group-item-action">Resumen</a>
                                <a href="#inventario" className="list-group-item list-group-item-action">Inventario</a>
                                <a href="#pedidos" className="list-group-item list-group-item-action">Pedidos</a>
                                <a href="#usuarios" className="list-group-item list-group-item-action">Usuarios</a>
                                <a href="#reportes" className="list-group-item list-group-item-action">Reportes</a>
                            </div>
                        </nav>

                        <div className="col-lg-9">

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    No se pudieron cargar los datos del panel. Recarga la página para intentar de nuevo.
                                </div>
                            )}

                            {!datos && !error && (
                                <p className="text-body-secondary" role="status">
                                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                    Cargando datos del panel...
                                </p>
                            )}

                            {datos && (
                            <>
                                {/* ============ RESUMEN ============ */}
                                <section className="mb-5 ancla" id="resumen">
                                    <h2 className="h3 mb-3">Resumen</h2>
                                    <div className="row row-cols-2 row-cols-xl-4 g-3 mb-4">
                                        {resumen.map((k) => (
                                            <div className="col" key={k.label}>
                                                <div className="card card-body h-100">
                                                    <p className="small text-body-secondary mb-1">{k.label}</p>
                                                    <p className="fs-4 fw-bold mb-0">{k.valor}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="alert alert-warning">
                                        {reposicion.length} productos alcanzaron el punto de reposición y necesitan pedido a proveedor.
                                    </div>

                                    <div className="table-responsive bg-white rounded">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Producto</th>
                                                    <th>Stock actual</th>
                                                    <th>Mínimo</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reposicion.map((r) => (
                                                    <tr key={r.codigo}>
                                                        <td>{r.codigo}</td>
                                                        <td>{r.producto}</td>
                                                        <td><strong>{r.stock}</strong></td>
                                                        <td>{r.minimo}</td>
                                                        <td>
                                                            <span className={`badge ${estadoInventario(r).clase}`}>
                                                                {r.stock === 0 ? 'Sin stock' : 'Reponer'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* ============ INVENTARIO ============ */}
                                <section className="mb-5 ancla" id="inventario">
                                    <h2 className="h3 mb-3">Inventario</h2>

                                    {aviso && <div className="alert alert-success" role="status">{aviso}</div>}

                                    <div className="mb-3">
                                        <label htmlFor="buscarInventario" className="form-label">Buscar producto</label>
                                        <input
                                            type="search"
                                            id="buscarInventario"
                                            name="buscar"
                                            className="form-control"
                                            placeholder="Nombre o código"
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                        />
                                    </div>

                                    <div className="table-responsive bg-white rounded">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Producto</th>
                                                    <th>Precio</th>
                                                    <th>Stock</th>
                                                    <th>Mínimo</th>
                                                    <th>Estado</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventarioFiltrado.map((it) => {
                                                    const estado = estadoInventario(it);
                                                    return (
                                                        <tr key={it.codigo}>
                                                            <td>{it.codigo}</td>
                                                            <td>{it.producto}</td>
                                                            <td>{it.precio}</td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm cantidad"
                                                                    value={it.stock}
                                                                    min="0"
                                                                    aria-label={`Stock ${it.producto}`}
                                                                    onChange={(e) => cambiarStock(it.codigo, e.target.value)}
                                                                />
                                                            </td>
                                                            <td>{it.minimo}</td>
                                                            <td><span className={`badge ${estado.clase}`}>{estado.texto}</span></td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => guardarStock(it)}
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* ============ PEDIDOS ============ */}
                                <section className="mb-5 ancla" id="pedidos">
                                    <h2 className="h3 mb-3">Pedidos</h2>

                                    <div className="mb-3">
                                        <label htmlFor="filtroEstado" className="form-label">Filtrar por estado</label>
                                        <select
                                            id="filtroEstado"
                                            className="form-select"
                                            name="estado"
                                            value={filtroEstado}
                                            onChange={(e) => setFiltroEstado(e.target.value)}
                                        >
                                            <option value="">Todos los estados</option>
                                            {estadosPedido.map((e) => (
                                                <option key={e}>{e}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="table-responsive bg-white rounded">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>N°</th>
                                                    <th>Cliente</th>
                                                    <th>Fecha</th>
                                                    <th>Entrega</th>
                                                    <th>Total</th>
                                                    <th>Pago</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedidosFiltrados.map((p) => (
                                                    <tr key={p.numero}>
                                                        <td>{p.numero}</td>
                                                        <td>{p.cliente}</td>
                                                        <td>{p.fecha}</td>
                                                        <td>{p.entrega}</td>
                                                        <td><strong>{p.total}</strong></td>
                                                        <td>{p.pago}</td>
                                                        <td>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                aria-label={`Estado del pedido ${p.numero}`}
                                                                value={p.estado}
                                                                onChange={(e) => cambiarEstadoPedido(p.numero, e.target.value)}
                                                            >
                                                                {estadosPedido.map((e) => (
                                                                    <option key={e}>{e}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* ============ USUARIOS ============ */}
                                <section className="mb-5 ancla" id="usuarios">
                                    <h2 className="h3 mb-3">Usuarios</h2>
                                    <p className="text-body-secondary">
                                        Cambia el rol de cada usuario desde la tabla.
                                    </p>

                                    <div className="table-responsive bg-white rounded">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>RUT</th>
                                                    <th>Usuario</th>
                                                    <th>Rol</th>
                                                    <th>Cuenta corriente</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usuarios.map((u) => (
                                                    <tr key={u.rut}>
                                                        <td>{u.rut}</td>
                                                        <td>
                                                            {u.nombre}
                                                            <br />
                                                            <small className="text-body-secondary">{u.email}</small>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                aria-label={`Rol de ${u.nombre}`}
                                                                value={u.rol}
                                                                onChange={(e) => cambiarRol(u.rut, e.target.value)}
                                                            >
                                                                {roles.map((r) => (
                                                                    <option key={r}>{r}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <span className={u.cuenta ? 'badge text-bg-info' : 'badge text-bg-light border'}>
                                                                {u.cuenta ?? 'No tiene'}
                                                            </span>
                                                        </td>
                                                        <td><span className="badge text-bg-success">Activa</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* ============ REPORTES ============ */}
                                <section className="mb-5 ancla" id="reportes">
                                    <h2 className="h3 mb-3">Reportes</h2>

                                    <h3 className="h5 mt-4">Productos más vendidos</h3>
                                    <div className="table-responsive bg-white rounded mb-3">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-dark">
                                                <tr><th>#</th><th>Producto</th><th>Unidades vendidas</th><th>Monto</th></tr>
                                            </thead>
                                            <tbody>
                                                {masVendidos.map((m) => (
                                                    <tr key={m.puesto}>
                                                        <td>{m.puesto}</td>
                                                        <td>{m.producto}</td>
                                                        <td><strong>{m.unidades}</strong></td>
                                                        <td>{m.monto}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <h3 className="h5 mt-4">Clientes más frecuentes</h3>
                                    <div className="table-responsive bg-white rounded mb-3">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-dark">
                                                <tr><th>#</th><th>Cliente</th><th>Pedidos</th><th>Monto total</th></tr>
                                            </thead>
                                            <tbody>
                                                {clientesFrecuentes.map((c) => (
                                                    <tr key={c.puesto}>
                                                        <td>{c.puesto}</td>
                                                        <td>{c.cliente}</td>
                                                        <td>{c.pedidos}</td>
                                                        <td>{c.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <h3 className="h5 mt-4">Cuentas corrientes por cobrar</h3>
                                    <div className="table-responsive bg-white rounded">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-dark">
                                                <tr><th>RUT</th><th>Cliente</th><th>Teléfono</th><th>Saldo</th></tr>
                                            </thead>
                                            <tbody>
                                                {porCobrar.map((c) => (
                                                    <tr key={c.rut}>
                                                        <td>{c.rut}</td>
                                                        <td>{c.cliente}</td>
                                                        <td>{c.telefono}</td>
                                                        <td><strong>{c.saldo}</strong></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Panel;
