import { useState } from 'react';
import { Link } from 'react-router-dom';
import Validar from '../utils/validaciones.js';
import { useCarrito } from '../context/CarritoContext.jsx';

const DESPACHO_GRATIS_DESDE = 150000;
const COSTO_DESPACHO = 6990;

const formatoPeso = (valor) => `$${valor.toLocaleString('es-CL')}`;

function Carrito() {
    const { items, cambiarCantidad, quitar, vaciar, totalUnidades } = useCarrito();
    const [entrega, setEntrega] = useState('retiro');
    const [direccion, setDireccion] = useState('');
    const [usarCC, setUsarCC] = useState(false);
    const [errorDireccion, setErrorDireccion] = useState(null);
    const [aviso, setAviso] = useState(null);

    // mientras se escribe la cantidad puede quedar vacía, se cuenta como 0
    const subtotal = items.reduce((total, item) => total + item.precio * (Number(item.cantidad) || 0), 0);
    const despacho = entrega === 'retiro' || subtotal >= DESPACHO_GRATIS_DESDE ? 0 : COSTO_DESPACHO;
    const total = subtotal + despacho;

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
                <div className="container">
                    <h1>Tu carrito</h1>
                    <p className="mb-0">Revisa las cantidades antes de confirmar el pedido.</p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4 align-items-start">
                        <div className="col-lg-8">
                            {items.length === 0 ? (
                                <div className="alert alert-info">
                                    Tu carrito está vacío.
                                </div>
                            ) : (
                                <div className="table-responsive bg-white rounded">
                                    <table className="table align-middle mb-0">
                                        <thead className="table-dark">
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
                                                        <strong>{item.nombre}</strong><br />
                                                        <small className="text-body-secondary">{item.codigo} · {item.marca}</small>
                                                    </td>
                                                    <td>{formatoPeso(item.precio)}</td>
                                                    <td>
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
                                                    </td>
                                                    <td><strong>{formatoPeso(item.precio * item.cantidad)}</strong></td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => quitar(item.codigo)}
                                                            aria-label={`Quitar ${item.nombre}`}
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

                            <div className="d-flex flex-wrap justify-content-between gap-2 mt-3">
                                <Link to="/catalogo" className="btn btn-dark">Seguir comprando</Link>
                                <button type="button" className="btn btn-outline-danger" onClick={handleVaciar} disabled={items.length === 0}>
                                    Vaciar carrito
                                </button>
                            </div>
                        </div>

                        <aside className="col-lg-4">
                            <div className="card card-body resumen">
                                <h2 className="h5 mb-3">Resumen del pedido</h2>

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="tipoEntrega" className="form-label">Cómo lo recibes</label>
                                        <select id="tipoEntrega" name="entrega" className="form-select" value={entrega} onChange={handleEntrega}>
                                            <option value="retiro">Retiro en tienda (gratis)</option>
                                            <option value="despacho">Despacho a domicilio</option>
                                        </select>
                                    </div>

                                    {entrega === 'despacho' && (
                                        <div className="mb-3">
                                            <label htmlFor="direccionEntrega" className="form-label">Dirección de entrega</label>
                                            <input
                                                type="text"
                                                id="direccionEntrega"
                                                name="direccion"
                                                value={direccion}
                                                onChange={(e) => setDireccion(e.target.value)}
                                                className={errorDireccion ? 'form-control is-invalid' : 'form-control'}
                                                placeholder="Calle, número, comuna"
                                                autoComplete="street-address"
                                            />
                                            <div className="invalid-feedback">{errorDireccion}</div>
                                            <div className="form-text">
                                                Cubrimos 12 km alrededor de la tienda; revísalo en <Link to="/contacto">el mapa</Link>.
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-check mb-3">
                                        <input type="checkbox" id="usarCC" name="cuentaCorriente" className="form-check-input" checked={usarCC} onChange={(e) => setUsarCC(e.target.checked)} />
                                        <label htmlFor="usarCC" className="form-check-label">Cargar a mi cuenta corriente</label>
                                    </div>

                                    <div className="d-flex justify-content-between py-1"><span>Subtotal</span><span>{formatoPeso(subtotal)}</span></div>
                                    <div className="d-flex justify-content-between py-1"><span>Despacho</span><span>{despacho === 0 ? 'Gratis' : formatoPeso(despacho)}</span></div>
                                    <div className="d-flex justify-content-between py-1 text-body-secondary small">
                                        <span>{items.length} productos</span><span>{totalUnidades} unidades</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top mt-2 pt-2 fs-5 fw-bold"><span>Total</span><span>{formatoPeso(total)}</span></div>

                                    <button type="submit" className="btn btn-primary w-100 mt-3">Confirmar pedido</button>
                                </form>

                                {aviso && (
                                    <div className={`alert ${aviso.tipo === 'exito' ? 'alert-success' : 'alert-danger'} mt-3 mb-0`} role="alert">{aviso.texto}</div>
                                )}

                                <p className="small text-body-secondary mt-3 mb-0">
                                    El despacho es gratis en compras sobre $150.000. Bajo ese monto tiene un costo de $6.990.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Carrito;
