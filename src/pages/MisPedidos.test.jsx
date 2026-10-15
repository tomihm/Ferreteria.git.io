import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MisPedidos from './MisPedidos.jsx';

// MisPedidos usa <Link>, por eso necesita un router
async function renderMisPedidos() {
    render(
        <MemoryRouter>
            <MisPedidos />
        </MemoryRouter>
    );
    await screen.findByRole('heading', { level: 3, name: 'Pedido #1002' });
}

describe('MisPedidos', () => {
    it('muestra el titulo de la pagina', async () => {
        await renderMisPedidos();
        expect(screen.getByRole('heading', { level: 1, name: 'Mis pedidos' })).toBeInTheDocument();
    });

    it('muestra los kpis de la cuenta corriente', async () => {
        await renderMisPedidos();
        expect(screen.getByText('Saldo pendiente')).toBeInTheDocument();
        expect(screen.getByText('30 de septiembre')).toBeInTheDocument();
        expect(screen.getByText('Cupo disponible')).toBeInTheDocument();
    });

    it('muestra el historial de pedidos con sus totales', async () => {
        await renderMisPedidos();
        expect(screen.getByRole('heading', { level: 3, name: 'Pedido #1002' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Pedido #1001' })).toBeInTheDocument();
        expect(screen.getByText('Total: $78.960')).toBeInTheDocument();
        expect(screen.getByText('Total: $109.800')).toBeInTheDocument();
    });

    it('el boton lleva al catalogo', async () => {
        await renderMisPedidos();
        expect(screen.getByRole('link', { name: 'Hacer un nuevo pedido' })).toHaveAttribute('href', '/catalogo');
    });
});
