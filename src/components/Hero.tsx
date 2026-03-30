"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

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
  const { lang } = useI18n();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const copy =
    lang === "en"
      ? {
          alt: "Warm therapy space with an armchair and books",
          badge: "Comprehensive Emotional Restructuring Center",
          titleA: "Restructure your",
          titleB: "inner world",
          subtitle:
            "A calm, professional space where emotional intelligence meets clinical excellence.",
          help: "I need help",
          privacy: "Confidentiality guaranteed • Immediate attention",
          youtube: "Visit CREI YouTube",
          instagram: "Visit CREI Instagram",
          facebook: "Visit CREI Facebook",
          x: "Visit CREI X (Twitter)",
          linkedin: "Visit CREI LinkedIn",
          tiktok: "Visit CREI TikTok"
        }
      : {
          alt: "Espacio de terapia cálido con sillón y libros",
          badge: "Centro de Reestructuración Emocional Integral",
          titleA: "Reestructura tu",
          titleB: "mundo interior",
          subtitle:
            "Un espacio de calma y profesionalismo donde la inteligencia emocional se encuentra con la excelencia clínica.",
          help: "Necesito Ayuda",
          privacy: "Confidencialidad garantizada • Atención inmediata",
          youtube: "Visitar YouTube de CREI",
          instagram: "Visitar Instagram de CREI",
          facebook: "Visitar Facebook de CREI",
          x: "Visitar X (Twitter) de CREI",
          linkedin: "Visitar LinkedIn de CREI",
          tiktok: "Visitar TikTok de CREI"
        };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <Image 
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1920&auto=format&fit=crop"
          alt={copy.alt}
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
            {copy.badge}
          </motion.span>
          
          <h1 className="mb-8 text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary leading-tight">
            {copy.titleA} <br />
            <span className="italic font-light">{copy.titleB}</span>
          </h1>
          
          <p className="max-w-xl mx-auto mb-8 text-lg md:text-xl text-primary/80 leading-relaxed font-medium">
            {copy.subtitle}
          </p>

          <div className="flex gap-6 mb-12">
            <Link href="https://www.youtube.com/@Crei_mx" aria-label={copy.youtube} className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Youtube size={24} />
            </Link>
            <Link href="https://www.instagram.com/crei.mx/" aria-label={copy.instagram} className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Instagram size={24} />
            </Link>
            <Link href="https://www.facebook.com/CREImx/" aria-label={copy.facebook} className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Facebook size={24} />
            </Link>
            <Link href="https://x.com/CreiMx" aria-label={copy.x} className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Twitter size={24} />
            </Link>
            <Link href="#" aria-label={copy.linkedin} className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Linkedin size={24} />
            </Link>
            <Link href="https://www.tiktok.com/@crei.mx" aria-label={copy.tiktok} className="text-primary/70 hover:text-primary transition-colors hover:scale-110 transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <TikTokIcon size={24} />
            </Link>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-8">
              {/* Heading Text replacing old button */}
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide drop-shadow-md">
                {copy.help}
              </h3>

              {/* Dual Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                {/* Llamada */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:+525530412552"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-lg font-medium rounded-full hover:bg-primary/90 transition-all border border-primary/20 shadow-lg shadow-primary/20"
                >
                  <Phone className="w-5 h-5 animate-pulse" />
                  {lang === "en" ? "Call by phone" : "Llamar por teléfono"}
                </motion.a>
                
                {/* WhatsApp */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/525530412552"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white text-lg font-medium rounded-full hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.484-1.459-1.657-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  {lang === "en" ? "WhatsApp Message" : "Mensaje por WhatsApp"}
                </motion.a>
              </div>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {copy.privacy}
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
