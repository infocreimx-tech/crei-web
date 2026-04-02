"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

export default function AddictionFacts() {
  const { lang } = useI18n();

  const copy = lang === "en"
    ? {
        label: "Global Facts",
        title: "Addiction: The Numbers Behind the Crisis",
        subtitle: "Understanding the scale of the problem is the first step toward building real solutions.",
        facts: [
          { stat: "296M", desc: "People worldwide live with a drug use disorder (UNODC 2023)", color: "text-purple-400" },
          { stat: "1 in 7", desc: "People will develop a substance use disorder at some point in their life", color: "text-rose-400" },
          { stat: "75%", desc: "Of people with addiction never receive any form of clinical treatment", color: "text-amber-400" },
          { stat: "10×", desc: "The brain reduces natural dopamine production — making sobriety feel impossible without support", color: "text-emerald-400" },
          { stat: "9.5M", desc: "People in Mexico live with problematic alcohol or drug use", color: "text-sky-400" },
          { stat: "3 min", desc: "Estimated average wait time before a person in crisis reaches out — early intervention is critical", color: "text-violet-400" },
        ],
        imageAlt: "Recovery and hope",
        imageCaption: "Every number is a life. Every life deserves a real chance.",
        recovery: "Recovery Is Possible",
        recoveryText: "With proper counseling, personalized support, and a structured method, over 60% of people who enter structured addiction treatment achieve stable, sustained recovery. At CREI, that number is our daily goal."
      }
    : {
        label: "Datos Globales",
        title: "Adicción: Los Números Detrás de la Crisis",
        subtitle: "Comprender la magnitud del problema es el primer paso para construir soluciones reales.",
        facts: [
          { stat: "296M", desc: "Personas en el mundo viven con un trastorno por uso de sustancias (UNODC 2023)", color: "text-purple-400" },
          { stat: "1 de 7", desc: "Personas desarrollarán un trastorno de consumo de sustancias en algún momento de su vida", color: "text-rose-400" },
          { stat: "75%", desc: "De las personas con adicción nunca reciben ningún tipo de tratamiento clínico", color: "text-amber-400" },
          { stat: "10×", desc: "El cerebro reduce la producción natural de dopamina — haciendo imposible la sobriedad sin apoyo profesional", color: "text-emerald-400" },
          { stat: "9.5M", desc: "Personas en México viven con un consumo problemático de alcohol o drogas", color: "text-sky-400" },
          { stat: "3 min", desc: "Tiempo promedio estimado antes de que una persona en crisis se atreva a pedir ayuda — la intervención temprana es crítica", color: "text-violet-400" },
        ],
        imageAlt: "Recuperación y esperanza",
        imageCaption: "Cada número es una vida. Cada vida merece una oportunidad real.",
        recovery: "La Recuperación Es Posible",
        recoveryText: "Con asesoria adecuada, apoyo personalizado y un método estructurado, más del 60% de las personas que ingresan a tratamiento especializado logran una recuperación estable y sostenida. En CREI, ese número es nuestra meta diaria."
      };

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
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
            className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4"
          >
            {copy.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground leading-relaxed"
          >
            {copy.subtitle}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
        >
          {copy.facts.map((fact, i) => (
            <div
              key={i}
              className="bg-card border border-border/60 rounded-2xl p-6 hover:border-accent/30 transition-colors"
            >
              <p className={`text-3xl md:text-4xl font-serif font-extrabold mb-2 ${fact.color}`}>
                {fact.stat}
              </p>
              <p className="text-sm text-muted-foreground leading-snug">{fact.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Photo + Recovery card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl"
          >
            <Image
              src="/method-addiction.png"
              alt={copy.imageAlt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-6 right-6 text-white/90 text-sm font-medium italic">
              {copy.imageCaption}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/60 rounded-3xl p-8 md:p-10"
          >
            <div className="w-12 h-1 bg-accent rounded-full mb-6" />
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
              {copy.recovery}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {copy.recoveryText}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
