import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Panel from './Panel.jsx';

async function renderPanel() {
    render(<Panel />);
    await screen.findByText('CON-001');
}

describe('Panel', () => {
    it('muestra el titulo de la pagina', async () => {
        await renderPanel();
        expect(screen.getByRole('heading', { level: 1, name: 'Panel de gestión' })).toBeInTheDocument();
    });

    it('muestra las secciones del panel', async () => {
        await renderPanel();
        expect(screen.getByRole('heading', { level: 2, name: 'Resumen' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Inventario' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Pedidos' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Usuarios' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Reportes' })).toBeInTheDocument();
    });

    it('filtra los pedidos por estado', async () => {
        await renderPanel();

        await userEvent.selectOptions(screen.getByLabelText('Filtrar por estado'), 'Entregado');

        // El pedido #1001 queda entregado, los otros dos se ocultan
        expect(screen.getByText('#1001')).toBeInTheDocument();
        expect(screen.queryByText('#1002')).not.toBeInTheDocument();
        expect(screen.queryByText('#1003')).not.toBeInTheDocument();
    });

    it('cambia el estado del pedido al usar su selector', async () => {
        await renderPanel();

        await userEvent.selectOptions(screen.getByLabelText('Estado del pedido #1003'), 'En reparto');

        expect(screen.getByLabelText('Estado del pedido #1003')).toHaveValue('En reparto');
    });

    it('muestra el aviso al guardar el stock', async () => {
        await renderPanel();

        await userEvent.click(screen.getAllByRole('button', { name: 'Guardar' })[0]);

        expect(screen.getByText(/actualizado a 120 unidades/i)).toBeInTheDocument();
    });

    it('actualiza el estado del inventario al cambiar el stock', async () => {
        await renderPanel();
        const input = screen.getByLabelText('Stock Huincha de Medir 5m');

        await userEvent.clear(input);
        await userEvent.type(input, '0');

        const fila = input.closest('tr');
        expect(within(fila).getByText('Sin stock')).toBeInTheDocument();
    });
});
