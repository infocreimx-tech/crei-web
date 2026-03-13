 "use client";
 
 import { motion } from "framer-motion";
 import { Quote, Star } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
 
 function getTestimonials(lang: "es" | "en") {
   return lang === "en"
     ? [
         {
           name: "Mariana G.",
           role: "Patient in restructuring process",
           quote:
             "I found clarity and structure. They didn't give me motivational phrases—they gave me a clinical map and concrete tools.",
           image:
             "https://images.unsplash.com/photo-1544723795-3fb6469f9a98?q=80&w=800&auto=format&fit=crop",
           rating: 5
         },
         {
           name: "Carlos R.",
           role: "Treatment graduate",
           quote:
             "The 360° support made the difference. I returned to my life with emotional stability and a realistic plan.",
           image:
             "https://images.unsplash.com/photo-1544005316-7a2d9b07b86a?q=80&w=800&auto=format&fit=crop",
           rating: 5
         },
         {
           name: "Alejandra T.",
           role: "Family member",
           quote:
             "They helped us understand our family system. We moved from anguish to action with clear steps.",
           image:
             "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
           rating: 5
         },
         {
           name: "Roberto S.",
           role: "High-demand executive",
           quote:
             "I integrated stress management and mental habits. My performance improved without sacrificing mental health.",
           image:
             "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
           rating: 5
         }
       ]
     : [
         {
           name: "Mariana G.",
           role: "Paciente en proceso de reestructuración",
           quote:
             "Encontré claridad y estructura. No me dieron frases motivacionales, me dieron un mapa clínico y herramientas concretas.",
           image:
             "https://images.unsplash.com/photo-1544723795-3fb6469f9a98?q=80&w=800&auto=format&fit=crop",
           rating: 5
         },
         {
           name: "Carlos R.",
           role: "Egresado de tratamiento",
           quote:
             "El acompañamiento 360° marcó la diferencia. Volví a mi vida con estabilidad emocional y un plan realista.",
           image:
             "https://images.unsplash.com/photo-1544005316-7a2d9b07b86a?q=80&w=800&auto=format&fit=crop",
           rating: 5
         },
         {
           name: "Alejandra T.",
           role: "Familia de paciente",
           quote:
             "Nos ayudaron a entender el sistema familiar. Pasamos de la angustia a la acción con pasos claros.",
           image:
             "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
           rating: 5
         },
         {
           name: "Roberto S.",
           role: "Ejecutivo bajo alta demanda",
           quote:
             "Integré gestión del estrés y hábitos mentales. Mi desempeño subió sin sacrificar salud mental.",
           image:
             "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
           rating: 5
         }
       ];
 }
 
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
  const { lang } = useI18n();
  const copy =
    lang === "en"
      ? {
          label: "Testimonials",
          title: "Stories of Transformation",
          subtitle:
            "Human and clinical evidence of well-directed processes. Sustainable, measurable, real change.",
          footer: "Your transformation starts today: clinical clarity, human support, real progress"
        }
      : {
          label: "Testimonios",
          title: "Historias de Transformación",
          subtitle:
            "Evidencia humana y clínica de procesos bien dirigidos. Cambios sostenibles, medibles y reales.",
          footer: "Tu transformación empieza hoy: claridad clínica, apoyo humano, avance real"
        };
  const testimonials = getTestimonials(lang);

   return (
     <section id="testimonios" className="py-24 bg-muted/30 relative overflow-hidden">
       <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
       <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
 
       <div className="container mx-auto px-6">
         <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
             <Quote className="w-4 h-4" />
            <span className="text-sm font-medium">{copy.label}</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            {copy.title}
           </h2>
           <p className="text-lg text-muted-foreground">
            {copy.subtitle}
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
              {copy.footer}
             </span>
           </div>
         </motion.div>
       </div>
     </section>
   );
 }
