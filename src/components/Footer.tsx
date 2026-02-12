"use client";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-primary-foreground/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left">
            <div className="relative w-28 h-28 mx-auto md:mx-0 mb-6 bg-white rounded-full shadow-lg overflow-hidden p-4">
              <Image 
                src="/logo.png" 
                alt="CREI - Centro de Reestructuración Emocional Integral" 
                fill
                className="object-contain"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm max-w-xs leading-relaxed">
              Centro de Reestructuración Emocional Integral. <br/>
              Reconstruyendo vidas desde la raíz.
            </p>
          </div>

          <div className="flex gap-6">
            <Link href="#" aria-label="Visitar Instagram de CREI" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Instagram size={20} />
            </Link>
            <Link href="#" aria-label="Visitar Facebook de CREI" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Facebook size={20} />
            </Link>
            <Link href="#" aria-label="Visitar X (Twitter) de CREI" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Twitter size={20} />
            </Link>
            <Link href="#" aria-label="Visitar LinkedIn de CREI" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <Linkedin size={20} />
            </Link>
            <Link href="#" aria-label="Visitar TikTok de CREI" className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
              <TikTokIcon size={20} />
            </Link>
          </div>

          <div className="text-center md:text-right text-sm text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} CREI. Todos los derechos reservados.</p>
            <div className="flex gap-4 justify-center md:justify-end mt-2">
              <Link href="/aviso-de-privacidad" className="hover:text-primary-foreground transition-colors">Aviso de Privacidad</Link>
              <Link href="#" className="hover:text-primary-foreground transition-colors">Términos de Uso</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
