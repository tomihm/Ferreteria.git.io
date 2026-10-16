import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { catalogo } from "../products/catalogo.js";
import TarjetaProducto from "../components/TarjetaProducto.jsx";

const categorias = [
    { id: 'construccion', nombre: 'Materiales de Construcción' },
    { id: 'herramientas', nombre: 'Herramientas Eléctricas' },
    { id: 'manuales', nombre: 'Herramientas Manuales' },
    { id: 'gasfiteria', nombre: 'Gasfitería' },
    { id: 'electricidad', nombre: 'Electricidad' },
    { id: 'general', nombre: 'Ferretería General' },
];

const ordenes = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre),
    precioMenor: (a, b) => a.precio - b.precio,
    precioMayor: (a, b) => b.precio - a.precio,
    stock: (a, b) => b.stock - a.stock,
};

function Catalogo() {
    const { hash } = useLocation();
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [orden, setOrden] = useState('nombre');

    // si se llega desde el inicio con #categoria, se baja hasta esa categoria
    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView();
        }
    }, [hash]);

    const texto = busqueda.trim().toLowerCase();
    const filtrados = catalogo
        .filter((p) => categoria === '' || p.categoria === categoria)
        .filter((p) => texto === '' ||
            p.nombre.toLowerCase().includes(texto) ||
            p.codigo.toLowerCase().includes(texto) ||
            p.marca.toLowerCase().includes(texto))
        .sort(ordenes[orden]);

    const limpiarFiltros = () => {
        setBusqueda('');
        setCategoria('');
        setOrden('nombre');
    };

    return (
        <>
            <section className="pagina-titulo">
                <div className="container">
                    <h1>Catálogo de productos</h1>
                    <p className="mb-0">Precios y disponibilidad actualizados al 8 de septiembre de 2026.</p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <form className="card card-body mb-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-6 col-lg-5">
                                <label htmlFor="buscar" className="form-label">Buscar producto</label>
                                <input type="search" id="buscar" name="buscar" className="form-control" placeholder="Nombre, código o marca"
                                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <label htmlFor="categoria" className="form-label">Categoría</label>
                                <select id="categoria" name="categoria" className="form-select"
                                    value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                                    <option value="">Todas las categorías</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-6 col-md-3 col-lg-2">
                                <label htmlFor="orden" className="form-label">Ordenar por</label>
                                <select id="orden" name="orden" className="form-select"
                                    value={orden} onChange={(e) => setOrden(e.target.value)}>
                                    <option value="nombre">Nombre A-Z</option>
                                    <option value="precioMenor">Precio: menor a mayor</option>
                                    <option value="precioMayor">Precio: mayor a menor</option>
                                    <option value="stock">Más stock disponible</option>
                                </select>
                            </div>
                            <div className="col-lg-2 d-grid">
                                <button type="button" className="btn btn-outline-dark" onClick={limpiarFiltros}>Limpiar filtros</button>
                            </div>
                        </div>
                    </form>

                    <p className="text-body-secondary mb-2">Ir directo a una categoría:</p>
                    <nav className="d-flex flex-wrap gap-2 mb-2" aria-label="Atajos por categoría">
                        {categorias.map((c) => (
                            <a key={c.id} href={`#${c.id}`} className="btn btn-outline-dark btn-sm">{c.nombre}</a>
                        ))}
                    </nav>

                    {filtrados.length === 0 && (
                        <div className="alert alert-info mt-4">
                            No encontramos productos con esos filtros. Prueba con otro nombre o código, o limpia los filtros.
                        </div>
                    )}

                    {categorias.filter((c) => filtrados.some((p) => p.categoria === c.id)).map((c) => (
                        <div key={c.id}>
                            <h2 className="categoria-titulo" id={c.id}>{c.nombre}</h2>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                                {filtrados.filter((p) => p.categoria === c.id).map((p) => (
                                    <div className="col" key={p.codigo}>
                                        <TarjetaProducto producto={p} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Catalogo;
