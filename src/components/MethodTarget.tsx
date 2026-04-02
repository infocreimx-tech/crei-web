"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function MethodTarget() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          label: "Who Do We Help?",
          title: "The CREI Patient Profile",
          subtitle:
            "Our method is not for everyone. It is designed for those who have hit a wall with traditional approaches and are ready for structured, clinical, and empathetic intervention.",
          items: [
            {
              title: "Substance Addiction",
              desc: "Alcohol, prescription medications, stimulants, and other chemical dependencies that have taken control of daily life.",
            },
            {
              title: "Behavioral Disorders",
              desc: "Compulsive gambling, technology addiction, and destructive behavioral loops that isolated the individual.",
            },
            {
              title: "Family Codependency",
              desc: "For parents, partners, and children who are suffering the collateral damage of a loved one's addiction and need tools to set boundaries.",
            },
            {
              title: "Dual Diagnosis",
              desc: "Addiction co-occurring with deep depression, severe anxiety, or unresolved psychological trauma.",
            },
          ],
        }
      : {
          label: "¿Para Quién Es?",
          title: "El Perfil de Atención CREI",
          subtitle:
            "Nuestro método no es para todos. Está diseñado para quienes han tocado pared con enfoques tradicionales y están listos para una intervención estructurada, clínica y empática.",
          items: [
            {
              title: "Adicción a Sustancias",
              desc: "Alcohol, medicamentos recetados, estimulantes y otras dependencias químicas que han tomado el control de la vida diaria.",
            },
            {
              title: "Trastornos Conductuales",
              desc: "Juego compulsivo, adicción a la tecnología y ciclos de comportamiento destructivo que aíslan a la persona.",
            },
            {
              title: "Codependencia Familiar",
              desc: "Para padres, parejas e hijos que están sufriendo el daño colateral de la adicción de un ser querido y necesitan herramientas para poner límites.",
            },
            {
              title: "Diagnóstico Dual",
              desc: "Adicción que coexiste con depresión profunda, ansiedad severa o trauma psicológico no resuelto.",
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
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-border/50"
          >
            <Image
              src="/method-target.png"
              alt="Break free"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f2e] via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Text */}
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

            <div className="space-y-6">
              {copy.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary mb-2">
                      {item.title}
                    </h3>
                    {item.desc && (
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
