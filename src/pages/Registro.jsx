import { useState } from 'react';
import { Link } from 'react-router-dom';
import Validar from '../utils/validaciones.js';
import { validarTodo, hayErrores, claseCampo } from '../utils/formularios.js';

const registroInicial = {
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    password2: '',
    contratista: false
};

// password2 necesita la contraseña original, por eso las reglas reciben el form
const reglasRegistro = {
    nombre: (v) => Validar.longitudMinima(v, 3, 'El nombre'),
    rut: Validar.rut,
    email: Validar.email,
    telefono: Validar.telefono,
    direccion: Validar.requerido,
    password: Validar.password,
    password2: (v, form) => Validar.confirmarPassword(v, form.password)
};

function ErrorCampo({ mensaje }) {
    return <div className="invalid-feedback">{mensaje}</div>;
}

function Registro() {
    const [registro, setRegistro] = useState(registroInicial);
    const [erroresRegistro, setErroresRegistro] = useState({});
    const [avisoRegistro, setAvisoRegistro] = useState(null);

    const handleChangeRegistro = (e) => {
        const { name, value, type, checked } = e.target;
        const nuevo = { ...registro, [name]: type === 'checkbox' ? checked : value };
        setRegistro(nuevo);

        if (erroresRegistro[name]) {
            setErroresRegistro({ ...erroresRegistro, [name]: reglasRegistro[name](value, nuevo) });
        }
    };

    const handleBlurRegistro = (e) => {
        const { name, value } = e.target;
        if (!reglasRegistro[name]) return;
        setErroresRegistro({ ...erroresRegistro, [name]: reglasRegistro[name](value, registro) });
    };

    const handleSubmitRegistro = (e) => {
        e.preventDefault();

        const nuevosErrores = validarTodo(reglasRegistro, registro);
        setErroresRegistro(nuevosErrores);

        if (hayErrores(nuevosErrores)) {
            setAvisoRegistro({ tipo: 'error', texto: 'Revisa los campos marcados en rojo.' });
            return;
        }

        // TODO: conectar con el backend
        setAvisoRegistro({ tipo: 'exito', texto: 'Cuenta válida. El registro se conectará al backend en la siguiente etapa.' });
        setRegistro(registroInicial);
        setErroresRegistro({});
    };

    return (
        <section className="py-5">
            <div className="container">
                <div className="card card-body p-4 mx-auto formulario-angosto">
                    <form onSubmit={handleSubmitRegistro} noValidate>
                        <h1 className="h4 mb-1">Crea tu cuenta</h1>
                        <p className="text-body-secondary small mb-3">Toma un minuto y te deja comprar en línea.</p>

                        {avisoRegistro && <div className={`alert ${avisoRegistro.tipo === 'exito' ? 'alert-success' : 'alert-danger'}`} role="alert">{avisoRegistro.texto}</div>}

                        <div className="mb-3">
                            <label htmlFor="regNombre" className="form-label">Nombre y apellido</label>
                            <input type="text" id="regNombre" name="nombre" autoComplete="name"
                                value={registro.nombre} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'nombre')} aria-invalid={!!erroresRegistro.nombre} />
                            <ErrorCampo mensaje={erroresRegistro.nombre} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="regRut" className="form-label">RUT</label>
                            <input type="text" id="regRut" name="rut" placeholder="12.345.678-9" maxLength={12}
                                value={registro.rut} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'rut')} aria-invalid={!!erroresRegistro.rut} />
                            <ErrorCampo mensaje={erroresRegistro.rut} />
                            <div className="form-text">Se valida el dígito verificador.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="regEmail" className="form-label">Correo electrónico</label>
                            <input type="email" id="regEmail" name="email" autoComplete="email"
                                value={registro.email} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'email')} aria-invalid={!!erroresRegistro.email} />
                            <ErrorCampo mensaje={erroresRegistro.email} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="regTelefono" className="form-label">Teléfono</label>
                            <input type="tel" id="regTelefono" name="telefono" placeholder="+569 1234 5678" autoComplete="tel"
                                value={registro.telefono} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'telefono')} aria-invalid={!!erroresRegistro.telefono} />
                            <ErrorCampo mensaje={erroresRegistro.telefono} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="regDireccion" className="form-label">Dirección</label>
                            <input type="text" id="regDireccion" name="direccion" placeholder="Calle, número, comuna" autoComplete="street-address"
                                value={registro.direccion} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'direccion')} aria-invalid={!!erroresRegistro.direccion} />
                            <ErrorCampo mensaje={erroresRegistro.direccion} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="regPassword" className="form-label">Contraseña</label>
                            <input type="password" id="regPassword" name="password" autoComplete="new-password"
                                value={registro.password} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'password')} aria-invalid={!!erroresRegistro.password} />
                            <ErrorCampo mensaje={erroresRegistro.password} />
                            <div className="form-text">Mínimo 8 caracteres, con una mayúscula, una minúscula y un número.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="regPassword2" className="form-label">Repite la contraseña</label>
                            <input type="password" id="regPassword2" name="password2" autoComplete="new-password"
                                value={registro.password2} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'password2')} aria-invalid={!!erroresRegistro.password2} />
                            <ErrorCampo mensaje={erroresRegistro.password2} />
                        </div>

                        <div className="form-check mb-3">
                            <input type="checkbox" id="regContratista" name="contratista" className="form-check-input"
                                checked={registro.contratista} onChange={handleChangeRegistro} />
                            <label htmlFor="regContratista" className="form-check-label">Soy contratista o maestro de obra</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Crear cuenta</button>
                        <p className="form-text text-center mb-0 mt-3">¿Ya tienes cuenta? <Link to="/login">Entrar</Link></p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Registro;
