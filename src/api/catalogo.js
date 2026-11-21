import { pedir } from './cliente.js';
import { crearId } from '../products/catalogo.js';

export async function cargarCatalogo() {
    const [productos, inventario] = await Promise.all([
        pedir('/api/productos?size=500'),
        pedir('/api/inventario?size=500')
    ]);
    const stockPorSku = Object.fromEntries(inventario.content.map((i) => [i.sku, i.cantidad]));

    return productos.content.map((p) => ({
        codigo: p.sku,
        nombre: p.nombre,
        marca: p.marca,
        categoria: p.categoria,
        precio: p.precio,
        ...(p.precioNormal ? { precioNormal: p.precioNormal } : {}),
        descripcion: p.descripcion,
        imagen: p.imagen,
        stock: stockPorSku[p.sku] ?? 0,
        id: crearId(p.nombre)
    }));
}
