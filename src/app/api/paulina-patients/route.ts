import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  THERAPIST_COOKIE,
  verifyTherapistSession,
} from "@/lib/therapistSession";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";
import { isAdministrativeRole } from "@/lib/portalRoles";

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

function hasRegistryAccess(session: {
  username: string;
  role: "superadmin" | "admin" | "therapist";
}) {
  return isAdministrativeRole(session.role) || isPaulina(session.username);
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

function isMissingRegistryColumnsError(
  error: { code?: string; message?: string } | null,
) {
  return (
    error?.code === "PGRST204" ||
    error?.code === "42703" ||
    Boolean(
      error?.message &&
        [
          "dia",
          "hora",
          "quien_pago",
          "fecha_pago",
          "monto_acordado",
          "monto_pagado",
          "forma_pago",
          "terapeuta_atencion",
        ].some((column) => error.message?.includes(column)),
    )
  );
}

function missingSchemaResponse() {
  return registryJson(
    {
      error:
        "Falta actualizar el registro con los campos de pago y atención. Ejecuta el SQL de la nueva migración en Supabase.",
      code: "REGISTRY_COLUMNS_NOT_READY",
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
  if (!hasRegistryAccess(session)) return unauthorized();

  try {
    const supabase = serverClient();
    let query = supabase
      .from("registro_pacientes_paulina")
      .select(
        "id,nombre,ciudad,telefono,sexo,dia,hora,quien_pago,fecha_pago,monto_acordado,monto_pagado,forma_pago,terapeuta_atencion,created_at,updated_at",
      )
      .order("created_at", { ascending: false });

    if (!isAdministrativeRole(session.role)) {
      query = query
        .eq("terapeuta_id", session.id)
        .eq("terapeuta_username", session.username);
    }

    const [patientsResult, therapistsResult] = await Promise.all([
      query,
      supabase
        .from("usuarios")
        .select("id,username,role,is_active")
        .eq("is_active", true)
        .order("username", { ascending: true }),
    ]);
    const { data, error } = patientsResult;

    if (error) {
      if (isMissingRegistryColumnsError(error)) {
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
    if (therapistsResult.error) throw therapistsResult.error;

    const therapists = (therapistsResult.data || [])
      .filter(
        (therapist) =>
          !isAdministrativeRole(therapist.role) &&
          Boolean(therapist.username?.trim()),
      )
      .map((therapist) => ({
        id: String(therapist.id),
        username: therapist.username.trim(),
      }));

    return registryJson({ patients: data || [], therapists });
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
  if (!isPaulina(session.username)) {
    return registryJson(
      {
        error:
          "La vista administrativa es de consulta. Sólo Paulina puede crear registros en este programa.",
      },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const nombre = String(body?.nombre || "").trim();
    const ciudad = String(body?.ciudad || "").trim();
    const telefono = String(body?.telefono || "").trim();
    const sexo = String(body?.sexo || "").trim().toLocaleLowerCase("es-MX");
    const dia = String(body?.dia || "").trim();
    const hora = String(body?.hora || "").trim();
    const quienPago = String(body?.quien_pago || "").trim();
    const fechaPago = String(body?.fecha_pago || "").trim();
    const montoAcordadoRaw = String(body?.monto_acordado ?? "").trim();
    const montoPagadoRaw = String(body?.monto_pagado ?? "").trim();
    const montoAcordado = Number(montoAcordadoRaw);
    const montoPagado = Number(montoPagadoRaw);
    const formaPago = String(body?.forma_pago || "")
      .trim()
      .toLocaleLowerCase("es-MX");
    const terapeutaAtencion = String(body?.terapeuta_atencion || "").trim();

    if (
      !nombre ||
      !ciudad ||
      !telefono ||
      !sexo ||
      !dia ||
      !hora ||
      !quienPago ||
      !fechaPago ||
      !montoAcordadoRaw ||
      !montoPagadoRaw ||
      !formaPago ||
      !terapeutaAtencion
    ) {
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

    if (quienPago.length < 2 || quienPago.length > 120) {
      return registryJson(
        { error: "El nombre de quien pagó debe tener entre 2 y 120 caracteres." },
        { status: 400 },
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaPago)) {
      return registryJson(
        { error: "Selecciona una fecha de pago válida." },
        { status: 400 },
      );
    }
    const parsedPaymentDay = new Date(`${fechaPago}T12:00:00Z`);
    if (
      Number.isNaN(parsedPaymentDay.getTime()) ||
      parsedPaymentDay.toISOString().slice(0, 10) !== fechaPago
    ) {
      return registryJson(
        { error: "Selecciona una fecha de pago válida." },
        { status: 400 },
      );
    }
    if (
      !Number.isFinite(montoAcordado) ||
      montoAcordado < 0 ||
      montoAcordado > 99_999_999.99
    ) {
      return registryJson(
        { error: "Escribe un monto acordado válido." },
        { status: 400 },
      );
    }
    if (
      !Number.isFinite(montoPagado) ||
      montoPagado < 0 ||
      montoPagado > 99_999_999.99
    ) {
      return registryJson(
        { error: "Escribe una cantidad pagada válida." },
        { status: 400 },
      );
    }
    if (
      !["efectivo", "transferencia", "tarjeta", "deposito", "otro"].includes(
        formaPago,
      )
    ) {
      return registryJson(
        { error: "Selecciona una forma de pago válida." },
        { status: 400 },
      );
    }
    if (terapeutaAtencion.length < 2 || terapeutaAtencion.length > 120) {
      return registryJson(
        { error: "El nombre del terapeuta debe tener entre 2 y 120 caracteres." },
        { status: 400 },
      );
    }

    const supabase = serverClient();
    const { data, error } = await supabase
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
        quien_pago: quienPago,
        fecha_pago: fechaPago,
        monto_acordado: montoAcordado,
        monto_pagado: montoPagado,
        forma_pago: formaPago,
        terapeuta_atencion: terapeutaAtencion,
      })
      .select(
        "id,nombre,ciudad,telefono,sexo,dia,hora,quien_pago,fecha_pago,monto_acordado,monto_pagado,forma_pago,terapeuta_atencion,created_at,updated_at",
      )
      .single();

    if (error) {
      if (isMissingRegistryColumnsError(error)) {
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
