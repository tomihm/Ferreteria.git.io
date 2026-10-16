import { useParams } from 'react-router-dom';
import { productos } from '../products/productos.js';
import { catalogo } from '../products/catalogo.js';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';

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

    const producto = productos.find((p) => p.id === id);
    // el stock y la categoria estan en el catalogo
    const enCatalogo = catalogo.find((p) => p.codigo === producto?.codigo);

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

    return (
        <section className="py-5">
            <div className="container">
                <p className="mb-4"><Link to="/catalogo" className="fw-semibold">← Volver al catálogo</Link></p>

                <div className="row g-5">
                    <div className="col-lg-6">
                        <div className="detalle__foto">
                            <img src={producto.imagen} alt={producto.nombre} />
                        </div>
                    </div>

                    <div className="col-lg-6">
                        {enCatalogo && (
                            <p className="small text-body-secondary mb-1">{enCatalogo.codigo} · {nombresCategoria[enCatalogo.categoria]}</p>
                        )}
                        <h1 className="h2 fw-bold">{producto.nombre}</h1>
                        <p className="text-body-secondary mb-2">Marca {producto.marca} · se vende por unidad</p>
                        {enCatalogo && <span className="badge text-bg-success">Disponible: {enCatalogo.stock}</span>}
                        <p className="display-6 fw-bold my-3">${producto.precio.toLocaleString('es-CL')}</p>
                        <p className="mb-4">{producto.descripcion}</p>

                        <form className="card card-body mb-4" onSubmit={handleSubmit}>
                            <label htmlFor="cantidad" className="form-label">Cantidad (unidades)</label>
                            <input type="number" id="cantidad" name="cantidad" className="form-control" defaultValue="1" min="1" max={enCatalogo?.stock}></input>
                            {enCatalogo && <p className="form-text">Máximo {enCatalogo.stock} unidades según el stock actual.</p>}
                            <button type="submit" className="btn btn-primary mt-3">Agregar al carrito</button>
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
