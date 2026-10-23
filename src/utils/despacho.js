// Av. Balmaceda 1200, La Serena
export const TIENDA = [-29.9027, -71.2519];
export const RADIO_DESPACHO_KM = 12;

const RADIO_TIERRA_KM = 6371;
const aRadianes = (grados) => (grados * Math.PI) / 180;

// Distancia entre dos puntos [lat, lon] con la ley esferica de cosenos:
// d = R * acos( sen(lat1)·sen(lat2) + cos(lat1)·cos(lat2)·cos(lon2 - lon1) )
export function distanciaKm([lat1, lon1], [lat2, lon2]) {
    const φ1 = aRadianes(lat1);
    const φ2 = aRadianes(lat2);
    const Δλ = aRadianes(lon2 - lon1);

    const coseno = Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    // por redondeo puede pasarse un poco de 1 y acos daria NaN
    return RADIO_TIERRA_KM * Math.acos(Math.min(1, Math.max(-1, coseno)));
}

export function dentroDelRadio(punto) {
    return distanciaKm(TIENDA, punto) <= RADIO_DESPACHO_KM;
}

// Token publico de Mapbox (va en .env.local). Mapbox conoce los numeros de casa;
// sin token se usa OpenStreetMap, que tiene las calles pero pocos numeros.
const tokenMapbox = () => import.meta.env.VITE_MAPBOX_TOKEN;

// Busca en Mapbox (Geocoding v6) solo en Chile, dando prioridad a lo cercano a la tienda
async function buscarEnMapbox(texto, { limite, autocompletar, signal }) {
    const params = new URLSearchParams({
        q: texto,
        country: 'cl',
        proximity: `${TIENDA[1]},${TIENDA[0]}`, // Mapbox pide lon,lat
        autocomplete: String(autocompletar),
        limit: String(limite),
        language: 'es',
        access_token: tokenMapbox(),
    });
    const respuesta = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`, { signal });
    if (!respuesta.ok) throw new Error('No se pudo consultar el mapa');
    const { features } = await respuesta.json();
    return features;
}

const puntoMapbox = (feature) => [feature.properties.coordinates.latitude, feature.properties.coordinates.longitude];

// Convierte la direccion escrita en coordenadas. Devuelve [lat, lon] o null si no la encuentra.
export async function buscarCoordenadas(direccion) {
    if (tokenMapbox()) {
        const [primera] = await buscarEnMapbox(direccion, { limite: 1, autocompletar: false });
        return primera ? puntoMapbox(primera) : null;
    }

    // sin token: Nominatim (OpenStreetMap)
    const params = new URLSearchParams({
        q: direccion,
        format: 'json',
        limit: '1',
        countrycodes: 'cl',
        'accept-language': 'es',
    });
    const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
    if (!respuesta.ok) throw new Error('No se pudo consultar el mapa');

    const resultados = await respuesta.json();
    if (resultados.length === 0) return null;
    return [Number(resultados[0].lat), Number(resultados[0].lon)];
}

// Revisa si la direccion sirve para despacho. Siempre responde un objeto con el estado:
// 'apta', 'fuera' (existe pero queda lejos), 'no-encontrada' o 'error' (sin conexion)
export async function revisarDireccion(direccion) {
    try {
        const punto = await buscarCoordenadas(direccion);
        if (!punto) return { estado: 'no-encontrada' };

        const km = distanciaKm(TIENDA, punto);
        return { estado: km <= RADIO_DESPACHO_KM ? 'apta' : 'fuera', km, punto };
    } catch {
        return { estado: 'error' };
    }
}

// todo Chile continental; las de lejos igual se muestran, marcadas fuera del radio
const ZONA_SUGERENCIAS = '-76,-56,-66,-17';

// agrega la distancia a la tienda a cada sugerencia
function conDistancia(sugerencia) {
    const km = distanciaKm(TIENDA, sugerencia.punto);
    return { ...sugerencia, km, apta: km <= RADIO_DESPACHO_KM };
}

function sugerenciaMapbox(feature) {
    const p = feature.properties;
    const comuna = p.context?.place?.name;
    const lugar = [comuna, p.context?.region?.name].filter(Boolean).join(', ');
    return conDistancia({
        titulo: p.name,
        detalle: lugar,
        texto: [p.name, comuna].filter(Boolean).join(', '),
        punto: puntoMapbox(feature),
    });
}

// Arma el texto de una sugerencia de Photon. Muchas calles vienen sin numero,
// asi que si el usuario escribio uno se lo agregamos
function armarSugerencia(feature, numeroEscrito) {
    const p = feature.properties;
    const calle = p.street ?? p.name;
    const numero = p.housenumber ?? numeroEscrito;
    const principal = [calle, numero].filter(Boolean).join(' ');
    const lugar = [p.district, p.city].filter(Boolean).join(', ');
    // Photon entrega [lon, lat], al reves que leaflet
    const [lon, lat] = feature.geometry.coordinates;

    return conDistancia({
        // si es un local (ej. "Delegación Municipal") se muestra su nombre arriba
        titulo: p.name && p.name !== calle ? p.name : principal,
        detalle: p.name && p.name !== calle ? [principal, lugar].filter(Boolean).join(', ') : lugar,
        texto: [principal, p.city].filter(Boolean).join(', '),
        punto: [lat, lon],
    });
}

// Sugerencias mientras se escribe: Mapbox si hay token, si no Photon (OpenStreetMap),
// porque Nominatim no permite autocompletar.
export async function sugerirDirecciones(texto, signal) {
    if (tokenMapbox()) {
        // se piden 10 y se muestran las 5 mas cercanas a la tienda
        const features = await buscarEnMapbox(texto, { limite: 10, autocompletar: true, signal });
        return features.map(sugerenciaMapbox).sort((a, b) => a.km - b.km).slice(0, 5);
    }

    const params = new URLSearchParams({
        q: texto,
        lat: String(TIENDA[0]),
        lon: String(TIENDA[1]),
        limit: '8',
        bbox: ZONA_SUGERENCIAS,
    });
    const respuesta = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
    if (!respuesta.ok) throw new Error('No se pudo consultar el mapa');

    const { features } = await respuesta.json();
    const numeroEscrito = texto.match(/\b\d{1,5}\b/)?.[0];
    const sugerencias = features.map((f) => armarSugerencia(f, numeroEscrito));

    // una misma calle viene en varios tramos: se deja solo uno por texto
    const vistas = new Set();
    return sugerencias.filter((s) => {
        const clave = s.titulo + s.detalle;
        if (vistas.has(clave)) return false;
        vistas.add(clave);
        return true;
    }).slice(0, 5);
}
