const RETRASO_MOCK_MS = 300;

const items = [
    { codigo: 'CON-001', icono: '🧱', producto: 'Saco de Cemento Melón 25kg', unidad: 'por saco', precio: 5490, cantidad: 20, stock: 120 },
    { codigo: 'HER-001', icono: '🔩', producto: 'Taladro Percutor 750W', unidad: 'por unidad', precio: 54990, cantidad: 1, stock: 14 },
    { codigo: 'MAN-001', icono: '🔨', producto: 'Martillo Carpintero 16oz', unidad: 'por unidad', precio: 7990, cantidad: 3, stock: 45 }
];

// Simula la respuesta del backend con el carrito guardado del usuario
export function cargarCarrito() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(items.map((item) => ({ ...item })));
        }, RETRASO_MOCK_MS);
    });
}
