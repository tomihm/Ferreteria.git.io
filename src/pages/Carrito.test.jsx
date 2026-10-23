import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Carrito from './Carrito.jsx';
import { CarritoProvider } from '../context/CarritoContext.jsx';
import { SesionProvider } from '../context/SesionContext.jsx';

const itemsPrueba = [
    { codigo: 'CON-001', icono: '🧱', nombre: 'Saco de Cemento Melón 25kg', marca: 'Melón', precio: 5490, cantidad: 20, stock: 120 },
    { codigo: 'MAN-001', icono: '🔨', nombre: 'Martillo Carpintero 16oz', marca: 'Bahco', precio: 7990, cantidad: 3, stock: 45 }
];

// el total es el texto que esta al lado de "Total" en el resumen
const totalPedido = () => screen.getByText('Total').parentElement;

// el carrito se lee del localStorage, asi que se deja guardado antes de renderizar
function renderCarrito(items = itemsPrueba) {
    localStorage.setItem('carrito', JSON.stringify(items));
    render(
        <MemoryRouter>
            <SesionProvider>
                <CarritoProvider>
                    <Carrito />
                </CarritoProvider>
            </SesionProvider>
        </MemoryRouter>
    );
}

// Nominatim falso: devuelve el punto que se le pase (o nada)
const mapaResponde = (resultados) => vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(resultados) }));
const CERCA = [{ lat: '-29.9100', lon: '-71.2600' }];
const LEJOS = [{ lat: '-30.6015', lon: '-71.1996' }];

// Photon falso: dos calles, una en La Serena y otra en Ovalle
const photon = {
    features: [
        { properties: { street: 'Los Carrera', city: 'La Serena' }, geometry: { coordinates: [-71.2514, -29.9040] } },
        { properties: { street: 'Libertad', city: 'Ovalle' }, geometry: { coordinates: [-71.1996, -30.6015] } },
    ],
};
const mapaConSugerencias = () => vi.stubGlobal('fetch', vi.fn((url) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(url.includes('photon') ? photon : CERCA),
})));

async function escribirDireccion(texto) {
    await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));
    await userEvent.type(screen.getByLabelText('Dirección de entrega'), texto);
}

describe('Carrito', () => {
    beforeEach(() => {
        localStorage.clear();
        mapaResponde(CERCA);
    });

    afterEach(() => vi.unstubAllGlobals());

    it('parte vacio si no hay nada guardado', () => {
        render(
            <MemoryRouter>
                <CarritoProvider>
                    <Carrito />
                </CarritoProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$0');
    });

    it('muestra los productos y el total del carrito', async () => {
        renderCarrito();

        expect(screen.getByText(/Saco de Cemento Melón 25kg/)).toBeInTheDocument();
        expect(screen.getByText(/Martillo Carpintero 16oz/)).toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$133.770');
    });

    it('recalcula el total al cambiar la cantidad', async () => {
        renderCarrito();

        const input = screen.getByLabelText('Cantidad de Martillo Carpintero 16oz');
        await userEvent.clear(input);
        await userEvent.type(input, '5');

        expect(totalPedido()).toHaveTextContent('$149.750');
    });

    it('no deja pedir mas que el stock disponible', async () => {
        renderCarrito();

        const input = screen.getByLabelText('Cantidad de Martillo Carpintero 16oz');
        await userEvent.clear(input);
        await userEvent.type(input, '99');

        expect(input).toHaveValue(45);
    });

    it('si la cantidad queda vacia vuelve a 1 al salir del campo', async () => {
        renderCarrito();

        const input = screen.getByLabelText('Cantidad de Martillo Carpintero 16oz');
        await userEvent.clear(input);
        await userEvent.tab();

        expect(input).toHaveValue(1);
    });

    it('quita un producto del carrito', async () => {
        renderCarrito();
        await userEvent.click(screen.getByRole('button', { name: 'Quitar Martillo Carpintero 16oz' }));

        expect(screen.queryByText(/Martillo Carpintero 16oz/)).not.toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$109.800');
    });

    it('vacia el carrito', async () => {
        renderCarrito();
        await userEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }));

        expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
        expect(totalPedido()).toHaveTextContent('$0');
    });

    it('cobra despacho bajo $150.000', async () => {
        renderCarrito();
        await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));

        expect(totalPedido()).toHaveTextContent('$140.760');
    });

    it('el despacho es gratis sobre $150.000', async () => {
        renderCarrito([{ ...itemsPrueba[0], cantidad: 30 }]);
        await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));

        expect(screen.getByText('Despacho', { selector: 'dt' }).parentElement).toHaveTextContent('Gratis');
        expect(totalPedido()).toHaveTextContent('$164.700');
    });

    it('pide la direccion si se elige despacho', async () => {
        renderCarrito();
        await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));
        await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

        expect(screen.getByRole('alert')).toHaveTextContent(/dirección de entrega/i);
    });

    it('confirma el pedido si todo es valido', async () => {
        renderCarrito();
        await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));
        await userEvent.type(screen.getByLabelText('Dirección de entrega'), 'Los Aromos 455, Coquimbo');
        await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

        expect(await screen.findByText(/pedido válido/i)).toBeInTheDocument();
    });

    it('al salir del campo dice si la direccion esta dentro del radio', async () => {
        renderCarrito();
        await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));
        await userEvent.type(screen.getByLabelText('Dirección de entrega'), 'Los Carrera 300, La Serena');
        await userEvent.tab();

        expect(await screen.findByText(/Llegamos: queda a/)).toBeInTheDocument();
        expect(screen.getByLabelText('Dirección de entrega')).toHaveClass('is-valid');
    });

    it('una direccion fuera de los 12 km no deja confirmar', async () => {
        mapaResponde(LEJOS);
        renderCarrito();
        await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));
        await userEvent.type(screen.getByLabelText('Dirección de entrega'), 'Plaza de Armas, Ovalle');
        await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

        expect(await screen.findByText(/fuera de los 12 km/)).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent(/no es apta/i);
        expect(screen.getByLabelText('Dirección de entrega')).toHaveClass('is-invalid');
    });

    it('avisa si la direccion no existe', async () => {
        mapaResponde([]);
        renderCarrito();
        await userEvent.click(screen.getByRole('radio', { name: /Despacho a domicilio/ }));
        await userEvent.type(screen.getByLabelText('Dirección de entrega'), 'asdfgh');
        await userEvent.tab();

        expect(await screen.findByText(/No encontramos esa dirección/)).toBeInTheDocument();
    });

    it('el boton seguir comprando lleva al catalogo', async () => {
        renderCarrito();

        expect(screen.getByRole('link', { name: 'Seguir comprando' })).toHaveAttribute('href', '/catalogo');
    });

    it('parte con retiro en tienda marcado', () => {
        renderCarrito();

        expect(screen.getByRole('radio', { name: /Retiro en tienda/ })).toBeChecked();
        expect(screen.queryByLabelText('Dirección de entrega')).not.toBeInTheDocument();
    });

    it('solo el contratista puede pagar con credito', () => {
        localStorage.setItem('sesion', JSON.stringify({ nombre: 'Juan Pérez', rol: 'contratista' }));
        renderCarrito();

        expect(screen.getByLabelText('Pagar con mi crédito a 30 días')).toBeInTheDocument();
    });

    it('un cliente no ve la opcion de credito', () => {
        localStorage.setItem('sesion', JSON.stringify({ nombre: 'María Rojas', rol: 'cliente' }));
        renderCarrito();

        expect(screen.queryByLabelText('Pagar con mi crédito a 30 días')).not.toBeInTheDocument();
    });

    it('al escribir muestra una lista de direcciones con su distancia', async () => {
        mapaConSugerencias();
        renderCarrito();
        await escribirDireccion('los carrera 300');

        const opciones = await screen.findAllByRole('option', {}, { timeout: 2000 });
        expect(opciones).toHaveLength(2);
        expect(opciones[0]).toHaveTextContent('Los Carrera 300');
        expect(opciones[0]).toHaveTextContent('con despacho');
        expect(opciones[1]).toHaveTextContent('fuera de la zona de despacho');
    });

    it('al elegir una direccion de la lista queda revisada', async () => {
        mapaConSugerencias();
        renderCarrito();
        await escribirDireccion('los carrera 300');

        await userEvent.click((await screen.findAllByRole('option', {}, { timeout: 2000 }))[0]);

        expect(screen.getByLabelText('Dirección de entrega')).toHaveValue('Los Carrera 300, La Serena');
        expect(screen.getByText(/Llegamos: queda a/)).toBeInTheDocument();
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('se puede elegir con las flechas y enter', async () => {
        mapaConSugerencias();
        renderCarrito();
        await escribirDireccion('los carrera 300');
        await screen.findAllByRole('option', {}, { timeout: 2000 });

        await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');

        expect(screen.getByLabelText('Dirección de entrega')).toHaveValue('Libertad 300, Ovalle');
        expect(screen.getByText(/fuera de los 12 km/)).toBeInTheDocument();
    });

    it('al borrar la direccion se quita el mensaje en rojo', async () => {
        mapaResponde(LEJOS);
        renderCarrito();
        await escribirDireccion('Plaza de Armas, Ovalle');
        await userEvent.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
        expect(await screen.findByText(/fuera de los 12 km/)).toBeInTheDocument();

        await userEvent.clear(screen.getByLabelText('Dirección de entrega'));

        expect(screen.queryByText(/fuera de los 12 km/)).not.toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Dirección de entrega')).not.toHaveClass('is-invalid');
    });
});
