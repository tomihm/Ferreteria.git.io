import { Link } from 'react-router-dom';
import { useSesion } from '../context/SesionContext.jsx';

const mediosDePago = ['Webpay', 'Transferencia', 'Efectivo en tienda', 'Crédito contratista'];

function Footer() {
    const { usuario } = useSesion();

    return(
        <footer className="bg-dark text-light pt-5 pb-3 mt-5 footer">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <img src={`${import.meta.env.BASE_URL}assets/logo_los_maestros_oscuro.png`} alt="Ferretería Los Maestros" height="56" className="mb-3" />
                            <p className="small mb-0">Materiales de construcción, herramientas y ferretería general en La Serena desde 2004.</p>
                        </div>
                        <div className="col-6 col-lg-2">
                            <h2 className="footer__titulo">Navegación</h2>
                            <ul className="list-unstyled small">
                                <li className="mb-2"><Link to="/">Inicio</Link></li>
                                <li className="mb-2"><Link to="/catalogo">Catálogo</Link></li>
                                <li className="mb-2"><Link to="/catalogo?ofertas=1">Ofertas</Link></li>
                                <li className="mb-2"><Link to="/nosotros">Nosotros</Link></li>
                                <li className="mb-2"><Link to="/contacto">Contacto</Link></li>
                            </ul>
                        </div>
                        <div className="col-6 col-lg-2">
                            <h2 className="footer__titulo">Mi cuenta</h2>
                            <ul className="list-unstyled small">
                                {!usuario && <li className="mb-2"><Link to="/login">Iniciar sesión</Link></li>}
                                {!usuario && <li className="mb-2"><Link to="/registro">Crear cuenta</Link></li>}
                                {(usuario?.rol === 'contratista' || usuario?.rol === 'cliente') && <li className="mb-2"><Link to="/mis-pedidos">Mis pedidos</Link></li>}
                                <li className="mb-2"><Link to="/carrito">Carrito</Link></li>
                                {usuario?.rol === 'admin' && <li className="mb-2"><Link to="/panel">Panel de gestión</Link></li>}
                            </ul>
                        </div>
                        <div className="col-lg-4">
                            <h2 className="footer__titulo">Contacto</h2>
                            <address className="small mb-0">
                                Av. Balmaceda 1200, La Serena<br />
                                <a href="tel:+56512214455">+56 51 221 4455</a><br />
                                <a href="mailto:ventas@losmaestros.cl">ventas@losmaestros.cl</a><br />
                                Lun a Vie 8:30 a 19:00 · Sáb 9:00 a 14:00
                            </address>
                        </div>
                    </div>

                    <div className="footer__pagos">
                        <span className="small text-white-50">Medios de pago:</span>
                        <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
                            {mediosDePago.map((m) => <li key={m} className="footer__pago">{m}</li>)}
                        </ul>
                    </div>

                    <p className="text-center text-white-50 small mt-3 mb-0">
                        © 2026 Ferretería Los Maestros
                    </p>
                </div>
            </footer>
    )
}

export default Footer
