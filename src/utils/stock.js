// bajo este numero se avisa que quedan pocas unidades
const STOCK_BAJO = 8;

export function estadoStock(stock) {
    if (stock === 0) return { texto: 'Sin stock', clase: 'text-bg-danger' };
    if (stock <= STOCK_BAJO) return { texto: `Quedan ${stock}`, clase: 'text-bg-warning' };
    return { texto: `Disponible: ${stock.toLocaleString('es-CL')}`, clase: 'text-bg-success' };
}
