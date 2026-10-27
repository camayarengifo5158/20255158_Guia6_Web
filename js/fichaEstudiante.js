const reglas = {
  idTxtCarnet: {
    regex: /^[A-Z]{2}\d{3}$/,
    error: "El carnet debe tener dos letras mayúsculas y tres números. Ejemplo: AB001",
  },
  idTxtNombreCompleto: {
    regex: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/,
    error: "Escriba nombre y apellido usando solo letras y espacios",
  },
  idTxtDui: {
    regex: /^\d{8}-\d$/,
    error: "El DUI debe tener el formato ########-#",
  },
  idTxtNit: {
    regex: /^\d{4}-\d{6}-\d{3}-\d$/,
    error: "El NIT debe tener el formato ####-######-###-#",
  },
  idTxtFecha: {
    regex: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
    error: "La fecha debe ser válida y tener el formato dd/mm/aaaa",
  },
  idTxtCorreo: {
    regex: /^[\w.+-]+@[A-Za-z\d-]+(\.[A-Za-z\d-]+)*\.[A-Za-z]{2,}$/,
    error: "Ingrese un correo válido. Ejemplo: usuario@dominio.com",
  },
  idTxtEdad: {
    regex: /^\d{1,3}$/,
    error: "La edad solo puede contener números",
  },
};

const formulario = document.getElementById("idFormFicha");
const contenedorFichas = document.getElementById("idTablaFichas");
const buttonLimpiar = document.getElementById("idBtnLimpiarFicha");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

let arrayFichas = [];

const notificar = (texto, tipo = "success") => {
  notificacion.className = `toast text-bg-${tipo}`;
  mensaje.innerHTML = texto;
  toast.show();
};

const fechaExiste = (texto) => {
  const [dia, mes, anio] = texto.split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() == anio &&
    fecha.getMonth() == mes - 1 &&
    fecha.getDate() == dia &&
    fecha <= new Date()
  );
};

const validarCampo = (id) => {
  const campo = document.getElementById(id);
  const valor = campo.value.trim();
  let valido = reglas[id].regex.test(valor);

  if (valido && id == "idTxtFecha") valido = fechaExiste(valor);
  if (valido && id == "idTxtEdad") valido = parseInt(valor) > 0 && parseInt(valor) < 120;

  campo.classList.toggle("is-valid", valido);
  campo.classList.toggle("is-invalid", !valido);
  document.getElementById(`${id}Error`).textContent = valido ? "" : reglas[id].error;
  return valido;
};

const limpiarFicha = () => {
  formulario.reset();
  Object.keys(reglas).forEach((id) => {
    const campo = document.getElementById(id);
    campo.classList.remove("is-valid", "is-invalid");
    document.getElementById(`${id}Error`).textContent = "";
  });
  document.getElementById("idTxtCarnet").focus();
};

const imprimirFichas = () => {
  if (arrayFichas.length == 0) {
    contenedorFichas.innerHTML = "Ninguno";
    return;
  }

  let filas = "";
  arrayFichas.forEach((ficha, indice) => {
    filas += `<tr>
                <td class="text-center fw-bold">${indice + 1}</td>
                ${ficha.map((dato) => `<td>${dato}</td>`).join("")}
              </tr>`;
  });

  contenedorFichas.innerHTML = `<div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Carnet</th>
          <th class="text-center">Nombre completo</th>
          <th class="text-center">DUI</th>
          <th class="text-center">NIT</th>
          <th class="text-center">Fecha nacimiento</th>
          <th class="text-center">Correo</th>
          <th class="text-center">Edad</th>
        </tr>
        ${filas}
      </table>
    </div>`;
};

Object.keys(reglas).forEach((id) => {
  const campo = document.getElementById(id);
  campo.addEventListener("input", () => validarCampo(id));
});

document.getElementById("idTxtCarnet").addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase();
  validarCampo("idTxtCarnet");
});

document.getElementById("idTxtEdad").addEventListener("keypress", (e) => {
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const resultados = Object.keys(reglas).map((id) => validarCampo(id));

  if (resultados.every((valido) => valido)) {
    arrayFichas.push(
      Object.keys(reglas).map((id) => document.getElementById(id).value.trim())
    );
    imprimirFichas();
    limpiarFicha();
    notificar("La ficha del estudiante es válida y fue registrada");
  } else {
    notificar("Hay campos con formato incorrecto", "danger");
    const primero = formulario.querySelector(".is-invalid");
    if (primero) primero.focus();
  }
});

buttonLimpiar.onclick = () => {
  limpiarFicha();
};

limpiarFicha();
