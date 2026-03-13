 "use client";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
 
export default function Technology() {
  const { lang } = useI18n();
  const copy =
    lang === "en"
      ? {
          title: "Technology & Innovation",
          paragraphs: [
            "We are a foundation that deeply believes in the power of technology to transform mental health and human wellbeing. Our mission is to translate innovation into real impact, with accessible, precise, and ethical solutions that expand the reach of care.",
            "We incorporate artificial intelligence responsibly to enrich the clinical process without replacing professional judgment. Our AI-assisted tools support assessment, case prioritization, and follow-up, with permanent human oversight.",
            "We develop predictive models and early warning systems that help identify risks and intervention needs. These capabilities enable timely action, improve continuity of care, and reduce relapse risk.",
            "We combine clinical data with multimodal signals to build an integrated view of each patient. Advanced analytics turn fragmented information into actionable knowledge, improving therapeutic precision and personalization.",
            "Our remote care platforms integrate smooth, empathetic experiences, prioritizing usability and accessibility. The goal is to bring specialists closer to people and families, without technical friction or geographic barriers.",
            "We adopt rigorous evaluation frameworks to measure the clinical and social outcomes of every innovation. Evidence guides product iteration and ensures technology solves real problems.",
            "We promote co-creation with health professionals, institutions, and patients. This collaborative ecosystem accelerates knowledge transfer and ensures solutions reflect field needs.",
            "Our technology governance includes principles of equity, transparency, and explainability. We avoid systemic bias, audit algorithms, and clearly communicate how the tools we use work.",
            "We believe in innovation with purpose: solutions that elevate clinical standards, strengthen communities, and dignify the care experience—technology and human intelligence working together to restructure lives."
          ]
        }
      : {
          title: "Tecnología e Innovación",
          paragraphs: [
            "Somos una fundación que cree profundamente en el poder de la tecnología para transformar la salud mental y el bienestar humano. Nuestra misión es traducir la innovación en impacto real, con soluciones accesibles, precisas y éticas que amplifiquen el alcance de la atención.",
            "Incorporamos inteligencia artificial de manera responsable para enriquecer el proceso clínico sin sustituir el criterio profesional. Nuestras herramientas asistidas por IA apoyan el diagnóstico, la priorización de casos y el seguimiento, manteniendo una supervisión humana permanente.",
            "Desarrollamos modelos predictivos y sistemas de alerta temprana que ayudan a identificar riesgos y necesidades de intervención. Estas capacidades permiten actuar con oportunidad, mejorar la continuidad del cuidado y evitar recaídas.",
            "Combinamos datos clínicos con señales multimodales para crear una visión integral del paciente. La analítica avanzada convierte información dispersa en conocimiento accionable, elevando la precisión terapéutica y la personalización.",
            "Nuestras plataformas de atención remota integran experiencias fluidas y empáticas, priorizando usabilidad y accesibilidad. El objetivo es acercar especialistas a personas y familias, sin fricciones técnicas ni barreras geográficas.",
            "Adoptamos marcos de evaluación rigurosos para medir resultados clínicos y sociales de cada innovación. La evidencia guía la iteración de producto y garantiza que la tecnología está resolviendo problemas reales.",
            "Promovemos la co-creación con profesionales de salud, instituciones y pacientes. Este ecosistema colaborativo acelera la transferencia del conocimiento y asegura que las soluciones reflejen necesidades de campo.",
            "La gobernanza tecnológica incluye principios de equidad, transparencia y explicabilidad. Evitamos sesgos sistémicos, auditamos algoritmos y comunicamos con claridad cómo funcionan las herramientas que utilizamos.",
            "Creemos en una innovación con propósito: soluciones que elevan el estándar clínico, fortalecen las comunidades y dignifican la experiencia de atención. Tecnología e inteligencia humana trabajando juntas para reestructurar vidas."
          ]
        };

  return (
    <section id="tecnologia" className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary"
          >
            {copy.title}
          </motion.h2>
        </div>
 
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
          {copy.paragraphs.map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
