import { useEffect, useState } from 'react';
import { cargarPanel } from '../mocks/panelMocks.js';

function estadoInventario(item) {
    if (item.stock === 0) return { texto: 'Sin stock', clase: 'badge--agotado' };
    if (item.stock <= item.minimo) return { texto: 'Stock bajo', clase: 'badge--bajo' };
    return { texto: 'Disponible', clase: 'badge--stock' };
}

function Panel() {
    const [datos, setDatos] = useState(null);
    const [inventario, setInventario] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [aviso, setAviso] = useState(null);

    useEffect(() => {
        let activo = true;
        cargarPanel().then((datosCargados) => {
            if (!activo) return;
            setDatos(datosCargados);
            setInventario(datosCargados.inventario);
            setPedidos(datosCargados.pedidos);
            setUsuarios(datosCargados.usuarios);
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
                <div className="contenedor">
                    <h1>Panel de gestión</h1>
                    <p>Carlos Muñoz · Administrador</p>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">
                    <div className="admin">

                        <nav className="admin__menu" aria-label="Secciones del panel">
                            <a href="#resumen">Resumen</a>
                            <a href="#inventario">Inventario</a>
                            <a href="#pedidos">Pedidos</a>
                            <a href="#usuarios">Usuarios</a>
                            <a href="#reportes">Reportes</a>
                        </nav>

                        <div>

                            {/* ============ RESUMEN ============ */}
                            <section className="bloque-admin" id="resumen">
                                <h2>Resumen</h2>
                                <div className="kpi-grid">
                                    {resumen.map((k) => (
                                        <div className="kpi" key={k.label}>
                                            <p className="kpi__label">{k.label}</p>
                                            <p className="kpi__valor">{k.valor}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="alerta alerta--warning">
                                    {reposicion.length} productos alcanzaron el punto de reposición y necesitan pedido a proveedor.
                                </div>

                                <div className="tabla-scroll">
                                    <table className="tabla">
                                        <thead>
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
                            <section className="bloque-admin" id="inventario">
                                <h2>Inventario</h2>

                                {aviso && <div className="alerta alerta--exito">{aviso}</div>}

                                <div className="campo mb-3">
                                    <label htmlFor="buscarInventario">Buscar producto</label>
                                    <input
                                        type="search"
                                        id="buscarInventario"
                                        name="buscar"
                                        placeholder="Nombre o código"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                </div>

                                <div className="tabla-scroll">
                                    <table className="tabla">
                                        <thead>
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
                                                                className="btn btn--primario btn--sm"
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
                            <section className="bloque-admin" id="pedidos">
                                <h2>Pedidos</h2>

                                <div className="campo mb-3">
                                    <label htmlFor="filtroEstado">Filtrar por estado</label>
                                    <select
                                        id="filtroEstado"
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

                                <div className="tabla-scroll">
                                    <table className="tabla">
                                        <thead>
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
                            <section className="bloque-admin" id="usuarios">
                                <h2>Usuarios</h2>
                                <p style={{ color: 'var(--gris-500)', marginBottom: '16px' }}>
                                    Cambia roles, habilita cuenta corriente o desactiva cuentas.
                                </p>

                                <div className="tabla-scroll">
                                    <table className="tabla">
                                        <thead>
                                            <tr>
                                                <th>RUT</th>
                                                <th>Usuario</th>
                                                <th>Rol</th>
                                                <th>Cuenta corriente</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuarios.map((u) => (
                                                <tr key={u.rut}>
                                                    <td>{u.rut}</td>
                                                    <td>
                                                        {u.nombre}
                                                        <br />
                                                        <small style={{ color: 'var(--gris-500)' }}>{u.email}</small>
                                                    </td>
                                                    <td>
                                                        <select
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
                                                        <span className={u.cuenta ? 'badge badge--info' : 'badge badge--neutro'}>
                                                            {u.cuenta ?? 'No tiene'}
                                                        </span>
                                                    </td>
                                                    <td><span className="badge badge--stock">Activa</span></td>
                                                    <td>
                                                        <button type="button" className="btn btn--borde btn--sm">Editar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* ============ REPORTES ============ */}
                            <section className="bloque-admin" id="reportes">
                                <h2>Reportes</h2>

                                <h3 style={{ margin: '18px 0 10px' }}>Productos más vendidos</h3>
                                <div className="tabla-scroll mb-3">
                                    <table className="tabla">
                                        <thead>
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

                                <h3 style={{ margin: '26px 0 10px' }}>Clientes más frecuentes</h3>
                                <div className="tabla-scroll mb-3">
                                    <table className="tabla">
                                        <thead>
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

                                <h3 style={{ margin: '26px 0 10px' }}>Cuentas corrientes por cobrar</h3>
                                <div className="tabla-scroll">
                                    <table className="tabla">
                                        <thead>
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

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Panel;
