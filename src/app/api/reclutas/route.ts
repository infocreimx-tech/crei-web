import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validar datos básicos
    const { nombre, apellidos, correo, telefono, puesto, enlace_cv, mensaje } = body;
    
    if (!nombre || !apellidos || !correo || !puesto) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Insertar en la tabla "reclutas" de Supabase
    const { data, error } = await supabase
      .from('reclutas')
      .insert([
        { 
          nombre, 
          apellidos, 
          correo, 
          telefono, 
          puesto, 
          enlace_cv, 
          mensaje,
          estado: 'Pendiente'
        }
      ]);

    if (error) {
      console.error('Error al insertar recluta en Supabase:', error);
      return NextResponse.json(
        { error: 'Error al procesar la solicitud en la base de datos' },
        { status: 500 }
      );
    }

    // Aquí podríamos posteriormente agregar envío de correos, notificaciones a RRHH, etc.

    return NextResponse.json(
      { message: 'Solicitud recibida exitosamente', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error procesando request de reclutas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
