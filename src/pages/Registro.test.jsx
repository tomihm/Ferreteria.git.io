import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registro from './Registro.jsx';

function renderRegistro() {
    return render(
        <MemoryRouter>
            <Registro />
        </MemoryRouter>
    );
}

const campo = (id) => document.getElementById(id);

describe('Registro', () => {
    it('tiene un link para volver a entrar', () => {
        renderRegistro();

        expect(screen.getByRole('heading', { name: 'Crea tu cuenta' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login');
    });

    it('marca el rut si el digito verificador esta malo', async () => {
        renderRegistro();
        await userEvent.type(screen.getByLabelText('RUT'), '12.345.678-9');
        await userEvent.tab();

        expect(screen.getByText('El RUT no es válido. Revisa el dígito verificador.')).toBeInTheDocument();
    });

    it('avisa si las contraseñas no coinciden', async () => {
        renderRegistro();
        await userEvent.type(campo('regPassword'), 'Maestro2026');
        await userEvent.type(screen.getByLabelText('Repite la contraseña'), 'Maestro2025');
        await userEvent.tab();

        expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    });

    it('crea la cuenta si todo esta bien', async () => {
        renderRegistro();
        await userEvent.type(screen.getByLabelText('Nombre y apellido'), 'Juan Pérez');
        await userEvent.type(screen.getByLabelText('RUT'), '11.111.111-1');
        await userEvent.type(campo('regEmail'), 'juan@correo.cl');
        await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678');
        await userEvent.type(screen.getByLabelText('Dirección'), 'Los Aromos 455, Coquimbo');
        await userEvent.type(campo('regPassword'), 'Maestro2026');
        await userEvent.type(screen.getByLabelText('Repite la contraseña'), 'Maestro2026');
        await userEvent.click(screen.getByLabelText('Soy contratista o maestro de obra'));
        await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

        expect(screen.getByText(/cuenta válida/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre y apellido')).toHaveValue('');
    });
});
