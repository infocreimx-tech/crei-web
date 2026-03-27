"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, CalendarDays, Receipt, ClipboardList, 
  FolderOpen, FileText, Activity, LogOut, Hexagon, ShieldCheck
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Same Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw"; 
const sb = createClient(supabaseUrl, supabaseKey);

const apps = [
  { id: "calendario", name: "Calendario", desc: "Gestión de citas y agenda diaria.", icon: CalendarDays, color: "bg-blue-500", shadow: "shadow-blue-500/20" },
  { id: "expediente", name: "Expediente", desc: "Historial clínico de pacientes activos.", icon: FolderOpen, color: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
  { id: "preexpediente", name: "Pre-expediente", desc: "Fichas de nuevo ingreso.", icon: FileText, color: "bg-amber-500", shadow: "shadow-amber-500/20" },
  { id: "terapias", name: "Terapias & Finanzas", desc: "Control de pagos y cortes financieros.", icon: Activity, color: "bg-indigo-500", shadow: "shadow-indigo-500/20" },
  { id: "busqueda", name: "Búsqueda Global", desc: "Buscador inteligente de pacientes.", icon: Search, color: "bg-purple-500", shadow: "shadow-purple-500/20" },
  { id: "comprobante", name: "Comprobantes", desc: "Carga rápida de depósitos.", icon: Receipt, color: "bg-teal-500", shadow: "shadow-teal-500/20" },
];

export default function EcosystemDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check both Supabase Session and custom crei_session
    sb.auth.getSession().then(({ data: { session } }) => {
      const creiSessionStr = localStorage.getItem("crei_session");
      if (!session && !creiSessionStr) {
        // Not logged in! Redirect to login
        router.push("/es/portal-terapeutas");
        return;
      }
      
      let username = session?.user?.email?.split('@')[0] || "Terapeuta";
      if (creiSessionStr) {
        try {
          const parsed = JSON.parse(creiSessionStr);
          username = parsed.user || username;
        } catch {}
      }
      setUser(username);
    });
  }, [router]);

  const handleLogout = async () => {
    await sb.auth.signOut();
    localStorage.removeItem("crei_session");
    router.push("/es/portal-terapeutas");
  };

  if (!user) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Hexagon className="w-6 h-6 fill-primary/20" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-primary leading-tight">Espacio Clínico</h1>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Conexión Segura
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-stone-800 capitalize">Dr. {user.replace('admin', 'Administrador')}</p>
              <p className="text-xs text-stone-500">Sesión Activa SSO</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar Sessión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-3">
            Bienvenido al Ecosistema
          </h2>
          <p className="text-stone-500 max-w-2xl text-lg">
            Selecciona el módulo con el que deseas trabajar. Tu sesión y permisos se sincronizarán mágicamente con cada aplicación sin necesidad de volver a ingresar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => (
            <Link 
              href={`/es/portal-terapeutas/app/${app.id}`} 
              key={app.id}
              className="group bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-[220px]"
            >
              {app.color.includes("indigo") && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110" />
              )}
              {app.color.includes("blue") && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110" />
              )}
              {app.color.includes("emerald") && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110" />
              )}
              
              <div className={`w-14 h-14 rounded-2xl ${app.color} ${app.shadow} shadow-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:scale-110 transition-transform`}>
                <app.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-stone-800 mb-2 relative z-10 group-hover:text-primary transition-colors">
                {app.name}
              </h3>
              <p className="text-sm text-stone-500 relative z-10 leading-relaxed">
                {app.desc}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
