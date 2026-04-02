"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { CheckCircle2 } from "lucide-react";

export default function Tech4DChair() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          tag: "Somatic Decompression",
          title: "4D Zero-Gravity Massage Chair",
          desc: "Before addressing the mind, we must address the body's deeply stored trauma. The 4D chair is our first line of defense to dramatically lower cortisol levels and safely disarm the nervous system upon arrival.",
          features: [
            "Zero Gravity Positioning for spine relief",
            "Deep Tissue Somatic Release",
            "Cortisol and adrenaline reduction",
            "Vibration therapy to calm the vagus nerve"
          ]
        }
      : {
          tag: "Descompresión Somática",
          title: "Sillón de Masaje 4D Zero-Gravity",
          desc: "Antes de abordar la mente, debemos abordar el trauma profundo almacenado en el cuerpo. El sillón 4D es nuestra primera línea de defensa para reducir drásticamente los niveles de cortisol y desarmar el sistema nervioso de forma segura al llegar.",
          features: [
            "Posición Gravedad Cero para liberar la columna",
            "Liberación somática de tejido profundo",
            "Reducción acelerada de adrenalina y cortisol",
            "Terapia de vibración para calmar el nervio vago"
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
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-white/80 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image (Right) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image src="/tech-4dchair.png" alt="4D Massage Chair" fill className="object-cover hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0720] via-transparent to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
