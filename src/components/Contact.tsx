"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";



export default function Contact() {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="contacto" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Info & Insurance */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6"
            >
              Comienza tu proceso
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-12"
            >
              Estamos aquí para escucharte. Agenda una cita o resuelve tus dudas. Tu bienestar es nuestra prioridad.
            </motion.p>



            <div 
              ref={cardRef}
              className="bg-primary text-primary-foreground p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden group"
            >
              {/* Background Image */}
              <motion.div 
                style={{ y }}
                className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 h-[120%] -top-[10%]"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=1920&auto=format&fit=crop"
                  alt="Estructura y luz"
                  fill
                  className="object-cover mix-blend-luminosity"
                />
              </motion.div>

              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/5 rounded-full blur-2xl z-0"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white/5 rounded-full blur-2xl z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-bold mb-6">Reestructuración Integral</h3>
                <div className="space-y-4 text-primary-foreground/90 leading-relaxed">
                  <p>
                    A diferencia de los enfoques tradicionales que solo tratan el síntoma, en nuestro centro nos enfocamos en la <strong>Reestructuración Integral</strong>. Creemos que cada persona posee una estructura emocional única; a veces, debido a traumas, adicciones o crisis de vida, esa estructura se debilita.
                  </p>
                  <p>
                    Nuestro trabajo es proporcionarte los planos y las herramientas para que vuelvas a edificar tu vida. Aquí, la <strong>inteligencia emocional</strong> no es un concepto abstracto, es nuestra columna vertebral. Trabajamos en la raíz de tus procesos mentales para que el cambio no sea temporal, sino una nueva forma de habitar tu mundo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 md:p-10 rounded-3xl shadow-lg"
          >
            <h3 className="text-2xl font-serif font-bold text-primary mb-6">Agenda tu Cita</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-primary">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-primary">Teléfono</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="+52 55 1234 5678"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-primary">Servicio de Interés</label>
                <select 
                  id="service" 
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="individual">Terapia Individual</option>
                  <option value="couple">Terapia de Pareja</option>
                  <option value="psychiatry">Psiquiatría</option>
                  <option value="group">Grupo de Apoyo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-primary">Mensaje (Opcional)</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                  placeholder="Cuéntanos brevemente cómo podemos ayudarte..."
                />
              </div>

              <button 
                type="button"
                className="w-full py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
              >
                Enviar Solicitud <CheckCircle size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
