import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Intentaremos con la llave anónima. Si las tablas tienen RLS, el usuario deberá proveer la ROLE_KEY o abrir lectura.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    // 1. Verificación básica de seguridad para que bots no manden correos vacíos
    const { searchParams } = new URL(req.url);
    if (searchParams.get('secret') !== 'CREI2024') {
       return NextResponse.json({ error: 'Acceso Denegado. Se requiere el secret cron.' }, { status: 401 });
    }

    // 2. Definir Fechas: Últimos 15 días
    const now = new Date();
    const past15Days = new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000));
    
    const endDate = now.toISOString().split('T')[0];
    const startDate = past15Days.toISOString().split('T')[0];

    // 3. Obtener Datos de Terapias y Finanzas
    // Asumimos que la columna de fecha principal es 'fecha' en la tabla 'terapias'
    const { data: terapias, error: terErr } = await supabase
      .from('terapias')
      .select('*, usuarios(username)')
      .gte('fecha', startDate)
      .lte('fecha', endDate);

    let tot = 0, cTot = 0, tTot = 0;
    if (terapias && terapias.length > 0) {
       terapias.forEach((r: any) => { 
           tot += +(r.monto || 0); 
           cTot += +(r.crei_monto || 0); 
           tTot += +(r.ter_monto || 0); 
       });
    }

    // 4. Obtener Datos de Calendario
    // Buscamos todas las citas agendadas en esta quincena. Columna 'date' o 'created_at' como fallback.
    const { data: calendario, error: calErr } = await supabase
      .from('calendario')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    let totalAppts = 0, completed = 0, cancelled = 0;
    if (calendario && calendario.length > 0) {
        totalAppts = calendario.length;
        completed = calendario.filter((a: any) => a.status === 'Completada' || a.status === 'completada').length;
        cancelled = calendario.filter((a: any) => a.status === 'Cancelada' || a.status === 'cancelada').length;
    }

    // 5. Configurar Transportes SMTP Separados
    // Ignoramos el process.env.SMTP_HOST porque está en Gmail en el .env.local,
    // pero las cuentas terapias@crei.mx y resumenfinanciero@crei.mx suelen estar en Hostinger.
    const shost = "smtp.hostinger.com"; 
    
    // Transporte para Calendario
    const transporterCal = nodemailer.createTransport({
      host: shost,
      port: 465,
      secure: true,
      auth: { user: "terapias@crei.mx", pass: "Terapias123." }
    });

    // Transporte para Finanzas
    const transporterFin = nodemailer.createTransport({
      host: shost,
      port: 465,
      secure: true,
      auth: { user: "resumenfinanciero@crei.mx", pass: "Resumen123." }
    });

    const toEmails = "lulu@crei.mx, mel@crei.mx";

    // 6. Construir Email Financiero (resumenfinanciero@)
    const htmlFinanzas = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfcff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background-color: #150b24; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Corte Financiero CREI</h1>
        </div>
        <div style="padding: 32px 24px;">
            <p style="font-size: 14px; background: #f8fafc; padding: 12px; border-radius: 6px; font-weight: 500;">
                📅 <b>${startDate}</b> al <b>${endDate}</b>
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                <tr>
                    <td style="padding: 12px; background: #f8fafc; border-radius: 6px 0 0 6px; font-size: 14px;">Ingreso Total Facturado:</td>
                    <td style="padding: 12px; background: #f8fafc; border-radius: 0 6px 6px 0; font-weight: 700; text-align: right;">$${tot.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; background: #f0fdf4; border-radius: 6px 0 0 6px; font-size: 14px;">Ingreso Neto (CREI):</td>
                    <td style="padding: 12px; background: #f0fdf4; border-radius: 0 6px 6px 0; font-weight: 800; text-align: right; color: #166534;">$${cTot.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; background: #faf5ff; border-radius: 6px 0 0 6px; font-size: 14px;">Comisiones Terapeutas:</td>
                    <td style="padding: 12px; background: #faf5ff; border-radius: 0 6px 6px 0; font-weight: 700; text-align: right; color: #7e22ce;">$${tTot.toFixed(2)}</td>
                </tr>
            </table>
        </div>
    </div>`;

    // 7. Construir Email Calendario (terapias@)
    const htmlCalendario = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfcff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background-color: #150b24; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">Reporte de Citas CREI</h1>
        </div>
        <div style="padding: 32px 24px;">
            <p style="font-size: 14px; background: #f8fafc; padding: 12px; border-radius: 6px; font-weight: 500;">
                📅 <b>${startDate}</b> al <b>${endDate}</b>
            </p>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
                <div style="flex: 1; padding: 16px; background: #f8fafc; border-radius: 8px; text-align: center;">
                    <span style="display: block; font-size: 24px; font-weight: 800; color: #0f172a;">${totalAppts}</span>
                    <span style="font-size: 12px; color: #64748b; font-weight: 600;">AGENDADAS</span>
                </div>
                <div style="flex: 1; padding: 16px; background: #f0fdfa; border-radius: 8px; text-align: center;">
                    <span style="display: block; font-size: 24px; font-weight: 800; color: #0f766e;">${completed}</span>
                    <span style="font-size: 12px; color: #14b8a6; font-weight: 600;">COMPLETADAS</span>
                </div>
                <div style="flex: 1; padding: 16px; background: #fff1f2; border-radius: 8px; text-align: center;">
                    <span style="display: block; font-size: 24px; font-weight: 800; color: #be123c;">${cancelled}</span>
                    <span style="font-size: 12px; color: #f43f5e; font-weight: 600;">CANCELADAS</span>
                </div>
            </div>
        </div>
    </div>`;

    // 8. Enviar ambos correos en paralelo
    const [infoCal, infoFin] = await Promise.all([
        transporterCal.sendMail({
            from: '"Calendario CREI" <terapias@crei.mx>',
            to: toEmails,
            subject: `🗓️ Reporte de Calendario Clínico (${startDate} al ${endDate})`,
            html: htmlCalendario
        }),
        transporterFin.sendMail({
            from: '"Finanzas CREI" <resumenfinanciero@crei.mx>',
            to: toEmails,
            subject: `💰 Corte Financiero Quincenal (${startDate} al ${endDate})`,
            html: htmlFinanzas
        })
    ]);

    return NextResponse.json({ 
        success: true, 
        message: 'Ambos reportes generados y enviados con éxito.',
        citas: { sent: true, messageId: infoCal.messageId },
        finanzas: { sent: true, messageId: infoFin.messageId }
    });

  } catch (error: any) {
    console.error('Error enviando cron:', error);
    return NextResponse.json({ error: 'Fallo el Cron Job', details: error.message }, { status: 500 });
  }
}
