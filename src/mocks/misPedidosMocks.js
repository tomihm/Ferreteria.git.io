const RETRASO_MOCK_MS = 50;

// ------------------ Contratista: compra a plazo con credito de la empresa ------------------

const credito = [
    { label: 'Crédito aprobado', valor: '$500.000' },
    { label: 'Saldo pendiente', valor: '$188.760' },
    { label: 'Cupo disponible', valor: '$311.240' },
    { label: 'Próximo vencimiento', valor: '30 de septiembre' }
];

const facturas = [
    { numero: 'F-20418', fecha: '28-08-2026', pedido: '#1002', monto: '$78.960', vence: '27-09-2026', estado: 'Pendiente', claseBadge: 'text-bg-warning' },
    { numero: 'F-20377', fecha: '20-08-2026', pedido: '#1001', monto: '$109.800', vence: '19-09-2026', estado: 'Pendiente', claseBadge: 'text-bg-warning' },
    { numero: 'F-20190', fecha: '15-07-2026', pedido: '#0987', monto: '$64.300', vence: '14-08-2026', estado: 'Pagada', claseBadge: 'text-bg-success' }
];

const movimientos = [
    { fecha: '14-08-2026', documento: 'Pago F-20190', detalle: 'Transferencia bancaria', cargo: '$0', abono: '$64.300', saldo: '$0' },
    { fecha: '20-08-2026', documento: 'F-20377', detalle: 'Compra de materiales', cargo: '$109.800', abono: '$0', saldo: '$109.800' },
    { fecha: '28-08-2026', documento: 'F-20418', detalle: 'Compra de herramientas', cargo: '$78.960', abono: '$0', saldo: '$188.760' }
];

const pedidosContratista = [
    {
        numero: '#1002',
        fecha: '28-08-2026',
        entrega: 'Retiro en tienda',
        estado: 'En preparación',
        claseBadge: 'text-bg-info',
        pago: 'Crédito a 30 días',
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
        pago: 'Crédito a 30 días',
        total: '$109.800',
        items: [
            { producto: 'Saco de Cemento Melón 25kg', cantidad: 20, precio: '$5.490', subtotal: '$109.800' }
        ]
    }
];

// ------------------ Cliente: compra normal por la web ------------------

const pedidosCliente = [
    {
        numero: '#1003',
        fecha: '01-09-2026',
        entrega: 'Retiro en tienda',
        estado: 'Pendiente',
        claseBadge: 'text-bg-secondary',
        pago: 'Webpay',
        total: '$13.740',
        items: [
            { producto: 'Silicona Transparente 280ml', cantidad: 2, precio: '$4.290', subtotal: '$8.580' },
            { producto: 'Cinta Aisladora Negra 20m', cantidad: 4, precio: '$1.290', subtotal: '$5.160' }
        ]
    }
];

const copiarPedidos = (pedidos) => pedidos.map((pedido) => ({
    ...pedido,
    items: pedido.items.map((item) => ({ ...item }))
}));

// el contratista ve su credito, facturas y movimientos; el cliente solo sus pedidos
export function cargarMisPedidos(rol) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (rol === 'contratista') {
                resolve({
                    credito,
                    facturas: facturas.map((f) => ({ ...f })),
                    movimientos,
                    pedidos: copiarPedidos(pedidosContratista)
                });
            } else {
                resolve({ pedidos: copiarPedidos(pedidosCliente) });
            }
        }, RETRASO_MOCK_MS);
    });
}
