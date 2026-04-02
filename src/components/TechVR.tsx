"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { Eye } from "lucide-react";

export default function TechVR() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          tag: "Controlled Processing",
          title: "Virtual Reality (VR) Exposure",
          desc: "We utilize hyper-realistic immersive environments to safely expose patients to their real-world triggers. Instead of just talking about a crowded bar or a stressful conflict, the patient experiences it virtually while the therapist monitors and guides emotional regulation.",
          features: [
            "Safe, controlled trigger exposure",
            "Real-time physiological monitoring",
            "Gradual desensitization protocols",
            "Immediate session pausing if needed"
          ]
        }
      : {
          tag: "Procesamiento Controlado",
          title: "Exposición en Realidad Virtual",
          desc: "Utilizamos entornos inmersivos hiperrealistas para exponer de forma segura a los pacientes a sus detonantes del mundo real. En lugar de solo hablar de un bar lleno o un conflicto estresante, el paciente lo vive virtualmente mientras el terapeuta monitorea y guía su regulación emocional.",
          features: [
            "Exposición segura y controlada a detonantes",
            "Monitoreo fisiológico en tiempo real",
            "Protocolos de desensibilización gradual",
            "Pausa inmediata de la sesión si es necesario"
          ]
        };

  return (
    <section className="py-24 bg-[#0e0720] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content (Left) */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
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
                  <Eye className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-white/80 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image (Right) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image src="/tech-usage.png" alt="VR Exposure Therapy" fill className="object-cover hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0720] via-transparent to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
