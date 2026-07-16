"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, CheckCircle, Lock, ShieldCheck, UserRound } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";



export default function Contact() {
  const { lang } = useI18n();
  const cardRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formError, setFormError] = useState("");
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
          title: "Tell us how we can help",
          subtitle:
            "Complete this questionnaire and the CREI team will review your request and contact you.",
          cardTitle: "Comprehensive Restructuring",
          cardP1:
            "Unlike traditional approaches that only treat the symptom, our center focuses on Comprehensive Restructuring. We believe each person has a unique emotional structure; sometimes, due to trauma, addiction, or life crises, that structure weakens.",
          cardP2:
            "Our work is to provide the blueprint and the tools so you can rebuild your life. Here, emotional intelligence is not an abstract concept—it is our backbone. We work at the root of your mental processes so change is not temporary, but a new way of inhabiting your world.",
          imageAlt: "Structure and light",
          confidential: "Confidential request",
          formTitle: "Contact questionnaire",
          formIntro:
            "Share your information with us. A member of our clinical team will contact you privately.",
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
          send: "Send questionnaire",
          toastMessage: "Questionnaire sent successfully!",
          errorMessage: "We could not send your questionnaire. Please try again."
        }
      : {
          title: "Cuéntanos cómo podemos ayudarte",
          subtitle:
            "Completa este cuestionario y el equipo de CREI revisará tu solicitud para ponerse en contacto contigo.",
          cardTitle: "Reestructuración Integral",
          cardP1:
            "A diferencia de los enfoques tradicionales que solo tratan el síntoma, en nuestro centro nos enfocamos en la Reestructuración Integral. Creemos que cada persona posee una estructura emocional única; a veces, debido a traumas, adicciones o crisis de vida, esa estructura se debilita.",
          cardP2:
            "Nuestro trabajo es proporcionarte los planos y las herramientas para que vuelvas a edificar tu vida. Aquí, la inteligencia emocional no es un concepto abstracto, es nuestra columna vertebral. Trabajamos en la raíz de tus procesos mentales para que el cambio no sea temporal, sino una nueva forma de habitar tu mundo.",
          imageAlt: "Estructura y luz",
          confidential: "Solicitud confidencial",
          formTitle: "Cuestionario de contacto",
          formIntro:
            "Compártenos tus datos. Una persona de nuestro equipo clínico se pondrá en contacto contigo de forma privada.",
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
          send: "Enviar cuestionario",
          toastMessage: "¡Cuestionario enviado correctamente!",
          errorMessage: "No pudimos enviar el cuestionario. Inténtalo nuevamente."
        };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setFormError("");
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
      } else {
        setFormError(copy.errorMessage);
      }
    } catch {
      setFormError(copy.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative overflow-hidden bg-[#f1edf5] py-24">
      <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-[#bda6e8]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-white/80 blur-3xl" />
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

      <div className="container relative mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Info & Insurance */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 font-serif text-4xl font-bold text-[#302747] md:text-5xl"
            >
              {copy.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-12 max-w-xl text-lg leading-relaxed text-[#675e70]"
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
                className="group flex items-center justify-center gap-3 rounded-xl border border-[#d7cde1] bg-white px-6 py-4 font-bold uppercase tracking-wide text-[#302747] shadow-sm transition-all hover:-translate-y-1 hover:border-[#7258a8]"
              >
                <UserRound className="h-5 w-5 text-[#7258a8] transition-colors" />
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
              className="group relative overflow-hidden rounded-3xl bg-[#302747] p-8 text-white shadow-lg md:p-10"
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
                <div className="space-y-4 leading-relaxed text-white/85">
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
            className="rounded-[2rem] border border-[#d9cfe2] bg-[#fffdf9] p-6 shadow-[0_24px_70px_rgba(48,39,71,0.15)] sm:p-8 md:p-10"
          >
            <div className="mb-8 border-b border-[#e7dfea] pb-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#eee7f8] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#634993]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {copy.confidential}
              </div>
              <h3 className="mb-3 font-serif text-3xl font-bold text-[#302747]">{copy.formTitle}</h3>
              <p className="max-w-xl leading-relaxed text-[#675e70]">{copy.formIntro}</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-[#40364b]">{copy.name}</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="w-full rounded-xl border border-[#cfc4dc] bg-[#f8f5fb] px-4 py-3.5 text-[#302747] placeholder:text-[#8a8192] outline-none transition focus:border-[#7258a8] focus:bg-white focus:ring-4 focus:ring-[#7258a8]/10"
                    placeholder={copy.namePlaceholder}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-[#40364b]">{copy.email}</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="w-full rounded-xl border border-[#cfc4dc] bg-[#f8f5fb] px-4 py-3.5 text-[#302747] placeholder:text-[#8a8192] outline-none transition focus:border-[#7258a8] focus:bg-white focus:ring-4 focus:ring-[#7258a8]/10"
                    placeholder={copy.emailPlaceholder}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold text-[#40364b]">{copy.phone}</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  className="w-full rounded-xl border border-[#cfc4dc] bg-[#f8f5fb] px-4 py-3.5 text-[#302747] placeholder:text-[#8a8192] outline-none transition focus:border-[#7258a8] focus:bg-white focus:ring-4 focus:ring-[#7258a8]/10"
                  placeholder="+52 55 1234 5678"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-bold text-[#40364b]">{copy.service}</label>
                <select 
                  id="service" 
                  name="service"
                  className="w-full rounded-xl border border-[#cfc4dc] bg-[#f8f5fb] px-4 py-3.5 text-[#302747] outline-none transition focus:border-[#7258a8] focus:bg-white focus:ring-4 focus:ring-[#7258a8]/10"
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
                <label htmlFor="message" className="text-sm font-bold text-[#40364b]">{copy.message}</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#cfc4dc] bg-[#f8f5fb] px-4 py-3.5 text-[#302747] placeholder:text-[#8a8192] outline-none transition focus:border-[#7258a8] focus:bg-white focus:ring-4 focus:ring-[#7258a8]/10"
                  placeholder={copy.messagePlaceholder}
                />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#e4dce8] bg-[#f8f5fb] p-4">
                <input id="consentimiento" name="consentimiento" type="checkbox" defaultChecked required className="mt-0.5 h-5 w-5 shrink-0 accent-[#7258a8]" />
                <label htmlFor="consentimiento" className="text-sm leading-relaxed text-[#5f5668]">{copy.consent}</label>
              </div>

              {formError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  {formError}
                </div>
              )}

              <button 
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7258a8] py-4 font-bold text-white shadow-[0_12px_30px_rgba(114,88,168,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#5d438d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7258a8]/25 disabled:cursor-not-allowed disabled:opacity-70"
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
