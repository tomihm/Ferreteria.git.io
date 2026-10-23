import { useEffect, useState } from 'react';
import { sugerirDirecciones } from '../utils/despacho.js';

const ESPERA_MS = 400; // se busca cuando el usuario deja de escribir
const MINIMO_LETRAS = 3;

const formatoKm = (km) => `${km.toLocaleString('es-CL', { maximumFractionDigits: 1 })} km`;

// Campo de direccion con lista de coincidencias (combobox).
// onElegir recibe la sugerencia elegida, que ya trae sus coordenadas y distancia.
function BuscadorDireccion({ id, value, onChange, onElegir, onBlur, className, describedBy }) {
    const [sugerencias, setSugerencias] = useState([]);
    const [abierta, setAbierta] = useState(false);
    const [activa, setActiva] = useState(-1);
    // al elegir una opcion el texto cambia, pero no hay que volver a buscar
    const [elegida, setElegida] = useState(null);

    const texto = value.trim();
    const buscar = texto.length >= MINIMO_LETRAS && texto !== elegida;

    useEffect(() => {
        if (!buscar) return;

        // si se sigue escribiendo, se cancela la busqueda anterior
        const control = new AbortController();
        const espera = setTimeout(() => {
            sugerirDirecciones(texto, control.signal)
                .then((lista) => {
                    setSugerencias(lista);
                    setActiva(-1);
                    setAbierta(true);
                })
                .catch(() => {
                    // cancelada o sin conexion: la lista no se muestra
                });
        }, ESPERA_MS);

        return () => {
            clearTimeout(espera);
            control.abort();
        };
    }, [texto, buscar]);

    const elegir = (sugerencia) => {
        setElegida(sugerencia.texto);
        setAbierta(false);
        setSugerencias([]);
        onElegir(sugerencia);
    };

    const handleTeclas = (e) => {
        if (!abierta || sugerencias.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiva((activa + 1) % sugerencias.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiva(activa <= 0 ? sugerencias.length - 1 : activa - 1);
        } else if (e.key === 'Enter' && activa >= 0) {
            // Enter elige la opcion marcada en vez de enviar el formulario
            e.preventDefault();
            elegir(sugerencias[activa]);
        } else if (e.key === 'Escape') {
            setAbierta(false);
        }
    };

    const mostrarLista = abierta && buscar && sugerencias.length > 0;
    const idLista = `${id}-sugerencias`;

    return (
        <div className="buscador-direccion">
            <input
                type="text"
                id={id}
                name="direccion"
                value={value}
                onChange={onChange}
                onKeyDown={handleTeclas}
                onBlur={() => {
                    setAbierta(false);
                    onBlur();
                }}
                className={className}
                placeholder="Calle, número, comuna"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={mostrarLista}
                aria-controls={idLista}
                aria-activedescendant={mostrarLista && activa >= 0 ? `${idLista}-${activa}` : undefined}
                aria-describedby={describedBy}
            />
            {mostrarLista && (
                <ul id={idLista} role="listbox" aria-label="Direcciones encontradas" className="buscador-direccion__lista">
                    {sugerencias.map((s, i) => (
                        <li
                            key={s.titulo + s.detalle}
                            id={`${idLista}-${i}`}
                            role="option"
                            aria-selected={i === activa}
                            className={`buscador-direccion__opcion${i === activa ? ' buscador-direccion__opcion--activa' : ''}`}
                            // mousedown en vez de click: asi el campo no pierde el foco antes de elegir
                            onMouseDown={(e) => {
                                e.preventDefault();
                                elegir(s);
                            }}
                            onMouseEnter={() => setActiva(i)}
                        >
                            <span className="buscador-direccion__texto">
                                <strong>{s.titulo}</strong>
                                {s.detalle && <span>{s.detalle}</span>}
                            </span>
                            <span className={s.apta ? 'buscador-direccion__km buscador-direccion__km--apta' : 'buscador-direccion__km'}>
                                {s.apta ? '✓' : '✗'} {formatoKm(s.km)}
                                <span className="visually-hidden">{s.apta ? ', con despacho' : ', fuera de la zona de despacho'}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BuscadorDireccion;
