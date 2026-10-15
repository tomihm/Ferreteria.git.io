import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Validar from '../utils/validaciones.js';
import { cargarCarrito } from '../mocks/carritoMocks.js';

const DESPACHO_GRATIS_DESDE = 150000;
const COSTO_DESPACHO = 6990;

const formatoPeso = (valor) => `$${valor.toLocaleString('es-CL')}`;

function Carrito() {
    const [items, setItems] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [entrega, setEntrega] = useState('retiro');
    const [direccion, setDireccion] = useState('');
    const [usarCC, setUsarCC] = useState(false);
    const [errorDireccion, setErrorDireccion] = useState(null);
    const [aviso, setAviso] = useState(null);

    useEffect(() => {
        let activo = true;
        cargarCarrito().then((itemsCargados) => {
            if (activo) {
                setItems(itemsCargados);
                setCargando(false);
            }
        });
        return () => {
            activo = false;
        };
    }, []);

    // mientras se escribe la cantidad puede quedar vacía, se cuenta como 0
    const subtotal = items.reduce((total, item) => total + item.precio * (Number(item.cantidad) || 0), 0);
    const unidades = items.reduce((total, item) => total + (Number(item.cantidad) || 0), 0);
    const despacho = entrega === 'retiro' || subtotal >= DESPACHO_GRATIS_DESDE ? 0 : COSTO_DESPACHO;
    const total = subtotal + despacho;

    const cambiarCantidad = (codigo, valor) => {
        setItems(items.map((item) => {
            if (item.codigo !== codigo) return item;
            if (valor === '') return { ...item, cantidad: '' };
            // la cantidad queda entre 1 y el stock disponible
            const cantidad = Math.min(Math.max(Number(valor), 1), item.stock);
            return { ...item, cantidad };
        }));
    };

    const corregirCantidad = (codigo) => {
        setItems(items.map((item) => (
            item.codigo === codigo && item.cantidad === '' ? { ...item, cantidad: 1 } : item
        )));
    };

    const quitar = (codigo) => {
        setItems(items.filter((item) => item.codigo !== codigo));
    };

    const vaciar = () => {
        setItems([]);
        setAviso(null);
    };

    const handleEntrega = (e) => {
        setEntrega(e.target.value);
        setErrorDireccion(null);
    };

    const handleSubmit = (e) => {
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
        }

        // TODO: conectar con el backend
        setAviso({ tipo: 'exito', texto: 'Pedido válido. La confirmación se conectará al backend en la siguiente etapa.' });
    };

    return (
        <>
            <section className="pagina-titulo">
                <div className="contenedor">
                    <h1>Tu carrito</h1>
                    <p>Revisa las cantidades antes de confirmar el pedido.</p>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">
                    {cargando ? (
                        <p>Cargando carrito...</p>
                    ) : (
                        <div className="carrito-layout">
                            <div>
                                {items.length === 0 ? (
                                    <div className="alerta alerta--info">Tu carrito está vacío.</div>
                                ) : (
                                    <div className="tabla-scroll">
                                        <table className="tabla">
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Precio</th>
                                                    <th>Cantidad</th>
                                                    <th>Subtotal</th>
                                                    <th>Quitar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item.codigo}>
                                                        <td>
                                                            <strong>{item.icono} {item.producto}</strong><br />
                                                            <small style={{ color: 'var(--gris-500)' }}>{item.codigo} · {item.unidad}</small>
                                                        </td>
                                                        <td>{formatoPeso(item.precio)}</td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                value={item.cantidad}
                                                                min="1"
                                                                max={item.stock}
                                                                onChange={(e) => cambiarCantidad(item.codigo, e.target.value)}
                                                                onBlur={() => corregirCantidad(item.codigo)}
                                                                aria-label={`Cantidad de ${item.producto}`}
                                                            />
                                                        </td>
                                                        <td><strong>{formatoPeso(item.precio * item.cantidad)}</strong></td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn--peligro btn--sm"
                                                                onClick={() => quitar(item.codigo)}
                                                                aria-label={`Quitar ${item.producto}`}
                                                            >
                                                                Quitar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="flex-entre mt-3">
                                    <Link to="/catalogo" className="btn btn--secundario">Seguir comprando</Link>
                                    <button type="button" className="btn btn--peligro" onClick={vaciar} disabled={items.length === 0}>
                                        Vaciar carrito
                                    </button>
                                </div>
                            </div>

                            <aside className="resumen">
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Resumen del pedido</h2>

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="campo">
                                        <label htmlFor="tipoEntrega">Cómo lo recibes</label>
                                        <select id="tipoEntrega" name="entrega" value={entrega} onChange={handleEntrega}>
                                            <option value="retiro">Retiro en tienda (gratis)</option>
                                            <option value="despacho">Despacho a domicilio</option>
                                        </select>
                                    </div>

                                    {entrega === 'despacho' && (
                                        <div className="campo">
                                            <label htmlFor="direccionEntrega">Dirección de entrega</label>
                                            <input
                                                type="text"
                                                id="direccionEntrega"
                                                name="direccion"
                                                value={direccion}
                                                onChange={(e) => setDireccion(e.target.value)}
                                                className={errorDireccion ? 'invalido' : ''}
                                                placeholder="Calle, número, comuna"
                                                autoComplete="street-address"
                                            />
                                            <p className={errorDireccion ? 'campo__error visible' : 'campo__error'}>{errorDireccion}</p>
                                            <p className="campo__ayuda">
                                                Cubrimos 12 km alrededor de la tienda; revísalo en <Link to="/contacto" style={{ color: 'var(--naranja)' }}>el mapa</Link>.
                                            </p>
                                        </div>
                                    )}

                                    <div className="campo campo--check">
                                        <input type="checkbox" id="usarCC" name="cuentaCorriente" checked={usarCC} onChange={(e) => setUsarCC(e.target.checked)} />
                                        <label htmlFor="usarCC">Cargar a mi cuenta corriente</label>
                                    </div>

                                    <div className="resumen__linea"><span>Subtotal</span><span>{formatoPeso(subtotal)}</span></div>
                                    <div className="resumen__linea"><span>Despacho</span><span>{despacho === 0 ? 'Gratis' : formatoPeso(despacho)}</span></div>
                                    <div className="resumen__linea" style={{ color: 'var(--gris-500)' }}>
                                        <span>{items.length} productos</span><span>{unidades} unidades</span>
                                    </div>
                                    <div className="resumen__total"><span>Total</span><span>{formatoPeso(total)}</span></div>

                                    <button type="submit" className="btn btn--primario btn--bloque mt-3">Confirmar pedido</button>
                                </form>

                                {aviso && (
                                    <div className={`alerta alerta--${aviso.tipo} mt-3`} role="alert">{aviso.texto}</div>
                                )}

                                <div className="alerta alerta--info mt-3" style={{ fontSize: '.85rem' }}>
                                    El despacho es gratis en compras sobre $150.000. Bajo ese monto tiene un costo de $6.990.
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default Carrito;
