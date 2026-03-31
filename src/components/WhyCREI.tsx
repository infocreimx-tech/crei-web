"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Shield, FlaskConical, Handshake } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function WhyCREI() {
  const { lang } = useI18n();
  const copy = lang === "en"
    ? {
        label: "Why CREI",
        title: "Real Difference.",
        titleAccent: "Measured Results.",
        features: [
          {
            icon: Shield,
            title: "Strict Clinical Ethics",
            desc: "CREI operates under strict clinical ethics. No unnecessary hospitalizations. No hidden fees. We match each patient with the setting that truly serves them — not the most profitable one.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=900&auto=format&fit=crop"
          },
          {
            icon: FlaskConical,
            title: "Evidence + Experience",
            desc: "We combine evidence-based methodologies (CBT, motivational interviewing, trauma-informed care) with the lived insight of a director who has walked the path of addiction and recovery himself.",
            image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=900&auto=format&fit=crop"
          },
          {
            icon: Handshake,
            title: "Family-Centered Approach",
            desc: "Addiction doesn't happen in isolation — and neither does recovery. We bring families into the process with structured sessions, practical tools, and real communication strategies.",
            image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=900&auto=format&fit=crop"
          }
        ],
        cta: "Read Our Full Approach",
        ctaHref: `/${lang}/metodo`
      }
    : {
        label: "Por Qué CREI",
        title: "Diferencia Real.",
        titleAccent: "Resultados Medibles.",
        features: [
          {
            icon: Shield,
            title: "Ética Clínica Estricta",
            desc: "CREI opera bajo estricta ética clínica. Sin internaciones innecesarias. Sin costos ocultos. Conectamos a cada paciente con el entorno que realmente le sirve — no el más rentable.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=900&auto=format&fit=crop"
          },
          {
            icon: FlaskConical,
            title: "Evidencia + Experiencia Vivida",
            desc: "Combinamos metodologías con respaldo científico (TCC, entrevista motivacional, atención informada en trauma) con la sabiduría vivencial de un director que ha recorrido el camino de la adicción y la recuperación.",
            image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=900&auto=format&fit=crop"
          },
          {
            icon: Handshake,
            title: "Enfoque Centrado en la Familia",
            desc: "La adicción no ocurre en aislamiento — y la recuperación tampoco. Integramos a las familias al proceso con sesiones estructuradas, herramientas prácticas y estrategias de comunicación reales.",
            image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=900&auto=format&fit=crop"
          }
        ],
        cta: "Conoce Nuestro Enfoque Completo",
        ctaHref: `/${lang}/metodo`
      };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
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
            className="text-4xl md:text-5xl font-serif font-bold text-primary"
          >
            {copy.title}<br />
            <span className="italic font-light text-primary/80">{copy.titleAccent}</span>
          </motion.h2>
        </div>

        <div className="space-y-16">
          {copy.features.map((f, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
              >
                <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
                    <Image src={f.image} alt={f.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  </div>
                </div>
                <div className={`${isEven ? "order-2" : "order-2 lg:order-1"} space-y-4`}>
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href={copy.ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm tracking-wide uppercase"
          >
            {copy.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
