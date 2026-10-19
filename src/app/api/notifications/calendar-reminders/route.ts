import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function serverClient() {
  const { url, adminKey } = getServerSupabaseConfig();
  if (!adminKey) throw new Error("Falta configurar la clave privada de Supabase.");
  return createClient(url, adminKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export async function POST(request: NextRequest) {
  const cronSecret = process.env.CALENDAR_CRON_SECRET;
  const supplied = request.headers.get("authorization");
  if (!cronSecret || supplied !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: "Las claves VAPID no están configuradas." }, { status: 503 });
  }

  try {
    webpush.setVapidDetails("mailto:infocreimx@gmail.com", publicKey, privateKey);
    const supabase = serverClient();
    const now = new Date().toISOString();
    const { data: reminders, error: remindersError } = await supabase
      .from("eventos_importantes_recordatorios")
      .select("id, evento_importante_id, usuario_id, minutes_before, attempts")
      .eq("status", "pending")
      .lte("scheduled_for", now)
      .order("scheduled_for", { ascending: true })
      .limit(100);
    if (remindersError) throw remindersError;
    if (!reminders?.length) return NextResponse.json({ success: true, processed: 0, sent: 0 });

    const reminderIds = reminders.map((item) => item.id);
    await supabase
      .from("eventos_importantes_recordatorios")
      .update({ status: "processing", claimed_at: now, updated_at: now })
      .in("id", reminderIds)
      .eq("status", "pending");

    const eventIds = Array.from(new Set(reminders.map((item) => item.evento_importante_id)));
    const userIds = Array.from(new Set(reminders.map((item) => Number(item.usuario_id))));
    const [{ data: events, error: eventsError }, { data: subscriptions, error: subscriptionsError }] = await Promise.all([
      supabase
        .from("eventos_importantes")
        .select("id, title, start_at, status, event_kind")
        .in("id", eventIds),
      supabase
        .from("eventos_importantes_suscripciones")
        .select("id, usuario_id, endpoint, keys_auth, keys_p256dh, subscription")
        .in("usuario_id", userIds)
        .eq("active", true),
    ]);
    if (eventsError) throw eventsError;
    if (subscriptionsError) throw subscriptionsError;

    const eventById = new Map((events || []).map((event) => [event.id, event]));
    const subscriptionsByUser = new Map<number, typeof subscriptions>();
    (subscriptions || []).forEach((subscription) => {
      const userId = Number(subscription.usuario_id);
      const rows = subscriptionsByUser.get(userId) || [];
      rows.push(subscription);
      subscriptionsByUser.set(userId, rows);
    });

    let sent = 0;
    for (const reminder of reminders) {
      const event = eventById.get(reminder.evento_importante_id);
      if (
        !event
        || !["zoom_meeting", "internal_event"].includes(String(event.event_kind))
        || String(event.status).toLowerCase() === "cancelled"
      ) {
        await supabase
          .from("eventos_importantes_recordatorios")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("id", reminder.id);
        continue;
      }

      const userSubscriptions = subscriptionsByUser.get(Number(reminder.usuario_id)) || [];
      let successfulForReminder = 0;
      let lastError = userSubscriptions.length ? "" : "Sin dispositivos activos para este perfil.";

      for (const subscription of userSubscriptions) {
        const auth = subscription.keys_auth || subscription.subscription?.keys?.auth;
        const p256dh = subscription.keys_p256dh || subscription.subscription?.keys?.p256dh;
        if (!subscription.endpoint || !auth || !p256dh) continue;
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: { auth, p256dh },
            },
            JSON.stringify({
              title: "Recordatorio de evento importante",
              body: `Tu actividad comienza en ${reminder.minutes_before} minutos.`,
              url: `/es/portal-terapeutas/app/eventos-importantes?evento=${event.id}`,
              tag: `crei-calendar-${event.id}-${reminder.minutes_before}`,
            }),
          );
          successfulForReminder += 1;
          sent += 1;
        } catch (error) {
          const pushError = error as { statusCode?: number; message?: string };
          lastError = pushError.message || "No fue posible enviar una notificación.";
          if (pushError.statusCode === 404 || pushError.statusCode === 410) {
            await supabase
              .from("eventos_importantes_suscripciones")
              .update({ active: false, updated_at: new Date().toISOString() })
              .eq("id", subscription.id);
          }
        }
      }

      await supabase
        .from("eventos_importantes_recordatorios")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          attempts: Number(reminder.attempts || 0) + 1,
          last_error: successfulForReminder ? null : lastError,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reminder.id);
    }

    return NextResponse.json({ success: true, processed: reminders.length, sent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible procesar los recordatorios.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
