const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const peso = (valor) => `$${Number(valor ?? 0).toLocaleString('es-CL')}`;

export function fecha(iso) {
    if (!iso) return '';
    const [anio, mes, dia] = iso.slice(0, 10).split('-');
    return `${dia}-${mes}-${anio}`;
}

export function fechaLarga(iso) {
    const [, mes, dia] = iso.slice(0, 10).split('-');
    return `${Number(dia)} de ${MESES[Number(mes) - 1]}`;
}

export const estadosPedido = {
    PENDIENTE: { texto: 'Pendiente', clase: 'text-bg-secondary' },
    EN_PREPARACION: { texto: 'En preparación', clase: 'text-bg-info' },
    LISTO_PARA_RETIRO: { texto: 'Listo para retiro', clase: 'text-bg-primary' },
    EN_REPARTO: { texto: 'En reparto', clase: 'text-bg-primary' },
    ENTREGADO: { texto: 'Entregado', clase: 'text-bg-success' }
};

export function estadoDelPedido(factura) {
    if (factura.estado === 'ANULADA') return { texto: 'Anulado', clase: 'text-bg-danger' };
    return estadosPedido[factura.estadoPedido] ?? estadosPedido.PENDIENTE;
}

export const formaDePago = (factura) => (factura.formaPago === 'CREDITO' ? 'Crédito a 30 días' : 'Webpay');
