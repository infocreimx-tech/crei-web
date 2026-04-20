import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // We can use anon key if RLS allows or Service Key

const sb = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellidos } = await req.json();

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido." }, { status: 400 });
    }

    // Insert directly into pacientes_fondos (No Auth required)
    const { data: newPatient, error: insertError } = await sb
      .from("pacientes_fondos")
      .insert([{ nombre: nombre.trim(), apellidos: apellidos?.trim() || "" }])
      .select()
      .single();

    if (insertError) {
      console.error("Insert Error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: newPatient
    }, { status: 201 });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await sb
      .from("pacientes_fondos")
      .select("*")
      .order("nombre");
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
