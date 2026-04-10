"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Lock, UserRound } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";



export default function Contact() {
  const { lang } = useI18n();
  const cardRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const copy =
    lang === "en"
      ? {
          title: "Start your process",
          subtitle:
            "We are here to listen. Schedule an appointment or ask your questions. Your wellbeing is our priority.",
          cardTitle: "Comprehensive Restructuring",
          cardP1:
            "Unlike traditional approaches that only treat the symptom, our center focuses on Comprehensive Restructuring. We believe each person has a unique emotional structure; sometimes, due to trauma, addiction, or life crises, that structure weakens.",
          cardP2:
            "Our work is to provide the blueprint and the tools so you can rebuild your life. Here, emotional intelligence is not an abstract concept—it is our backbone. We work at the root of your mental processes so change is not temporary, but a new way of inhabiting your world.",
          imageAlt: "Structure and light",
          formTitle: "Schedule your appointment",
          name: "Full name",
          namePlaceholder: "John Smith",
          email: "Email",
          emailPlaceholder: "john@example.com",
          phone: "Phone",
          service: "Service of interest",
          servicePick: "Select an option",
          serviceIndividual: "Individual therapy",
          serviceCouple: "Couples therapy",
          servicePsychiatry: "Psychiatry",
          serviceGroup: "Support group",
          message: "Message (optional)",
          messagePlaceholder: "Tell us briefly how we can help…",
          consent: "I accept the privacy notice and the processing of my data.",
          sending: "Sending...",
          send: "Send request",
          toastMessage: "✅ Request sent successfully!"
        }
      : {
          title: "Comienza tu proceso",
          subtitle:
            "Estamos aquí para escucharte. Agenda una cita o resuelve tus dudas. Tu bienestar es nuestra prioridad.",
          cardTitle: "Reestructuración Integral",
          cardP1:
            "A diferencia de los enfoques tradicionales que solo tratan el síntoma, en nuestro centro nos enfocamos en la Reestructuración Integral. Creemos que cada persona posee una estructura emocional única; a veces, debido a traumas, adicciones o crisis de vida, esa estructura se debilita.",
          cardP2:
            "Nuestro trabajo es proporcionarte los planos y las herramientas para que vuelvas a edificar tu vida. Aquí, la inteligencia emocional no es un concepto abstracto, es nuestra columna vertebral. Trabajamos en la raíz de tus procesos mentales para que el cambio no sea temporal, sino una nueva forma de habitar tu mundo.",
          imageAlt: "Estructura y luz",
          formTitle: "Agenda tu Cita",
          name: "Nombre Completo",
          namePlaceholder: "Juan Pérez",
          email: "Email",
          emailPlaceholder: "juan@ejemplo.com",
          phone: "Teléfono",
          service: "Servicio de Interés",
          servicePick: "Selecciona una opción",
          serviceIndividual: "Terapia Individual",
          serviceCouple: "Terapia de Pareja",
          servicePsychiatry: "Psiquiatría",
          serviceGroup: "Grupo de Apoyo",
          message: "Mensaje (Opcional)",
          messagePlaceholder: "Cuéntanos brevemente cómo podemos ayudarte...",
          consent: "Acepto el aviso de privacidad y el tratamiento de mis datos.",
          sending: "Enviando...",
          send: "Enviar Solicitud",
          toastMessage: "✅ ¡Solicitud enviada exitosamente!"
        };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      nombre: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      telefono: String(fd.get("phone") || ""),
      servicio: String(fd.get("service") || ""),
      mensaje: String(fd.get("message") || ""),
      consentimiento: fd.get("consentimiento") ? 1 : 0
    };
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        form.reset();
        setShowToast(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-muted/30 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            {copy.toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Info & Insurance */}
          <div>
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
              className="text-lg text-muted-foreground mb-12"
            >
              {copy.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href={`/${lang}/portal`}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-border shadow-sm rounded-xl text-primary font-bold tracking-wide uppercase hover:border-primary/50 transition-all hover:-translate-y-1 group"
              >
                <UserRound className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                {lang === "en" ? "Beneficiary" : "Beneficiario"}
              </Link>
              <Link
                href={`/${lang}/portal-terapeutas`}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-emerald-600/20 shadow-sm rounded-xl text-emerald-700 font-bold tracking-wide uppercase hover:border-emerald-500/50 transition-all hover:-translate-y-1 group"
              >
                <Lock className="w-5 h-5 text-emerald-600/70 group-hover:text-emerald-600 transition-colors" />
                {lang === "en" ? "Therapist Access" : "Acceso de Terapeutas"}
              </Link>
            </motion.div>

            <div 
              ref={cardRef}
              className="bg-primary text-primary-foreground p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden group"
            >
              {/* Background Image */}
              <motion.div 
                style={{ y }}
                className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 h-[120%] -top-[10%]"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=1920&auto=format&fit=crop"
                  alt={copy.imageAlt}
                  fill
                  className="object-cover mix-blend-luminosity"
                />
              </motion.div>

              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/5 rounded-full blur-2xl z-0"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white/5 rounded-full blur-2xl z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-bold mb-6">{copy.cardTitle}</h3>
                <div className="space-y-4 text-primary-foreground/90 leading-relaxed">
                  <p>
                    {copy.cardP1}
                  </p>
                  <p>
                    {copy.cardP2}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 md:p-10 rounded-3xl shadow-lg"
          >
            <h3 className="text-2xl font-serif font-bold text-primary mb-6">{copy.formTitle}</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-primary">{copy.name}</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder={copy.namePlaceholder}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-primary">{copy.email}</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder={copy.emailPlaceholder}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-primary">{copy.phone}</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="+52 55 1234 5678"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-primary">{copy.service}</label>
                <select 
                  id="service" 
                  name="service"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                >
                  <option value="">{copy.servicePick}</option>
                  <option value="individual">{copy.serviceIndividual}</option>
                  <option value="couple">{copy.serviceCouple}</option>
                  <option value="psychiatry">{copy.servicePsychiatry}</option>
                  <option value="group">{copy.serviceGroup}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-primary">{copy.message}</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                  placeholder={copy.messagePlaceholder}
                />
              </div>

              <div className="flex items-center gap-3">
                <input id="consentimiento" name="consentimiento" type="checkbox" defaultChecked className="w-5 h-5 rounded border border-border" />
                <label htmlFor="consentimiento" className="text-sm text-muted-foreground">{copy.consent}</label>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? copy.sending : copy.send} <CheckCircle size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

