import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { catalogo } from '../products/catalogo.js';
import ProductoDetalle from './ProductoDetalle.jsx';

function renderDetalle(ruta) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <CarritoProvider>
                <Routes>
                    <Route path="/producto/:id" element={<ProductoDetalle />} />
                </Routes>
            </CarritoProvider>
        </MemoryRouter>
    );
}

describe('ProductoDetalle', () => {
    it('todos los productos del catalogo tienen id distinto', () => {
        const ids = catalogo.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('todos los productos tienen descripcion', () => {
        expect(catalogo.every((p) => p.descripcion)).toBe(true);
    });

    it('muestra los datos del producto', () => {
        renderDetalle('/producto/esmeril-angular-4-5-820w');

        expect(screen.getByRole('heading', { name: 'Esmeril Angular 4.5" 820W' })).toBeInTheDocument();
        expect(screen.getByText(/Corta y desbasta metal/)).toBeInTheDocument();
    });

    it('un producto en oferta muestra el precio rebajado y el normal tachado', () => {
        renderDetalle('/producto/esmeril-angular-4-5-820w');

        expect(screen.getByText('$31.990')).toBeInTheDocument();
        expect(screen.getByText('$39.990', { exact: false }).closest('del')).toBeInTheDocument();
        expect(screen.getByText('-20%')).toBeInTheDocument();
    });

    it('el nivel laser tiene su pagina', () => {
        renderDetalle('/producto/nivel-laser-360');

        expect(screen.getByRole('heading', { name: 'Nivel Láser 360°' })).toBeInTheDocument();
    });

    it('sin stock no deja agregar al carrito', () => {
        renderDetalle('/producto/escalera-tijera-aluminio-6-peldanos');

        expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();
    });

    it('avisa si el producto no existe', () => {
        renderDetalle('/producto/no-existe');

        expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument();
    });
});
