import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MisPedidos from './MisPedidos.jsx';

// MisPedidos usa <Link>, por eso necesita un router
function renderMisPedidos() {
    return render(
        <MemoryRouter>
            <MisPedidos />
        </MemoryRouter>
    );
}

describe('MisPedidos', () => {
    it('muestra el titulo de la pagina', () => {
        renderMisPedidos();
        expect(screen.getByRole('heading', { level: 1, name: 'Mis pedidos' })).toBeInTheDocument();
    });

    it('muestra los kpis de la cuenta corriente', () => {
        renderMisPedidos();
        expect(screen.getByText('Saldo pendiente')).toBeInTheDocument();
        expect(screen.getByText('30 de septiembre')).toBeInTheDocument();
        expect(screen.getByText('Cupo disponible')).toBeInTheDocument();
    });

    it('muestra el historial de pedidos con sus totales', () => {
        renderMisPedidos();
        expect(screen.getByRole('heading', { level: 3, name: 'Pedido #1002' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Pedido #1001' })).toBeInTheDocument();
        expect(screen.getByText('Total: $78.960')).toBeInTheDocument();
        expect(screen.getByText('Total: $109.800')).toBeInTheDocument();
    });

    it('el boton lleva al catalogo', () => {
        renderMisPedidos();
        expect(screen.getByRole('link', { name: 'Hacer un nuevo pedido' })).toHaveAttribute('href', '/catalogo');
    });
});
