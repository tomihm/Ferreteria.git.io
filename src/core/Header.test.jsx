import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { SesionProvider } from '../context/SesionContext.jsx';
import Header from './Header.jsx';

function renderHeader() {
    render(
        <MemoryRouter>
            <SesionProvider>
                <CarritoProvider>
                    <Header />
                </CarritoProvider>
            </SesionProvider>
        </MemoryRouter>
    );
}

describe('Header', () => {
    beforeEach(() => localStorage.clear());

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

    it('sin sesion no se ven mis pedidos ni el panel', () => {
        renderHeader();

        expect(screen.queryByRole('link', { name: 'Mis pedidos' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Panel' })).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
    });

    it('el admin ve el panel pero no mis pedidos', () => {
        localStorage.setItem('sesion', JSON.stringify({ nombre: 'Carlos Muñoz', rol: 'admin' }));
        renderHeader();

        expect(screen.getByRole('link', { name: 'Panel' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Mis pedidos' })).not.toBeInTheDocument();
    });

    it('el cliente ve mis pedidos pero no el panel', () => {
        localStorage.setItem('sesion', JSON.stringify({ nombre: 'María Rojas', rol: 'cliente' }));
        renderHeader();

        expect(screen.getByRole('link', { name: 'Mis pedidos' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Panel' })).not.toBeInTheDocument();
    });

    it('cerrar sesion vuelve a mostrar iniciar sesion', async () => {
        localStorage.setItem('sesion', JSON.stringify({ nombre: 'María Rojas', rol: 'cliente' }));
        renderHeader();

        await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

        expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
        expect(localStorage.getItem('sesion')).toBeNull();
    });
});
