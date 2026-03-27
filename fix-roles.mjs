const SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

// Patch roles for the 5 therapists that have empty role field
const therapists = ["Alberto", "Arturo", "Hector", "Sergio", "CREI"];

for (const name of therapists) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?username=eq.${name}`, {
    method: "PATCH",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({ role: "therapist" })
  });
  console.log(res.ok ? `✅ Role set for ${name}` : `❌ Error for ${name}: ${await res.text()}`);
}

// Verify
const r = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?select=id,username,role`, {
  headers: { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` }
});
const data = await r.json();
console.table(data);
