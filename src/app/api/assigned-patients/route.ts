import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseConfig } from "@/lib/serverSupabaseConfig";
import {
  THERAPIST_COOKIE,
  verifyTherapistSession,
} from "@/lib/therapistSession";
import { isAssignableTherapistUsername } from "@/lib/assignableTherapists";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const headers = {
  "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
};

function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...headers, ...Object.fromEntries(new Headers(init?.headers)) },
  });
}

export async function GET(request: NextRequest) {
  const session = verifyTherapistSession(
    request.cookies.get(THERAPIST_COOKIE)?.value,
  );

  if (!session) {
    return json(
      { error: "Tu sesión venció. Inicia sesión nuevamente." },
      { status: 401 },
    );
  }
  if (!isAssignableTherapistUsername(session.username)) {
    return json(
      { error: "Esta bandeja está disponible únicamente para terapeutas." },
      { status: 403 },
    );
  }

  try {
    const { url, adminKey } = getServerSupabaseConfig();
    if (!adminKey) throw new Error("Falta configurar Supabase en el servidor.");
    const supabase = createClient(url, adminKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("registro_pacientes_paulina")
      .select(
        "id,nombre,ciudad,telefono,sexo,dia,hora,terapeuta_atencion,created_at",
      )
      .ilike("terapeuta_atencion", session.username)
      .order("created_at", { ascending: false });

    if (error) throw error;
    const patients = data || [];
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newCount = patients.filter(
      (patient) => new Date(patient.created_at).getTime() >= sevenDaysAgo,
    ).length;

    return json({
      patients,
      total: patients.length,
      newCount,
      therapist: session.username,
    });
  } catch (caught) {
    return json(
      {
        error:
          caught instanceof Error
            ? caught.message
            : "No fue posible cargar los pacientes asignados.",
      },
      { status: 500 },
    );
  }
}
