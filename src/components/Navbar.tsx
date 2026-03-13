"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function Navbar() {
  const { lang } = useI18n();
  const pathname = usePathname() || `/${lang}`;
  const otherLang = lang === "en" ? "es" : "en";
  const otherHref = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${otherLang}`);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks =
    lang === "en"
      ? [
          { name: "About", href: `/${lang}/#nosotros` },
          { name: "Services", href: `/${lang}/#servicios` },
          { name: "Method", href: `/${lang}/#metodo` },
          { name: "Technology", href: `/${lang}/tecnologia` },
          { name: "Resources", href: `/${lang}/recursos` },
          { name: "Clinics", href: `/${lang}/clinicas` },
          { name: "Team", href: `/${lang}/#equipo` },
          { name: "Contact", href: `/${lang}/#contacto` }
        ]
      : [
          { name: "Quiénes Somos", href: `/${lang}/#nosotros` },
          { name: "Servicios", href: `/${lang}/#servicios` },
          { name: "Método", href: `/${lang}/#metodo` },
          { name: "Tecnología e Innovación", href: `/${lang}/tecnologia` },
          { name: "Recursos", href: `/${lang}/recursos` },
          { name: "Clínicas", href: `/${lang}/clinicas` },
          { name: "Equipo", href: `/${lang}/#equipo` },
          { name: "Contacto", href: `/${lang}/#contacto` }
        ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      role="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-background/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <Image 
              src="/logo-header.png" 
              alt="CREI Logo" 
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <span className="text-xl md:text-2xl font-serif font-bold text-primary tracking-wide md:hidden">CREI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-primary/80 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-primary/20 mx-2" />

          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary/70">
            {lang === "es" ? (
              <span className="text-primary">ES</span>
            ) : (
              <Link href={otherHref} className="hover:text-primary transition-colors">
                ES
              </Link>
            )}
            <span className="text-primary/30">|</span>
            {lang === "en" ? (
              <span className="text-primary">EN</span>
            ) : (
              <Link href={otherHref} className="hover:text-primary transition-colors">
                EN
              </Link>
            )}
          </div>
          
          <Link
            href={`/${lang}/portal`}
            className="text-xs font-bold tracking-widest uppercase text-primary border border-primary/20 px-3 py-1.5 rounded-md hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {lang === "en" ? "Patient Portal" : "Portal del Paciente"}
          </Link>

          <Link
            href={`/${lang}/#contacto`}
            aria-label={lang === "en" ? "Go to contact to schedule an evaluation" : "Ir a contacto para agendar evaluación"}
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {lang === "en" ? "Schedule your evaluation" : "Agenda tu evaluación"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-primary py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-primary/70 border-t border-border mt-2 pt-4">
                {lang === "es" ? (
                  <span className="text-primary">ES</span>
                ) : (
                  <Link
                    href={otherHref}
                    className="hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ES
                  </Link>
                )}
                <span className="text-primary/30">|</span>
                {lang === "en" ? (
                  <span className="text-primary">EN</span>
                ) : (
                  <Link
                    href={otherHref}
                    className="hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    EN
                  </Link>
                )}
              </div>
              
              <Link
                href={`/${lang}/portal`}
                className="text-sm font-light uppercase tracking-wider text-primary/70 py-2 border-t border-border mt-2 pt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === "en" ? "Patient Portal" : "Portal del Paciente"}
              </Link>

              <Link
                href={`/${lang}/#contacto`}
                aria-label={lang === "en" ? "Go to contact to schedule an evaluation" : "Ir a contacto para agendar evaluación"}
                className="w-full text-center px-5 py-3 bg-primary text-primary-foreground text-base font-medium rounded-full hover:bg-primary/90 transition-colors mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === "en" ? "Schedule your evaluation" : "Agenda tu evaluación"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
