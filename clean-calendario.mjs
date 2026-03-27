const SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co/rest/v1/calendario";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

async function patchRows(oldId, newId) {
  const res = await fetch(`${SUPABASE_URL}?therapist_id=eq.${oldId}`, {
    method: "PATCH",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ therapist_id: newId })
  });
  if(res.ok) console.log(`Updated ${oldId} -> ${newId}`);
  else console.error(`Failed ${oldId}:`, await res.text());
}

async function run() {
  await patchRows("t-alberto-vazquez", "2");
  await patchRows("t-arturo-duarte", "3");
  await patchRows("t-cesar-vilchis", "14");
  await patchRows("t-gilberto-castillo", "14");
  await patchRows("t-mauricio-mora", "14");
  console.log("Cleanup completely finished.");
}
run();
