import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const clinic_name = String(data?.clinic_name || "").trim();
    const owner_name = String(data?.owner_name || "").trim();
    const phone = String(data?.phone || "").trim();
    const location = String(data?.location || "").trim();

    if (!clinic_name || !owner_name || !phone || !location) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // ── Insert into Supabase ──
    const { data: result, error } = await getSupabase()
      .from("reclutamiento")
      .insert({
        clinic_name,
        owner_name,
        phone,
        location,
        status: "pendiente",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error (reclutamiento):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { ok: true, result },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    console.error("Reclutamiento API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
