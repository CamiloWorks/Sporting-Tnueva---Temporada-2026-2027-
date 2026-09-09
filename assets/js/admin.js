/* ============================================================
   PANEL ADMINISTRADOR — EDICIÓN DE PARTIDOS
   ============================================================ */

/**
 * Se ejecuta cuando el admin inicia sesión correctamente.
 * Rellena el selector y prepara los eventos.
 */
function initAdminPanel() {
  if (!matches || matches.length === 0) {
    console.error("Los partidos no están cargados todavía.");
    return;
  }

  const select = document.getElementById("match-select");
  select.innerHTML = "";

  // Rellenar selector con jornadas
  matches.forEach((m, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = `J${m.j} · ${m.home} vs ${m.away}`;
    select.appendChild(opt);
  });

  // Cargar datos del primer partido por defecto
  loadMatchData(0);

  // Evento al cambiar de partido
  select.addEventListener("change", () => {
    loadMatchData(select.value);
  });

  // Guardar cambios
  document.getElementById("save-match").addEventListener("click", () => {
    saveMatchData(select.value);
  });

  //  Botón para volver a inicio
  document.getElementById("go-home-btn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}


/* ============================================================
   CARGAR DATOS DEL PARTIDO EN EL PANEL
   ============================================================ */

function loadMatchData(index) {
  const m = matches[index];

  document.getElementById("score-input").value = m.score || "";
  document.getElementById("summary-input").value = m.details?.summary || "";
  document.getElementById("scorers-input").value =
    m.details?.scorers?.length ? m.details.scorers.join(", ") : "";

  document.getElementById("match-date").value = m.date || "";
  document.getElementById("match-time").value = m.time || "";
}


/* ============================================================
   GUARDAR CAMBIOS DEL PARTIDO
   ============================================================ */

function saveMatchData(index) {
  const m = matches[index];

  // Asegurar estructura details
  if (!m.details) {
    m.details = {
      scorers: [],
      summary: "",
      votes: { malo: 0, normal: 0, bueno: 0 }
    };
  }

  // Guardar resultado
  const score = document.getElementById("score-input").value.trim();
  m.score = score !== "" ? score : null;  // ← opción B: mantiene null si está vacío

  // Guardar resumen
  m.details.summary = document.getElementById("summary-input").value.trim();

  // Guardar goleadores
  const scorersRaw = document.getElementById("scorers-input").value.trim();
  m.details.scorers = scorersRaw
    ? scorersRaw.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  // Guardar fecha y hora
  m.date = document.getElementById("match-date").value || null;
  m.time = document.getElementById("match-time").value || null;

  // Guardar en localStorage
  saveMatchesToLocalStorage();

  alert("Cambios guardados correctamente.");
}

