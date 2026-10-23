import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import TarjetaProducto from './TarjetaProducto.jsx';

const martillo = { id: 'martillo-carpintero-16oz', codigo: 'MAN-001', icono: '🔨', nombre: 'Martillo Carpintero 16oz', marca: 'Bahco', precio: 7990, stock: 45, categoria: 'manuales' };

function renderTarjeta(producto) {
    render(
        <MemoryRouter>
            <CarritoProvider>
                <TarjetaProducto producto={producto} />
            </CarritoProvider>
        </MemoryRouter>
    );
}

describe('TarjetaProducto', () => {
    beforeEach(() => localStorage.clear());

    it('muestra los datos que recibe por props', () => {
        renderTarjeta(martillo);

        expect(screen.getByRole('heading', { name: 'Martillo Carpintero 16oz' })).toBeInTheDocument();
        expect(screen.getByText('Bahco')).toBeInTheDocument();
        expect(screen.getByText('$7.990')).toBeInTheDocument();
    });

    it('no muestra el stock, eso queda para el detalle', () => {
        renderTarjeta(martillo);

        expect(screen.queryByText('Disponible: 45')).not.toBeInTheDocument();
    });

    it('sin stock el boton queda deshabilitado', () => {
        renderTarjeta({ ...martillo, stock: 0 });

        expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();
    });

    it('al agregar, el boton se cambia por el contador - cantidad +', async () => {
        const user = userEvent.setup();
        renderTarjeta(martillo);

        await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

        expect(screen.queryByRole('button', { name: 'Agregar al carrito' })).not.toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Agregar uno' }));
        expect(screen.getByText('2')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Quitar uno' }));
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('al quitar la ultima unidad vuelve el boton de agregar', async () => {
        const user = userEvent.setup();
        renderTarjeta(martillo);

        await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
        await user.click(screen.getByRole('button', { name: 'Quitar uno' }));

        expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument();
    });

    it('el + se deshabilita al llegar al stock', async () => {
        const user = userEvent.setup();
        renderTarjeta({ ...martillo, stock: 2 });

        await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
        await user.click(screen.getByRole('button', { name: 'Agregar uno' }));

        expect(screen.getByRole('button', { name: 'Agregar uno' })).toBeDisabled();
    });

    it('el link de detalle lleva a la pagina del producto', () => {
        renderTarjeta(martillo);

        expect(screen.getByRole('link', { name: 'Ver detalle' })).toHaveAttribute('href', '/producto/martillo-carpintero-16oz');
    });
});
