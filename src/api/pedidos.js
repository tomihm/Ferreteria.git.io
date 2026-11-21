import { pedir } from './cliente.js';

export function emitirPedido({ usuarioId, items, credito, entrega }) {
    return pedir('/api/facturas', {
        metodo: 'POST',
        cuerpo: {
            usuarioId,
            formaPago: credito ? 'CREDITO' : 'WEBPAY',
            entrega,
            lineas: items.map((item) => ({ sku: item.codigo, cantidad: Number(item.cantidad) }))
        }
    });
}

export async function cargarMisFacturas() {
    const datos = await pedir('/api/facturas/mias?size=100');
    return datos.content;
}

export function cargarMiCredito() {
    return pedir('/api/credito/mio');
}
