import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nosotros from './Nosotros.jsx';

// Nosotros usa <Link>, por eso necesita un router
function renderNosotros() {
    return render(
        <MemoryRouter>
            <Nosotros />
        </MemoryRouter>
    );
}

describe('Nosotros', () => {
    it('muestra el titulo de la pagina', () => {
        renderNosotros();
        expect(screen.getByRole('heading', { level: 1, name: 'Quiénes somos' })).toBeInTheDocument();
    });

    it('muestra los tres servicios y los cuatro numeros', () => {
        renderNosotros();
        expect(screen.getByText('Materiales de obra')).toBeInTheDocument();
        expect(screen.getByText('Herramientas de marca')).toBeInTheDocument();
        expect(screen.getByText('Cuenta corriente')).toBeInTheDocument();
        expect(screen.getByText('832')).toBeInTheDocument();
        expect(screen.getByText('12 km')).toBeInTheDocument();
    });

    it('los botones llevan al catalogo y a contacto', () => {
        renderNosotros();
        expect(screen.getByRole('link', { name: 'Ver catálogo' })).toHaveAttribute('href', '/catalogo');
        expect(screen.getByRole('link', { name: 'Contactar' })).toHaveAttribute('href', '/contacto');
    });
});
