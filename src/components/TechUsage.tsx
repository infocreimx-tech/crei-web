"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Glasses, ActivitySquare, Cpu, Wifi } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function TechUsage() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          label: "In Action",
          title: "Our Clinical Technology",
          subtitle:
            "At CREI, technology is a bridge to deep healing. We use state-of-the-art restorative tools designed to measure, relax, and restructure both mind and body safely.",
          cards: [
            {
              icon: Glasses,
              title: "Virtual Reality (VR)",
              desc: "Immersive VR environments used for safe exposure therapy, allowing patients to face triggers and practice emotional regulation in a highly controlled setting.",
            },
            {
              icon: ActivitySquare,
              title: "Bio-Well Scanner",
              desc: "A revolutionary scientific tool that captures the energy field (bio-photons). It provides real-time data on the patient's stress levels and nervous system alignment.",
            },
            {
              icon: Cpu,
              title: "4D Zero-Gravity Massage Chair",
              desc: "Advanced somatic therapy that dramatically lowers cortisol levels. We use it to physically prepare the patient for deep psychological work, releasing stored trauma from the body.",
            },
            {
              icon: Wifi,
              title: "Holistic Therapy Integration",
              desc: "We merge cutting-edge tech with ancestral wisdom: sound therapy, biofrequencies, and guided meditation to treat the human being as a complete, interconnected system.",
            },
          ],
        }
      : {
          label: "En Acción",
          title: "Nuestra Tecnología Clínica",
          subtitle:
            "En CREI, la tecnología es un puente hacia la sanación profunda. Utilizamos herramientas restaurativas de vanguardia diseñadas para medir, relajar y reestructurar mente y cuerpo de forma segura.",
          cards: [
            {
              icon: Glasses,
              title: "Realidad Virtual (VR)",
              desc: "Entornos inmersivos de VR utilizados para terapia de exposición segura, permitiendo a los pacientes enfrentar detonadores y practicar regulación emocional en un ambiente hipercontrolado.",
            },
            {
              icon: ActivitySquare,
              title: "Lector Bio-Well",
              desc: "Una herramienta científica revolucionaria que captura el campo energético (biofotones). Proporciona datos en tiempo real sobre los niveles de estrés y la alineación del sistema nervioso del paciente.",
            },
            {
              icon: Cpu,
              title: "Sillón de Masaje 4D",
              desc: "Terapia somática avanzada que reduce drásticamente los niveles de cortisol. Lo utilizamos para preparar físicamente al paciente para el trabajo psicológico profundo, liberando trauma almacenado.",
            },
            {
              icon: Wifi,
              title: "Terapia Holística",
              desc: "Fusionamos tecnología de punta con sabiduría ancestral: sonoterapia, biofrecuencias y meditación guiada para tratar al ser humano como un sistema completo e interconectado.",
            },
          ],
        };

  return (
    <section className="py-24 bg-[#150b24] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text/Cards */}
          <div className="order-2 lg:order-1">
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
              className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight"
            >
              {copy.title}
            </motion.h2>
            <div className="w-12 h-1 bg-accent rounded-full mb-8" />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg leading-relaxed mb-12"
            >
              {copy.subtitle}
            </motion.p>

            <div className="space-y-6">
              {copy.cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border/60 rounded-3xl p-6 flex gap-6 items-start hover:border-accent/40 transition-colors group"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <card.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative w-full aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5"
          >
            <Image
              src="/tech-usage.png"
              alt="VR Exposure Therapy"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#150b24] via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
