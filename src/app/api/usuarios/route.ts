import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  "Content-Type": "application/json",
};

const sha256 = (str: string) =>
  crypto.createHash("sha256").update(str).digest("hex");

// ── GET: listar todos los usuarios ─────────────────────────────────────────
export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?select=id,username,role,is_active&order=id.asc`,
      { headers }
    );
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── POST: crear usuario ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, role } = body;

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    const hash = sha256(password.trim());

    // 1. Intentar PATCH primero (por si ya existe)
    const patchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?username=eq.${encodeURIComponent(username.trim())}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({ password_hash: hash, role: role || "therapist", is_active: true }),
      }
    );

    if (patchRes.ok) {
      const patched = await patchRes.json();
      if (patched.length > 0) {
        return NextResponse.json({ ok: true, action: "updated", user: patched[0] });
      }
    }

    // 2. Si no existe, hacer INSERT
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({
        username: username.trim(),
        password_hash: hash,
        role: role || "therapist",
        is_active: true,
      }),
    });

    const inserted = await insertRes.json();
    if (!insertRes.ok) {
      return NextResponse.json({ error: inserted?.message || JSON.stringify(inserted) }, { status: 500 });
    }
    return NextResponse.json({ ok: true, action: "created", user: inserted[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── PATCH: actualizar usuario (password, role, is_active) ──────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password, role, is_active } = body;

    if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 });

    const payload: Record<string, any> = {};
    if (password !== undefined) payload.password_hash = sha256(password);
    if (role !== undefined) payload.role = role;
    if (is_active !== undefined) payload.is_active = is_active;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${id}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── DELETE: eliminar usuario ────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 });

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${id}`,
      {
        method: "DELETE",
        headers: { ...headers, Prefer: "return=minimal" },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
