"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

function TikTokIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
    </svg>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <Image 
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1920&auto=format&fit=crop"
          alt="Espacio de terapia cálido con sillón y libros"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90 backdrop-blur-[2px]" />
      </motion.div>

      <div className="container relative z-10 px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-block mb-4 text-sm font-medium tracking-[0.2em] uppercase text-primary/80"
          >
            Centro de Reestructuración Emocional Integral
          </motion.span>
          
          <h1 className="mb-8 text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary leading-tight">
            Reestructura tu <br />
            <span className="italic font-light">mundo interior</span>
          </h1>
          
          <p className="max-w-xl mx-auto mb-8 text-lg md:text-xl text-primary/80 leading-relaxed font-medium">
            Un espacio de calma y profesionalismo donde la inteligencia emocional se encuentra con la excelencia clínica.
          </p>

          <div className="flex gap-6 mb-12">
            <Link href="#" aria-label="Visitar Instagram de CREI" className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Instagram size={24} />
            </Link>
            <Link href="#" aria-label="Visitar Facebook de CREI" className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Facebook size={24} />
            </Link>
            <Link href="#" aria-label="Visitar X (Twitter) de CREI" className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Twitter size={24} />
            </Link>
            <Link href="#" aria-label="Visitar LinkedIn de CREI" className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Linkedin size={24} />
            </Link>
            <Link href="#" aria-label="Visitar TikTok de CREI" className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <TikTokIcon size={24} />
            </Link>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(194,178,128,0)", "0px 0px 30px rgba(194,178,128,0.4)", "0px 0px 0px rgba(194,178,128,0)"] 
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-full bg-accent blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <a
                href="tel:+525512345678"
                className="relative flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground text-xl font-serif font-medium rounded-full overflow-hidden transition-all duration-300 border border-primary/20 hover:border-accent/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Phone className="w-5 h-5 animate-pulse" />
                  Necesito Ayuda
                </span>
                {/* Button Hover Fill Effect */}
                <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Confidencialidad garantizada • Atención inmediata
            </motion.p>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-16 bg-primary/20 overflow-hidden">
          <motion.div 
            animate={{ y: [0, 64, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-1/2 bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
