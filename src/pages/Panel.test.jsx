import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Panel from './Panel.jsx';

const productos = [
    { sku: 'CON-001', nombre: 'Saco de Cemento Melón 25kg', precio: 5490 },
    { sku: 'MAN-004', nombre: 'Huincha de Medir 5m', precio: 4990 }
];
const inventario = [
    { sku: 'CON-001', nombreProducto: 'Saco de Cemento Melón 25kg', cantidad: 120, stockMinimo: 30 },
    { sku: 'MAN-004', nombreProducto: 'Huincha de Medir 5m', cantidad: 4, stockMinimo: 20 }
];
const linea = (nombreProducto, cantidad, subtotal) => ({ nombreProducto, cantidad, subtotal });
const facturas = [
    { numero: 1003, clienteNombre: 'María Rojas', fecha: '2026-09-01T10:00:00', estado: 'EMITIDA', estadoPedido: 'PENDIENTE', formaPago: 'WEBPAY', pagada: true, entrega: 'Retiro en tienda', total: 13740, lineas: [linea('Silicona Transparente 280ml', 2, 8580)] },
    { numero: 1002, clienteNombre: 'Juan Pérez', fecha: '2026-08-28T10:00:00', estado: 'EMITIDA', estadoPedido: 'EN_PREPARACION', formaPago: 'CREDITO', pagada: false, entrega: 'Retiro en tienda', total: 78960, lineas: [linea('Taladro Percutor 750W', 1, 54990)] },
    { numero: 1001, clienteNombre: 'Juan Pérez', fecha: '2026-08-20T10:00:00', estado: 'EMITIDA', estadoPedido: 'ENTREGADO', formaPago: 'CREDITO', pagada: true, entrega: 'Despacho', total: 109800, lineas: [linea('Saco de Cemento Melón 25kg', 20, 109800)] }
];
const usuarios = [
    { id: 1, nombre: 'Carlos Muñoz', email: 'admin@losmaestros.cl', rol: 'ADMIN', rut: '11.111.111-1' },
    { id: 2, nombre: 'Juan Pérez', email: 'contratista@correo.cl', rol: 'CONTRATISTA', rut: '33.333.333-3' },
    { id: 3, nombre: 'María Rojas', email: 'cliente@correo.cl', rol: 'CLIENTE', rut: '44.444.444-4' }
];
const creditos = [{ usuarioId: 2, nombre: 'Juan Pérez', rut: '33.333.333-3', telefono: '+56911223344', cupo: 500000, saldo: 78960, disponible: 421040 }];

let enviados = [];
let mensajes = [];

function backendResponde() {
    vi.stubGlobal('fetch', (url, opciones = {}) => {
        if (opciones.method && opciones.method !== 'GET') {
            enviados.push({ url, metodo: opciones.method, cuerpo: opciones.body && JSON.parse(opciones.body) });
            return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) });
        }
        const respuestas = {
            '/api/productos': { content: productos },
            '/api/inventario': { content: inventario },
            '/api/facturas': { content: facturas },
            '/api/usuarios': { content: usuarios },
            '/api/credito': creditos,
            '/api/mensajes': { content: mensajes }
        };
        const ruta = new URL(url).pathname;
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(respuestas[ruta]) });
    });
}

async function renderPanel() {
    backendResponde();
    render(<Panel />);
    await screen.findByRole('heading', { level: 2, name: 'Resumen' });
}

// el panel muestra una seccion a la vez, se cambia desde el menu
const irA = (seccion) => userEvent.click(screen.getByRole('button', { name: seccion }));

describe('Panel', () => {
    beforeEach(() => {
        localStorage.clear();
        enviados = [];
        mensajes = [];
    });

    afterEach(() => vi.unstubAllGlobals());

    it('muestra el titulo de la pagina', async () => {
        await renderPanel();
        expect(screen.getByRole('heading', { level: 1, name: 'Panel de gestión' })).toBeInTheDocument();
    });

    it('parte mostrando solo el resumen', async () => {
        await renderPanel();
        expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Resumen']);
        expect(screen.getByRole('button', { name: 'Resumen' })).toHaveAttribute('aria-current', 'true');
    });

    it('al elegir una opcion del menu muestra solo esa seccion', async () => {
        await renderPanel();

        for (const seccion of ['Inventario', 'Pedidos', 'Mensajes', 'Usuarios', 'Reportes']) {
            await irA(seccion);
            expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([seccion]);
            expect(screen.getByRole('button', { name: seccion })).toHaveAttribute('aria-current', 'true');
        }
    });

    it('filtra los pedidos por estado', async () => {
        await renderPanel();
        await irA('Pedidos');

        await userEvent.selectOptions(screen.getByLabelText('Filtrar por estado'), 'Entregado');

        // El pedido #1001 queda entregado, los otros dos se ocultan
        expect(screen.getByText('#1001')).toBeInTheDocument();
        expect(screen.queryByText('#1002')).not.toBeInTheDocument();
        expect(screen.queryByText('#1003')).not.toBeInTheDocument();
    });

    it('cambia el estado del pedido al usar su selector', async () => {
        await renderPanel();
        await irA('Pedidos');

        await userEvent.selectOptions(screen.getByLabelText('Estado del pedido #1003'), 'En reparto');

        expect(screen.getByLabelText('Estado del pedido #1003')).toHaveValue('En reparto');
        expect(enviados[0]).toMatchObject({ metodo: 'PATCH', cuerpo: { estado: 'EN_REPARTO' } });
        expect(enviados[0].url).toMatch(/\/api\/facturas\/1003\/estado$/);
    });

    it('registra el pago de un pedido a credito pendiente', async () => {
        await renderPanel();
        await irA('Pedidos');

        expect(screen.getAllByRole('button', { name: 'Registrar pago' })).toHaveLength(1);
        await userEvent.click(screen.getByRole('button', { name: 'Registrar pago' }));

        expect(await screen.findByText('Pago del pedido #1002 registrado.')).toBeInTheDocument();
        expect(enviados[0].url).toMatch(/\/api\/facturas\/1002\/pagar$/);
        expect(screen.queryByRole('button', { name: 'Registrar pago' })).not.toBeInTheDocument();
    });

    it('calcula los reportes con los pedidos', async () => {
        await renderPanel();
        await irA('Reportes');

        const primero = screen.getAllByRole('row')[1];
        expect(within(primero).getByText('Saco de Cemento Melón 25kg')).toBeInTheDocument();
        expect(screen.getByText('$78.960')).toBeInTheDocument();
    });

    it('asigna el cupo de credito al contratista', async () => {
        await renderPanel();
        await irA('Usuarios');
        const cupo = screen.getByLabelText('Cupo de Juan Pérez');

        await userEvent.clear(cupo);
        await userEvent.type(cupo, '800000');
        await userEvent.click(within(cupo.closest('tr')).getByRole('button', { name: 'Guardar' }));

        expect(await screen.findByText('Cupo de Juan Pérez actualizado.')).toBeInTheDocument();
        expect(enviados[0]).toMatchObject({ metodo: 'PUT', cuerpo: { cupo: 800000 } });
    });

    it('muestra el aviso al guardar el stock', async () => {
        await renderPanel();
        await irA('Inventario');

        await userEvent.click(screen.getAllByRole('button', { name: 'Guardar' })[0]);

        expect(await screen.findByText(/actualizado a 120 unidades/i)).toBeInTheDocument();
        expect(enviados[0]).toMatchObject({ metodo: 'PUT', cuerpo: { sku: 'CON-001', cantidad: 120, stockMinimo: 30 } });
    });

    it('actualiza el estado del inventario al cambiar el stock', async () => {
        await renderPanel();
        await irA('Inventario');
        const input = screen.getByLabelText('Stock Huincha de Medir 5m');

        await userEvent.clear(input);
        await userEvent.type(input, '0');

        const fila = input.closest('tr');
        expect(within(fila).getByText('Sin stock')).toBeInTheDocument();
    });

    it('muestra los mensajes enviados desde contacto', async () => {
        mensajes = [
            { id: 9, fecha: '2026-10-23T10:00:00', nombre: 'Pedro Soto', email: 'pedro@correo.cl', telefono: '+56912345678', motivo: 'Otro', mensaje: 'Hola, consulta de prueba para el panel.' }
        ];
        await renderPanel();
        await irA('Mensajes');

        expect(screen.getByText('Hola, consulta de prueba para el panel.')).toBeInTheDocument();
        expect(screen.getByText('23-10-2026')).toBeInTheDocument();
    });

    it('los roles son los mismos del backend', async () => {
        await renderPanel();
        await irA('Usuarios');

        const opciones = within(screen.getByLabelText('Rol de Juan Pérez')).getAllByRole('option').map((o) => o.textContent);
        expect(opciones).toEqual(['Administrador', 'Vendedor', 'Contratista', 'Cliente']);
    });

    it('al cambiar el rol manda el usuario completo con el rol nuevo', async () => {
        await renderPanel();
        await irA('Usuarios');

        await userEvent.selectOptions(screen.getByLabelText('Rol de María Rojas'), 'Contratista');

        expect(await screen.findByText('María Rojas ahora es contratista.')).toBeInTheDocument();
        expect(enviados[0]).toMatchObject({ metodo: 'PUT', cuerpo: { id: 3, email: 'cliente@correo.cl', rol: 'CONTRATISTA' } });
    });
});
