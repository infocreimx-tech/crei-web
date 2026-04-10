"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { Flame } from "lucide-react";

export default function TechHighImpact() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          tag: "Breakthrough Experiences",
          title: "HIGH IMPACT THERAPY",
          desc: "We push beyond traditional boundaries to forge unbreakable resilience. Through guided high-impact experiences like firewalking and glasswalking, patients learn to conquer their deepest fears, proving to themselves that what once seemed impossible is entirely within their power.",
          features: [
            "Firewalking for fear conquest",
            "Glasswalking for mental focus",
            "Guided breakthrough sessions",
            "Empowerment and resilience building"
          ]
        }
      : {
          tag: "Experiencias de Ruptura",
          title: "TERAPIA DE ALTO IMPACTO",
          desc: "Vamos más allá de los límites tradicionales para forjar una resiliencia inquebrantable. A través de experiencias guiadas de alto impacto como la caminata sobre fuego y la caminata sobre vidrio, los pacientes aprenden a conquistar sus miedos más profundos, demostrándose a sí mismos que lo que parecía imposible está bajo su control.",
          features: [
            "Caminata sobre fuego para conquistar el miedo",
            "Caminata sobre vidrio para el enfoque mental",
            "Sesiones guiadas de ruptura de límites",
            "Construcción de empoderamiento y resiliencia"
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
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight uppercase">
              {copy.title}
            </h2>
            <div className="w-12 h-1 bg-accent rounded-full mb-8" />
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {copy.desc}
            </p>
            <ul className="space-y-4">
              {copy.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-white/80 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image (Right) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image src="/tech-high-impact.png" alt="Terapia de Alto Impacto" fill className="object-cover hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0720] via-transparent to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
