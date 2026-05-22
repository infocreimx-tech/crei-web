"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, ArrowLeft, ShieldCheck, Plus, Trash2, Save,
  FileSpreadsheet, ChevronDown, Check, X, Loader2, AlertCircle,
  Calendar, ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { exportToExcel, fmtFecha, fmtMXN } from "@/utils/exportToExcel";

const sb = createClient(
  "https://uywihjppwzrrfjkguvot.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw"
);

// ── Listas fijas ──────────────────────────────────────────────
const CONCEPTOS_TERAPIA = ["Terapia grupal", "Individual", "Conserjería", "Consulta Psiquiatría"];
const TERAPEUTAS = ["Mary Pili Llanos", "Martín Vargas", "Oswaldo Vargas", "Héctor Díaz", "Arturo Duarte", "Dr. Solis"];
const FORMAS_PAGO = ["Transferencia", "Efectivo", "Cheque"];
const TIPOS_COMPROBANTE = ["Ticket", "Número de CFDI (factura)", "Recibo", "Reembolso de gastos"];
const MESES_NOMBRES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// ── Helpers ───────────────────────────────────────────────────
const getPeriodo = (month: number, year: number) =>
  `${year}-${String(month).padStart(2, "0")}`;

const parsePeriodo = (p: string) => {
  const [y, m] = p.split("-");
  return { year: parseInt(y), month: parseInt(m) };
};

// ── Estilos tipo Excel ────────────────────────────────────────
const CELL = "px-2 py-1.5 text-xs border-r border-b border-white/10 bg-transparent focus:outline-none focus:bg-white/5 transition-colors";
const TH = "px-2 py-2 text-[10px] font-black uppercase tracking-widest text-left border-r border-b border-white/15 whitespace-nowrap";
const NUM_CELL = "px-2 py-1.5 text-[10px] text-center border-r border-b border-white/10 select-none opacity-50 font-mono";

type Tab = "residentes" | "terapias" | "gastos";

interface ResidenteRow {
  id?: string;
  num_consecutivo: number;
  expediente: string;
  nombre_completo: string;
  fecha_ingreso: string;
  fecha_pago: string;
  monto_a_pagar: string;
  monto_pagado: string;
  periodo?: string;
  isDirty?: boolean;
  isSaving?: boolean;
}

interface TerapiaRow {
  id?: string;
  num_consecutivo: number;
  nombre_terapeuta: string;
  concepto: string;
  nombre_paciente: string;
  fecha_consulta: string;
  fecha_pago: string;
  monto_acordado: string;
  monto_pagado: string;
  forma_pago: string;
  periodo?: string;
  isDirty?: boolean;
  isSaving?: boolean;
}

interface GastoRow {
  id?: string;
  num_consecutivo: number;
  concepto_gasto: string;
  monto: string;
  forma_pago: string;
  tipo_comprobante: string;
  datos_comprobante: string;
  periodo?: string;
  isDirty?: boolean;
  isSaving?: boolean;
}

const emptyResidente = (n: number, periodo: string): ResidenteRow => ({
  num_consecutivo: n, expediente: "", nombre_completo: "", fecha_ingreso: "",
  fecha_pago: "", monto_a_pagar: "", monto_pagado: "", periodo, isDirty: true,
});
const emptyTerapia = (n: number, periodo: string): TerapiaRow => ({
  num_consecutivo: n, nombre_terapeuta: "", concepto: "", nombre_paciente: "",
  fecha_consulta: "", fecha_pago: "", monto_acordado: "", monto_pagado: "",
  forma_pago: "", periodo, isDirty: true,
});
const emptyGasto = (n: number, periodo: string): GastoRow => ({
  num_consecutivo: n, concepto_gasto: "", monto: "", forma_pago: "",
  tipo_comprobante: "", datos_comprobante: "", periodo, isDirty: true,
});

// ── Componente de fecha con botón visible de calendario ──────
function DateCell({ value, onChange, placeholder = "DD/MM/AAAA" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const display = value
    ? (() => {
        const [y, m, d] = value.split("-");
        return `${d}/${m}/${y}`;
      })()
    : "";

  return (
    <div className="flex items-center w-full gap-1 px-1">
      {/* Texto de la fecha */}
      <span className="text-xs flex-1 select-none"
        style={{ color: display ? "#fbfaff" : "rgba(251,250,255,0.35)" }}>
        {display || placeholder}
      </span>

      {/* Botón calendario visible en cian — encima está el input invisible */}
      <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
        {/* Ícono visible */}
        <div className="w-full h-full flex items-center justify-center rounded-md transition-all"
          style={{
            background: "rgba(6,182,212,0.15)",
            border: "1px solid rgba(6,182,212,0.5)",
          }}>
          <Calendar style={{ width: 13, height: 13, color: "#06b6d4" }} />
        </div>
        {/* Input invisible encima del botón — clic directo = gesto real */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            opacity: 0, cursor: "pointer",
            colorScheme: "dark",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

// ── Componente Select personalizado (usa position:fixed para escapar del overflow) ──
function CellSelect({ value, options, onChange, placeholder = "—" }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.closest("[data-cellselect]")?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 180) });
    }
    setOpen(o => !o);
  };

  return (
    <div data-cellselect className="relative w-full">
      <button ref={btnRef} type="button" onClick={handleOpen}
        className="w-full text-left flex items-center justify-between gap-1 px-1 py-0.5 text-xs hover:bg-white/5 rounded transition-colors"
        style={{ color: value ? "#fbfaff" : "rgba(251,250,255,0.3)" }}>
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className="w-3 h-3 shrink-0 opacity-50" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              minWidth: coords.width,
              zIndex: 9999,
              background: "#1e0f34",
              border: "1px solid rgba(159,134,192,0.3)",
              borderRadius: "0.75rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}>
            {options.map(opt => (
              <button key={opt} type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/10 transition-colors"
                style={{ color: "#fbfaff" }}>
                {value === opt ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <span className="w-3 h-3 shrink-0" />}
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Selector de mes/año ───────────────────────────────────────
function MonthSelector({ month, year, onChange }: {
  month: number; year: number; onChange: (m: number, y: number) => void;
}) {
  const prev = () => {
    if (month === 1) onChange(12, year - 1);
    else onChange(month - 1, year);
  };
  const next = () => {
    const now = new Date();
    const isCurrentOrFuture = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
    if (isCurrentOrFuture) return;
    if (month === 12) onChange(1, year + 1);
    else onChange(month + 1, year);
  };
  const now = new Date();
  const isCurrent = month === now.getMonth() + 1 && year === now.getFullYear();

  return (
    <div className="flex items-center gap-2">
      <button onClick={prev}
        className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl min-w-[160px] justify-center"
        style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)" }}>
        <Calendar className="w-3.5 h-3.5" style={{ color: "#67e8f9" }} />
        <span className="text-sm font-bold" style={{ color: "#fbfaff" }}>
          {MESES_NOMBRES[month - 1]} {year}
        </span>
        {isCurrent && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(6,182,212,0.25)", color: "#67e8f9" }}>HOY</span>
        )}
      </div>
      <button onClick={next} disabled={isCurrent}
        className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function MedioCaminoPage() {
  const router = useRouter();
  const { lang } = useParams() as { lang: string };
  const [currentUser, setCurrentUser] = useState("");
  const [tab, setTab] = useState<Tab>("residentes");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // ── Mes/año seleccionado ─────────────────────────────────────
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const periodo = getPeriodo(month, year);

  // ── Data ────────────────────────────────────────────────────
  const [residentes, setResidentes] = useState<ResidenteRow[]>([]);
  const [terapias, setTerapias] = useState<TerapiaRow[]>([]);
  const [gastos, setGastos] = useState<GastoRow[]>([]);

  // ── Auth ────────────────────────────────────────────────────
  useEffect(() => {
    const s = localStorage.getItem("crei_session");
    if (!s) { router.push(`/${lang}/portal-terapeutas`); return; }
    try {
      const p = JSON.parse(s);
      const username = (p.user || "").trim();
      const role = (p.role || "").trim();
      // admin tiene acceso total (Fernando, Lulu) + usuarios cmc (Sergio)
      const allowedCmc = ["fernando", "lulu", "sergio"];
      if (role !== "admin" && role !== "cmc" && !allowedCmc.includes(username.toLowerCase())) {
        router.push(`/${lang}/portal-terapeutas/dashboard`);
        return;
      }
      setCurrentUser(username);
    } catch { router.push(`/${lang}/portal-terapeutas`); }
  }, [router, lang]);

  // ── Load data por periodo ────────────────────────────────────
  const loadData = async (p: string) => {
    setIsLoading(true);
    try {
      const [{ data: r }, { data: t }, { data: g }] = await Promise.all([
        sb.from("cmc_residentes").select("*").eq("periodo", p).order("num_consecutivo", { ascending: true }),
        sb.from("cmc_terapias").select("*").eq("periodo", p).order("num_consecutivo", { ascending: true }),
        sb.from("cmc_gastos").select("*").eq("periodo", p).order("num_consecutivo", { ascending: true }),
      ]);

      setResidentes((r || []).map((row: any): ResidenteRow => ({
        id: row.id,
        num_consecutivo: row.num_consecutivo,
        expediente: row.expediente || "",
        nombre_completo: row.nombre_completo || "",
        fecha_ingreso: row.fecha_ingreso || "",
        fecha_pago: row.fecha_pago || "",
        monto_a_pagar: row.monto_a_pagar != null ? String(row.monto_a_pagar) : "",
        monto_pagado: row.monto_pagado != null ? String(row.monto_pagado) : "",
        periodo: row.periodo,
        isDirty: false,
      })));

      setTerapias((t || []).map((row: any): TerapiaRow => ({
        id: row.id,
        num_consecutivo: row.num_consecutivo,
        nombre_terapeuta: row.nombre_terapeuta || "",
        concepto: row.concepto || "",
        nombre_paciente: row.nombre_paciente || "",
        fecha_consulta: row.fecha_consulta || "",
        fecha_pago: row.fecha_pago || "",
        monto_acordado: row.monto_acordado != null ? String(row.monto_acordado) : "",
        monto_pagado: row.monto_pagado != null ? String(row.monto_pagado) : "",
        forma_pago: row.forma_pago || "",
        periodo: row.periodo,
        isDirty: false,
      })));

      setGastos((g || []).map((row: any): GastoRow => ({
        id: row.id,
        num_consecutivo: row.num_consecutivo,
        concepto_gasto: row.concepto_gasto || "",
        monto: row.monto != null ? String(row.monto) : "",
        forma_pago: row.forma_pago || "",
        tipo_comprobante: row.tipo_comprobante || "",
        datos_comprobante: row.datos_comprobante || "",
        periodo: row.periodo,
        isDirty: false,
      })));
    } catch (e: any) { setError("Error al cargar: " + e.message); }
    setIsLoading(false);
  };

  useEffect(() => { loadData(periodo); }, [month, year]);

  const handleMonthChange = (m: number, y: number) => {
    setMonth(m);
    setYear(y);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ════════════════════════════════════════════════════════════
  // RESIDENTES
  // ════════════════════════════════════════════════════════════
  const addResidente = () => {
    const n = residentes.length > 0 ? Math.max(...residentes.map(r => r.num_consecutivo)) + 1 : 1;
    setResidentes(prev => [...prev, emptyResidente(n, periodo)]);
  };
  const updateResidente = (idx: number, field: keyof ResidenteRow, value: string) => {
    setResidentes(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value, isDirty: true } : r));
  };
  const saveResidente = async (idx: number) => {
    const row = residentes[idx];
    if (!row.nombre_completo.trim()) { setError("El nombre completo es requerido"); return; }
    setResidentes(prev => prev.map((r, i) => i === idx ? { ...r, isSaving: true } : r));
    try {
      const payload = {
        num_consecutivo: row.num_consecutivo,
        expediente: row.expediente || null,
        nombre_completo: row.nombre_completo,
        fecha_ingreso: row.fecha_ingreso || null,
        fecha_pago: row.fecha_pago || null,
        monto_a_pagar: row.monto_a_pagar ? parseFloat(row.monto_a_pagar) : null,
        monto_pagado: row.monto_pagado ? parseFloat(row.monto_pagado) : null,
        registrado_por: currentUser,
        periodo,
      };
      if (row.id) {
        const { error } = await sb.from("cmc_residentes").update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        const { data, error } = await sb.from("cmc_residentes").insert(payload).select().single();
        if (error) throw error;
        setResidentes(prev => prev.map((r, i) => i === idx ? { ...r, id: data.id, isDirty: false, isSaving: false } : r));
        showToast("✅ Guardado");
        return;
      }
      setResidentes(prev => prev.map((r, i) => i === idx ? { ...r, isDirty: false, isSaving: false } : r));
      showToast("✅ Guardado");
    } catch (e: any) {
      setError("Error: " + e.message);
      setResidentes(prev => prev.map((r, i) => i === idx ? { ...r, isSaving: false } : r));
    }
  };
  const deleteResidente = async (idx: number) => {
    const row = residentes[idx];
    if (!row.id) { setResidentes(prev => prev.filter((_, i) => i !== idx)); return; }
    if (!confirm("¿Eliminar este residente?")) return;
    try {
      const { error } = await sb.from("cmc_residentes").delete().eq("id", row.id);
      if (error) throw error;
      setResidentes(prev => prev.filter((_, i) => i !== idx));
      showToast("🗑️ Eliminado");
    } catch (e: any) { setError("Error: " + e.message); }
  };

  // ════════════════════════════════════════════════════════════
  // TERAPIAS
  // ════════════════════════════════════════════════════════════
  const addTerapia = () => {
    const n = terapias.length > 0 ? Math.max(...terapias.map(r => r.num_consecutivo)) + 1 : 1;
    setTerapias(prev => [...prev, emptyTerapia(n, periodo)]);
  };
  const updateTerapia = (idx: number, field: keyof TerapiaRow, value: string) => {
    setTerapias(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value, isDirty: true } : r));
  };
  const saveTerapia = async (idx: number) => {
    const row = terapias[idx];
    setTerapias(prev => prev.map((r, i) => i === idx ? { ...r, isSaving: true } : r));
    try {
      const payload = {
        num_consecutivo: row.num_consecutivo,
        nombre_terapeuta: row.nombre_terapeuta || null,
        concepto: row.concepto || null,
        nombre_paciente: row.nombre_paciente || null,
        fecha_consulta: row.fecha_consulta || null,
        fecha_pago: row.fecha_pago || null,
        monto_acordado: row.monto_acordado ? parseFloat(row.monto_acordado) : null,
        monto_pagado: row.monto_pagado ? parseFloat(row.monto_pagado) : null,
        forma_pago: row.forma_pago || null,
        registrado_por: currentUser,
        periodo,
      };
      if (row.id) {
        const { error } = await sb.from("cmc_terapias").update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        const { data, error } = await sb.from("cmc_terapias").insert(payload).select().single();
        if (error) throw error;
        setTerapias(prev => prev.map((r, i) => i === idx ? { ...r, id: data.id, isDirty: false, isSaving: false } : r));
        showToast("✅ Guardado");
        return;
      }
      setTerapias(prev => prev.map((r, i) => i === idx ? { ...r, isDirty: false, isSaving: false } : r));
      showToast("✅ Guardado");
    } catch (e: any) {
      setError("Error: " + e.message);
      setTerapias(prev => prev.map((r, i) => i === idx ? { ...r, isSaving: false } : r));
    }
  };
  const deleteTerapia = async (idx: number) => {
    const row = terapias[idx];
    if (!row.id) { setTerapias(prev => prev.filter((_, i) => i !== idx)); return; }
    if (!confirm("¿Eliminar?")) return;
    try {
      const { error } = await sb.from("cmc_terapias").delete().eq("id", row.id);
      if (error) throw error;
      setTerapias(prev => prev.filter((_, i) => i !== idx));
      showToast("🗑️ Eliminado");
    } catch (e: any) { setError("Error: " + e.message); }
  };

  // ════════════════════════════════════════════════════════════
  // GASTOS
  // ════════════════════════════════════════════════════════════
  const addGasto = () => {
    const n = gastos.length > 0 ? Math.max(...gastos.map(r => r.num_consecutivo)) + 1 : 1;
    setGastos(prev => [...prev, emptyGasto(n, periodo)]);
  };
  const updateGasto = (idx: number, field: keyof GastoRow, value: string) => {
    setGastos(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value, isDirty: true } : r));
  };
  const saveGasto = async (idx: number) => {
    const row = gastos[idx];
    setGastos(prev => prev.map((r, i) => i === idx ? { ...r, isSaving: true } : r));
    try {
      const payload = {
        num_consecutivo: row.num_consecutivo,
        concepto_gasto: row.concepto_gasto || null,
        monto: row.monto ? parseFloat(row.monto) : null,
        forma_pago: row.forma_pago || null,
        tipo_comprobante: row.tipo_comprobante || null,
        datos_comprobante: row.datos_comprobante || null,
        registrado_por: currentUser,
        periodo,
      };
      if (row.id) {
        const { error } = await sb.from("cmc_gastos").update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        const { data, error } = await sb.from("cmc_gastos").insert(payload).select().single();
        if (error) throw error;
        setGastos(prev => prev.map((r, i) => i === idx ? { ...r, id: data.id, isDirty: false, isSaving: false } : r));
        showToast("✅ Guardado");
        return;
      }
      setGastos(prev => prev.map((r, i) => i === idx ? { ...r, isDirty: false, isSaving: false } : r));
      showToast("✅ Guardado");
    } catch (e: any) {
      setError("Error: " + e.message);
      setGastos(prev => prev.map((r, i) => i === idx ? { ...r, isSaving: false } : r));
    }
  };
  const deleteGasto = async (idx: number) => {
    const row = gastos[idx];
    if (!row.id) { setGastos(prev => prev.filter((_, i) => i !== idx)); return; }
    if (!confirm("¿Eliminar?")) return;
    try {
      const { error } = await sb.from("cmc_gastos").delete().eq("id", row.id);
      if (error) throw error;
      setGastos(prev => prev.filter((_, i) => i !== idx));
      showToast("🗑️ Eliminado");
    } catch (e: any) { setError("Error: " + e.message); }
  };

  // ── Excel export ─────────────────────────────────────────────
  const handleExcelExport = () => {
    const label = `${MESES_NOMBRES[month - 1]}_${year}`;
    exportToExcel([
      {
        sheetName: "Residentes",
        rows: residentes.map(r => ({
          "Núm. Cons.": r.num_consecutivo,
          Expediente: r.expediente,
          "Nombre completo": r.nombre_completo,
          "Fecha de ingreso": r.fecha_ingreso,
          "Fecha de Pago": r.fecha_pago,
          "Monto a pagar": fmtMXN(r.monto_a_pagar),
          "Monto pagado": fmtMXN(r.monto_pagado),
        })),
      },
      {
        sheetName: "Terapias",
        rows: terapias.map(r => ({
          "Nombre Terapeuta": r.nombre_terapeuta,
          Concepto: r.concepto,
          "Nombre del paciente": r.nombre_paciente,
          "Fecha de la consulta": r.fecha_consulta,
          "Fecha de Pago": r.fecha_pago,
          "Monto acordado": fmtMXN(r.monto_acordado),
          "Monto pagado": fmtMXN(r.monto_pagado),
          "Forma de Pago": r.forma_pago,
        })),
      },
      {
        sheetName: "Gastos",
        rows: gastos.map(r => ({
          "Núm Consec": r.num_consecutivo,
          "Concepto del gasto": r.concepto_gasto,
          Monto: fmtMXN(r.monto),
          "Forma de pago": r.forma_pago,
          "Tipo de comprobante": r.tipo_comprobante,
          "Datos del comprobante": r.datos_comprobante,
        })),
      },
    ], `CREI_CMC_${label}`);
  };

  // ── Celda acción ─────────────────────────────────────────────
  const actionCell = (isDirty: boolean, isSaving: boolean, onSave: () => void, onDelete: () => void) => (
    <td className="px-2 py-1 border-b border-white/10">
      <div className="flex items-center gap-1">
        {isDirty && (
          <button onClick={onSave} disabled={isSaving}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all hover:scale-105"
            style={{ background: isSaving ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.25)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)" }}>
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          </button>
        )}
        <button onClick={onDelete}
          className="p-1 rounded-lg transition-all hover:scale-105"
          style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </td>
  );

  const tableHeader = (cols: { label: string; width?: string }[]) => (
    <thead>
      <tr style={{ background: "rgba(21,11,36,0.95)" }}>
        <th className={TH} style={{ color: "#9f86c0", width: 40 }}>#</th>
        {cols.map(c => (
          <th key={c.label} className={TH} style={{ color: "#9f86c0", width: c.width }}>{c.label}</th>
        ))}
        <th className={TH} style={{ color: "#9f86c0", width: 70 }}>Acción</th>
      </tr>
    </thead>
  );

  // ── Loading ──────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#150b24" }}>
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: "#7c5cbf" }} />
        <p className="text-sm" style={{ color: "#c4b5fd" }}>Cargando {MESES_NOMBRES[month-1]} {year}...</p>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen" style={{ background: "#150b24", color: "#fbfaff" }}>

      {/* ── Fix: colores uniformes en campos de fecha ──────── */}
      <style>{`
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-year-field,
        input[type="date"]::-webkit-datetime-edit-text,
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          color: #fbfaff !important;
          background: transparent !important;
        }
        input[type="date"]::-webkit-datetime-edit-day-field:focus,
        input[type="date"]::-webkit-datetime-edit-month-field:focus,
        input[type="date"]::-webkit-datetime-edit-year-field:focus {
          background: rgba(124, 92, 191, 0.35) !important;
          color: #fbfaff !important;
          border-radius: 3px;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.4);
          cursor: pointer;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          filter: invert(1) opacity(0.8);
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ background: "rgba(21,11,36,0.95)", borderColor: "rgba(159,134,192,0.2)" }}>
        <div className="max-w-full px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/es/portal-terapeutas/dashboard"
              className="w-9 h-9 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
              <Home className="w-4 h-4" style={{ color: "#06b6d4" }} />
            </div>
            <div>
              <h1 className="font-serif text-base font-bold leading-tight">Casa de Medio Camino</h1>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">{currentUser}</p>
            </div>
          </div>

          {/* ── Selector de mes ─────────────────────────────── */}
          <MonthSelector month={month} year={year} onChange={handleMonthChange} />

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.3)" }}>
              <ShieldCheck className="w-3 h-3" /> CMC
            </div>
            <button onClick={handleExcelExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#6ee7b7" }}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className="px-4 flex gap-0 border-t" style={{ borderColor: "rgba(159,134,192,0.1)" }}>
          {([
            { id: "residentes", label: "🏠 Residentes", count: residentes.length },
            { id: "terapias",   label: "🩺 Terapias",   count: terapias.length },
            { id: "gastos",     label: "💸 Gastos",      count: gastos.length },
          ] as { id: Tab; label: string; count: number }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2"
              style={{
                borderColor: tab === t.id ? "#06b6d4" : "transparent",
                color: tab === t.id ? "#06b6d4" : "rgba(251,250,255,0.4)",
                background: tab === t.id ? "rgba(6,182,212,0.08)" : "transparent",
              }}>
              {t.label}
              {t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                  style={{ background: tab === t.id ? "rgba(6,182,212,0.25)" : "rgba(255,255,255,0.08)", color: tab === t.id ? "#67e8f9" : "rgba(251,250,255,0.4)" }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ── Avisos ─────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-4 mt-3 flex items-center gap-3 p-3 rounded-2xl text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-24 right-4 z-50 px-4 py-2 rounded-2xl text-sm font-bold shadow-2xl"
            style={{ background: "rgba(21,11,36,0.98)", border: "1px solid rgba(16,185,129,0.4)", color: "#6ee7b7" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          TAB: RESIDENTES
      ══════════════════════════════════════════════════════ */}
      {tab === "residentes" && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-bold" style={{ color: "#06b6d4" }}>Residentes</h2>
              <p className="text-[10px] opacity-40">{MESES_NOMBRES[month-1]} {year} · {residentes.length} registros</p>
            </div>
            <button onClick={addResidente}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", color: "#67e8f9" }}>
              <Plus className="w-3.5 h-3.5" /> Agregar fila
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(159,134,192,0.2)" }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ fontSize: 12 }}>
                {tableHeader([
                  { label: "Expediente", width: "100px" },
                  { label: "Nombre completo", width: "220px" },
                  { label: "Fecha de ingreso", width: "130px" },
                  { label: "Fecha de Pago", width: "130px" },
                  { label: "Monto a pagar", width: "120px" },
                  { label: "Monto pagado", width: "120px" },
                ])}
                <tbody>
                  {residentes.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center border-b border-white/10">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <span className="text-3xl">🏠</span>
                          <p className="text-xs">Sin registros en {MESES_NOMBRES[month-1]} {year}</p>
                          <p className="text-[10px]">Haz clic en "+ Agregar fila" para comenzar</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {residentes.map((row, idx) => (
                    <motion.tr key={row.id || `new-r-${idx}`}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-white/[0.015] transition-colors"
                      style={{ background: row.isDirty ? "rgba(6,182,212,0.04)" : "transparent" }}>
                      <td className={NUM_CELL} style={{ color: "#c4b5fd" }}>{row.num_consecutivo}</td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input value={row.expediente} onChange={e => updateResidente(idx, "expediente", e.target.value)}
                          className={CELL + " w-full"} style={{ color: "#fbfaff" }} placeholder="—" />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input value={row.nombre_completo} onChange={e => updateResidente(idx, "nombre_completo", e.target.value)}
                          className={CELL + " w-full"} style={{ color: "#fbfaff" }} placeholder="Nombre completo *" />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <DateCell value={row.fecha_ingreso} onChange={v => updateResidente(idx, "fecha_ingreso", v)} />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <DateCell value={row.fecha_pago} onChange={v => updateResidente(idx, "fecha_pago", v)} />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input type="number" value={row.monto_a_pagar} onChange={e => updateResidente(idx, "monto_a_pagar", e.target.value)}
                          className={CELL + " w-full text-right"} style={{ color: "#10b981" }} placeholder="0.00" />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input type="number" value={row.monto_pagado} onChange={e => updateResidente(idx, "monto_pagado", e.target.value)}
                          className={CELL + " w-full text-right"} style={{ color: "#a855f7" }} placeholder="0.00" />
                      </td>
                      {actionCell(!!row.isDirty, !!row.isSaving, () => saveResidente(idx), () => deleteResidente(idx))}
                    </motion.tr>
                  ))}
                  {residentes.length > 0 && (
                    <tr style={{ background: "rgba(21,11,36,0.9)" }}>
                      <td colSpan={5} className="px-3 py-2 text-right text-[10px] font-black uppercase tracking-widest border-b border-white/10" style={{ color: "#c4b5fd" }}>TOTALES</td>
                      <td className="px-2 py-2 text-right text-xs font-black border-r border-b border-white/10" style={{ color: "#10b981" }}>
                        ${residentes.reduce((s, r) => s + (parseFloat(r.monto_a_pagar) || 0), 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-2 text-right text-xs font-black border-r border-b border-white/10" style={{ color: "#a855f7" }}>
                        ${residentes.reduce((s, r) => s + (parseFloat(r.monto_pagado) || 0), 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="border-b border-white/10" />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: TERAPIAS
      ══════════════════════════════════════════════════════ */}
      {tab === "terapias" && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-bold" style={{ color: "#a855f7" }}>Terapias</h2>
              <p className="text-[10px] opacity-40">{MESES_NOMBRES[month-1]} {year} · {terapias.length} registros</p>
            </div>
            <button onClick={addTerapia}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.35)", color: "#d8b4fe" }}>
              <Plus className="w-3.5 h-3.5" /> Agregar fila
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-3 p-3 rounded-xl text-[10px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(159,134,192,0.15)" }}>
            <div><p className="font-black uppercase tracking-widest mb-1" style={{ color: "#c4b5fd" }}>Conceptos</p>{CONCEPTOS_TERAPIA.map(c => <p key={c} className="opacity-60">{c}</p>)}</div>
            <div className="w-px bg-white/10" />
            <div><p className="font-black uppercase tracking-widest mb-1" style={{ color: "#c4b5fd" }}>Terapeutas</p>{TERAPEUTAS.map(t => <p key={t} className="opacity-60">{t}</p>)}</div>
            <div className="w-px bg-white/10" />
            <div><p className="font-black uppercase tracking-widest mb-1" style={{ color: "#c4b5fd" }}>Formas de pago</p>{FORMAS_PAGO.map(f => <p key={f} className="opacity-60">{f}</p>)}</div>
          </div>

          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(159,134,192,0.2)" }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ fontSize: 12 }}>
                {tableHeader([
                  { label: "Nombre Terapeuta", width: "160px" },
                  { label: "Concepto", width: "150px" },
                  { label: "Nombre del paciente", width: "180px" },
                  { label: "Fecha consulta", width: "130px" },
                  { label: "Fecha Pago", width: "130px" },
                  { label: "Monto acordado", width: "120px" },
                  { label: "Monto pagado", width: "120px" },
                  { label: "Forma de Pago", width: "140px" },
                ])}
                <tbody>
                  {terapias.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center border-b border-white/10">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <span className="text-3xl">🩺</span>
                          <p className="text-xs">Sin terapias en {MESES_NOMBRES[month-1]} {year}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {terapias.map((row, idx) => (
                    <motion.tr key={row.id || `new-t-${idx}`}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-white/[0.015] transition-colors"
                      style={{ background: row.isDirty ? "rgba(168,85,247,0.04)" : "transparent" }}>
                      <td className={NUM_CELL} style={{ color: "#c4b5fd" }}>{row.num_consecutivo}</td>
                      <td className="border-r border-b border-white/10 px-1 py-1">
                        <CellSelect value={row.nombre_terapeuta} options={TERAPEUTAS} onChange={v => updateTerapia(idx, "nombre_terapeuta", v)} placeholder="Terapeuta..." />
                      </td>
                      <td className="border-r border-b border-white/10 px-1 py-1">
                        <CellSelect value={row.concepto} options={CONCEPTOS_TERAPIA} onChange={v => updateTerapia(idx, "concepto", v)} placeholder="Concepto..." />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input value={row.nombre_paciente} onChange={e => updateTerapia(idx, "nombre_paciente", e.target.value)}
                          className={CELL + " w-full"} style={{ color: "#fbfaff" }} placeholder="Nombre paciente" />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <DateCell value={row.fecha_consulta} onChange={v => updateTerapia(idx, "fecha_consulta", v)} />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <DateCell value={row.fecha_pago} onChange={v => updateTerapia(idx, "fecha_pago", v)} />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input type="number" value={row.monto_acordado} onChange={e => updateTerapia(idx, "monto_acordado", e.target.value)}
                          className={CELL + " w-full text-right"} style={{ color: "#10b981" }} placeholder="0.00" />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input type="number" value={row.monto_pagado} onChange={e => updateTerapia(idx, "monto_pagado", e.target.value)}
                          className={CELL + " w-full text-right"} style={{ color: "#a855f7" }} placeholder="0.00" />
                      </td>
                      <td className="border-r border-b border-white/10 px-1 py-1">
                        <CellSelect value={row.forma_pago} options={FORMAS_PAGO} onChange={v => updateTerapia(idx, "forma_pago", v)} placeholder="Forma pago..." />
                      </td>
                      {actionCell(!!row.isDirty, !!row.isSaving, () => saveTerapia(idx), () => deleteTerapia(idx))}
                    </motion.tr>
                  ))}
                  {terapias.length > 0 && (
                    <tr style={{ background: "rgba(21,11,36,0.9)" }}>
                      <td colSpan={6} className="px-3 py-2 text-right text-[10px] font-black uppercase tracking-widest border-b border-white/10" style={{ color: "#c4b5fd" }}>TOTALES</td>
                      <td className="px-2 py-2 text-right text-xs font-black border-r border-b border-white/10" style={{ color: "#10b981" }}>
                        ${terapias.reduce((s, r) => s + (parseFloat(r.monto_acordado) || 0), 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-2 text-right text-xs font-black border-r border-b border-white/10" style={{ color: "#a855f7" }}>
                        ${terapias.reduce((s, r) => s + (parseFloat(r.monto_pagado) || 0), 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan={3} className="border-b border-white/10" />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB: GASTOS
      ══════════════════════════════════════════════════════ */}
      {tab === "gastos" && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-bold" style={{ color: "#ef4444" }}>Gastos</h2>
              <p className="text-[10px] opacity-40">{MESES_NOMBRES[month-1]} {year} · {gastos.length} registros</p>
            </div>
            <button onClick={addGasto}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5" }}>
              <Plus className="w-3.5 h-3.5" /> Agregar fila
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-3 p-3 rounded-xl text-[10px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(159,134,192,0.15)" }}>
            <div><p className="font-black uppercase tracking-widest mb-1" style={{ color: "#c4b5fd" }}>Tipos de comprobantes</p>{TIPOS_COMPROBANTE.map(t => <p key={t} className="opacity-60">{t}</p>)}</div>
            <div className="w-px bg-white/10" />
            <div><p className="font-black uppercase tracking-widest mb-1" style={{ color: "#c4b5fd" }}>Formas de pago</p>{FORMAS_PAGO.map(f => <p key={f} className="opacity-60">{f}</p>)}</div>
          </div>

          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(159,134,192,0.2)" }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ fontSize: 12 }}>
                {tableHeader([
                  { label: "Concepto del gasto", width: "220px" },
                  { label: "Monto", width: "110px" },
                  { label: "Forma de pago", width: "140px" },
                  { label: "Tipo comprobante", width: "200px" },
                  { label: "Datos del comprobante", width: "220px" },
                ])}
                <tbody>
                  {gastos.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center border-b border-white/10">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <span className="text-3xl">💸</span>
                          <p className="text-xs">Sin gastos en {MESES_NOMBRES[month-1]} {year}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {gastos.map((row, idx) => (
                    <motion.tr key={row.id || `new-g-${idx}`}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-white/[0.015] transition-colors"
                      style={{ background: row.isDirty ? "rgba(239,68,68,0.04)" : "transparent" }}>
                      <td className={NUM_CELL} style={{ color: "#c4b5fd" }}>{row.num_consecutivo}</td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input value={row.concepto_gasto} onChange={e => updateGasto(idx, "concepto_gasto", e.target.value)}
                          className={CELL + " w-full"} style={{ color: "#fbfaff" }} placeholder="Descripción del gasto" />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input type="number" value={row.monto} onChange={e => updateGasto(idx, "monto", e.target.value)}
                          className={CELL + " w-full text-right"} style={{ color: "#ef4444" }} placeholder="0.00" />
                      </td>
                      <td className="border-r border-b border-white/10 px-1 py-1">
                        <CellSelect value={row.forma_pago} options={FORMAS_PAGO} onChange={v => updateGasto(idx, "forma_pago", v)} placeholder="Forma de pago..." />
                      </td>
                      <td className="border-r border-b border-white/10 px-1 py-1">
                        <CellSelect value={row.tipo_comprobante} options={TIPOS_COMPROBANTE} onChange={v => updateGasto(idx, "tipo_comprobante", v)} placeholder="Tipo..." />
                      </td>
                      <td className="border-r border-b border-white/10 p-0">
                        <input value={row.datos_comprobante} onChange={e => updateGasto(idx, "datos_comprobante", e.target.value)}
                          className={CELL + " w-full"} style={{ color: "#fbfaff" }} placeholder="Folio, número, referencia..." />
                      </td>
                      {actionCell(!!row.isDirty, !!row.isSaving, () => saveGasto(idx), () => deleteGasto(idx))}
                    </motion.tr>
                  ))}
                  {gastos.length > 0 && (
                    <tr style={{ background: "rgba(21,11,36,0.9)" }}>
                      <td colSpan={2} className="px-3 py-2 text-right text-[10px] font-black uppercase tracking-widest border-b border-white/10" style={{ color: "#c4b5fd" }}>TOTAL</td>
                      <td className="px-2 py-2 text-right text-xs font-black border-r border-b border-white/10" style={{ color: "#ef4444" }}>
                        ${gastos.reduce((s, r) => s + (parseFloat(r.monto) || 0), 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td colSpan={4} className="border-b border-white/10" />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
