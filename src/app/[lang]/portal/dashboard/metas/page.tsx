"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Locale } from "@/i18n/messages";
import { ArrowLeft, Target, LogOut } from "lucide-react";
import Link from "next/link";
import GoalTracker from "@/components/GoalTracker";

export default function MetasPage({ params }: { params: Promise<{ lang: Locale }> }) {
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
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#e6e0f0", borderTopColor: "#0f766e" }} />
    </div>;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "#120a1f" }}>
      {/* Background gradients */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#0f766e] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(21, 11, 36, 0.85)", borderBottom: "1px solid rgba(15, 118, 110, 0.25)" }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/portal/dashboard`} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-[#5eead4] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#fbfaff] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#2dd4bf]" />
              Cumplimiento de Metas
            </h1>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push(`/${lang}/portal`))} className="text-[#5eead4] hover:text-white transition-colors px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border border-white/10 hover:bg-white/10 flex items-center gap-1.5">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      {/* ── Main Layout: Goals ── */}
      <main className="w-full relative z-10 flex flex-col items-center">
        <section className="w-full py-16 px-4 md:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <GoalTracker />
          </div>
        </section>
      </main>
    </div>
  );
}
