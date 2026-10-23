import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useSesion } from '../context/SesionContext.jsx';

const formatoPeso = (valor) => `$${valor.toLocaleString('es-CL')}`;

function IconoLupa() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
    );
}

function IconoCarrito() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a1.5 1.5 0 0 0 1.5 1.1h8.9a1.5 1.5 0 0 0 1.5-1.1L22 7H6" />
        </svg>
    );
}

function IconoUsuario() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    );
}

function Header(){
    const { items, totalUnidades } = useCarrito();
    const { usuario, salir } = useSesion();
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    const totalCarrito = items.reduce((total, item) => total + item.precio * (Number(item.cantidad) || 0), 0);
    const paginaCuenta = !usuario ? '/login' : usuario.rol === 'admin' ? '/panel' : '/mis-pedidos';

    // al elegir una pagina en el celular se cierra el menu
    const cerrarMenu = () => {
        setMenuAbierto(false);
    };

    const cerrarSesion = () => {
        salir();
        cerrarMenu();
        navigate('/');
    };

    // el buscador lleva al catalogo con el texto en la url
    const buscar = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (busqueda.trim()) params.set('buscar', busqueda.trim());
        cerrarMenu();
        navigate(`/catalogo${params.size ? `?${params}` : ''}`);
    };

    // si el menu esta abierto y se toca fuera del header, se cierra
    const headerRef = useRef(null);
    useEffect(() => {
        if (!menuAbierto) return;
        const clickFuera = (e) => {
            if (!headerRef.current.contains(e.target)) cerrarMenu();
        };
        document.addEventListener('pointerdown', clickFuera);
        return () => document.removeEventListener('pointerdown', clickFuera);
    }, [menuAbierto]);

    return(
        <header ref={headerRef} className="encabezado">
            {/* franja superior con datos utiles y la sesion */}
            <div className="franja-superior">
                <div className="container d-flex justify-content-between align-items-center gap-3">
                    <p className="mb-0 d-none d-md-block">
                        Despacho gratis sobre $150.000 <span className="franja-superior__separador">·</span> Crédito a 30 días para contratistas
                    </p>
                    <div className="d-flex align-items-center gap-3 ms-auto">
                        <span className="d-none d-lg-inline">Av. Balmaceda 1200, La Serena</span>
                        <a href="tel:+56512214455" className="d-none d-sm-inline">+56 51 221 4455</a>
                        {/* en escritorio esto queda en el menu de "Mi cuenta" */}
                        {usuario ? (
                            <span className="d-lg-none d-flex gap-3">
                                <span>{usuario.nombre}</span>
                                <button type="button" className="btn btn-link btn-sm p-0" onClick={cerrarSesion}>Cerrar sesión</button>
                            </span>
                        ) : (
                            <NavLink to="/login" className="d-lg-none" onClick={cerrarMenu}>Iniciar sesión</NavLink>
                        )}
                    </div>
                </div>
            </div>

            {/* logo, buscador, cuenta y carrito */}
            <div className="encabezado__principal">
                <div className="container encabezado__fila">
                    <NavLink to="/" className="encabezado__logo" onClick={cerrarMenu}>
                        <img src={`${import.meta.env.BASE_URL}assets/logo_los_maestros.png`} alt="Ferretería Los Maestros" height="56" />
                    </NavLink>

                    <form className="buscador" role="search" onSubmit={buscar}>
                        <label htmlFor="buscadorTexto" className="visually-hidden">Buscar en la tienda</label>
                        <input type="search" id="buscadorTexto" className="buscador__texto" placeholder="Busca cemento, taladros, tornillos..."
                            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                        <button type="submit" className="buscador__boton" aria-label="Buscar"><IconoLupa /></button>
                    </form>

                    <div className="encabezado__acciones">
                        {/* al pasar el mouse (o llegar con tab) se abre el menu de la cuenta */}
                        <div className="cuenta d-none d-lg-block">
                            <NavLink to={paginaCuenta} className="encabezado__accion" onClick={cerrarMenu}>
                                <IconoUsuario />
                                <span className="small">Mi cuenta</span>
                            </NavLink>
                            <div className="cuenta__menu" data-testid="menu-cuenta">
                                {usuario ? (
                                    <>
                                        <p className="cuenta__nombre">{usuario.nombre}</p>
                                        <Link to={paginaCuenta} className="cuenta__item">{usuario.rol === 'admin' ? 'Ir al panel' : 'Ver mis pedidos'}</Link>
                                        <button type="button" className="cuenta__item cuenta__item--salir" onClick={cerrarSesion}>Cerrar sesión</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="cuenta__item cuenta__item--principal">Iniciar sesión</Link>
                                        <Link to="/registro" className="cuenta__item">Crear cuenta</Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <NavLink to="/carrito" className="carrito-boton" onClick={cerrarMenu}>
                            <IconoCarrito />
                            <span className="carrito-boton__texto">
                                Carrito
                                {totalUnidades > 0 && <span className="badge bg-primary text-dark ms-1">{totalUnidades}</span>}
                                {totalUnidades > 0 && <span className="carrito-boton__total d-none d-sm-block">{formatoPeso(totalCarrito)}</span>}
                            </span>
                        </NavLink>
                        <button
                            type="button"
                            className="btn btn-outline-dark d-lg-none menu-boton"
                            aria-controls="menuPrincipal"
                            aria-expanded={menuAbierto}
                            aria-label="Abrir menú"
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* barra de navegacion: en el celular se abre encima de la pagina */}
            <div className="barra-nav navbar navbar-expand-lg p-0">
                <div className="container">
                    <div className={menuAbierto ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'} id="menuPrincipal">
                        <nav className="me-auto" aria-label="Navegación principal">
                            <ul className="navbar-nav">
                                <li className="nav-item"><NavLink to="/" end className="nav-link" onClick={cerrarMenu}>Inicio</NavLink></li>
                                <li className="nav-item"><NavLink to="/catalogo" className="nav-link" onClick={cerrarMenu}>Catálogo</NavLink></li>
                                <li className="nav-item"><Link to="/catalogo?ofertas=1" className="nav-link nav-link--oferta" onClick={cerrarMenu}>Ofertas</Link></li>
                                <li className="nav-item"><NavLink to="/nosotros" className="nav-link" onClick={cerrarMenu}>Nosotros</NavLink></li>
                                <li className="nav-item"><NavLink to="/contacto" className="nav-link" onClick={cerrarMenu}>Contacto</NavLink></li>
                                {/* cada usuario ve solo la pagina de su rol; en escritorio esta en el menu de "Mi cuenta" */}
                                {(usuario?.rol === 'contratista' || usuario?.rol === 'cliente') && (
                                    <li className="nav-item d-lg-none"><NavLink to="/mis-pedidos" className="nav-link" onClick={cerrarMenu}>Mis pedidos</NavLink></li>
                                )}
                                {usuario?.rol === 'admin' && (
                                    <li className="nav-item d-lg-none"><NavLink to="/panel" className="nav-link" onClick={cerrarMenu}>Panel</NavLink></li>
                                )}
                            </ul>
                        </nav>

                        <p className="barra-nav__aviso d-none d-xl-block mb-0">Ofertas de temporada · hasta 25% off</p>
                    </div>
                </div>
            </div>
        </header>
    )

}

export default Header
