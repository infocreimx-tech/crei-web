"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

export default function FAQ() {
  const { lang } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const copy = lang === "en"
    ? {
        label: "Common Questions",
        title: "You deserve honest answers.",
        faqs: [
          {
            q: "Does my family member have to want help to get treatment?",
            a: "No. In many cases, the process begins with the family. We conduct structured interventions and guide families on how to set effective limits that create the conditions necessary for the person to accept help."
          },
          {
            q: "What's the difference between CREI and a traditional rehabilitation center?",
            a: "CREI is not a rehabilitation center — we are a clinical consulting and coordination center. We assess each case, select the most appropriate treatment setting (residential, ambulatory, or home-based), and accompany the patient and family throughout the entire process."
          },
          {
            q: "Is treatment confidential?",
            a: "Absolutely. All of our clinical processes are protected by medical confidentiality. We never share information with employers, family members not involved in treatment, or third parties without explicit written consent."
          },
          {
            q: "How long does recovery take?",
            a: "Recovery is a process, not an event. The first phase (stabilization and intervention) typically lasts 30-90 days. Long-term recovery coaching and relapse prevention can extend for 12-24 months — always at the patient's own pace and needs."
          },
          {
            q: "Is CREI's online Zoom session right for me?",
            a: "Our free weekly Thursday sessions at 8:00 PM CDMX are open to anyone: people in addiction, family members seeking guidance, or those in early recovery. No registration required — just send us a WhatsApp message to get the link."
          }
        ]
      }
    : {
        label: "Preguntas Frecuentes",
        title: "Te mereces respuestas honestas.",
        faqs: [
          {
            q: "¿Mi familiar tiene que querer ayuda para iniciar un tratamiento?",
            a: "No. En muchos casos el proceso comienza con la familia. Realizamos intervenciones estructuradas y orientamos a las familias sobre cómo fijar límites efectivos que creen las condiciones necesarias para que la persona acepte ayuda."
          },
          {
            q: "¿Cuál es la diferencia entre CREI y un centro de rehabilitación tradicional?",
            a: "CREI no es un centro de rehabilitación — somos un centro de consultoría clínica y coordinación. Evaluamos cada caso, seleccionamos el entorno de tratamiento más adecuado (residencial, ambulatorio o en casa) y acompañamos al paciente y familia durante todo el proceso."
          },
          {
            q: "¿El tratamiento es confidencial?",
            a: "Absolutamente. Todos nuestros procesos clínicos están protegidos por el secreto médico. Nunca compartimos información con empleadores, familiares no involucrados en el tratamiento ni terceros sin consentimiento escrito explícito."
          },
          {
            q: "¿Cuánto tiempo toma la recuperación?",
            a: "La recuperación es un proceso, no un evento. La primera fase (estabilización e intervención) generalmente dura 30-90 días. El coaching de recuperación a largo plazo y la prevención de recaídas pueden extenderse por 12-24 meses — siempre al ritmo y necesidades del paciente."
          },
          {
            q: "¿La sesión de Zoom de CREI es para mí?",
            a: "Nuestras sesiones gratuitas de los jueves a las 20:00 hrs CDMX están abiertas para todos: personas en adicción, familiares que buscan orientación o quienes están en recuperación temprana. Sin registro — solo mándanos un mensaje por WhatsApp para recibir el link."
          }
        ]
      };

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase text-accent block mb-4"
          >
            {copy.label}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary"
          >
            {copy.title}
          </motion.h2>
        </div>

        <div className="space-y-3 mb-16">
          {copy.faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border/60 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-primary text-[15px] leading-snug">{faq.q}</span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                  {open === i ? <Minus className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border border-border/50">
          <Image src="/method-faq.png" alt="FAQ" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
