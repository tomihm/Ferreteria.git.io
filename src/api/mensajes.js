import { pedir } from './cliente.js';
import { fecha } from './formatos.js';

export function enviarMensaje(datos) {
    return pedir('/api/mensajes', { metodo: 'POST', cuerpo: datos });
}

export async function cargarMensajes() {
    const datos = await pedir('/api/mensajes?size=100');
    return datos.content.map((m) => ({ ...m, fecha: fecha(m.fecha) }));
}
