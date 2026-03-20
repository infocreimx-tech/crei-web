"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, Send, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export default function ClinicsNetwork() {
  const { lang } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  const copy =
    lang === "en"
      ? {
          label: "Our Network",
          title: "Soon you'll find a place in our partner clinics",
          subtitle:
            "We're expanding our network of partner clinics to provide integrated, close-to-home care.",
          badge: "Strategic Partnership",
          ctaTitle: "Want your clinic to be part of the CREI network?",
          ctaBody:
            "Join the leading network in emotional restructuring. We look for institutions committed to clinical excellence and humane care to expand our reach.",
          benefits: [
            "Access to certified CREI methodology",
            "Patient referral network",
            "Ongoing training for your team",
            "Support from a leading brand"
          ],

          clinicName: "Clinic name",
          clinicNamePlaceholder: "e.g., Comprehensive Medical Center",
          ownerName: "Primary contact name",
          ownerNamePlaceholder: "Dr. Firstname Lastname",
          phone: "Contact phone",
          location: "Location (City/State)",
          locationPlaceholder: "e.g., Austin, Texas",
          submitting: "Sending...",
          submit: "Send partnership request",
          errorGeneric: "Something went wrong. Please try again.",
          toastMessage: "Request sent successfully!"
        }
      : {
          label: "Nuestra Red",
          title: "Próximamente encontrarás un lugar en nuestras clínicas asociadas",
          subtitle:
            "Estamos ampliando nuestra red de clínicas asociadas para brindarte atención integral y cercana.",
          badge: "Alianza Estratégica",
          ctaTitle: "¿Te interesa que tu clínica sea parte de la red CREI?",
          ctaBody:
            "Únete a la red líder en reestructuración emocional. Buscamos instituciones comprometidas con la excelencia clínica y el trato humano para expandir nuestro alcance.",
          benefits: [
            "Acceso a metodología CREI certificada",
            "Red de derivación de pacientes",
            "Formación continua para tu equipo",
            "Respaldo de marca líder"
          ],

          clinicName: "Nombre de la Clínica",
          clinicNamePlaceholder: "Ej. Centro Médico Integral",
          ownerName: "Nombre del Responsable",
          ownerNamePlaceholder: "Dr./Dra. Nombre Apellido",
          phone: "Teléfono de Contacto",
          location: "Ubicación (Ciudad/Estado)",
          locationPlaceholder: "Ej. Guadalajara, Jalisco",
          submitting: "Enviando...",
          submit: "Enviar Solicitud de Afiliación",
          errorGeneric: "Ocurrió un error. Inténtalo de nuevo.",
          toastMessage: "¡Solicitud enviada exitosamente!"
        };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      clinic_name: formData.get("clinic_name"),
      owner_name: formData.get("owner_name"),
      phone: formData.get("phone"),
      location: formData.get("location"),
    };

    try {
      const res = await fetch("/api/reclutamiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || copy.errorGeneric);
      }

      form.reset();
      setShowToast(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : copy.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="clinicas" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {copy.toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] uppercase text-accent-foreground mb-4 block"
          >
            {copy.label}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6"
          >
            {copy.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {copy.subtitle}
          </motion.p>
        </div>

        {/* Sin grilla de clínicas por ahora */}

        {/* Join Network Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-background/5 rounded-full blur-3xl" />

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">{copy.badge}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                {copy.ctaTitle}
              </h3>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                {copy.ctaBody}
              </p>
              <ul className="space-y-4 mb-8">
                {copy.benefits.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary-foreground/90">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground/80">{copy.clinicName}</label>
                    <input 
                      type="text" 
                      name="clinic_name"
                      required
                      className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder={copy.clinicNamePlaceholder}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground/80">{copy.ownerName}</label>
                      <input 
                        type="text" 
                        name="owner_name"
                        required
                        className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        placeholder={copy.ownerNamePlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground/80">{copy.phone}</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        placeholder="+52..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground/80">{copy.location}</label>
                    <input 
                      type="text" 
                      name="location"
                      required
                      className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder={copy.locationPlaceholder}
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
                      {errorMsg}
                    </p>
                  )}

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent text-primary-foreground font-bold py-4 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      copy.submitting
                    ) : (
                      <>
                        {copy.submit}
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
