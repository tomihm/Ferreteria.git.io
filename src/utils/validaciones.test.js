import { describe, it, expect } from 'vitest';
import Validar from './validaciones.js';

describe('Validar.requerido', () => {
    it('devuelve null si hay texto', () => {
        expect(Validar.requerido('hola')).toBeNull();
    });

    it('da error si viene vacio o con espacios', () => {
        expect(Validar.requerido('')).toBe('Este campo es obligatorio.');
        expect(Validar.requerido('   ')).toBe('Este campo es obligatorio.');
    });
});

describe('Validar.email', () => {
    it('acepta un correo normal', () => {
        expect(Validar.email('juan.perez@gmail.com')).toBeNull();
    });

    it('rechaza correos mal escritos', () => {
        expect(Validar.email('juan@')).not.toBeNull();
        expect(Validar.email('juangmail.com')).not.toBeNull();
    });

    it('pide el correo si esta vacio', () => {
        expect(Validar.email('')).toBe('Escribe tu correo electrónico.');
    });
});

describe('Validar.telefono', () => {
    it('acepta celular con y sin +56', () => {
        expect(Validar.telefono('+569 1234 5678')).toBeNull();
        expect(Validar.telefono('912345678')).toBeNull();
    });

    it('rechaza numeros que no son celular', () => {
        expect(Validar.telefono('12345')).not.toBeNull();
        expect(Validar.telefono('+56 2 2345 6789')).not.toBeNull();
    });
});

describe('Validar.rut', () => {
    it('acepta un rut con digito verificador correcto', () => {
        expect(Validar.rut('11.111.111-1')).toBeNull();
        expect(Validar.rut('12.345.678-5')).toBeNull();
    });

    it('rechaza digito verificador incorrecto', () => {
        expect(Validar.rut('12.345.678-9')).toBe('El RUT no es válido. Revisa el dígito verificador.');
    });
});

describe('Validar.password', () => {
    it('pide minimo 8 caracteres, mayuscula, minuscula y numero', () => {
        expect(Validar.password('Abc123')).toBe('Debe tener al menos 8 caracteres.');
        expect(Validar.password('abcdefg1')).toBe('Debe incluir al menos una mayúscula.');
        expect(Validar.password('ABCDEFG1')).toBe('Debe incluir al menos una minúscula.');
        expect(Validar.password('Abcdefgh')).toBe('Debe incluir al menos un número.');
        expect(Validar.password('Abcdefg1')).toBeNull();
    });
});

describe('Validar.longitudMinima', () => {
    it('usa la etiqueta en el mensaje', () => {
        expect(Validar.longitudMinima('ab', 3, 'El nombre')).toBe('El nombre debe tener al menos 3 caracteres.');
        expect(Validar.longitudMinima('Ana', 3, 'El nombre')).toBeNull();
    });
});

describe('Validar.confirmarPassword', () => {
    it('pide repetir la contraseña y que coincidan', () => {
        expect(Validar.confirmarPassword('', 'Abcdefg1')).toBe('Repite la contraseña.');
        expect(Validar.confirmarPassword('Abcdefg2', 'Abcdefg1')).toBe('Las contraseñas no coinciden.');
        expect(Validar.confirmarPassword('Abcdefg1', 'Abcdefg1')).toBeNull();
    });
});

describe('Validar en el DOM', () => {
    function armarCampo() {
        document.body.innerHTML = `
            <input id="correo" />
            <span id="error-correo"></span>
            <div id="avisos"></div>
        `;
        return document.getElementById('correo');
    }

    it('aplicar marca el campo en rojo con el mensaje y luego en verde', () => {
        const input = armarCampo();
        const error = document.getElementById('error-correo');

        expect(Validar.aplicar('correo', 'Escribe tu correo electrónico.')).toBe(false);
        expect(input).toHaveClass('invalido');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(error).toHaveTextContent('Escribe tu correo electrónico.');

        expect(Validar.aplicar('correo', null)).toBe(true);
        expect(input).toHaveClass('valido');
        expect(input).not.toHaveClass('invalido');
        expect(error).toHaveTextContent('');
    });

    it('aplicar no falla si el campo no existe', () => {
        document.body.innerHTML = '';
        expect(Validar.aplicar('noExiste', 'error')).toBe(true);
    });

    it('enVivo valida al salir del campo y corrige mientras se escribe', () => {
        const input = armarCampo();
        Validar.enVivo('correo', Validar.email);

        input.value = 'juan@';
        input.dispatchEvent(new Event('blur'));
        expect(input).toHaveClass('invalido');

        input.value = 'juan@gmail.com';
        input.dispatchEvent(new Event('input'));
        expect(input).toHaveClass('valido');
    });

    it('formatearRut pone puntos y guion mientras se escribe', () => {
        document.body.innerHTML = '<input id="rut" />';
        const input = document.getElementById('rut');
        Validar.formatearRut('rut');

        input.value = '123456785';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('12.345.678-5');

        input.value = 'k';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('K');
    });

    it('mensajeGeneral muestra el aviso como texto, sin interpretar HTML', () => {
        armarCampo();

        Validar.mensajeGeneral('avisos', '<b>Pedido enviado</b>', 'exito');

        const alerta = document.querySelector('#avisos .alerta');
        expect(alerta).toHaveClass('alerta--exito');
        expect(alerta.textContent).toBe('<b>Pedido enviado</b>');
        expect(alerta.querySelector('b')).toBeNull();
    });
});
