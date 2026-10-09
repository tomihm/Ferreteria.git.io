import { NavLink } from 'react-router-dom';

function Header(){
    return(
        <header className="header">
                <div className="contenedor header__barra">
                    <a href="index.html" className="logo">
                        🔧 FERRETERÍA <em>LOS MAESTROS</em>
                    </a>
                    <input type="checkbox" id="menuToggle" />
                    <nav className="nav" aria-label="Navegación principal">
                        <ul className="nav__lista">
                            <li><NavLink to="/">Inicio</NavLink></li>
                            <li><NavLink to="/catalogo">Catálogo</NavLink></li>
                            <li><a href="nosotros.html">Nosotros</a></li>
                            <li><a href="contacto.html">Contacto</a></li>
                            <li><a href="mis-pedidos.html">Mis pedidos</a></li>
                            <li><a href="admin.html">Panel</a></li>
                        </ul>
                    </nav>
                    <div className="header__acciones">
                        <a href="carrito.html" className="carrito-icono" aria-label="Ver carrito de compras">
                            🛒<span className="carrito-contador">3</span>
                        </a>
                        <a href="login.html" className="btn btn--primario btn--sm">Iniciar sesión</a>
                        <label htmlFor="menuToggle" className="hamburguesa" aria-label="Abrir menú">☰</label>
                    </div>
                </div>
            </header>
    )

}

export default Header