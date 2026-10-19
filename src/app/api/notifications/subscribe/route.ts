import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { THERAPIST_COOKIE, verifyTherapistSession } from "@/lib/therapistSession";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";

export const dynamic = "force-dynamic";

function serverClient() {
  const { url, adminKey } = getServerSupabaseConfig();
  if (!adminKey) throw new Error("Falta configurar la clave privada de Supabase.");
  return createClient(url, adminKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
function sessionFrom(request: NextRequest) {
  return verifyTherapistSession(request.cookies.get(THERAPIST_COOKIE)?.value);
}
export async function POST(request: NextRequest) {
  const session = sessionFrom(request);
  if (!session) return NextResponse.json({ error: "Sesión clínica vencida." }, { status: 401 });

  try {
    const subscription = await request.json();
    const portalUserId = Number(session.id);
    const endpoint = String(subscription?.endpoint || "").trim();
    const keysAuth = String(subscription?.keys?.auth || "").trim();
    const keysP256dh = String(subscription?.keys?.p256dh || "").trim();

    if (!Number.isSafeInteger(portalUserId) || portalUserId <= 0 || !endpoint || !keysAuth || !keysP256dh) {
      return NextResponse.json({ error: "Suscripción inválida." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { error } = await serverClient()
      .from("eventos_importantes_suscripciones")
      .upsert(
        {
          usuario_id: portalUserId,
          endpoint,
          subscription,
          keys_auth: keysAuth,
          keys_p256dh: keysP256dh,
          active: true,
          last_seen_at: now,
          updated_at: now,
        },
        { onConflict: "endpoint" },
      );

    if (error) {
      const migrationMissing = /eventos_importantes_suscripciones|keys_auth|keys_p256dh|active|last_seen_at/i.test(error.message);
      return NextResponse.json(
        {
          error: migrationMissing
            ? "Primero ejecuta la migración de Eventos importantes en Supabase."
            : error.message,
        },
        { status: migrationMissing ? 409 : 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible guardar la suscripción.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  const session = sessionFrom(request);
  if (!session) return NextResponse.json({ error: "Sesión clínica vencida." }, { status: 401 });

  try {
    const { endpoint } = await request.json();
    const value = String(endpoint || "").trim();
    if (!value) return NextResponse.json({ error: "Suscripción inválida." }, { status: 400 });

    const { error } = await serverClient()
      .from("eventos_importantes_suscripciones")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("endpoint", value)
      .eq("usuario_id", Number(session.id));
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible desactivar la suscripción.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
// Las suscripciones se administran únicamente mediante la sesión firmada del portal.
