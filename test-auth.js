const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const { data, error } = await sb.from("usuarios").select("*");
  if(error) {
    console.error("error", error);
  } else {
    console.log("Usuarios:");
    console.log(data);
  }
}
run();
