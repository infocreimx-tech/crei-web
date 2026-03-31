import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { field, value, excludeId } = body;

    if (!field || !value) {
      return NextResponse.json({ error: 'Faltan parámetros field y value' }, { status: 400 });
    }

    // Normalización base (espacios)
    const normalizedValue = String(value).trim();
    
    // Convertir vocales con/sin acento a comodines (_) para ignorar acentuaciones en base de datos.
    // Ej: "Martín" -> "M_rt_n", "Pérez" -> "P_r_z"
    // .ilike ya ignora mayúsculas/minúsculas.
    const wildcardValue = normalizedValue
      .replace(/[aáàäâAÁÀÄÂ]/g, '_')
      .replace(/[eéèëêEÉÈËÊ]/g, '_')
      .replace(/[iíìïîIÍÌÏÎ]/g, '_')
      .replace(/[oóòöôOÓÒÖÔ]/g, '_')
      .replace(/[uúùüûUÚÙÜÛ]/g, '_');

    const tables = ['preexpediente', 'expediente', 'calendario', 'terapias', 'comprobante'];
    let duplicateFound: string | null = null;

    const checks = tables.map(async (table) => {
      try {
         // ilike es "Case Insensitive" (ignora mayúsculas y minúsculas nativamente en PostgreSQL)
         let query = supabase.from(table).select('folio, patient_name').ilike(field, wildcardValue).limit(1);
         if (excludeId) query = query.neq('id', excludeId);
         
         const { data, error } = await query;
         
         if (!error && data && data.length > 0) {
           return table;
         }
      } catch (e) {
         return null;
      }
      return null;
    });

    const results = await Promise.all(checks);
    for (const res of results) {
      if (res) {
        duplicateFound = res;
        break;
      }
    }

    return NextResponse.json({
      isDuplicate: !!duplicateFound,
      module: duplicateFound ? duplicateFound.toUpperCase() : null
    });

  } catch (error: any) {
    console.error('Error validando duplicado:', error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}
