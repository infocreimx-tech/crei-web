    
      tailwind.config={theme:{extend:{colors:{brand:{50:'#f5f3fa',100:'#f0eafc',600:'#7c5cbf',700:'#4a2c5e',800:'#2e1a35'},supabase:{500:'#9f86c0',600:'#7c5cbf'}},fontFamily:{sans:['Inter','system-ui','-apple-system','sans-serif']}}}}
    

// --- SUPABASE CLIENT CONFIG ---
const supabaseUrl = "https://uywihjppwzrrfjkguvot.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- LÓGICA DE DRAG AND DROP ---
const dz=document.getElementById('dropzone');const fi=document.getElementById('fileInput');const fn=document.getElementById('fileName');
dz.addEventListener('click',()=>fi.click());
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag')});
dz.addEventListener('dragleave',()=>dz.classList.remove('drag'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('drag');if(e.dataTransfer.files.length){fi.files=e.dataTransfer.files;updateName()}});
fi.addEventListener('change',updateName);
function updateName(){if(fi.files.length){fn.textContent=fi.files[0].name;fn.classList.remove('hidden')}}

// --- LÓGICA CORE ---
let currentUser = "Desconocido";
let gastosCache = [];
let radioManuallyModified = false;

const keywordsBolsillo = [
    // 1. Higiene Personal Especializada y Cuidado Físico
    "corte", "pelo", "peluquero", "peluquería", "barbería", "barbero", "tinte", "gel", "cera", "shampoo", "acondicionador", "tratamiento", "crema para peinar", "ligas", "pasadores", "peine", "cepillo",
    "crema", "jabón", "jabon", "exfoliante", "esponja", "rastrillo", "rasuradora", "crema de afeitar", "espuma", "loción", "perfume", "desodorante", "antitranspirante", "protector solar", "bloqueador", "talco",
    "uñas", "unas", "cortaúñas", "gelish", "manicura", "pedicura", "pinzas", "cotonetes", "hisopos",
    "cepillo de dientes", "pasta dental", "enjuague bucal", "hilo dental", "toallas sanitarias", "tampones", "protectores",
    // 2. Antojos, Snacks y "Comida Chatarra"
    "oxxo", "7eleven", "7-eleven", "extra", "supercito", "maquinita",
    "chocolates", "gansito", "pingüinos", "chocorrol", "galletas", "chicles", "pastillas", "mentas", "paleta", "gomitas", "panditas", "mazapán", "nutella", "helado", "michoacana", "nutrisa",
    "papas", "sabritas", "ruffles", "doritos", "cheetos", "takis", "tostitos", "cacahuates", "churros",
    "refresco", "coca", "cocacola", "pepsi", "sprite", "fanta", "agua mineral", "topochico", "jugo", "valle", "jumex", "gatorade", "electrolit", "frappé", "frappe",
    "café", "cafe", "starbucks", "andatti", "cielito", "punta del cielo",
    // 3. Comida a Domicilio
    "uber eats", "didi food", "rappi",
    "pizza", "domino", "little caesars", "hut", "hamburguesa", "mcdonalds", "burger king", "carl's jr", "alitas", "kfc", "kentucky", "sushi", "tacos", "tortas", "tamales", "elote", "esquite",
    // 4. Ropa, Calzado y Textiles Personales
    "camisa", "playera", "pantalón", "pantalon", "short", "bermuda", "suéter", "sueter", "chamarra", "sudadera", "pants", "pijama",
    "tenis", "zapatos", "botas", "sandalias", "chanclas", "pantuflas",
    "calcetines", "calcetas", "tines", "ropa interior", "calzones", "brasier", "faja", "cinto", "cinturón", "cinturon", "gorra", "bufanda",
    "sastre", "tintorería", "planchado", "reparación de calzado",
    // 5. Vicios Permitidos y Accesorios
    "cigarros", "cajetilla", "tabaco", "marlboro", "camel", "pall mall", "benson", "faros",
    "encendedor", "bic", "cerillos",
    "vape", "vaper", "maskking", "esencias", "líquido vapeo", "liquido", "iqos", "heets", "resistencia",
    // 6. Tecnología, Recargas y Entretenimiento
    "recarga", "saldo", "telcel", "at&t", "movistar", "unefon", "chip", "megas", "paquete",
    "audífonos", "audifonos", "cargador", "cable", "funda", "mica", "usb", "pila", "batería", "bateria",
    "netflix", "spotify", "youtube premium", "amazon prime", "disney", "hbo", "max", "apple music",
    "xbox", "playstation", "nintendo", "tarjeta de regalo", "google play",
    // 7. Farmacia Personal y Suplementos Exclusivos
    "proteína", "proteina", "gym", "creatina", "pre-entreno", "vitaminas", "omega 3",
    "advil", "aspirina", "paracetamol", "ibuprofeno", "pastillas para la garganta", "gotas para los ojos"
];

// Reemplazar tildes para búsqueda flexible
const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const regexBolsillo = new RegExp(`(${keywordsBolsillo.map(normalize).join('|')})`, 'i');

// Función robusta para leer el usuario de la sesión
function resolveCurrentUser() {
  const parseSafe = (val) => {
    if (!val) return null;
    if (typeof val === 'string') return val.trim();
    if (typeof val === 'object') {
      if (val.username) return String(val.username).trim();
      if (val.email) return String(val.email).trim();
    }
    return String(val).trim();
  };

  // 1. Prioridad: variable global inyectada por injectSSO.js
  if (window.CREI_USER && window.CREI_USER !== 'undefined') {
    const safeUser = parseSafe(window.CREI_USER);
    if (safeUser) return safeUser;
  }
  // 2. Fallback: leer directamente del localStorage
  try {
    const raw = localStorage.getItem("crei_session");
    if (raw) {
      const parsed = JSON.parse(raw);
      const u = parsed.user || parsed.username || parsed.email || null;
      const safeU = parseSafe(u);
      if (safeU) return safeU;
    }
  } catch(e) { console.warn("SSO LocalStorage parse error:", e); }
  // 3. Fallback: Revisar si hay sesión en base64 (Next.js auth context)
  return "Desconocido";
}

// Actualizar el campo SSO en la UI
function actualizarCampoSSO(usuario) {
  try {
    const safeUsuario = typeof usuario === 'string' ? usuario : 'Desconocido';
    currentUser = safeUsuario;
    
    const el = document.getElementById("usuario_sso");
    if (el) {
      el.value = safeUsuario;
      el.placeholder = safeUsuario;
    }
    
    const correoEl = document.getElementById("correo");
    if (correoEl && correoEl.value === '' && safeUsuario.toLowerCase() !== 'desconocido') {
      correoEl.value = `${safeUsuario.toLowerCase()}@crei.mx`;
    }
    
    // Privilegios de Admin
    if (safeUsuario === 'Admin' || safeUsuario === 'admin') {
      const btnExcel = document.getElementById("btnExportarExcel");
      if (btnExcel) { btnExcel.classList.remove('hidden'); btnExcel.classList.add('flex'); }
    }
  } catch (error) {
    console.error("Error setting SSO field", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
    // Resolver usuario inmediatamente
    currentUser = resolveCurrentUser();
    actualizarCampoSSO(currentUser);

    // Si todavía es Desconocido, intentar via postMessage al parent (por si el iframe no lee localStorage)
    if (currentUser === 'Desconocido' && window.self !== window.top) {
      const handler = function(event) {
        if (event.data && event.data.type === "CREI_SESSION_RESPONSE") {
          const u = event.data.user;
          if (u && u !== 'Desconocido') {
            // Actualizar también el localStorage local
            if (event.data.raw) { try { localStorage.setItem("crei_session", event.data.raw); } catch(e) {} }
            actualizarCampoSSO(u);
            loadGastos(); // Recargar con el usuario correcto
          }
          window.removeEventListener("message", handler);
        }
      };
      window.addEventListener("message", handler);
      // Pedir la sesión al parent
      try { window.parent.postMessage({ type: "CREI_REQUEST_SESSION" }, "*"); } catch(e) {}
      // Timeout de seguridad: si en 3s no llega respuesta, cancelar
      setTimeout(() => window.removeEventListener("message", handler), 3000);
    }


    // Auto-detección de origen del pago por keywords
    const conceptoInput = document.getElementById("concepto");
    const radiosOrigen = document.querySelectorAll('input[name="origen_pago"]');
    radiosOrigen.forEach(r => r.addEventListener('change', () => radioManuallyModified = true));
    if(conceptoInput) {
        conceptoInput.addEventListener('input', (e) => {
            if(radioManuallyModified) return;
            const val = normalize(e.target.value.toLowerCase());
            if(regexBolsillo.test(val)) {
                document.querySelector('input[name="origen_pago"][value="Bolsillo propio"]').checked = true;
            } else {
                document.querySelector('input[name="origen_pago"][value="Fondo de la casa"]').checked = true;
            }
        });
    }

    loadGastos();
});


function alertMsg(msg, isError = false) {
    const box = document.getElementById('alertBox');
    document.getElementById('alertMessage').innerText = msg;
    box.className = `mb-6 rounded-xl border p-4 font-bold flex items-center justify-between ${isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`;
    box.style.display = 'flex';
    setTimeout(() => box.style.display = 'none', 6000);
}

// 1. CARGA EN TIEMPO REAL DESDE SUPABASE
async function loadGastos() {
    const tbody = document.getElementById('gastos-tbody');
    tbody.innerHTML = '<tr><td colspan="4" class="p-16 text-center"><div class="inline-block animate-spin w-6 h-6 border-4 border-brand-500 border-t-transparent rounded-full mb-2"></div><p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Sincronizando Nube...</p></td></tr>';
    
    try {
        let query = supabaseClient.from('gastos').select('*').order('creado_en', { ascending: false });
        
        // Regla Cero Confianza: Si NO eres el Admin ni el máster de CREI, filtra para ver SOLO CÓDIGOS de tu Usuario.
        if (currentUser !== 'Admin' && currentUser !== 'CREI') {
            query = query.eq('usuario', currentUser);
        }
        
        const { data, error } = await query;
            
        if(error) throw error;
        gastosCache = data;
        
        if(gastosCache.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="p-10 text-center text-slate-400 font-medium">No existen registros financieros en la base de datos PostgreSQL.</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        gastosCache.forEach(g => {
            // Resolver enlace estático heredado VS nube S3
            let publicUrl = '';
            if (g.archivo_path) {
                if (g.archivo_path.startsWith('uploads/')) {
                    publicUrl = window.location.origin + '/legacy-apps/comprobante/' + g.archivo_path; // Fallback local legacy
                } else if (g.archivo_path.startsWith('comprobantes/')) {
                    const { data: urlData } = supabaseClient.storage.from('comprobantes').getPublicUrl(g.archivo_path.split('comprobantes/')[1] || g.archivo_path);
                    publicUrl = urlData.publicUrl;
                } else {
                    publicUrl = g.archivo_path;
                }
            }

            const fileLink = publicUrl ? 
              `<a href="${publicUrl}" target="_blank" class="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-brand-600 flex items-center justify-center hover:bg-brand-50 transition transform hover:scale-110 tooltip">
                 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
               </a>` : '<span class="text-slate-300">-</span>';
            
            const d = new Date(g.creado_en);
            const dateStr = d.toLocaleDateString() + ' <span class="text-[10px] text-slate-400 font-semibold ml-1">' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + '</span>';
            const amount = parseFloat(g.importe).toLocaleString('es-MX', {style:'currency', currency:'MXN'});
            const historyObj = typeof g.historial === 'string' ? JSON.parse(g.historial || '[]') : (g.historial || []);
            const hasHistory = historyObj.length > 0;
            const historyBadge = hasHistory ? `<span class="ml-2 inline-block px-1.5 py-0.5 bg-brand-100 text-brand-700 text-[8px] font-black rounded uppercase tracking-wider tooltip">MODIFICADO</span>` : '';
            
            const isBolsillo = g.origen_pago === 'Bolsillo propio' || regexBolsillo.test(normalize((g.concepto || '').toLowerCase()));
            const trClass = isBolsillo ? "bg-rose-50/70 hover:bg-rose-100 transition-colors group" : "hover:bg-slate-50/50 transition-colors group";
            const rowColor = isBolsillo ? "text-rose-900" : "text-slate-800";
            const amountColor = isBolsillo ? "text-rose-700" : "text-slate-900";
            const badgeClass = isBolsillo ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200";

            const tr = document.createElement('tr');
            tr.className = trClass;
            tr.innerHTML = `
              <td class="px-6 py-4">
                <div class="${rowColor} font-black mb-1 flex items-center gap-1">
                   <span class="w-1.5 h-1.5 rounded-full ${isBolsillo ? 'bg-rose-600' : (g.tipo==='Factura' ? 'bg-sky-500' : (g.tipo==='Ticket' ? 'bg-emerald-500' : 'bg-purple-500'))}"></span>
                   ${g.concepto} ${historyBadge}
                </div>
                <div class="${isBolsillo ? 'text-rose-600/80': 'text-slate-500'} text-xs font-semibold flex flex-wrap items-center gap-2 mt-1.5">
                  <span class="flex items-center gap-1"><svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> ${g.usuario}</span>
                  <span class="px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider ${isBolsillo ? 'bg-rose-100 text-rose-700 border-rose-200':'bg-slate-100 text-slate-500 border-slate-200'} border">Registrado: ${dateStr}</span>
                  <span class="px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider ${isBolsillo ? 'bg-rose-600 text-white border-transparent' : 'bg-brand-50 text-brand-700 border border-brand-200'}">Compra: <strong class="font-bold">${g.fecha_compra || 'N/A'}</strong></span>
                  <span class="px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider ${badgeClass} border font-bold">${g.origen_pago || 'Casa'}</span>
                  ${g.numero_ticket ? `<span class="px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 font-bold">Tick: ${g.numero_ticket}</span>` : ''}
                  ${g.numero_factura ? `<span class="px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 font-bold">Fact: ${g.numero_factura}</span>` : ''}
                  ${g.iva ? `<span class="px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold">IVA: $${parseFloat(g.iva).toFixed(2)}</span>` : ''}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 ${isBolsillo ? 'bg-rose-200/50 border-rose-200 text-rose-800' : 'bg-slate-100 border-slate-200 text-slate-600'} border rounded text-[10px] font-black uppercase">${g.tipo}</span>
              </td>
              <td class="px-6 py-4 text-right font-black ${amountColor} tabular-nums tracking-tight">
                ${amount}
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  ${fileLink}
                  <button onclick="openModal(${g.id})" class="${isBolsillo ? 'text-rose-400 hover:text-rose-900 border-rose-200' : 'text-slate-400 hover:text-slate-900 border-slate-200'} bg-white border rounded-full w-8 h-8 flex items-center justify-center transition shadow-sm hover:shadow">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                </div>
              </td>
            `;
            tbody.appendChild(tr);
        });
    } catch(e) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-rose-500 font-bold bg-rose-50/50">PostgreSQL Error: ${e.message}</td></tr>`;
    }
}

// 2. SUBIR NUEVO COMPROBANTE HACIA STORAGE Y POSTGRESQL NATIVO
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmit');
    const oriHTML = btn.innerHTML;
    
    // Validaciones
    const file = fi.files[0];
    if(!file) return alertMsg("Inserta un archivo primero", true);
    
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Almacenando...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    try {
        // Generar nombre unico S3
        const uuid = Date.now() + '_' + Math.random().toString(36).substring(2,8);
        const ext = file.name.split('.').pop();
        const secureFileName = `${uuid}.${ext}`;
        
        // 1. Storage Upload
        const { data: storageData, error: uploadErr } = await supabaseClient.storage
            .from('comprobantes')
            .upload(secureFileName, file);
            
        if(uploadErr) throw new Error("Fallo envío S3: " + uploadErr.message);
        
        // 2. Postgres Row Insert (Auto-ID vía DB. Si en tu CSV el max id fue X, el default autoincremental de la columna BigInt funciona o le generamos un timestamp simulando BIGINT)
        const newId = Date.now();
        
        const payload = {
            id: newId,
            usuario: currentUser,
            correo: document.getElementById('correo').value,
            concepto: document.getElementById('concepto').value,
            importe: parseFloat(document.getElementById('importe').value).toFixed(2),
            tipo: document.querySelector('input[name="tipo"]:checked').value,
            fecha_compra: document.getElementById('fecha_compra').value,
            origen_pago: document.querySelector('input[name="origen_pago"]:checked').value,
            archivo_path: `comprobantes/${secureFileName}`,
            archivo_mime: file.type,
            numero_ticket: document.getElementById('numero_ticket').value || null,
            numero_factura: document.getElementById('numero_factura').value || null,
            iva: document.getElementById('iva').value ? parseFloat(document.getElementById('iva').value).toFixed(2) : null,
            historial: []
        };
        
        const { error: dbErr } = await supabaseClient.from('gastos').insert([payload]);
        if(dbErr) throw new Error("Falla registro SQL: " + dbErr.message);
        
        // Limpiar form
        document.getElementById('uploadForm').reset();
        radioManuallyModified = false;
        fn.classList.add('hidden');
        const usSoInput2 = document.getElementById("usuario_sso");
        if(usSoInput2) usSoInput2.value = currentUser;

        // 🔔 Enviar Notificación Push
        try {
            fetch('/api/notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: '🧾 Nuevo Comprobante', 
                    body: `El usuario ${currentUser} ha anexado un comprobante de $${payload.importe}.`, 
                    url: '/es/portal-terapeutas/app/comprobante' 
                })
            });
        } catch (e) { console.error("Push Error", e); }
        
        alertMsg("¡Bloque de recibo guardado en la arquitectura Serverless!");
        loadGastos();
        
    } catch(err) {
        alertMsg(err.message, true);
    } finally {
        btn.innerHTML = oriHTML;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
});

// 3. ACTUALIZACIONES DE AUDITORÍA JS
function openModal(id) {
    const gasto = gastosCache.find(g => parseInt(g.id) === parseInt(id));
    if(!gasto) return;
    
    document.getElementById('edit-id').value = gasto.id;
    document.getElementById('edit-id-label').innerText = `#${gasto.id}`;
    document.getElementById('edit-concepto').value = gasto.concepto;
    document.getElementById('edit-importe').value = parseFloat(gasto.importe).toFixed(2);
    document.getElementById('edit-tipo').value = gasto.tipo;
    document.getElementById('edit-fecha').value = gasto.fecha_compra || '';
    document.getElementById('edit-origen').value = gasto.origen_pago || 'Fondo de la casa';
    document.getElementById('edit-ticket').value = gasto.numero_ticket || '';
    document.getElementById('edit-factura').value = gasto.numero_factura || '';
    document.getElementById('edit-iva').value = gasto.iva || '';
    
    const historias = typeof gasto.historial === 'string' ? JSON.parse(gasto.historial||'[]') : (gasto.historial||[]);
    renderHistorial(historias);
    
    const modal = document.getElementById('editModal');
    const panel = document.getElementById('editModalPanel');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.remove('opacity-0'); panel.classList.remove('scale-95'); }, 10);
}

function closeModal() {
    const modal = document.getElementById('editModal');
    const panel = document.getElementById('editModalPanel');
    modal.classList.add('opacity-0');
    panel.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.style.display = 'none'; }, 300);
}

function renderHistorial(historias) {
    const container = document.getElementById('historial-container');
    if(!historias || !historias.length) {
        container.innerHTML = `
          <div class="relative pl-6 pb-2">
            <span class="absolute left-[-15px] top-1.5 h-2 w-2 shadow-[0_0_0_4px_white] rounded-full bg-slate-300"></span>
            <p class="text-[10px] font-bold text-slate-400">El bloque de datos está intacto y sellado.</p>
          </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    [...historias].reverse().forEach((h, i) => {
        let lis = h.cambios.map(c => `<li class="text-slate-600 font-medium">${c}</li>`).join('');
        container.innerHTML += `
        <div class="relative pl-6 pb-5 group">
          <span class="absolute left-[-15px] top-1.5 h-2 w-2 shadow-[0_0_0_4px_white] rounded-full bg-brand-500 group-hover:scale-125 transition"></span>
          <div class="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="font-black text-slate-800 text-[10px] uppercase">${h.autor} editó registros funcionales</span>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">${new Date(h.fecha).toLocaleString()}</span>
            </div>
            <ul class="text-[11px] leading-relaxed list-disc list-inside space-y-0.5 ml-1 marker:text-brand-500">${lis}</ul>
          </div>
        </div>
        `;
    });
}

async function salvarEdicion() {
    const id = document.getElementById('edit-id').value;
    const concepto = document.getElementById('edit-concepto').value.trim();
    const importe = document.getElementById('edit-importe').value;
    const tipo = document.getElementById('edit-tipo').value;
    const fecha_compra = document.getElementById('edit-fecha').value;
    const origen_pago = document.getElementById('edit-origen').value;
    const ticket = document.getElementById('edit-ticket').value.trim();
    const factura = document.getElementById('edit-factura').value.trim();
    const iva_val = document.getElementById('edit-iva').value;
    
    if(!concepto || !importe || !tipo || !fecha_compra) return alertMsg('Propiedades vacías', true);
    
    const btn = document.getElementById('btnSaveEdit');
    const oldText = btn.innerText;
    btn.innerText = 'Forzando Actualización...';
    btn.disabled = true;
    
    try {
        // Encontrar datos viejos localmente
        const gasto = gastosCache.find(g => parseInt(g.id) === parseInt(id));
        const historiasAnteriores = typeof gasto.historial === 'string' ? JSON.parse(gasto.historial||'[]') : (gasto.historial||[]);
        
        let cambios = [];
        if(gasto.concepto !== concepto) cambios.push(`Concepto: '${gasto.concepto}' → '${concepto}'`);
        if(parseFloat(gasto.importe).toFixed(2) !== parseFloat(importe).toFixed(2)) cambios.push(`Monto: $${parseFloat(gasto.importe).toFixed(2)} → $${parseFloat(importe).toFixed(2)}`);
        if(gasto.tipo !== tipo) cambios.push(`Clase: '${gasto.tipo}' → '${tipo}'`);
        if((gasto.fecha_compra || '') !== fecha_compra) cambios.push(`Fecha: '${gasto.fecha_compra}' → '${fecha_compra}'`);
        if((gasto.origen_pago || '') !== origen_pago) cambios.push(`Fondo: '${gasto.origen_pago}' → '${origen_pago}'`);
        if((gasto.numero_ticket || '') !== ticket) cambios.push(`Ticket: '${gasto.numero_ticket||''}' → '${ticket}'`);
        if((gasto.numero_factura || '') !== factura) cambios.push(`Factura: '${gasto.numero_factura||''}' → '${factura}'`);
        if(parseFloat(gasto.iva || 0).toFixed(2) !== parseFloat(iva_val || 0).toFixed(2)) cambios.push(`IVA: $${parseFloat(gasto.iva||0).toFixed(2)} → $${parseFloat(iva_val||0).toFixed(2)}`);
        
        if(cambios.length === 0) {
            closeModal();
            return;
        }
        
        historiasAnteriores.push({
            fecha: new Date().toISOString(),
            autor: currentUser,
            cambios: cambios
        });
        
        const payload = {
            concepto,
            importe: parseFloat(importe).toFixed(2),
            tipo,
            fecha_compra,
            origen_pago,
            numero_ticket: ticket || null,
            numero_factura: factura || null,
            iva: iva_val ? parseFloat(iva_val).toFixed(2) : null,
            historial: historiasAnteriores
        };

        const { error } = await supabaseClient.from('gastos').update(payload).eq('id', id);
        if(error) throw new Error("Falla de capa SQL: " + error.message);
        
        alertMsg(`Registro #${id} mutado exitosamente`);
        closeModal();
        loadGastos();
        
    } catch(e) {
        alertMsg(e.message, true);
    } finally {
        btn.innerText = oldText;
        btn.disabled = false;
    }
}

// --- LÓGICA DE EXCEL (ADMIN) ---
function openExcelModal() {
    const modal = document.getElementById('excelModal');
    const panel = document.getElementById('excelModalPanel');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.remove('opacity-0'); panel.classList.remove('scale-95'); }, 10);
}

function closeExcelModal() {
    const modal = document.getElementById('excelModal');
    const panel = document.getElementById('excelModalPanel');
    modal.classList.add('opacity-0');
    panel.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); modal.style.display = 'none'; }, 300);
}

function generarExcel() {
    const fInicio = document.getElementById('excel-fecha-inicio').value;
    const fFin = document.getElementById('excel-fecha-fin').value;
    if(!fInicio || !fFin) return alertMsg('Por favor selecciona ambas fechas', true);

    const inicio = new Date(fInicio + 'T00:00:00');
    const fin = new Date(fFin + 'T23:59:59');

    const extract = gastosCache.filter(g => {
        const compDateObj = new Date(g.fecha_compra ? (g.fecha_compra + 'T12:00:00') : g.creado_en);
        return compDateObj >= inicio && compDateObj <= fin;
    }).map(g => {
        const textMatch = regexBolsillo.test(normalize((g.concepto || '').toLowerCase()));
        const isBolsillo = g.origen_pago === 'Bolsillo propio' || textMatch;
        return {
            "ID Comprobante": g.id,
            "Fecha Efectiva": g.fecha_compra || new Date(g.creado_en).toLocaleDateString(),
            "Concepto del Gasto": g.concepto,
            "Documento": g.tipo,
            "Número Ticket": g.numero_ticket || "N/A",
            "Número Factura": g.numero_factura || "N/A",
            "Importe MXN": parseFloat(g.importe),
            "IVA MXN": g.iva ? parseFloat(g.iva) : 0,
            "Fondo Destino": isBolsillo ? "Bolsillo Propio" : "Fondo de la Casa",
            "Cargado por (Terapeuta)": g.usuario,
            "Fecha Auditoría (Nube)": new Date(g.creado_en).toLocaleString()
        };
    });

    if(extract.length === 0) {
        alertMsg('No hay gastos en este rango exacto de fechas seleccionadas', true);
        return;
    }

    const ws = XLSX.utils.json_to_sheet(extract);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gastos_Finanzas");
    
    // Auto-size columns slightly
    ws['!cols'] = [
        {wch: 15}, {wch: 15}, {wch: 45}, {wch: 15}, {wch: 18}, {wch: 18}, {wch: 15}, {wch: 15}, {wch: 22}, {wch: 25}, {wch: 25}
    ];

    XLSX.writeFile(wb, `CREI_Reporte_${fInicio}_a_${fFin}.xlsx`);
    closeExcelModal();
    alertMsg(`Reporte desencriptado exitosamente (${extract.length} transacciones).`);
}

