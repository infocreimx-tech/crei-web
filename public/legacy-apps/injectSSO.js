// Ecosistema CREI - Minimal Session Guard (v5)
// After fully native SSO integration across all modules (Calendario, Terapias, etc.),
// we no longer need to spoof JWTs or intercept Fetch requests.
// This script simply ensures unauthorized users cannot access the legacy-apps 
// directly via URL and redirects them to the master portal login if they try.

(function() {
  const creiSessionStr = localStorage.getItem("crei_session");
  if (!creiSessionStr) {
    if (window.parent) {
      window.parent.location.href = "/es/portal-terapeutas";
    } else {
      window.location.href = "/es/portal-terapeutas";
    }
  }
})();
