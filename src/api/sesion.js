import { pedir } from './cliente.js';

export async function iniciarSesion(email, password) {
    try {
        const datos = await pedir('/api/auth/login', {
            metodo: 'POST',
            cuerpo: { email: email.trim().toLowerCase(), password }
        });
        return {
            id: datos.usuarioId,
            nombre: datos.nombre,
            email: datos.email,
            rol: datos.rol.toLowerCase(),
            token: datos.token,
            expiraEn: datos.expiraEn
        };
    } catch (error) {
        if (error.status === 401) throw new Error('Correo o contraseña incorrectos.', { cause: error });
        throw error;
    }
}

export function registrarUsuario(datos) {
    return pedir('/api/auth/registro', {
        metodo: 'POST',
        cuerpo: {
            nombre: datos.nombre.trim(),
            rut: datos.rut.trim(),
            email: datos.email.trim().toLowerCase(),
            telefono: datos.telefono.trim(),
            fechaNacimiento: datos.fechaNacimiento,
            direccion: datos.direccion.trim(),
            password: datos.password,
            rol: datos.contratista ? 'CONTRATISTA' : 'CLIENTE'
        }
    });
}
