"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, RefreshCw, Sun, Video, Calendar, ArrowDown } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function Method() {
  const { lang } = useI18n();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const copy =
    lang === "en"
      ? {
          label: "Our Process",
          badge: "CREI Method®",
          titleA: "The CREI Method:",
          titleB: "From Addiction to Reconstruction",
          subtitle:
            "A step-by-step clinical system developed from over 15 years of frontline experience with addiction — combining psychotherapy, psychiatry, and lived wisdom to move patients from chaos to clarity.",
          cta: "Ready for step 1?",
          steps: [
            {
              id: 1,
              title: "Structural Assessment",
              description:
                "We do not simply diagnose a substance. We map the entire emotional architecture of the person: their history, environment, relational bonds, and the neurological patterns that sustain the addiction cycle.",
              icon: Search
            },
            {
              id: 2,
              title: "Emotional Clearing",
              description:
                "We work through the accumulated trauma, deeply-rooted beliefs, and emotional blocks that are fueling addictive behavior. This phase requires courage — and we walk every step of it alongside the patient.",
              icon: RefreshCw
            },
            {
              id: 3,
              title: "Rebuild & Sustainable Design",
              description:
                "We co-create a new life structure with the patient — habits, tools, support networks, and a clear personal purpose. Recovery is not a destination; it is a daily, conscious construction.",
              icon: Sun
            }
          ],
          zoomTitle: "Weekly Zoom Sessions — Every Thursday",
          zoomDesc:
            "Every Thursday at 8:00 PM (Mexico City time), CREI opens its virtual doors to patients, families, and anyone affected by addiction. These free informational sessions are a space for questions, reflection, and the first step toward real help.",
          zoomBadge: "Free · Every Thursday · 8:00 PM CDMX",
          zoomCta: "Request the Zoom link via WhatsApp"
        }
      : {
          label: "Nuestro Proceso",
          badge: "Método CREI®",
          titleA: "El Método CREI:",
          titleB: "De la Adicción a la Reconstrucción",
          subtitle:
            "Un sistema clínico paso a paso desarrollado con más de 15 años de experiencia en primera línea con las adicciones — combinando psicoterapia, psiquiatría y sabiduría vivencial para llevar al paciente del caos a la claridad.",
          cta: "¿Listo para el paso 1?",
          steps: [
            {
              id: 1,
              title: "Diagnóstico Estructural",
              description:
                "No diagnosticamos solo una sustancia. Mapeamos la arquitectura emocional completa de la persona: su historia, entorno, vínculos relacionales y los patrones neurológicos que sostienen el ciclo de la adicción.",
              icon: Search
            },
            {
              id: 2,
              title: "Limpieza Emocional",
              description:
                "Trabajamos el trauma acumulado, las creencias profundamente arraigadas y los bloqueos emocionales que alimentan la conducta adictiva. Esta fase requiere valentía — y acompañamos cada paso a su lado.",
              icon: RefreshCw
            },
            {
              id: 3,
              title: "Reconstrucción y Diseño Sostenible",
              description:
                "Co-creamos con el paciente una nueva estructura de vida: hábitos, herramientas, redes de apoyo y un propósito personal claro. La recuperación no es un destino; es una construcción diaria y consciente.",
              icon: Sun
            }
          ],
          zoomTitle: "Sesiones Zoom Semanales — Todos los Jueves",
          zoomDesc:
            "Cada jueves a las 20:00 hrs (hora CDMX), CREI abre sus puertas virtuales a pacientes, familias y personas afectadas por adicciones. Estas sesiones informativas gratuitas son un espacio para preguntar, reflexionar y dar el primer paso hacia una ayuda real.",
          zoomBadge: "Gratuito · Todos los jueves · 20:00 hrs CDMX",
          zoomCta: "Solicitar el link de Zoom por WhatsApp"
        };

  return (
    <section id="metodo" className="py-32 bg-background relative overflow-hidden">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="text-accent font-medium tracking-widest uppercase text-sm">
              {copy.label}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase">
              {copy.badge}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mt-2 mb-6 leading-tight"
          >
            {copy.titleA} <br />
            <span className="italic font-light text-primary/80">{copy.titleB}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {copy.subtitle}
          </motion.p>
        </div>

        {/* Steps Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Progress Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2 hidden md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-accent origin-top"
            />
          </div>

          <div className="space-y-24 md:space-y-32">
            {copy.steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Content */}
                  <div className={`flex-1 text-center ${isEven ? "md:text-left" : "md:text-right"}`}>
                    <div className="inline-block p-3 bg-secondary/30 rounded-2xl mb-4 text-primary">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-primary mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Central Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-accent flex items-center justify-center shadow-xl shadow-accent/20">
                      <span className="text-xl font-bold text-primary">{step.id}</span>
                    </div>
                  </div>

                  {/* Empty Spacer for Layout Balance */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>



        {/* Arrow CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col items-center gap-4">
            <ArrowDown className="w-6 h-6 text-accent animate-bounce" />
            <p className="font-serif text-xl text-primary font-medium">{copy.cta}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
