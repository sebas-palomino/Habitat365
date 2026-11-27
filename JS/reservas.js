const AREAS = [
  { id: "futbol",  nombre: "Cancha de Fútbol", icono: "⚽" },
  { id: "piscina", nombre: "Piscina",          icono: "🏊" },
  { id: "salon",   nombre: "Salón Social",     icono: "🎉" },
  { id: "bbq",     nombre: "Zona BBQ",         icono: "🍖" }
];

const CLAVE_STORAGE = "reservas_areas_v1";

const cuadricula     = document.getElementById("cuadricula");
const tituloMes      = document.getElementById("titulo-mes");
const tituloAnio     = document.getElementById("titulo-anio");
const btnAnterior    = document.getElementById("btn-anterior");
const btnSiguiente   = document.getElementById("btn-siguiente");
const btnHoy         = document.getElementById("btn-hoy");
const panel          = document.getElementById("panel");
const listaHistorial = document.getElementById("lista-historial");

let reservas = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || {};
let mesVisible = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let fechaSeleccionada = null;

const crearClave = (a, m, d) => `${a}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const claveHoy = () => crearClave(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

function formatearFecha(clave) {
  let [a, m, d] = clave.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function actualizarTodo() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(reservas));
  dibujarCalendario();
  dibujarPanel();
  dibujarHistorial();
}

function dibujarCalendario() {
  let anio = mesVisible.getFullYear(), mes = mesVisible.getMonth();
  tituloAnio.textContent = anio;
  tituloMes.textContent = mesVisible.toLocaleDateString("es-CO", { month: "long" });

  let espacios = (mesVisible.getDay() + 6) % 7;
  let totalDias = new Date(anio, mes + 1, 0).getDate();
  let totalCeldas = Math.ceil((espacios + totalDias) / 7) * 7;
  let html = "";

  for (let i = 0; i < totalCeldas; i++) {
    if (i % 7 === 0) html += `<div class="num-semana">${i / 7 + 1}</div>`;
    let dia = i - espacios + 1;
    if (dia < 1 || dia > totalDias) { html += `<div></div>`; continue; }

    let clave = crearClave(anio, mes, dia);
    let ocupadas = reservas[clave] ? Object.keys(reservas[clave]).length : 0;
    let clases = `dia${i % 7 === 6 ? " domingo" : ""}${clave === claveHoy() ? " hoy" : ""}${clave === fechaSeleccionada ? " seleccionado" : ""}`;

    if (clave < claveHoy()) {
      html += `<button class="${clases} pasado" disabled><span>${dia}</span></button>`;
    } else {
      clases += ocupadas === AREAS.length ? " lleno" : ocupadas > 0 ? " parcial" : "";
      let puntos = AREAS.map(a => `<i class="punto ${reservas[clave]?.[a.id] ? "rojo" : "verde"}"></i>`).join("");
      html += `<button class="${clases}" onclick="seleccionarDia('${clave}')"><span>${dia}</span><div class="puntos">${puntos}</div></button>`;
    }
  }
  cuadricula.innerHTML = html;
}

function seleccionarDia(clave) {
  fechaSeleccionada = clave;
  dibujarCalendario();
  dibujarPanel();
}

function dibujarPanel() {
  if (!fechaSeleccionada) {
    panel.innerHTML = `<div class="placeholder"><p style="font-size:2rem">📅</p><p>Selecciona un día del calendario para gestionar las áreas.</p></div>`;
    return;
  }

  let ocupadas = reservas[fechaSeleccionada] ? Object.keys(reservas[fechaSeleccionada]).length : 0;
  let tarjetas = AREAS.map(area => {
    let res = reservas[fechaSeleccionada]?.[area.id];
    return `
      <div class="area ${res ? "ocupada" : ""}">
        <div class="area-cabecera">
          <span class="area-nombre">${area.icono} ${area.nombre}</span>
          <button class="btn-estado ${res ? "ocupado" : ""}" onclick="cambiarEstado('${fechaSeleccionada}', '${area.id}')">${res ? "Ocupado" : "Disponible"}</button>
        </div>
        ${res ? `<input type="text" maxlength="60" placeholder="Nombre de quien reserva o nota (opcional)" value="${res.nota || ""}" oninput="guardarNota('${fechaSeleccionada}', '${area.id}', this.value)">` : ""}
      </div>`;
  }).join("");

  panel.innerHTML = `<h3>${formatearFecha(fechaSeleccionada)}</h3><p class="resumen">${AREAS.length - ocupadas} de ${AREAS.length} áreas disponibles</p>${tarjetas}<button class="btn-cerrar" onclick="seleccionarDia(null)">Cerrar</button>`;
}

function cambiarEstado(clave, idArea) {
  if (!reservas[clave]) reservas[clave] = {};
  reservas[clave][idArea] ? delete reservas[clave][idArea] : (reservas[clave][idArea] = { nota: "" });
  if (Object.keys(reservas[clave]).length === 0) delete reservas[clave];
  actualizarTodo();
}

function guardarNota(clave, idArea, texto) {
  reservas[clave][idArea].nota = texto;
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(reservas));
  dibujarHistorial();
}

function dibujarHistorial() {
  let fechas = Object.keys(reservas).sort();
  listaHistorial.innerHTML = fechas.length === 0
    ? `<p style="color:#64748b; font-size:14px;">No hay áreas ocupadas todavía.</p>`
    : fechas.map(clave => {
        let items = AREAS.filter(a => reservas[clave][a.id])
          .map(a => `<span>${a.icono} ${a.nombre}${reservas[clave][a.id].nota ? ` — <em>${reservas[clave][a.id].nota}</em>` : ""}</span>`).join("");
        return `<div class="item-historial"><strong>📅 ${formatearFecha(clave)}</strong>${items}</div>`;
      }).join("");
}

btnAnterior.onclick  = () => { mesVisible.setMonth(mesVisible.getMonth() - 1); dibujarCalendario(); };
btnSiguiente.onclick = () => { mesVisible.setMonth(mesVisible.getMonth() + 1); dibujarCalendario(); };
btnHoy.onclick       = () => { mesVisible = new Date(new Date().getFullYear(), new Date().getMonth(), 1); dibujarCalendario(); };

actualizarTodo();