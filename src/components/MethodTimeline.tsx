"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

export default function MethodTimeline() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          label: "The Journey",
          title: "Focus on Creating a Life Model",
          subtitle: "",
          phases: [
            {
              title: "Stabilization & Rescue",
              desc: "",
            },
            {
              title: "Awareness & Clearing",
              desc: "",
            },
            {
              title: "Reconstruction",
              desc: "",
            },
            {
              title: "Sustainable Design",
              desc: "",
            },
          ],
        }
      : {
          label: "El Camino",
          title: "Enfoque Crear un Modelo de Vida",
          subtitle: "",
          phases: [
            {
              title: "Estabilización y Rescate",
              desc: "",
            },
            {
              title: "Conciencia y Limpieza",
              desc: "",
            },
            {
              title: "Reconstrucción",
              desc: "",
            },
            {
              title: "Diseño Sostenible",
              desc: "",
            },
          ],
        };

  return (
    <section className="py-24 bg-[#150b24] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text/Timeline */}
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
            {copy.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg leading-relaxed mb-12"
              >
                {copy.subtitle}
              </motion.p>
            )}

            <div className="space-y-8 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-white/10" />
              {copy.phases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1.5 w-[32px] h-[32px] rounded-full bg-[#150b24] border-4 border-accent shadow-lg shadow-accent/20 z-10" />
                  <h3 className="text-xl font-serif font-bold text-primary mb-2">
                    {phase.title}
                  </h3>
                  {phase.desc && (
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {phase.desc}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50"
          >
            <Image
              src="/method-timeline.png"
              alt="Timeline of Recovery Compass"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#150b24] via-[#150b24]/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
