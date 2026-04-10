"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { HeartHandshake, Flame, Users, Briefcase } from "lucide-react";

export default function WhoWeHelp() {
  const { lang } = useI18n();
  const copy = lang === "en"
    ? {
        label: "Who We Serve",
        title: "Addiction Doesn't Choose.",
        titleAccent: "Neither Do We.",
        subtitle: "We accompany every person — regardless of their background, substance, or stage of addiction.",
        profiles: [
          {
            icon: Flame,
            title: "People in Active Addiction",
            desc: "Whether alcohol, opioids, stimulants or other substances — we intervene, stabilize, and guide you toward a structured recovery.",
            image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop",
            color: "from-rose-900/60"
          },
          {
            icon: Users,
            title: "Families in Crisis",
            desc: '"There isn\'t an addict in the family, there is a sick family." We work with partners, parents and siblings to set boundaries, understand enabling, and build recovery around the patient.',
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
            color: "from-violet-900/60"
          },
          {
            icon: HeartHandshake,
            title: "Life Project",
            desc: "The hardest phase begins upon leaving inpatient care. We provide relapse prevention tools, social reintegration support, and ongoing coaching for sustained sobriety.",
            image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&auto=format&fit=crop",
            color: "from-black/90"
          },
          {
            icon: Briefcase,
            title: "Executives & High Performers",
            desc: "High-functioning addiction is real and treatable. Discreet, confidential care designed for professionals who cannot afford downtime.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
            color: "from-sky-900/60"
          }
        ],
        cta: "Talk to a Specialist",
        ctaHref: "#contacto"
      }
    : {
        label: "A Quién Ayudamos",
        title: "La adicción no elige.",
        titleAccent: "Nosotros tampoco.",
        subtitle: "Acompañamos a cada persona — sin importar su historia, sustancia o etapa de la adicción.",
        profiles: [
          {
            icon: Flame,
            title: "Personas en Adicción Activa",
            desc: "Sea alcohol, opiáceos, estimulantes u otras sustancias — intervenimos, estabilizamos y guiamos hacia una recuperación estructurada.",
            image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop",
            color: "from-rose-900/60"
          },
          {
            icon: Users,
            title: "Familias en Crisis",
            desc: '"No hay un adicto en la familia, hay una familia enferma". Trabajamos con parejas, padres y hermanos para fijar límites, entender la co-dependencia y construir una red de apoyo real.',
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
            color: "from-violet-900/60"
          },
          {
            icon: HeartHandshake,
            title: "Proyecto de Vida",
            desc: "La etapa más difícil comienza al salir del internamiento. Proveemos herramientas de prevención de recaídas, soporte de reinserción social y coaching de sobriedad.",
            image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&auto=format&fit=crop",
            color: "from-black/90"
          },
          {
            icon: Briefcase,
            title: "Ejecutivos y Profesionistas",
            desc: "La adicción funcional existe y se puede tratar. Atención discreta y confidencial diseñada para personas que no pueden permitirse tiempos de inactividad.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
            color: "from-sky-900/60"
          }
        ],
        cta: "Habla con un Especialista",
        ctaHref: "#contacto"
      };

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase text-accent block mb-4"
          >
            {copy.label}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight"
          >
            {copy.title}<br />
            <span className="italic font-light text-primary/80">{copy.titleAccent}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-muted-foreground"
          >
            {copy.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {copy.profiles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-lg hover:shadow-2xl transition-shadow"
            >
              <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-t ${p.color} via-black/40 to-transparent`} />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
                  <p.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-serif font-bold text-xl mb-2 leading-snug">{p.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href={`#contacto`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors text-sm tracking-wide uppercase shadow-lg shadow-primary/20"
          >
            {copy.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
