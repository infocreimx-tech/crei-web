import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

const SERVICE_LABELS: Record<string, string> = {
  individual: "Terapia Individual",
  couple: "Terapia de Pareja",
  psychiatry: "Psiquiatría",
  group: "Grupo de Apoyo",
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const full_name = String(data?.nombre || "").trim();
    const email = String(data?.email || "").trim();
    const phone = String(data?.telefono || "").trim();
    const service = String(data?.servicio || "").trim();
    const message = String(data?.mensaje || "").trim() || null;
    const privacy_consent = data?.consentimiento !== 0;

    if (!full_name || !email || !phone || !service) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const validServices = ["individual", "couple", "psychiatry", "group"];
    if (!validServices.includes(service)) {
      return NextResponse.json(
        { error: "Servicio no válido" },
        { status: 400 }
      );
    }

    // ── Insert into Supabase ──
    const { data: result, error } = await getSupabase()
      .from("appointments")
      .insert({
        full_name,
        email,
        phone,
        service,
        message,
        privacy_consent,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
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

        const serviceLabel = SERVICE_LABELS[service] || service;
        const subject = "Nueva solicitud de cita — CREI";

        const text = [
          `Nombre: ${full_name}`,
          `Email: ${email}`,
          `Teléfono: ${phone}`,
          `Servicio: ${serviceLabel}`,
          `Mensaje: ${message || "—"}`,
          `Consentimiento: ${privacy_consent ? "Sí" : "No"}`,
        ].join("\n");

        const html = `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px">
            <h2 style="color:#6b21a8;margin-top:0">Nueva Solicitud de Cita</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666">Nombre</td><td style="padding:8px 0;font-weight:600">${full_name}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666">Teléfono</td><td style="padding:8px 0"><a href="tel:${phone}">${phone}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666">Servicio</td><td style="padding:8px 0">${serviceLabel}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Mensaje</td><td style="padding:8px 0">${message || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Consentimiento</td><td style="padding:8px 0">${privacy_consent ? "✅ Sí" : "❌ No"}</td></tr>
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
        emailAccepted =
          Array.isArray(info.accepted) && info.accepted.length > 0;
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        // Don't fail the request if email fails — the appointment is already saved
      }
    }

    return NextResponse.json(
      { ok: true, result, emailAccepted },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    console.error("Appointment API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
