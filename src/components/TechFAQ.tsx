"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function TechFAQ() {
  const { lang } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const copy =
    lang === "en"
      ? {
          label: "FAQ",
          title: "Clear Answers on Tech",
          faqs: [
            {
              q: "Does AI replace the human therapist?",
              a: "Absolutely not. AI is a co-pilot. It processes large amounts of data (like voice patterns or heart rate) to give our clinical team immediate, actionable insights, but empathy, decision-making, and connection are 100% human.",
            },
            {
              q: "Is Virtual Reality safe for someone in early recovery?",
              a: "Yes. VR exposure therapy is conducted in a controlled, safe environment alongside a clinical specialist. If the patient's stress levels get too high, the simulation can be paused instantly. It is much safer than real-world exposure.",
            },
            {
              q: "How is my medical data protected?",
              a: "All bio-sensor data, AI transcripts, and clinical notes are encrypted end-to-end and comply with strict international health data privacy laws (HIPAA equivalent). We never sell or share data with third-party advertising companies.",
            },
            {
              q: "Do I have to use these technologies if I enter the program?",
              a: "No. The CREI method is highly personalized. While we recommend technology-assisted interventions for better outcomes, the core of our treatment is the clinical relationship. Tech is an addition, not a mandatory requirement.",
            },
          ],
        }
      : {
          label: "Preguntas Frecuentes",
          title: "Claridad sobre la Tecnología",
          faqs: [
            {
              q: "¿La IA reemplaza al terapeuta humano?",
              a: "Absolutamente no. La Inteligencia Artificial es un copiloto. Procesa grandes cantidades de datos (como patrones de voz o ritmo cardíaco) para darle a nuestro equipo clínico insights inmediatos, pero la empatía, las decisiones y la conexión son 100% humanas.",
            },
            {
              q: "¿La Realidad Virtual es segura en la fase temprana de recuperación?",
              a: "Sí. La terapia de exposición por VR se realiza en un entorno clínico seguro, siempre junto a un especialista. Si los niveles de estrés del paciente suben demasiado, la simulación se pausa al instante. Es mucho más seguro que la exposición en el mundo real.",
            },
            {
              q: "¿Cómo se protegen mis datos médicos y biométricos?",
              a: "Todos los datos de bio-sensores, transcripciones de IA y notas están cifrados de extremo a extremo y cumplen con estrictas leyes internacionales de privacidad en salud. Nunca vendemos ni compartimos datos con terceros.",
            },
            {
              q: "¿Estoy obligado a usar estas tecnologías si ingreso al programa?",
              a: "No. El método CREI es hiper-personalizado. Aunque recomendamos las intervenciones asistidas por tecnología por sus grandes resultados, el núcleo del tratamiento es la relación clínica. La tecnología es una suma, no un requisito obligatorio.",
            },
          ],
        };

  return (
    <section className="py-24 bg-[#0e0720] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-16">
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

        <div className="space-y-4">
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
                className="w-full px-6 py-6 flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-primary text-[16px] leading-snug">
                  {faq.q}
                </span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                  {open === i ? (
                    <Minus className="w-4 h-4 text-accent" />
                  ) : (
                    <Plus className="w-4 h-4 text-accent" />
                  )}
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
                    <p className="px-6 pb-6 pt-2 text-muted-foreground text-sm leading-relaxed border-t border-border/30">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
