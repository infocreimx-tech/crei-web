import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

const SERVICE_LABELS: Record<string, string> = {
  individual: "Terapia Individual",
  couple: "Terapia de Pareja",
  psychiatry: "Psiquiatría",
  group: "Grupo de Apoyo",
  thursday_session: "Sesión informativa de los jueves",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const full_name = String(data?.nombre || "").trim();
    const email = String(data?.email || "").trim();
    const phone = String(data?.telefono || "").trim();
    const service = String(data?.servicio || "").trim();
    const message = String(data?.mensaje || "").trim() || null;
    const privacy_consent = data?.consentimiento === 1 || data?.consentimiento === true;

    if (!full_name || !service) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const validServices = ["individual", "couple", "psychiatry", "group", "thursday_session"];
    if (!validServices.includes(service)) {
      return NextResponse.json(
        { error: "Servicio no válido" },
        { status: 400 }
      );
    }
    if (service === "thursday_session" && !email && !phone) {
      return NextResponse.json({ error: "Escribe un correo o número de WhatsApp." }, { status: 400 });
    }
    if (service !== "thursday_session" && (!email || !phone)) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }
    if (!privacy_consent) {
      return NextResponse.json({ error: "Debes aceptar el aviso de privacidad." }, { status: 400 });
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
    let confirmationSent = false;
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
        const safeName = escapeHtml(full_name);
        const safeEmail = escapeHtml(email || "—");
        const safePhone = escapeHtml(phone || "—");
        const safeMessage = escapeHtml(message || "—");
        const subject = "Nuevo cuestionario de contacto — CREI";

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
            <h2 style="color:#6b21a8;margin-top:0">Nuevo cuestionario de contacto</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666">Nombre</td><td style="padding:8px 0;font-weight:600">${safeName}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${safeEmail}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Teléfono</td><td style="padding:8px 0">${safePhone}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Servicio</td><td style="padding:8px 0">${serviceLabel}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Mensaje</td><td style="padding:8px 0">${safeMessage}</td></tr>
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

        if (email && service === "thursday_session") {
          const zoomUrl = process.env.THURSDAY_ZOOM_URL;
          const confirmationSubject = "Registro para la sesión del jueves — CREI";
          const accessCopy = zoomUrl
            ? `<p style="margin:24px 0"><a href="${escapeHtml(zoomUrl)}" style="display:inline-block;background:#7258a8;color:white;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">Abrir acceso de Zoom</a></p>`
            : "<p style=\"padding:12px 16px;background:#f3eef8;border-radius:12px\">El equipo de CREI enviará el acceso de Zoom a este correo antes de la sesión.</p>";
          const confirmationInfo = await transporter.sendMail({
            from: mailFrom,
            to: email,
            subject: confirmationSubject,
            text: `${full_name}, recibimos tu registro para ${serviceLabel}. ${message || ""} ${zoomUrl ? `Acceso: ${zoomUrl}` : "Recibirás el acceso por este correo."}`,
            html: `<div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:28px;border:1px solid #e5ddec;border-radius:18px"><p style="font-size:12px;font-weight:700;color:#7258a8;text-transform:uppercase">CREI · Confirmación</p><h2 style="color:#302747">Hola, ${safeName}</h2><p style="color:#6d6475;line-height:1.6">Recibimos tu registro para <strong>${serviceLabel}</strong>.</p><p style="color:#6d6475;line-height:1.6">${safeMessage}</p>${accessCopy}<p style="font-size:12px;color:#8a8190">Este mensaje no sustituye atención de emergencia. Si existe un riesgo inmediato, llama al 911.</p></div>`
          });
          confirmationSent = Array.isArray(confirmationInfo.accepted) && confirmationInfo.accepted.length > 0;
        }
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        // Don't fail the request if email fails — the appointment is already saved
      }
    }

    return NextResponse.json(
      { ok: true, result, emailAccepted, confirmationSent },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    console.error("Appointment API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
