"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, RefreshCw, Sun, ArrowDown } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Diagnóstico Estructural",
    description: "Identificamos los cimientos debilitados. No solo miramos el síntoma, escaneamos la estructura emocional completa.",
    icon: Search,
  },
  {
    id: 2,
    title: "Limpieza Emocional",
    description: "Removemos escombros del pasado. Procesamos traumas y bloqueos que impiden la nueva construcción.",
    icon: RefreshCw,
  },
  {
    id: 3,
    title: "Reconstrucción & Diseño",
    description: "Levantamos nuevos pilares. Te damos herramientas de arquitectura mental para sostener tu nueva vida.",
    icon: Sun,
  },
];

export default function Method() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="metodo" className="py-32 bg-background relative overflow-hidden">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-medium tracking-widest uppercase text-sm"
          >
            Nuestro Proceso
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mt-4 mb-6"
          >
            El Método de <br />Reestructuración
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Un sistema clínico paso a paso para ir del caos a la claridad.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Progress Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2 hidden md:block">
            <motion.div 
              style={{ height: lineHeight }}
              className="w-full bg-accent origin-top"
            />
          </div>

          <div className="space-y-24 md:space-y-32">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Content */}
                  <div className={`flex-1 text-center ${isEven ? "md:text-left" : "md:text-right"}`}>
                    <div className="inline-block p-3 bg-secondary/30 rounded-2xl mb-4 text-primary">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-primary mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Central Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-accent flex items-center justify-center shadow-xl shadow-accent/20">
                      <span className="text-xl font-bold text-primary">{step.id}</span>
                    </div>
                  </div>

                  {/* Empty Spacer for Layout Balance */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>

          {/* Final Call to Action */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <div className="inline-flex flex-col items-center gap-4">
              <ArrowDown className="w-6 h-6 text-accent animate-bounce" />
              <p className="font-serif text-2xl text-primary font-medium">
                ¿Listo para el paso 1?
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
