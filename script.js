//Array de todos los materiales. ----------------------------------------------------------------
let materialDidactico = [];
//Enlace a la base de datos. ----------------------------------------------------------------
const url = "./db/data.json";

function obtenerMateriales() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      materialDidactico = data;
      renderizarTarjertas(materialDidactico);
    });
}
obtenerMateriales();

//Elementos del Html ----------------------------------------------------------------
const seccionTarjetas = document.getElementById("cardsbox");
const grupoBotones = document.getElementsByClassName("filtros");
const grupBtnReservar = document.getElementsByClassName("btn");
const btnCancelar = document.getElementsByClassName("btn-cancel");
const btnsMisReservas = document.getElementsByClassName("btn-mr");

//Array de los materiales reservados ----------------------------------------------------------------
let agregadosALaBolsa = JSON.parse(localStorage.getItem("bolsaGuardada")) || [];

//funciones ppales ----------------------------------------------------------------
function renderizarTarjertas(arrayDeMateriales) {
  seccionTarjetas.innerHTML = "";
  arrayDeMateriales.forEach(
    (material) =>
      (seccionTarjetas.innerHTML += `
        <div>
            <h3>${material.titulo}</h3>
            <h4>Disponibles: ${material.stock}</h4>
            <button id='${material.id}' class='btn' ${
        material.stock === 0 ? "disabled" : ""
      }>
                ${
                  material.stock === 0 ? "Todo reservado" : "Agregar a la Bolsa"
                }
            </button>
        </div>`)
  );
  agregarMaterial();
}

//renderizarTarjertas(materialDidactico);

function agregarMaterial() {
  for (const button of grupBtnReservar) {
    button.addEventListener("click", () => {
      const materialSeleccionado = materialDidactico.find(
        (material) => material.id === parseInt(button.id)
      );
      if (materialSeleccionado) {
        Toastify({
          text: `Agregaste "${materialSeleccionado.titulo}" a la Bolsa de materiales.`,
          duration: 3000,
          position: "center",
          gravity: "top",
        }).showToast();
        agregadosALaBolsa.push(materialSeleccionado);
        localStorage.setItem(
          "bolsaGuardada",
          JSON.stringify(agregadosALaBolsa)
        );
      }
    });
  }
}

// Botón Biblioteca ----------------------------------------------------------------
grupoBotones[0].addEventListener("click", () => {
  const biblioteca = materialDidactico.filter((material) => material.grup == 1);
  renderizarTarjertas(biblioteca);
});

// Botón Audiovisual ----------------------------------------------------------------
grupoBotones[1].addEventListener("click", () => {
  const audiovisual = materialDidactico.filter(
    (material) => material.grup == 2
  );
  renderizarTarjertas(audiovisual);
});

// Botón Aulas ----------------------------------------------------------------
grupoBotones[2].addEventListener("click", () => {
  const aulas = materialDidactico.filter((material) => material.grup == 3);
  renderizarTarjertas(aulas);
});

// Botón Mostrar todo ----------------------------------------------------------------
grupoBotones[3].addEventListener("click", () =>
  renderizarTarjertas(materialDidactico)
);

// Botón Bolsa de materiales ----------------------------------------------------------------
grupoBotones[4].addEventListener("click", () => renderizarBolsa());

function renderizarBolsa() {
  seccionTarjetas.innerHTML = "";
  mostrarEstado();
  mostrarAgregados();
  quitarMaterial();
  reservarMaterial();
  borrarTodo();
}

function mostrarAgregados() {
  agregadosALaBolsa.forEach(
    (material) =>
      (seccionTarjetas.innerHTML += `
        <div>
            <h3>${material.titulo}</h3>
            <h4>Cantidad: 1</h4>           
            <button id='${material.id}' class='btn-cancel'>Eliminar</button>
        </div>`)
  );
}

function mostrarEstado() {
  seccionTarjetas.innerHTML += `
    <div class='menu_reservas'>
        <h3>Bienvenid@</h3>
        <h4>Estos son los materiales seleccionados para préstamo hasta el momento</h4>
        <button class='btn-mr'>Reservar material</button>
        <button class='btn-mr'>Borrar todo</button>
    </div>`;
}

// Botones dentro de la sección Mis reservas --------------------------------------------------
// Para cancelar reservas
function quitarMaterial() {
  for (const button of btnCancelar) {
    button.addEventListener("click", () => {
      const materialDeseleccionado = agregadosALaBolsa.find(
        (material) => material.id === parseInt(button.id)
      );
      if (materialDeseleccionado) {
        Toastify({
          text: `"${materialDeseleccionado.titulo}" eliminado de la Bolsa de materiales.`,
          duration: 3000,
          position: "center",
          gravity: "top",
        }).showToast();
        let posicionAEliminar = agregadosALaBolsa.indexOf(
          materialDeseleccionado,
          0
        );
        agregadosALaBolsa.splice(posicionAEliminar, 1);
        localStorage.setItem(
          "bolsaGuardada",
          JSON.stringify(agregadosALaBolsa)
        );
        renderizarBolsa();
      }
    });
  }
}

// Error al reservar
function mostrarError() {
  Toastify({
    text: "No hay material agregado a la Bolsa todavía",
    duration: 3000,
    position: "center",
    gravity: "top",
  }).showToast();
}

// Para confirmar reservas
function reservarMaterial() {
  btnsMisReservas[0].addEventListener("click", async () => {
    if (agregadosALaBolsa.length == 0) {
      mostrarError();
    } else {
      ingresarDatos();
    }
  });
}

async function ingresarDatos() {
  const { value: formValues } = await Swal.fire({
    title: "Completá con tus datos",
    input: "text",
    inputLabel: "Apellido y Nombre:",
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: `
            Continuar&nbsp;<i class="fa fa-arrow-right"></i>
        `,
    inputValidator: (value) => {
      if (!value) {
        return "Es necesario colocar un nombre";
      }
    },
  });
  if (formValues) {
    elegirFecha();
  }
}

async function elegirFecha() {
  const { value: date } = await Swal.fire({
    title: "Selecciona el día del préstamo",
    input: "date",
    didOpen: () => {
      const today = new Date().toISOString();
      Swal.getInput().min = today.split("T")[0];
    },
    inputValidator: (fecha) => {
      if (!fecha) {
        return "Se debe seleccionar una fecha";
      }
    },
  });
  if (date) {
    Swal.fire({
      title: "¡Hecho!",
      text: "Tus materiales fueron reservados.",
      icon: "success",
    });
    vaciarBolsa();
    renderizarBolsa();
  }
}

// Para borrar todo
function borrarTodo() {
  btnsMisReservas[1].addEventListener("click", () => {
    if (agregadosALaBolsa.length == 0) {
      mostrarError();
    } else {
      confirmarBorrar();
    }
  });
}

function confirmarBorrar() {
  Swal.fire({
    title: "¿Estas segur@?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, borrar todo",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "¡Hecho!",
        text: "Tus materiales fueron borrados.",
        icon: "success",
      });
      vaciarBolsa();
      renderizarBolsa();
    }
  });
}

function vaciarBolsa() {
  agregadosALaBolsa.splice(0, agregadosALaBolsa.length);
  localStorage.removeItem("bolsaGuardada");
}
/* {{!-- {{#each products}}
    <li>
      {{#each data.thumbnail}}
        <img src="{{data}}" alt="" />
      {{/each}}
      <h2>{{data.title}}</h2>
      <h3>Precio: ${{data.price}}</h3>
      <h3>Categoria: {{data.category}}</h3>
      <h3>Descripción: {{data.description}}</h3>
      <h3>Stock: {{data.stock}}</h3>
      <button>Eliminar</button>
    </li>
  {{/each}} --}} */
