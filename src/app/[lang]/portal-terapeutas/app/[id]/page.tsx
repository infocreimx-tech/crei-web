"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function IframeAppContainer() {
  const router = useRouter();
  const params = useParams();
  const { lang } = useI18n();
  const appId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Quick session check on client mount to prevent unauthorized iframe loads
    const tk = localStorage.getItem("sb-uywihjppwzrrfjkguvot-auth-token");
    const cs = localStorage.getItem("crei_session");
    if (!tk && !cs) {
      router.push(`/${lang}/portal-terapeutas`);
    }
  }, [router, lang]);

  if (!appId || !appNames[appId]) {
    return <div className="p-10 text-center text-red-500">App no encontrada.</div>;
  }

  // The static url where the legacy Vite/HTML app is served correctly via Next.js public/
  const appStaticUrl = `/legacy-apps/${appId}/index.html`;

  return (
    <div className="flex flex-col h-screen bg-stone-100 overflow-hidden">
      
      {/* Shell Header */}
      <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${lang}/portal-terapeutas/dashboard`}
            className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <div className="h-6 w-px bg-stone-200" />
          <h2 className="font-bold text-primary flex items-center gap-2">
            Módulo: <span className="text-stone-800">{appNames[appId]}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500 ml-1" title="SSO Inyectado Correctamente" />
          </h2>
        </div>

        <div>
          <button 
            onClick={() => window.open(appStaticUrl, '_blank')}
            className="text-stone-400 hover:text-primary transition-colors p-2 rounded-md hover:bg-stone-50"
            title="Abrir en pestaña nueva"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Frame Container */}
      <main className="flex-1 relative bg-white">
        
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50/80 backdrop-blur-sm z-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-stone-500 font-medium animate-pulse">Inyectando credenciales SSO y cargando módulo...</p>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-20">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-red-600 font-bold mb-2">Error cargando el módulo</p>
            <p className="text-red-500/80 text-sm">Verifica que los archivos existan en public/legacy-apps/{appId}</p>
          </div>
        )}

        <iframe 
          src={appStaticUrl}
          className="w-full h-full border-0"
          title={`Ecosistema CREI - ${appNames[appId]}`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      </main>
      
    </div>
  );
}
