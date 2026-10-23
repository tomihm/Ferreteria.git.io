// porcentaje de descuento de un producto en oferta, o null si no tiene
export function descuento(producto) {
    if (!producto.precioNormal) return null;
    return Math.round((1 - producto.precio / producto.precioNormal) * 100);
}
