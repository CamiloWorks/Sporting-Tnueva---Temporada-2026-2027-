/* ============================================================
   ACCESO ADMINISTRADOR (LOGIN SIMPLE + REDIRECCIÓN)
   ============================================================ */

/**
 * Solo ejecutar el botón "Admin" cuando estamos en index.html
 * (comprobamos por la existencia del elemento, no por la URL,
 * porque en producción la URL raíz no incluye "index.html")
 */
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "admin.html";
  });
}


/* ============================================================
   GESTIÓN DE SESIÓN ADMIN (localStorage)
   ============================================================ */

function isAdminLogged() {
  return localStorage.getItem("adminLogged") === "true";
}

function adminLogin() {
  localStorage.setItem("adminLogged", "true");
}

function adminLogout() {
  localStorage.removeItem("adminLogged");
}


/* ============================================================
   CONTROL DE VISTAS EN admin.html
   ============================================================ */

const loginView = document.getElementById("login-view");
const panelView = document.getElementById("panel-view");

if (loginView && panelView) {

  // Mostrar login o panel según sesión
  if (!isAdminLogged()) {
    loginView.style.display = "block";
    panelView.style.display = "none";
  } else {
    loginView.style.display = "none";
    panelView.style.display = "block";
  }

  /* --- LOGIN --- */
  const PASSWORD = "torrenueva2026";

  const loginSubmit = document.getElementById("login-submit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", () => {
      const pass = document.getElementById("admin-pass").value;

      if (pass === PASSWORD) {
        adminLogin();
        loginView.style.display = "none";
        panelView.style.display = "block";

        // Inicializar panel admin
        if (typeof initAdminPanel === "function") {
          initAdminPanel();
        }
      } else {
        alert("Contraseña incorrecta");
      }
    });
  }

  // Permitir iniciar sesión pulsando Enter en el campo de contraseña
const passInput = document.getElementById("admin-pass");

if (passInput) {
  passInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      loginSubmit.click(); // Ejecuta exactamente lo mismo que el botón
    }
  });
}

  /* --- LOGOUT --- */
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      adminLogout();
      window.location.reload();
    });
  }
}