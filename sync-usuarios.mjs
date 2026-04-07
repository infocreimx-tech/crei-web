import crypto from "crypto";

const SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

const sha256 = (str) => crypto.createHash("sha256").update(str).digest("hex");

// username → { password, role }
const USERS = [
  { username: "Admin",   password: "Admin123",   role: "admin"     },
  { username: "Alberto", password: "Alberto123", role: "therapist" },
  { username: "Hector",  password: "Hector123",  role: "therapist" },
  { username: "Sergio",  password: "Sergio123",  role: "therapist" },
  { username: "CREI",    password: "Fercrei*",   role: "therapist" },
  { username: "Arturo",  password: "Arturo123",  role: "therapist" },
  { username: "Roberto", password: "Roberto123", role: "therapist" },
  { username: "Diego",   password: "Diego123",   role: "therapist" },
];

async function patchUser(user) {
  const hash = sha256(user.password);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?username=eq.${encodeURIComponent(user.username)}`, {
    method: "PATCH",
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ password_hash: hash, role: user.role })
  });

  if (res.ok) {
    const updatedRows = await res.json();
    if (updatedRows.length === 0) {
      // 0 rows updated, perform insert
      const insRes = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ username: user.username, password_hash: hash, role: user.role, is_active: true })
      });
      if (insRes.ok) console.log(`✅ Inserted ${user.username}`);
      else console.error(`❌ Failed inserting ${user.username}:`, await insRes.text());
    } else {
      console.log(`✅ Updated ${user.username} → hash:${hash.substring(0,12)}... role:${user.role}`);
    }
  } else {
    console.error(`❌ Failed updating ${user.username}:`, await res.text());
  }
}

for (const u of USERS) {
  await patchUser(u);
}

// Verify
const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?select=id,username,role,is_active`, {
  headers: { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` }
});
const current = await verifyRes.json();
console.log("\n--- Current usuarios table ---");
current.forEach(u => console.log(`  id:${u.id} | ${u.username} | ${u.role} | active:${u.is_active}`));
