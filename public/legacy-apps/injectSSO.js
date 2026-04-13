// Ecosistema CREI - SSO Injector (v6)
// Parsea la sesión activa, la expone como window.CREI_USER,
// y usa postMessage como canal de fallback si corre dentro de un iframe.

(function() {
  // 1. Intentar leer la sesión desde localStorage (mismo dominio)
  function parseUser() {
    try {
      const raw = localStorage.getItem("crei_session");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return (parsed.user || parsed.username || parsed.email || null);
    } catch(e) {
      return null;
    }
  }

  const user = parseUser();

  if (!user) {
    // Sin sesión: redirigir al portal de login
    const loginPath = "/es/portal-terapeutas";
    try {
      if (window.self !== window.top) {
        window.top.location.href = loginPath;
      } else {
        window.location.href = loginPath;
      }
    } catch(e) {
      window.location.href = loginPath;
    }
    return;
  }

  // 2. Exponer el usuario como variable global — disponible antes de DOMContentLoaded
  window.CREI_USER = user;

  // 3. Canal postMessage: si algún módulo pide la sesión, responder
  window.addEventListener("message", function(event) {
    if (event.data && event.data.type === "CREI_REQUEST_SESSION") {
      try {
        const raw = localStorage.getItem("crei_session");
        event.source.postMessage({ type: "CREI_SESSION_RESPONSE", user: user, raw: raw }, event.origin);
      } catch(e) {}
    }
  });
})();
