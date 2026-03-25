import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      caller_name, caller_city, caller_email, caller_phone, caller_age,
      patient_name, patient_age, addiction_type, rehab_history,
      substances_consumed, patient_notes, 
      budget, payment_frequency, therapy_type
    } = data;

    // Validación básica
    if (!caller_name || !patient_name || !caller_phone) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // ── Insert into Supabase ──
    const { data: result, error } = await getSupabase()
      .from("preexpediente")
      .insert({
        caller_name: String(caller_name || "").trim(),
        caller_city: String(caller_city || "").trim(),
        caller_email: String(caller_email || "").trim(),
        caller_phone: String(caller_phone || "").trim(),
        caller_age: caller_age ? Number(caller_age) : null,
        
        patient_name: String(patient_name || "").trim(),
        patient_age: patient_age ? Number(patient_age) : null,
        addiction_type: String(addiction_type || "").trim(),
        rehab_history: String(rehab_history || "").trim(),
        substances_consumed: String(substances_consumed || "").trim(),
        patient_notes: String(patient_notes || "").trim(),
        
        budget: budget ? Number(budget) : null,
        payment_frequency: String(payment_frequency || "").trim(),
        therapy_type: String(therapy_type || "").trim(),
        payment_receipt_url: data.payment_receipt_url ? String(data.payment_receipt_url) : null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error (preexpediente):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { ok: true, result },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    console.error("Preexpediente API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
