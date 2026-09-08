const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const MESES_CORTO = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const DIAS = ["dom","lun","mar","mié","jue","vie","sáb"];

const ESCUDOS = {
  "Sporting Torrenueva": "escudo-mid.png",
  "Las Casas CD": "lascasas.png",
  "Cd Piedrabuena": "piedrabuena.png",
  "Calatrava CF": "calatrava.png",
  "Infantes CF": "infantes.png",
  "UD La Fuente B": "laFuente.png",
  "Ciudad Real FC": "ciudadreal.jpg",
  "Atlético Almagro": "almagro.png",
  "Valenzuela AD": "valenzuela.png",
  "Manchego Ciudad Real B": "manchego.png",
  "Porzuna CDB": "porzuna.jpg",
  "Corraleño CF": "corraleno.png",
  "Castillo de Cva Aldea del R": "generico.png",
  "Moraleño": "moraleno.png",
  "Calzada CF": "calzada.png",
  "La Estrella CD": "LaEstrella.png",
  "Poblete UD": "poblete.png"
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function isPlayed(match){
  const today = new Date();
  const matchDate = new Date(match.date + "T00:00:00");
  return matchDate < today && match.score;
}

function resultType(match){
  if(!match.score) return null;

  const [g1, g2] = match.score.split("-").map(Number);
  const usHome = match.isHome;

  const usGoals = usHome ? g1 : g2;
  const rivalGoals = usHome ? g2 : g1;

  if(usGoals > rivalGoals) return "win";
  if(usGoals < rivalGoals) return "loss";
  return "draw";
}

function initials(name){
  return name.split(" ")
    .filter(w => w.length > 1 || /[A-Za-zÁÉÍÓÚÑ]/.test(w))
    .slice(0,2)
    .map(w => w[0].toUpperCase())
    .join("") || name.slice(0,2).toUpperCase();
}

function fmtLongDate(d){
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;
}

function daysUntil(d, now){
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((a - b) / 86400000);
}

function getBadge(teamName){
  const file = ESCUDOS[teamName];
  if(file){
    return `<img src="img/escudosEquipos/${file}" alt="${teamName}" class="badge-img">`;
  }
  return initials(teamName);
}

/* ============================================================
   HERO
   ============================================================ */

function renderHero(){
  const now = new Date();
  const upcoming = matches
    .map(m => ({...m, dateObj: new Date(m.date + "T" + (m.time || "17:00"))}))
    .filter(m => m.dateObj >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .sort((a,b) => a.dateObj - b.dateObj)[0];

  const hero = document.getElementById("hero");

  if(!upcoming){
    hero.innerHTML = `<p class="hero-label">Temporada finalizada</p>`;
    return;
  }

  const rival = upcoming.isHome ? upcoming.away : upcoming.home;
  const usBadge = getBadge("Sporting Torrenueva");
  const rivalBadge = getBadge(rival);
  const d = upcoming.dateObj;
  const diff = daysUntil(d, now);
  let countdown = diff === 0 ? "Hoy" : diff === 1 ? "Mañana" : `Dentro de ${diff} días`;

  hero.innerHTML = `
    <p class="hero-label">Próximo partido · Jornada ${upcoming.j}</p>
    <div class="hero-teams">
      <div class="hero-team ${upcoming.isHome ? 'us' : ''}">
        <div class="hero-badge">${upcoming.isHome ? usBadge : getBadge(upcoming.home)}</div>
        <span>${upcoming.home}</span>
      </div>
      <div class="hero-mid">
        <span class="hero-vs">${d.getDate()} ${MESES_CORTO[d.getMonth()]}</span>
        <span class="hero-date">${DIAS[d.getDay()].toUpperCase()}</span>
        <span class="hero-time">${upcoming.time || "17:00"} h</span>
      </div>
      <div class="hero-team ${!upcoming.isHome ? 'us' : ''}">
        <div class="hero-badge">${!upcoming.isHome ? usBadge : getBadge(upcoming.away)}</div>
        <span>${upcoming.away}</span>
      </div>
    </div>
    <div class="hero-foot">
      <span class="comp">2ª Auto. Castilla-La Mancha</span>
      <span class="countdown">${countdown}</span>
    </div>
  `;
}


/* ------------------------------------------------------------
   ESTADO DEL PARTIDO
   ------------------------------------------------------------ */

/**
 * Devuelve true si el partido ya se jugó y tiene resultado
 */
function isPlayed(match) {
  const today = new Date();
  const matchDate = new Date(match.date + "T00:00:00");
  return matchDate < today && match.score;
}

/**
 * Devuelve "win", "loss" o "draw" según el resultado
 */
function resultType(match) {
  if (!match.score) return null;

  const [g1, g2] = match.score.split("-").map(Number);
  const usHome = match.isHome;

  const usGoals = usHome ? g1 : g2;
  const rivalGoals = usHome ? g2 : g1;

  if (usGoals > rivalGoals) return "win";
  if (usGoals < rivalGoals) return "loss";
  return "draw";
}



/* ============================================================
   CALENDARIO
   ============================================================ */

function renderSchedule(filter){
  const container = document.getElementById("schedule");
  container.innerHTML = "";

  const filtered = matches.filter(m => {
    if(filter === "home") return m.isHome;
    if(filter === "away") return !m.isHome;
    return true;
  });

  const groups = {};
  filtered.forEach(m => {
    const d = new Date(m.date + "T00:00:00");
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if(!groups[key]) groups[key] = { label: `${MESES[d.getMonth()]} ${d.getFullYear()}`, items: [] };
    groups[key].items.push({...m, dateObj: d});
  });

  Object.values(groups).forEach(group => {
    const monthDiv = document.createElement("div");
    monthDiv.className = "month-group";

    const label = document.createElement("p");
    label.className = "month-label";
    label.textContent = group.label;
    monthDiv.appendChild(label);

    const list = document.createElement("div");
    list.className = "match-list";

    group.items.forEach(m => {
      const row = document.createElement("div");
      row.className = "match-row";

      const played = isPlayed(m);
      const rType = resultType(m);

      row.innerHTML = `
        <div class="jday">J${m.j}</div>

        <div class="match-teams">
          <div class="team-line ${m.isHome ? 'us' : ''}">
            ${m.isHome ? '<span class="tag">CASA</span>' : ''}
            <img src="img/escudosEquipos/${ESCUDOS[m.home] || 'generico.png'}" class="badge-img">
            ${m.home}
          </div>

          <div class="team-line ${!m.isHome ? 'us' : ''}">
            ${!m.isHome ? '<span class="tag" style="background:#8a8a8e">FUERA</span>' : ''}
            <img src="img/escudosEquipos/${ESCUDOS[m.away] || 'generico.png'}" class="badge-img">
            ${m.away}
          </div>
        </div>

        <div class="match-right">
          <div class="match-date">${m.dateObj.getDate()} ${MESES_CORTO[m.dateObj.getMonth()]}</div>
          <div class="match-date" style="font-weight:400;">${m.time || "17:00"} h</div>

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

      row.addEventListener("click", () => openMatchModal(m));

      list.appendChild(row);
    });

    monthDiv.appendChild(list);
    container.appendChild(monthDiv);
  });
}

/* ============================================================
   FILTROS (pills)
   ============================================================ */

document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderSchedule(btn.dataset.filter);
  });
});

