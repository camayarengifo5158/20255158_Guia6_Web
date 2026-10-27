const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");
const tablaPacientes = document.getElementById("idTablaPacientes");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

const idModal = document.getElementById("idModal");

const CLAVE_PACIENTES = "guia6_pacientes";
const CLAVE_PAISES = "guia6_paises";

const leerStorage = (clave) => {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
};

const guardarStorage = (clave, datos) => {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch (error) {
    notificar("No se pudo guardar en LocalStorage", "danger");
  }
};

let arrayPaciente = leerStorage(CLAVE_PACIENTES);
let arrayPaises = leerStorage(CLAVE_PAISES);
let indiceEdicion = -1;

const notificar = (texto, tipo = "success") => {
  notificacion.className = `toast text-bg-${tipo}`;
  mensaje.innerHTML = texto;
  toast.show();
};

const textoBotonGuardar = () => {
  buttonAgregarPaciente.innerHTML =
    indiceEdicion >= 0
      ? `<i class="bi bi-check-circle-fill"></i> Actualizar Datos`
      : `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;
  buttonAgregarPaciente.className =
    indiceEdicion >= 0 ? "btn btn-info" : "btn btn-success";
};

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";
  indiceEdicion = -1;
  textoBotonGuardar();

  inputNombre.focus();
};

const addPaciente = function () {
  let nombre = inputNombre.value.trim();
  let apellido = inputApellido.value.trim();
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value.trim();

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    const paciente = [
      nombre,
      apellido,
      fechaNacimiento,
      sexo,
      labelPais,
      direccion,
      pais,
    ];

    if (indiceEdicion >= 0) {
      arrayPaciente[indiceEdicion] = paciente;
      notificar("Se han actualizado los datos del paciente", "info");
    } else {
      arrayPaciente.push(paciente);
      notificar("Se ha registrado un nuevo paciente");
    }

    guardarStorage(CLAVE_PACIENTES, arrayPaciente);
    limpiarForm();
    imprimirPacientes();
  } else {
    notificar("Faltan campos por completar", "warning");
  }
};

const editarPaciente = (indice) => {
  const paciente = arrayPaciente[indice];
  if (!paciente) return;

  inputNombre.value = paciente[0];
  inputApellido.value = paciente[1];
  inputFechaNacimiento.value = paciente[2];
  inputRdMasculino.checked = paciente[3] == "Hombre";
  inputRdFemenino.checked = paciente[3] == "Mujer";

  const opcion = [...cmbPais.options].find(
    (item) => item.value == paciente[6] || item.text == paciente[4]
  );
  cmbPais.value = opcion ? opcion.value : 0;
  inputDireccion.value = paciente[5];

  indiceEdicion = indice;
  textoBotonGuardar();
  inputNombre.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
  notificar(`Editando al paciente ${paciente[0]} ${paciente[1]}`, "primary");
};

const eliminarPaciente = (indice) => {
  const paciente = arrayPaciente[indice];
  if (!paciente) return;

  arrayPaciente.splice(indice, 1);
  guardarStorage(CLAVE_PACIENTES, arrayPaciente);

  if (indiceEdicion == indice) {
    limpiarForm();
  } else if (indiceEdicion > indice) {
    indiceEdicion--;
  }

  imprimirPacientes();
  notificar(`Se eliminó al paciente ${paciente[0]} ${paciente[1]}`, "danger");
};

function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element, indice) => {
    $fila += `<tr>
                <td scope="row" class="text-center fw-bold">${contador}</td>
                <td>${element[0]}</td>
                <td>${element[1]}</td>
                <td>${element[2]}</td>
                <td>${element[3]}</td>
                <td>${element[4]}</td>
                <td>${element[5]}</td>
                <td class="text-center">
                    <button id="idBtnEditar${contador}" type="button" class="btn btn-primary btn-editar" data-indice="${indice}" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger btn-eliminar" data-indice="${indice}" title="Eliminar">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </td>
            </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  if (arrayPaciente.length == 0) {
    tablaPacientes.innerHTML = "Ninguno";
    return;
  }

  let $table = `<div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered">
                        <tr>
                            <th scope="col" class="text-center" style="width:5%">#</th>
                            <th scope="col" class="text-center" style="width:15%">Nombre</th>
                            <th scope="col" class="text-center" style="width:15%">Apellido</th>
                            <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                            <th scope="col" class="text-center" style="width:10%">Sexo</th>
                            <th scope="col" class="text-center" style="width:10%">País</th>
                            <th scope="col" class="text-center" style="width:25%">Dirección</th>
                            <th scope="col" class="text-center" style="width:10%">Opciones</th>
                        </tr>
                        ${imprimirFilas()}
                    </table>
                </div>
            `;
  tablaPacientes.innerHTML = $table;
};

const agregarOpcionPais = (nombre, valor) => {
  let option = document.createElement("option");
  option.textContent = nombre;
  option.value = valor;
  cmbPais.appendChild(option);
};

const addPais = () => {
  let paisNew = inputNombrePais.value.trim();

  if (paisNew != "") {
    const valor = cmbPais.children.length;
    agregarOpcionPais(paisNew, valor);
    arrayPaises.push([paisNew, valor]);
    guardarStorage(CLAVE_PAISES, arrayPaises);

    notificar("Pais agregado correctamente");
  } else {
    notificar("Faltan campos por completar", "warning");
  }
};

tablaPacientes.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;

  const indice = parseInt(boton.dataset.indice);
  if (boton.classList.contains("btn-editar")) {
    editarPaciente(indice);
  } else if (boton.classList.contains("btn-eliminar")) {
    eliminarPaciente(indice);
  }
});

buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

arrayPaises.forEach((pais) => agregarOpcionPais(pais[0], pais[1]));
limpiarForm();
imprimirPacientes();
