import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from './Contacto.jsx';
import Validar from '../utils/validaciones.js';

// Se reemplazan las validaciones para probar solo el comportamiento del formulario
vi.mock('../utils/validaciones.js', () => ({
    default: {
        requerido: vi.fn(),
        email: vi.fn(),
        telefono: vi.fn(),
        longitudMinima: vi.fn()
    }
}));

describe('Contacto', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Validar.requerido.mockReturnValue(null);
        Validar.email.mockReturnValue(null);
        Validar.telefono.mockReturnValue(null);
        Validar.longitudMinima.mockReturnValue(null);
    });

    it('muestra el aviso de exito si todo es valido', async () => {
        render(<Contacto />);
        await userEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

        expect(screen.getByText(/mensaje enviado/i)).toBeInTheDocument();
    });

    it('muestra error y marca el campo cuando el correo no pasa', async () => {
        Validar.email.mockReturnValue('Correo malo');
        render(<Contacto />);

        await userEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

        expect(screen.getByText('Revisa los campos marcados en rojo.')).toBeInTheDocument();
        expect(screen.getByText('Correo malo')).toBeInTheDocument();
        expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-invalid');
    });

    it('llama a las validaciones con lo que escribe el usuario', async () => {
        render(<Contacto />);

        await userEvent.type(screen.getByLabelText('Correo electrónico'), 'ana@mail.com');
        await userEvent.type(screen.getByLabelText('Teléfono'), '912345678');
        await userEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

        expect(Validar.email).toHaveBeenCalledWith('ana@mail.com');
        expect(Validar.telefono).toHaveBeenCalledWith('912345678');
    });

    it('valida el campo al salir de el', async () => {
        render(<Contacto />);

        await userEvent.click(screen.getByLabelText('Teléfono'));
        await userEvent.tab();

        expect(Validar.telefono).toHaveBeenCalledTimes(1);
    });

    it('limpia el formulario despues de enviar', async () => {
        render(<Contacto />);
        const nombre = screen.getByLabelText('Nombre');

        await userEvent.type(nombre, 'Pedro');
        await userEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

        expect(nombre).toHaveValue('');
    });

    it('actualiza el contador de caracteres', async () => {
        render(<Contacto />);

        await userEvent.type(screen.getByLabelText('Mensaje'), 'hola');

        expect(screen.getByText('4/500 caracteres')).toBeInTheDocument();
    });
});
