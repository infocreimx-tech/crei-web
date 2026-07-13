"use client";

import { CalendarDays, CreditCard, ExternalLink, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

const ZOOM_URL = "https://us06web.zoom.us/j/87921788787?pwd=kC7cQninnoXLg9IzTv12SAOuLYwrWY.1";
const STORAGE_KEY = "crei_important_notice_2026_07";

export default function InfoSessionModal() {
  const { lang } = useI18n();
  const [show, setShow] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isEn = lang === "en";

  const copy = isEn
    ? {
        badge: "Important information",
        title: "Protect your process and your payments",
        paymentTitle: "Payments are made only to the Foundation",
        paymentBody: "Direct payments to therapists are not accepted. Every payment must be made directly through the official CREI Foundation channels.",
        zoomTitle: "Thursday information session",
        zoomBody: "Every Thursday we host an informational Zoom session for people with addictions and codependency, as well as their families.",
        zoomButton: "Join the Zoom session",
        close: "I understand",
        closeAria: "Close important information"
      }
    : {
        badge: "Información importante",
        title: "Protege tu proceso y tus pagos",
        paymentTitle: "Los pagos se realizan únicamente a la Fundación",
        paymentBody: "No se aceptan pagos directos a terapeutas. Todo pago debe realizarse directamente mediante los canales oficiales de la Fundación CREI.",
        zoomTitle: "Sesión informativa de los jueves",
        zoomBody: "Todos los jueves tenemos una sesión informativa por Zoom para personas con adicciones y codependencia, así como para sus familiares.",
        zoomButton: "Entrar a la sesión de Zoom",
        close: "Entendido",
        closeAria: "Cerrar información importante"
      };

  useEffect(() => {
    const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = window.setTimeout(() => setShow(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  function close() {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1b1428]/70 p-4 backdrop-blur-md"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/60 bg-[#faf8f4] shadow-[0_30px_90px_rgba(25,18,39,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="important-notice-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label={copy.closeAria}
          className="absolute right-5 top-5 z-10 rounded-full border border-[#302747]/10 bg-white p-2.5 text-[#302747] shadow-sm hover:bg-[#eee8f6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7258a8]"
        >
          <X className="h-5 w-5" />
        </button>

        <header className="border-b border-[#302747]/10 bg-gradient-to-br from-[#eee8f6] via-[#faf8f4] to-[#edf4e8] px-6 pb-7 pt-8 sm:px-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7258a8]/20 bg-white/75 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7258a8]">
            <ShieldCheck className="h-4 w-4" /> {copy.badge}
          </div>
          <h2 id="important-notice-title" className="max-w-lg pr-10 font-serif text-3xl font-bold leading-tight text-[#302747] sm:text-4xl">
            {copy.title}
          </h2>
        </header>

        <div className="space-y-4 p-6 sm:p-9">
          <article className="flex gap-4 rounded-2xl border border-[#e1d7ea] bg-white p-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eee8f6] text-[#7258a8]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#302747]">{copy.paymentTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6d6475]">{copy.paymentBody}</p>
            </div>
          </article>

          <article className="flex gap-4 rounded-2xl border border-[#dce8d2] bg-[#f5f9f1] p-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dcefc5] text-[#466334]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-xl font-bold text-[#302747]">{copy.zoomTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6d6475]">{copy.zoomBody}</p>
              <a
                href={ZOOM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#302747] px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-[#7258a8] sm:w-auto"
              >
                {copy.zoomButton} <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>

          <button
            type="button"
            onClick={close}
            className="w-full rounded-full border border-[#302747]/15 bg-transparent px-5 py-3 text-sm font-bold text-[#302747] hover:bg-[#eee8f6]"
          >
            {copy.close}
          </button>
        </div>
      </section>
    </div>
  );
}
