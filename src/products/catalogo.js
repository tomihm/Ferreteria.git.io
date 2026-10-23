// mismos productos que se muestran en el catálogo, se usan para armar el carrito
const productos = [
    { codigo: 'CON-001', icono: '🧱', nombre: 'Saco de Cemento Melón 25kg', marca: 'Melón', precio: 5490, stock: 120, categoria: 'construccion', imagen: 'assets/saco_cemento_melon.png',
        descripcion: 'Cemento de uso general en saco de 25kg. Sirve para hormigones, morteros de pega y estucos en obras nuevas y reparaciones.' },
    { codigo: 'CON-002', icono: '🪨', nombre: 'Arena Gruesa Saco 25kg', marca: 'Río Maipo', precio: 2990, stock: 85, categoria: 'construccion', imagen: 'assets/arena_gruesa.webp',
        descripcion: 'Arena gruesa lavada en saco de 25kg. Se mezcla con cemento para preparar hormigón y morteros de pega.' },
    { codigo: 'CON-003', icono: '🧱', nombre: 'Ladrillo Fiscal', marca: 'Princesa', precio: 490, stock: 1500, categoria: 'construccion', imagen: 'assets/ladrillo_fiscal.webp',
        descripcion: 'Ladrillo fiscal de arcilla cocida para muros, tabiques y cierres. Se vende por unidad.' },
    { codigo: 'CON-004', icono: '🪵', nombre: 'Plancha OSB 11mm 1.22x2.44m', marca: 'Louisiana', precio: 18990, stock: 22, categoria: 'construccion', imagen: 'assets/plancha_osb.webp',
        descripcion: 'Plancha OSB de 11mm y 1.22x2.44m. Se usa para forrar muros, entrepisos y techumbres, y como base de revestimientos.' },
    { codigo: 'CON-005', icono: '🔗', nombre: 'Fierro Estriado 8mm x 6m', marca: 'CAP', precio: 4290, stock: 8, categoria: 'construccion', imagen: 'assets/fierro_estriado.webp',
        descripcion: 'Barra de fierro estriado de 8mm y 6 metros. Refuerza pilares, vigas, cadenas y radieres de hormigón armado.' },
    { codigo: 'CON-006', icono: '⬜', nombre: 'Plancha Volcanita 8mm', marca: 'Gyplac', precio: 8990, stock: 40, categoria: 'construccion', imagen: 'assets/plancha_volcanita.webp',
        descripcion: 'Plancha de yeso-cartón de 8mm para tabiques y cielos interiores. Se corta con cuchillo cartonero y se fija con tornillo volcanita.' },
    { codigo: 'HER-001', icono: '🔩', nombre: 'Taladro Percutor 750W', marca: 'Bosch', precio: 54990, stock: 14, categoria: 'herramientas', imagen: 'assets/taladro_percutor_bosch.png',
        descripcion: 'Taladro percutor de 750W. Perfora madera, metal y concreto, y tiene selector para pasar de taladro a percutor.' },
    { codigo: 'HER-002', icono: '⚙️', nombre: 'Esmeril Angular 4.5" 820W', marca: 'Makita', precio: 39990, stock: 9, categoria: 'herramientas', imagen: 'assets/esmeril_angular.webp',
        descripcion: 'Esmeril angular de 4.5" y 820W. Corta y desbasta metal, cerámica y piedra según el disco que se use.' },
    { codigo: 'HER-003', icono: '🪚', nombre: 'Sierra Circular 7-1/4" 1400W', marca: 'DeWalt', precio: 79990, stock: 6, categoria: 'herramientas', imagen: 'assets/sierra_circular.webp',
        descripcion: 'Sierra circular de 7-1/4" (185mm) y 1400W. Hace cortes rectos y en bisel en madera, terciado y OSB.' },
    { codigo: 'HER-004', icono: '🔋', nombre: 'Atornillador Inalámbrico 12V', marca: 'Stanley', precio: 44990, stock: 3, categoria: 'herramientas', imagen: 'assets/atornillador_inalambrico.webp',
        descripcion: 'Atornillador inalámbrico de 12V con batería recargable. Liviano para armar muebles, instalar bisagras y hacer trabajos en altura.' },
    { codigo: 'HER-005', icono: '🌀', nombre: 'Lijadora Orbital 300W', marca: 'Black+Decker', precio: 32990, stock: 11, categoria: 'herramientas', imagen: 'assets/lijadora_orbital.webp',
        descripcion: 'Lijadora orbital de 300W para lijar madera antes de pintar o barnizar. Deja la superficie pareja, sin marcas.' },
    { codigo: 'HER-006', icono: '📡', nombre: 'Nivel Láser 360°', marca: 'DeWalt', precio: 159990, stock: 5, categoria: 'herramientas', imagen: 'assets/nivel_laser.webp',
        descripcion: 'Nivel láser de 360° con autonivelación. Proyecta líneas horizontales y verticales para alinear cerámicas, tabiques y cielos.' },
    { codigo: 'MAN-001', icono: '🔨', nombre: 'Martillo Carpintero 16oz', marca: 'Bahco', precio: 7990, stock: 45, categoria: 'manuales', imagen: 'assets/martillo_carpintero.webp',
        descripcion: 'Martillo carpintero de 16oz con uña para sacar clavos. Sirve para carpintería, armado de moldajes y trabajos de casa.' },
    { codigo: 'MAN-002', icono: '🪛', nombre: 'Juego Destornilladores 6 piezas', marca: 'Stanley', precio: 9990, stock: 38, categoria: 'manuales', imagen: 'assets/juego_destornilladores.webp',
        descripcion: 'Juego de 6 destornilladores, con puntas paleta y cruz en distintos tamaños, para trabajos de casa y de obra.' },
    { codigo: 'MAN-003', icono: '🗜️', nombre: 'Alicate Universal 8"', marca: 'Truper', precio: 6490, stock: 52, categoria: 'manuales', imagen: 'assets/alicate_universal.webp',
        descripcion: 'Alicate universal de 8" con mango aislado. Corta alambre, dobla y sujeta piezas.' },
    { codigo: 'MAN-004', icono: '📏', nombre: 'Huincha de Medir 5m', marca: 'Bahco', precio: 4990, stock: 4, categoria: 'manuales', imagen: 'assets/huincha_medir.webp',
        descripcion: 'Huincha de medir de 5 metros con freno y gancho metálico. Cabe en el bolsillo para medir en obra.' },
    { codigo: 'MAN-005', icono: '📐', nombre: 'Nivel de Aluminio 60cm', marca: 'Stanley', precio: 11990, stock: 18, categoria: 'manuales', imagen: 'assets/nivel_aluminio.webp',
        descripcion: 'Nivel de aluminio de 60cm con burbujas horizontal y vertical. Para revisar aplomo y nivel en muros, marcos y repisas.' },
    { codigo: 'GAS-001', icono: '🔵', nombre: 'Tubo PVC Sanitario 110mm x 3m', marca: 'Vinilit', precio: 12990, stock: 30, categoria: 'gasfiteria', imagen: 'assets/tubo_pvc.webp',
        descripcion: 'Tubo de PVC sanitario de 110mm y 3 metros para redes de alcantarillado y descargas de baño y cocina.' },
    { codigo: 'GAS-002', icono: '🔄', nombre: 'Codo PVC 90° 110mm', marca: 'Vinilit', precio: 2490, stock: 90, categoria: 'gasfiteria', imagen: 'assets/codo_pvc.webp',
        descripcion: 'Codo de PVC de 90° y 110mm para cambiar de dirección en redes de descarga sanitaria.' },
    { codigo: 'GAS-003', icono: '🚰', nombre: 'Llave de Paso 1/2" Bronce', marca: 'Nibsa', precio: 8990, stock: 24, categoria: 'gasfiteria', imagen: 'assets/llave_paso.webp',
        descripcion: 'Llave de paso de bronce de 1/2". Corta el agua de un sector sin cerrar la llave general.' },
    { codigo: 'GAS-004', icono: '🎗️', nombre: 'Sello Teflón 12m', marca: 'Genérico', precio: 990, stock: 200, categoria: 'gasfiteria', imagen: 'assets/sello_teflon.webp',
        descripcion: 'Cinta de teflón de 12 metros para sellar hilos en uniones de agua y gas, y evitar filtraciones.' },
    { codigo: 'GAS-005', icono: '〰️', nombre: 'Flexible Acero Inox 40cm', marca: 'Nibsa', precio: 3990, stock: 7, categoria: 'gasfiteria', imagen: 'assets/flexible_acero.webp',
        descripcion: 'Flexible de acero inoxidable de 40cm para conectar llaves de lavamanos, lavaplatos y WC a la red de agua.' },
    { codigo: 'ELE-001', icono: '🧵', nombre: 'Cable THHN 2.5mm Rollo 100m', marca: 'Covisa', precio: 44990, stock: 12, categoria: 'electricidad', imagen: 'assets/cable_thhn.webp',
        descripcion: 'Rollo de 100 metros de cable THHN de 2.5mm. Es el que se usa en circuitos de enchufes de una vivienda.' },
    { codigo: 'ELE-002', icono: '🔘', nombre: 'Automático 16A Riel DIN', marca: 'Schneider', precio: 5990, stock: 40, categoria: 'electricidad', imagen: 'assets/automatico_16a.webp',
        descripcion: 'Interruptor automático de 16A para riel DIN. Corta el circuito cuando hay sobrecarga o cortocircuito.' },
    { codigo: 'ELE-003', icono: '💡', nombre: 'Ampolleta LED 12W E27', marca: 'Philips', precio: 2490, stock: 150, categoria: 'electricidad', imagen: 'assets/ampolleta_led.webp',
        descripcion: 'Ampolleta LED de 12W con base E27. Ilumina como una incandescente de unos 100W y gasta mucho menos.' },
    { codigo: 'ELE-004', icono: '🔌', nombre: 'Enchufe Doble Embutido', marca: 'Bticino', precio: 3490, stock: 5, categoria: 'electricidad', imagen: 'assets/enchufe_doble.webp',
        descripcion: 'Enchufe doble para instalar embutido en caja de muro, con dos tomas de 10A.' },
    { codigo: 'ELE-005', icono: '📦', nombre: 'Canaleta PVC 20x10mm 2m', marca: 'Legrand', precio: 1990, stock: 75, categoria: 'electricidad', imagen: 'assets/canaleta_pvc.webp',
        descripcion: 'Canaleta de PVC de 20x10mm y 2 metros, con tapa y adhesivo. Ordena cables a la vista sin picar el muro.' },
    { codigo: 'GEN-001', icono: '🔩', nombre: 'Tornillo Volcanita 6x1" (100 u)', marca: 'Genérico', precio: 3490, stock: 60, categoria: 'general', imagen: 'assets/tornillo_volcanita.webp',
        descripcion: 'Caja de 100 tornillos de 6x1" con punta fina para fijar planchas de volcanita a perfiles metálicos.' },
    { codigo: 'GEN-002', icono: '🧴', nombre: 'Silicona Transparente 280ml', marca: 'Akfix', precio: 4290, stock: 48, categoria: 'general', imagen: 'assets/silicona_transparente.webp',
        descripcion: 'Silicona transparente de 280ml para sellar juntas en baños, cocinas y ventanas. Resiste agua y humedad.' },
    { codigo: 'GEN-003', icono: '🧤', nombre: 'Guantes de Cabritilla', marca: 'Steelpro', precio: 3990, stock: 2, categoria: 'general', imagen: 'assets/guantes_cabritilla.webp',
        descripcion: 'Guantes de cabritilla, cuero suave y flexible. Protegen las manos sin perder tacto en trabajos de obra y bodega.' },
    { codigo: 'GEN-004', icono: '⛑️', nombre: 'Casco de Seguridad Blanco', marca: '3M', precio: 6990, stock: 33, categoria: 'general', imagen: 'assets/casco_seguridad.webp',
        descripcion: 'Casco de seguridad blanco con suspensión ajustable. Protege la cabeza de golpes y caída de objetos en obra.' },
    { codigo: 'GEN-005', icono: '⚫', nombre: 'Cinta Aisladora Negra 20m', marca: '3M', precio: 1290, stock: 110, categoria: 'general', imagen: 'assets/cinta_aisladora.webp',
        descripcion: 'Cinta aisladora negra de 20 metros. Aísla y protege empalmes en instalaciones eléctricas.' },
    { codigo: 'GEN-006', icono: '🪜', nombre: 'Escalera Tijera Aluminio 6 peldaños', marca: 'Tramontina', precio: 42990, stock: 0, categoria: 'general', imagen: 'assets/escalera_tijera.webp',
        descripcion: 'Escalera tijera de aluminio con 6 peldaños antideslizantes. Liviana y estable para pintar y trabajar en altura dentro de la casa.' }
];

// id para la url del detalle: nombre en minusculas, sin tildes ni simbolos
function crearId(nombre) {
    return nombre
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export const catalogo = productos.map((p) => ({ ...p, id: crearId(p.nombre) }));
