"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, BarChart3, Loader2, FileSpreadsheet,
  TrendingUp, TrendingDown, DollarSign, Percent, Calendar
} from "lucide-react";
import { exportToExcel, fmtMXN } from "@/utils/exportToExcel";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { useI18n } from "@/i18n/I18nProvider";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw"
);

const fmt = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const MESES_NOMBRES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MESES_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

interface MonthData {
  mes: string;
  ingresos_terapias: number;
  ingresos_manuales: number;
  total_ingresos: number;
  nomina: number;
  gastos: number;
  total_egresos: number;
  utilidad: number;
  margen: number;
}

export default function UtilidadNetaPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [currentData, setCurrentData] = useState<MonthData | null>(null);
  const [historial, setHistorial] = useState<MonthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = localStorage.getItem("crei_session");
    if (!s) { router.push(`/${lang}/portal-terapeutas`); return; }
    try { const p = JSON.parse(s); if (p.role !== "admin") router.push(`/${lang}/portal-terapeutas/dashboard`); }
    catch { router.push(`/${lang}/portal-terapeutas`); }
  }, [router, lang]);

  useEffect(() => { fetchData(); }, [month, year]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch last 6 months of data
      const results: MonthData[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(year, month - 1 - i, 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        const start = `${y}-${String(m).padStart(2, "0")}-01`;
        const end = new Date(y, m, 0).toISOString().split("T")[0];

        const [{ data: ter }, { data: ing }, { data: eg }] = await Promise.all([
          sb.from("terapias").select("crei_monto,ter_monto").gte("fecha", start).lte("fecha", end),
          sb.from("ingresos_manuales").select("monto").gte("fecha", start).lte("fecha", end),
          sb.from("egresos").select("monto").gte("fecha", start).lte("fecha", end),
        ]);

        const ingresos_terapias = (ter || []).reduce((s: number, r: any) => s + +(r.crei_monto || 0), 0);
        const nomina = (ter || []).reduce((s: number, r: any) => s + +(r.ter_monto || 0), 0);
        const ingresos_manuales = (ing || []).reduce((s: number, r: any) => s + +(r.monto || 0), 0);
        const gastos = (eg || []).reduce((s: number, r: any) => s + +(r.monto || 0), 0);
        const total_ingresos = ingresos_terapias + ingresos_manuales;
        const total_egresos = nomina + gastos;
        const utilidad = total_ingresos - total_egresos;
        const margen = total_ingresos > 0 ? (utilidad / total_ingresos) * 100 : 0;

        const mesData: MonthData = {
          mes: `${MESES_NOMBRES[m - 1]} ${y}`,
          ingresos_terapias, ingresos_manuales, total_ingresos,
          nomina, gastos, total_egresos, utilidad, margen
        };
        results.push(mesData);
      }
      setHistorial(results);
      setCurrentData(results[results.length - 1]);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const maxVal = useMemo(() => Math.max(...historial.map(h => Math.max(h.total_ingresos, h.total_egresos)), 1), [historial]);

  const handleExcelExport = () => {
    const label = `${MESES_FULL[month - 1]} ${year}`;
    exportToExcel(
      [
        {
          sheetName: "Histórico 6 Meses",
          rows: [...historial].reverse().map((h) => ({
            Mes: h.mes,
            "Ingresos Terapias": fmtMXN(h.ingresos_terapias),
            "Ingresos Manuales": fmtMXN(h.ingresos_manuales),
            "Total Ingresos": fmtMXN(h.total_ingresos),
            "Nómina": fmtMXN(h.nomina),
            "Gastos Adicionales": fmtMXN(h.gastos),
            "Total Egresos": fmtMXN(h.total_egresos),
            "Utilidad Neta": fmtMXN(h.utilidad),
            "Margen %": `${h.margen.toFixed(1)}%`,
          })),
        },
        {
          sheetName: "Mes Actual",
          rows: currentData ? [
            { Concepto: "Ingresos Terapias", Monto: fmtMXN(currentData.ingresos_terapias) },
            { Concepto: "Ingresos Manuales", Monto: fmtMXN(currentData.ingresos_manuales) },
            { Concepto: "TOTAL INGRESOS", Monto: fmtMXN(currentData.total_ingresos) },
            { Concepto: "Nómina Terapeutas", Monto: fmtMXN(currentData.nomina) },
            { Concepto: "Gastos Adicionales", Monto: fmtMXN(currentData.gastos) },
            { Concepto: "TOTAL EGRESOS", Monto: fmtMXN(currentData.total_egresos) },
            { Concepto: "UTILIDAD NETA", Monto: fmtMXN(currentData.utilidad) },
            { Concepto: "MARGEN %", Monto: `${currentData.margen.toFixed(1)}%` },
          ] : [],
        },
      ],
      `CREI_UtilidadNeta_${label.replace(" ", "_")}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#150b24" }}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: "rgba(21,11,36,0.85)", borderBottom: "1px solid rgba(159,134,192,0.25)", boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center gap-4">
          <Link href="/es" className="flex items-center gap-2">
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
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-serif font-bold" style={{ color: "#fbfaff" }}>Utilidad Neta</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
        <button onClick={handleExcelExport}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
          style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)", color: "#d8b4fe" }}>
          <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
        </button>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Calendar className="w-4 h-4 text-[#c4b5fd]" />
            <select value={month} onChange={e => setMonth(+e.target.value)}
              className="bg-transparent text-sm font-bold focus:outline-none" style={{ color: "#fbfaff" }}>
              {MESES_FULL.map((m, i) => <option key={i} value={i + 1} style={{ background: "#1e0f34" }}>{m}</option>)}
            </select>
            <input type="number" value={year} onChange={e => setYear(+e.target.value)}
              className="w-20 bg-transparent text-sm font-bold focus:outline-none text-center" style={{ color: "#fbfaff" }} />
          </div>
          <span className="text-xs text-white/30 font-medium">Mostrando los últimos 6 meses hasta el mes seleccionado</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#7c5cbf]" /></div>
        ) : currentData && (
          <>
            {/* Main KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Ingresos Totales", value: fmt(currentData.total_ingresos), color: "#10b981", icon: TrendingUp, sub: `Terapias: ${fmt(currentData.ingresos_terapias)}` },
                { label: "Egresos Totales", value: fmt(currentData.total_egresos), color: "#ef4444", icon: TrendingDown, sub: `Nómina: ${fmt(currentData.nomina)}` },
                {
                  label: "Utilidad Neta", value: fmt(currentData.utilidad),
                  color: currentData.utilidad >= 0 ? "#a855f7" : "#ef4444",
                  icon: DollarSign, sub: currentData.utilidad >= 0 ? "✓ Positiva" : "⚠ Negativa"
                },
                {
                  label: "Margen", value: `${currentData.margen.toFixed(1)}%`,
                  color: currentData.margen >= 30 ? "#10b981" : currentData.margen >= 10 ? "#f59e0b" : "#ef4444",
                  icon: Percent, sub: currentData.margen >= 30 ? "Excelente" : currentData.margen >= 10 ? "Aceptable" : "Bajo"
                },
              ].map(({ label, value, color, icon: Icon, sub }) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl p-6 bg-white/[0.03] border backdrop-blur-xl relative overflow-hidden"
                  style={{ borderColor: `${color}40` }}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10" style={{ background: color }} />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-50" style={{ color: "#fbfaff" }}>{label}</span>
                  </div>
                  <p className="text-2xl font-serif font-bold mb-1" style={{ color }}>{value}</p>
                  <p className="text-[10px] opacity-50" style={{ color: "#fbfaff" }}>{sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Ingresos breakdown */}
              <div className="rounded-3xl p-6 bg-white/[0.03] border border-emerald-500/20">
                <h3 className="font-serif font-bold mb-4 flex items-center gap-2" style={{ color: "#fbfaff" }}>
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Desglose de Ingresos
                </h3>
                {[
                  { label: "Terapias (CREI)", value: currentData.ingresos_terapias, color: "#10b981" },
                  { label: "Conferencias y Otros", value: currentData.ingresos_manuales, color: "#3b82f6" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: "#fbfaff" }}>{label}</span>
                      <span className="font-bold" style={{ color }}>{fmt(value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${currentData.total_ingresos > 0 ? (value / currentData.total_ingresos) * 100 : 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: color }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Egresos breakdown */}
              <div className="rounded-3xl p-6 bg-white/[0.03] border border-red-500/20">
                <h3 className="font-serif font-bold mb-4 flex items-center gap-2" style={{ color: "#fbfaff" }}>
                  <TrendingDown className="w-4 h-4 text-red-400" /> Desglose de Egresos
                </h3>
                {[
                  { label: "Nómina Terapeutas", value: currentData.nomina, color: "#f97316" },
                  { label: "Gastos Adicionales", value: currentData.gastos, color: "#ef4444" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: "#fbfaff" }}>{label}</span>
                      <span className="font-bold" style={{ color }}>{fmt(value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${currentData.total_egresos > 0 ? (value / currentData.total_egresos) * 100 : 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <section className="rounded-3xl p-6 bg-white/[0.03] border border-white/10">
              <h3 className="font-serif font-bold mb-6" style={{ color: "#fbfaff" }}>Histórico — Últimos 6 meses</h3>
              <div className="flex items-end gap-4 h-40 mb-4">
                {historial.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-1 h-32">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(h.total_ingresos / maxVal) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="flex-1 rounded-t-lg" style={{ background: "linear-gradient(to top,#059669,#10b981)", minHeight: "4px" }} />
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(h.total_egresos / maxVal) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
                        className="flex-1 rounded-t-lg" style={{ background: "linear-gradient(to top,#dc2626,#ef4444)", minHeight: "4px" }} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-50 text-center" style={{ color: "#fbfaff" }}>{h.mes}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="opacity-60" style={{ color: "#fbfaff" }}>Ingresos</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500" /><span className="opacity-60" style={{ color: "#fbfaff" }}>Egresos</span></div>
              </div>
            </section>

            {/* Historical Table */}
            <section className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="font-serif font-bold" style={{ color: "#fbfaff" }}>Resumen Mensual</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead style={{ background: "rgba(30,15,52,0.8)" }}>
                    <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
                      <th className="px-6 py-4">Mes</th>
                      <th className="px-6 py-4 text-right">Ingresos</th>
                      <th className="px-6 py-4 text-right">Egresos</th>
                      <th className="px-6 py-4 text-right">Utilidad</th>
                      <th className="px-6 py-4 text-right">Margen %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[...historial].reverse().map((h, i) => (
                      <tr key={i} className={`hover:bg-white/[0.02] transition-colors ${i === 0 ? "bg-white/[0.03]" : ""}`}>
                        <td className="px-6 py-4 text-sm font-bold" style={{ color: "#fbfaff" }}>{h.mes} {i === 0 && <span className="text-[9px] font-black uppercase tracking-widest ml-2 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">Actual</span>}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-emerald-400">{fmt(h.total_ingresos)}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-red-400">{fmt(h.total_egresos)}</td>
                        <td className={`px-6 py-4 text-right text-sm font-bold ${h.utilidad >= 0 ? "text-purple-400" : "text-red-500"}`}>{fmt(h.utilidad)}</td>
                        <td className={`px-6 py-4 text-right text-sm font-bold ${h.margen >= 30 ? "text-emerald-400" : h.margen >= 10 ? "text-amber-400" : "text-red-400"}`}>{h.margen.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
