 "use client";
 
 import { motion } from "framer-motion";
 import { Quote, Star } from "lucide-react";
 
 const testimonials = [
   {
     name: "Mariana G.",
     role: "Paciente en proceso de reestructuración",
     quote:
       "Encontré claridad y estructura. No me dieron frases motivacionales, me dieron un mapa clínico y herramientas concretas.",
     image:
       "https://images.unsplash.com/photo-1544723795-3fb6469f9a98?q=80&w=800&auto=format&fit=crop",
     rating: 5,
   },
   {
     name: "Carlos R.",
     role: "Egresado de tratamiento",
     quote:
       "El acompañamiento 360° marcó la diferencia. Volví a mi vida con estabilidad emocional y un plan realista.",
     image:
       "https://images.unsplash.com/photo-1544005316-7a2d9b07b86a?q=80&w=800&auto=format&fit=crop",
     rating: 5,
   },
   {
     name: "Alejandra T.",
     role: "Familia de paciente",
     quote:
       "Nos ayudaron a entender el sistema familiar. Pasamos de la angustia a la acción con pasos claros.",
     image:
       "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
     rating: 5,
   },
   {
     name: "Roberto S.",
     role: "Ejecutivo bajo alta demanda",
     quote:
       "Integré gestión del estrés y hábitos mentales. Mi desempeño subió sin sacrificar salud mental.",
     image:
       "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
     rating: 5,
   },
 ];
 
 const container = {
   hidden: { opacity: 0 },
   show: {
     opacity: 1,
     transition: { staggerChildren: 0.08 },
   },
 };
 
 const item = {
   hidden: { opacity: 0, y: 24 },
   show: { opacity: 1, y: 0 },
 };
 
 export default function Testimonials() {
   return (
     <section id="testimonios" className="py-24 bg-muted/30 relative overflow-hidden">
       <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
       <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
 
       <div className="container mx-auto px-6">
         <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
             <Quote className="w-4 h-4" />
             <span className="text-sm font-medium">Testimonios</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
             Historias de Transformación
           </h2>
           <p className="text-lg text-muted-foreground">
             Evidencia humana y clínica de procesos bien dirigidos. Cambios sostenibles, medibles y reales.
           </p>
         </div>
 
         <motion.div
           variants={container}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-100px" }}
           className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
         >
           {testimonials.map((t, i) => (
             <motion.div
               key={i}
               variants={item}
               className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
             >
              <div className="flex items-center gap-3 mb-6">
                <Quote className="w-4 h-4 text-accent" />
                <p className="text-primary font-serif text-xl font-bold">{t.name}</p>
              </div>
 
               <div className="flex items-center gap-1 mb-4">
                 {Array.from({ length: t.rating }).map((_, k) => (
                   <Star key={k} className="w-4 h-4 text-accent" />
                 ))}
               </div>
 
               <p className="text-foreground/90 leading-relaxed">
                 {t.quote}
               </p>
             </motion.div>
           ))}
         </motion.div>
 
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-16 text-center"
         >
           <div className="inline-flex items-center gap-3 bg-secondary text-secondary-foreground px-6 py-3 rounded-full border border-border">
             <Star className="w-5 h-5 text-accent" />
             <span className="text-sm">
               Tu transformación empieza hoy: claridad clínica, apoyo humano, avance real
             </span>
           </div>
         </motion.div>
       </div>
     </section>
   );
 }
