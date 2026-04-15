import fs from "fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";
const sb = createClient(SUPABASE_URL, API_KEY);

const CSV_PATH = "public/legacy-apps/cuestionario/data/submissions.csv";

async function importData() {
  console.log("Cleaning up existing data...");
  await sb.from("crei_valoraciones").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Reading CSV...");
  const fileContent = fs.readFileSync(CSV_PATH);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Found ${records.length} records. Preparing batch upload...`);

  // Batch size for Supabase
  const BATCH_SIZE = 100;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE).map(r => {
      // Reformat date from DD-MM-YYYY to YYYY-MM-DD if needed
      let bday = r.fecha_nacimiento;
      if (bday && bday.includes("-")) {
        const parts = bday.split("-");
        if (parts[0].length === 2 && parts[2].length === 4) {
          bday = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      return {
        ...r,
        fecha_nacimiento: bday || null,
        urgencia: parseInt(r.urgencia) || null,
        created_at: r.fecha_envio || new Date().toISOString()
      };
    });

    const { error } = await sb.from("crei_valoraciones").insert(batch);
    if (error) {
       console.error(`❌ Error in batch ${i}-${i + BATCH_SIZE}:`, error.message);
    } else {
       console.log(`✅ Uploaded records ${i} to ${Math.min(i + BATCH_SIZE, records.length)}`);
    }
  }

  console.log("Import complete.");
}

importData();
