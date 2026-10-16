const RETRASO_MOCK_MS = 50;

const kpis = [
    { label: 'Saldo pendiente', valor: '$188.760' },
    { label: 'Modalidad', valor: 'Cuenta corriente' },
    { label: 'Fecha de cobro', valor: '30 de septiembre' },
    { label: 'Cupo disponible', valor: '$311.240' }
];

const movimientos = [
    { fecha: '20-08-2026', documento: 'Pedido #1001', detalle: 'Compra de materiales', cargo: '$109.800', abono: '$0', saldo: '$109.800' },
    { fecha: '28-08-2026', documento: 'Pedido #1002', detalle: 'Compra de herramientas', cargo: '$78.960', abono: '$0', saldo: '$188.760' },
    { fecha: '31-08-2026', documento: 'Pago', detalle: 'Transferencia bancaria', cargo: '$0', abono: '$0', saldo: '$188.760' }
];

const pedidos = [
    {
        numero: '#1002',
        fecha: '28-08-2026',
        entrega: 'Retiro en tienda',
        estado: 'En preparación',
        claseBadge: 'text-bg-info',
        pago: 'Cuenta corriente',
        total: '$78.960',
        items: [
            { producto: 'Taladro Percutor 750W', cantidad: 1, precio: '$54.990', subtotal: '$54.990' },
            { producto: 'Martillo Carpintero 16oz', cantidad: 3, precio: '$7.990', subtotal: '$23.970' }
        ]
    },
    {
        numero: '#1001',
        fecha: '20-08-2026',
        entrega: 'Despacho a Los Aromos 455, Coquimbo',
        estado: 'Entregado',
        claseBadge: 'text-bg-success',
        pago: 'Cuenta corriente',
        total: '$109.800',
        items: [
            { producto: 'Saco de Cemento Melón 25kg', cantidad: 20, precio: '$5.490', subtotal: '$109.800' }
        ]
    }
];

export function cargarMisPedidos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                kpis,
                movimientos,
                pedidos: pedidos.map((pedido) => ({
                    ...pedido,
                    items: pedido.items.map((item) => ({ ...item }))
                }))
            });
        }, RETRASO_MOCK_MS);
    });
}
