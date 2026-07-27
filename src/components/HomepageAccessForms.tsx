"use client";

import { CalendarDays, CheckCircle2, Loader2, Mail, MessageCircle, Video } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type FormState = "idle" | "sending" | "success" | "error";

export function ThursdayRegistration() {
  const { lang } = useI18n();
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const copy =
    lang === "en"
      ? {
          fallbackError: "We could not complete your registration.",
          successTitle: "Registration confirmed",
          successBody:
            "We saved your details so we can send you a reminder and access information for the next Thursday session.",
          activateWhatsApp: "Enable WhatsApp reminder",
          freeRegistration: "Free registration",
          title: "Receive access for this Thursday",
          intro:
            "Leave us a contact method and we will send you the reminder. The Zoom link is not published on the website.",
          name: "Name",
          channel: "How would you like to receive it?",
          email: "Email",
          whatsappNumber: "WhatsApp number",
          consent:
            "I agree to receive information related to this session and to the processing of my data.",
          submit: "Send reminder and access",
          apiMessage:
            "Registration for the Thursday information session. Reminder requested by",
        }
      : {
          fallbackError: "No fue posible completar el registro.",
          successTitle: "Registro confirmado",
          successBody:
            "Guardamos tus datos para enviarte el recordatorio y el acceso de la próxima sesión del jueves.",
          activateWhatsApp: "Activar recordatorio por WhatsApp",
          freeRegistration: "Registro gratuito",
          title: "Recibe el acceso de este jueves",
          intro:
            "Déjanos un medio de contacto y te enviaremos el recordatorio. El enlace de Zoom no queda publicado en la web.",
          name: "Nombre",
          channel: "¿Cómo quieres recibirlo?",
          email: "Correo",
          whatsappNumber: "Número de WhatsApp",
          consent:
            "Acepto recibir información relacionada con esta sesión y el tratamiento de mis datos.",
          submit: "Enviar recordatorio y acceso",
          apiMessage:
            "Registro para la sesión informativa de los jueves. Recordatorio solicitado por",
        };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const contact = String(formData.get("contact") || "").trim();
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(formData.get("name") || ""),
          email: channel === "email" ? contact : "",
          telefono: channel === "whatsapp" ? contact : "",
          servicio: "thursday_session",
          mensaje: `${copy.apiMessage} ${channel === "email" ? copy.email : "WhatsApp"}.`,
          consentimiento: formData.get("consent") ? 1 : 0
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || copy.fallbackError);
      form.reset();
      setState("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.fallbackError);
      setState("error");
    }
  };

  return (
    <div data-testid="thursday-registration" className="rounded-[28px] border border-white/15 bg-white/[.08] p-6 text-white backdrop-blur sm:p-8">
      {state === "success" ? (
        <div className="py-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-[#dcefc5]" /><h3 className="mt-4 font-serif text-3xl font-bold">{copy.successTitle}</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70">{copy.successBody}</p>{channel === "whatsapp" && <a href="https://wa.me/525530412552?text=Hola%20CREI%2C%20me%20registr%C3%A9%20para%20la%20sesi%C3%B3n%20informativa%20del%20jueves" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#dcefc5] px-5 py-3 text-xs font-black text-[#302747]"><MessageCircle className="h-4 w-4" /> {copy.activateWhatsApp}</a>}</div>
      ) : (
        <form onSubmit={submit} className="space-y-4"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#dcefc5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-[#302747]"><Video className="h-4 w-4" /> {copy.freeRegistration}</span><h3 className="mt-4 font-serif text-3xl font-bold">{copy.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{copy.intro}</p></div><label className="block text-xs font-bold">{copy.name}<input name="name" required autoComplete="name" className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-normal text-white outline-none placeholder:text-white/35 focus:border-[#dcefc5]" /></label><div><span className="mb-2 block text-xs font-bold">{copy.channel}</span><div className="grid grid-cols-2 gap-2"><button type="button" aria-pressed={channel === "email"} onClick={() => setChannel("email")} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold ${channel === "email" ? "border-[#dcefc5] bg-[#dcefc5] text-[#302747]" : "border-white/20 text-white"}`}><Mail className="h-4 w-4" /> {copy.email}</button><button type="button" aria-pressed={channel === "whatsapp"} onClick={() => setChannel("whatsapp")} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold ${channel === "whatsapp" ? "border-[#dcefc5] bg-[#dcefc5] text-[#302747]" : "border-white/20 text-white"}`}><MessageCircle className="h-4 w-4" /> WhatsApp</button></div></div><label className="block text-xs font-bold">{channel === "email" ? copy.email : copy.whatsappNumber}<input key={channel} name="contact" required type={channel === "email" ? "email" : "tel"} autoComplete={channel === "email" ? "email" : "tel"} placeholder={channel === "email" ? "name@email.com" : "55 0000 0000"} className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-normal text-white outline-none placeholder:text-white/35 focus:border-[#dcefc5]" /></label><label className="flex items-start gap-3 text-[11px] leading-5 text-white/60"><input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-[#dcefc5]" /><span>{copy.consent}</span></label>{state === "error" && <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-xs font-semibold text-red-100">{error}</p>}<button disabled={state === "sending"} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#dcefc5] px-5 py-4 text-sm font-black text-[#302747] disabled:opacity-50">{state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}{copy.submit}</button></form>
      )}
    </div>
  );
}
