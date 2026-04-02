 "use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

export default function Technology() {
  const { lang } = useI18n();
  const copy =
    lang === "en"
      ? {
          label: "Philosophy",
          title: "Technology & Innovation",
          heroText: "We are a foundation that deeply believes in the power of technology to transform mental health and human wellbeing. Our mission is to translate innovation into real impact, with accessible, precise, and ethical solutions that expand the reach of care.",
        }
      : {
          label: "Nuestra Filosofía",
          title: "Tecnología e Innovación",
          heroText: "Somos una fundación que cree profundamente en el poder de la tecnología para transformar la salud mental y el bienestar humano. Nuestra misión es traducir la innovación en impacto real, con soluciones accesibles, precisas y éticas que amplifiquen el alcance de la atención.",
        };

  return (
    <section id="tecnologia-hero" className="bg-[#0e0720] relative max-w-full overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* HERO SECTION */}
      <div className="pt-32 pb-20 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-accent font-medium tracking-widest uppercase text-sm mb-4 block">
              {copy.label}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-8 leading-[1.1]">
              {copy.title}
            </h1>
            <div className="w-16 h-1 bg-accent/50 rounded-full mb-8" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {copy.heroText}
            </p>
          </motion.div>
          
          {/* Tech Hero Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative w-full aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image src="/tech-hero.png" alt="Neural Network" fill className="object-cover hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0720] via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
