import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';
import { estadoStock } from '../utils/stock.js';

function TarjetaProducto({ producto }) {
    const { agregar } = useCarrito();
    const estado = estadoStock(producto.stock);

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
                <span className={`badge ${estado.clase} align-self-start`}>{estado.texto}</span>

                <div className="d-grid gap-2 mt-auto pt-3">
                    <Link to={`/producto/${producto.id}`} className="btn btn-outline-dark btn-sm">Ver detalle</Link>
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={producto.stock === 0}
                        onClick={() => agregar(producto.codigo)}
                    >
                        {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default TarjetaProducto;
