import { useState } from 'react';
import { Link } from 'react-router-dom';
import Validar from '../utils/validaciones.js';

const loginInicial = {
    email: '',
    password: ''
};

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

const reglasLogin = {
    email: Validar.email,
    password: Validar.requerido
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

function validarTodo(reglas, form) {
    const errores = {};
    Object.keys(reglas).forEach((campo) => {
        errores[campo] = reglas[campo](form[campo], form);
    });
    return errores;
}

function hayErrores(errores) {
    return Object.values(errores).some((err) => err !== null);
}

function claseCampo(errores, campo) {
    if (errores[campo]) return 'form-control is-invalid';
    if (errores[campo] === null) return 'form-control is-valid';
    return 'form-control';
}

function ErrorCampo({ mensaje }) {
    return <div className="invalid-feedback">{mensaje}</div>;
}

function Login() {
    const [login, setLogin] = useState(loginInicial);
    const [erroresLogin, setErroresLogin] = useState({});
    const [avisoLogin, setAvisoLogin] = useState(null);

    const [registro, setRegistro] = useState(registroInicial);
    const [erroresRegistro, setErroresRegistro] = useState({});
    const [avisoRegistro, setAvisoRegistro] = useState(null);

    // ------------------ Inicio de sesión ------------------

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;
        const nuevo = { ...login, [name]: value };
        setLogin(nuevo);

        if (erroresLogin[name]) {
            setErroresLogin({ ...erroresLogin, [name]: reglasLogin[name](value, nuevo) });
        }
    };

    const handleBlurLogin = (e) => {
        const { name, value } = e.target;
        setErroresLogin({ ...erroresLogin, [name]: reglasLogin[name](value, login) });
    };

    const handleSubmitLogin = (e) => {
        e.preventDefault();

        const nuevosErrores = validarTodo(reglasLogin, login);
        setErroresLogin(nuevosErrores);

        if (hayErrores(nuevosErrores)) {
            setAvisoLogin({ tipo: 'error', texto: 'Revisa el correo y la contraseña.' });
            return;
        }

        // TODO: conectar con el backend
        setAvisoLogin({ tipo: 'exito', texto: 'Datos válidos. El inicio de sesión se conectará al backend en la siguiente etapa.' });
        setLogin(loginInicial);
        setErroresLogin({});
    };

    // ------------------ Registro ------------------

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

                    <nav className="nav nav-pills nav-fill mb-4">
                        <Link to="/login" className="nav-link active" aria-current="page">Entrar</Link>
                        <a href="#registro" className="nav-link">Crear cuenta</a>
                    </nav>

                    <form onSubmit={handleSubmitLogin} noValidate>
                        <h1 className="h4 mb-1">Entra a tu cuenta</h1>
                        <p className="text-body-secondary small mb-3">Para revisar tus pedidos y tu cuenta corriente.</p>

                        {avisoLogin && <div className={`alert ${avisoLogin.tipo === 'exito' ? 'alert-success' : 'alert-danger'}`} role="alert">{avisoLogin.texto}</div>}

                        <div className="mb-3">
                            <label htmlFor="loginEmail" className="form-label">Correo electrónico</label>
                            <input type="email" id="loginEmail" name="email" autoComplete="email" placeholder="nombre@correo.cl"
                                value={login.email} onChange={handleChangeLogin} onBlur={handleBlurLogin}
                                className={claseCampo(erroresLogin, 'email')} aria-invalid={!!erroresLogin.email} />
                            <ErrorCampo mensaje={erroresLogin.email} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="loginPassword" className="form-label">Contraseña</label>
                            <input type="password" id="loginPassword" name="password" autoComplete="current-password"
                                value={login.password} onChange={handleChangeLogin} onBlur={handleBlurLogin}
                                className={claseCampo(erroresLogin, 'password')} aria-invalid={!!erroresLogin.password} />
                            <ErrorCampo mensaje={erroresLogin.password} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Entrar</button>
                    </form>

                    <hr className="my-5" />

                    <form onSubmit={handleSubmitRegistro} noValidate>
                        <h2 id="registro" className="h4 mb-1 ancla">Crea tu cuenta</h2>
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
                    </form>

                </div>
            </div>
        </section>
    );
}

export default Login;
