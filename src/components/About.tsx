"use client";

import { motion } from "framer-motion";
import { Heart, Brain, Users } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function About() {
  const { lang } = useI18n();
  const content =
    lang === "en"
      ? {
          label: "About",
          headingA: "Emotional Restructuring:",
          headingB: "Our Purpose",
          p1: (
            <>
              At <strong>CREI (Comprehensive Emotional Restructuring Center)</strong>, we understand that emotional crises and addictions are not the end of the story, but the starting point for deep transformation. We are not only a referral center; we are a specialist team committed to rebuilding lives from the root.
            </>
          ),
          p2: (
            <>
              Our philosophy is built on <strong>intelligence applied to wellbeing</strong>: combining human warmth with advanced clinical methods so each patient recovers not only health, but purpose. At CREI, we believe recovery is not linear—it is a comprehensive restructuring of identity, environment, and emotions.
            </>
          ),
          pillars: [
            {
              title: "Compassion Without Judgment",
              description: "We understand your pain because we walk alongside you.",
              icon: Heart
            },
            {
              title: "Diagnostic Precision",
              description: "No generic solutions—every mind is a world that deserves a personalized map.",
              icon: Brain
            },
            {
              title: "360° Support",
              description: "From the first call to reintegration, you will not walk alone.",
              icon: Users
            }
          ]
        }
      : {
          label: "Quiénes Somos",
          headingA: "La Reestructuración Emocional:",
          headingB: "Nuestra Razón de Ser",
          p1: (
            <>
              En <strong>CREI (Centro de Reestructuración Emocional Integral)</strong>, entendemos que las crisis emocionales y las adicciones no son el fin de la historia, sino el punto de partida para una transformación profunda. No somos solo un centro de enlace; somos un equipo de especialistas dedicados a reconstruir vidas desde la raíz.
            </>
          ),
          p2: (
            <>
              Nuestra filosofía se basa en la <strong>inteligencia aplicada al bienestar</strong>: combinar la calidez humana con metodologías clínicas avanzadas para que cada paciente recupere no solo su salud, sino su propósito. En CREI, creemos que la recuperación no es un proceso lineal, sino una reestructuración integral de la identidad, el entorno y las emociones.
            </>
          ),
          pillars: [
            {
              title: "Compasión sin Juicio",
              description: "Entendemos tu dolor porque caminamos a tu lado.",
              icon: Heart
            },
            {
              title: "Precisión Diagnóstica",
              description: "No hay soluciones genéricas; cada mente es un mundo que requiere un mapa personalizado.",
              icon: Brain
            },
            {
              title: "Acompañamiento 360°",
              description: "Desde la primera llamada hasta la reintegración social, nunca caminarás solo.",
              icon: Users
            }
          ]
        };

  return (
    <section id="nosotros" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] uppercase text-accent-foreground mb-4 block"
          >
            {content.label}
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight"
          >
            {content.headingA} <br />
            <span className="italic text-primary/80">{content.headingB}</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed space-y-6"
          >
            <p>{content.p1}</p>
            <p>{content.p2}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {content.pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (index * 0.2) }}
              className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <pillar.icon className="w-8 h-8 text-primary group-hover:text-accent-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-serif">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
