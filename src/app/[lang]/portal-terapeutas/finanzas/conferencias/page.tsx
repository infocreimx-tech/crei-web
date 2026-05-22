"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, Mic, Plus, Loader2, FileSpreadsheet,
  X, CheckCircle2, Calendar, DollarSign
} from "lucide-react";
import { exportToExcel, fmtFecha, fmtMXN } from "@/utils/exportToExcel";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { useI18n } from "@/i18n/I18nProvider";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw"
);

const fmt = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const TIPOS = ["conferencia", "evento", "donacion", "otro"] as const;
const TIPO_COLORS: Record<string, string> = { conferencia: "#f59e0b", evento: "#3b82f6", donacion: "#10b981", otro: "#9f86c0" };
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function ConferenciasPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [registros, setRegistros] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ concepto: "", tipo: "conferencia", monto: "", fecha: new Date().toISOString().split("T")[0], descripcion: "" });

  useEffect(() => {
    const s = localStorage.getItem("crei_session");
    if (!s) { router.push(`/${lang}/portal-terapeutas`); return; }
    try { const p = JSON.parse(s); if (p.role !== "admin") router.push(`/${lang}/portal-terapeutas/dashboard`); }
    catch { router.push(`/${lang}/portal-terapeutas`); }
  }, [router, lang]);

  useEffect(() => { fetchData(); }, [month, year]);

  const fetchData = async () => {
    setIsLoading(true);
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = new Date(year, month, 0).toISOString().split("T")[0];
    const { data } = await sb.from("ingresos_manuales").select("*").gte("fecha", start).lte("fecha", end).order("fecha", { ascending: false });
    setRegistros(data || []);
    setIsLoading(false);
  };

  const byTipo = useMemo(() => {
    const map: Record<string, number> = { conferencia: 0, evento: 0, donacion: 0, otro: 0 };
    registros.forEach(r => { map[r.tipo] = (map[r.tipo] || 0) + +(r.monto || 0); });
    return map;
  }, [registros]);
  const granTotal = useMemo(() => registros.reduce((s, r) => s + +(r.monto || 0), 0), [registros]);

  const handleExcelExport = () => {
    const label = `${MESES[month - 1]} ${year}`;
    exportToExcel(
      [
        {
          sheetName: "Conferencias y Otros",
          rows: registros.map((r) => ({
            Fecha: fmtFecha(r.fecha),
            Concepto: r.concepto,
            Tipo: r.tipo,
            Monto: fmtMXN(r.monto),
            Descripción: r.descripcion || "",
          })),
        },
        {
          sheetName: "Resumen por Tipo",
          rows: [
            ...TIPOS.map((t) => ({ Tipo: t.charAt(0).toUpperCase() + t.slice(1), Total: fmtMXN(byTipo[t] || 0) })),
            { Tipo: "GRAN TOTAL", Total: fmtMXN(granTotal) },
          ],
        },
      ],
      `CREI_Conferencias_${label.replace(" ", "_")}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await sb.from("ingresos_manuales").insert([{ ...form, monto: +form.monto, registrado_por: "admin" }]);
      if (error) throw error;
      setShowModal(false);
      setForm({ concepto: "", tipo: "conferencia", monto: "", fecha: new Date().toISOString().split("T")[0], descripcion: "" });
      fetchData();
    } catch (err: any) { alert("Error: " + err.message); }
    finally { setSubmitting(false); }
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
            <Mic className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-serif font-bold" style={{ color: "#fbfaff" }}>Conferencias y Otros</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExcelExport}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#fde68a" }}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", boxShadow: "0 4px 15px rgba(245,158,11,0.3)" }}>
            <Plus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Calendar className="w-4 h-4 text-[#c4b5fd]" />
            <select value={month} onChange={e => setMonth(+e.target.value)}
              className="bg-transparent text-sm font-bold focus:outline-none" style={{ color: "#fbfaff" }}>
              {MESES.map((m, i) => <option key={i} value={i + 1} style={{ background: "#1e0f34" }}>{m}</option>)}
            </select>
            <input type="number" value={year} onChange={e => setYear(+e.target.value)}
              className="w-20 bg-transparent text-sm font-bold focus:outline-none text-center" style={{ color: "#fbfaff" }} />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {TIPOS.map(tipo => (
            <motion.div key={tipo} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-5 bg-white/[0.03] border backdrop-blur-xl"
              style={{ borderColor: `${TIPO_COLORS[tipo]}40` }}>
              <span className="text-[9px] font-black uppercase tracking-widest block mb-2" style={{ color: TIPO_COLORS[tipo] }}>{tipo}</span>
              <p className="text-xl font-serif font-bold" style={{ color: TIPO_COLORS[tipo] }}>{fmt(byTipo[tipo] || 0)}</p>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 bg-white/[0.05] border border-purple-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-1 mb-2">
              <DollarSign className="w-3 h-3 text-purple-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">Total</span>
            </div>
            <p className="text-xl font-serif font-bold text-purple-400">{fmt(granTotal)}</p>
          </motion.div>
        </div>

        {/* Table */}
        <section className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="font-serif font-bold text-lg" style={{ color: "#fbfaff" }}>Registros</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{registros.length} entradas</span>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#7c5cbf]" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead style={{ background: "rgba(30,15,52,0.8)" }}>
                  <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
                    <th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Concepto</th>
                    <th className="px-6 py-4">Tipo</th><th className="px-6 py-4">Descripción</th>
                    <th className="px-6 py-4 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registros.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-16 text-center text-white/30 italic">Sin registros este mes</td></tr>
                  ) : registros.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm opacity-70">{new Date(r.fecha).toLocaleDateString("es-MX")}</td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: "#fbfaff" }}>{r.concepto}</td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border"
                          style={{ color: TIPO_COLORS[r.tipo], background: `${TIPO_COLORS[r.tipo]}15`, borderColor: `${TIPO_COLORS[r.tipo]}30` }}>
                          {r.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm opacity-60">{r.descripcion || "—"}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: TIPO_COLORS[r.tipo] }}>{fmt(+(r.monto || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl"
              style={{ background: "#1e0f34", border: "1px solid rgba(159,134,192,0.25)" }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Mic className="w-5 h-5 text-amber-400" /></div>
                  <h3 className="text-xl font-serif font-bold" style={{ color: "#fbfaff" }}>Nuevo Registro</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">Tipo</label>
                  <select required className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                    value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                    {TIPOS.map(t => <option key={t} value={t} style={{ background: "#1e0f34" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                {[
                  { label: "Concepto", key: "concepto", type: "text", placeholder: "Ej. Conferencia anual CREI" },
                  { label: "Monto ($)", key: "monto", type: "number", placeholder: "0.00" },
                  { label: "Fecha", key: "fecha", type: "date", placeholder: "" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">{label}</label>
                    <input type={type} required placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                      value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">Descripción (opcional)</label>
                  <textarea rows={2} placeholder="Notas..."
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                    value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#fbfaff" }}>Cancelar</button>
                  <button type="submit" disabled={submitting}
                    className="flex-[2] py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
