"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Phone, User, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// Mock data for existing clinics
const clinics = [
  {
    id: 1,
    name: "Clínica Renacer Polanco",
    director: "Dr. Roberto Campos",
    address: "Av. Horacio 1504, Polanco, CDMX",
    phone: "+52 55 5280 1234",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Centro CREI Valle",
    director: "Dra. Elena Torres",
    address: "Calzada del Valle 400, San Pedro, NL",
    phone: "+52 81 8356 7890",
    image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Unidad Médica Lomas",
    director: "Dr. Javier Méndez",
    address: "Paseo de las Palmas 735, Lomas, CDMX",
    phone: "+52 55 5520 4321",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=800&auto=format&fit=crop"
  }
];

export default function ClinicsNetwork() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      setFormStatus("success");
    }, 1500);
  };

  return (
    <section id="clinicas" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] uppercase text-accent-foreground mb-4 block"
          >
            Nuestra Red
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6"
          >
            Clínicas Afiliadas CREI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Una red de excelencia médica unida por un mismo propósito: tu bienestar integral.
          </motion.p>
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {clinics.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={clinic.image} 
                  alt={clinic.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-primary mb-4 font-serif group-hover:text-accent-foreground transition-colors">
                  {clinic.name}
                </h3>
                <div className="space-y-3 text-muted-foreground text-sm">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
                    <span><strong className="text-primary/80">Director:</strong> {clinic.director}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent-foreground shrink-0" />
                    <a href={`tel:${clinic.phone}`} className="hover:text-primary transition-colors">{clinic.phone}</a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Network Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-background/5 rounded-full blur-3xl" />

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Alianza Estratégica</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                ¿Te interesa que tu clínica sea parte de la red CREI?
              </h3>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Únete a la red líder en reestructuración emocional. Buscamos instituciones comprometidas con la excelencia clínica y el trato humano para expandir nuestro alcance.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Acceso a metodología CREI certificada",
                  "Red de derivación de pacientes",
                  "Formación continua para tu equipo",
                  "Respaldo de marca líder"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary-foreground/90">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              {formStatus === "success" ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">¡Solicitud Enviada!</h4>
                  <p className="text-primary-foreground/70">
                    Gracias por tu interés. Nuestro equipo de alianzas estratégicas revisará tu solicitud y se pondrá en contacto contigo pronto.
                  </p>
                  <button 
                    onClick={() => setFormStatus("idle")}
                    className="mt-8 text-accent hover:text-white transition-colors text-sm font-medium underline underline-offset-4"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground/80">Nombre de la Clínica</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="Ej. Centro Médico Integral"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground/80">Nombre del Responsable</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        placeholder="Dr./Dra. Nombre Apellido"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-foreground/80">Teléfono de Contacto</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        placeholder="+52..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-foreground/80">Ubicación (Ciudad/Estado)</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-background/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="Ej. Guadalajara, Jalisco"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full bg-accent text-primary-foreground font-bold py-4 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formStatus === "submitting" ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar Solicitud de Afiliación
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
