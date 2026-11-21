const URL_API = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

function leerToken() {
    try {
        return JSON.parse(localStorage.getItem('sesion'))?.token ?? null;
    } catch {
        return null;
    }
}

export async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
    const headers = {};
    const token = leerToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';

    let respuesta;
    try {
        respuesta = await fetch(`${URL_API}${ruta}`, {
            method: metodo,
            headers,
            body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined
        });
    } catch {
        throw new Error('No pudimos conectar con el servidor. Intenta de nuevo en unos minutos.');
    }

    if (respuesta.status === 204) return null;
    const datos = await respuesta.json().catch(() => null);
    if (!respuesta.ok) {
        const error = new Error(datos?.mensaje ?? 'Ocurrió un error, intenta de nuevo.');
        error.status = respuesta.status;
        error.errores = datos?.errores ?? null;
        throw error;
    }
    return datos;
}
