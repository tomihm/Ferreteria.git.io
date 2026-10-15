import { useParams } from 'react-router-dom';
import { productos } from '../products/productos.js';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';

function ProductoDetalle() {

    const { id } = useParams();
    const { agregar } = useCarrito();

    const producto = productos.find((p) => p.id === id);

    const handleSubmit = (e) => {
        e.preventDefault();
        agregar(producto.codigo, Number(e.target.elements.cantidad.value) || 1);
    };

    if (!producto) {
        return (
            <div>
                <h1>Producto no encontrado</h1>
                <p>El producto que estás buscando no existe.</p>
            </div>
        );
    }

    return (
        <section className="seccion">
      <div className="contenedor">
        <p className="mb-3"><Link to="/catalogo" style={{ color: "var(--naranja)", fontWeight: "600" }}>← Volver al catálogo</Link></p>

                <div className="detalle">
                    <div className="detalle__img">
                        <img src={producto.imagen} alt={producto.nombre} />
                    </div>

                    <div>
                        <p className="producto__codigo">HER-001 · Herramientas Eléctricas</p>
                        <h1 style={{ fontSize: "1.8rem", margin: "6px 0" }}>{producto.nombre}</h1>
                        <p className="producto__marca mb-2">Marca {producto.marca} · se vende por unidad</p>
                        <span className="badge badge--stock">Disponible: {producto.stock}</span>
                        <p className="producto__precio" style={{ fontSize: "2rem" }}>${producto.precio.toLocaleString('es-CL')}</p>
                        <p style={{ color: "var(--gris-700)", marginBottom: "20px" }}>{producto.descripcion}</p>

                        <form className="formulario" style={{ padding: "20px" }} onSubmit={handleSubmit}>
                            <div className="campo">
                                <label htmlFor="cantidad">Cantidad (unidades)</label>
                                <input type="number" id="cantidad" name="cantidad" defaultValue="1" min="1" max="14"></input>
                                <p className="campo__ayuda">Máximo 14 unidades según el stock actual.</p>
                            </div>
                            <button type="submit" className="btn btn--primario btn--bloque">Agregar al carrito</button>
                        </form>

                        <div className="alerta alerta--info mt-3">
                            Retiro en tienda el mismo día, o despacho a domicilio dentro de 12 km. Sobre $150.000 el despacho es gratis.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductoDetalle;