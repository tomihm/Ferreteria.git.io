const RETRASO_MOCK_MS = 50;

// los 3 tipos de usuario de la tienda, hasta que exista el backend
// admin: ve stock, pedidos en linea y mensajes de contacto
// contratista: compra a plazo con credito de la empresa y recibe facturas
// cliente: compra normal por la web
const usuarios = [
    { rut: '11.111.111-1', nombre: 'Carlos Muñoz', email: 'admin@losmaestros.cl', password: 'Admin2026', rol: 'admin' },
    { rut: '33.333.333-3', nombre: 'Juan Pérez', email: 'contratista@correo.cl', password: 'Contratista2026', rol: 'contratista' },
    { rut: '44.444.444-4', nombre: 'María Rojas', email: 'cliente@correo.cl', password: 'Cliente2026', rol: 'cliente' }
];

// devuelve el usuario sin la contraseña, o falla si los datos no calzan
export function iniciarSesion(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const encontrado = usuarios.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
            if (!encontrado) {
                reject(new Error('Correo o contraseña incorrectos.'));
                return;
            }
            const { rut, nombre, rol } = encontrado;
            resolve({ rut, nombre, email: encontrado.email, rol });
        }, RETRASO_MOCK_MS);
    });
}
