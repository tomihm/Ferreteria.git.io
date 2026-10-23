import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Panel from './Panel.jsx';

async function renderPanel() {
    render(<Panel />);
    await screen.findByRole('heading', { level: 2, name: 'Resumen' });
}

// el panel muestra una seccion a la vez, se cambia desde el menu
const irA = (seccion) => userEvent.click(screen.getByRole('button', { name: seccion }));

describe('Panel', () => {
    beforeEach(() => localStorage.clear());

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
    });

    it('muestra el aviso al guardar el stock', async () => {
        await renderPanel();
        await irA('Inventario');

        await userEvent.click(screen.getAllByRole('button', { name: 'Guardar' })[0]);

        expect(screen.getByText(/actualizado a 120 unidades/i)).toBeInTheDocument();
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
        localStorage.setItem('mensajes', JSON.stringify([
            { id: 'm-9', fecha: '23-10-2026', nombre: 'Pedro Soto', email: 'pedro@correo.cl', telefono: '+56912345678', motivo: 'Otro', mensaje: 'Hola, consulta de prueba para el panel.' }
        ]));
        await renderPanel();
        await irA('Mensajes');

        expect(screen.getByText('Hola, consulta de prueba para el panel.')).toBeInTheDocument();
    });

    it('los roles son solo administrador, contratista y cliente', async () => {
        await renderPanel();
        await irA('Usuarios');

        const opciones = within(screen.getByLabelText('Rol de Juan Pérez')).getAllByRole('option').map((o) => o.textContent);
        expect(opciones).toEqual(['Administrador', 'Contratista', 'Cliente']);
    });
});
