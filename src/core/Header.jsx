import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';

function Header(){
    const { totalUnidades } = useCarrito();
    const [menuAbierto, setMenuAbierto] = useState(false);

    // al elegir una pagina en el celular se cierra el menu
    const cerrarMenu = () => setMenuAbierto(false);

    // si el menu esta abierto y se toca fuera del header, se cierra
    const headerRef = useRef(null);
    useEffect(() => {
        if (!menuAbierto) return;
        const clickFuera = (e) => {
            if (!headerRef.current.contains(e.target)) setMenuAbierto(false);
        };
        document.addEventListener('pointerdown', clickFuera);
        return () => document.removeEventListener('pointerdown', clickFuera);
    }, [menuAbierto]);

    return(
        <header ref={headerRef} className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container">
                <NavLink to="/" className="navbar-brand py-0" onClick={cerrarMenu}>
                    <img src={`${import.meta.env.BASE_URL}assets/logo_los_maestros_oscuro.png`} alt="Ferretería Los Maestros" height="60" />
                </NavLink>

                <button
                    type="button"
                    className="navbar-toggler"
                    aria-controls="menuPrincipal"
                    aria-expanded={menuAbierto}
                    aria-label="Abrir menú"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={menuAbierto ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'} id="menuPrincipal">
                    <nav className="me-auto" aria-label="Navegación principal">
                        <ul className="navbar-nav">
                            <li className="nav-item"><NavLink to="/" end className="nav-link" onClick={cerrarMenu}>Inicio</NavLink></li>
                            <li className="nav-item"><NavLink to="/catalogo" className="nav-link" onClick={cerrarMenu}>Catálogo</NavLink></li>
                            <li className="nav-item"><NavLink to="/nosotros" className="nav-link" onClick={cerrarMenu}>Nosotros</NavLink></li>
                            <li className="nav-item"><NavLink to="/contacto" className="nav-link" onClick={cerrarMenu}>Contacto</NavLink></li>
                            <li className="nav-item"><NavLink to="/mis-pedidos" className="nav-link" onClick={cerrarMenu}>Mis pedidos</NavLink></li>
                            <li className="nav-item"><NavLink to="/panel" className="nav-link" onClick={cerrarMenu}>Panel</NavLink></li>
                        </ul>
                    </nav>
                    <div className="d-flex align-items-center gap-3 py-2 py-lg-0">
                        <NavLink to="/carrito" className="nav-link text-light" onClick={cerrarMenu}>
                            Carrito{totalUnidades > 0 && <span className="badge bg-primary text-dark ms-1">{totalUnidades}</span>}
                        </NavLink>
                        <NavLink to="/login" className="btn btn-primary btn-sm" onClick={cerrarMenu}>Iniciar sesión</NavLink>
                    </div>
                </div>
            </div>
        </header>
    )

}

export default Header
