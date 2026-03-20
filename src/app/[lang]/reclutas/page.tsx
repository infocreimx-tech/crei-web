"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Briefcase } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";

export default function ReclutasPage() {
  const { lang } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const copy =
    lang === "en"
      ? {
          title: "Join Our Team",
          subtitle:
            "We are a team of mental health professionals committed to changing lives. If you share our values and want to be part of CREI, tell us about yourself.",
          formTitle: "Application Form",
          name: "First Name",
          namePlaceholder: "John",
          lastName: "Last Name",
          lastNamePlaceholder: "Smith",
          email: "Email",
          emailPlaceholder: "john@example.com",
          phone: "Phone (optional)",
          phonePlaceholder: "+52 55 1234 5678",
          puesto: "Position of Interest",
          puestoPick: "Select a position",
          puestos: [
            "Clinical Psychologist",
            "Psychiatrist",
            "Therapist / Counselor",
            "Social Worker",
            "Nutritionist",
            "Administrative / Reception",
            "Other",
          ],
          cvLink: "Link to CV / LinkedIn (optional)",
          cvPlaceholder: "https://linkedin.com/in/...",
          message: "Why do you want to work at CREI?",
          messagePlaceholder: "Tell us briefly about your background and motivations...",
          sending: "Sending...",
          send: "Submit Application",
          successTitle: "Application received!",
          successMsg:
            "Thank you for your interest in CREI. Our HR team will review your application and contact you soon.",
          back: "Back to home",
          errorMsg: "An error occurred, please try again.",
        }
      : {
          title: "Únete a Nuestro Equipo",
          subtitle:
            "Somos un equipo de profesionales de salud mental comprometidos con transformar vidas. Si compartes nuestros valores y quieres ser parte de CREI, cuéntanos sobre ti.",
          formTitle: "Formulario de Postulación",
          name: "Nombre",
          namePlaceholder: "Juan",
          lastName: "Apellidos",
          lastNamePlaceholder: "Pérez García",
          email: "Email",
          emailPlaceholder: "juan@ejemplo.com",
          phone: "Teléfono (opcional)",
          phonePlaceholder: "+52 55 1234 5678",
          puesto: "Puesto de Interés",
          puestoPick: "Selecciona un puesto",
          puestos: [
            "Psicólogo Clínico",
            "Psiquiatra",
            "Terapeuta / Consejero",
            "Trabajo Social",
            "Nutriólogo",
            "Administrativo / Recepción",
            "Otro",
          ],
          cvLink: "Enlace a CV / LinkedIn (opcional)",
          cvPlaceholder: "https://linkedin.com/in/...",
          message: "¿Por qué quieres trabajar en CREI?",
          messagePlaceholder:
            "Cuéntanos brevemente sobre tu trayectoria y motivaciones...",
          sending: "Enviando...",
          send: "Enviar Postulación",
          successTitle: "¡Postulación recibida!",
          successMsg:
            "Gracias por tu interés en CREI. Nuestro equipo de RR.HH. revisará tu postulación y se pondrá en contacto contigo pronto.",
          back: "Volver al inicio",
          errorMsg: "Ocurrió un error, intenta de nuevo.",
        };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      nombre: String(fd.get("nombre") || ""),
      apellidos: String(fd.get("apellidos") || ""),
      correo: String(fd.get("correo") || ""),
      telefono: String(fd.get("telefono") || ""),
      puesto: String(fd.get("puesto") || ""),
      enlace_cv: String(fd.get("enlace_cv") || ""),
      mensaje: String(fd.get("mensaje") || ""),
    };

    try {
      const res = await fetch("/api/reclutas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(copy.errorMsg);
      }
    } catch {
      setError(copy.errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-24 px-6">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6">
            <Briefcase className="text-accent" size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            {copy.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {copy.subtitle}
          </p>
        </motion.div>

        {/* Form or Success */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-8 md:p-10 rounded-3xl shadow-lg"
        >
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
              <h2 className="text-2xl font-serif font-bold text-primary mb-3">
                {copy.successTitle}
              </h2>
              <p className="text-muted-foreground mb-8">{copy.successMsg}</p>
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all"
              >
                {copy.back}
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                {copy.formTitle}
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Nombre + Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium text-primary">
                      {copy.name} *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder={copy.namePlaceholder}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="apellidos" className="text-sm font-medium text-primary">
                      {copy.lastName} *
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder={copy.lastNamePlaceholder}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="correo" className="text-sm font-medium text-primary">
                    {copy.email} *
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder={copy.emailPlaceholder}
                    required
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label htmlFor="telefono" className="text-sm font-medium text-primary">
                    {copy.phone}
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder={copy.phonePlaceholder}
                  />
                </div>

                {/* Puesto */}
                <div className="space-y-2">
                  <label htmlFor="puesto" className="text-sm font-medium text-primary">
                    {copy.puesto} *
                  </label>
                  <select
                    id="puesto"
                    name="puesto"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                  >
                    <option value="">{copy.puestoPick}</option>
                    {copy.puestos.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CV Link */}
                <div className="space-y-2">
                  <label htmlFor="enlace_cv" className="text-sm font-medium text-primary">
                    {copy.cvLink}
                  </label>
                  <input
                    type="url"
                    id="enlace_cv"
                    name="enlace_cv"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder={copy.cvPlaceholder}
                  />
                </div>

                {/* Mensaje */}
                <div className="space-y-2">
                  <label htmlFor="mensaje" className="text-sm font-medium text-primary">
                    {copy.message} *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                    placeholder={copy.messagePlaceholder}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? copy.sending : copy.send}
                  <CheckCircle size={18} />
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
