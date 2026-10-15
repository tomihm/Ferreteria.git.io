const RETRASO_MOCK_MS = 50;

const resumen = [
    { label: 'Productos en catálogo', valor: '832' },
    { label: 'Pedidos del mes', valor: '47' },
    { label: 'Clientes activos', valor: '128' },
    { label: 'Ventas del mes', valor: '$4.382.150' }
];

const inventarioInicial = [
    { codigo: 'CON-001', producto: 'Saco de Cemento Melón 25kg', precio: '$5.490', stock: 120, minimo: 30 },
    { codigo: 'CON-005', producto: 'Fierro Estriado 8mm x 6m', precio: '$4.290', stock: 8, minimo: 25 },
    { codigo: 'HER-001', producto: 'Taladro Percutor 750W', precio: '$54.990', stock: 14, minimo: 5 },
    { codigo: 'MAN-004', producto: 'Huincha de Medir 5m', precio: '$4.990', stock: 4, minimo: 20 },
    { codigo: 'GEN-006', producto: 'Escalera Tijera Aluminio', precio: '$42.990', stock: 0, minimo: 4 },
    { codigo: 'GEN-003', producto: 'Guantes de Cabritilla', precio: '$3.990', stock: 2, minimo: 25 },
    { codigo: 'HER-004', producto: 'Atornillador Inalámbrico 12V', precio: '$44.990', stock: 3, minimo: 6 },
    { codigo: 'ELE-004', producto: 'Enchufe Doble Embutido', precio: '$3.490', stock: 5, minimo: 20 }
];

const pedidosIniciales = [
    { numero: '#1003', cliente: 'María Rojas', fecha: '01-09-2026', entrega: 'Retiro en tienda', total: '$14.940', pago: 'Contado', estado: 'Pendiente' },
    { numero: '#1002', cliente: 'Juan Pérez', fecha: '28-08-2026', entrega: 'Retiro en tienda', total: '$78.960', pago: 'Cuenta corriente', estado: 'En preparación' },
    { numero: '#1001', cliente: 'Juan Pérez', fecha: '20-08-2026', entrega: 'Despacho', total: '$109.800', pago: 'Cuenta corriente', estado: 'Entregado' }
];

const estadosPedido = ['Pendiente', 'En preparación', 'Listo para retiro', 'En reparto', 'Entregado'];

const usuariosIniciales = [
    { rut: '11.111.111-1', nombre: 'Carlos Muñoz', email: 'admin@losmaestros.cl', rol: 'Administrador', cuenta: null },
    { rut: '22.222.222-2', nombre: 'Pedro Muñoz', email: 'vendedor@losmaestros.cl', rol: 'Vendedor', cuenta: null },
    { rut: '33.333.333-3', nombre: 'Juan Pérez', email: 'contratista@correo.cl', rol: 'Contratista', cuenta: '$188.760' },
    { rut: '44.444.444-4', nombre: 'María Rojas', email: 'cliente@correo.cl', rol: 'Cliente', cuenta: null }
];

const roles = ['Administrador', 'Vendedor', 'Contratista', 'Cliente'];

const masVendidos = [
    { puesto: 1, producto: 'Saco de Cemento Melón 25kg', unidades: '412', monto: '$2.261.880' },
    { puesto: 2, producto: 'Ladrillo Fiscal', unidades: '2.850', monto: '$1.396.500' },
    { puesto: 3, producto: 'Ampolleta LED 12W E27', unidades: '186', monto: '$463.140' },
    { puesto: 4, producto: 'Tornillo Volcanita 6x1"', unidades: '94', monto: '$328.060' },
    { puesto: 5, producto: 'Silicona Transparente 280ml', unidades: '71', monto: '$304.590' }
];

const clientesFrecuentes = [
    { puesto: 1, cliente: 'Constructora Andes Ltda.', pedidos: 18, total: '$1.842.300' },
    { puesto: 2, cliente: 'Juan Pérez', pedidos: 12, total: '$986.450' },
    { puesto: 3, cliente: 'Maestro Rodrigo Silva', pedidos: 9, total: '$612.800' },
    { puesto: 4, cliente: 'María Rojas', pedidos: 5, total: '$148.920' }
];

const porCobrar = [
    { rut: '76.543.210-8', cliente: 'Constructora Andes Ltda.', telefono: '+56 9 8877 6655', saldo: '$542.180' },
    { rut: '33.333.333-3', cliente: 'Juan Pérez', telefono: '+56 9 1122 3344', saldo: '$188.760' },
    { rut: '15.876.432-K', cliente: 'Maestro Rodrigo Silva', telefono: '+56 9 4455 6677', saldo: '$97.340' }
];

export function cargarPanel() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                resumen,
                inventario: inventarioInicial.map((item) => ({ ...item })),
                pedidos: pedidosIniciales.map((pedido) => ({ ...pedido })),
                estadosPedido,
                usuarios: usuariosIniciales.map((usuario) => ({ ...usuario })),
                roles,
                masVendidos,
                clientesFrecuentes,
                porCobrar
            });
        }, RETRASO_MOCK_MS);
    });
}
