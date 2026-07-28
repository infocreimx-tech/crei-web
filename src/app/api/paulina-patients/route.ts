import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  THERAPIST_COOKIE,
  verifyTherapistSession,
} from "@/lib/therapistSession";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Surrogate-Control": "no-store",
};

function registryJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  Object.entries(NO_STORE_HEADERS).forEach(([key, value]) =>
    headers.set(key, value),
  );
  return NextResponse.json(body, { ...init, headers });
}

function serverClient() {
  const { url, adminKey } = getServerSupabaseConfig();
  if (!adminKey) {
    throw new Error(
      "Falta configurar la clave privada de Supabase en el servidor.",
    );
  }
  return createClient(url, adminKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function sessionFrom(request: NextRequest) {
  return verifyTherapistSession(
    request.cookies.get(THERAPIST_COOKIE)?.value,
  );
}

function isPaulina(username: string) {
  return username.trim().toLocaleLowerCase("es-MX") === "paulina";
}

function unauthorized() {
  return registryJson(
    { error: "Este programa está disponible únicamente para Paulina." },
    { status: 403 },
  );
}

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "PGRST205" ||
    error?.code === "42P01" ||
    error?.message?.includes("Could not find the table")
  );
}

function isMissingScheduleColumnsError(
  error: { code?: string; message?: string } | null,
) {
  return (
    error?.code === "PGRST204" ||
    error?.code === "42703" ||
    Boolean(
      error?.message &&
        (error.message.includes("'dia' column") ||
          error.message.includes("'hora' column") ||
          error.message.includes("column dia") ||
          error.message.includes("column hora")),
    )
  );
}

function missingSchemaResponse() {
  return registryJson(
    {
      error:
        "Falta actualizar el registro con los campos de día y hora. Ejecuta el SQL de la nueva migración en Supabase.",
      code: "SCHEDULE_COLUMNS_NOT_READY",
    },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  const session = sessionFrom(request);
  if (!session) {
    return registryJson(
      { error: "Tu sesión venció. Inicia sesión nuevamente." },
      { status: 401 },
    );
  }
  if (!isPaulina(session.username)) return unauthorized();

  try {
    const { data, error } = await serverClient()
      .from("registro_pacientes_paulina")
      .select(
        "id,nombre,ciudad,telefono,sexo,dia,hora,created_at,updated_at",
      )
      .eq("terapeuta_id", session.id)
      .eq("terapeuta_username", session.username)
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingScheduleColumnsError(error)) {
        return missingSchemaResponse();
      }
      if (isMissingTableError(error)) {
        return registryJson(
          {
            error:
              "El registro de Paulina aún no está conectado. Ejecuta el SQL de la migración en Supabase.",
            code: "TABLE_NOT_READY",
          },
          { status: 503 },
        );
      }
      throw error;
    }

    return registryJson({ patients: data || [] });
  } catch (caught) {
    const message =
      caught instanceof Error
        ? caught.message
        : "No fue posible cargar los registros.";
    return registryJson({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = sessionFrom(request);
  if (!session) {
    return registryJson(
      { error: "Tu sesión venció. Inicia sesión nuevamente." },
      { status: 401 },
    );
  }
  if (!isPaulina(session.username)) return unauthorized();

  try {
    const body = await request.json();
    const nombre = String(body?.nombre || "").trim();
    const ciudad = String(body?.ciudad || "").trim();
    const telefono = String(body?.telefono || "").trim();
    const sexo = String(body?.sexo || "").trim().toLocaleLowerCase("es-MX");
    const dia = String(body?.dia || "").trim();
    const hora = String(body?.hora || "").trim();

    if (!nombre || !ciudad || !telefono || !sexo || !dia || !hora) {
      return registryJson(
        { error: "Completa todos los campos del registro." },
        { status: 400 },
      );
    }
    if (nombre.length < 2 || nombre.length > 120) {
      return registryJson(
        { error: "El nombre debe tener entre 2 y 120 caracteres." },
        { status: 400 },
      );
    }
    if (ciudad.length < 2 || ciudad.length > 100) {
      return registryJson(
        { error: "La ciudad debe tener entre 2 y 100 caracteres." },
        { status: 400 },
      );
    }
    if (
      telefono.length < 8 ||
      telefono.length > 30 ||
      !/^[0-9+().\-\s]+$/.test(telefono)
    ) {
      return registryJson(
        { error: "Escribe un número telefónico válido." },
        { status: 400 },
      );
    }
    if (!["hombre", "mujer"].includes(sexo)) {
      return registryJson(
        { error: "Selecciona Hombre o Mujer." },
        { status: 400 },
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) {
      return registryJson(
        { error: "Selecciona un día válido." },
        { status: 400 },
      );
    }
    const parsedDay = new Date(`${dia}T12:00:00Z`);
    if (
      Number.isNaN(parsedDay.getTime()) ||
      parsedDay.toISOString().slice(0, 10) !== dia
    ) {
      return registryJson(
        { error: "Selecciona un día válido." },
        { status: 400 },
      );
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
      return registryJson(
        { error: "Selecciona una hora válida." },
        { status: 400 },
      );
    }

    const { data, error } = await serverClient()
      .from("registro_pacientes_paulina")
      .insert({
        terapeuta_id: session.id,
        terapeuta_username: session.username,
        nombre,
        ciudad,
        telefono,
        sexo,
        dia,
        hora,
      })
      .select(
        "id,nombre,ciudad,telefono,sexo,dia,hora,created_at,updated_at",
      )
      .single();

    if (error) {
      if (isMissingScheduleColumnsError(error)) {
        return missingSchemaResponse();
      }
      if (isMissingTableError(error)) {
        return registryJson(
          {
            error:
              "El registro de Paulina aún no está conectado. Ejecuta el SQL de la migración en Supabase.",
            code: "TABLE_NOT_READY",
          },
          { status: 503 },
        );
      }
      throw error;
    }

    return registryJson({ patient: data }, { status: 201 });
  } catch (caught) {
    const message =
      caught instanceof Error
        ? caught.message
        : "No fue posible guardar el registro.";
    return registryJson({ error: message }, { status: 500 });
  }
}
