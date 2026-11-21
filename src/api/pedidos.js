import { pedir } from './cliente.js';
import { estadoDelPedido, fecha, fechaLarga, formaDePago, peso } from './formatos.js';

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

function aPedido(factura) {
    const estado = estadoDelPedido(factura);
    return {
        numero: `#${factura.numero}`,
        fecha: fecha(factura.fecha),
        entrega: factura.entrega ?? 'Retiro en tienda',
        estado: estado.texto,
        claseBadge: estado.clase,
        pago: formaDePago(factura),
        total: peso(factura.total),
        items: factura.lineas.map((linea) => ({
            producto: linea.nombreProducto,
            cantidad: linea.cantidad,
            precio: peso(linea.precioUnitario),
            subtotal: peso(linea.subtotal)
        }))
    };
}

function estadoDeFactura(factura) {
    if (factura.estado === 'ANULADA') return { texto: 'Anulada', clase: 'text-bg-danger' };
    if (factura.pagada) return { texto: 'Pagada', clase: 'text-bg-success' };
    return { texto: 'Pendiente', clase: 'text-bg-warning' };
}

export async function cargarMisPedidos(rol) {
    const facturas = await cargarMisFacturas();
    const pedidos = facturas.map(aPedido);
    if (rol !== 'contratista') return { pedidos };

    const cuenta = await cargarMiCredito();
    const aCredito = facturas.filter((f) => f.formaPago === 'CREDITO');
    const vencimientos = aCredito
        .filter((f) => f.estado !== 'ANULADA' && !f.pagada && f.vence)
        .map((f) => f.vence)
        .sort();

    return {
        credito: [
            { label: 'Crédito aprobado', valor: peso(cuenta.cupo) },
            { label: 'Saldo pendiente', valor: peso(cuenta.saldo) },
            { label: 'Cupo disponible', valor: peso(cuenta.disponible) },
            { label: 'Próximo vencimiento', valor: vencimientos.length > 0 ? fechaLarga(vencimientos[0]) : 'Sin pagos pendientes' }
        ],
        facturas: aCredito.map((f) => {
            const estado = estadoDeFactura(f);
            return {
                numero: `F-${f.numero}`,
                fecha: fecha(f.fecha),
                pedido: `#${f.numero}`,
                monto: peso(f.total),
                vence: fecha(f.vence),
                estado: estado.texto,
                claseBadge: estado.clase
            };
        }),
        movimientos: cuenta.movimientos.map((m) => ({
            fecha: fecha(m.fecha),
            documento: m.documento,
            detalle: m.detalle,
            cargo: peso(m.cargo),
            abono: peso(m.abono),
            saldo: peso(m.saldo)
        })),
        pedidos
    };
}
