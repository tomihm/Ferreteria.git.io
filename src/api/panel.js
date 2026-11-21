import { pedir } from './cliente.js';
import { estadoDelPedido, estadosPedido, fecha, formaDePago, peso } from './formatos.js';
import { leerMensajes } from '../mocks/mensajesMocks.js';

const roles = { ADMIN: 'Administrador', VENDEDOR: 'Vendedor', CONTRATISTA: 'Contratista', CLIENTE: 'Cliente' };

const claveDe = (lista, texto) => Object.keys(lista).find((clave) => (lista[clave].texto ?? lista[clave]) === texto);

const esDelMes = (iso, hoy) => iso.slice(0, 7) === hoy.toISOString().slice(0, 7);

function ranking(facturas, clave, valores) {
    const acumulado = {};
    for (const factura of facturas) {
        for (const item of valores(factura)) {
            const fila = acumulado[item[clave]] ?? { [clave]: item[clave], cantidad: 0, monto: 0 };
            fila.cantidad += item.cantidad;
            fila.monto += item.monto;
            acumulado[item[clave]] = fila;
        }
    }
    return Object.values(acumulado).sort((a, b) => b.monto - a.monto).slice(0, 5);
}

export async function cargarPanel() {
    const [productos, inventario, facturas, usuarios, creditos] = await Promise.all([
        pedir('/api/productos?size=500'),
        pedir('/api/inventario?size=500'),
        pedir('/api/facturas?size=500'),
        pedir('/api/usuarios?size=500'),
        pedir('/api/credito')
    ]);

    const precioPorSku = Object.fromEntries(productos.content.map((p) => [p.sku, p.precio]));
    const creditoPorUsuario = Object.fromEntries(creditos.map((c) => [c.usuarioId, c]));
    const validas = facturas.content.filter((f) => f.estado !== 'ANULADA');
    const hoy = new Date();
    const delMes = validas.filter((f) => esDelMes(f.fecha, hoy));

    const masVendidos = ranking(validas, 'producto', (f) => f.lineas.map((l) => ({ producto: l.nombreProducto, cantidad: l.cantidad, monto: l.subtotal })));
    const clientesFrecuentes = ranking(validas, 'cliente', (f) => [{ cliente: f.clienteNombre, cantidad: 1, monto: f.total }]);

    return {
        resumen: [
            { label: 'Productos en catálogo', valor: String(productos.content.length) },
            { label: 'Pedidos del mes', valor: String(delMes.length) },
            { label: 'Clientes activos', valor: String(usuarios.content.filter((u) => u.rol === 'CLIENTE' || u.rol === 'CONTRATISTA').length) },
            { label: 'Ventas del mes', valor: peso(delMes.reduce((total, f) => total + f.total, 0)) }
        ],
        inventario: inventario.content.map((i) => ({
            codigo: i.sku,
            producto: i.nombreProducto,
            precio: peso(precioPorSku[i.sku]),
            stock: i.cantidad,
            minimo: i.stockMinimo
        })),
        pedidos: facturas.content.map((f) => ({
            id: f.numero,
            numero: `#${f.numero}`,
            cliente: f.clienteNombre,
            fecha: fecha(f.fecha),
            entrega: f.entrega ?? 'Retiro en tienda',
            total: peso(f.total),
            pago: formaDePago(f),
            porPagar: f.formaPago === 'CREDITO' && !f.pagada && f.estado !== 'ANULADA',
            anulado: f.estado === 'ANULADA',
            estado: estadoDelPedido(f).texto
        })),
        estadosPedido: Object.values(estadosPedido).map((e) => e.texto),
        usuarios: usuarios.content.map((u) => ({
            id: u.id,
            rut: u.rut ?? '—',
            nombre: u.nombre,
            email: u.email,
            rol: roles[u.rol],
            cupo: creditoPorUsuario[u.id]?.cupo ?? 0,
            cuenta: creditoPorUsuario[u.id] ? peso(creditoPorUsuario[u.id].saldo) : null,
            datos: u
        })),
        roles: Object.values(roles),
        masVendidos: masVendidos.map((m, i) => ({ puesto: i + 1, producto: m.producto, unidades: m.cantidad.toLocaleString('es-CL'), monto: peso(m.monto) })),
        clientesFrecuentes: clientesFrecuentes.map((c, i) => ({ puesto: i + 1, cliente: c.cliente, pedidos: c.cantidad, total: peso(c.monto) })),
        porCobrar: creditos.filter((c) => c.saldo > 0).map((c) => ({ rut: c.rut ?? '—', cliente: c.nombre, telefono: c.telefono ?? '—', saldo: peso(c.saldo) })),
        mensajes: leerMensajes()
    };
}

export function guardarStock(item) {
    return pedir(`/api/inventario/${item.codigo}`, {
        metodo: 'PUT',
        cuerpo: { sku: item.codigo, cantidad: item.stock, stockMinimo: item.minimo }
    });
}

export function cambiarEstadoPedido(id, estado) {
    return pedir(`/api/facturas/${id}/estado`, { metodo: 'PATCH', cuerpo: { estado: claveDe(estadosPedido, estado) } });
}

export function registrarPago(id) {
    return pedir(`/api/facturas/${id}/pagar`, { metodo: 'POST' });
}

export function cambiarRol(usuario, rol) {
    return pedir(`/api/usuarios/${usuario.id}`, { metodo: 'PUT', cuerpo: { ...usuario.datos, rol: claveDe(roles, rol) } });
}

export function asignarCupo(id, cupo) {
    return pedir(`/api/credito/${id}`, { metodo: 'PUT', cuerpo: { cupo } });
}
