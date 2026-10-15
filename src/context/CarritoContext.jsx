import { createContext, useContext, useEffect, useState } from 'react';
import { catalogo } from '../products/catalogo.js';

const CarritoContext = createContext(null);

const CLAVE_STORAGE = 'carrito';

// si hay un carrito guardado se recupera, si no parte vacío
function leerCarritoGuardado() {
    try {
        const guardado = localStorage.getItem(CLAVE_STORAGE);
        return guardado ? JSON.parse(guardado) : [];
    } catch {
        return [];
    }
}

export function CarritoProvider({ children }) {
    const [items, setItems] = useState(leerCarritoGuardado);

    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
        } catch {
            // si el navegador no deja guardar, el carrito igual funciona
        }
    }, [items]);

    const agregar = (codigo, cantidad = 1) => {
        const producto = catalogo.find((p) => p.codigo === codigo);
        if (!producto || producto.stock === 0) return;

        const enCarrito = items.find((item) => item.codigo === codigo);
        if (enCarrito) {
            // no se puede pasar del stock disponible
            const nuevaCantidad = Math.min(enCarrito.cantidad + cantidad, producto.stock);
            setItems(items.map((item) => (item.codigo === codigo ? { ...item, cantidad: nuevaCantidad } : item)));
        } else {
            setItems([...items, { ...producto, cantidad: Math.min(cantidad, producto.stock) }]);
        }
    };

    const cambiarCantidad = (codigo, cantidad) => {
        setItems(items.map((item) => (item.codigo === codigo ? { ...item, cantidad } : item)));
    };

    const quitar = (codigo) => {
        setItems(items.filter((item) => item.codigo !== codigo));
    };

    const vaciar = () => {
        setItems([]);
    };

    const totalUnidades = items.reduce((total, item) => total + (Number(item.cantidad) || 0), 0);

    return (
        <CarritoContext.Provider value={{ items, agregar, cambiarCantidad, quitar, vaciar, totalUnidades }}>
            {children}
        </CarritoContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito() {
    return useContext(CarritoContext);
}
