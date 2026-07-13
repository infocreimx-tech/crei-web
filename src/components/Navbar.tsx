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
          { name: "Blog", href: `/${lang}/blog` },
          { name: "APP", href: `/${lang}/app` },
          { name: "Love Wall", href: `/${lang}/agradecimientos` },
          { name: "Contact", href: `/${lang}/contacto` },
        ]
      : [
          { name: "Nosotros", href: `/${lang}/nosotros` },
          { name: "Servicios", href: `/${lang}/servicios` },
          { name: "Método", href: `/${lang}/metodo` },
          { name: "Tecnología", href: `/${lang}/tecnologia` },
          { name: "Blog", href: `/${lang}/blog` },
          { name: "APP", href: `/${lang}/app` },
          { name: "Amor", href: `/${lang}/agradecimientos` },
          { name: "Contacto", href: `/${lang}/contacto` },
        ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      role="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#faf8f4]/95 backdrop-blur-xl border-b border-[#302747]/10 ${
        isScrolled || mobileMenuOpen ? "py-2 shadow-[0_8px_30px_rgba(48,39,71,0.08)]" : "py-3"
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
        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] font-bold tracking-[0.06em] text-[#302747]/75 hover:text-[#7258a8] transition-colors whitespace-nowrap uppercase"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          {/* Language switcher */}
          <div className="flex items-center gap-1 text-xs uppercase tracking-wider text-[#302747]/60">
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
            className="text-[10px] font-bold tracking-widest uppercase text-white bg-[#302747] px-4 py-2.5 rounded-full hover:bg-[#7258a8] transition-all duration-300 shadow-sm"
          >
            {lang === "en" ? "Payment Portal" : "Portal de Pagos"}
          </Link>
        </div>

        {/* Hamburger — visible below lg */}
        <button
          className="lg:hidden text-[#7258a8] p-2 rounded-full bg-[#eee8f6]"
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
            className="lg:hidden bg-[#faf8f4] border-t border-[#302747]/10 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-semibold text-[#302747] py-1"
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
