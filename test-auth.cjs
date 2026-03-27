const { createClient } = require("@supabase/supabase-js");
const sb = createClient("https://uywihjppwzrrfjkguvot.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw");
async function run() {
  const { data, error } = await sb.from("usuarios").select("*").limit(20);
  if (error) {
    console.error("DB ERROR: ", error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}
run();
