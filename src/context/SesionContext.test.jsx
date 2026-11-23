import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SesionProvider, useSesion } from './SesionContext.jsx';

vi.mock('../api/sesion.js', () => ({
    iniciarSesion: vi.fn(),
    renovarSesion: () => Promise.resolve({
        id: 1, nombre: 'Ana', email: 'ana@correo.cl', rol: 'cliente', token: 'nuevo',
        expiraEn: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    })
}));

function Usuario() {
    const { usuario } = useSesion();
    return <p>{usuario ? usuario.token : 'sin sesion'}</p>;
}

function guardarSesion(minutosRestantes) {
    localStorage.setItem('sesion', JSON.stringify({
        id: 1, nombre: 'Ana', email: 'ana@correo.cl', rol: 'cliente', token: 'viejo',
        expiraEn: new Date(Date.now() + minutosRestantes * 60 * 1000).toISOString()
    }));
}

describe('SesionProvider', () => {
    afterEach(() => {
        vi.useRealTimers();
        localStorage.clear();
    });

    it('recupera la sesion guardada al recargar', () => {
        guardarSesion(30);
        render(<SesionProvider><Usuario /></SesionProvider>);
        expect(screen.getByText('viejo')).toBeInTheDocument();
    });

    it('descarta una sesion vencida', () => {
        guardarSesion(-1);
        render(<SesionProvider><Usuario /></SesionProvider>);
        expect(screen.getByText('sin sesion')).toBeInTheDocument();
    });

    it('renueva el token antes de que venza', async () => {
        vi.useFakeTimers();
        guardarSesion(6);
        render(<SesionProvider><Usuario /></SesionProvider>);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(60 * 1000);
        });

        expect(screen.getByText('nuevo')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('sesion')).token).toBe('nuevo');
    });

    it('cierra la sesion cuando el backend rechaza el token', () => {
        guardarSesion(30);
        render(<SesionProvider><Usuario /></SesionProvider>);

        act(() => window.dispatchEvent(new Event('sesion-vencida')));

        expect(screen.getByText('sin sesion')).toBeInTheDocument();
    });
});
