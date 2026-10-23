import { useParams } from 'react-router-dom';
import { catalogo } from '../products/catalogo.js';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';
import { estadoStock } from '../utils/stock.js';

const nombresCategoria = {
    construccion: 'Materiales de Construcción',
    herramientas: 'Herramientas Eléctricas',
    manuales: 'Herramientas Manuales',
    gasfiteria: 'Gasfitería',
    electricidad: 'Electricidad',
    general: 'Ferretería General',
};

function ProductoDetalle() {

    const { id } = useParams();
    const { agregar } = useCarrito();

    const producto = catalogo.find((p) => p.id === id);

    const handleSubmit = (e) => {
        e.preventDefault();
        agregar(producto.codigo, Number(e.target.elements.cantidad.value) || 1);
    };

    if (!producto) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1 className="h3">Producto no encontrado</h1>
                    <p>El producto que estás buscando no existe.</p>
                    <Link to="/catalogo" className="btn btn-primary">Volver al catálogo</Link>
                </div>
            </section>
        );
    }

    const estado = estadoStock(producto.stock);
    const sinStock = producto.stock === 0;

    return (
        <section className="py-5">
            <div className="container">
                <p className="mb-4"><Link to="/catalogo" className="fw-semibold">← Volver al catálogo</Link></p>

                <div className="row g-4 g-lg-5">
                    <div className="col-lg-6">
                        <div className="detalle__foto">
                            {producto.imagen
                                ? <img src={import.meta.env.BASE_URL + producto.imagen} alt={producto.nombre} />
                                : <span aria-hidden="true">{producto.icono}</span>}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <p className="small text-body-secondary mb-1">{producto.codigo} · {nombresCategoria[producto.categoria]}</p>
                        <h1 className="h2 fw-bold">{producto.nombre}</h1>
                        <p className="text-body-secondary mb-2">Marca {producto.marca} · se vende por unidad</p>
                        <span className={`badge ${estado.clase}`}>{estado.texto}</span>
                        <p className="display-6 fw-bold my-3">${producto.precio.toLocaleString('es-CL')}</p>
                        <p className="mb-4">{producto.descripcion}</p>

                        <form className="card card-body mb-4" onSubmit={handleSubmit}>
                            <label htmlFor="cantidad" className="form-label">Cantidad (unidades)</label>
                            <input type="number" id="cantidad" name="cantidad" className="form-control" defaultValue="1" min="1" max={producto.stock} disabled={sinStock}></input>
                            {!sinStock && <p className="form-text">Máximo {producto.stock} unidades según el stock actual.</p>}
                            <button type="submit" className="btn btn-primary mt-3" disabled={sinStock}>
                                {sinStock ? 'Sin stock' : 'Agregar al carrito'}
                            </button>
                        </form>

                        <div className="alert alert-info mb-0">
                            Retiro en tienda el mismo día, o despacho a domicilio dentro de 12 km. Sobre $150.000 el despacho es gratis.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductoDetalle;
