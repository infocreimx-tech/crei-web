"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Locale } from "@/i18n/messages";
import { ArrowLeft, BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import TwelveStepsNotebook from "@/components/TwelveStepsNotebook";

export default function DocePasosPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>("es");
  const router = useRouter();
  const supabase = getSupabase();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setLang(p.lang));
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${lang}/portal`);
        return;
      }
      setLoading(false);
    };
    checkUser();
  }, [lang, router, params, supabase]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#150b24]">
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#e6e0f0", borderTopColor: "#7c5cbf" }} />
    </div>;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "#150b24" }}>
      {/* Background gradients */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#7c5cbf] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(21, 11, 36, 0.85)", borderBottom: "1px solid rgba(159, 134, 192, 0.25)" }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/portal/dashboard`} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-[#c4b5fd] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#fbfaff] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#7c5cbf]" />
              12 pasos de AA y metas
            </h1>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push(`/${lang}/portal`))} className="text-[#d8b4e2] hover:text-white transition-colors px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border border-white/10 hover:bg-white/10 flex items-center gap-1.5">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      {/* ── Main Layout: Stacked E-book then Goals ── */}
      <main className="w-full relative z-10 flex flex-col items-center">
        
        {/* Full Width Wrapper for Ebook to look elegant */}
        <section className="w-full py-16 px-4 md:px-8 relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] min-h-[calc(100vh-80px)]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#150b24] pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <TwelveStepsNotebook />
          </div>
        </section>
      </main>
    </div>
  );
}
