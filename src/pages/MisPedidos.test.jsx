import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SesionProvider } from '../context/SesionContext.jsx';
import MisPedidos from './MisPedidos.jsx';

const contratista = { id: 2, nombre: 'Juan Pérez', email: 'contratista@correo.cl', rol: 'contratista', token: 't' };
const cliente = { id: 3, nombre: 'María Rojas', email: 'cliente@correo.cl', rol: 'cliente', token: 't' };

const linea = (nombreProducto, cantidad, precioUnitario) => ({ sku: 'X', nombreProducto, cantidad, precioUnitario, subtotal: cantidad * precioUnitario });

const facturasContratista = [
    { numero: 1002, fecha: '2026-08-28T10:00:00', estado: 'EMITIDA', estadoPedido: 'EN_PREPARACION', formaPago: 'CREDITO', entrega: 'Retiro en tienda', vence: '2026-09-27', pagada: false, total: 78960,
        lineas: [linea('Taladro Percutor 750W', 1, 54990), linea('Martillo Carpintero 16oz', 3, 7990)] },
    { numero: 1001, fecha: '2026-08-20T10:00:00', estado: 'EMITIDA', estadoPedido: 'ENTREGADO', formaPago: 'CREDITO', entrega: 'Despacho a Los Aromos 455', vence: '2026-09-19', pagada: true, total: 109800,
        lineas: [linea('Saco de Cemento Melón 25kg', 20, 5490)] }
];

const facturasCliente = [
    { numero: 1003, fecha: '2026-09-01T10:00:00', estado: 'EMITIDA', estadoPedido: 'PENDIENTE', formaPago: 'WEBPAY', entrega: 'Retiro en tienda', pagada: true, total: 13740,
        lineas: [linea('Silicona Transparente 280ml', 2, 4290), linea('Cinta Aisladora Negra 20m', 4, 1290)] }
];

const credito = {
    cupo: 500000, saldo: 78960, disponible: 421040,
    movimientos: [{ fecha: '2026-08-28T10:00:00', documento: 'F-1002', detalle: 'Compra a crédito', cargo: 78960, abono: 0, saldo: 78960 }]
};

function backendResponde(facturas) {
    vi.stubGlobal('fetch', (url) => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(url.includes('/api/credito/mio') ? credito : { content: facturas })
    }));
}

// la sesion se deja guardada antes de renderizar, como si ya hubiera entrado
async function renderMisPedidos(usuario, primerPedido) {
    backendResponde(usuario.rol === 'contratista' ? facturasContratista : facturasCliente);
    localStorage.setItem('sesion', JSON.stringify(usuario));
    render(
        <MemoryRouter>
            <SesionProvider>
                <MisPedidos />
            </SesionProvider>
        </MemoryRouter>
    );
    await screen.findByRole('heading', { level: 3, name: `Pedido ${primerPedido}` });
}

describe('MisPedidos del contratista', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => vi.unstubAllGlobals());

    it('muestra el nombre del usuario', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { level: 1, name: 'Mis pedidos' })).toBeInTheDocument();
        expect(screen.getByText('Juan Pérez · contratista@correo.cl')).toBeInTheDocument();
    });

    it('muestra su credito en la empresa', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { name: 'Crédito en la empresa' })).toBeInTheDocument();
        expect(screen.getByText('Saldo pendiente')).toBeInTheDocument();
        expect(screen.getByText('$421.040')).toBeInTheDocument();
        expect(screen.getByText('27 de septiembre')).toBeInTheDocument();
    });

    it('muestra sus facturas', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { name: 'Facturas' })).toBeInTheDocument();
        expect(screen.getByText('27-09-2026')).toBeInTheDocument();
        expect(screen.getByText('Pagada')).toBeInTheDocument();
        expect(screen.getAllByText('F-1002')).toHaveLength(2);
    });

    it('muestra los movimientos del credito', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { name: 'Movimientos del crédito' })).toBeInTheDocument();
        expect(screen.getByText('Compra a crédito')).toBeInTheDocument();
    });

    it('muestra el historial de pedidos con sus totales', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { level: 3, name: 'Pedido #1001' })).toBeInTheDocument();
        expect(screen.getByText('Total: $78.960')).toBeInTheDocument();
        expect(screen.getByText('Total: $109.800')).toBeInTheDocument();
    });
});

describe('MisPedidos del cliente', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => vi.unstubAllGlobals());

    it('solo ve sus pedidos, sin credito ni facturas', async () => {
        await renderMisPedidos(cliente, '#1003');
        expect(screen.getByText('Total: $13.740')).toBeInTheDocument();
        expect(screen.getByText('Webpay')).toBeInTheDocument();
        expect(screen.getByText('Pendiente')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Crédito en la empresa' })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Facturas' })).not.toBeInTheDocument();
    });

    it('el boton lleva al catalogo', async () => {
        await renderMisPedidos(cliente, '#1003');
        expect(screen.getByRole('link', { name: 'Hacer un nuevo pedido' })).toHaveAttribute('href', '/catalogo');
    });
});
