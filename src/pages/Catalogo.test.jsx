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