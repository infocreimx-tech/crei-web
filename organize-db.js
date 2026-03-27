const { createClient } = require("@supabase/supabase-js");
const sb = createClient("https://uywihjppwzrrfjkguvot.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw");

async function run() {
  const { data, error } = await sb.from("calendario").select("therapist_id");
  if(error) return console.error(error);
  
  const uniqueIds = [...new Set(data.map(d => d.therapist_id))];
  console.log("Unique Therapist IDs in Calendario:", uniqueIds);
}
run();
