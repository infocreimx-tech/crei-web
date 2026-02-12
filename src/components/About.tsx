"use client";

import { motion } from "framer-motion";
import { Heart, Brain, Users } from "lucide-react";

const pillars = [
  {
    title: "Compasión sin Juicio",
    description: "Entendemos tu dolor porque caminamos a tu lado.",
    icon: Heart,
  },
  {
    title: "Precisión Diagnóstica",
    description: "No hay soluciones genéricas; cada mente es un mundo que requiere un mapa personalizado.",
    icon: Brain,
  },
  {
    title: "Acompañamiento 360°",
    description: "Desde la primera llamada hasta la reintegración social, nunca caminarás solo.",
    icon: Users,
  },
];

export default function About() {
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
            Quiénes Somos
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight"
          >
            La Reestructuración Emocional: <br />
            <span className="italic text-primary/80">Nuestra Razón de Ser</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed space-y-6"
          >
            <p>
              En <strong>CREI (Centro de Reestructuración Emocional Integral)</strong>, entendemos que las crisis emocionales y las adicciones no son el fin de la historia, sino el punto de partida para una transformación profunda. No somos solo un centro de enlace; somos un equipo de especialistas dedicados a reconstruir vidas desde la raíz.
            </p>
            <p>
              Nuestra filosofía se basa en la <strong>inteligencia aplicada al bienestar</strong>: combinar la calidez humana con metodologías clínicas avanzadas para que cada paciente recupere no solo su salud, sino su propósito. En CREI, creemos que la recuperación no es un proceso lineal, sino una reestructuración integral de la identidad, el entorno y las emociones.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {pillars.map((pillar, index) => (
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
