import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testLogin(user, pwd) {
  const { data, error } = await sb.rpc("login_user", {
    p_username: user,
    p_password: pwd
  });
  console.log(`Testing ${user}:`, data, error);
}

testLogin("Roberto", "Roberto123");
testLogin("Diego", "Diego123");
testLogin("Admin", "Admin123");
