"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, TrendingUp, Plus, Loader2,
  Download, X, CheckCircle2, DollarSign, Calendar, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { useI18n } from "@/i18n/I18nProvider";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw"
);

const fmt = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const TIPOS = ["conferencia", "evento", "donacion", "otro"] as const;

export default function IngresosPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [terapias, setTerapias] = useState<any[]>([]);
  const [manuales, setManuales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ concepto: "", tipo: "otro", monto: "", fecha: new Date().toISOString().split("T")[0], descripcion: "" });

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

    const [{ data: ter }, { data: man }] = await Promise.all([
      sb.from("terapias").select("*, usuarios:terapeuta_id(username)").gte("fecha", start).lte("fecha", end).order("fecha", { ascending: false }),
      sb.from("ingresos_manuales").select("*").gte("fecha", start).lte("fecha", end).order("fecha", { ascending: false }),
    ]);
    setTerapias(ter || []);
    setManuales(man || []);
    setIsLoading(false);
  };

  const totalTerapias = useMemo(() => terapias.reduce((s, r) => s + +(r.crei_monto || 0), 0), [terapias]);
  const totalManuales = useMemo(() => manuales.reduce((s, r) => s + +(r.monto || 0), 0), [manuales]);
  const granTotal = totalTerapias + totalManuales;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await sb.from("ingresos_manuales").insert([{ ...form, monto: +form.monto, registrado_por: "admin" }]);
      if (error) throw error;
      setShowModal(false);
      setForm({ concepto: "", tipo: "otro", monto: "", fecha: new Date().toISOString().split("T")[0], descripcion: "" });
      fetchData();
    } catch (err: any) { alert("Error: " + err.message); }
    finally { setSubmitting(false); }
  };

  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

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
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-serif font-bold" style={{ color: "#fbfaff" }}>Ingresos</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", boxShadow: "0 4px 15px rgba(16,185,129,0.3)" }}>
          <Plus className="w-3.5 h-3.5" /> Agregar Ingreso
        </button>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Calendar className="w-4 h-4 text-[#c4b5fd]" />
            <select value={month} onChange={e => setMonth(+e.target.value)}
              className="bg-transparent text-sm font-bold focus:outline-none" style={{ color: "#fbfaff" }}>
              {meses.map((m, i) => <option key={i} value={i + 1} style={{ background: "#1e0f34" }}>{m}</option>)}
            </select>
            <input type="number" value={year} onChange={e => setYear(+e.target.value)}
              className="w-20 bg-transparent text-sm font-bold focus:outline-none text-center" style={{ color: "#fbfaff" }} />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Ingresos Terapias", value: totalTerapias, color: "#10b981", icon: TrendingUp },
            { label: "Ingresos Manuales", value: totalManuales, color: "#3b82f6", icon: FileText },
            { label: "Gran Total", value: granTotal, color: "#a855f7", icon: DollarSign, big: true },
          ].map(({ label, value, color, icon: Icon, big }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl p-6 bg-white/[0.03] border backdrop-blur-xl ${big ? "sm:col-span-1" : ""}`}
              style={{ borderColor: `${color}40` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: "#fbfaff" }}>{label}</span>
              </div>
              <p className="text-3xl font-serif font-bold" style={{ color }}>{fmt(value)}</p>
            </motion.div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#7c5cbf]" /></div>
        ) : (
          <>
            {/* Terapias Table */}
            <section className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <h2 className="font-serif font-bold text-lg" style={{ color: "#fbfaff" }}>Ingresos por Terapias</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{terapias.length} registros</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead style={{ background: "rgba(30,15,52,0.8)" }}>
                    <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
                      <th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Terapeuta</th>
                      <th className="px-6 py-4 text-right">Monto Total</th><th className="px-6 py-4 text-right">Ingreso CREI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {terapias.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-white/30 italic">Sin registros este mes</td></tr>
                    ) : terapias.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm opacity-70">{new Date(r.fecha).toLocaleDateString("es-MX")}</td>
                        <td className="px-6 py-4 text-sm font-bold">{r.usuarios?.username || "—"}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: "#fbfaff" }}>{fmt(+(r.monto || 0))}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-emerald-400">{fmt(+(r.crei_monto || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Manuales Table */}
            <section className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <h2 className="font-serif font-bold text-lg" style={{ color: "#fbfaff" }}>Ingresos Manuales</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{manuales.length} registros</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead style={{ background: "rgba(30,15,52,0.8)" }}>
                    <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
                      <th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Concepto</th>
                      <th className="px-6 py-4">Tipo</th><th className="px-6 py-4 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {manuales.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-white/30 italic">Sin registros este mes</td></tr>
                    ) : manuales.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm opacity-70">{new Date(r.fecha).toLocaleDateString("es-MX")}</td>
                        <td className="px-6 py-4 text-sm font-bold">{r.concepto}</td>
                        <td className="px-6 py-4"><span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{r.tipo}</span></td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-blue-400">{fmt(+(r.monto || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
              style={{ background: "#1e0f34", border: "1px solid rgba(159,134,192,0.25)" }}
              onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full filter blur-[80px] opacity-10" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10"><Plus className="w-5 h-5 text-emerald-400" /></div>
                  <h3 className="text-xl font-serif font-bold" style={{ color: "#fbfaff" }}>Nuevo Ingreso</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {[
                  { label: "Concepto", key: "concepto", type: "text", placeholder: "Ej. Conferencia de bienestar" },
                  { label: "Monto ($)", key: "monto", type: "number", placeholder: "0.00" },
                  { label: "Fecha", key: "fecha", type: "date", placeholder: "" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">{label}</label>
                    <input type={type} required placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#7c5cbf] transition-all"
                      style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                      value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">Tipo</label>
                  <select required className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#7c5cbf]"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                    value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                    {TIPOS.map(t => <option key={t} value={t} style={{ background: "#1e0f34" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">Descripción (opcional)</label>
                  <textarea rows={2} placeholder="Notas adicionales..."
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#7c5cbf] resize-none"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                    value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#fbfaff" }}>Cancelar</button>
                  <button type="submit" disabled={submitting}
                    className="flex-[2] py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-white"
                    style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Guardar Ingreso
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
