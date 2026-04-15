"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search, CalendarDays, Receipt, ClipboardList,
  FolderOpen, FileText, Activity, LogOut, ShieldCheck, ArrowRight, Users, Database
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import PushNotificationManager from "@/components/PushNotificationManager";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";
const sb = createClient(supabaseUrl, supabaseKey);

const apps = [
  { id: "calendario", name: "Calendario", desc: "Gestión de citas y agenda diaria.", icon: CalendarDays, accent: "#7c5cbf" },
  { id: "preexpediente", name: "Pre-expediente", desc: "Fichas de nuevo ingreso.", icon: FileText, accent: "#0f766e" },
  { id: "expediente", name: "Expediente", desc: "Historial clínico de pacientes activos.", icon: FolderOpen, accent: "#0369a1" },
  { id: "terapias", name: "Terapias & Finanzas", desc: "Control de pagos y cortes financieros.", icon: Activity, accent: "#9f86c0" },
  { id: "busqueda", name: "Búsqueda Global", desc: "Buscador inteligente de pacientes.", icon: Search, accent: "#6b5e7c" },
  { id: "comprobante", name: "Comprobantes", desc: "Carga rápida de depósitos.", icon: Receipt, accent: "#4a2c5e" },
];

export default function EcosystemDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      const creiSessionStr = localStorage.getItem("crei_session");
      if (!session && !creiSessionStr) {
        router.push("/es/portal-terapeutas");
        return;
      }

      let username = session?.user?.email?.split("@")[0] || "Terapeuta";
      let userRole = "";
      if (creiSessionStr) {
        try {
          const parsed = JSON.parse(creiSessionStr);
          username = parsed.user || username;
          userRole = parsed.role || "";
        } catch {}
      }
      setUser(username);
      setRole(userRole);
    });
  }, [router]);

  const handleLogout = async () => {
    await sb.auth.signOut();
    localStorage.removeItem("crei_session");
    router.push("/es/portal-terapeutas");
  };

  if (!user)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #fbfaff 0%, #f0eafc 100%)" }}
      >
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#e6e0f0", borderTopColor: "#7c5cbf" }}
        />
      </div>
    );

  return (
    <div
      className="min-h-screen"
      style={{ background: "#150b24" }} /* Deep midnight purple */
    >
      {/* ── Navbar matching premium dark site style ── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "rgba(21, 11, 36, 0.85)",
          borderBottom: "1px solid rgba(159, 134, 192, 0.25)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/es" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11">
              <Image src="/logo-header.png" alt="CREI" fill className="object-contain drop-shadow-[0_0_8px_rgba(159,134,192,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(159,134,192,0.8)] transition-all" unoptimized priority />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight" style={{ color: "#fbfaff" }}>
              CREI
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-widest uppercase" style={{ color: "#c4b5fd" }}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="capitalize text-[#fbfaff]">{user.toLowerCase() === "admin" ? "Administrador" : user}</span>
            </div>

            <div className="w-px h-5" style={{ background: "rgba(159, 134, 192, 0.25)" }} />

            <PushNotificationManager />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all hover:bg-white/10"
              style={{ color: "#d8b4e2", border: "1px solid rgba(159, 134, 192, 0.3)" }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative">
        
        {/* Ambient Dark Glows */}
        <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-[#7c5cbf] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#9f86c0] rounded-full mix-blend-screen filter blur-[120px] opacity-5 pointer-events-none" />

        {/* Header */}
        <div className="mb-14 max-w-2xl relative z-10">
          <span
            className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] uppercase"
            style={{ color: "#9f86c0" }}
          >
            Ecosistema Clínico Unificado
          </span>
          <h2
            className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight tracking-tight"
            style={{ color: "#fbfaff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            Bienvenido,{" "}
            <span className="italic font-light" style={{ color: "#c4b5fd" }}>
              Dr. {user.toLowerCase() === "admin" ? "Administrador" : user.charAt(0).toUpperCase() + user.slice(1)}
            </span>
          </h2>
          <p className="text-lg leading-relaxed font-medium" style={{ color: "#c4b5fd" }}>
            Selecciona el módulo con el que deseas trabajar. Tu sesión y permisos se sincronizarán automáticamente.
          </p>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {apps.map((app) => (
            <Link
              href={`/es/portal-terapeutas/app/${app.id}`}
              key={app.id}
              className="group relative overflow-hidden rounded-[2rem] p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "rgba(30, 15, 45, 0.85)",
                border: "1px solid rgba(159, 134, 192, 0.25)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                backdropFilter: "blur(16px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 20px 40px rgba(0,0,0,0.7), 0 0 20px ${app.accent}40 inset`;
                (e.currentTarget as HTMLElement).style.borderColor = `${app.accent}80`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(159, 134, 192, 0.25)";
              }}
            >
              {/* Vibrant neon blob on hover */}
              <div
                className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full transition-all duration-500 opacity-20 filter blur-2xl group-hover:opacity-60 group-hover:scale-150"
                style={{ background: app.accent }}
              />

              {/* Icon */}
              <div
                className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/5"
                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`, backdropFilter: "blur(10px)" }}
              >
                <app.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: app.accent }} />
              </div>

              {/* Text */}
              <div className="relative z-10 flex-1 mt-2">
                <h3
                  className="text-xl font-serif font-bold mb-2 transition-colors drop-shadow-md"
                  style={{ color: "#fbfaff" }}
                >
                  {app.name}
                </h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: "#a78bfa" }}>
                  {app.desc}
                </p>
              </div>

              {/* Arrow */}
              <div className="relative z-10 flex items-center justify-end mt-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/5"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: app.accent }} />
                </div>
              </div>
            </Link>
          ))}

          {/* Tarjeta de Usuarios — solo visible para admin */}
          {role === "admin" && (
            <Link
              href={`/es/portal-terapeutas/usuarios`}
              className="group relative overflow-hidden rounded-[2rem] p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-2"
              style={{
                background: "rgba(30, 15, 45, 0.85)",
                border: "1px solid rgba(225, 29, 72, 0.25)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                backdropFilter: "blur(16px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 20px 40px rgba(0,0,0,0.7), 0 0 20px #e11d4840 inset`;
                (e.currentTarget as HTMLElement).style.borderColor = `#e11d4880`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(225, 29, 72, 0.25)";
              }}
            >
              {/* Blob hover */}
              <div
                className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full transition-all duration-500 opacity-20 filter blur-2xl group-hover:opacity-60 group-hover:scale-150"
                style={{ background: "#e11d48" }}
              />

              {/* Badge admin exclusivo */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "rgba(225,29,72,0.15)", border: "1px solid rgba(225,29,72,0.4)", color: "#fb7185" }}
              >
                <ShieldCheck className="w-3 h-3" />
                Solo Admin
              </div>

              {/* Icon */}
              <div
                className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/5"
                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`, backdropFilter: "blur(10px)" }}
              >
                <Users className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: "#e11d48" }} />
              </div>

              {/* Text */}
              <div className="relative z-10 flex-1 mt-2">
                <h3
                  className="text-xl font-serif font-bold mb-2 transition-colors drop-shadow-md"
                  style={{ color: "#fbfaff" }}
                >
                  Usuarios
                </h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: "#fda4af" }}>
                  Gestión de cuentas y accesos del sistema.
                </p>
              </div>

              {/* Arrow */}
              <div className="relative z-10 flex items-center justify-end mt-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/5"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: "#e11d48" }} />
                </div>
              </div>
            </Link>
          )}
        </div>
      </main>

      {/* Footer line */}
      <footer className="text-center py-8 text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#7c5cbf", borderTop: "1px solid rgba(159, 134, 192, 0.15)" }}>
        CREI · Ecosistema Clínico Unificado · Conexión Segura
      </footer>
    </div>
  );
}
