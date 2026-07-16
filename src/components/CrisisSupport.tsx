"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

export const CREI_WHATSAPP_URL = "https://wa.me/525530412552?text=Hola%20CREI%2C%20necesito%20ayuda%20y%20orientaci%C3%B3n";

export default function CrisisSupport() {
  const pathname = usePathname();
  const { lang } = useI18n();
  const isPrivateArea = /\/(portal|portal-terapeutas|portal-pago)(\/|$)/.test(pathname || "");

  if (isPrivateArea) return null;

  return (
    <a
      href={CREI_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-4 z-[110] inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-3 text-xs font-extrabold text-emerald-800 shadow-[0_14px_40px_rgba(6,95,70,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-50 sm:bottom-6 sm:left-6 sm:text-sm"
      aria-label={lang === "en" ? "Get help through CREI WhatsApp" : "Obtener ayuda por WhatsApp de CREI"}
    >
      <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" /></span>
      <MessageCircle className="h-4 w-4" /> {lang === "en" ? "Help via CREI WhatsApp" : "Ayuda · WhatsApp CREI"}
    </a>
  );
}
