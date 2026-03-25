import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

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

    // ── Email notification ──
    let emailAccepted = false;
    const shost = process.env.SMTP_HOST || "";
    const sport = Number(process.env.SMTP_PORT || 0);
    const suser = process.env.SMTP_USER || "";
    const spass = process.env.SMTP_PASS || "";
    const mailTo = process.env.MAIL_TO || suser;
    const mailFrom = process.env.MAIL_FROM || suser || "noreply@crei.mx";

    if (shost && sport && suser && spass && mailTo) {
      try {
        const transporter = nodemailer.createTransport({
          host: shost,
          port: sport,
          secure: sport === 465,
          auth: { user: suser, pass: spass },
        });

        const subject = "Nueva Solicitud de Alianza Estratégica — CREI";

        const text = [
          `Clínica: ${clinic_name}`,
          `Contacto: ${owner_name}`,
          `Teléfono: ${phone}`,
          `Ubicación: ${location}`,
        ].join("\n");

        const html = `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px">
            <h2 style="color:#6b21a8;margin-top:0">Nueva Solicitud de Alianza Estratégica</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666">Clínica</td><td style="padding:8px 0;font-weight:600">${clinic_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Contacto</td><td style="padding:8px 0">${owner_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Teléfono</td><td style="padding:8px 0"><a href="tel:${phone}">${phone}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666">Ubicación</td><td style="padding:8px 0">${location}</td></tr>
            </table>
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5">
            <p style="font-size:12px;color:#999;margin:0">Enviado desde crei.mx</p>
          </div>`;

        const info = await transporter.sendMail({
          from: mailFrom,
          to: mailTo,
          subject,
          text,
          html,
        });
        emailAccepted = Array.isArray(info.accepted) && info.accepted.length > 0;
      } catch (emailErr) {
        console.error("Email send error (reclutamiento):", emailErr);
      }
    }

    return NextResponse.json(
      { ok: true, result, emailAccepted },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    console.error("Reclutamiento API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
