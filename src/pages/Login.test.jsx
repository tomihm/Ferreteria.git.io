import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SesionProvider } from '../context/SesionContext.jsx';
import Login from './Login.jsx';

vi.mock('../api/sesion.js', () => {
    const usuarios = [
        { email: 'admin@losmaestros.cl', password: 'Admin2026', nombre: 'Carlos Muñoz', rol: 'admin' },
        { email: 'contratista@correo.cl', password: 'Contratista2026', nombre: 'Juan Pérez', rol: 'contratista' },
        { email: 'cliente@correo.cl', password: 'Cliente2026', nombre: 'María Rojas', rol: 'cliente' }
    ];
    return {
        iniciarSesion: async (email, password) => {
            const encontrado = usuarios.find((u) => u.email === email && u.password === password);
            if (!encontrado) throw new Error('Correo o contraseña incorrectos.');
            return { id: 1, nombre: encontrado.nombre, email, rol: encontrado.rol, token: 'token-de-prueba' };
        }
    };
});

// las paginas de destino se reemplazan por un texto para saber a donde llego
function renderLogin() {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <SesionProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/panel" element={<p>Pagina panel</p>} />
                    <Route path="/mis-pedidos" element={<p>Pagina mis pedidos</p>} />
                </Routes>
            </SesionProvider>
        </MemoryRouter>
    );
}

const campo = (id) => document.getElementById(id);

async function entrarCon(email, password) {
    await userEvent.type(campo('loginEmail'), email);
    await userEvent.type(campo('loginPassword'), password);
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('Login', () => {
    beforeEach(() => localStorage.clear());

    it('muestra solo el formulario para entrar', () => {
        renderLogin();

        expect(screen.getByRole('heading', { name: 'Entra a tu cuenta' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Crea tu cuenta' })).not.toBeInTheDocument();
    });

    it('bajo la contraseña hay un link para crear cuenta', () => {
        renderLogin();

        expect(screen.getByText(/¿No tienes cuenta\?/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute('href', '/registro');
    });

    it('no deja entrar con los campos vacios', async () => {
        renderLogin();
        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

        expect(screen.getByText('Revisa el correo y la contraseña.')).toBeInTheDocument();
        expect(campo('loginEmail')).toHaveClass('is-invalid');
        expect(campo('loginPassword')).toHaveClass('is-invalid');
    });

    it('avisa si el correo o la contraseña no son de ningun usuario', async () => {
        renderLogin();
        await entrarCon('admin@losmaestros.cl', 'otraClave1');

        expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
    });

    it('el admin entra directo al panel', async () => {
        renderLogin();
        await entrarCon('admin@losmaestros.cl', 'Admin2026');

        expect(await screen.findByText('Pagina panel')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('sesion'))).toMatchObject({ nombre: 'Carlos Muñoz', rol: 'admin' });
    });

    it('el contratista y el cliente entran a sus pedidos', async () => {
        renderLogin();
        await entrarCon('contratista@correo.cl', 'Contratista2026');

        expect(await screen.findByText('Pagina mis pedidos')).toBeInTheDocument();
    });

    it('si ya tiene sesion no muestra el formulario', () => {
        localStorage.setItem('sesion', JSON.stringify({ nombre: 'Carlos Muñoz', rol: 'admin' }));
        renderLogin();

        expect(screen.getByText('Pagina panel')).toBeInTheDocument();
    });

    it('la contraseña no se guarda en la sesion', async () => {
        renderLogin();
        await entrarCon('cliente@correo.cl', 'Cliente2026');
        await screen.findByText('Pagina mis pedidos');

        expect(localStorage.getItem('sesion')).not.toContain('Cliente2026');
    });
});
