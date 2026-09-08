/* ============================================================
   RENDER DEL HERO (PRÓXIMO PARTIDO / ÚLTIMO JUGADO)
   ============================================================ */

function renderHero() {
  const now = new Date();

  // Próximo partido
  const upcoming = matches
    .map(m => ({
      ...m,
      dateObj: new Date(m.date + "T" + (m.time || "17:00"))
    }))
    .filter(m => m.dateObj >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .sort((a, b) => a.dateObj - b.dateObj)[0];

  // Último partido jugado
  const lastPlayed = matches
    .map(m => ({
      ...m,
      dateObj: new Date(m.date + "T" + (m.time || "17:00"))
    }))
    .filter(m => m.dateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate()) && m.score)
    .sort((a, b) => b.dateObj - a.dateObj)[0];

  const hero = document.getElementById("hero");

  /* ------------------------------------------------------------
     Si NO hay próximos partidos → mostrar último jugado
     ------------------------------------------------------------ */
  if (!upcoming) {
    if (lastPlayed) {
      const rType = resultType(lastPlayed);

      hero.innerHTML = `
        <p class="hero-label">Último partido · Jornada ${lastPlayed.j}</p>

        <div class="hero-teams">
          <div class="hero-team ${lastPlayed.isHome ? "us" : ""}">
            <div class="hero-badge">${getBadge(lastPlayed.home)}</div>
            <span>${lastPlayed.home}</span>
          </div>

          <div class="hero-mid">
            <span class="hero-result">
              <span class="hero-dot ${rType}"></span>
              Resultado: ${lastPlayed.score}
            </span>
            <span class="hero-date">${DIAS[lastPlayed.dateObj.getDay()].toUpperCase()}</span>
            <span class="hero-time">${lastPlayed.time || "17:00"} h</span>
          </div>

          <div class="hero-team ${!lastPlayed.isHome ? "us" : ""}">
            <div class="hero-badge">${getBadge(lastPlayed.away)}</div>
            <span>${lastPlayed.away}</span>
          </div>
        </div>

        <div class="hero-foot">
          <span class="comp">2ª Auto. Castilla-La Mancha</span>
        </div>
      `;
    } else {
      hero.innerHTML = `<p class="hero-label">Temporada finalizada</p>`;
    }
    return;
  }

  /* ------------------------------------------------------------
     HERO normal (próximo partido)
     ------------------------------------------------------------ */

  const d = upcoming.dateObj;
  const diff = daysUntil(d, now);
  const countdown =
    diff === 0 ? "Hoy" :
    diff === 1 ? "Mañana" :
    `Dentro de ${diff} días`;

  hero.innerHTML = `
    <p class="hero-label">Próximo partido · Jornada ${upcoming.j}</p>

    <div class="hero-teams">
      <div class="hero-team ${upcoming.isHome ? "us" : ""}">
        <div class="hero-badge">${getBadge(upcoming.home)}</div>
        <span>${upcoming.home}</span>
      </div>

      <div class="hero-mid">
        <span class="hero-vs">${d.getDate()} ${MESES_CORTO[d.getMonth()]}</span>
        <span class="hero-date">${DIAS[d.getDay()].toUpperCase()}</span>
        <span class="hero-time">${upcoming.time || "17:00"} h</span>
      </div>

      <div class="hero-team ${!upcoming.isHome ? "us" : ""}">
        <div class="hero-badge">${getBadge(upcoming.away)}</div>
        <span>${upcoming.away}</span>
      </div>
    </div>

    <div class="hero-foot">
      <span class="comp">2ª Auto. Castilla-La Mancha</span>
      <span class="countdown">${countdown}</span>
    </div>
  `;
}



/* ============================================================
   RENDER DEL LISTADO DE PARTIDOS
   ============================================================ */

function renderSchedule(filter = "all") {
  const schedule = document.getElementById("schedule");
  schedule.innerHTML = "";

  const filtered = matches.filter(m => {
    if (filter === "home") return m.isHome;
    if (filter === "away") return !m.isHome;
    return true;
  });

  const months = {};

  filtered.forEach(m => {
    const d = new Date(m.date);
    const month = MESES_CORTO[d.getMonth()] + " " + d.getFullYear();

    if (!months[month]) months[month] = [];
    months[month].push(m);
  });

  Object.keys(months).forEach(month => {
    const group = document.createElement("div");
    group.className = "month-group";

    group.innerHTML = `
      <div class="month-label">${month}</div>
      <div class="match-list"></div>
    `;

    const list = group.querySelector(".match-list");

    months[month].forEach(m => {
      const row = document.createElement("div");
      row.className = "match-row";

      const d = new Date(m.date);
      const played = isPlayed(m);
      const rType = resultType(m);

      row.innerHTML = `
        <div class="jday">J${m.j}</div>

        <div class="match-teams">
          <div class="team-line ${m.isHome ? "us" : ""}">
            ${m.isHome ? '<span class="tag">CASA</span>' : ""}
            <img src="assets/img/escudosEquipos/${ESCUDOS[m.home] || "generico.png"}" class="badge-img">
            ${m.home}
          </div>

          <div class="team-line ${!m.isHome ? "us" : ""}">
            ${!m.isHome ? '<span class="tag" style="background:#8a8a8e">FUERA</span>' : ""}
            <img src="assets/img/escudosEquipos/${ESCUDOS[m.away] || "generico.png"}" class="badge-img">
            ${m.away}
          </div>
        </div>

        <div class="match-right">
          <div class="match-date">${d.getDate()} ${MESES_CORTO[d.getMonth()]}</div>
          <div class="match-date" style="font-weight:400;">
            ${m.time ? m.time + " h" : ""}
          </div>

          ${
            played
              ? `
                <div class="match-score ${rType}">
                  <span class="result-dot dot-${rType}"></span>
                  Resultado: ${m.score}
                </div>
              `
              : ""
          }
        </div>
      `;

      // Abrir modal al hacer clic
      row.addEventListener("click", () => openMatchModal(m));

      list.appendChild(row);
    });

    schedule.appendChild(group);
  });
}



/* ============================================================
   FILTROS Y BUSCADOR
   ============================================================ */

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    renderSchedule(filter);
  });
});

document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const schedule = document.getElementById("schedule");

  schedule.querySelectorAll(".match-row").forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? "flex" : "none";
  });
});
