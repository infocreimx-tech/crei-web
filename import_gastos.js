const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse');

const SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const CSV_PATH = "/Users/luispaniaguapalacios/Downloads/gastos.csv";

if (!fs.existsSync(CSV_PATH)) {
    console.error(`Error: File not found at ${CSV_PATH}`);
    process.exit(1);
}

const results = [];

fs.createReadStream(CSV_PATH)
  .pipe(parse({ columns: true, trim: true }))
  .on('data', (data) => {
    results.push(data);
  })
  .on('end', async () => {
    console.log(`✅ Leídas ${results.length} filas del archivo CSV...`);
    
    // Normalizar la data al esquema estricto de Supabase
    const insertPayload = results.map(row => {
       // Convert '2026-03-05 22:53:43' direct format string to ISO string gracefully
       let dateIso = new Date().toISOString();
       if (row.creado_en) {
           const d = new Date(row.creado_en.replace(' ', 'T') + 'Z');
           if (!isNaN(d.valueOf())) dateIso = d.toISOString();
       }
       
       return {
           id: parseInt(row.id) || null,
           usuario: row.usuario || 'Desconocido',
           correo: row.correo || '',
           concepto: row.concepto || '',
           importe: parseFloat(row.importe) || 0.00,
           tipo: row.tipo || 'Otro',
           archivo_path: row.archivo_path || '',
           archivo_mime: row.archivo_mime || '',
           creado_en: dateIso,
           historial: [] 
       };
    }).filter(row => row.id !== null);

    console.log(`🚀 Insertando ${insertPayload.length} registros en PostgreSQL...`);
    
    const { data: inserted, error } = await supabase
      .from('gastos')
      .upsert(insertPayload, { onConflict: 'id' });
      
    if (error) {
      console.error("❌ Falló la importación a Supabase:", error);
    } else {
      console.log("🔥 ¡Migración completada exitosamente!");
      console.log(`Verifícalo entrando a tu Dashboard de Supabase en la tabla 'gastos'.`);
    }
  })
  .on('error', (err) => {
      console.error("Error al procesar CSV:", err.message);
  });
