"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, Loader2, ShieldCheck, Plus, Minus, 
  Search, TrendingUp, TrendingDown, Wallet, Printer, Download,
  User, Calendar, Receipt, DollarSign, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { useI18n } from "@/i18n/I18nProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uywihjppwzrrfjkguvot.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw";
const sb = createClient(supabaseUrl, supabaseKey);

// Interfaces
interface Paciente {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
}

interface Movimiento {
  id: string;
  tipo: 'DEPOSITO' | 'GASTO';
  monto: number;
  concepto: string;
  fecha: string;
}

export default function FondoPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // New Patient Modal State
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [newPatientData, setNewPatientData] = useState({ nombre: "", apellidos: "" });
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);

  // Fondo State (Real Data)
  const [currentFondo, setCurrentFondo] = useState<any>(null);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [montoAcumulado, setMontoAcumulado] = useState(0);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  // Form State
  const [montoInput, setMontoInput] = useState("");
  const [conceptoInput, setConceptoInput] = useState("");
  const [actionType, setActionType] = useState<'DEPOSITO' | 'GASTO'>('DEPOSITO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const creiSessionStr = localStorage.getItem("crei_session");
      if (!creiSessionStr) {
        router.push(`/${lang}/portal-terapeutas`);
        return;
      }
      try {
        const parsed = JSON.parse(creiSessionStr);
        if (parsed.role !== "admin") {
          router.push(`/${lang}/portal-terapeutas/dashboard`);
          return;
        }
        setIsAdmin(true);
      } catch {
        router.push(`/${lang}/portal-terapeutas`);
      }
      setIsLoading(false);
    };

    checkAuth();
    fetchPacientes();
  }, [router, lang]);

  // Fetch Fondo data when patient changes
  useEffect(() => {
    if (selectedPacienteId) {
      fetchFondoAndMovimientos(selectedPacienteId);
    } else {
      setSaldoTotal(0);
      setMontoAcumulado(0);
      setMovimientos([]);
      setCurrentFondo(null);
    }
  }, [selectedPacienteId]);

  const fetchPacientes = async () => {
    const { data, error } = await sb
      .from("pacientes_fondos")
      .select("id, nombre, apellidos")
      .order("nombre");
    
    if (!error && data) {
      setPacientes(data.map(p => ({ ...p, email: "" })));
    }
  };

  const fetchFondoAndMovimientos = async (pacienteId: string) => {
    // 1. Fetch Fondo (Using new paciente_fondo_id)
    const { data: fondoData, error: fondoError } = await sb
      .from("fondos")
      .select("*")
      .eq("paciente_fondo_id", pacienteId)
      .single();

    if (fondoData) {
      setCurrentFondo(fondoData);
      setSaldoTotal(Number(fondoData.saldo_total));
      setMontoAcumulado(Number(fondoData.monto_acumulado));

      // 2. Fetch Movimientos
      const { data: movData, error: movError } = await sb
        .from("movimientos_fondo")
        .select("*")
        .eq("fondo_id", fondoData.id)
        .order("creado_en", { ascending: false });

      if (movData) {
        setMovimientos(movData.map((m: any) => ({
          id: m.id,
          tipo: m.tipo,
          monto: Number(m.monto),
          concepto: m.concepto,
          fecha: m.creado_en
        })));
      }
    } else {
      // No fondo yet for this patient
      setCurrentFondo(null);
      setSaldoTotal(0);
      setMontoAcumulado(0);
      setMovimientos([]);
    }
  };

  const selectedPaciente = useMemo(() => 
    pacientes.find(p => p.id === selectedPacienteId),
    [pacientes, selectedPacienteId]
  );

  const filteredPacientes = useMemo(() => 
    pacientes.filter(p => 
      `${p.nombre} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [pacientes, searchTerm]
  );

  const progressPercentage = useMemo(() => {
    if (montoAcumulado === 0) return 0;
    return Math.min(Math.max((saldoTotal / montoAcumulado) * 100, 0), 100);
  }, [saldoTotal, montoAcumulado]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!montoInput || isNaN(Number(montoInput)) || !selectedPacienteId) return;
    
    setIsSubmitting(true);
    const monto = Number(montoInput);
    
    try {
      let fondoId = currentFondo?.id;

      // 1. If no fondo exists, create it
      if (!fondoId) {
        const { data: newFondo, error: createError } = await sb
          .from("fondos")
          .insert([{ paciente_fondo_id: selectedPacienteId, saldo_total: 0, monto_acumulado: 0 }])
          .select()
          .single();
        
        if (createError) throw createError;
        fondoId = newFondo.id;
      }

      // 2. Insert Movimiento
      const { error: movError } = await sb
        .from("movimientos_fondo")
        .insert([{
          fondo_id: fondoId,
          tipo: actionType,
          monto: monto,
          concepto: conceptoInput || (actionType === 'DEPOSITO' ? 'Abono a fondo' : 'Cargo por servicio')
        }]);

      if (movError) throw movError;

      // 3. Re-fetch all data (The trigger in SQL handles the balance update)
      await fetchFondoAndMovimientos(selectedPacienteId);

      // Reset Form
      setMontoInput("");
      setConceptoInput("");
    } catch (err: any) {
      alert("Error al registrar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingPatient(true);
    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatientData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear paciente");

      // Success: refresh list and select the new patient
      await fetchPacientes();
      setSelectedPacienteId(data.user.id);
      setIsNewPatientModalOpen(false);
      setNewPatientData({ nombre: "", apellidos: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreatingPatient(false);
    }
  };

  const handleExportPDF = () => {
    if (!selectedPaciente || movimientos.length === 0) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header 
    doc.setFillColor(30, 15, 52); // Brand color (dark purple)
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CREI", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Centro de Rehabilitación e Intervención", 20, 32);
    
    doc.setFontSize(16);
    doc.text("Estado de Cuenta", pageWidth - 20, 25, { align: "right" });
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString('es-MX'), pageWidth - 20, 32, { align: "right" });

    // Patient Info
    doc.setTextColor(30, 15, 52);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PACIENTE", 20, 55);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Nombre: ${selectedPaciente.nombre} ${selectedPaciente.apellidos}`, 20, 62);
    doc.text(`Email: ${selectedPaciente.email || 'N/A'}`, 20, 68);
    
    // Balance Summary
    doc.setFillColor(245, 245, 250);
    doc.rect(pageWidth - 80, 50, 65, 25, "F");
    doc.setFont("helvetica", "bold");
    doc.text("SALDO ACTUAL", pageWidth - 75, 58);
    doc.setFontSize(18);
    doc.text(`$${saldoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, pageWidth - 75, 68);

    // Table
    const tableData = movimientos.map((m, idx) => {
      const historicalBalance = movimientos
        .slice(idx)
        .reduce((acc, mov) => acc + (mov.tipo === 'DEPOSITO' ? mov.monto : -mov.monto), 0);
      
      return [
        new Date(m.fecha).toLocaleDateString('es-MX'),
        m.concepto,
        m.tipo === 'DEPOSITO' ? 'Abono' : 'Cargo',
        `$${m.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        `$${historicalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
      ];
    });

    autoTable(doc, {
      startY: 85,
      head: [["Fecha", "Concepto", "Tipo", "Monto", "Saldo"]],
      body: tableData,
      headStyles: { fillColor: [124, 92, 191], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        3: { halign: 'right', fontStyle: 'bold' },
        4: { halign: 'right', fontStyle: 'bold' }
      }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Este documento es un comprobante informativo emitido por el Portal Clínico CREI.", pageWidth / 2, finalY, { align: "center" });

    doc.save(`Estado_de_Cuenta_${selectedPaciente.nombre}_${selectedPaciente.apellidos}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#150b24]">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c5cbf]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#150b24] text-[#fbfaff]">
      {/* ── Header ── */}
      <header
        className="h-14 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 backdrop-blur-xl"
        style={{
          background: "rgba(21, 11, 36, 0.85)",
          borderBottom: "1px solid rgba(159, 134, 192, 0.25)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link href="/es" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <Image src="/logo-header.png" alt="CREI" fill className="object-contain" unoptimized />
            </div>
            <span className="font-serif font-bold text-sm hidden sm:inline">CREI</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <Link
            href={`/${lang}/portal-terapeutas/dashboard`}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-3 h-3" />
            Volver
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#7c5cbf]" />
            <span className="text-sm font-serif font-bold">Gestión de Fondos</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#c4b5fd]">Admin</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c5cbf] to-[#9f86c0] flex items-center justify-center text-[10px] font-bold">
            AD
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none">
        
        {/* Left Side: Patient Selection & Summary */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Quick Actions for Admin */}
          <section className="grid grid-cols-2 gap-3">
            <button 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-[#7c5cbf]/20 hover:border-[#7c5cbf]/40 transition-all group"
              onClick={() => setIsNewPatientModalOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Nuevo Paciente</span>
            </button>
            <button 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-[#e11d48]/20 hover:border-[#e11d48]/40 transition-all group"
              onClick={() => {
                if(selectedPacienteId) {
                  setActionType('GASTO');
                  // Desplazarse al formulario
                  document.getElementById('transaction-form')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  alert("Selecciona primero un paciente");
                }
              }}
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-100">Nuevo Gasto</span>
            </button>
          </section>

          <section className="rounded-3xl p-6 bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-[#c4b5fd]">
              <Search className="w-3.5 h-3.5" />
              Seleccionar Paciente
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text"
                placeholder="Buscar paciente..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#7c5cbf] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredPacientes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPacienteId(p.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left group ${
                    selectedPacienteId === p.id 
                    ? 'bg-[#7c5cbf] text-white shadow-[0_0_20px_rgba(124,92,191,0.4)]' 
                    : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 group-hover:scale-110 transition-transform`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">{p.nombre} {p.apellidos}</p>
                    <p className="text-[10px] opacity-60 font-medium">{p.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {selectedPaciente && (
            <motion.section 
              id="transaction-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-[#7c5cbf]/20 to-[#9f86c0]/10 border border-[#7c5cbf]/30 backdrop-blur-md"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-[#c4b5fd]">
                <Plus className="w-3.5 h-3.5" />
                Nueva Transacción
              </h2>
              
              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => setActionType('DEPOSITO')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    actionType === 'DEPOSITO' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 opacity-60'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Depósito
                </button>
                <button 
                  onClick={() => setActionType('GASTO')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    actionType === 'GASTO' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 opacity-60'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  Gasto
                </button>
              </div>

              <form onSubmit={handleAction} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c4b5fd] mb-1.5 ml-1">Monto ($)</label>
                  <input 
                    type="number"
                    required
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#7c5cbf]"
                    value={montoInput}
                    onChange={(e) => setMontoInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#c4b5fd] mb-1.5 ml-1">Concepto</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Sesión individual..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#7c5cbf]"
                    value={conceptoInput}
                    onChange={(e) => setConceptoInput(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 mt-4 ${
                    actionType === 'DEPOSITO' 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                    : 'bg-red-500 hover:bg-red-400 text-white'
                  }`}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {actionType === 'DEPOSITO' ? 'Agregar al Fondo' : 'Registrar Gasto'}
                </button>
              </form>
            </motion.section>
          )}
        </div>

        {/* Right Side: Movements & Progress Bar */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {!selectedPaciente ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-[#7c5cbf]/50" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Selecciona un paciente</h3>
              <p className="text-sm text-white/40 max-w-xs">Elige un paciente del listado lateral para gestionar su fondo y ver su estado de cuenta.</p>
            </div>
          ) : (
            <>
              {/* Progress Bar Card */}
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[3rem] p-8 bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden"
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c5cbf] rounded-full filter blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c4b5fd]">Fondo Disponible</span>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg">
                      <span className="text-3xl mr-1 text-[#7c5cbf]">$</span>
                      {saldoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </h2>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Monto Acumulado</p>
                      <p className="font-bold text-lg">${montoAcumulado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Porcentaje</p>
                      <p className={`font-bold text-lg ${progressPercentage < 20 ? 'text-red-400' : progressPercentage < 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        {progressPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* The Progressive Bar */}
                <div className="relative h-6 w-full bg-black/40 rounded-full border border-white/5 p-1 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full shadow-[0_0_15px_rgba(124,92,191,0.3)] relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(90deg, 
                        ${progressPercentage < 30 ? '#ef4444' : progressPercentage < 60 ? '#f59e0b' : '#10b981'}, 
                        ${progressPercentage < 30 ? '#f87171' : progressPercentage < 60 ? '#fbbf24' : '#34d399'}
                      )` 
                    }}
                  >
                    {/* Animated Shine */}
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.div>
                </div>
                
                <p className="mt-4 text-[10px] font-medium text-center text-white/30 uppercase tracking-widest">
                  La barra se depleta conforme se registran gastos del paciente
                </p>
              </motion.section>

              {/* Account Statement */}
              <section className="flex-1 rounded-[3rem] bg-white/[0.03] border border-white/10 flex flex-col overflow-hidden print:border-none print:bg-white print:text-black">
                <div className="p-8 border-b border-white/10 flex items-center justify-between print:hidden">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-[#c4b5fd]" />
                    <h3 className="font-serif font-bold text-lg">Historial de Movimientos</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleExportPDF}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2 group"
                      title="Descargar PDF"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="hidden md:inline text-xs font-bold uppercase tracking-widest">PDF</span>
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2 group"
                      title="Imprimir"
                    >
                      <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Print Header (Visible only in print) */}
                <div className="hidden print:block p-8 border-b-2 border-slate-200">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-3xl font-serif font-bold text-slate-800">Estado de Cuenta</h1>
                      <p className="text-slate-500 font-medium">CREI · Centro de Rehabilitación e Intervención</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase text-slate-400">Fecha de Reporte</p>
                      <p className="font-bold">{new Date().toLocaleDateString('es-MX')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Paciente</p>
                      <p className="text-xl font-bold uppercase">{selectedPaciente.nombre} {selectedPaciente.apellidos}</p>
                      <p className="text-sm opacity-70">{selectedPaciente.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Saldo Actual</p>
                      <p className="text-3xl font-bold text-slate-900">${saldoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-0 overflow-auto">
                  {movimientos.length === 0 ? (
                    <div className="p-20 text-center text-white/20">
                      <p className="italic">No se han registrado movimientos para este paciente.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-[#1e0f34] text-[10px] font-bold uppercase tracking-[0.2em] text-[#c4b5fd] print:bg-slate-100 print:text-slate-600">
                        <tr>
                          <th className="px-8 py-4">Fecha</th>
                          <th className="px-8 py-4">Concepto</th>
                          <th className="px-8 py-4 text-right">Monto</th>
                          <th className="px-8 py-4 text-right">Saldo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-slate-200">
                        {movimientos.map((m, idx) => {
                          // Calculate historical balance for each row
                          // movimientos is newest first
                          const historicalBalance = movimientos
                            .slice(idx)
                            .reduce((acc, mov) => acc + (mov.tipo === 'DEPOSITO' ? mov.monto : -mov.monto), 0);
                          
                          return (
                            <tr key={m.id} className="hover:bg-white/[0.02] transition-colors print:hover:bg-transparent">
                              <td className="px-8 py-5 text-xs opacity-60">
                                {new Date(m.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="px-8 py-5">
                                <p className="text-sm font-bold">{m.concepto}</p>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1 ${
                                  m.tipo === 'DEPOSITO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {m.tipo === 'DEPOSITO' ? 'Abono' : 'Cargo'}
                                </span>
                              </td>
                              <td className={`px-8 py-5 text-right font-bold ${m.tipo === 'DEPOSITO' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {m.tipo === 'DEPOSITO' ? '+' : '-'}${m.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-8 py-5 text-right text-sm font-bold text-white/80 print:text-black">
                                ${historicalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Print Footer */}
                <div className="hidden print:block p-8 border-t-2 border-slate-200 mt-auto text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Este documento es un comprobante informativo de movimientos de fondo en el portal clínico CREI.</p>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Styled JSX for print hiding and scrollbars */}
      <style jsx global>{`
        @media print {
          nav, header, aside, .print\\:hidden { display: none !important; }
          body { background: white !important; overflow: visible !important; }
          main { display: block !important; p: 0 !important; }
          .rounded-\\[3rem\\], .rounded-3xl { border-radius: 0 !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(159, 134, 192, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(159, 134, 192, 0.4); }
      `}</style>
      
      {/* ── New Patient Modal ── */}
      <AnimatePresence>
        {isNewPatientModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewPatientModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#1e0f34] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c5cbf] rounded-full filter blur-[80px] opacity-20" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-serif font-bold">Nuevo Paciente</h3>
                </div>
                <button onClick={() => setIsNewPatientModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePatient} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#c4b5fd] ml-1">Nombre</label>
                    <input 
                      type="text" required placeholder="Ej. Juan"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#7c5cbf]"
                      value={newPatientData.nombre}
                      onChange={(e) => setNewPatientData({ ...newPatientData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#c4b5fd] ml-1">Apellidos</label>
                    <input 
                      type="text" required placeholder="Ej. Pérez"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-[#7c5cbf]"
                      value={newPatientData.apellidos}
                      onChange={(e) => setNewPatientData({ ...newPatientData, apellidos: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsNewPatientModalOpen(false)}
                    className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreatingPatient}
                    className="flex-[2] py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] bg-emerald-500 hover:bg-emerald-400 text-white transition-all flex items-center justify-center gap-2"
                  >
                    {isCreatingPatient ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Crear y Seleccionar
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
