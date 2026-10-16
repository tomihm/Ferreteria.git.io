import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MisPedidos from './MisPedidos.jsx';
import { cargarMisPedidos } from '../mocks/misPedidosMocks.js';

// se reemplaza la carga para probar el estado de carga y el de error
vi.mock('../mocks/misPedidosMocks.js', () => ({
    cargarMisPedidos: vi.fn(),
}));

function renderMisPedidos() {
    render(
        <MemoryRouter>
            <MisPedidos />
        </MemoryRouter>
    );
}

describe('MisPedidos mientras carga', () => {
    it('muestra que esta cargando', () => {
        vi.mocked(cargarMisPedidos).mockReturnValue(new Promise(() => {}));
        renderMisPedidos();

        expect(screen.getByRole('status')).toHaveTextContent('Cargando tus pedidos...');
    });

    it('muestra un error si la carga falla', async () => {
        vi.mocked(cargarMisPedidos).mockRejectedValue(new Error('sin conexion'));
        renderMisPedidos();

        expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tus pedidos');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
