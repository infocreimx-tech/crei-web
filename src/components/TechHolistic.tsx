"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { Sparkles } from "lucide-react";

export default function TechHolistic() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          tag: "Neural Integration",
          title: "Holistic Therapy Synthesis",
          desc: "Healing must address the whole system. We merge modern clinical tech with ancestral wisdom. Sound therapy, bio-frequencies, and guided meditation are utilized to cement new neural pathways and ensure the patient leaves the clinic fully stabilized and centered.",
          features: [
            "Tibetan sound bowl frequencies",
            "Tuning forks for energetic alignment",
            "Guided somatic meditation",
            "Post-exposure nervous system stabilization"
          ]
        }
      : {
          tag: "Integración Neuronal",
          title: "Síntesis de Terapia Holística",
          desc: "La sanación debe abordar el sistema completo. Fusionamos tecnología clínica moderna con sabiduría ancestral. La sonoterapia, biofrecuencias y meditación guiada se utilizan para cimentar nuevas vías neuronales y garantizar que el paciente salga estabilizado y centrado.",
          features: [
            "Frecuencias de cuencos tibetanos",
            "Diapasones para alineación energética",
            "Meditación somática guiada",
            "Estabilización post-exposición del sistema nervioso"
          ]
        };

  return (
    <section className="py-24 bg-[#150b24] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image (Left) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="order-2 lg:order-1 relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image src="/tech-holistic.png" alt="Holistic Therapy" fill className="object-cover hover:scale-105 transition-transform duration-1000" />
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
                  <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
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
