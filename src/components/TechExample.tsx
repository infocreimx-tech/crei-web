"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function TechExample() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          label: "The Clinical Journey",
          title: "How It All Connects",
          subtitle:
            "Our technology is not used in isolation. We have designed a seamless, scientifically-backed flow where each tool prepares the patient for the next.",
          steps: [
            {
              number: "01",
              title: "Somatic Decompression (4D Chair)",
              desc: "The patient arrives highly stimulated. 20 minutes in our Zero-Gravity 4D Chair physically lowers cortisol levels and prepares the body for deep psychological work.",
            },
            {
              number: "02",
              title: "Validation (Bio-Well Reader)",
              desc: "Before traditional therapy begins, we scan the energy field and nervous system alignment to confirm the patient is now biologically receptive and calm.",
            },
            {
              number: "03",
              title: "Processing (Virtual Reality)",
              desc: "In a calm state, the patient enters precise VR exposure to face their core triggers (bars, conflict) while the therapist safely guides emotional regulation.",
            },
            {
              number: "04",
              title: "Integration (Holistic Therapy)",
              desc: "The session closes with sound frequencies and guided meditation, cementing the new neural pathways and ensuring the patient leaves stabilized.",
            },
          ],
        }
      : {
          label: "El Viaje Clínico",
          title: "Cómo se Conecta Todo",
          subtitle:
            "Nuestra tecnología no se usa de forma aislada. Hemos diseñado un flujo continuo y respaldado por la ciencia, donde cada herramienta prepara al paciente para la siguiente.",
          steps: [
            {
              number: "01",
              title: "Descompresión (Sillón 4D)",
              desc: "El paciente llega hiperestimulado. 20 minutos de inmersión en nuestro sillón de gravedad cero bajan físicamente los niveles de cortisol, preparando el cuerpo para el trabajo profundo.",
            },
            {
              number: "02",
              title: "Validación (Lector Bio-Well)",
              desc: "Antes de iniciar la terapia, escaneamos el campo energético y la alineación del sistema nervioso para confirmar que el paciente está biológicamente receptivo.",
            },
            {
              number: "03",
              title: "Procesamiento (Realidad Virtual)",
              desc: "Ya en estado de calma, el paciente entra a un entorno VR para enfrentar detonantes clave, mientras el terapeuta lo guía en la regulación de sus emociones.",
            },
            {
              number: "04",
              title: "Integración (Terapia Holística)",
              desc: "La sesión cierra con biofrecuencias sonoras y meditación guiada, consolidando las nuevas vías neuronales y asegurando que el paciente se vaya totalmente estabilizado.",
            },
          ],
        };

  return (
    <section className="py-24 bg-[#1a0f2e] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 group"
          >
            <Image
              src="/tech-journey.png"
              alt="Unified Tech Healing Journey"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                <PlayCircle className="w-10 h-10" />
              </div>
            </div>
          </motion.div>

          {/* Text/Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-medium tracking-widest uppercase text-sm mb-4 block">
              {copy.label}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
              {copy.title}
            </h2>
            <div className="w-12 h-1 bg-accent rounded-full mb-8" />
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              {copy.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {copy.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
                >
                  <span className="absolute -top-4 -right-2 text-6xl font-bold text-white/5 pointer-events-none">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white mb-2 relative z-10">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed relative z-10">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
