import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// los tests no usan el token de .env.local: parten con OpenStreetMap y simulan las respuestas
vi.stubEnv('VITE_MAPBOX_TOKEN', '');

afterEach(() => {
    cleanup();
});
