"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Brain, FileText, Compass, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/messages";

export function getServiceCategories(lang: Locale) {
  return lang === "en"
    ? [
        {
          title: "Addiction Restructuring",
          subtitle: "More than quitting a substance—it's reclaiming your freedom.",
          icon: ShieldCheck,
          items: [
            { title: "Crisis Intervention", desc: "Immediate guidance for families in critical moments." },
            {
              title: "Specialized Placement",
              desc: "Selecting the rehabilitation setting (residential or outpatient) that best fits the patient's clinical profile and human needs."
            },
            {
              title: "Post-Treatment Support",
              desc: "Relapse prevention and social reintegration using applied emotional intelligence tools."
            }
          ]
        },
        {
          title: "Mental Health & Psychological Balance",
          subtitle: "Emotional stability is the foundation of your success.",
          icon: Brain,
          items: [
            { title: "Individual Psychotherapy", desc: "Deep work on depression, anxiety, trauma, and emotion regulation." },
            { title: "Consult-Liaison Psychiatry", desc: "Responsible medical and pharmacological management integrated with therapy." },
            { title: "Couples & Family Therapy", desc: "Heal relationships so your environment becomes an ally, not a trigger." }
          ]
        },
        {
          title: "Diagnosis & Clinical Assessment",
          subtitle: "Understanding the problem is 50% of the solution.",
          icon: FileText,
          items: [
            { title: "Multidimensional Evaluations", desc: "Analysis of clinical history, family context, and psychometric status." },
            { title: "Second Medical Opinion", desc: "Clarity in complex diagnoses to chart the right path from the start." }
          ]
        },
        {
          title: "Addiction Consulting & Coaching",
          subtitle: "Personal leadership in sobriety and relapse prevention.",
          icon: Compass,
          items: [
            { title: "Sobriety Coaching", desc: "Strategies for triggers and cravings, habit-building, and sustaining change." },
            {
              title: "Addiction Prevention Workshops",
              desc: "Programs for companies and schools: early detection, risk reduction, and response protocols."
            }
          ]
        }
      ]
    : [
        {
          title: "Reestructuración en Adicciones",
          subtitle: "Más que dejar una sustancia, es recuperar tu libertad.",
          icon: ShieldCheck,
          items: [
            { title: "Intervención en Crisis", desc: "Guía inmediata para familias en momentos críticos." },
            {
              title: "Canalización Especializada",
              desc: "Selección del centro de rehabilitación (residencial o ambulatorio) que mejor se adapte al perfil clínico y humano del paciente."
            },
            {
              title: "Acompañamiento Post-Tratamiento",
              desc: "Prevención de recaídas y reinserción social con herramientas de inteligencia emocional aplicadas."
            }
          ]
        },
        {
          title: "Salud Mental y Equilibrio Psicológico",
          subtitle: "La estabilidad emocional es el cimiento de tu éxito.",
          icon: Brain,
          items: [
            {
              title: "Psicoterapia Individual",
              desc: "Enfoque profundo en depresión, ansiedad, trauma y gestión de emociones."
            },
            {
              title: "Psiquiatría de Enlace",
              desc: "Gestión médica y farmacológica responsable, integrada con el proceso terapéutico."
            },
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
          title: "Consultoría y Coaching en Adicciones",
          subtitle: "Liderazgo personal en sobriedad y prevención de recaídas.",
          icon: Compass,
          items: [
            {
              title: "Coaching de Sobriedad",
              desc: "Estrategias para manejar disparadores y craving, construir hábitos y sostener cambios."
            },
            {
              title: "Talleres de Prevención de Adicciones",
              desc: "Programas para empresas y escuelas: detección temprana, reducción de riesgos y protocolos de actuación."
            }
          ]
        }
      ];
}

export const serviceCategories = getServiceCategories("es");

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
  const { lang } = useI18n();
  const categories = getServiceCategories(lang);
  const copy =
    lang === "en"
      ? {
          label: "Our Services",
          title: "Services",
          quote: "“We don’t treat symptoms—we rebuild realities through a 360° intervention model.”",
          statsTitle: "Our Impact, Year After Year",
          stats: [
            { value: "25,000+", label: "People guided annually" },
            { value: "15+", label: "Years of clinical experience" },
            { value: "360°", label: "Comprehensive intervention model" },
            { value: "100%", label: "Personalized treatment" },
          ]
        }
      : {
          label: "Lo que hacemos",
          title: "Nuestros Servicios",
          quote: "“No tratamos síntomas, reconstruimos realidades a través de un modelo de intervención 360°.”",
          statsTitle: "Nuestro impacto, año con año",
          stats: [
            { value: "25,000+", label: "Personas acompañadas anualmente" },
            { value: "15+", label: "Años de experiencia clínica" },
            { value: "360°", label: "Modelo de intervención integral" },
            { value: "100%", label: "Tratamiento personalizado" },
          ]
        };

  return (
    <section id="servicios" className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Ambient Light Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-4 block"
          >
            {copy.label}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6"
          >
            {copy.title}
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
            className="text-xl md:text-2xl font-serif italic text-primary/80 max-w-4xl mx-auto leading-relaxed"
          >
            {copy.quote}
          </motion.p>
        </div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {copy.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border/60 rounded-2xl p-6 text-center hover:border-accent/40 transition-colors"
            >
              <p className="text-3xl md:text-4xl font-serif font-extrabold text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider leading-snug">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {categories.map((category, index) => (
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
