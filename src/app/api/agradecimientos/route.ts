import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://uywihjppwzrrfjkguvot.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "PGRST205" ||
    error?.message?.includes("Could not find the table")
  );
}

export async function GET() {
  try {
    const [{ data: destacados, error: destacadosError }, { data: mensajes, error: mensajesError }] =
      await Promise.all([
        supabase
          .from("agradecimientos")
          .select("id,nombre,mensaje,ciudad,destacado,created_at")
          .eq("aprobado", true)
          .eq("destacado", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("agradecimientos")
          .select("id,nombre,mensaje,ciudad,destacado,created_at")
          .eq("aprobado", true)
          .eq("destacado", false)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

    const error = destacadosError || mensajesError;
    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ destacados: [], mensajes: [] });
      }
      console.error("Agradecimientos load error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      destacados: destacados || [],
      mensajes: mensajes || [],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    console.error("Agradecimientos GET error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nombre = String(body?.nombre || "").trim();
    const mensaje = String(body?.mensaje || "").trim();
    const ciudad = String(body?.ciudad || "").trim();
    const email = String(body?.email || "").trim();

    if (!nombre || !mensaje) {
      return NextResponse.json(
        { error: "Por favor escribe tu nombre y mensaje." },
        { status: 400 }
      );
    }

    if (mensaje.length < 10) {
      return NextResponse.json(
        { error: "El mensaje debe tener al menos 10 caracteres." },
        { status: 400 }
      );
    }

    if (nombre.length > 80 || ciudad.length > 60 || email.length > 120 || mensaje.length > 600) {
      return NextResponse.json(
        { error: "Uno de los campos supera la longitud permitida." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "El email no tiene un formato válido." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("agradecimientos")
      .insert({
        nombre,
        mensaje,
        ciudad: ciudad || null,
        email: email || null,
        aprobado: true,
        destacado: false,
      })
      .select("id,nombre,mensaje,ciudad,destacado,created_at")
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          { error: "La sección de agradecimientos necesita activar su tabla en Supabase." },
          { status: 503 }
        );
      }
      console.error("Agradecimientos insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, mensaje: data }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    console.error("Agradecimientos POST error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
