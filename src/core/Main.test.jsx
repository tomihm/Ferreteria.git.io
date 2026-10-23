import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        expect(screen.getAllByRole('link', { name: 'Ver ofertas' })[0]).toHaveAttribute('href', '/catalogo?ofertas=1');
    });

    it('cada categoria lleva al catalogo filtrado', () => {
        renderInicio();

        expect(screen.getByRole('link', { name: /Gasfitería/ })).toHaveAttribute('href', '/catalogo?categoria=gasfiteria');
        expect(screen.getByRole('link', { name: /^Electricidad/ })).toHaveAttribute('href', '/catalogo?categoria=electricidad');
    });

    it('la franja naranja muestra las ofertas con mas descuento', () => {
        renderInicio();

        expect(screen.getByRole('link', { name: /Sierra Circular.*-25%/ })).toBeInTheDocument();
    });

    it('los chips cambian los productos destacados', async () => {
        renderInicio();

        await userEvent.click(screen.getByRole('button', { name: 'Electricidad' }));

        expect(screen.getByRole('button', { name: 'Electricidad' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('heading', { name: 'Cable THHN 2.5mm Rollo 100m' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Saco de Cemento Melón 25kg' })).not.toBeInTheDocument();
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
