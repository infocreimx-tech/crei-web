"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShieldCheck, TrendingDown, Plus, Loader2, FileSpreadsheet,
  X, CheckCircle2, Calendar, Paperclip, ExternalLink, Receipt
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
const CATEGORIAS = ["renta", "servicios", "insumos", "marketing", "mantenimiento", "otro"] as const;
const CAT_COLORS: Record<string, string> = { renta: "#ef4444", servicios: "#f97316", insumos: "#eab308", marketing: "#3b82f6", mantenimiento: "#8b5cf6", otro: "#9f86c0" };
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function EgresosPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const now = new Date();
  const [tab, setTab] = useState<"nomina" | "gastos">("nomina");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [nomina, setNomina] = useState<any[]>([]);
  const [egresos, setEgresos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    concepto: "", categoria: "otro", monto: "",
    fecha: now.toISOString().split("T")[0],
    descripcion: "", proveedor: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    const [{ data: ter }, { data: eg }] = await Promise.all([
      sb.from("terapias").select("*, usuarios:terapeuta_id(username)").gte("fecha", start).lte("fecha", end).order("fecha", { ascending: false }),
      sb.from("egresos").select("*").gte("fecha", start).lte("fecha", end).order("fecha", { ascending: false }),
    ]);
    setNomina(ter || []);
    setEgresos(eg || []);
    setIsLoading(false);
  };

  const totalNomina = useMemo(() => nomina.reduce((s, r) => s + +(r.ter_monto || 0), 0), [nomina]);
  const totalGastos = useMemo(() => egresos.reduce((s, r) => s + +(r.monto || 0), 0), [egresos]);
  const totalEgresos = totalNomina + totalGastos;

  const handleExcelExport = () => {
    const label = `${MESES[month - 1]} ${year}`;
    exportToExcel(
      [
        {
          sheetName: "Nómina",
          rows: nomina.map((r) => ({
            Fecha: fmtFecha(r.fecha),
            Terapeuta: r.usuarios?.username || "",
            "Nómina": fmtMXN(r.ter_monto),
          })),
        },
        {
          sheetName: "Gastos Adicionales",
          rows: egresos.map((r) => ({
            Fecha: fmtFecha(r.fecha),
            Concepto: r.concepto,
            Categoría: r.categoria,
            Proveedor: r.proveedor || "",
            Monto: fmtMXN(r.monto),
            Comprobante: r.comprobante_url || "",
          })),
        },
        {
          sheetName: "Resumen",
          rows: [
            { Concepto: "Nómina Terapeutas", Monto: fmtMXN(totalNomina) },
            { Concepto: "Gastos Adicionales", Monto: fmtMXN(totalGastos) },
            { Concepto: "TOTAL EGRESOS", Monto: fmtMXN(totalEgresos) },
          ],
        },
      ],
      `CREI_Egresos_${label.replace(" ", "_")}`
    );
  };

  const uploadComprobante = async (file: File): Promise<string> => {
    setUploadProgress("Subiendo comprobante...");
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const { error } = await sb.storage.from("egresos-comprobantes").upload(filename, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data: urlData } = sb.storage.from("egresos-comprobantes").getPublicUrl(filename);
    setUploadProgress("");
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let comprobante_url = null;
      if (selectedFile) comprobante_url = await uploadComprobante(selectedFile);
      const { error } = await sb.from("egresos").insert([{
        ...form, monto: +form.monto, comprobante_url, registrado_por: "admin"
      }]);
      if (error) throw error;
      setShowModal(false);
      setForm({ concepto: "", categoria: "otro", monto: "", fecha: now.toISOString().split("T")[0], descripcion: "", proveedor: "" });
      setSelectedFile(null);
      fetchData();
    } catch (err: any) { alert("Error: " + err.message); }
    finally { setSubmitting(false); setUploadProgress(""); }
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
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-sm font-serif font-bold" style={{ color: "#fbfaff" }}>Egresos</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExcelExport}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5" }}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button onClick={() => { setTab("gastos"); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", boxShadow: "0 4px 15px rgba(239,68,68,0.3)" }}>
            <Plus className="w-3.5 h-3.5" /> Registrar Egreso
          </button>
        </div>
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
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Nómina Terapeutas", value: totalNomina, color: "#f97316" },
            { label: "Gastos Adicionales", value: totalGastos, color: "#ef4444" },
            { label: "Total Egresos", value: totalEgresos, color: "#dc2626", big: true },
          ].map(({ label, value, color }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 bg-white/[0.03] border backdrop-blur-xl" style={{ borderColor: `${color}40` }}>
              <span className="text-[9px] font-bold uppercase tracking-widest block mb-2 opacity-60" style={{ color: "#fbfaff" }}>{label}</span>
              <p className="text-3xl font-serif font-bold" style={{ color }}>{fmt(value)}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["nomina", "gastos"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${tab === t ? "text-white" : "opacity-40 hover:opacity-70"}`}
              style={tab === t ? { background: t === "nomina" ? "#f97316" : "#ef4444", boxShadow: `0 4px 15px ${t === "nomina" ? "rgba(249,115,22,0.3)" : "rgba(239,68,68,0.3)"}` } : { background: "rgba(255,255,255,0.05)" }}>
              {t === "nomina" ? "Nómina Terapeutas" : "Gastos Adicionales"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#7c5cbf]" /></div>
        ) : tab === "nomina" ? (
          <section className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <h2 className="font-serif font-bold text-lg" style={{ color: "#fbfaff" }}>Nómina de Terapeutas</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400">{nomina.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead style={{ background: "rgba(30,15,52,0.8)" }}>
                  <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
                    <th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Terapeuta</th><th className="px-6 py-4 text-right">Nómina</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {nomina.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-16 text-center text-white/30 italic">Sin registros este mes</td></tr>
                  ) : nomina.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm opacity-70">{new Date(r.fecha).toLocaleDateString("es-MX")}</td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: "#fbfaff" }}>{r.usuarios?.username || "—"}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-orange-400">{fmt(+(r.ter_monto || 0))}</td>
                    </tr>
                  ))}
                </tbody>
                {nomina.length > 0 && (
                  <tfoot style={{ background: "rgba(30,15,52,0.9)" }}>
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>TOTAL NÓMINA</td>
                      <td className="px-6 py-4 text-right font-bold text-orange-400">{fmt(totalNomina)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <h2 className="font-serif font-bold text-lg" style={{ color: "#fbfaff" }}>Gastos Adicionales</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{egresos.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead style={{ background: "rgba(30,15,52,0.8)" }}>
                  <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>
                    <th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Concepto</th>
                    <th className="px-6 py-4">Categoría</th><th className="px-6 py-4">Proveedor</th>
                    <th className="px-6 py-4">Comprobante</th><th className="px-6 py-4 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {egresos.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-white/30 italic">Sin gastos registrados este mes</td></tr>
                  ) : egresos.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm opacity-70">{new Date(r.fecha).toLocaleDateString("es-MX")}</td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: "#fbfaff" }}>{r.concepto}</td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border"
                          style={{ color: CAT_COLORS[r.categoria] || "#9f86c0", background: `${CAT_COLORS[r.categoria] || "#9f86c0"}15`, borderColor: `${CAT_COLORS[r.categoria] || "#9f86c0"}30` }}>
                          {r.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm opacity-60">{r.proveedor || "—"}</td>
                      <td className="px-6 py-4">
                        {r.comprobante_url ? (
                          <a href={r.comprobante_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-bold text-[#7c5cbf] hover:text-[#9f86c0] transition-colors">
                            <Paperclip className="w-3 h-3" /><ExternalLink className="w-3 h-3" />
                          </a>
                        ) : <span className="text-white/20 text-xs">—</span>}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-red-400">{fmt(+(r.monto || 0))}</td>
                    </tr>
                  ))}
                </tbody>
                {egresos.length > 0 && (
                  <tfoot style={{ background: "rgba(30,15,52,0.9)" }}>
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: "#c4b5fd" }}>TOTAL GASTOS</td>
                      <td className="px-6 py-4 text-right font-bold text-red-400">{fmt(totalGastos)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
              style={{ background: "#1e0f34", border: "1px solid rgba(159,134,192,0.25)" }}
              onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full filter blur-[80px] opacity-10" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><Receipt className="w-5 h-5 text-red-400" /></div>
                  <h3 className="text-xl font-serif font-bold" style={{ color: "#fbfaff" }}>Registrar Egreso</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {[
                  { label: "Concepto", key: "concepto", type: "text", placeholder: "Ej. Renta oficina" },
                  { label: "Monto ($)", key: "monto", type: "number", placeholder: "0.00" },
                  { label: "Fecha", key: "fecha", type: "date", placeholder: "" },
                  { label: "Proveedor (opcional)", key: "proveedor", type: "text", placeholder: "Ej. Inmobiliaria XYZ" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">{label}</label>
                    <input type={type} required={key !== "proveedor"} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                      value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">Categoría</label>
                  <select required className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                    value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                    {CATEGORIAS.map(c => <option key={c} value={c} style={{ background: "#1e0f34" }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">Descripción (opcional)</label>
                  <textarea rows={2} placeholder="Notas..."
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fbfaff" }}
                    value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>
                {/* File Upload */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-1 text-[#c4b5fd]">Comprobante (foto/PDF)</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full px-4 py-4 rounded-xl text-sm cursor-pointer flex items-center gap-3 transition-all hover:border-[#7c5cbf]"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px dashed rgba(255,255,255,0.2)", color: selectedFile ? "#c4b5fd" : "rgba(255,255,255,0.3)" }}>
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span>{selectedFile ? selectedFile.name : "Toca para adjuntar archivo..."}</span>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                  {uploadProgress && <p className="text-xs text-[#c4b5fd] mt-1 ml-1">{uploadProgress}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#fbfaff" }}>Cancelar</button>
                  <button type="submit" disabled={submitting}
                    className="flex-[2] py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-white transition-all"
                    style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {uploadProgress || "Guardar Egreso"}
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
