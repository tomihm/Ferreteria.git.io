import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { SesionProvider } from '../context/SesionContext.jsx';
import Header from './Header.jsx';

// muestra la ruta actual para revisar a donde manda el header
function Ubicacion() {
    const { pathname, search } = useLocation();
    return <p data-testid="ubicacion">{pathname + search}</p>;
}

function renderHeader() {
    render(
        <MemoryRouter>
            <SesionProvider>
                <CarritoProvider>
                    <Header />
                    <Ubicacion />
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
        expect(screen.getAllByRole('link', { name: 'Iniciar sesión' }).length).toBeGreaterThan(0);
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

        await userEvent.click(within(screen.getByTestId('menu-cuenta')).getByRole('button', { name: 'Cerrar sesión' }));

        expect(within(screen.getByTestId('menu-cuenta')).getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
        expect(localStorage.getItem('sesion')).toBeNull();
    });

    it('el menu de mi cuenta sin sesion ofrece iniciar sesion y crear cuenta', () => {
        renderHeader();
        const menu = within(screen.getByTestId('menu-cuenta'));

        expect(menu.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
        expect(menu.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute('href', '/registro');
        expect(menu.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument();
    });

    it('el menu de mi cuenta con sesion muestra el nombre y cerrar sesion', () => {
        localStorage.setItem('sesion', JSON.stringify({ nombre: 'Carlos Muñoz', rol: 'admin' }));
        renderHeader();
        const menu = within(screen.getByTestId('menu-cuenta'));

        expect(menu.getByText('Carlos Muñoz')).toBeInTheDocument();
        expect(menu.getByRole('link', { name: 'Ir al panel' })).toHaveAttribute('href', '/panel');
        expect(menu.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
        expect(menu.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument();
    });

    it('el buscador lleva al catalogo con el texto', async () => {
        renderHeader();

        await userEvent.type(screen.getByLabelText('Buscar en la tienda'), 'taladro');
        await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

        expect(screen.getByTestId('ubicacion')).toHaveTextContent('/catalogo?buscar=taladro');
    });

    it('ya no tiene el boton de categorias ni el selector del buscador', () => {
        renderHeader();

        expect(screen.queryByRole('button', { name: /Categorías/ })).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Categoría de búsqueda')).not.toBeInTheDocument();
    });

    it('el carrito muestra cuanto lleva gastado', () => {
        localStorage.setItem('carrito', JSON.stringify([{ codigo: 'MAN-001', nombre: 'Martillo', precio: 7990, cantidad: 2, stock: 45 }]));
        renderHeader();

        expect(screen.getByRole('link', { name: /^Carrito/ })).toHaveTextContent('$15.980');
    });
});
