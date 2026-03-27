"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase correctly using environment variables or fallbacks for local
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
      const email = `${username.toLowerCase().trim()}@crei.mx`;

      // 1. Authenticate with Supabase Auth natively (generates sb-<id>-auth-token token)
      // We try a few permutations of the email to maximize SSO compatibility with legacy apps
      const emailsToTry = [
        `${username.toLowerCase().trim()}@crei.mx`,
        `${username.toLowerCase().trim()}@gmail.com`,
        username.trim()
      ];
      
      let gotAuthToken = false;
      for (const email of emailsToTry) {
        const { data: authData, error: authError } = await sb.auth.signInWithPassword({ email, password });
        if (!authError && authData?.user) {
          gotAuthToken = true;
          break;
        }
      }

      // 2. IMPORTANT: Even if standard email Auth fails, we MUST check the custom 'usuarios' table RPC
      // because Terapias uses explicitly custom usernames (e.g. "Admin") instead of emails.
      const { data: rpcData, error: rpcError } = await sb.rpc("login_user", { 
        p_username: username, 
        p_password: password 
      });

      if (rpcData && rpcData.success) {
        // Write complete "crei_session" so ALL legacy apps can extract the identity
        const sessionData = {
          user: rpcData.user.username,      // primary key used by most apps
          username: rpcData.user.username,   // explicit key for SSO injector
          role: rpcData.user.role,           // "admin" or "therapist"
          id: String(rpcData.user.id),       // ensure string for JWT sub
        };
        localStorage.setItem("crei_session", JSON.stringify(sessionData));
        
        // Let them through!
        router.push(`/${lang}/portal-terapeutas/dashboard`);
      } else {
        // Both failed. The custom table doesn't have it either.
        throw new Error("Usuario o contraseña incorrectos.");
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Usuario o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1e1b4b] flex items-center justify-center relative overflow-hidden p-6">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card */}
        <div className="bg-[#1e293b]/80 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-center">
          
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-primary/30">
            <Shield className="w-10 h-10 text-primary-light text-white" />
          </div>

          <h1 className="text-3xl font-serif font-bold text-white mb-2 text-center">
            Portal de Terapeutas
          </h1>
          <p className="text-indigo-200 text-center mb-10">
            Ecosistema Clínico Unificado CREI
          </p>

          {(errorMsg || true) && errorMsg !== "" && (
            <div className="w-full mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                Usuario
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-indigo-900 bg-[#0f172a] focus:bg-[#1e1b4b] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white text-lg"
                  placeholder="Ej. Alberto" 
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-xl border border-indigo-900 bg-[#0f172a] focus:bg-[#1e1b4b] focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white text-lg"
                  placeholder="••••••••" 
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white mt-4 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all focus:ring-4 focus:ring-primary/40 disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Conectando Entorno Seguro...
                </>
              ) : (
                <>
                  Ingresar al Ecosistema
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-xs text-indigo-400/60 text-center font-medium">
            Acceso exclusivo y confidencial a plataformas clínicas y calendarios de CREI.
          </p>

        </div>
      </div>
    </main>
  );
}
