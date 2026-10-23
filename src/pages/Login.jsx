import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Validar from '../utils/validaciones.js';
import { validarTodo, hayErrores, claseCampo } from '../utils/formularios.js';
import { useSesion } from '../context/SesionContext.jsx';

const loginInicial = {
    email: '',
    password: ''
};

const reglasLogin = {
    email: Validar.email,
    password: Validar.requerido
};

const paginaDeRol = (rol) => (rol === 'admin' ? '/panel' : '/mis-pedidos');

function ErrorCampo({ mensaje }) {
    return <div className="invalid-feedback">{mensaje}</div>;
}

function Login() {
    const [login, setLogin] = useState(loginInicial);
    const [erroresLogin, setErroresLogin] = useState({});
    const [avisoLogin, setAvisoLogin] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const { usuario, entrar } = useSesion();
    const navigate = useNavigate();
    const { state } = useLocation();

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

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        const nuevosErrores = validarTodo(reglasLogin, login);
        setErroresLogin(nuevosErrores);

        if (hayErrores(nuevosErrores)) {
            setAvisoLogin({ tipo: 'error', texto: 'Revisa el correo y la contraseña.' });
            return;
        }

        setEnviando(true);
        try {
            const encontrado = await entrar(login.email, login.password);
            // si venia de una pagina protegida vuelve ahi, si no a la de su rol
            navigate(state?.desde ?? paginaDeRol(encontrado.rol), { replace: true });
        } catch (error) {
            setAvisoLogin({ tipo: 'error', texto: error.message });
            setEnviando(false);
        }
    };

    // si ya entro no tiene sentido mostrar el formulario
    if (usuario && !enviando) return <Navigate to={paginaDeRol(usuario.rol)} replace />;

    return (
        <section className="py-5">
            <div className="container">
                <div className="card card-body p-4 mx-auto formulario-angosto">
                    <form onSubmit={handleSubmitLogin} noValidate>
                        <h1 className="h4 mb-1">Entra a tu cuenta</h1>
                        <p className="text-body-secondary small mb-3">Para revisar tus pedidos, facturas y crédito.</p>

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
                            <div className="form-text">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={enviando}>{enviando ? 'Entrando...' : 'Entrar'}</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;
