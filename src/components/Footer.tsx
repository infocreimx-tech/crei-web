"use client";

import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

function TikTokIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
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

export default function Footer() {
  const { lang } = useI18n();
  const pathname = usePathname() || `/${lang}`;
  const otherLang = lang === "en" ? "es" : "en";
  const otherHref = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${otherLang}`);

  const copy =
    lang === "en"
      ? {
          logoAlt: "CREI - Comprehensive Emotional Restructuring Center",
          sloganA: "Comprehensive Emotional Restructuring Center.",
          sloganB: "Rebuilding lives from the root.",
          youtube: "Visit CREI YouTube",
          instagram: "Visit CREI Instagram",
          facebook: "Visit CREI Facebook",
          x: "Visit CREI X (Twitter)",
          linkedin: "Visit CREI LinkedIn",
          tiktok: "Visit CREI TikTok",
          rights: "All rights reserved.",
          privacy: "Privacy Notice",
          terms: "Terms of Use",
          languageLabel: "Language"
        }
      : {
          logoAlt: "CREI - Centro de Reestructuración Emocional Integral",
          sloganA: "Centro de Reestructuración Emocional Integral.",
          sloganB: "Reconstruyendo vidas desde la raíz.",
          youtube: "Visitar YouTube de CREI",
          instagram: "Visitar Instagram de CREI",
          facebook: "Visitar Facebook de CREI",
          x: "Visitar X (Twitter) de CREI",
          linkedin: "Visitar LinkedIn de CREI",
          tiktok: "Visitar TikTok de CREI",
          rights: "Todos los derechos reservados.",
          privacy: "Aviso de Privacidad",
          terms: "Términos de Uso",
          languageLabel: "Idioma"
        };

  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-primary-foreground/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left">
            <div className="relative w-28 h-28 mx-auto md:mx-0 mb-6 bg-white rounded-full shadow-lg overflow-hidden p-4">
              <Image 
                src="/logo-footer.png" 
                alt={copy.logoAlt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-primary-foreground/80 text-sm max-w-xs leading-relaxed">
              {copy.sloganA} <br/>
              {copy.sloganB}
            </p>
          </div>

          <div className="flex gap-6">
            <Link href="https://www.youtube.com/@Crei_mx" aria-label={copy.youtube} className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Youtube size={20} />
            </Link>
            <Link href="https://www.instagram.com/crei.mx/" aria-label={copy.instagram} className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Instagram size={20} />
            </Link>
            <Link href="https://www.facebook.com/CREImx/" aria-label={copy.facebook} className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Facebook size={20} />
            </Link>
            <Link href="https://x.com/CreiMx" aria-label={copy.x} className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Twitter size={20} />
            </Link>
            <Link href="#" aria-label={copy.linkedin} className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Linkedin size={20} />
            </Link>
            <Link href="https://www.tiktok.com/@crei.mx" aria-label={copy.tiktok} className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <TikTokIcon size={20} />
            </Link>
          </div>

          <div className="text-center md:text-right text-sm text-primary-foreground/60">
            <div className="flex items-center justify-center md:justify-end gap-2 text-xs uppercase tracking-wider mb-2">
              <span className="text-primary-foreground/60">{copy.languageLabel}:</span>
              {lang === "es" ? (
                <span className="text-primary-foreground">ES</span>
              ) : (
                <Link href={otherHref} className="hover:text-primary-foreground transition-colors text-primary-foreground/60">
                  ES
                </Link>
              )}
              <span className="text-primary-foreground/40">|</span>
              {lang === "en" ? (
                <span className="text-primary-foreground">EN</span>
              ) : (
                <Link href={otherHref} className="hover:text-primary-foreground transition-colors text-primary-foreground/60">
                  EN
                </Link>
              )}
            </div>
            <p>&copy; {new Date().getFullYear()} CREI. {copy.rights}</p>
            <div className="flex gap-4 justify-center md:justify-end mt-2">
              <Link href={`/${lang}/aviso-de-privacidad`} className="hover:text-primary-foreground transition-colors">{copy.privacy}</Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">{copy.terms}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
