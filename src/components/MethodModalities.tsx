"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Home, Phone, Users, ShieldAlert } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function MethodModalities() {
  const { lang } = useI18n();

  const copy =
    lang === "en"
      ? {
          label: "Treatment Modalities",
          title: "Adapting the Method to You",
          subtitle: "We tailor a custom approach just for you",
          modalities: [
            {
              title: "Ambulatory Coaching",
              desc: "Intensive therapy and coaching sessions while the patient continues living at home and working. For early-stage addiction or post-residential maintenance.",
              icon: Phone,
            },
            {
              title: "Family Intervention",
              desc: "Specialized clinical sessions for the family core. We train families on how to communicate, build boundaries, and execute a crisis intervention.",
              icon: Users,
            },
          ],
        }
      : {
          label: "Modalidades de Tratamiento",
          title: "Adaptando el Método a Ti",
          subtitle: "Adaptamos un traje a la medida para ti",
          modalities: [
            {
              title: "Coaching Ambulatorio",
              desc: "Sesiones intensivas de terapia y coaching mientras el paciente continúa viviendo en casa y trabajando. Para etapas tempranas o mantenimiento.",
              icon: Phone,
            },
            {
              title: "Intervención Familiar",
              desc: "Sesiones clínicas exclusivas para el núcleo familiar. Entrenamos a las familias en cómo comunicarse, fijar límites y ejecutar una intervención de crisis.",
              icon: Users,
            },
          ],
        };

  return (
    <section className="py-24 bg-[#0e0720] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {copy.modalities.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/60 rounded-3xl p-8 hover:border-accent/30 transition-colors group cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <mod.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-bold text-primary mb-3">
                  {mod.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {mod.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Image */}
          <div className="lg:col-span-5 relative w-full aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image
              src="/method-modalities.png"
              alt="Treatment Modalities"
              fill
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0720] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
