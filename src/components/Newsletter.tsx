"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

import { getSupabase } from "@/lib/supabase";

export default function Newsletter({ lang = "es" }: { lang?: "en" | "es" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const t = {
    es: {
      title: "Suscríbete a nuestro boletín",
      desc: "Recibe los últimos artículos sobre salud mental, desarrollo personal y herramientas para transform tu vida directamente en tu correo.",
      placeholder: "Ingresa tu correo aquí",
      button: "Suscribirme",
      loading: "Procesando...",
      success: "¡Suscrito!",
      privacy: "Respetamos tu privacidad. Cero spam.",
    },
    en: {
      title: "Subscribe to our newsletter",
      desc: "Get the latest articles on mental health, personal development, and tools to transform your life delivered straight to your inbox.",
      placeholder: "Enter your email here",
      button: "Subscribe",
      loading: "Processing...",
      success: "Subscribed!",
      privacy: "We respect your privacy. Zero spam.",
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    
    try {
      const sb = getSupabase();
      const { error } = await sb.from("suscripciones_blog").insert([{ email: email.trim() }]);
      
      // We gracefully swallow duplicate key violations (23505) so the user just sees "Success" again without alarm.
      if (error && error.code !== '23505') throw error;
      
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("Newsletter Subscription Error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28 my-10 mx-4 sm:mx-6 rounded-3xl lg:mx-auto max-w-7xl shadow-2xl">
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset] backdrop-blur-md">
              <Mail className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">
            {t.desc}
          </p>
          
          <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row items-center">
            <label htmlFor="email-address" className="sr-only">
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 w-full flex-auto rounded-2xl border-0 bg-white/5 px-4 py-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-400 sm:text-sm sm:leading-6 backdrop-blur-md transition-all outline-none"
              placeholder={t.placeholder}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="flex-none w-full sm:w-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                t.loading
              ) : status === "success" ? (
                <>
                  {t.success} <CheckCircle2 className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t.button} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-slate-400/80">
            {t.privacy}
          </p>
        </div>
      </div>
    </section>
  );
}
