import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const nombre = String(data?.nombre || "").trim();
    const email = String(data?.email || "").trim();
    const telefono = String(data?.telefono || "").trim();
    const servicio = String(data?.servicio || "").trim();
    const mensaje = String(data?.mensaje || "").trim();
    const consentimiento = data?.consentimiento === false ? 0 : 1;

    if (!nombre || !email || !telefono || !servicio) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const ipHeader = req.headers.get("x-forwarded-for") || "";
    const ip = ipHeader.split(",")[0].trim() || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    let result: unknown = null;
    try {
      const pool = getPool();
      const sql =
        "INSERT INTO appointments (nombre, email, telefono, servicio, mensaje, created_at, ip, user_agent, consentimiento) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)";
      const params = [nombre, email, telefono, servicio, mensaje || null, ip, userAgent, consentimiento];
      const [r] = await pool.execute(sql, params);
      result = r;
    } catch {}
    
    let emailAccepted = false;
    const shost = process.env.SMTP_HOST || "";
    const sport = Number(process.env.SMTP_PORT || 0);
    const suser = process.env.SMTP_USER || "";
    const spass = process.env.SMTP_PASS || "";
    const mailTo = process.env.MAIL_TO || suser;
    const mailFrom = process.env.MAIL_FROM || suser || "noreply@crei.mx";
    if (shost && sport && suser && spass && mailTo) {
      const transporter = nodemailer.createTransport({
        host: shost,
        port: sport,
        secure: sport === 465,
        auth: { user: suser, pass: spass }
      });
      const subject = "Nueva solicitud de cita - CREI";
      const text = [
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        `Teléfono: ${telefono}`,
        `Servicio: ${servicio}`,
        `Mensaje: ${mensaje || "-"}`,
        `Consentimiento: ${consentimiento ? "Sí" : "No"}`,
        `IP: ${ip}`,
        `User-Agent: ${userAgent}`
      ].join("\n");
      const html = `<p><strong>Nombre:</strong> ${nombre}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Teléfono:</strong> ${telefono}</p>
<p><strong>Servicio:</strong> ${servicio}</p>
<p><strong>Mensaje:</strong> ${mensaje || "-"}</p>
<p><strong>Consentimiento:</strong> ${consentimiento ? "Sí" : "No"}</p>
<p><strong>IP:</strong> ${ip}</p>
<p><strong>User-Agent:</strong> ${userAgent}</p>`;
      const info = await transporter.sendMail({
        from: mailFrom,
        to: mailTo,
        subject,
        text,
        html
      });
      emailAccepted = Array.isArray(info.accepted) && info.accepted.length > 0;
    }

    return NextResponse.json({ ok: true, result, emailAccepted }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error en el servidor";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
