import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import Header from './Header.jsx';

function renderHeader() {
    render(
        <MemoryRouter>
            <CarritoProvider>
                <Header />
            </CarritoProvider>
        </MemoryRouter>
    );
}

describe('Header', () => {
    it('el menu del celular parte cerrado', () => {
        renderHeader();

        expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
        expect(document.getElementById('menuPrincipal')).not.toHaveClass('show');
    });

    it('el boton abre y cierra el menu', async () => {
        renderHeader();
        const boton = screen.getByRole('button', { name: 'Abrir menú' });

        await userEvent.click(boton);
        expect(boton).toHaveAttribute('aria-expanded', 'true');
        expect(document.getElementById('menuPrincipal')).toHaveClass('show');

        await userEvent.click(boton);
        expect(document.getElementById('menuPrincipal')).not.toHaveClass('show');
    });

    it('al elegir una pagina se cierra el menu', async () => {
        renderHeader();

        await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
        await userEvent.click(screen.getByRole('link', { name: 'Catálogo' }));

        expect(document.getElementById('menuPrincipal')).not.toHaveClass('show');
    });

    it('al hacer click fuera del header se cierra el menu', async () => {
        renderHeader();

        await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
        await userEvent.click(document.body);

        expect(document.getElementById('menuPrincipal')).not.toHaveClass('show');
    });

    it('al hacer click dentro del menu abierto no se cierra', async () => {
        renderHeader();

        await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
        await userEvent.click(screen.getByRole('navigation', { name: 'Navegación principal' }));

        expect(document.getElementById('menuPrincipal')).toHaveClass('show');
    });
});
