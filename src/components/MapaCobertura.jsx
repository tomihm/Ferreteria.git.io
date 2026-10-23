import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconoMarcador from 'leaflet/dist/images/marker-icon.png';
import iconoMarcador2x from 'leaflet/dist/images/marker-icon-2x.png';
import sombraMarcador from 'leaflet/dist/images/marker-shadow.png';

// con Vite leaflet no encuentra solo las imagenes del marcador, hay que pasarselas
const icono = L.icon({
    iconUrl: iconoMarcador,
    iconRetinaUrl: iconoMarcador2x,
    shadowUrl: sombraMarcador,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Av. Balmaceda 1200, La Serena
const TIENDA = [-29.9027, -71.2519];
const RADIO_DESPACHO = 12000; // en metros

function MapaCobertura() {
    const contenedorRef = useRef(null);

    useEffect(() => {
        const mapa = L.map(contenedorRef.current).setView(TIENDA, 11);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapa);

        L.marker(TIENDA, { icon: icono }).addTo(mapa).bindPopup('<b>Ferretería Los Maestros</b><br>Av. Balmaceda 1200, La Serena');

        const zona = L.circle(TIENDA, {
            radius: RADIO_DESPACHO,
            color: '#e65100',
            fillColor: '#f57c00',
            fillOpacity: 0.15,
        }).addTo(mapa).bindPopup('Zona de despacho: 12 km a la redonda');

        // que el circulo completo quede a la vista
        mapa.fitBounds(zona.getBounds());

        // al salir de la pagina se borra el mapa, si no leaflet reclama que ya existe
        return () => mapa.remove();
    }, []);

    return <div ref={contenedorRef} className="mapa-cobertura" role="region" aria-label="Mapa de la zona de despacho de 12 km" />;
}

export default MapaCobertura;
