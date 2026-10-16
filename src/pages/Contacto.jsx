import { useState } from 'react';
import Validar from '../utils/validaciones.js';

const formInicial = {
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
    mensaje: ''
};

const reglas = {
    nombre: (v) => Validar.longitudMinima(v, 3, 'El nombre'),
    email: Validar.email,
    telefono: Validar.telefono,
    motivo: Validar.requerido,
    mensaje: (v) => Validar.longitudMinima(v, 15, 'El mensaje')
};

function ErrorCampo({ mensaje }) {
    return <div className="invalid-feedback">{mensaje}</div>;
}

function Contacto() {
    const [form, setForm] = useState(formInicial);
    const [errores, setErrores] = useState({});
    const [aviso, setAviso] = useState(null);

    const validarCampo = (campo, valor) => {
        setErrores({ ...errores, [campo]: reglas[campo](valor) });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // si ya estaba en rojo se vuelve a validar mientras escribe
        if (errores[name]) {
            validarCampo(name, value);
        }
    };

    const handleBlur = (e) => {
        validarCampo(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nuevosErrores = {};
        Object.keys(reglas).forEach((campo) => {
            nuevosErrores[campo] = reglas[campo](form[campo]);
        });
        setErrores(nuevosErrores);

        if (Object.values(nuevosErrores).some((err) => err !== null)) {
            setAviso({ tipo: 'error', texto: 'Revisa los campos marcados en rojo.' });
            return;
        }

        // TODO: conectar con el backend
        setAviso({ tipo: 'exito', texto: 'Mensaje válido. El envío se conectará al backend en la siguiente etapa.' });
        setForm(formInicial);
        setErrores({});
    };

    // base es form-control o form-select segun el campo
    const claseCampo = (campo, base = 'form-control') => {
        if (errores[campo]) return base + ' is-invalid';
        if (errores[campo] === null) return base + ' is-valid';
        return base;
    };

    return (
        <>
            <section className="pagina-titulo">
                <div className="container">
                    <h1>Contacto y despacho</h1>
                    <p className="mb-0">Escríbenos o revisa si llegamos hasta tu obra.</p>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4">

                        <div className="col-lg-6">
                            <div className="card card-body p-4">
                                <h2 className="h4 mb-3">Envíanos un mensaje</h2>

                                {aviso && <div className={`alert ${aviso.tipo === 'exito' ? 'alert-success' : 'alert-danger'}`} role="alert">{aviso.texto}</div>}

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="conNombre" className="form-label">Nombre</label>
                                        <input type="text" id="conNombre" name="nombre" autoComplete="name"
                                            value={form.nombre} onChange={handleChange} onBlur={handleBlur}
                                            className={claseCampo('nombre')} aria-invalid={!!errores.nombre} />
                                        <ErrorCampo mensaje={errores.nombre} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="conEmail" className="form-label">Correo electrónico</label>
                                        <input type="email" id="conEmail" name="email" autoComplete="email"
                                            value={form.email} onChange={handleChange} onBlur={handleBlur}
                                            className={claseCampo('email')} aria-invalid={!!errores.email} />
                                        <ErrorCampo mensaje={errores.email} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="conTelefono" className="form-label">Teléfono</label>
                                        <input type="tel" id="conTelefono" name="telefono" placeholder="+569 1234 5678" autoComplete="tel"
                                            value={form.telefono} onChange={handleChange} onBlur={handleBlur}
                                            className={claseCampo('telefono')} aria-invalid={!!errores.telefono} />
                                        <ErrorCampo mensaje={errores.telefono} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="conMotivo" className="form-label">Motivo</label>
                                        <select id="conMotivo" name="motivo"
                                            value={form.motivo} onChange={handleChange} onBlur={handleBlur}
                                            className={claseCampo('motivo', 'form-select')} aria-invalid={!!errores.motivo}>
                                            <option value="">Elige una opción</option>
                                            <option>Cotización de materiales</option>
                                            <option>Consulta de stock</option>
                                            <option>Estado de un pedido</option>
                                            <option>Cuenta corriente</option>
                                            <option>Otro</option>
                                        </select>
                                        <ErrorCampo mensaje={errores.motivo} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="conMensaje" className="form-label">Mensaje</label>
                                        <textarea id="conMensaje" name="mensaje" maxLength={500} placeholder="Cuéntanos qué necesitas"
                                            value={form.mensaje} onChange={handleChange} onBlur={handleBlur}
                                            className={claseCampo('mensaje')} aria-invalid={!!errores.mensaje}></textarea>
                                        <ErrorCampo mensaje={errores.mensaje} />
                                        <div className="form-text">{form.mensaje.length}/500 caracteres</div>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">Enviar mensaje</button>
                                </form>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card bg-dark text-light mb-4">
                                <div className="card-body p-4">
                                    <h3 className="h5 text-primary">Dónde estamos</h3>
                                    <p className="mb-2">Av. Balmaceda 1200, La Serena, Región de Coquimbo</p>
                                    <p className="mb-2">
                                        <a href="tel:+56512214455" className="fw-bold link-light">+56 51 221 4455</a><br />
                                        <a href="mailto:ventas@losmaestros.cl" className="link-light">ventas@losmaestros.cl</a>
                                    </p>
                                    <p className="mb-0">Lunes a viernes 8:30 a 19:00<br />Sábado 9:00 a 14:00<br />Domingo cerrado</p>
                                </div>
                            </div>

                            <h3 className="h5">Zona de despacho</h3>
                            <p className="text-body-secondary small">
                                Despachamos dentro de un radio de 12 km desde la tienda, lo que cubre La Serena y buena parte de Coquimbo.
                            </p>

                            <div className="ratio ratio-4x3 rounded overflow-hidden">
                                <iframe
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-71.35%2C-29.98%2C-71.15%2C-29.83&layer=mapnik&marker=-29.9027%2C-71.2519"
                                    title="Mapa de ubicación de Ferretería Los Maestros"
                                    loading="lazy"
                                ></iframe>
                            </div>

                            <div className="alert alert-info mt-3 mb-0">
                                ¿Tu obra queda fuera del radio? Llámanos y coordinamos un despacho especial según el volumen del pedido.
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

export default Contacto;
