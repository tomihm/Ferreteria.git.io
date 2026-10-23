import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { catalogo } from '../products/catalogo.js';
import Main from './Main.jsx';

function renderInicio() {
    render(
        <MemoryRouter>
            <CarritoProvider>
                <Main />
            </CarritoProvider>
        </MemoryRouter>
    );
}

describe('Main (inicio)', () => {
    it('muestra el titulo y los botones principales', () => {
        renderInicio();

        expect(screen.getByRole('heading', { level: 1, name: 'Todo para tu obra, en un solo lugar' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Ver catálogo' })).toHaveAttribute('href', '/catalogo');
        expect(screen.getByRole('link', { name: 'Entrar a mi cuenta' })).toHaveAttribute('href', '/login');
    });

    it('cada categoria lleva a su seccion del catalogo', () => {
        renderInicio();

        expect(screen.getByRole('link', { name: /Gasfitería/ })).toHaveAttribute('href', '/catalogo#gasfiteria');
        expect(screen.getByRole('link', { name: /Electricidad/ })).toHaveAttribute('href', '/catalogo#electricidad');
    });

    it('muestra los cuatro productos mas pedidos', () => {
        renderInicio();

        for (const codigo of ['CON-001', 'HER-001', 'MAN-001', 'ELE-003']) {
            const producto = catalogo.find((p) => p.codigo === codigo);
            expect(screen.getByRole('heading', { name: producto.nombre })).toBeInTheDocument();
        }
    });

    it('numera los pasos para comprar', () => {
        renderInicio();

        const pasos = screen.getAllByRole('listitem').filter((li) => li.querySelector('.pasos__numero'));
        expect(pasos).toHaveLength(3);
        expect(pasos[0]).toHaveTextContent('1Revisa el stock');
    });
});
