import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SesionProvider } from '../context/SesionContext.jsx';
import RutaProtegida from './RutaProtegida.jsx';

function renderPanelComo(usuario) {
    if (usuario) localStorage.setItem('sesion', JSON.stringify(usuario));
    render(
        <MemoryRouter initialEntries={['/panel']}>
            <SesionProvider>
                <Routes>
                    <Route path="/" element={<p>Pagina inicio</p>} />
                    <Route path="/login" element={<p>Pagina login</p>} />
                    <Route path="/panel" element={<RutaProtegida roles={['admin']}><p>Pagina panel</p></RutaProtegida>} />
                </Routes>
            </SesionProvider>
        </MemoryRouter>
    );
}

describe('RutaProtegida', () => {
    beforeEach(() => localStorage.clear());

    it('sin sesion manda a iniciar sesion', () => {
        renderPanelComo(null);
        expect(screen.getByText('Pagina login')).toBeInTheDocument();
    });

    it('un cliente no puede ver el panel', () => {
        renderPanelComo({ nombre: 'María Rojas', rol: 'cliente' });
        expect(screen.getByText('Pagina inicio')).toBeInTheDocument();
    });

    it('un contratista no puede ver el panel', () => {
        renderPanelComo({ nombre: 'Juan Pérez', rol: 'contratista' });
        expect(screen.getByText('Pagina inicio')).toBeInTheDocument();
    });

    it('el admin ve el panel', () => {
        renderPanelComo({ nombre: 'Carlos Muñoz', rol: 'admin' });
        expect(screen.getByText('Pagina panel')).toBeInTheDocument();
    });
});
