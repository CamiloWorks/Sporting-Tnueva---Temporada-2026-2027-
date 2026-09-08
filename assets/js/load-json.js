let matches = [];

/* ============================================================
   LOCALSTORAGE: CARGAR Y GUARDAR PARTIDOS
   ============================================================ */

/**
 * Mezcla los datos del JSON con los del localStorage.
 * Se hace por jornada (j) y fecha (date), no por índice.
 */
function loadMatchesFromLocalStorage() {
  const saved = localStorage.getItem("matches");
  if (!saved) return;

  try {
    const savedMatches = JSON.parse(saved);

    // Mezclar por j + date (correcto y seguro)
    matches = matches.map(m => {
      const found = savedMatches.find(s => s.j === m.j && s.date === m.date);
      return found ? found : m;
    });

  } catch (err) {
    console.error("Error leyendo localStorage:", err);
  }
}

/**
 * Guarda el array completo en localStorage
 */
function saveMatchesToLocalStorage() {
  localStorage.setItem("matches", JSON.stringify(matches));
}

/* ============================================================
   CARGA DEL JSON Y ARRANQUE SEGÚN LA PÁGINA
   ============================================================ */

fetch("assets/json/matches.json")
  .then(res => res.json())
  .then(data => {
    matches = data;

    // Mezclar con datos guardados del admin
    loadMatchesFromLocalStorage();

       /* ------------------------------------------------------------
       SI ESTAMOS EN index.html → renderizar la web
       ------------------------------------------------------------ */
    if (document.getElementById("hero")) {
      if (typeof renderHero === "function") renderHero();
      if (typeof renderSchedule === "function") renderSchedule("all");
    }

    /* ------------------------------------------------------------
       SI ESTAMOS EN admin.html → iniciar panel admin
       ------------------------------------------------------------ */
    if (document.getElementById("admin-panel") /* o el id que uses en admin.html */) {
      if (isAdminLogged() && typeof initAdminPanel === "function") {
        initAdminPanel();
      }
    }
  })
  .catch(err => {
    console.error("Error cargando matches.json:", err);
  });
