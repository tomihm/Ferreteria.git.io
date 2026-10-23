import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import Layout from './Layout.jsx';
import App from '../App.jsx';
import NoEncontrada from '../pages/NoEncontrada.jsx';

// mismas rutas que main.jsx, solo con el inicio y la 404
function renderEn(ruta) {
    const router = createMemoryRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { index: true, element: <App /> },
                { path: '*', element: <NoEncontrada /> },
            ],
        },
    ], { initialEntries: [ruta] });

    render(
        <CarritoProvider>
            <RouterProvider router={router} />
        </CarritoProvider>
    );
}

describe('Layout', () => {
    it('arma la pagina con header, contenido y footer', () => {
        renderEn('/');

        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('main')).toHaveTextContent('Todo para tu obra');
        expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2026 Ferretería Los Maestros');
    });

    it('el footer tiene los datos de contacto', () => {
        renderEn('/');

        const footer = screen.getByRole('contentinfo');
        expect(footer.querySelector('a[href="tel:+56512214455"]')).toHaveTextContent('+56 51 221 4455');
        expect(footer.querySelector('a[href="mailto:ventas@losmaestros.cl"]')).toBeInTheDocument();
    });
});

describe('NoEncontrada', () => {
    it('una ruta que no existe muestra la 404', () => {
        renderEn('/no-existe');

        expect(screen.getByRole('heading', { name: 'Esta página no existe' })).toBeInTheDocument();
    });

    it('el boton vuelve al inicio', async () => {
        renderEn('/no-existe');

        await userEvent.click(screen.getByRole('link', { name: 'Volver al inicio' }));

        expect(screen.getByRole('heading', { level: 1, name: 'Todo para tu obra, en un solo lugar' })).toBeInTheDocument();
    });
});
