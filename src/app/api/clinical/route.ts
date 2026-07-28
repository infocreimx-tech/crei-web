import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { THERAPIST_COOKIE, verifyTherapistSession } from "@/lib/therapistSession";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Surrogate-Control": "no-store"
};

function clinicalJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  Object.entries(NO_STORE_HEADERS).forEach(([key, value]) => headers.set(key, value));
  return NextResponse.json(body, { ...init, headers });
}

const APPOINTMENT_LOCATION_ALIASES = {
  "Fuente de la Felicidad": "Fuente de la Felicidad",
  "Fuentes de la Felicidad": "Fuente de la Felicidad",
  Sacramento: "Sacramento",
  "En línea": "En línea"
} as const;

function serverClient() {
  const { url, adminKey } = getServerSupabaseConfig();
  if (!adminKey) throw new Error("Falta configurar la clave privada de Supabase en el servidor de producción.");
  return createClient(url, adminKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function sessionFrom(request: NextRequest) {
  return verifyTherapistSession(request.cookies.get(THERAPIST_COOKIE)?.value);
}

function unauthorized() {
  return clinicalJson({ error: "Sesión clínica vencida. Inicia sesión nuevamente." }, { status: 401 });
}

function normalizedUsername(value: unknown) {
  return String(value || "").trim().toLocaleLowerCase("es-MX");
}

function belongsToTherapist(assignedTherapist: unknown, sessionUsername: string) {
  const assigned = normalizedUsername(assignedTherapist);
  return !assigned || assigned === normalizedUsername(sessionUsername);
}

export async function GET(request: NextRequest) {
  const session = sessionFrom(request);
  if (!session) return unauthorized();
  try {
    const supabase = serverClient();
    const expedienteQuery = supabase.from("expediente").select("*").order("created_at", { ascending: false });
    // La tabla instalada utiliza updated_at y no created_at. Solicitar una
    // columna inexistente hacía fallar toda la respuesta y ocultaba también
    // los expedientes que sí estaban guardados correctamente.
    const citaQuery = supabase.from("calendario").select("id, expediente_id, therapist_id, start_at, end_at, notes, location, status, cancel_reason, updated_at").order("start_at", { ascending: true });
    const [expedienteResult, citaResult] = await Promise.all([expedienteQuery, citaQuery]);
    if (expedienteResult.error) throw expedienteResult.error;
    const allExpedientes = (expedienteResult.data || []).map((item) => ({
      ...item,
      // Los registros legacy sin valor explícito deben seguir disponibles.
      activo: item.activo !== false
    }));
    const expedientes = session.role === "admin"
      ? allExpedientes
      : allExpedientes.filter((item) => belongsToTherapist(item.terapeuta_asignado, session.username));
    const calendarRows = citaResult.error ? [] : (citaResult.data || []);
    const citas = session.role === "admin"
      ? calendarRows
      : calendarRows.filter((item) => String(item.therapist_id || "") === session.id);
    return clinicalJson({
      expedientes,
      citas,
      warning: citaResult.error ? `Los expedientes cargaron, pero Calendario no pudo actualizarse: ${citaResult.error.message}` : null
    });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "No fue posible cargar la información clínica.";
    return clinicalJson({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = sessionFrom(request);
  if (!session) return unauthorized();
  try {
    const body = await request.json();
    const supabase = serverClient();

    if (body.action === "saveExpediente") {
      const payload = {
        ...body.payload,
        terapeuta_asignado: session.username,
        therapist_user_id: null,
        activo: true
      };
      if (body.id) {
        const { data: existing, error: existingError } = await supabase
          .from("expediente")
          .select("terapeuta_asignado")
          .eq("id", body.id)
          .single();
        if (existingError || !existing) {
          return clinicalJson(
            { error: "El expediente no existe." },
            { status: 404 },
          );
        }
        if (session.role !== "admin") {
          if (!belongsToTherapist(existing.terapeuta_asignado, session.username)) return unauthorized();
        } else {
          // Consultar o editar como administrador no debe reasignar
          // accidentalmente el expediente al usuario administrador.
          payload.terapeuta_asignado =
            existing.terapeuta_asignado || session.username;
        }
        const { data, error } = await supabase.from("expediente").update(payload).eq("id", body.id).select().single();
        if (error) throw error;
        return clinicalJson({ data });
      }
      const { data, error } = await supabase.from("expediente").insert({ ...payload, folio: body.folio }).select().single();
      if (error) throw error;
      return clinicalJson({ data }, { status: 201 });
    }

    if (body.action === "setExpedienteActive") {
      const active = body.active === true;
      const expedienteId = String(body.id || "").trim();
      if (!expedienteId) return clinicalJson({ error: "Expediente no válido." }, { status: 400 });

      if (session.role !== "admin") {
        const { data: existing, error: existingError } = await supabase
          .from("expediente")
          .select("terapeuta_asignado")
          .eq("id", expedienteId)
          .single();
        if (existingError || !existing) return clinicalJson({ error: "El expediente no existe." }, { status: 404 });
        if (!belongsToTherapist(existing.terapeuta_asignado, session.username)) return unauthorized();
      }

      const { data, error } = await supabase
        .from("expediente")
        .update({ activo: active })
        .eq("id", expedienteId)
        .select()
        .single();
      if (error) throw error;
      return clinicalJson({ data });
    }

    if (body.action === "saveCita") {
      const appointment = body.payload || {};
      const requestedLocation = String(appointment.location || "").trim();
      const location = APPOINTMENT_LOCATION_ALIASES[
        requestedLocation as keyof typeof APPOINTMENT_LOCATION_ALIASES
      ];
      if (!location) {
        return clinicalJson({ error: "Selecciona una modalidad válida: Fuente de la Felicidad, Sacramento o En línea." }, { status: 400 });
      }
      const { data: expediente, error: expedienteError } = await supabase.from("expediente").select("id, activo, terapeuta_asignado").eq("id", appointment.expediente_id).single();
      if (expedienteError || !expediente || !expediente.activo) return clinicalJson({ error: "El expediente no existe o está inactivo." }, { status: 400 });
      if (session.role !== "admin" && !belongsToTherapist(expediente.terapeuta_asignado, session.username)) return unauthorized();
      let appointmentTherapistId = session.id;
      if (session.role === "admin" && expediente.terapeuta_asignado) {
        const { data: assignedTherapist } = await supabase
          .from("usuarios")
          .select("id")
          .ilike("username", expediente.terapeuta_asignado)
          .maybeSingle();
        if (assignedTherapist?.id) {
          appointmentTherapistId = String(assignedTherapist.id);
        }
      }
      const { data, error } = await supabase.from("calendario").insert({
        expediente_id: appointment.expediente_id,
        start_at: appointment.start_at,
        end_at: appointment.end_at || null,
        notes: appointment.notes || null,
        location,
        status: appointment.status || "active",
        id: crypto.randomUUID(),
        therapist_id: appointmentTherapistId,
        therapist_user_id: null
      }).select().single();
      if (error) throw error;
      return clinicalJson({ data }, { status: 201 });
    }

    if (body.action === "updateCitaStatus") {
      const status = String(body.status || "").toLowerCase();
      const cancelReason = String(body.cancel_reason || "").trim();
      if (status === "cancelled" && cancelReason.length < 5) {
        return clinicalJson({ error: "La razón de eliminación es obligatoria y debe tener al menos 5 caracteres." }, { status: 400 });
      }
      let query = supabase.from("calendario").update({ status, cancel_reason: status === "cancelled" ? cancelReason : null }).eq("id", body.id);
      if (session.role !== "admin") query = query.eq("therapist_id", session.id);
      const { data, error } = await query.select().single();
      if (error) throw error;
      return clinicalJson({ data });
    }

    return clinicalJson({ error: "Acción clínica no reconocida." }, { status: 400 });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "No fue posible guardar la información clínica.";
    console.error("Clinical API write error:", caught);
    return clinicalJson({ error: message }, { status: 500 });
  }
}
