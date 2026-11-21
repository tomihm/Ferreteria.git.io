import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registro from './Registro.jsx';

const servidor = vi.hoisted(() => ({ enviados: [], error: null }));

vi.mock('../api/sesion.js', () => ({
    registrarUsuario: async (datos) => {
        servidor.enviados.push(datos);
        if (servidor.error) throw servidor.error;
        return { id: 5 };
    }
}));

function renderRegistro() {
    return render(
        <MemoryRouter>
            <Registro />
        </MemoryRouter>
    );
}

const campo = (id) => document.getElementById(id);

async function llenarFormulario() {
    await userEvent.type(screen.getByLabelText('Nombre y apellido'), 'Juan Pérez');
    await userEvent.type(screen.getByLabelText('RUT'), '11.111.111-1');
    await userEvent.type(campo('regEmail'), 'juan@correo.cl');
    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678');
    await userEvent.type(screen.getByLabelText('Fecha de nacimiento'), '1990-05-01');
    await userEvent.type(screen.getByLabelText('Dirección'), 'Los Aromos 455, Coquimbo');
    await userEvent.type(campo('regPassword'), 'Maestro2026');
    await userEvent.type(screen.getByLabelText('Repite la contraseña'), 'Maestro2026');
}

describe('Registro', () => {
    beforeEach(() => {
        servidor.enviados = [];
        servidor.error = null;
    });

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
        await llenarFormulario();
        await userEvent.click(screen.getByLabelText('Soy contratista o maestro de obra'));
        await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

        expect(await screen.findByText(/cuenta creada/i)).toBeInTheDocument();
        expect(servidor.enviados[0]).toMatchObject({
            email: 'juan@correo.cl', fechaNacimiento: '1990-05-01', contratista: true
        });
        expect(screen.getByLabelText('Nombre y apellido')).toHaveValue('');
    });

    it('muestra el error del servidor si el correo ya existe', async () => {
        servidor.error = new Error('Ya existe un usuario con el email juan@correo.cl');
        renderRegistro();
        await llenarFormulario();
        await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

        expect(await screen.findByText('Ya existe un usuario con el email juan@correo.cl')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre y apellido')).toHaveValue('Juan Pérez');
    });
});
