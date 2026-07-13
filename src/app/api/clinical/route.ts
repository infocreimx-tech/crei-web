import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { THERAPIST_COOKIE, verifyTherapistSession } from "@/lib/therapistSession";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const APPOINTMENT_LOCATIONS = ["Fuentes de la Felicidad", "Sacramento", "En línea"] as const;

function serverClient() {
  const { url, adminKey } = getServerSupabaseConfig();
  if (!adminKey) throw new Error("Falta configurar la clave privada de Supabase en el servidor de producción.");
  return createClient(url, adminKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function sessionFrom(request: NextRequest) {
  return verifyTherapistSession(request.cookies.get(THERAPIST_COOKIE)?.value);
}

function unauthorized() {
  return NextResponse.json({ error: "Sesión clínica vencida. Inicia sesión nuevamente." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const session = sessionFrom(request);
  if (!session) return unauthorized();
  try {
    const supabase = serverClient();
    const expedienteQuery = supabase.from("expediente").select("*").order("created_at", { ascending: false });
    const citaQuery = supabase.from("calendario").select("id, expediente_id, therapist_id, start_at, end_at, notes, location, status, cancel_reason").order("start_at", { ascending: true });
    const [expedienteResult, citaResult] = await Promise.all([expedienteQuery, citaQuery]);
    if (expedienteResult.error) throw expedienteResult.error;
    if (citaResult.error) throw citaResult.error;
    const expedientes = session.role === "admin"
      ? expedienteResult.data || []
      : (expedienteResult.data || []).filter((item) => !item.terapeuta_asignado || item.terapeuta_asignado === session.username);
    const citas = session.role === "admin"
      ? citaResult.data || []
      : (citaResult.data || []).filter((item) => String(item.therapist_id || "") === session.id);
    return NextResponse.json({ expedientes, citas });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "No fue posible cargar la información clínica.";
    return NextResponse.json({ error: message }, { status: 500 });
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
        if (session.role !== "admin") {
          const { data: existing } = await supabase.from("expediente").select("terapeuta_asignado").eq("id", body.id).single();
          if (existing?.terapeuta_asignado && existing.terapeuta_asignado !== session.username) return unauthorized();
        }
        const { data, error } = await supabase.from("expediente").update(payload).eq("id", body.id).select().single();
        if (error) throw error;
        return NextResponse.json({ data });
      }
      const { data, error } = await supabase.from("expediente").insert({ ...payload, folio: body.folio }).select().single();
      if (error) throw error;
      return NextResponse.json({ data }, { status: 201 });
    }

    if (body.action === "saveCita") {
      const appointment = body.payload || {};
      const location = String(appointment.location || "").trim();
      if (!APPOINTMENT_LOCATIONS.includes(location as (typeof APPOINTMENT_LOCATIONS)[number])) {
        return NextResponse.json({ error: "Selecciona una modalidad válida: Fuentes de la Felicidad, Sacramento o En línea." }, { status: 400 });
      }
      const { data: expediente, error: expedienteError } = await supabase.from("expediente").select("id, activo, terapeuta_asignado").eq("id", appointment.expediente_id).single();
      if (expedienteError || !expediente || !expediente.activo) return NextResponse.json({ error: "El expediente no existe o está inactivo." }, { status: 400 });
      if (session.role !== "admin" && expediente.terapeuta_asignado && expediente.terapeuta_asignado !== session.username) return unauthorized();
      const { data, error } = await supabase.from("calendario").insert({
        expediente_id: appointment.expediente_id,
        start_at: appointment.start_at,
        end_at: appointment.end_at || null,
        notes: appointment.notes || null,
        location,
        status: appointment.status || "active",
        id: crypto.randomUUID(),
        therapist_id: session.id,
        therapist_user_id: null
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ data }, { status: 201 });
    }

    if (body.action === "updateCitaStatus") {
      const status = String(body.status || "").toLowerCase();
      const cancelReason = String(body.cancel_reason || "").trim();
      if (status === "cancelled" && cancelReason.length < 5) {
        return NextResponse.json({ error: "La razón de eliminación es obligatoria y debe tener al menos 5 caracteres." }, { status: 400 });
      }
      let query = supabase.from("calendario").update({ status, cancel_reason: status === "cancelled" ? cancelReason : null }).eq("id", body.id);
      if (session.role !== "admin") query = query.eq("therapist_id", session.id);
      const { data, error } = await query.select().single();
      if (error) throw error;
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Acción clínica no reconocida." }, { status: 400 });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "No fue posible guardar la información clínica.";
    console.error("Clinical API write error:", caught);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
