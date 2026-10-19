import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
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

export async function POST(request: NextRequest) {
  const session = verifyTherapistSession(request.cookies.get(THERAPIST_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Sesión clínica vencida." }, { status: 401 });

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: "Las claves VAPID no están configuradas." }, { status: 503 });
  }

  try {
    webpush.setVapidDetails("mailto:infocreimx@gmail.com", publicKey, privateKey);
    const supabase = serverClient();
    const { data: subscriptions, error } = await supabase
      .from("eventos_importantes_suscripciones")
      .select("id, endpoint, keys_auth, keys_p256dh, subscription")
      .eq("usuario_id", Number(session.id))
      .eq("active", true);
    if (error) throw error;

    let sent = 0;
    for (const subscription of subscriptions || []) {
      const auth = subscription.keys_auth || subscription.subscription?.keys?.auth;
      const p256dh = subscription.keys_p256dh || subscription.subscription?.keys?.p256dh;
      if (!subscription.endpoint || !auth || !p256dh) continue;
      try {
        await webpush.sendNotification(
          { endpoint: subscription.endpoint, keys: { auth, p256dh } },
          JSON.stringify({
            title: "Notificaciones CREI activadas",
            body: "Este dispositivo recibirá los recordatorios de Eventos importantes.",
            url: "/es/portal-terapeutas/app/eventos-importantes",
            tag: "crei-push-test",
          }),
        );
        sent += 1;
      } catch (caught) {
        const pushError = caught as { statusCode?: number };
        if (pushError.statusCode === 404 || pushError.statusCode === 410) {
          await supabase
            .from("eventos_importantes_suscripciones")
            .update({ active: false, updated_at: new Date().toISOString() })
            .eq("id", subscription.id);
        }
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible enviar la notificación de prueba.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
