"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Brain, FileText, Compass, CheckCircle2 } from "lucide-react";

export const serviceCategories = [
  {
    title: "Reestructuración en Adicciones",
    subtitle: "Más que dejar una sustancia, es recuperar tu libertad.",
    icon: ShieldCheck,
    items: [
      { title: "Intervención en Crisis", desc: "Guía inmediata para familias en momentos críticos." },
      { title: "Canalización Especializada", desc: "Selección del centro de rehabilitación (residencial o ambulatorio) que mejor se adapte al perfil clínico y humano del paciente." },
      { title: "Acompañamiento Post-Tratamiento", desc: "Prevención de recaídas y reinserción social con herramientas de inteligencia emocional aplicadas." }
    ]
  },
  {
    title: "Salud Mental y Equilibrio Psicológico",
    subtitle: "La estabilidad emocional es el cimiento de tu éxito.",
    icon: Brain,
    items: [
      { title: "Psicoterapia Individual", desc: "Enfoque profundo en depresión, ansiedad, trauma y gestión de emociones." },
      { title: "Psiquiatría de Enlace", desc: "Gestión médica y farmacológica responsable, integrada con el proceso terapéutico." },
      { title: "Terapia de Pareja y Familia", desc: "Sanar los vínculos para que el entorno sea un aliado, no un detonante." }
    ]
  },
  {
    title: "Diagnóstico y Valoración Clínica",
    subtitle: "Entender el problema es el 50% de la solución.",
    icon: FileText,
    items: [
      { title: "Evaluaciones Multidimensionales", desc: "Análisis de la historia clínica, entorno familiar y estado psicométrico." },
      { title: "Segunda Opinión Médica", desc: "Claridad y certeza en diagnósticos complejos para trazar el camino correcto desde el inicio." }
    ]
  },
  {
    title: "Consultoría y Coaching de Vida",
    subtitle: "Liderazgo personal desde la consciencia.",
    icon: Compass,
    items: [
      { title: "Coaching Ejecutivo", desc: "Herramientas para manejar el estrés y mejorar la toma de decisiones bajo presión." },
      { title: "Talleres de Prevención", desc: "Educación para empresas y escuelas sobre el impacto de la salud mental en el rendimiento." }
    ]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Ambient Light Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6"
          >
            Nuestros Servicios
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            className="h-1 bg-accent mx-auto rounded-full mb-8" 
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-serif italic text-primary/80 max-w-4xl mx-auto leading-relaxed"
          >
            &ldquo;No tratamos síntomas, reconstruimos realidades a través de un modelo de intervención 360°.&rdquo;
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {serviceCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative bg-card border border-border/50 rounded-3xl p-8 hover:border-accent/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(194,178,128,0.2)] overflow-hidden"
            >
              {/* Card Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <category.icon className="w-8 h-8 transition-colors" />
                  </div>
                  <span className="text-6xl font-serif font-bold text-muted-foreground/10 select-none">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                  {category.title}
                </h3>
                <p className="text-accent-foreground/80 font-medium mb-8 italic">
                  {category.subtitle}
                </p>

                <div className="space-y-6">
                  {category.items.map((subItem, subIndex) => (
                    <div key={subIndex} className="flex gap-4 group/item">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0 group-hover/item:text-primary transition-colors" />
                      <div>
                        <h4 className="font-bold text-primary text-lg mb-1">
                          {subItem.title}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {subItem.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
