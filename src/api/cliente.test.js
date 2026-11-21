import { afterEach, describe, expect, it, vi } from 'vitest';
import { pedir } from './cliente.js';

function respuesta(status, cuerpo) {
    return Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(cuerpo) });
}

describe('pedir', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        localStorage.clear();
    });

    it('manda el token guardado y el cuerpo en JSON', async () => {
        localStorage.setItem('sesion', JSON.stringify({ token: 'abc' }));
        const fetchFalso = vi.fn(() => respuesta(200, { ok: true }));
        vi.stubGlobal('fetch', fetchFalso);

        await pedir('/api/facturas', { metodo: 'POST', cuerpo: { usuarioId: 1 } });

        const [url, opciones] = fetchFalso.mock.calls[0];
        expect(url).toMatch(/\/api\/facturas$/);
        expect(opciones.method).toBe('POST');
        expect(opciones.headers.Authorization).toBe('Bearer abc');
        expect(JSON.parse(opciones.body)).toEqual({ usuarioId: 1 });
    });

    it('usa la direccion de config.js si esta definida', async () => {
        window.CONFIG = { API_URL: 'https://api.ejemplo.cl/' };
        const fetchFalso = vi.fn(() => respuesta(200, {}));
        vi.stubGlobal('fetch', fetchFalso);

        await pedir('/api/productos');

        expect(fetchFalso.mock.calls[0][0]).toBe('https://api.ejemplo.cl/api/productos');
        delete window.CONFIG;
    });

    it('usa el mensaje del backend cuando falla', async () => {
        vi.stubGlobal('fetch', () => respuesta(409, { mensaje: 'Stock insuficiente' }));

        await expect(pedir('/api/facturas')).rejects.toMatchObject({ message: 'Stock insuficiente', status: 409 });
    });

    it('avisa cuando no hay conexion', async () => {
        vi.stubGlobal('fetch', () => Promise.reject(new TypeError('Failed to fetch')));

        await expect(pedir('/api/productos')).rejects.toThrow('No pudimos conectar con el servidor');
    });
});
