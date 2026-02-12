 "use client";
import { motion } from "framer-motion";
 
export default function Technology() {
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
            Tecnología e Innovación
          </motion.h2>
        </div>
 
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Somos una fundación que cree profundamente en el poder de la tecnología para transformar la salud mental y el bienestar humano. Nuestra misión es traducir la innovación en impacto real, con soluciones accesibles, precisas y éticas que amplifiquen el alcance de la atención.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Incorporamos inteligencia artificial de manera responsable para enriquecer el proceso clínico sin sustituir el criterio profesional. Nuestras herramientas asistidas por IA apoyan el diagnóstico, la priorización de casos y el seguimiento, manteniendo una supervisión humana permanente.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Desarrollamos modelos predictivos y sistemas de alerta temprana que ayudan a identificar riesgos y necesidades de intervención. Estas capacidades permiten actuar con oportunidad, mejorar la continuidad del cuidado y evitar recaídas.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Combinamos datos clínicos con señales multimodales para crear una visión integral del paciente. La analítica avanzada convierte información dispersa en conocimiento accionable, elevando la precisión terapéutica y la personalización.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Nuestras plataformas de atención remota integran experiencias fluidas y empáticas, priorizando usabilidad y accesibilidad. El objetivo es acercar especialistas a personas y familias, sin fricciones técnicas ni barreras geográficas.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Adoptamos marcos de evaluación rigurosos para medir resultados clínicos y sociales de cada innovación. La evidencia guía la iteración de producto y garantiza que la tecnología está resolviendo problemas reales.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Promovemos la co-creación con profesionales de salud, instituciones y pacientes. Este ecosistema colaborativo acelera la transferencia del conocimiento y asegura que las soluciones reflejen necesidades de campo.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            La gobernanza tecnológica incluye principios de equidad, transparencia y explicabilidad. Evitamos sesgos sistémicos, auditamos algoritmos y comunicamos con claridad cómo funcionan las herramientas que utilizamos.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Creemos en una innovación con propósito: soluciones que elevan el estándar clínico, fortalecen las comunidades y dignifican la experiencia de atención. Tecnología e inteligencia humana trabajando juntas para reestructurar vidas.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
