import { Link } from 'react-router-dom';

function Footer() {
    return(
        <footer className="footer">
                <div className="contenedor">
                    <div className="footer__grid">
                        <div>
                            <h4>Ferretería Los Maestros</h4>
                            <p style={{ fontSize: ".9rem" }}>Materiales de construcción, herramientas y ferretería general en La Serena desde 2004.</p>
                        </div>
                        <div>
                            <h4>Navegación</h4>
                            <ul>
                                <li><Link to="/">Inicio</Link></li>
                                <li><Link to="/catalogo">Catálogo</Link></li>
                                <li><Link to="/nosotros">Nosotros</Link></li>
                                <li><Link to="/contacto">Contacto</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Mi cuenta</h4>
                            <ul>
                                <li><a href="login.html">Iniciar sesión</a></li>
                                <li><a href="mis-pedidos.html">Mis pedidos</a></li>
                                <li><a href="carrito.html">Carrito</a></li>
                                <li><a href="admin.html">Panel de gestión</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Contacto</h4>
                            <ul>
                                <li>Av. Balmaceda 1200, La Serena</li>
                                <li>+56 51 221 4455</li>
                                <li>ventas@losmaestros.cl</li>
                                <li>Lun a Vie 8:30–19:00 · Sáb 9:00–14:00</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer__base">
                        <p>© 2026 Ferretería Los Maestros · Proyecto académico DSY1104 Desarrollo FullStack II · Duoc UC</p>
                    </div>
                </div>
            </footer>
    )
}

export default Footer