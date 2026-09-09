
const Validar = {

  // ------------------ Reglas ------------------

  requerido(valor) {
    return valor.trim().length > 0 ? null : "Este campo es obligatorio.";
  },

  email(valor) {
    const patron = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (!valor.trim()) return "Escribe tu correo electrónico.";
    return patron.test(valor.trim()) ? null : "El correo debe tener el formato nombre@dominio.cl";
  },

  // Valida RUT chileno calculando el dígito verificador
  rut(valor) {
    const limpio = valor.replace(/[.\-]/g, "").toUpperCase();
    if (!limpio) return "Escribe tu RUT.";
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) return "Formato inválido. Usa 12.345.678-9";

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);

    return dv === dvEsperado ? null : "El RUT no es válido. Revisa el dígito verificador.";
  }
};