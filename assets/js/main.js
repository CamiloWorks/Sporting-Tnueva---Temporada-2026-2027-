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
  "Castillo de Cva Aldea del Rey": "aldeadelrey.jpg",
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
   PUNTOS / CLASIFICACIÓN
   ============================================================ */

const PUNTOS = { win: 3, draw: 1, loss: 0 };

function calculatePoints(){
  return matches
    .filter(m => isPlayed(m))
    .reduce((total, m) => total + PUNTOS[resultType(m)], 0);
}
