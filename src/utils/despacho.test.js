import { describe, it, expect, vi, afterEach } from 'vitest';
import { distanciaKm, dentroDelRadio, revisarDireccion, sugerirDirecciones, TIENDA } from './despacho.js';

// respuesta falsa de Nominatim con un solo resultado
const responder = (resultados) => vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(resultados) }));

describe('distanciaKm (ley de cosenos)', () => {
    it('de un punto a si mismo es 0', () => {
        expect(distanciaKm(TIENDA, TIENDA)).toBeCloseTo(0, 5);
    });

    it('de La Serena a Coquimbo son unos 11 km', () => {
        const coquimbo = [-29.9533, -71.3436];
        expect(distanciaKm(TIENDA, coquimbo)).toBeGreaterThan(9);
        expect(distanciaKm(TIENDA, coquimbo)).toBeLessThan(12);
    });

    it('de La Serena a Santiago son mas de 350 km', () => {
        expect(distanciaKm(TIENDA, [-33.4489, -70.6693])).toBeGreaterThan(350);
    });

    it('Coquimbo queda dentro del radio y Ovalle fuera', () => {
        expect(dentroDelRadio([-29.9533, -71.3436])).toBe(true);
        expect(dentroDelRadio([-30.6015, -71.1996])).toBe(false);
    });
});

describe('revisarDireccion', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('una direccion cerca de la tienda es apta', async () => {
        responder([{ lat: '-29.9100', lon: '-71.2600' }]);
        const resultado = await revisarDireccion('Los Carrera 300, La Serena');

        expect(resultado.estado).toBe('apta');
        expect(resultado.km).toBeLessThan(2);
    });

    it('una direccion lejos queda fuera', async () => {
        responder([{ lat: '-30.6015', lon: '-71.1996' }]);
        expect((await revisarDireccion('Plaza de Armas, Ovalle')).estado).toBe('fuera');
    });

    it('si el mapa no la encuentra avisa', async () => {
        responder([]);
        expect((await revisarDireccion('asdfgh')).estado).toBe('no-encontrada');
    });

    it('sin conexion responde error en vez de romperse', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
        expect((await revisarDireccion('Los Carrera 300')).estado).toBe('error');
    });
});

describe('sugerirDirecciones', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('agrega el numero escrito y junta los tramos repetidos de una calle', async () => {
        const tramo = (lon) => ({ properties: { name: 'Avenida Francisco de Aguirre', city: 'La Serena' }, geometry: { coordinates: [lon, -29.9059] } });
        responder({ features: [tramo(-71.2494), tramo(-71.2569), tramo(-71.2470)] });

        const lista = await sugerirDirecciones('francisco de aguirre 300');

        expect(lista).toHaveLength(1);
        expect(lista[0].texto).toBe('Avenida Francisco de Aguirre 300, La Serena');
        expect(lista[0].apta).toBe(true);
    });
});

describe('con token de Mapbox', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.stubEnv('VITE_MAPBOX_TOKEN', '');
    });

    const direccion = (nombre, comuna, lat, lon) => ({
        properties: {
            name: nombre,
            coordinates: { latitude: lat, longitude: lon },
            context: { place: { name: comuna }, region: { name: 'Región de Coquimbo' } },
        },
    });

    it('sugiere direcciones exactas con numero, la mas cercana primero', async () => {
        vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.prueba');
        responder({ features: [direccion('Libertad 300', 'Ovalle', -30.6015, -71.1996), direccion('Los Carrera 455', 'La Serena', -29.9032, -71.2513)] });

        const lista = await sugerirDirecciones('los carrera 455');

        expect(fetch.mock.calls[0][0]).toContain('api.mapbox.com');
        expect(lista[0]).toMatchObject({ titulo: 'Los Carrera 455', texto: 'Los Carrera 455, La Serena', apta: true });
        expect(lista[1].apta).toBe(false);
    });

    it('revisa una direccion escrita a mano con Mapbox', async () => {
        vi.stubEnv('VITE_MAPBOX_TOKEN', 'pk.prueba');
        responder({ features: [direccion('Los Carrera 455', 'La Serena', -29.9032, -71.2513)] });

        expect((await revisarDireccion('Los Carrera 455, La Serena')).estado).toBe('apta');
        expect(fetch.mock.calls[0][0]).toContain('autocomplete=false');
    });
});
