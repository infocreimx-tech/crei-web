"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { BrainCircuit, Activity, Network, ShieldCheck, HeartPulse, PieChart, Users, Compass } from "lucide-react";

export default function TechPillars() {
  const { lang } = useI18n();
  const copy =
    lang === "en"
      ? {
          principlesLabel: "Our Pillars",
          principles: [
            { icon: BrainCircuit, title: "Responsible AI", text: "We incorporate artificial intelligence responsibly to enrich the clinical process without replacing professional judgment. Our AI-assisted tools support assessment, case prioritization, and follow-up, with permanent human oversight." },
            { icon: Activity, title: "Predictive Models", text: "We develop predictive models and early warning systems that help identify risks and intervention needs. These capabilities enable timely action, improve continuity of care, and reduce relapse risk." },
            { icon: Network, title: "Multimodal Signals", text: "We combine clinical data with multimodal signals to build an integrated view of each patient. Advanced analytics turn fragmented information into actionable knowledge, improving therapeutic precision and personalization." },
            { icon: HeartPulse, title: "Remote Care", text: "Our remote care platforms integrate smooth, empathetic experiences, prioritizing usability and accessibility. The goal is to bring specialists closer to people and families, without technical friction or geographic barriers." },
            { icon: PieChart, title: "Clinical Outcomes", text: "We adopt rigorous evaluation frameworks to measure the clinical and social outcomes of every innovation. Evidence guides product iteration and ensures technology solves real problems." },
            { icon: Users, title: "Co-creation", text: "We promote co-creation with health professionals, institutions, and patients. This collaborative ecosystem accelerates knowledge transfer and ensures solutions reflect field needs." },
            { icon: ShieldCheck, title: "Tech Governance", text: "Our technology governance includes principles of equity, transparency, and explainability. We avoid systemic bias, audit algorithms, and clearly communicate how the tools we use work." },
            { icon: Compass, title: "Purpose Driven", text: "We believe in innovation with purpose: solutions that elevate clinical standards, strengthen communities, and dignify the care experience—technology and human intelligence working together to restructure lives." }
          ]
        }
      : {
          principlesLabel: "Nuestros Pilares",
          principles: [
            { icon: BrainCircuit, title: "IA Responsable", text: "Incorporamos inteligencia artificial de manera responsable para enriquecer el proceso clínico sin sustituir el criterio profesional. Nuestras herramientas asistidas por IA apoyan el diagnóstico, la priorización de casos y el seguimiento, manteniendo una supervisión humana permanente." },
            { icon: Activity, title: "Modelos Predictivos", text: "Desarrollamos modelos predictivos y sistemas de alerta temprana que ayudan a identificar riesgos y necesidades de intervención. Estas capacidades permiten actuar con oportunidad, mejorar la continuidad del cuidado y evitar recaídas." },
            { icon: Network, title: "Señales Multimodales", text: "Combinamos datos clínicos con señales multimodales para crear una visión integral del paciente. La analítica avanzada convierte información dispersa en conocimiento accionable, elevando la precisión terapéutica y la personalización." },
            { icon: HeartPulse, title: "Atención Remota", text: "Nuestras plataformas de atención remota integran experiencias fluidas y empáticas, priorizando usabilidad y accesibilidad. El objetivo es acercar especialistas a personas y familias, sin fricciones técnicas ni barreras geográficas." },
            { icon: PieChart, title: "Resultados Clínicos", text: "Adoptamos marcos de evaluación rigurosos para medir resultados clínicos y sociales de cada innovación. La evidencia guía la iteración de producto y garantiza que la tecnología está resolviendo problemas reales." },
            { icon: Users, title: "Co-creación", text: "Promovemos la co-creación con profesionales de salud, instituciones y pacientes. Este ecosistema colaborativo acelera la transferencia del conocimiento y asegura que las soluciones reflejen necesidades de campo." },
            { icon: ShieldCheck, title: "Gobernanza Tech", text: "La gobernanza tecnológica incluye principios de equidad, transparencia y explicabilidad. Evitamos sesgos sistémicos, auditamos algoritmos y comunicamos con claridad cómo funcionan las herramientas que utilizamos." },
            { icon: Compass, title: "Con Propósito", text: "Creemos en una innovación con propósito: soluciones que elevan el estándar clínico, fortalecen las comunidades y dignifican la experiencia de atención. Tecnología e inteligencia humana trabajando juntas para reestructurar vidas." }
          ]
        };

  return (
    <section className="py-24 bg-background relative z-10 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">{copy.principlesLabel}</h2>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {copy.principles.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/60 rounded-3xl p-8 hover:border-accent/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-black transition-colors">
                <p.icon className="w-6 h-6 text-accent group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {p.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
