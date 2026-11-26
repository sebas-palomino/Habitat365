const AREAS = [
  { id: "futbol",  nombre: "Cancha de Fútbol", icono: "⚽" },
  { id: "piscina", nombre: "Piscina",          icono: "🏊" },
  { id: "salon",   nombre: "Salón Social",     icono: "🎉" },
  { id: "bbq",     nombre: "Zona BBQ",         icono: "🍖" }
];

const CLAVE_STORAGE = "reservas_areas_v1";

const cuadricula   = document.getElementById("cuadricula");
const tituloMes    = document.getElementById("titulo-mes");
const tituloAnio   = document.getElementById("titulo-anio");
const btnAnterior  = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnHoy       = document.getElementById("btn-hoy");
const panel        = document.getElementById("panel");

let reservas = cargarReservas();        
let mesVisible = primerDiaDelMes(new Date()); 
let fechaSeleccionada = null;           

function primerDiaDelMes(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

function crearClave(anio, mes, dia) {
  const mm = String(mes + 1).padStart(2, "0");
  const dd = String(dia).padStart(2, "0");
  return `${anio}-${mm}-${dd}`;
}

function claveHoy() {
  const hoy = new Date();
  return crearClave(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
}

function esPasado(clave) {
  return clave < claveHoy();
}

function formatearFecha(clave) {
  const [anio, mes, dia] = clave.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

function cargarReservas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || {};
  } catch (error) {
    return {}; 
  }
}

function guardarReservas() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(reservas));
  } catch (error) {
    alert("No se pudo guardar la información en el navegador.");
  }
}

function contarOcupadas(clave) {
  return reservas[clave] ? Object.keys(reservas[clave]).length : 0;
}

function dibujarCalendario() {
  const anio = mesVisible.getFullYear();
  const mes  = mesVisible.getMonth();

  tituloAnio.textContent = anio;
  tituloMes.textContent = mesVisible.toLocaleDateString("es-CO", { month: "long" });

  cuadricula.innerHTML = "";

  const espacios = (mesVisible.getDay() + 6) % 7;
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const totalCeldas = Math.ceil((espacios + totalDias) / 7) * 7;

  for (let i = 0; i < totalCeldas; i++) {
    if (i % 7 === 0) {
      const semana = document.createElement("div");
      semana.className = "num-semana";
      semana.textContent = i / 7 + 1;
      cuadricula.appendChild(semana);
    }

    const dia = i - espacios + 1; 

    if (dia < 1 || dia > totalDias) {
      cuadricula.appendChild(document.createElement("div"));
      continue;
    }

    const clave = crearClave(anio, mes, dia);
    const ocupadas = contarOcupadas(clave);

    const boton = document.createElement("button");
    boton.className = "dia";
    boton.type = "button";

    if (i % 7 === 6) boton.classList.add("domingo");

    const numero = document.createElement("span");
    numero.textContent = dia;
    boton.appendChild(numero);

    if (esPasado(clave)) {
      boton.classList.add("pasado");
      boton.disabled = true;
      boton.title = "Fecha pasada";
    } else {
      if (ocupadas === AREAS.length) boton.classList.add("lleno");
      else if (ocupadas > 0)         boton.classList.add("parcial");

      const puntos = document.createElement("div");
      puntos.className = "puntos";
      AREAS.forEach(area => {
        const punto = document.createElement("i");
        const ocupada = reservas[clave] && reservas[clave][area.id];
        punto.className = "punto " + (ocupada ? "rojo" : "verde");
        punto.title = `${area.nombre}: ${ocupada ? "Ocupado" : "Disponible"}`;
        puntos.appendChild(punto);
      });
      boton.appendChild(puntos);

      boton.addEventListener("click", () => seleccionarDia(clave));
    }

    if (clave === claveHoy())          boton.classList.add("hoy");
    if (clave === fechaSeleccionada)   boton.classList.add("seleccionado");

    cuadricula.appendChild(boton);
  }
}

function seleccionarDia(clave) {
  fechaSeleccionada = clave;
  dibujarCalendario();
  dibujarPanel();

  if (window.innerWidth <= 800) {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function cerrarPanel() {
  fechaSeleccionada = null;
  dibujarCalendario();
  dibujarPanel();
}

function dibujarPanel() {
  panel.innerHTML = "";

  if (!fechaSeleccionada) {
    panel.innerHTML = `
      <div class="placeholder">
        <p style="font-size:2rem">📅</p>
        <p>Selecciona un día del calendario para gestionar las áreas.</p>
      </div>`;
    return;
  }

  const clave = fechaSeleccionada;
  const ocupadas = contarOcupadas(clave);

  const titulo = document.createElement("h3");
  titulo.textContent = formatearFecha(clave);
  panel.appendChild(titulo);

  const resumen = document.createElement("p");
  resumen.className = "resumen";
  resumen.textContent = `${AREAS.length - ocupadas} de ${AREAS.length} áreas disponibles`;
  panel.appendChild(resumen);

  AREAS.forEach(area => {
    const reserva = reservas[clave] && reservas[clave][area.id];
    const estaOcupada = Boolean(reserva);

    const tarjeta = document.createElement("div");
    tarjeta.className = "area" + (estaOcupada ? " ocupada" : "");

    const cabecera = document.createElement("div");
    cabecera.className = "area-cabecera";

    const nombre = document.createElement("span");
    nombre.className = "area-nombre";
    nombre.textContent = `${area.icono} ${area.nombre}`;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn-estado" + (estaOcupada ? " ocupado" : "");
    boton.textContent = estaOcupada ? "Ocupado" : "Disponible";
    boton.addEventListener("click", () => cambiarEstado(clave, area.id));

    cabecera.append(nombre, boton);
    tarjeta.appendChild(cabecera);

    if (estaOcupada) {
      const campo = document.createElement("input");
      campo.type = "text";
      campo.maxLength = 60;
      campo.placeholder = "Nombre de quien reserva o nota (opcional)";
      campo.value = reserva.nota || "";
      
      campo.addEventListener("input", () => {
        reservas[clave][area.id].nota = campo.value;
        guardarReservas();
      });
      tarjeta.appendChild(campo);
    }

    panel.appendChild(tarjeta);
  });

  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "btn-cerrar";
  cerrar.textContent = "Cerrar";
  cerrar.addEventListener("click", cerrarPanel);
  panel.appendChild(cerrar);
}

function cambiarEstado(clave, idArea) {
  if (!reservas[clave]) reservas[clave] = {};

  if (reservas[clave][idArea]) {
    delete reservas[clave][idArea];
    if (Object.keys(reservas[clave]).length === 0) delete reservas[clave];
  } else {
    reservas[clave][idArea] = { nota: "" };
  }

  guardarReservas();
  dibujarPanel();
  dibujarCalendario(); 
}

btnAnterior.addEventListener("click", () => {
  mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1);
  dibujarCalendario();
});

btnSiguiente.addEventListener("click", () => {
  mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1);
  dibujarCalendario();
});

btnHoy.addEventListener("click", () => {
  mesVisible = primerDiaDelMes(new Date());
  dibujarCalendario();
});

dibujarCalendario();
dibujarPanel();