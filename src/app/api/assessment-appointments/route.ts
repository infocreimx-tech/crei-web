import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MEXICO_CITY_OFFSET = "-06:00";
const CREI_OFFICE_ADDRESS =
  "Sacramento 521, Insurgentes San Borja, Benito Juárez, 03100 Ciudad de México, CDMX";
const MONDAY_TO_THURSDAY_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
const FRIDAY_TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "PGRST205" ||
    error?.code === "42P01" ||
    error?.message?.includes("Could not find the table")
  );
}

function isValidCalendarDate(fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;

  const [year, month, day] = fecha.split("-").map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));

  return (
    calendarDate.getUTCFullYear() === year &&
    calendarDate.getUTCMonth() === month - 1 &&
    calendarDate.getUTCDate() === day
  );
}

function isWeekday(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday >= 1 && weekday <= 5;
}

function getValidTimes(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  if (weekday >= 1 && weekday <= 4) return MONDAY_TO_THURSDAY_TIMES;
  if (weekday === 5) return FRIDAY_TIMES;
  return [];
}

export async function GET(request: NextRequest) {
  try {
    const fecha = String(request.nextUrl.searchParams.get("fecha") || "").trim();

    if (!isValidCalendarDate(fecha)) {
      return NextResponse.json(
        { error: "Selecciona una fecha válida." },
        { status: 400 },
      );
    }
    if (!isWeekday(fecha)) {
      return NextResponse.json(
        { error: "No se pueden agendar valoraciones los sábados ni domingos." },
        { status: 400 },
      );
    }

    const dayStart = new Date(`${fecha}T00:00:00${MEXICO_CITY_OFFSET}`);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const supabase = getServerClient();

    const { data, error } = await supabase
      .from("citas_valoracion")
      .select("inicio")
      .gte("inicio", dayStart.toISOString())
      .lt("inicio", dayEnd.toISOString())
      .in("estado", ["pendiente", "confirmada"]);

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            error:
              "La agenda de valoración aún no está activada. Ejecuta el SQL incluido en supabase/migrations.",
          },
          { status: 503 },
        );
      }
      throw error;
    }

    const occupiedTimes = getValidTimes(fecha).filter((time) => {
      const slot = new Date(`${fecha}T${time}:00${MEXICO_CITY_OFFSET}`);
      return data?.some(
        (appointment) =>
          new Date(appointment.inicio).getTime() === slot.getTime(),
      );
    });

    return NextResponse.json(
      { fecha, occupiedTimes },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (caught) {
    console.error("Assessment availability error:", caught);
    return NextResponse.json(
      {
        error:
          caught instanceof Error
            ? caught.message
            : "No fue posible consultar los horarios disponibles.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nombre = String(body?.nombre || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const telefono = String(body?.telefono || "").trim();
    const fecha = String(body?.fecha || "").trim();
    const hora = String(body?.hora || "").trim();
    const modalidad = String(body?.modalidad || "").trim();
    const motivo = String(body?.motivo || "").trim();
    const consentimiento = body?.consentimiento === true;

    if (!nombre || !email || !telefono || !fecha || !hora || !modalidad) {
      return NextResponse.json(
        { error: "Completa todos los campos requeridos." },
        { status: 400 },
      );
    }
    if (nombre.length < 2 || nombre.length > 80) {
      return NextResponse.json(
        { error: "El nombre debe tener entre 2 y 80 caracteres." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
      return NextResponse.json(
        { error: "Escribe un correo electrónico válido." },
        { status: 400 },
      );
    }
    if (telefono.length < 8 || telefono.length > 30) {
      return NextResponse.json(
        { error: "Escribe un teléfono válido." },
        { status: 400 },
      );
    }
    if (!isValidCalendarDate(fecha)) {
      return NextResponse.json(
        { error: "Selecciona una fecha y hora válidas." },
        { status: 400 },
      );
    }
    if (!isWeekday(fecha)) {
      return NextResponse.json(
        { error: "No se pueden agendar valoraciones los sábados ni domingos." },
        { status: 400 },
      );
    }
    if (!getValidTimes(fecha).includes(hora)) {
      return NextResponse.json(
        {
          error:
            "Selecciona un horario válido: lunes a jueves de 09:00 a 17:00 o viernes de 09:00 a 14:00.",
        },
        { status: 400 },
      );
    }
    if (!["presencial", "videollamada"].includes(modalidad)) {
      return NextResponse.json(
        { error: "Selecciona una modalidad válida." },
        { status: 400 },
      );
    }
    if (!consentimiento) {
      return NextResponse.json(
        { error: "Debes aceptar el aviso de privacidad." },
        { status: 400 },
      );
    }
    if (motivo.length > 1000) {
      return NextResponse.json(
        { error: "El motivo no puede superar 1000 caracteres." },
        { status: 400 },
      );
    }

    const inicio = new Date(`${fecha}T${hora}:00${MEXICO_CITY_OFFSET}`);
    if (Number.isNaN(inicio.getTime()) || inicio.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "La cita debe programarse en una fecha futura." },
        { status: 400 },
      );
    }

    const maximumDate = new Date();
    maximumDate.setMonth(maximumDate.getMonth() + 6);
    if (inicio > maximumDate) {
      return NextResponse.json(
        { error: "La valoración puede reservarse con hasta seis meses de anticipación." },
        { status: 400 },
      );
    }

    const fin = new Date(inicio.getTime() + 60 * 60 * 1000);
    const supabase = getServerClient();

    const { data: occupied, error: occupiedError } = await supabase
      .from("citas_valoracion")
      .select("id")
      .eq("inicio", inicio.toISOString())
      .in("estado", ["pendiente", "confirmada"])
      .limit(1);

    if (occupiedError) {
      if (isMissingTableError(occupiedError)) {
        return NextResponse.json(
          {
            error:
              "La agenda de valoración aún no está activada. Ejecuta el SQL incluido en supabase/migrations.",
          },
          { status: 503 },
        );
      }
      throw occupiedError;
    }

    if (occupied?.length) {
      return NextResponse.json(
        { error: "Ese horario ya está ocupado. Elige otra hora." },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("citas_valoracion")
      .insert({
        nombre,
        email,
        telefono,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        modalidad,
        ubicacion:
          modalidad === "presencial" ? CREI_OFFICE_ADDRESS : "Videollamada",
        zona_horaria: "America/Mexico_City",
        motivo: motivo || null,
        consentimiento_privacidad: true,
        estado: "pendiente",
      })
      .select("id,inicio,fin,modalidad,estado")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ese horario acaba de ser reservado. Elige otra hora." },
          { status: 409 },
        );
      }
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            error:
              "La agenda de valoración aún no está activada. Ejecuta el SQL incluido en supabase/migrations.",
          },
          { status: 503 },
        );
      }
      throw error;
    }

    return NextResponse.json(
      {
        ok: true,
        appointment: {
          id: data.id,
          inicio: data.inicio,
          fin: data.fin,
          modalidad: data.modalidad,
          estado: data.estado,
        },
      },
      { status: 201 },
    );
  } catch (caught) {
    console.error("Assessment appointment error:", caught);
    return NextResponse.json(
      {
        error:
          caught instanceof Error
            ? caught.message
            : "No fue posible guardar la cita de valoración.",
      },
      { status: 500 },
    );
  }
}
