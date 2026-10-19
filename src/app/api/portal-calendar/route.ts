import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { THERAPIST_COOKIE, verifyTherapistSession } from "@/lib/therapistSession";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";
import { isAdministrativeRole } from "@/lib/portalRoles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE = {
  "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
};

const EVENT_COLUMNS = [
  "id",
  "event_kind",
  "title",
  "description",
  "meeting_url",
  "start_at",
  "end_at",
  "timezone",
  "location",
  "status",
  "cancel_reason",
  "created_by_user_id",
  "cancelled_at",
  "cancelled_by_user_id",
  "created_at",
  "updated_at",
].join(", ");

function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...NO_STORE, ...(init?.headers || {}) },
  });
}
function serverClient(): any {
  const { url, adminKey } = getServerSupabaseConfig();
  if (!adminKey) throw new Error("Falta configurar la clave privada de Supabase.");
  return createClient(url, adminKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getSession(request: NextRequest) {
  return verifyTherapistSession(request.cookies.get(THERAPIST_COOKIE)?.value);
}

function parseUserId(value: string) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isMissingMigration(message: string) {
  return /eventos_importantes|eventos_importantes_participantes|eventos_importantes_recordatorios/i.test(message);
}

function normalizeParticipantIds(value: unknown, ownId: number, isAdmin: boolean) {
  if (!isAdmin) return [ownId];
  const ids = Array.isArray(value)
    ? value.map(Number).filter((id) => Number.isSafeInteger(id) && id > 0)
    : [];
  return Array.from(new Set([ownId, ...ids]));
}

function validateEvent(payload: Record<string, unknown>) {
  const title = String(payload.title || "").trim();
  const eventKind = payload.event_kind === "internal_event" ? "internal_event" : "zoom_meeting";
  const startAt = new Date(String(payload.start_at || ""));
  const endAt = new Date(String(payload.end_at || ""));
  const meetingUrl = String(payload.meeting_url || "").trim();

  if (title.length < 3) throw new Error("Escribe un título de al menos 3 caracteres.");
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new Error("Selecciona una fecha y un horario válidos.");
  }
  if (endAt <= startAt) throw new Error("La hora de término debe ser posterior al inicio.");

  if (eventKind === "zoom_meeting") {
    let parsed: URL;
    try {
      parsed = new URL(meetingUrl);
    } catch {
      throw new Error("Ingresa un enlace de Zoom válido.");
    }
    if (parsed.protocol !== "https:" || !(parsed.hostname === "zoom.us" || parsed.hostname.endsWith(".zoom.us"))) {
      throw new Error("El enlace debe pertenecer a zoom.us y utilizar HTTPS.");
    }
  }

  return {
    title,
    eventKind,
    startAt,
    endAt,
    meetingUrl: eventKind === "zoom_meeting" ? meetingUrl : null,
    description: String(payload.description || "").trim() || null,
  };
}

async function replaceParticipantsAndReminders(
  supabase: any,
  eventId: string,
  participantIds: number[],
  creatorId: number,
  startAt: Date,
) {
  const { error: deleteParticipantsError } = await supabase
    .from("eventos_importantes_participantes")
    .delete()
    .eq("evento_importante_id", eventId);
  if (deleteParticipantsError) throw deleteParticipantsError;

  const { error: participantsError } = await supabase
    .from("eventos_importantes_participantes")
    .insert(
      participantIds.map((usuarioId) => ({
        evento_importante_id: eventId,
        usuario_id: usuarioId,
        participant_role: usuarioId === creatorId ? "organizer" : "attendee",
      })),
    );
  if (participantsError) throw participantsError;

  const { error: deleteRemindersError } = await supabase
    .from("eventos_importantes_recordatorios")
    .delete()
    .eq("evento_importante_id", eventId)
    .in("status", ["pending", "failed", "cancelled"]);
  if (deleteRemindersError) throw deleteRemindersError;

  const offsets = [30, 15, 5];
  const rows = participantIds.flatMap((usuarioId) =>
    offsets.map((minutesBefore) => ({
      evento_importante_id: eventId,
      usuario_id: usuarioId,
      minutes_before: minutesBefore,
      scheduled_for: new Date(startAt.getTime() - minutesBefore * 60_000).toISOString(),
      status: "pending",
      attempts: 0,
      claimed_at: null,
      sent_at: null,
      last_error: null,
      updated_at: new Date().toISOString(),
    })),
  );

  const { error: remindersError } = await supabase
    .from("eventos_importantes_recordatorios")
    .upsert(rows, { onConflict: "evento_importante_id,usuario_id,minutes_before" });
  if (remindersError) throw remindersError;
}

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session) return json({ error: "Sesión clínica vencida." }, { status: 401 });
  const ownId = parseUserId(session.id);
  if (!ownId) return json({ error: "El perfil no tiene un identificador válido." }, { status: 400 });

  try {
    const supabase = serverClient();
    const isAdmin = isAdministrativeRole(session.role);
    const [usersResult, eventsResult] = await Promise.all([
      supabase.from("usuarios").select("id, username, role, is_active").eq("is_active", true).order("username"),
      supabase.from("eventos_importantes").select(EVENT_COLUMNS).order("start_at", { ascending: true }),
    ]);

    let migrationRequired = false;
    let events: Record<string, unknown>[] = [];
    let participantRows: { evento_importante_id: string; usuario_id: number; participant_role: string }[] = [];

    if (eventsResult.error) {
      if (!isMissingMigration(eventsResult.error.message)) throw eventsResult.error;
      migrationRequired = true;
    } else {
      events = eventsResult.data || [];
      const participantsResult = await supabase
        .from("eventos_importantes_participantes")
        .select("evento_importante_id, usuario_id, participant_role");
      if (participantsResult.error) {
        if (!isMissingMigration(participantsResult.error.message)) throw participantsResult.error;
        migrationRequired = true;
      } else {
        participantRows = participantsResult.data || [];
      }
      const byEvent = new Map<string, number[]>();
      participantRows.forEach((row) => {
        const values = byEvent.get(row.evento_importante_id) || [];
        values.push(Number(row.usuario_id));
        byEvent.set(row.evento_importante_id, values);
      });
      events = events.map((row) => ({
        ...row,
        participant_ids: byEvent.get(String(row.id)) || [],
      }));
    }

    if (!isAdmin) {
      events = events.filter((row) => {
        const participantIds = Array.isArray(row.participant_ids) ? row.participant_ids.map(Number) : [];
        return Number(row.created_by_user_id) === ownId || participantIds.includes(ownId);
      });
    }

    return json({
      events,
      profiles: isAdmin
        ? usersResult.data || []
        : (usersResult.data || []).filter((profile: { id: number }) => Number(profile.id) === ownId),
      expedientes: [],
      currentUserId: ownId,
      isAdmin,
      migrationRequired,
      migrationFile: "supabase/migrations/20261019_eventos_importantes_push.sql",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible cargar los eventos importantes.";
    return json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = getSession(request);
  if (!session) return json({ error: "Sesión clínica vencida." }, { status: 401 });
  const ownId = parseUserId(session.id);
  if (!ownId) return json({ error: "El perfil no tiene un identificador válido." }, { status: 400 });

  try {
    const body = await request.json();
    const payload = (body?.payload || {}) as Record<string, unknown>;
    const parsed = validateEvent(payload);
    const isAdmin = isAdministrativeRole(session.role);
    const participantIds = normalizeParticipantIds(payload.participant_ids, ownId, isAdmin);
    const supabase = serverClient();

    if (isAdmin) {
      const { data: validProfiles, error: profilesError } = await supabase
        .from("usuarios")
        .select("id")
        .in("id", participantIds)
        .eq("is_active", true);
      if (profilesError) throw profilesError;
      if ((validProfiles || []).length !== participantIds.length) {
        return json({ error: "Uno de los perfiles seleccionados no está disponible." }, { status: 400 });
      }
    }

    const { data: event, error: eventError } = await supabase
      .from("eventos_importantes")
      .insert({
        event_kind: parsed.eventKind,
        title: parsed.title,
        description: parsed.description,
        meeting_url: parsed.meetingUrl,
        timezone: "America/Mexico_City",
        start_at: parsed.startAt.toISOString(),
        end_at: parsed.endAt.toISOString(),
        location: parsed.eventKind === "zoom_meeting" ? "En línea" : "Evento interno",
        status: "active",
        created_by_user_id: ownId,
      })
      .select(EVENT_COLUMNS)
      .single();
    if (eventError) throw eventError;

    try {
      await replaceParticipantsAndReminders(supabase, event.id, participantIds, ownId, parsed.startAt);
    } catch (error) {
      await supabase.from("eventos_importantes").delete().eq("id", event.id);
      throw error;
    }

    return json({ event: { ...event, participant_ids: participantIds } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible crear el evento.";
    const status = isMissingMigration(message) ? 409 : 500;
    return json({ error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  const session = getSession(request);
  if (!session) return json({ error: "Sesión clínica vencida." }, { status: 401 });
  const ownId = parseUserId(session.id);
  if (!ownId) return json({ error: "El perfil no tiene un identificador válido." }, { status: 400 });

  try {
    const body = await request.json();
    const eventId = String(body?.id || "").trim();
    if (!eventId) return json({ error: "Evento no válido." }, { status: 400 });
    const supabase = serverClient();
    const isAdmin = isAdministrativeRole(session.role);
    const { data: existing, error: existingError } = await supabase
      .from("eventos_importantes")
      .select(EVENT_COLUMNS)
      .eq("id", eventId)
      .single();
    if (existingError || !existing) return json({ error: "El evento no existe." }, { status: 404 });

    if (!isAdmin && Number(existing.created_by_user_id) !== ownId) {
      return json({ error: "Solo el organizador puede modificar este evento." }, { status: 403 });
    }

    if (body.action === "cancel") {
      const reason = String(body.reason || "").trim();
      if (reason.length < 5) {
        return json({ error: "Escribe un motivo de cancelación de al menos 5 caracteres." }, { status: 400 });
      }
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("eventos_importantes")
        .update({
          status: "cancelled",
          cancel_reason: reason,
          cancelled_at: now,
          cancelled_by_user_id: ownId,
          updated_at: now,
        })
        .eq("id", eventId)
        .select(EVENT_COLUMNS)
        .single();
      if (error) throw error;
      await supabase
        .from("eventos_importantes_recordatorios")
        .update({ status: "cancelled", updated_at: now })
        .eq("evento_importante_id", eventId)
        .in("status", ["pending", "failed"]);
      return json({ event: data });
    }

    const payload = (body?.payload || {}) as Record<string, unknown>;
    const parsed = validateEvent(payload);
    const participantIds = normalizeParticipantIds(payload.participant_ids, ownId, isAdmin);
    const { data, error } = await supabase
      .from("eventos_importantes")
      .update({
        event_kind: parsed.eventKind,
        title: parsed.title,
        description: parsed.description,
        meeting_url: parsed.meetingUrl,
        start_at: parsed.startAt.toISOString(),
        end_at: parsed.endAt.toISOString(),
        location: parsed.eventKind === "zoom_meeting" ? "En línea" : "Evento interno",
        status: "active",
        cancel_reason: null,
        cancelled_at: null,
        cancelled_by_user_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)
      .select(EVENT_COLUMNS)
      .single();
    if (error) throw error;
    await replaceParticipantsAndReminders(supabase, eventId, participantIds, ownId, parsed.startAt);
    return json({ event: { ...data, participant_ids: participantIds } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible actualizar el evento.";
    const status = isMissingMigration(message) ? 409 : 500;
    return json({ error: message }, { status });
  }
}
