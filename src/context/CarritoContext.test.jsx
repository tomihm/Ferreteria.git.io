import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './CarritoContext.jsx';
import Header from '../core/Header.jsx';
import Catalogo from '../pages/Catalogo.jsx';
import ProductoDetalle from '../pages/ProductoDetalle.jsx';

// se renderiza el header junto al catalogo para ver que el contador cambia
function renderTienda() {
    render(
        <MemoryRouter>
            <CarritoProvider>
                <Header />
                <Catalogo />
            </CarritoProvider>
        </MemoryRouter>
    );
}

const iconoCarrito = () => screen.getByRole('link', { name: /^Carrito/ });

// busca el boton "Agregar al carrito" de la tarjeta que tiene ese codigo
const botonAgregar = (codigo) => {
    const tarjeta = screen.getByText(codigo).closest('article');
    return within(tarjeta).getByRole('button', { name: 'Agregar al carrito' });
};

describe('Carrito compartido', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('el contador no aparece con el carrito vacio', () => {
        renderTienda();

        expect(iconoCarrito()).toHaveTextContent('Carrito');
        expect(iconoCarrito()).not.toHaveTextContent(/\d/);
    });

    it('el contador sube al agregar productos', async () => {
        renderTienda();

        await userEvent.click(botonAgregar('CON-001'));
        expect(iconoCarrito()).toHaveTextContent('1');

        await userEvent.click(botonAgregar('CON-001'));
        await userEvent.click(botonAgregar('MAN-001'));
        expect(iconoCarrito()).toHaveTextContent('3');
    });

    it('no deja agregar mas que el stock', async () => {
        renderTienda();

        // a los guantes les quedan 2
        await userEvent.click(botonAgregar('GEN-003'));
        await userEvent.click(botonAgregar('GEN-003'));
        await userEvent.click(botonAgregar('GEN-003'));

        expect(iconoCarrito()).toHaveTextContent('2');
    });

    it('guarda el carrito para cuando se recarga la pagina', async () => {
        renderTienda();
        await userEvent.click(botonAgregar('HER-001'));

        const guardado = JSON.parse(localStorage.getItem('carrito'));
        expect(guardado).toHaveLength(1);
        expect(guardado[0]).toMatchObject({ codigo: 'HER-001', nombre: 'Taladro Percutor 750W', cantidad: 1 });
    });

    it('agrega desde el detalle con la cantidad elegida', async () => {
        render(
            <MemoryRouter initialEntries={['/producto/saco-de-cemento-melon-25kg']}>
                <CarritoProvider>
                    <Header />
                    <Routes>
                        <Route path="/producto/:id" element={<ProductoDetalle />} />
                    </Routes>
                </CarritoProvider>
            </MemoryRouter>
        );

        const cantidad = screen.getByLabelText('Cantidad (unidades)');
        await userEvent.clear(cantidad);
        await userEvent.type(cantidad, '4');
        await userEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

        expect(iconoCarrito()).toHaveTextContent('4');
    });
});
