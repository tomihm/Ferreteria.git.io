import { Navigate, useLocation } from 'react-router-dom';
import { useSesion } from '../context/SesionContext.jsx';

// sin sesion manda a iniciar sesion; con otro rol manda al inicio
function RutaProtegida({ roles, children }) {
    const { usuario } = useSesion();
    const { pathname } = useLocation();

    if (!usuario) return <Navigate to="/login" replace state={{ desde: pathname }} />;
    if (!roles.includes(usuario.rol)) return <Navigate to="/" replace />;

    return children;
}

export default RutaProtegida;
