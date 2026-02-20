"use client";
import Link from "next/link";
import { X, CalendarDays, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function InfoSessionModal() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      document.documentElement.dataset.infoModal = "1";
      setShow(true);
    } catch {}
  }, []);

  function close() {
    try {
      window.localStorage.setItem("infoSession_2026-02-19_dismissed", "1");
      document.documentElement.dataset.infoModal = "0";
      setShow(false);
    } catch {}
  }
 
  return (
    <div className={`info-session-modal-overlay ${show ? "" : "opacity-0 invisible pointer-events-none"}`} aria-modal="true" role="dialog">
      <div className="mx-auto mt-24 w-[92%] max-w-[560px] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden info-session-modal-panel">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-primary">Superar una adicción es posible.</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-prose">
                Todos los jueves a las 20:00 hrs te esperamos. Acompáñanos a una sesión informativa semanal por Zoom para pacientes y familias: conoce nuestro enfoque clínico, resuelve dudas y da el primer paso con acompañamiento profesional.
              </p>
              <div className="mt-4 flex items-center gap-3 text-primary">
                <CalendarDays className="w-5 h-5" />
                <span className="text-sm font-medium">Todos los jueves • 20:00 hrs (hora CDMX)</span>
              </div>
            </div>
            <button
              onClick={close}
              aria-label="Cerrar"
              className="rounded-full p-2 text-muted-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
 
        <div className="p-6">
          <p className="text-sm text-muted-foreground">Participa desde cualquier lugar. Cupo limitado; únete puntualmente. Si quieres recibir el acceso, compártelo por WhatsApp o solicita el link y nuestro equipo te lo enviará.</p>
 
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={`https://wa.me/?text=${encodeURIComponent(
                "Link de acceso a la sesión informativa (jueves 20:00 hrs, hora CDMX): https://us06web.zoom.us/j/83243324228?pwd=68BMZhf1aHNV2UvDbvYh2mjtZ0ucs7.1"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Enviar link a mi WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
              Enviar link a mi WhatsApp
            </Link>
            <button
              onClick={close}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-border bg-background text-primary font-medium hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Cerrar aviso"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
