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
    if (errores[campo]) return 'invalido';
    if (errores[campo] === null) return 'valido';
    return '';
}

function ErrorCampo({ mensaje }) {
    return <p className={mensaje ? 'campo__error visible' : 'campo__error'}>{mensaje}</p>;
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
        <section className="seccion">
            <div className="contenedor">
                <div className="formulario formulario--angosto">

                    <nav className="tabs">
                        <Link to="/login" className="activo">Entrar</Link>
                        <a href="#registro">Crear cuenta</a>
                    </nav>

                    <form onSubmit={handleSubmitLogin} noValidate>
                        <h1 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Entra a tu cuenta</h1>
                        <p style={{ color: 'var(--gris-500)', fontSize: '.9rem', marginBottom: '18px' }}>Para revisar tus pedidos y tu cuenta corriente.</p>

                        {avisoLogin && <div className={`alerta alerta--${avisoLogin.tipo}`}>{avisoLogin.texto}</div>}

                        <div className="campo">
                            <label htmlFor="loginEmail">Correo electrónico</label>
                            <input type="email" id="loginEmail" name="email" autoComplete="email" placeholder="nombre@correo.cl"
                                value={login.email} onChange={handleChangeLogin} onBlur={handleBlurLogin}
                                className={claseCampo(erroresLogin, 'email')} aria-invalid={!!erroresLogin.email} />
                            <ErrorCampo mensaje={erroresLogin.email} />
                        </div>

                        <div className="campo">
                            <label htmlFor="loginPassword">Contraseña</label>
                            <input type="password" id="loginPassword" name="password" autoComplete="current-password"
                                value={login.password} onChange={handleChangeLogin} onBlur={handleBlurLogin}
                                className={claseCampo(erroresLogin, 'password')} aria-invalid={!!erroresLogin.password} />
                            <ErrorCampo mensaje={erroresLogin.password} />
                        </div>

                        <button type="submit" className="btn btn--primario btn--bloque">Entrar</button>
                    </form>

                    <hr style={{ margin: '34px 0', border: 0, borderTop: '2px solid var(--gris-200)' }} />

                    <form onSubmit={handleSubmitRegistro} noValidate>
                        <h2 id="registro" style={{ fontSize: '1.4rem', marginBottom: '4px', scrollMarginTop: '90px' }}>Crea tu cuenta</h2>
                        <p style={{ color: 'var(--gris-500)', fontSize: '.9rem', marginBottom: '18px' }}>Toma un minuto y te deja comprar en línea.</p>

                        {avisoRegistro && <div className={`alerta alerta--${avisoRegistro.tipo}`}>{avisoRegistro.texto}</div>}

                        <div className="campo">
                            <label htmlFor="regNombre">Nombre y apellido</label>
                            <input type="text" id="regNombre" name="nombre" autoComplete="name"
                                value={registro.nombre} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'nombre')} aria-invalid={!!erroresRegistro.nombre} />
                            <ErrorCampo mensaje={erroresRegistro.nombre} />
                        </div>

                        <div className="campo">
                            <label htmlFor="regRut">RUT</label>
                            <input type="text" id="regRut" name="rut" placeholder="12.345.678-9" maxLength={12}
                                value={registro.rut} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'rut')} aria-invalid={!!erroresRegistro.rut} />
                            <ErrorCampo mensaje={erroresRegistro.rut} />
                            <p className="campo__ayuda">Se valida el dígito verificador.</p>
                        </div>

                        <div className="campo">
                            <label htmlFor="regEmail">Correo electrónico</label>
                            <input type="email" id="regEmail" name="email" autoComplete="email"
                                value={registro.email} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'email')} aria-invalid={!!erroresRegistro.email} />
                            <ErrorCampo mensaje={erroresRegistro.email} />
                        </div>

                        <div className="campo">
                            <label htmlFor="regTelefono">Teléfono</label>
                            <input type="tel" id="regTelefono" name="telefono" placeholder="+569 1234 5678" autoComplete="tel"
                                value={registro.telefono} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'telefono')} aria-invalid={!!erroresRegistro.telefono} />
                            <ErrorCampo mensaje={erroresRegistro.telefono} />
                        </div>

                        <div className="campo">
                            <label htmlFor="regDireccion">Dirección</label>
                            <input type="text" id="regDireccion" name="direccion" placeholder="Calle, número, comuna" autoComplete="street-address"
                                value={registro.direccion} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'direccion')} aria-invalid={!!erroresRegistro.direccion} />
                            <ErrorCampo mensaje={erroresRegistro.direccion} />
                        </div>

                        <div className="campo">
                            <label htmlFor="regPassword">Contraseña</label>
                            <input type="password" id="regPassword" name="password" autoComplete="new-password"
                                value={registro.password} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'password')} aria-invalid={!!erroresRegistro.password} />
                            <ErrorCampo mensaje={erroresRegistro.password} />
                            <p className="campo__ayuda">Mínimo 8 caracteres, con una mayúscula, una minúscula y un número.</p>
                        </div>

                        <div className="campo">
                            <label htmlFor="regPassword2">Repite la contraseña</label>
                            <input type="password" id="regPassword2" name="password2" autoComplete="new-password"
                                value={registro.password2} onChange={handleChangeRegistro} onBlur={handleBlurRegistro}
                                className={claseCampo(erroresRegistro, 'password2')} aria-invalid={!!erroresRegistro.password2} />
                            <ErrorCampo mensaje={erroresRegistro.password2} />
                        </div>

                        <div className="campo campo--check">
                            <input type="checkbox" id="regContratista" name="contratista"
                                checked={registro.contratista} onChange={handleChangeRegistro} />
                            <label htmlFor="regContratista">Soy contratista o maestro de obra</label>
                        </div>

                        <button type="submit" className="btn btn--primario btn--bloque">Crear cuenta</button>
                    </form>

                </div>
            </div>
        </section>
    );
}

export default Login;
