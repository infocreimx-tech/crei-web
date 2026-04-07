"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User, CalendarDays, FileText, BookOpen, LogOut, HeartPulse, ArrowRight, Target
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { Locale } from "@/i18n/messages";
import WelcomeModal from "@/components/WelcomeModal";

const patientApps = [
  { id: "12-pasos", name: "12 Pasos de AA", desc: "El programa base de recuperación en formato e-book.", icon: BookOpen, accent: "#7c5cbf" },
  { id: "metas", name: "Cumplimiento de Metas", desc: "Plan de acción y rastreo de tus objetivos diarios.", icon: Target, accent: "#0f766e" },
  { id: "perfil", name: "Mi Perfil", desc: "Configuración y datos personales.", icon: User, accent: "#9f86c0" }
];

export default function PatientDashboard({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>("es");
  const router = useRouter();
  const supabase = getSupabase();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    params.then((p) => setLang(p.lang));

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${lang}/portal`);
        return;
      }
      setUser(session.user);
      
      const { data: pacienteData } = await supabase
        .from("perfiles_pacientes")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (pacienteData) {
        setProfile(pacienteData);
      }
    };
    checkUser();
  }, [lang, router, params, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${lang}/portal`);
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#150b24]">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#e6e0f0", borderTopColor: "#7c5cbf" }} />
      </div>
    );

  const displayName = profile?.nombre || user?.email?.split("@")[0] || "Paciente";

  return (
    <div className="min-h-screen" style={{ background: "#150b24" }}>
      <WelcomeModal userEmail={user?.email || "unknown"} userName={displayName} />
      
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(21, 11, 36, 0.85)", borderBottom: "1px solid rgba(159, 134, 192, 0.25)", boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="relative w-11 h-11">
              <Image src="/logo-header.png" alt="CREI" fill className="object-contain drop-shadow-[0_0_8px_rgba(159,134,192,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(159,134,192,0.8)] transition-all" unoptimized priority />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight" style={{ color: "#fbfaff" }}>CREI</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#c4b5fd]">
              <HeartPulse className="w-4 h-4 text-pink-400" />
              <span className="capitalize text-[#fbfaff]">Portal Paciente</span>
            </div>

            <div className="w-px h-5" style={{ background: "rgba(159, 134, 192, 0.25)" }} />

            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all hover:bg-white/10" style={{ color: "#d8b4e2", border: "1px solid rgba(159, 134, 192, 0.3)" }}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative">
        <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-[#7c5cbf] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#9f86c0] rounded-full mix-blend-screen filter blur-[120px] opacity-5 pointer-events-none" />

        <div className="mb-14 max-w-2xl relative z-10">
          <span className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "#9f86c0" }}>Acompañamiento Integral</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight tracking-tight text-[#fbfaff]">
            Bienvenido,{" "}
            <span className="italic font-light text-[#c4b5fd]">
              {displayName}
            </span>
          </h2>
          <p className="text-lg leading-relaxed font-medium text-[#c4b5fd]">
            Este es tu espacio personal seguro. Accede a tus herramientas de recuperación, progreso y citas desde un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 relative z-10">
          {patientApps.map((app) => (
            <Link
              href={`/${lang}/portal/dashboard/${app.id === "perfil" ? "" : app.id}`}
              key={app.id}
              className="group relative overflow-hidden rounded-[2rem] p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-2"
              style={{ background: "rgba(30, 15, 45, 0.85)", border: "1px solid rgba(159, 134, 192, 0.25)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(16px)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px rgba(0,0,0,0.7), 0 0 20px ${app.accent}40 inset`;
                (e.currentTarget as HTMLElement).style.borderColor = `${app.accent}80`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(159, 134, 192, 0.25)";
              }}
            >
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full transition-all duration-500 opacity-20 filter blur-2xl group-hover:opacity-60 group-hover:scale-150" style={{ background: app.accent }} />

              <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/5" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`, backdropFilter: "blur(10px)" }}>
                <app.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: app.accent }} />
              </div>

              <div className="relative z-10 flex-1 mt-2">
                <h3 className="text-2xl font-serif font-bold mb-2 transition-colors drop-shadow-md text-[#fbfaff]">{app.name}</h3>
                <p className="text-base leading-relaxed font-medium text-[#a78bfa]">{app.desc}</p>
              </div>

              <div className="relative z-10 flex items-center justify-end mt-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/5" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: app.accent }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
