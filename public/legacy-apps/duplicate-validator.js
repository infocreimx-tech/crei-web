/*
 * Validador de Duplicados en Tiempo Real (Multi-Módulo)
 * Se inyecta en el HEAD de las aplicaciones embebidas.
 */
(function() {
  const fieldsToValidate = ['folio', 'rfc', 'curp', 'patient_name', 'nombre'];
  const fieldLabels = {
    'folio': 'Folio',
    'rfc': 'RFC',
    'curp': 'CURP',
    'patient_name': 'Paciente',
    'nombre': 'Nombre del paciente'
  };
  let debounceTimer;

  // Inyectar estilos para el feedback visual
  const style = window.document.createElement('style');
  style.innerHTML = `
    .duplicate-error-msg {
      color: #e11d48;
      font-size: 0.75rem;
      font-weight: 800;
      margin-top: 6px;
      display: block;
      animation: fadeIn 0.3s ease;
      background: #fff1f2;
      padding: 6px 10px;
      border-radius: 6px;
      border-left: 3px solid #e11d48;
    }
    .duplicate-input-error {
      border-color: #e11d48 !important;
      background-color: #fff1f2 !important;
      box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.15) !important;
      color: #9f1239 !important;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  window.document.head.appendChild(style);

  // Agrega el listener a nivel documento (delegación de eventos)
  window.document.addEventListener('input', function(e) {
    if (!e.target || !e.target.name) return;
    const name = e.target.name.toLowerCase();
    
    // Solo validamos los campos críticos
    if (fieldsToValidate.includes(name)) {
      clearTimeout(debounceTimer);
      
      const value = e.target.value.trim();
      
      // Limpiar estados de error previos
      const prevMsg = e.target.parentNode.querySelector('.duplicate-error-msg');
      if (prevMsg) prevMsg.remove();
      e.target.classList.remove('duplicate-input-error');
      
      // Desbloquear botón temporalmente
      const form = e.target.closest('form');
      if (form) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = false;
      }

      // Evitar llamadas de red por textos muy cortos (ej. nombres de 2 letras)
      if (value.length < 3) return;

      // Debouncing: Esperar 400ms tras la última pulsación para que se sienta muy ágil (tiempo real)
      debounceTimer = setTimeout(() => {
        fetch('/api/validate-duplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: e.target.name, value: value })
        })
        .then(res => res.json())
        .then(data => {
          if (data.isDuplicate) {
            console.warn('[Validador] Duplicado encontrado en módulo:', data.module);
            e.target.classList.add('duplicate-input-error');
            
            const label = fieldLabels[name] || name.toUpperCase();
            const msg = window.document.createElement('span');
            msg.className = 'duplicate-error-msg';
            msg.innerHTML = `⚠️ ALERTA: Este ${label} ("${value}") ya existe en la base de datos (módulo: <b>${data.module}</b>).`;
            
            // Si el input está dentro de un label, lo apendizamos después del input
            if (e.target.nextSibling) {
               e.target.parentNode.insertBefore(msg, e.target.nextSibling);
            } else {
               e.target.parentNode.appendChild(msg);
            }

            // Bloqueo de Concurrencia Frontend
            if (form) {
               const btn = form.querySelector('button[type="submit"]');
               if (btn) btn.disabled = true; // Impide guardar (Condición de Carrera protegida de nivel 1)
            }
          }
        })
        .catch(err => console.error('[Validador] Error de red validando duplicado:', err));
      }, 400);
    }
  });
})();
