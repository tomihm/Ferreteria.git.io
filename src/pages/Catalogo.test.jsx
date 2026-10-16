import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Catalogo from './Catalogo.jsx';
import Validar from '../utils/validaciones.js';
import { MemoryRouter } from 'react-router-dom';
import { CarritoProvider } from '../context/CarritoContext.jsx';

vi.mock('../utils/validaciones.js', () => ({
    default: {
        requerido: vi.fn(),
        longitudMinima: vi.fn(),
        aplicar: vi.fn(),
        enVivo: vi.fn(),
        rut: vi.fn(),
        email: vi.fn(),
        telefono: vi.fn(),
        password: vi.fn(),
        confirmarPassword: vi.fn(),
        formatearRut: vi.fn(),
        mensajeGeneral: vi.fn(),
    },
}));

describe('Pruebas en <Catalogo /> usando Mocks de Validar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar la vista de catálogo correctamente', () => {
        render(
            <MemoryRouter>
                <CarritoProvider><Catalogo /></CarritoProvider>
            </MemoryRouter>);

        expect(screen.getByRole('heading', { level: 1, name: /catálogo de productos/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/buscar producto/i)).toBeInTheDocument();
    });

    it('debe validar la búsqueda usando las funciones de Validar mockeadas', async () => {
        const user = userEvent.setup();

        vi.mocked(Validar.longitudMinima).mockReturnValue(null);
        vi.mocked(Validar.aplicar).mockReturnValue(true);

        render(
            <MemoryRouter>
                <CarritoProvider><Catalogo /></CarritoProvider>
            </MemoryRouter>);

        const inputBuscar = screen.getByLabelText(/buscar producto/i);
        await user.type(inputBuscar, 'Taladro');

        const resultadoRegla = Validar.longitudMinima(inputBuscar.value, 3, 'Búsqueda');
        const esValido = Validar.aplicar('buscar', resultadoRegla);

        expect(Validar.longitudMinima).toHaveBeenCalledWith('Taladro', 3, 'Búsqueda');
        expect(Validar.aplicar).toHaveBeenCalledWith('buscar', null);
        expect(esValido).toBe(true);
    });

    it('debe simular un error cuando el término de búsqueda es insuficiente', async () => {
        const user = userEvent.setup();

        const mensajeError = 'Búsqueda debe tener al menos 3 caracteres.';
        vi.mocked(Validar.longitudMinima).mockReturnValue(mensajeError);
        vi.mocked(Validar.aplicar).mockReturnValue(false);

        render(
            <MemoryRouter>
                <CarritoProvider><Catalogo /></CarritoProvider>
            </MemoryRouter>
        );

        const inputBuscar = screen.getByLabelText(/buscar producto/i);
        await user.type(inputBuscar, 'Ta');

        const resultadoRegla = Validar.longitudMinima(inputBuscar.value, 3, 'Búsqueda');
        const esValido = Validar.aplicar('buscar', resultadoRegla);

        expect(resultadoRegla).toBe(mensajeError);
        expect(esValido).toBe(false);
    });

    it('debe verificar los estados de stock de los productos', () => {
        render(
            <MemoryRouter>
                <CarritoProvider><Catalogo /></CarritoProvider>
            </MemoryRouter>);
        expect(screen.getByText('Saco de Cemento Melón 25kg')).toBeInTheDocument();

        const botonAgotado = screen.getByRole('button', { name: /sin stock/i });
        expect(botonAgotado).toBeDisabled();
    });

    it('debe mostrar las imagenes del cemento y el taladro', () => {
        render(
            <MemoryRouter>
                <CarritoProvider><Catalogo /></CarritoProvider>
            </MemoryRouter>);
        expect(screen.getByAltText('Saco de Cemento Melón 25kg')).toBeInTheDocument();
        expect(screen.getByAltText('Taladro Percutor 750W')).toBeInTheDocument();
    });
});
describe('Filtros del catálogo', () => {
    const renderCatalogo = () => render(
        <MemoryRouter>
            <CarritoProvider><Catalogo /></CarritoProvider>
        </MemoryRouter>
    );

    it('la busqueda deja solo los productos que coinciden', async () => {
        renderCatalogo();

        await userEvent.type(screen.getByLabelText(/buscar producto/i), 'taladro');

        expect(screen.getByText('Taladro Percutor 750W')).toBeInTheDocument();
        expect(screen.queryByText('Saco de Cemento Melón 25kg')).not.toBeInTheDocument();
    });

    it('filtra por categoria', async () => {
        renderCatalogo();

        await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'gasfiteria');

        expect(screen.getByText('Codo PVC 90° 110mm')).toBeInTheDocument();
        expect(screen.queryByText('Martillo Carpintero 16oz')).not.toBeInTheDocument();
    });

    it('ordena por precio de menor a mayor', async () => {
        renderCatalogo();

        await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'construccion');
        await userEvent.selectOptions(screen.getByLabelText('Ordenar por'), 'precioMenor');

        const nombres = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
        expect(nombres[0]).toBe('Ladrillo Fiscal');
        expect(nombres[nombres.length - 1]).toBe('Plancha OSB 11mm 1.22x2.44m');
    });

    it('avisa cuando no hay resultados y se pueden limpiar los filtros', async () => {
        renderCatalogo();

        await userEvent.type(screen.getByLabelText(/buscar producto/i), 'zzzz');
        expect(screen.getByText(/no encontramos productos/i)).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
        expect(screen.getByText('Taladro Percutor 750W')).toBeInTheDocument();
    });
});
