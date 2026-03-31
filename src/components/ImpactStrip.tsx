"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";

export default function ImpactStrip() {
  const { lang } = useI18n();
  const stats = lang === "en"
    ? [
        { value: "25,000+", label: "People supported annually" },
        { value: "15+", label: "Years of clinical experience" },
        { value: "296M", label: "Affected globally (UNODC)" },
        { value: "24 / 7", label: "Crisis support available" },
      ]
    : [
        { value: "25,000+", label: "Personas acompañadas al año" },
        { value: "15+", label: "Años de experiencia clínica" },
        { value: "296M", label: "Afectados a nivel global (UNODC)" },
        { value: "24 / 7", label: "Apoyo en crisis disponible" },
      ];

  return (
    <section className="bg-primary py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,92,191,0.3),_transparent_70%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl md:text-5xl font-serif font-extrabold text-white mb-2 drop-shadow">{s.value}</p>
              <p className="text-sm text-primary-foreground/70 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
