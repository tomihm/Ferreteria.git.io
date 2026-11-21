import { createContext, useContext, useEffect, useState } from 'react';
import { catalogo } from '../products/catalogo.js';
import { cargarCatalogo } from '../api/catalogo.js';

const CatalogoContext = createContext(catalogo);

export function CatalogoProvider({ children }) {
    const [productos, setProductos] = useState(catalogo);

    useEffect(() => {
        let activo = true;
        cargarCatalogo()
            .then((cargados) => {
                if (activo && cargados.length > 0) setProductos(cargados);
            })
            .catch(() => {});
        return () => {
            activo = false;
        };
    }, []);

    return (
        <CatalogoContext.Provider value={productos}>
            {children}
        </CatalogoContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalogo() {
    return useContext(CatalogoContext);
}
