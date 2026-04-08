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
          { name: "About", href: `/${lang}/nosotros` },
          { name: "Services", href: `/${lang}/servicios` },
          { name: "Method", href: `/${lang}/metodo` },
          { name: "Technology", href: `/${lang}/tecnologia` },
          { name: "Community", href: `/${lang}/comunidad` },
          { name: "Contact", href: `/${lang}/#contacto` },
        ]
      : [
          { name: "Quiénes Somos", href: `/${lang}/nosotros` },
          { name: "Servicios", href: `/${lang}/servicios` },
          { name: "Método", href: `/${lang}/metodo` },
          { name: "Tecnología", href: `/${lang}/tecnologia` },
          { name: "Comunidad", href: `/${lang}/comunidad` },
          { name: "Contacto", href: `/${lang}/#contacto` },
        ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      role="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/90 backdrop-blur-md shadow-md ${
        isScrolled || mobileMenuOpen ? "py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-12 h-12 md:w-14 md:h-14">
            <Image
              src="/logo-header.png"
              alt="CREI Logo"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Desktop Nav — only visible on large screens */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-primary/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          {/* Language switcher */}
          <div className="flex items-center gap-1 text-xs uppercase tracking-wider text-primary/70">
            {lang === "es" ? (
              <span className="font-bold text-primary">ES</span>
            ) : (
              <Link href={otherHref} className="hover:text-primary transition-colors">ES</Link>
            )}
            <span className="text-primary/30 px-0.5">|</span>
            {lang === "en" ? (
              <span className="font-bold text-primary">EN</span>
            ) : (
              <Link href={otherHref} className="hover:text-primary transition-colors">EN</Link>
            )}
          </div>

          <Link
            href={`/${lang}/portal-pago`}
            className="text-xs font-bold tracking-widest uppercase text-accent border border-accent/40 bg-accent/5 px-3 py-1.5 rounded-md hover:bg-accent hover:text-white transition-all duration-300"
          >
            {lang === "en" ? "Payment Portal" : "Portal de Pagos"}
          </Link>
        </div>

        {/* Hamburger — visible below lg */}
        <button
          className="lg:hidden text-primary p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-primary py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary/70 border-t border-border pt-4 mt-2">
                {lang === "es" ? (
                  <span className="font-bold text-primary">ES</span>
                ) : (
                  <Link href={otherHref} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">ES</Link>
                )}
                <span className="text-primary/30">|</span>
                {lang === "en" ? (
                  <span className="font-bold text-primary">EN</span>
                ) : (
                  <Link href={otherHref} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">EN</Link>
                )}
              </div>

              <Link
                href={`/${lang}/portal-pago`}
                className="text-sm font-bold uppercase tracking-wider text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === "en" ? "Payment Portal" : "Portal de Pagos"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
