"use client";

import { motion } from "framer-motion";
import { Heart, Brain, Users, Mic, BookOpen, Award } from "lucide-react";
import Image from "next/image";
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
              At <strong>CREI (Comprehensive Emotional Restructuring Center)</strong>, we specialize in accompanying people living with addiction and emotional crises, guiding them and their families through a deep, structured, and humane transformation process — from the first crisis call to long-term social reintegration.
            </>
          ),
          p2: (
            <>
              We are not simply a referral center. We are a multidisciplinary team of clinical specialists who believe that behind every addiction is a pain that deserves to be heard, understood, and restructured. Our approach integrates <strong>individual psychotherapy, psychiatric management, crisis intervention, and coaching for sobriety</strong> — all backed by an ethics of unconditional respect.
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
          ],
          directorLabel: "Director & Founder",
          directorName: "CREI Director",
          directorRole: "Addictions Therapist · Conferencista · Director",
          directorBio: [
            "Director of CREI (Comprehensive Emotional Restructuring Center), an institution specializing in the rehabilitation of people with addiction and behavioral issues — with a focus on substance dependency, emotional and behavioral therapy, and social reintegration.",
            "Before practicing professionally, he lived through years of severe addiction that led to criminal conduct and a prison sentence. During and after that process, he began his own rehabilitation — which motivated him to study psychology and specialize in addictions, combining rigorous academic training with lived experience.",
            "Today, he shares his experience through conferences, podcasts and media appearances — reaching thousands of families looking for clarity, hope, and a real path toward recovery.",
          ],
          directorTags: [
            { label: "Addictions Therapist", icon: Brain },
            { label: "Public Speaker", icon: Mic },
            { label: "Podcast & Media", icon: Mic },
            { label: "Vivential Approach", icon: BookOpen },
            { label: "Director CREI", icon: Award },
          ],
          directorQuote: "\"Recovery is not a destination — it is a daily, conscious reconstruction of who you choose to be.\""
        }
      : {
          label: "Quiénes Somos",
          headingA: "La Reestructuración Emocional:",
          headingB: "Nuestra Razón de Ser",
          p1: (
            <>
              En <strong>CREI (Centro de Reestructuración Emocional Integral)</strong>, nos especializamos en acompañar a personas que viven con adicciones y crisis emocionales, guiándolas a ellas y a sus familias a través de un proceso de transformación profundo, estructurado y humano — desde la primera llamada de crisis hasta la reinserción social duradera.
            </>
          ),
          p2: (
            <>
              No somos simplemente un centro de enlace. Somos un equipo multidisciplinario de especialistas clínicos que creemos que detrás de cada adicción hay un dolor que merece ser escuchado, comprendido y reestructurado. Nuestro enfoque integra <strong>psicoterapia individual, manejo psiquiátrico, intervención en crisis y coaching para la sobriedad</strong>, respaldado siempre por una ética de respeto incondicional.
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
          ],
          directorLabel: "Director y Fundador",
          directorName: "Director CREI",
          directorRole: "Terapeuta en Adicciones · Conferencista · Director",
          directorBio: [
            "Director del CREI (Centro de Reestructuración Emocional Integral), institución enfocada en la rehabilitación de personas con adicciones y problemas conductuales. Su trabajo se centra en el tratamiento de adicciones a sustancias, terapia emocional y conductual, y procesos de reinserción social.",
            "Antes de ejercer profesionalmente, vivió durante años una adicción severa que lo llevó a conductas delictivas y a cumplir una sentencia en prisión. Durante y después de ese proceso inició su rehabilitación, lo que lo motivó a estudiar psicología y especializarse en adicciones, con un enfoque basado tanto en formación académica como en experiencia vivencial.",
            "Hoy comparte su experiencia a través de conferencias, podcasts y apariciones en medios — llegando a miles de familias que buscan claridad, esperanza y un camino real hacia la recuperación.",
          ],
          directorTags: [
            { label: "Terapeuta en Adicciones", icon: Brain },
            { label: "Conferencista", icon: Mic },
            { label: "Podcasts y Medios", icon: Mic },
            { label: "Enfoque Vivencial", icon: BookOpen },
            { label: "Director CREI", icon: Award },
          ],
          directorQuote: "\"La recuperación no es un destino — es una reconstrucción diaria y consciente de quien decides ser.\""
        };

  return (
    <section id="nosotros" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
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

        {/* Pillars */}
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

        {/* Director Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-24 rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Photo Column */}
            <div className="relative min-h-[420px] lg:min-h-[560px] bg-muted overflow-hidden">
              <Image
                src="/director.jpeg"
                alt="Director CREI"
                fill
                className="object-cover object-center"
                unoptimized
              />
              {/* Overlay gradient for the text badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-xs font-bold tracking-widest uppercase text-white/70 block mb-1">
                  {content.directorLabel}
                </span>
                <p className="text-white font-serif text-xl font-bold">{content.directorName}</p>
                <p className="text-white/70 text-sm mt-0.5">{content.directorRole}</p>
              </div>
            </div>

            {/* Bio Column */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {/* Quote */}
                <blockquote className="text-lg md:text-xl font-serif italic text-primary/90 leading-relaxed mb-8 border-l-4 border-accent pl-5">
                  {content.directorQuote}
                </blockquote>

                {/* Bio paragraphs */}
                <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px] mb-8">
                  {content.directorBio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {content.directorTags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-xs font-semibold text-primary tracking-wide"
                    >
                      <tag.icon className="w-3.5 h-3.5 text-accent" />
                      {tag.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
