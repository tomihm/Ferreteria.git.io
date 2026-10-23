import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SesionProvider } from '../context/SesionContext.jsx';
import MisPedidos from './MisPedidos.jsx';

const contratista = { rut: '33.333.333-3', nombre: 'Juan Pérez', email: 'contratista@correo.cl', rol: 'contratista' };
const cliente = { rut: '44.444.444-4', nombre: 'María Rojas', email: 'cliente@correo.cl', rol: 'cliente' };

// la sesion se deja guardada antes de renderizar, como si ya hubiera entrado
async function renderMisPedidos(usuario, primerPedido) {
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

    it('muestra el nombre del usuario', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { level: 1, name: 'Mis pedidos' })).toBeInTheDocument();
        expect(screen.getByText('Juan Pérez · contratista@correo.cl')).toBeInTheDocument();
    });

    it('muestra su credito en la empresa', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { name: 'Crédito en la empresa' })).toBeInTheDocument();
        expect(screen.getByText('Saldo pendiente')).toBeInTheDocument();
        expect(screen.getByText('Cupo disponible')).toBeInTheDocument();
    });

    it('muestra sus facturas', async () => {
        await renderMisPedidos(contratista, '#1002');
        expect(screen.getByRole('heading', { name: 'Facturas' })).toBeInTheDocument();
        expect(screen.getByText('27-09-2026')).toBeInTheDocument();
        expect(screen.getByText('Pagada')).toBeInTheDocument();
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

    it('solo ve sus pedidos, sin credito ni facturas', async () => {
        await renderMisPedidos(cliente, '#1003');
        expect(screen.getByText('Total: $13.740')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Crédito en la empresa' })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Facturas' })).not.toBeInTheDocument();
    });

    it('el boton lleva al catalogo', async () => {
        await renderMisPedidos(cliente, '#1003');
        expect(screen.getByRole('link', { name: 'Hacer un nuevo pedido' })).toHaveAttribute('href', '/catalogo');
    });
});
