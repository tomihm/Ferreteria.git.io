import { afterEach, describe, expect, it, vi } from 'vitest';
import { cargarCatalogo } from './catalogo.js';

const productos = {
    content: [
        { sku: 'HER-002', nombre: 'Esmeril Angular 4.5" 820W', marca: 'Makita', categoria: 'herramientas', precio: 31990, precioNormal: 39990, descripcion: 'Esmeril', imagen: 'assets/esmeril_angular.webp' },
        { sku: 'GEN-006', nombre: 'Escalera Tijera', marca: 'Tramontina', categoria: 'general', precio: 42990, precioNormal: null, descripcion: 'Escalera', imagen: 'assets/escalera_tijera.webp' }
    ]
};
const inventario = { content: [{ sku: 'HER-002', cantidad: 9 }] };

describe('cargarCatalogo', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('junta productos con su stock en el formato del sitio', async () => {
        vi.stubGlobal('fetch', (url) => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(url.includes('/api/inventario') ? inventario : productos)
        }));

        const catalogo = await cargarCatalogo();

        expect(catalogo[0]).toMatchObject({ codigo: 'HER-002', stock: 9, precioNormal: 39990, id: 'esmeril-angular-4-5-820w' });
        expect(catalogo[1].stock).toBe(0);
        expect(catalogo[1]).not.toHaveProperty('precioNormal');
    });
});
