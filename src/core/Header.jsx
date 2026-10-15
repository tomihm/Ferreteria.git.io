import { NavLink } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';

function Header(){
    const { totalUnidades } = useCarrito();

    return(
        <header className="header">
                <div className="contenedor header__barra">
                <NavLink to="/" className="logo">
                    🔧 FERRETERÍA <em>LOS MAESTROS</em>
                </NavLink>
                    <input type="checkbox" id="menuToggle" />
                    <nav className="nav" aria-label="Navegación principal">
                        <ul className="nav__lista">
                            <li><NavLink to="/">Inicio</NavLink></li>
                            <li><NavLink to="/catalogo">Catálogo</NavLink></li>
                            <li><NavLink to="/nosotros">Nosotros</NavLink></li>
                            <li><NavLink to="/contacto">Contacto</NavLink></li>
                            <li><NavLink to="/mis-pedidos">Mis pedidos</NavLink></li>
                            <li><NavLink to="/panel">Panel</NavLink></li>
                        </ul>
                    </nav>
                    <div className="header__acciones">
                        <NavLink to="/carrito" className="carrito-icono" aria-label="Ver carrito de compras">
                            🛒{totalUnidades > 0 && <span className="carrito-contador">{totalUnidades}</span>}
                        </NavLink>
                        <NavLink to="/login" className="btn btn--primario btn--sm">Iniciar sesión</NavLink>
                        <label htmlFor="menuToggle" className="hamburguesa" aria-label="Abrir menú">☰</label>
                    </div>
                </div>
            </header>
    )

}

export default Header