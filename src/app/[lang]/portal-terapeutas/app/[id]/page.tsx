"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Maximize, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const appNames: Record<string, string> = {
  calendario: "Calendario Clínico",
  expediente: "Expediente de Pacientes",
  preexpediente: "Pre-expedientes",
  terapias: "Gestión Finanzas",
  busqueda: "Buscador Global",
  cuestionario: "Cuestionarios",
  comprobante: "Carga de Comprobantes"
};

const appAccents: Record<string, string> = {
  calendario: "#7c5cbf",
  expediente: "#0369a1",
  preexpediente: "#0f766e",
  terapias: "#9f86c0",
  busqueda: "#6b5e7c",
  cuestionario: "#4a2c5e",
  comprobante: "#4a2c5e",
};

export default function IframeAppContainer() {
  const router = useRouter();
  const params = useParams();
  const { lang } = useI18n();
  const appId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const tk = localStorage.getItem("sb-uywihjppwzrrfjkguvot-auth-token");
    const cs = localStorage.getItem("crei_session");
    if (!tk && !cs) {
      router.push(`/${lang}/portal-terapeutas`);
    }

    // Broker de sesión: responder solicitudes postMessage de los iframes legacy
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "CREI_REQUEST_SESSION") {
        const raw = localStorage.getItem("crei_session");
        if (raw && event.source) {
          try {
            const parsed = JSON.parse(raw);
            const user = parsed.user || parsed.username || parsed.email || "Desconocido";
            (event.source as Window).postMessage(
              { type: "CREI_SESSION_RESPONSE", user, raw },
              event.origin || "*"
            );
          } catch (e) {}
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router, lang]);

  if (!appId || !appNames[appId]) {
    return <div className="p-10 text-center" style={{ color: "#7c5cbf" }}>App no encontrada.</div>;
  }

  const appStaticUrl = `/legacy-apps/${appId}/index.html?v=20260413-1`;
  const accent = appAccents[appId] || "#7c5cbf";

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#150b24" }}>

      {/* ── Shell Header matching premium dark style ── */}
      <header
        className="h-14 flex items-center justify-between px-4 shrink-0 z-10"
        style={{
          background: "rgba(21, 11, 36, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(159, 134, 192, 0.25)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/es" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-8 h-8">
              <Image src="/logo-header.png" alt="CREI" fill className="object-contain drop-shadow-[0_0_8px_rgba(159,134,192,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(159,134,192,0.8)] transition-all" unoptimized />
            </div>
            <span className="text-base font-serif font-bold hidden sm:inline tracking-tight" style={{ color: "#fbfaff", textShadow: "0 2px 5px rgba(0,0,0,0.5)" }}>
              CREI
            </span>
          </Link>

          <div className="w-px h-5" style={{ background: "rgba(159, 134, 192, 0.25)" }} />

          {/* Back */}
          <Link
            href={`/${lang}/portal-terapeutas/dashboard`}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all hover:bg-white/10"
            style={{ color: "#c4b5fd", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(159, 134, 192, 0.3)" }}
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Volver</span>
          </Link>

          <div className="w-px h-5" style={{ background: "rgba(159, 134, 192, 0.25)" }} />

          {/* Module name */}
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: accent, color: accent }} />
            <span className="font-serif font-bold text-sm tracking-wide" style={{ color: "#fbfaff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
              {appNames[appId]}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 ml-0.5" />
          </div>
        </div>

        <button
          onClick={() => window.open(appStaticUrl, "_blank")}
          className="p-2 rounded-full transition-all hover:bg-white/10"
          style={{ color: accent, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(159,134,192,0.3)` }}
          title="Abrir en pestaña nueva"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </header>

      {/* Frame */}
      <main className="flex-1 relative bg-[#150b24]">
        {/* Glow ambient background behind the frame while loading */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" style={{ background: accent }} />

        {isLoading && !hasError && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            style={{ background: "rgba(21, 11, 36, 0.8)", backdropFilter: "blur(12px)" }}
          >
            <div className="relative w-16 h-16 mb-5 drop-shadow-[0_0_15px_rgba(159,134,192,0.6)]">
              <Image src="/logo-header.png" alt="CREI" fill className="object-contain animate-pulse" unoptimized />
            </div>
            <Loader2 className="w-6 h-6 animate-spin mb-3" style={{ color: accent }} />
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
              Cargando {appNames[appId]}...
            </p>
          </div>
        )}

        {hasError && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            style={{ background: "rgba(69, 10, 10, 0.9)" }}
          >
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <p className="font-bold text-red-400 mb-1 text-lg">Error cargando el módulo</p>
            <p className="text-sm text-red-300">public/legacy-apps/{appId}/index.html no encontrado</p>
          </div>
        )}

        <iframe
          src={appStaticUrl}
          className="w-full h-full border-0 rounded-b-xl"
          title={`CREI · ${appNames[appId]}`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      </main>
    </div>
  );
}
