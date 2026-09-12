/* ============================================================
   MODAL DE DETALLE DEL PARTIDO
   ============================================================ */

let currentMatchIndex = null;

/* ============================================================
   GRÁFICA DE VOTOS
   ============================================================ */

function renderVoteChart(match) {
  const chart = document.getElementById("vote-chart");

  const votes = match.details?.votes || { malo: 0, normal: 0, bueno: 0 };
  const total = votes.malo + votes.normal + votes.bueno || 1;

  chart.innerHTML = `
    <div class="vote-bar">
      <div class="vote-bar-fill" style="width:${(votes.malo / total) * 100}%"></div>
      <span class="vote-bar-label">Malo: ${votes.malo}</span>
    </div>

    <div class="vote-bar">
      <div class="vote-bar-fill" style="width:${(votes.normal / total) * 100}%"></div>
      <span class="vote-bar-label">Normal: ${votes.normal}</span>
    </div>

    <div class="vote-bar">
      <div class="vote-bar-fill" style="width:${(votes.bueno / total) * 100}%"></div>
      <span class="vote-bar-label">Bueno: ${votes.bueno}</span>
    </div>
  `;
}

/* ============================================================
   ABRIR MODAL
   ============================================================ */

function openMatchModal(match) {
  const modal = document.getElementById("match-modal");
  modal.style.display = "flex";

  // Buscar índice real dentro del array matches
  currentMatchIndex = matches.findIndex(
    m => m.j === match.j && m.date === match.date
  );

  const m = matches[currentMatchIndex];

  // Título (oculto, se mantiene para accesibilidad/compatibilidad)
  document.getElementById("modal-title").textContent =
    `J${m.j} · ${m.home} vs ${m.away}`;

  // Jornada
  document.getElementById("modal-jornada").textContent = `Jornada ${m.j}`;

  // Escudos y nombres de los equipos
  document.getElementById("modal-home-badge").innerHTML = getBadge(m.home);
  document.getElementById("modal-home-name").textContent = m.home;
  document.getElementById("modal-away-badge").innerHTML = getBadge(m.away);
  document.getElementById("modal-away-name").textContent = m.away;

  // Resultado
  document.getElementById("modal-score").textContent =
    m.score ? `Resultado: ${m.score}` : "Partido no jugado";

  // Resumen
  document.getElementById("modal-summary").innerHTML =
  `<i>Mensaje del Entrenador:</i><br>"${m.details?.summary || "Sin resumen disponible"}"`;

  document.getElementById("modal-scorers").innerHTML =
  m.details?.scorers?.length
    ? `<strong>Goles:</strong> ${m.details.scorers.join(", ")}`
    : "Sin goles registrados";

  // Estado de voto
  document.getElementById("vote-status").textContent = "";

  // Bloquear votación si el partido no está jugado
  const voteButtons = document.querySelectorAll(".vote-btn");

  if (!isPlayed(m)) {
    voteButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add("disabled-vote");
    });
  } else {
    voteButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove("disabled-vote");
    });
  }

  // Renderizar gráfica con el partido REAL
  renderVoteChart(m);
}

/* ============================================================
   CERRAR MODAL
   ============================================================ */

document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("match-modal").style.display = "none";
});

/* ============================================================
   VOTACIÓN (solo 1 voto por sesión)
   ============================================================ */

document.querySelectorAll(".vote-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentMatchIndex === null) return;

    const voteKey = `voted_match_${currentMatchIndex}`;

    // Si ya votó en esta sesión → no permitir
    if (sessionStorage.getItem(voteKey)) {
      document.getElementById("vote-status").textContent =
        "Ya has votado.";
      return;
    }

    const vote = btn.dataset.vote;
    const m = matches[currentMatchIndex];

    // Asegurar estructura details
    if (!m.details) {
      m.details = {
        scorers: [],
        summary: "",
        votes: { malo: 0, normal: 0, bueno: 0 }
      };
    }

    // Sumar voto
    m.details.votes[vote] = (m.details.votes[vote] || 0) + 1;

    // Guardar en localStorage
    saveMatchesToLocalStorage();

    // Marcar que ya votó en esta sesión
    sessionStorage.setItem(voteKey, "true");

    // Mensaje de confirmación
    document.getElementById("vote-status").textContent = "¡Gracias por tu voto!";

    // Actualizar gráfica con el partido REAL
    renderVoteChart(m);
  });
});
