const RETRASO_MOCK_MS = 50;

// los mensajes del formulario de contacto se guardan en el navegador
// para que el admin los vea en el panel, hasta que exista el backend
const CLAVE_STORAGE = 'mensajes';

const mensajesIniciales = [
    { id: 'm-2', fecha: '02-09-2026', nombre: 'Rodrigo Silva', email: 'rsilva@correo.cl', telefono: '+56944556677', motivo: 'Cotización de materiales', mensaje: 'Necesito cotizar 40 sacos de cemento y 15 fierros de 8mm para una ampliación en Coquimbo.' },
    { id: 'm-1', fecha: '30-08-2026', nombre: 'Ana Torres', email: 'ana.torres@correo.cl', telefono: '+56911223344', motivo: 'Consulta de stock', mensaje: '¿Cuándo vuelve a llegar la escalera tijera de aluminio?' }
];

function leerGuardados() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) ?? [];
    } catch {
        return [];
    }
}

export function enviarMensaje(datos) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const nuevo = { ...datos, id: `m-${Date.now()}`, fecha: new Date().toLocaleDateString('es-CL').replaceAll('/', '-') };
            try {
                localStorage.setItem(CLAVE_STORAGE, JSON.stringify([nuevo, ...leerGuardados()]));
            } catch {
                // si el navegador no deja guardar, el mensaje se pierde
            }
            resolve(nuevo);
        }, RETRASO_MOCK_MS);
    });
}

// los mas nuevos primero
export function leerMensajes() {
    return [...leerGuardados(), ...mensajesIniciales];
}
