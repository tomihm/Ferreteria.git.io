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
    return <p className={mensaje ? 'campo__error visible' : 'campo__error'}>{mensaje}</p>;
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

    const claseCampo = (campo) => {
        if (errores[campo]) return 'invalido';
        if (errores[campo] === null) return 'valido';
        return '';
    };

    return (
        <>
            <section className="pagina-titulo">
                <div className="contenedor">
                    <h1>Contacto y despacho</h1>
                    <p>Escríbenos o revisa si llegamos hasta tu obra.</p>
                </div>
            </section>

            <section className="seccion">
                <div className="contenedor">
                    <div className="grid grid--2">

                        <div className="formulario">
                            <h2 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>Envíanos un mensaje</h2>

                            {aviso && <div className={`alerta alerta--${aviso.tipo}`}>{aviso.texto}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="campo">
                                    <label htmlFor="conNombre">Nombre</label>
                                    <input type="text" id="conNombre" name="nombre" autoComplete="name"
                                        value={form.nombre} onChange={handleChange} onBlur={handleBlur}
                                        className={claseCampo('nombre')} aria-invalid={!!errores.nombre} />
                                    <ErrorCampo mensaje={errores.nombre} />
                                </div>

                                <div className="campo">
                                    <label htmlFor="conEmail">Correo electrónico</label>
                                    <input type="email" id="conEmail" name="email" autoComplete="email"
                                        value={form.email} onChange={handleChange} onBlur={handleBlur}
                                        className={claseCampo('email')} aria-invalid={!!errores.email} />
                                    <ErrorCampo mensaje={errores.email} />
                                </div>

                                <div className="campo">
                                    <label htmlFor="conTelefono">Teléfono</label>
                                    <input type="tel" id="conTelefono" name="telefono" placeholder="+569 1234 5678" autoComplete="tel"
                                        value={form.telefono} onChange={handleChange} onBlur={handleBlur}
                                        className={claseCampo('telefono')} aria-invalid={!!errores.telefono} />
                                    <ErrorCampo mensaje={errores.telefono} />
                                </div>

                                <div className="campo">
                                    <label htmlFor="conMotivo">Motivo</label>
                                    <select id="conMotivo" name="motivo"
                                        value={form.motivo} onChange={handleChange} onBlur={handleBlur}
                                        className={claseCampo('motivo')} aria-invalid={!!errores.motivo}>
                                        <option value="">Elige una opción</option>
                                        <option>Cotización de materiales</option>
                                        <option>Consulta de stock</option>
                                        <option>Estado de un pedido</option>
                                        <option>Cuenta corriente</option>
                                        <option>Otro</option>
                                    </select>
                                    <ErrorCampo mensaje={errores.motivo} />
                                </div>

                                <div className="campo">
                                    <label htmlFor="conMensaje">Mensaje</label>
                                    <textarea id="conMensaje" name="mensaje" maxLength={500} placeholder="Cuéntanos qué necesitas"
                                        value={form.mensaje} onChange={handleChange} onBlur={handleBlur}
                                        className={claseCampo('mensaje')} aria-invalid={!!errores.mensaje}></textarea>
                                    <ErrorCampo mensaje={errores.mensaje} />
                                    <p className="campo__ayuda">{form.mensaje.length}/500 caracteres</p>
                                </div>

                                <button type="submit" className="btn btn--primario btn--bloque">Enviar mensaje</button>
                            </form>
                        </div>

                        <div>
                            <div className="categoria-card mb-3" style={{ textAlign: 'left', borderTopColor: 'var(--gris-900)' }}>
                                <h3>Dónde estamos</h3>
                                <p style={{ marginTop: '8px' }}>Av. Balmaceda 1200, La Serena, Región de Coquimbo</p>
                                <p className="mt-1"><strong>+56 51 221 4455</strong><br />ventas@losmaestros.cl</p>
                                <p className="mt-1">Lunes a viernes 8:30–19:00<br />Sábado 9:00–14:00<br />Domingo cerrado</p>
                            </div>

                            <h3 style={{ marginBottom: '10px' }}>Zona de despacho</h3>
                            <p style={{ color: 'var(--gris-500)', fontSize: '.9rem', marginBottom: '12px' }}>
                                Despachamos dentro de un radio de 12 km desde la tienda, lo que cubre La Serena y buena parte de Coquimbo.
                            </p>

                            <div className="mapa-marco">
                                <iframe
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-71.35%2C-29.98%2C-71.15%2C-29.83&layer=mapnik&marker=-29.9027%2C-71.2519"
                                    title="Mapa de ubicación de Ferretería Los Maestros"
                                    loading="lazy"
                                ></iframe>
                            </div>

                            <div className="alerta alerta--info mt-2">
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
