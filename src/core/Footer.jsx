import { Link } from 'react-router-dom';

function Footer() {
    return(
        <footer className="bg-dark text-light pt-5 pb-3 mt-5 footer">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <h2 className="h5 text-primary">Ferretería Los Maestros</h2>
                            <p className="small">Materiales de construcción, herramientas y ferretería general en La Serena desde 2004.</p>
                        </div>
                        <div className="col-6 col-lg-2">
                            <h2 className="h6 text-primary">Navegación</h2>
                            <ul className="list-unstyled small">
                                <li className="mb-2"><Link to="/">Inicio</Link></li>
                                <li className="mb-2"><Link to="/catalogo">Catálogo</Link></li>
                                <li className="mb-2"><Link to="/nosotros">Nosotros</Link></li>
                                <li className="mb-2"><Link to="/contacto">Contacto</Link></li>
                            </ul>
                        </div>
                        <div className="col-6 col-lg-2">
                            <h2 className="h6 text-primary">Mi cuenta</h2>
                            <ul className="list-unstyled small">
                                <li className="mb-2"><Link to="/login">Iniciar sesión</Link></li>
                                <li className="mb-2"><Link to="/mis-pedidos">Mis pedidos</Link></li>
                                <li className="mb-2"><Link to="/carrito">Carrito</Link></li>
                                <li className="mb-2"><Link to="/panel">Panel de gestión</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-4">
                            <h2 className="h6 text-primary">Contacto</h2>
                            <address className="small mb-0">
                                Av. Balmaceda 1200, La Serena<br />
                                <a href="tel:+56512214455">+56 51 221 4455</a><br />
                                <a href="mailto:ventas@losmaestros.cl">ventas@losmaestros.cl</a><br />
                                Lun a Vie 8:30 a 19:00 · Sáb 9:00 a 14:00
                            </address>
                        </div>
                    </div>
                    <p className="text-center text-white-50 small border-top border-secondary mt-4 pt-3 mb-0">
                        © 2026 Ferretería Los Maestros
                    </p>
                </div>
            </footer>
    )
}

export default Footer
