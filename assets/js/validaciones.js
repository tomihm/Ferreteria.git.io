
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
}
  }

  telefono(valor) {
    const limpio = valor.replace(/\s/g, "");
    if (!limpio) return "Escribe un teléfono de contacto.";
    return /^(\+56)?9\d{8}$/.test(limpio) ? null : "Usa el formato +569 1234 5678";
  }

  password(valor) {
    if (!valor) return "Crea una contraseña.";
    if (valor.length < 8) return "Debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(valor)) return "Debe incluir al menos una mayúscula.";
    if (!/[a-z]/.test(valor)) return "Debe incluir al menos una minúscula.";
    if (!/\d/.test(valor)) return "Debe incluir al menos un número.";
    return null;
  },

  confirmarPassword(valor, original) {
    if (!valor) return "Repite la contraseña.";
    return valor === original ? null : "Las contraseñas no coinciden.";
  },

  longitudMinima(valor, minimo, etiqueta = "Este campo") {
    if (!valor.trim()) return "Este campo es obligatorio.";
    return valor.trim().length >= minimo ? null : `${etiqueta} debe tener al menos ${minimo} caracteres.`;
  },

  // ------------------ Interfaz ------------------

  // Marca el campo en rojo o verde y muestra u oculta el mensaje
  aplicar(idCampo, mensajeError) {
    const input = document.getElementById(idCampo);
    const error = document.getElementById("error-" + idCampo);
    if (!input) return true;

    if (mensajeError) {
      input.classList.add("invalido");
      input.classList.remove("valido");
      input.setAttribute("aria-invalid", "true");
      if (error) {
        error.textContent = mensajeError;
        error.classList.add("visible");
      }
      return false;
    }

    input.classList.remove("invalido");
    input.classList.add("valido");
    input.setAttribute("aria-invalid", "false");
    if (error) {
      error.textContent = "";
      error.classList.remove("visible");
    }
    return true;
  }

  // Valida al salir del campo, y mientras se escribe si ya estaba marcado en rojo
  enVivo(idCampo, funcionValidadora) {
    const input = document.getElementById(idCampo);
    if (!input) return;

    const revisar = () => Validar.aplicar(idCampo, funcionValidadora(input.value));

    input.addEventListener("blur", revisar);
    input.addEventListener("input", () => {
      if (input.classList.contains("invalido")) revisar();
    });
  }

  // Da formato al RUT mientras el usuario escribe: 12.345.678-9
  formatearRut(idCampo) {
    const input = document.getElementById(idCampo);
    if (!input) return;

    input.addEventListener("input", () => {
      let v = input.value.replace(/[^0-9kK]/g, "").toUpperCase();
      if (v.length <= 1) {
        input.value = v;
        return;
      }
      const dv = v.slice(-1);
      let cuerpo = v.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      input.value = cuerpo + "-" + dv;
    });
  }

  // Muestra un aviso general arriba del formulario
  mensajeGeneral(idContenedor, texto, tipo) {
    const contenedor = document.getElementById(idContenedor);
    if (contenedor) {
      contenedor.innerHTML = `<div class="alerta alerta--${tipo}">${texto}</div>`;
    }
  }
