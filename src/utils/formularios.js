// ayudas compartidas por los formularios de entrar y crear cuenta

// las reglas reciben el form completo por si un campo depende de otro
export function validarTodo(reglas, form) {
    const errores = {};
    Object.keys(reglas).forEach((campo) => {
        errores[campo] = reglas[campo](form[campo], form);
    });
    return errores;
}

export function hayErrores(errores) {
    return Object.values(errores).some((err) => err !== null);
}

export function claseCampo(errores, campo) {
    if (errores[campo]) return 'form-control is-invalid';
    if (errores[campo] === null) return 'form-control is-valid';
    return 'form-control';
}
