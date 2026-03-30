"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";
const sb = createClient(supabaseUrl, supabaseKey);

export default function TherapistLogin() {
  const { lang } = useI18n();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const emailsToTry = [
        `${username.toLowerCase().trim()}@crei.mx`,
        `${username.toLowerCase().trim()}@gmail.com`,
        username.trim()
      ];

      for (const email of emailsToTry) {
        const { data: authData, error: authError } = await sb.auth.signInWithPassword({ email, password });
        if (!authError && authData?.user) break;
      }

      const { data: rpcData } = await sb.rpc("login_user", {
        p_username: username,
        p_password: password
      });

      if (rpcData && rpcData.success) {
        const sessionData = {
          user: rpcData.user.username,
          username: rpcData.user.username,
          role: rpcData.user.role,
          id: String(rpcData.user.id),
        };
        localStorage.setItem("crei_session", JSON.stringify(sessionData));
        router.push(`/${lang}/portal-terapeutas/dashboard`);
      } else {
        throw new Error("Usuario o contraseña incorrectos.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Usuario o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#150b24" }} /* Deep midnight purple */
    >
      {/* Intense dark background blobs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,92,191,0.2) 0%, transparent 60%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(159,134,192,0.15) 0%, transparent 60%)" }}
      />

      {/* Back to website link */}
      <Link
        href={`/${lang}`}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-colors z-10 hover:text-white"
        style={{ color: "#c4b5fd" }}
      >
        <span className="text-lg">←</span>
        Volver al sitio
      </Link>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-24 h-24 mb-3">
            <Image
              src="/logo-header.png"
              alt="CREI Logo"
              fill
              className="object-contain drop-shadow-[0_0_15px_rgba(124,92,191,0.5)]"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-1 tracking-tight" style={{ color: "#fbfaff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            Portal Clínico
          </h1>
          <p className="text-[11px] tracking-[0.25em] uppercase font-bold" style={{ color: "#e9d5ff" }}>
            Ecosistema CREI Pro
          </p>
        </div>

        {/* Premium Dark Glass Card */}
        <div
          className="rounded-[2rem] p-8 md:p-10"
          style={{
            background: "rgba(30, 15, 45, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(159, 134, 192, 0.25)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(124, 92, 191, 0.15) inset",
          }}
        >
          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs font-bold tracking-widest uppercase" style={{ color: "#c4b5fd" }}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Conexión Segura
          </div>

          {errorMsg && (
            <div
              className="mb-6 rounded-2xl p-4 flex items-start gap-3"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-200">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                className="block text-[10px] font-bold tracking-widest uppercase"
                style={{ color: "#c4b5fd" }}
              >
                Usuario
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all placeholder:text-white/30 font-medium"
                style={{
                  background: "rgba(20, 10, 35, 0.9)",
                  border: "1px solid rgba(124,92,191,0.4)",
                  color: "#fbfaff",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                }}
                placeholder="Identificador o correo"
                autoComplete="username"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#d8b4e2";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(159,134,192,0.3)";
                  e.currentTarget.style.background = "rgba(30, 15, 45, 1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(124,92,191,0.4)";
                  e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)";
                  e.currentTarget.style.background = "rgba(20, 10, 35, 0.9)";
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-[10px] font-bold tracking-widest uppercase"
                style={{ color: "#c4b5fd" }}
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                  style={{ color: "#9f86c0" }}
                  id="lock-icon"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-xl text-sm outline-none transition-all placeholder:text-white/30 font-medium"
                  style={{
                    background: "rgba(20, 10, 35, 0.9)",
                    border: "1px solid rgba(124,92,191,0.4)",
                    color: "#fbfaff",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#d8b4e2";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(159,134,192,0.3)";
                    e.currentTarget.style.background = "rgba(30, 15, 45, 1)";
                    document.getElementById('lock-icon')!.style.color = "#d8b4e2";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(124,92,191,0.4)";
                    e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)";
                    e.currentTarget.style.background = "rgba(20, 10, 35, 0.9)";
                    document.getElementById('lock-icon')!.style.color = "#9f86c0";
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 text-[13px] uppercase tracking-wider group"
              style={{
                background: isLoading
                  ? "#4a2c5e"
                  : "linear-gradient(135deg, #7c5cbf, #9f86c0)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: isLoading ? "none" : "0 8px 25px rgba(124,92,191,0.4)",
              }}
              onMouseEnter={(e) => {
                if(!isLoading) e.currentTarget.style.boxShadow = "0 10px 30px rgba(159,134,192,0.6)";
              }}
              onMouseLeave={(e) => {
                if(!isLoading) e.currentTarget.style.boxShadow = "0 8px 25px rgba(124,92,191,0.4)";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Autorizando...
                </>
              ) : (
                <>
                  Acceder a la bóveda
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] tracking-widest uppercase font-bold" style={{ color: "#7c5cbf" }}>
            CREI · Inteligencia Clínica
          </p>
        </div>
      </div>
    </main>
  );
}
