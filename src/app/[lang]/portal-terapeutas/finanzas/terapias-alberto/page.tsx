"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, User, Loader2, FileSpreadsheet,
  Activity, DollarSign, Calendar, TrendingUp, TrendingDown
} from "lucide-react";
import { exportToExcel, fmtFecha, fmtMXN } from "@/utils/exportToExcel";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { useI18n } from "@/i18n/I18nProvider";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw"
);

const fmt = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function TerapiasAlbertoPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [terapias, setTerapias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = localStorage.getItem("crei_session");
    if (!s) { router.push(`/${lang}/portal-terapeutas`); return; }
    try {
      const p = JSON.parse(s);
      const isAdmin = p.role === "admin";
      const isAlberto = (p.user || "").toLowerCase() === "alberto";
      if (!isAdmin && !isAlberto) router.push(`/${lang}/portal-terapeutas/dashboard`);
    }
    catch { router.push(`/${lang}/portal-terapeutas`); }
  }, [router, lang]);

  useEffect(() => { fetchData(); }, [month, year]);

  const fetchData = async () => {
    setIsLoading(true);
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = new Date(year, month, 0).toISOString().split("T")[0];

    // Fetch terapias de Alberto (terapeuta_id → usuarios)
    const { data: all } = await sb
      .from("terapias")
      .select("*, usuarios:terapeuta_id(username)")
      .gte("fecha", start)
      .lte("fecha", end)
      .order("fecha", { ascending: false });
    // Filtrar solo Alberto
    setTerapias((all || []).filter((r: any) => r.usuarios?.username?.toLowerCase() === "alberto"));
    setIsLoading(false);
  };

  const totalSesiones = terapias.length;
  const totalMonto = useMemo(() => terapias.reduce((s, r) => s + +(r.monto || 0), 0), [terapias]);
  const totalCrei = useMemo(() => terapias.reduce((s, r) => s + +(r.crei_monto || 0), 0), [terapias]);
  const totalAlberto = useMemo(() => terapias.reduce((s, r) => s + +(r.ter_monto || 0), 0), [terapias]);

  const handleExcelExport = () => {
    const label = `${MESES[month - 1]} ${year}`;
    exportToExcel(
      [
        {
          sheetName: "Sesiones Alberto",
          rows: terapias.map((r) => ({
            Fecha: fmtFecha(r.fecha),
            "Monto Total": fmtMXN(r.monto),
            "Ingreso CREI": fmtMXN(r.crei_monto),
            "Nómina Alberto": fmtMXN(r.ter_monto),
          })),
        },
        {
          sheetName: "Resumen",
          rows: [
            { Concepto: "Total Sesiones", Valor: totalSesiones },
            { Concepto: "Total Cobrado", Valor: fmtMXN(totalMonto) },
            { Concepto: "Ingreso CREI", Valor: fmtMXN(totalCrei) },
            { Concepto: "Nómina Alberto", Valor: fmtMXN(totalAlberto) },
          ],
        },
      ],
      `CREI_TerapiasAlberto_${label.replace(" ", "_")}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#150b24" }}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: "rgba(21,11,36,0.85)", borderBottom: "1px solid rgba(159,134,192,0.25)", boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center gap-4">
          <Link href="/es" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8"><Image src="/logo-header.png" alt="CREI" fill className="object-contain" unoptimized /></div>
            <span className="font-serif font-bold text-sm hidden sm:inline" style={{ color: "#fbfaff" }}>CREI</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <Link href={`/${lang}/portal-terapeutas/dashboard`}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            style={{ color: "#c4b5fd" }}>
            <ArrowLeft className="w-3 h-3" /> Volver
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-serif font-bold" style={{ color: "#fbfaff" }}>Terapias Alberto</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
        <button onClick={handleExcelExport}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
          style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", color: "#93c5fd" }}>
          <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
        </button>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Calendar className="w-4 h-4 text-[#c4b5fd]" />
            <select value={month} onChange={e => setMonth(+e.target.value)}
              className="bg-transparent text-sm font-bold focus:outline-none" style={{ color: "#fbfaff" }}>
              {MESES.map((m, i) => <option key={i} value={i + 1} style={{ background: "#1e0f34" }}>{m}</option>)}
            </select>
            <input type="number" value={year} onChange={e => setYear(+e.target.value)}
              className="w-20 bg-transparent text-sm font-bold focus:outline-none text-center" style={{ color: "#fbfaff" }} />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-blue-400">Alberto</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Sesiones", value: totalSesiones, color: "#3b82f6", display: String(totalSesiones), icon: Activity },
            { label: "Total Cobrado", value: totalMonto, color: "#fbfaff", display: fmt(totalMonto), icon: DollarSign },
            { label: "Ingreso CREI (100%)", value: totalCrei, color: "#10b981", display: fmt(totalCrei), icon: TrendingUp },
          ].map(({ label, color, display, icon: Icon }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 bg-white/[0.03] border backdrop-blur-xl"
              style={{ borderColor: `${color}40` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60" style={{ color: "#fbfaff" }}>{label}</span>
              </div>
              <p className="text-2xl font-serif font-bold" style={{ color }}>{display}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <section className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <h2 className="font-serif font-bold text-lg" style={{ color: "#fbfaff" }}>Registro de Sesiones</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{totalSesiones} sesiones</span>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#7c5cbf]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead style={{ background: "rgba(30,15,52,0.8)" }}>
                  <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4 text-right">Monto Total</th>
                    <th className="px-6 py-4 text-right">Ingreso CREI (100%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {terapias.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-16 text-center text-white/30 italic">Sin sesiones registradas para Alberto este mes</td></tr>
                  ) : terapias.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm opacity-70">{new Date(r.fecha).toLocaleDateString("es-MX", { weekday: "short", day: "2-digit", month: "short" })}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: "#fbfaff" }}>{fmt(+(r.monto || 0))}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-emerald-400">{fmt(+(r.crei_monto || 0))}</td>
                    </tr>
                  ))}
                </tbody>
                {terapias.length > 0 && (
                  <tfoot style={{ background: "rgba(30,15,52,0.9)" }}>
                    <tr className="font-bold">
                      <td colSpan={1} className="px-6 py-4 text-xs uppercase tracking-widest" style={{ color: "#c4b5fd" }}>TOTALES</td>
                      <td className="px-6 py-4 text-right" style={{ color: "#fbfaff" }}>{fmt(totalMonto)}</td>
                      <td className="px-6 py-4 text-right text-emerald-400">{fmt(totalCrei)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
