import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { catalogo } from "../products/catalogo.js";
import { categorias } from "../products/categorias.js";
import TarjetaProducto from "../components/TarjetaProducto.jsx";

const ordenes = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre),
    precioMenor: (a, b) => a.precio - b.precio,
    precioMayor: (a, b) => b.precio - a.precio,
    stock: (a, b) => b.stock - a.stock,
};

function Catalogo() {
    const { hash } = useLocation();
    const [orden, setOrden] = useState('nombre');

    // busqueda, categoria y ofertas van en la url, asi el buscador del header puede llegar con filtros
    const [params, setParams] = useSearchParams();
    const busqueda = params.get('buscar') ?? '';
    const categoria = params.get('categoria') ?? '';
    const soloOfertas = params.get('ofertas') === '1';

    const cambiarFiltro = (clave, valor) => {
        const nuevos = new URLSearchParams(params);
        if (valor) nuevos.set(clave, valor);
        else nuevos.delete(clave);
        setParams(nuevos, { replace: true });
    };

    // si se llega desde el inicio con #categoria, se baja hasta esa categoria
    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView();
        }
    }, [hash]);

    const texto = busqueda.trim().toLowerCase();
    const filtrados = catalogo
        .filter((p) => categoria === '' || p.categoria === categoria)
        .filter((p) => !soloOfertas || p.precioNormal)
        .filter((p) => texto === '' ||
            p.nombre.toLowerCase().includes(texto) ||
            p.codigo.toLowerCase().includes(texto) ||
            p.marca.toLowerCase().includes(texto))
        .sort(ordenes[orden]);

    const limpiarFiltros = () => {
        setParams({}, { replace: true });
        setOrden('nombre');
    };

    return (
        <>
            <section className="pagina-titulo">
                <div className="container">
                    <h1>Catálogo de productos</h1>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <form className="card card-body mb-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-6 col-lg-5">
                                <label htmlFor="buscar" className="form-label">Buscar producto</label>
                                <input type="search" id="buscar" name="buscar" className="form-control" placeholder="Nombre, código o marca"
                                    value={busqueda} onChange={(e) => cambiarFiltro('buscar', e.target.value)} />
                            </div>
                            <div className="col-sm-6 col-md-3">
                                <label htmlFor="categoria" className="form-label">Categoría</label>
                                <select id="categoria" name="categoria" className="form-select"
                                    value={categoria} onChange={(e) => cambiarFiltro('categoria', e.target.value)}>
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
                            <div className="col-12">
                                <div className="form-check mb-0">
                                    <input type="checkbox" id="soloOfertas" className="form-check-input"
                                        checked={soloOfertas} onChange={(e) => cambiarFiltro('ofertas', e.target.checked ? '1' : '')} />
                                    <label htmlFor="soloOfertas" className="form-check-label">Solo productos en oferta</label>
                                </div>
                            </div>
                        </div>
                    </form>

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
