import "server-only";

const DEFAULT_SUPABASE_URL = "https://uywihjppwzrrfjkguvot.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

function defaultKeyFromJson(value?: string) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const preferred = parsed.default;
    if (typeof preferred === "string") return preferred;
    const first = Object.values(parsed).find((entry) => typeof entry === "string");
    return typeof first === "string" ? first : "";
  } catch {
    return "";
  }
}

export function getServerSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    || process.env.SUPABASE_URL
    || DEFAULT_SUPABASE_URL;

  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.SUPABASE_PUBLISHABLE_KEY
    || defaultKeyFromJson(process.env.SUPABASE_PUBLISHABLE_KEYS)
    || DEFAULT_SUPABASE_ANON_KEY;

  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_SECRET_KEY
    || defaultKeyFromJson(process.env.SUPABASE_SECRET_KEYS);

  return { url, publicKey, adminKey };
}

export function getTherapistSessionSecret() {
  const { adminKey } = getServerSupabaseConfig();
  const value = process.env.THERAPIST_SESSION_SECRET || adminKey;
  if (!value) {
    throw new Error("Falta una clave privada de Supabase en el servidor.");
  }
  return value;
}
