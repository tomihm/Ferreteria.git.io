import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';

function TarjetaProducto({ producto }) {
    const { items, agregar, cambiarCantidad, quitar } = useCarrito();
    const cantidad = Number(items.find((item) => item.codigo === producto.codigo)?.cantidad) || 0;

    // con la ultima unidad, el - saca el producto del carrito
    const quitarUno = () => {
        if (cantidad <= 1) quitar(producto.codigo);
        else cambiarCantidad(producto.codigo, cantidad - 1);
    };

    return (
        <article className="card h-100 producto">
            <div className="producto__foto">
                {producto.imagen
                    ? <img src={import.meta.env.BASE_URL + producto.imagen} alt={producto.nombre} />
                    : <span aria-hidden="true">{producto.icono}</span>}
            </div>
            <div className="card-body d-flex flex-column">
                <p className="small text-body-secondary mb-1">{producto.codigo}</p>
                <h3 className="h6 mb-1">{producto.nombre}</h3>
                <p className="small text-body-secondary mb-2">{producto.marca}</p>
                <p className="fs-5 fw-bold mb-2">${producto.precio.toLocaleString('es-CL')}</p>

                <div className="d-grid gap-2 mt-auto pt-3">
                    <Link to={`/producto/${producto.id}`} className="btn btn-outline-dark btn-sm">Ver detalle</Link>
                    {cantidad > 0 ? (
                        <div className="btn-group contador" role="group" aria-label={`Cantidad de ${producto.nombre} en el carrito`}>
                            <button type="button" className="btn btn-primary" aria-label="Quitar uno" onClick={quitarUno}>−</button>
                            <span className="contador__cantidad" aria-live="polite">{cantidad}</span>
                            <button
                                type="button"
                                className="btn btn-primary"
                                aria-label="Agregar uno"
                                disabled={cantidad >= producto.stock}
                                onClick={() => agregar(producto.codigo)}
                            >+</button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={producto.stock === 0}
                            onClick={() => agregar(producto.codigo)}
                        >
                            {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

export default TarjetaProducto;
