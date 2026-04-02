"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function MethodCompare() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          label: "The Paradigm Shift",
          title: "The CREI Method",
          subtitle:
            "A clinical approach centered on dignity and the architecture of the mind, completely moving away from punitive models.",
          trad: "Traditional Model",
          crei: "CREI Method",
          points: [
            {
              trad: "Focus on punishment and restriction as a mechanism of control.",
              crei: "Focus on deep trauma and emotional restructuring.",
            },
            {
              trad: "Total isolation from the outside world during treatment.",
              crei: "Gradual reintegration and real-life skills building.",
            },
            {
              trad: "The patient is treated entirely alone.",
              crei: "Integral treatment including family intervention and coaching.",
            },
            {
              trad: "Motivation based on fear or institutional discipline.",
              crei: "Motivation based on personal purpose and human dignity.",
            },
          ],
        }
      : {
          label: "El Cambio de Paradigma",
          title: "Método CREI",
          subtitle:
            "Un enfoque clínico centrado en la dignidad y la arquitectura de la mente, alejándonos por completo de los modelos de castigo.",
          trad: "Modelo Tradicional",
          crei: "Método CREI",
          points: [
            {
              trad: "Enfoque en el castigo y la restricción como mecanismo de control.",
              crei: "Enfoque en el trauma profundo y la reestructuración emocional.",
            },
            {
              trad: "Aislamiento total del mundo exterior durante el tratamiento.",
              crei: "Reinserción gradual y construcción de habilidades para la vida real.",
            },
            {
              trad: "El paciente es tratado de forma completamente aislada.",
              crei: "Tratamiento integral que incluye intervención y coaching familiar.",
            },
            {
              trad: "Motivación basada en el miedo o la disciplina institucional.",
              crei: "Motivación basada en el propósito personal y la dignidad humana.",
            },
          ],
        };

  return (
    <section className="py-24 bg-[#0e0720] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase text-accent mb-4 block"
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            {copy.subtitle}
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* CREI Method */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-accent/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-accent/10"
          >
            <div className="absolute inset-0">
              <Image
                src="/method-compare.png"
                alt="CREI Light"
                fill
                className="object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0720] via-[#0e0720]/80 to-transparent" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-serif font-bold text-accent mb-8 pb-6 border-b border-accent/20 uppercase tracking-widest text-center">
                {copy.crei}
              </h3>
              <ul className="space-y-8">
                {copy.points.map((p, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-primary leading-relaxed text-sm md:text-base font-medium">
                      {p.crei}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
