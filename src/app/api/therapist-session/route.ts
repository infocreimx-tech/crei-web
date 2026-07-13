import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { signTherapistSession, THERAPIST_COOKIE } from "@/lib/therapistSession";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { url: supabaseUrl, publicKey, adminKey } = getServerSupabaseConfig();
    if (!adminKey) {
      return NextResponse.json({
        error: "Falta configurar la clave privada de Supabase en el servidor de producción."
      }, { status: 503 });
    }

    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (!username || !password) {
      return NextResponse.json({ error: "Usuario y contraseña son obligatorios." }, { status: 400 });
    }

    // Validar primero contra el sistema legacy. La service role nunca llega al navegador.
    const legacyClient = createClient(supabaseUrl, publicKey, { auth: { persistSession: false } });
    const { data: rpcData, error: rpcError } = await legacyClient.rpc("login_user", {
      p_username: username,
      p_password: password
    });
    if (rpcError || !rpcData?.success || !rpcData?.user) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
    }

    const legacyUser = rpcData.user;
    const role = legacyUser.role === "admin" ? "admin" : "therapist";
    const user = {
      id: String(legacyUser.id),
      username: legacyUser.username || username,
      role
    } as const;
    const token = signTherapistSession(user);
    const response = NextResponse.json({
      ok: true,
      user
    });
    response.cookies.set(THERAPIST_COOKIE, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 8 * 60 * 60
    });
    return response;
  } catch (caught) {
    console.error("Error synchronizing therapist session:", caught);
    return NextResponse.json({ error: "No fue posible crear la sesión segura del terapeuta." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(THERAPIST_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
