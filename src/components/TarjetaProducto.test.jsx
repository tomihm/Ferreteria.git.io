import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import TarjetaProducto from './TarjetaProducto.jsx';

const martillo = { codigo: 'MAN-001', icono: '🔨', nombre: 'Martillo Carpintero 16oz', marca: 'Bahco', precio: 7990, stock: 45, categoria: 'manuales' };

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
    it('muestra los datos que recibe por props', () => {
        renderTarjeta(martillo);

        expect(screen.getByRole('heading', { name: 'Martillo Carpintero 16oz' })).toBeInTheDocument();
        expect(screen.getByText('Bahco')).toBeInTheDocument();
        expect(screen.getByText('$7.990')).toBeInTheDocument();
        expect(screen.getByText('Disponible: 45')).toBeInTheDocument();
    });

    it('avisa cuando quedan pocas unidades', () => {
        renderTarjeta({ ...martillo, stock: 3 });

        expect(screen.getByText('Quedan 3')).toBeInTheDocument();
    });

    it('sin stock el boton queda deshabilitado', () => {
        renderTarjeta({ ...martillo, stock: 0 });

        expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();
    });

    it('solo muestra ver detalle si el producto tiene pagina', () => {
        renderTarjeta(martillo);
        expect(screen.queryByRole('link', { name: 'Ver detalle' })).not.toBeInTheDocument();
    });

    it('el link de detalle lleva a la pagina del producto', () => {
        renderTarjeta({ ...martillo, codigo: 'CON-001', nombre: 'Saco de Cemento Melón 25kg' });

        expect(screen.getByRole('link', { name: 'Ver detalle' })).toHaveAttribute('href', '/producto/saco-de-cemento-melon-25kg');
    });
});
