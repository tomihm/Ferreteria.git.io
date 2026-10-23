import { createContext, useContext, useEffect, useState } from 'react';
import { iniciarSesion } from '../mocks/usuariosMocks.js';

// sin provider (por ejemplo en algunos tests) se comporta como sesion cerrada
const SesionContext = createContext({ usuario: null, entrar: async () => null, salir: () => {} });

const CLAVE_STORAGE = 'sesion';

function leerSesionGuardada() {
    try {
        const guardada = localStorage.getItem(CLAVE_STORAGE);
        return guardada ? JSON.parse(guardada) : null;
    } catch {
        return null;
    }
}

export function SesionProvider({ children }) {
    const [usuario, setUsuario] = useState(leerSesionGuardada);

    useEffect(() => {
        try {
            if (usuario) localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuario));
            else localStorage.removeItem(CLAVE_STORAGE);
        } catch {
            // si el navegador no deja guardar, la sesion dura hasta recargar
        }
    }, [usuario]);

    const entrar = async (email, password) => {
        const encontrado = await iniciarSesion(email, password);
        setUsuario(encontrado);
        return encontrado;
    };

    const salir = () => {
        setUsuario(null);
    };

    return (
        <SesionContext.Provider value={{ usuario, entrar, salir }}>
            {children}
        </SesionContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSesion() {
    return useContext(SesionContext);
}
