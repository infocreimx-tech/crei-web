"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { Fingerprint } from "lucide-react";

export default function TechBioWell() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          tag: "Biological Validation",
          title: "Bio-Well Energy Scanner",
          desc: "Therapy only works when the patient's nervous system is receptive. We use revolutionary Bio-Well technology to capture bio-photonic fields, giving our clinicians real-time, measurable data on your stress levels and energy alignment.",
          features: [
            "Gas Discharge Visualization (GDV) camera",
            "Real-time stress level quantification",
            "Measures organ energy imbalances",
            "Tracks physiological progress over time"
          ]
        }
      : {
          tag: "Validación Biológica",
          title: "Lector Energético Bio-Well",
          desc: "La terapia solo funciona cuando el sistema nervioso del paciente es receptivo. Utilizamos la revolucionaria tecnología Bio-Well para capturar campos de biofotones, brindando a nuestros clínicos datos medibles en tiempo real sobre los niveles de estrés y la alineación energética.",
          features: [
            "Cámara de Visualización de Descarga de Gas (GDV)",
            "Cuantificación del nivel de estrés en tiempo real",
            "Medición de desequilibrios energéticos en órganos",
            "Rastreo del progreso fisiológico a lo largo del programa"
          ]
        };

  return (
    <section className="py-24 bg-[#150b24] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image (Left) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="order-2 lg:order-1 relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image src="/tech-biowell.png" alt="Bio-Well Scanner" fill className="object-cover hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#150b24] via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Text Content (Right) */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <span className="text-accent font-medium tracking-widest uppercase text-sm mb-4 block">
              {copy.tag}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
              {copy.title}
            </h2>
            <div className="w-12 h-1 bg-accent rounded-full mb-8" />
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {copy.desc}
            </p>
            <ul className="space-y-4">
              {copy.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-white/80 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
