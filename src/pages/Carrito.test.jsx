import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Carrito from './Carrito.jsx';
import { cargarCarrito } from '../mocks/carritoMocks.js';

// Se reemplaza la carga para no depender del retraso del mock
vi.mock('../mocks/carritoMocks.js', () => ({
    cargarCarrito: vi.fn()
}));

const itemsPrueba = [
    { codigo: 'CON-001', icono: '🧱', producto: 'Saco de Cemento Melón 25kg', unidad: 'por saco', precio: 5490, cantidad: 20, stock: 120 },
    { codigo: 'MAN-001', icono: '🔨', producto: 'Martillo Carpintero 16oz', unidad: 'por unidad', precio: 7990, cantidad: 3, stock: 45 }
];

// el total es el texto que esta al lado de "Total" en el resumen
const totalPedido = () => screen.getByText('Total').parentElement;

async function renderCarrito(items = itemsPrueba) {
    cargarCarrito.mockResolvedValue(items.map((item) => ({ ...item })));
    render(
        <MemoryRouter>
            <Carrito />
        </MemoryRouter>
    );
    await screen.findByRole('heading', { name: 'Resumen del pedido' });
}

describe('Carrito', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra los productos y el total del carrito', async () => {
        await renderCarrito();

        expect(screen.getByText(/Saco de Cemento Melón 25kg/)).toBeInTheDocument();
        expect(screen.getByText(/Martillo Carpintero 16oz/)).toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$133.770');
    });

    it('recalcula el total al cambiar la cantidad', async () => {
        await renderCarrito();

        const input = screen.getByLabelText('Cantidad de Martillo Carpintero 16oz');
        await userEvent.clear(input);
        await userEvent.type(input, '5');

        expect(totalPedido()).toHaveTextContent('$149.750');
    });

    it('no deja pedir mas que el stock disponible', async () => {
        await renderCarrito();

        const input = screen.getByLabelText('Cantidad de Martillo Carpintero 16oz');
        await userEvent.clear(input);
        await userEvent.type(input, '99');

        expect(input).toHaveValue(45);
    });

    it('si la cantidad queda vacia vuelve a 1 al salir del campo', async () => {
        await renderCarrito();

        const input = screen.getByLabelText('Cantidad de Martillo Carpintero 16oz');
        await userEvent.clear(input);
        await userEvent.tab();

        expect(input).toHaveValue(1);
    });

    it('quita un producto del carrito', async () => {
        await renderCarrito();
        await userEvent.click(screen.getByRole('button', { name: 'Quitar Martillo Carpintero 16oz' }));

        expect(screen.queryByText(/Martillo Carpintero 16oz/)).not.toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$109.800');
    });

    it('vacia el carrito', async () => {
        await renderCarrito();
        await userEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }));

        expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$0');
    });

    it('cobra despacho bajo $150.000', async () => {
        await renderCarrito();
        await userEvent.selectOptions(screen.getByLabelText('Cómo lo recibes'), 'despacho');

        expect(totalPedido()).toHaveTextContent('$140.760');
    });

    it('el despacho es gratis sobre $150.000', async () => {
        await renderCarrito([{ ...itemsPrueba[0], cantidad: 30 }]);
        await userEvent.selectOptions(screen.getByLabelText('Cómo lo recibes'), 'despacho');

        expect(screen.getByText('Gratis')).toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$164.700');
    });

    it('pide la direccion si se elige despacho', async () => {
        await renderCarrito();
        await userEvent.selectOptions(screen.getByLabelText('Cómo lo recibes'), 'despacho');
        await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

        expect(screen.getByRole('alert')).toHaveTextContent(/dirección de entrega/i);
    });

    it('confirma el pedido si todo es valido', async () => {
        await renderCarrito();
        await userEvent.selectOptions(screen.getByLabelText('Cómo lo recibes'), 'despacho');
        await userEvent.type(screen.getByLabelText('Dirección de entrega'), 'Los Aromos 455, Coquimbo');
        await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

        expect(screen.getByRole('alert')).toHaveTextContent(/pedido válido/i);
    });

    it('el boton seguir comprando lleva al catalogo', async () => {
        await renderCarrito();

        expect(screen.getByRole('link', { name: 'Seguir comprando' })).toHaveAttribute('href', '/catalogo');
    });
});
