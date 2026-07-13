"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Edit3, FilePlus2, FolderOpen,
  Grid3X3, List, Loader2, MapPin, RefreshCw, Search, ShieldAlert, X
} from "lucide-react";

type WorkspaceMode = "expediente" | "calendario";

type Expediente = {
  id: string;
  folio: string;
  nombre_completo: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  fecha_nacimiento: string | null;
  sustancia_consumo: string | null;
  motivo_ingreso: string | null;
  contacto_emergencia_nombre: string | null;
  contacto_emergencia_telefono: string | null;
  contacto_emergencia_correo: string | null;
  terapeuta_asignado: string | null;
  therapist_user_id: string | null;
  activo: boolean;
  created_at: string;
};

type Cita = {
  id: string;
  expediente_id: string;
  therapist_id: string | null;
  start_at: string;
  end_at: string;
  notes: string | null;
  location: string | null;
  status: string | null;
  cancel_reason: string | null;
};

type ExpedienteDraft = {
  nombre_completo: string;
  direccion: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  sustancia_consumo: string;
  motivo_ingreso: string;
  contacto_emergencia_nombre: string;
  contacto_emergencia_telefono: string;
  contacto_emergencia_correo: string;
};

const EMPTY_DRAFT: ExpedienteDraft = {
  nombre_completo: "", direccion: "", telefono: "", email: "", fecha_nacimiento: "",
  sustancia_consumo: "", motivo_ingreso: "", contacto_emergencia_nombre: "",
  contacto_emergencia_telefono: "", contacto_emergencia_correo: ""
};

function readPortalSession() {
  try {
    const raw = localStorage.getItem("crei_session");
    if (!raw) return { id: "", name: "Terapeuta", role: "therapist" };
    const parsed = JSON.parse(raw);
    return {
      id: String(parsed.id || ""),
      name: String(parsed.user || parsed.username || "Terapeuta"),
      role: String(parsed.role || "therapist")
    };
  } catch {
    return { id: "", name: "Terapeuta", role: "therapist" };
  }
}

function localDateTimeValue(offsetHours = 1) {
  const date = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function createFolio() {
  const now = new Date();
  return `CREI-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${Date.now().toString().slice(-6)}`;
}

export default function TherapistClinicalWorkspace({ mode }: { mode: WorkspaceMode }) {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [authUserId, setAuthUserId] = useState("");
  const [portalSession, setPortalSession] = useState({ id: "", name: "Terapeuta", role: "therapist" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [showExpedienteForm, setShowExpedienteForm] = useState(false);
  const [editing, setEditing] = useState<Expediente | null>(null);
  const [draft, setDraft] = useState<ExpedienteDraft>(EMPTY_DRAFT);
  const [showCitaForm, setShowCitaForm] = useState(false);
  const [citaDraft, setCitaDraft] = useState({
    expediente_id: "", start_at: localDateTimeValue(1), end_at: localDateTimeValue(2),
    location: "Sacramento", notes: ""
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/clinical", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        if (/expediente_id|column/i.test(result.error || "")) {
          throw new Error("Primero ejecuta la migración SQL 20260713_expediente_calendario.sql en Supabase.");
        }
        throw new Error(result.error || "No fue posible cargar la información clínica.");
      }
      setAuthUserId("server-session");
      setExpedientes((result.expedientes || []) as Expediente[]);
      setCitas((result.citas || []).filter((item: Cita) => item.expediente_id) as Cita[]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible cargar la información clínica.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPortalSession(readPortalSession());
    loadData();
  }, [loadData]);

  const expedienteById = useMemo(
    () => new Map(expedientes.map((expediente) => [expediente.id, expediente])),
    [expedientes]
  );

  const filteredExpedientes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return expedientes;
    return expedientes.filter((item) =>
      [item.folio, item.nombre_completo, item.telefono, item.email, item.sustancia_consumo]
        .some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [expedientes, search]);

  const openCreateExpediente = () => {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setShowExpedienteForm(true);
  };

  const openEditExpediente = (expediente: Expediente) => {
    setEditing(expediente);
    setDraft({
      nombre_completo: expediente.nombre_completo || "",
      direccion: expediente.direccion || "",
      telefono: expediente.telefono || "",
      email: expediente.email || "",
      fecha_nacimiento: expediente.fecha_nacimiento || "",
      sustancia_consumo: expediente.sustancia_consumo || "",
      motivo_ingreso: expediente.motivo_ingreso || "",
      contacto_emergencia_nombre: expediente.contacto_emergencia_nombre || "",
      contacto_emergencia_telefono: expediente.contacto_emergencia_telefono || "",
      contacto_emergencia_correo: expediente.contacto_emergencia_correo || ""
    });
    setShowExpedienteForm(true);
  };

  const saveExpediente = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.nombre_completo.trim()) return setError("El nombre completo es obligatorio.");
    if (!authUserId) return setError("No hay una sesión autenticada de terapeuta.");
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim() || null])),
        nombre_completo: draft.nombre_completo.trim(),
        terapeuta_asignado: portalSession.name,
        therapist_user_id: authUserId,
        activo: true
      };
      const response = await fetch("/api/clinical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveExpediente", id: editing?.id || null, folio: editing?.folio || createFolio(), payload })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No fue posible guardar el expediente.");
      setNotice(editing ? "Expediente actualizado correctamente." : "Expediente creado. El paciente ya está disponible en Calendario.");
      setShowExpedienteForm(false);
      setEditing(null);
      await loadData();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible guardar el expediente.");
    } finally {
      setSaving(false);
    }
  };

  const saveCita = async (event: React.FormEvent) => {
    event.preventDefault();
    const expediente = expedienteById.get(citaDraft.expediente_id);
    if (!expediente) return setError("Selecciona un paciente registrado en Expediente.");
    if (!authUserId) return setError("No hay una sesión autenticada de terapeuta.");
    if (new Date(citaDraft.end_at) <= new Date(citaDraft.start_at)) return setError("La hora de término debe ser posterior al inicio.");
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/clinical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveCita", payload: {
        expediente_id: expediente.id,
        start_at: new Date(citaDraft.start_at).toISOString(),
        end_at: new Date(citaDraft.end_at).toISOString(),
        location: citaDraft.location,
        notes: citaDraft.notes.trim() || null,
        status: "active"
        } })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No fue posible agendar la cita.");
      setNotice(`Cita agendada para ${expediente.nombre_completo}.`);
      setShowCitaForm(false);
      setCitaDraft({ expediente_id: "", start_at: localDateTimeValue(1), end_at: localDateTimeValue(2), location: "Sacramento", notes: "" });
      await loadData();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible agendar la cita.");
    } finally {
      setSaving(false);
    }
  };

  const openCitaForDate = (date?: Date) => {
    const start = date ? new Date(date) : new Date(Date.now() + 60 * 60 * 1000);
    if (date) start.setHours(9, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const toInput = (value: Date) => new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setCitaDraft((current) => ({ ...current, start_at: toInput(start), end_at: toInput(end) }));
    setShowCitaForm(true);
  };

  const changeCitaStatus = async (cita: Cita, status: "completed" | "cancelled") => {
    const cancelReason = status === "cancelled" ? window.prompt("Motivo de cancelación:") : null;
    if (status === "cancelled" && !cancelReason?.trim()) return;
    setError("");
    const response = await fetch("/api/clinical", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateCitaStatus", id: cita.id, status, cancel_reason: cancelReason?.trim() || null })
    });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "No fue posible actualizar la cita.");
    setNotice(status === "completed" ? "Cita marcada como completada." : "Cita cancelada.");
    await loadData();
  };

  const restartSecureLogin = async () => {
    await fetch("/api/therapist-session", { method: "DELETE" });
    localStorage.removeItem("crei_session");
    window.parent.location.href = "/es/portal-terapeutas";
  };

  if (loading) {
    return <div className="flex h-full min-h-[560px] items-center justify-center bg-[#f7f5fa]"><Loader2 className="h-8 w-8 animate-spin text-[#7c5cbf]" /></div>;
  }

  return (
    <div className="h-full min-h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#f7f5fa] text-[#2d2340]">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-[#ded6e9] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#7c5cbf]">
              {mode === "expediente" ? <FolderOpen className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
              Flujo clínico conectado
            </div>
            <h1 className="font-serif text-3xl font-bold">{mode === "expediente" ? "Expedientes de pacientes" : "Calendario de pacientes"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6c6178]">
              {mode === "expediente"
                ? "Registra primero la ficha clínica. Al guardarla, el paciente aparecerá automáticamente al crear una cita."
                : "Solo puedes agendar pacientes que ya tengan un expediente activo; no se permiten nombres libres ni duplicados."}
            </p>
          </div>
          {mode === "expediente" ? (
            <button onClick={openCreateExpediente} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0369a1] px-5 py-3 text-sm font-bold text-white hover:bg-[#075985]"><FilePlus2 className="h-4 w-4" /> Nuevo expediente</button>
          ) : (
            <button onClick={() => openCitaForDate()} disabled={!expedientes.some((item) => item.activo)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7c5cbf] px-5 py-3 text-sm font-bold text-white hover:bg-[#6948ad] disabled:cursor-not-allowed disabled:opacity-45"><CalendarDays className="h-4 w-4" /> Nueva cita</button>
          )}
        </div>

        {error && <div role="alert" className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center"><div className="flex flex-1 items-start gap-3"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" /><span>{error}</span></div>{/sesión|inicia sesión/i.test(error) && <button onClick={restartSecureLogin} className="shrink-0 rounded-full bg-red-700 px-4 py-2 text-xs font-bold text-white">Cerrar sesión e ingresar nuevamente</button>}</div>}
        {notice && <div className="mb-5 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" />{notice}</span><button onClick={() => setNotice("")} aria-label="Cerrar"><X className="h-4 w-4" /></button></div>}

        {mode === "expediente" ? (
          <>
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#ded6e9] bg-white px-4 py-3"><Search className="h-4 w-4 text-[#7c5cbf]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Buscar por nombre, folio, teléfono, correo o sustancia" /><button onClick={loadData} title="Actualizar"><RefreshCw className="h-4 w-4" /></button></div>
            {filteredExpedientes.length === 0 ? (
              <EmptyState icon={FolderOpen} title="Aún no hay expedientes" body="Crea el primer expediente para habilitar ese paciente dentro de Calendario." action="Crear primer expediente" onAction={openCreateExpediente} />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">{filteredExpedientes.map((item) => <article key={item.id} className="rounded-3xl border border-[#ded6e9] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-[#e9f3fa] px-3 py-1 text-[11px] font-bold text-[#0369a1]">{item.folio}</span><h2 className="mt-3 font-serif text-xl font-bold">{item.nombre_completo}</h2></div><button onClick={() => openEditExpediente(item)} className="rounded-full border border-[#ded6e9] p-2 text-[#7c5cbf] hover:bg-[#f0eafc]" aria-label={`Editar ${item.nombre_completo}`}><Edit3 className="h-4 w-4" /></button></div><dl className="mt-4 grid gap-2 text-sm text-[#6c6178] sm:grid-cols-2"><div><dt className="text-[10px] font-bold uppercase">Teléfono</dt><dd>{item.telefono || "—"}</dd></div><div><dt className="text-[10px] font-bold uppercase">Correo</dt><dd className="truncate">{item.email || "—"}</dd></div><div><dt className="text-[10px] font-bold uppercase">Motivo / sustancia</dt><dd>{item.sustancia_consumo || item.motivo_ingreso || "—"}</dd></div><div><dt className="text-[10px] font-bold uppercase">Terapeuta</dt><dd>{item.terapeuta_asignado || "Sin asignar"}</dd></div></dl><div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Disponible para Calendario</div></article>)}</div>
            )}
          </>
        ) : (
          <CalendarView citas={citas} expedientes={expedientes} expedienteById={expedienteById} onStatus={changeCitaStatus} onCreate={openCitaForDate} />
        )}
      </div>

      {showExpedienteForm && <ExpedienteModal draft={draft} setDraft={setDraft} editing={editing} saving={saving} onClose={() => setShowExpedienteForm(false)} onSubmit={saveExpediente} />}
      {showCitaForm && <CitaModal draft={citaDraft} setDraft={setCitaDraft} expedientes={expedientes.filter((item) => item.activo)} saving={saving} onClose={() => setShowCitaForm(false)} onSubmit={saveCita} />}
    </div>
  );
}

function EmptyState({ icon: Icon, title, body, action, onAction }: { icon: typeof FolderOpen; title: string; body: string; action: string; onAction: () => void }) {
  return <div className="rounded-3xl border-2 border-dashed border-[#d8cde5] bg-white px-6 py-16 text-center"><Icon className="mx-auto h-10 w-10 text-[#a58abd]" /><h2 className="mt-4 font-serif text-2xl font-bold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6c6178]">{body}</p><button onClick={onAction} className="mt-6 rounded-full bg-[#7c5cbf] px-5 py-3 text-sm font-bold text-white">{action}</button></div>;
}

function CalendarView({ citas, expedientes, expedienteById, onStatus, onCreate }: {
  citas: Cita[];
  expedientes: Expediente[];
  expedienteById: Map<string, Expediente>;
  onStatus: (cita: Cita, status: "completed" | "cancelled") => void;
  onCreate: (date?: Date) => void;
}) {
  const [cursor, setCursor] = useState(() => new Date());
  const [view, setView] = useState<"month" | "list">("month");
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - ((monthStart.getDay() + 6) % 7));
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
  const sameDay = (left: Date, right: Date) => left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
  const monthCitas = citas.filter((cita) => {
    const date = new Date(cita.start_at);
    return date.getFullYear() === cursor.getFullYear() && date.getMonth() === cursor.getMonth();
  });
  const active = monthCitas.filter((cita) => !["cancelled", "completed"].includes(cita.status || "")).length;
  const completed = monthCitas.filter((cita) => cita.status === "completed").length;
  const cancelled = monthCitas.filter((cita) => cita.status === "cancelled").length;

  if (!expedientes.some((item) => item.activo)) return <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50 px-6 py-14 text-center"><FolderOpen className="mx-auto h-10 w-10 text-amber-600" /><h2 className="mt-4 font-serif text-2xl font-bold">Primero crea un expediente</h2><p className="mx-auto mt-2 max-w-lg text-sm text-amber-800">Calendario permanecerá bloqueado hasta que exista por lo menos un paciente registrado.</p><Link href="/es/portal-terapeutas/app/expediente" className="mt-6 inline-flex rounded-full bg-amber-700 px-5 py-3 text-sm font-bold text-white">Ir a Expediente</Link></div>;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-[#ded6e9] bg-white shadow-sm">
        <header className="flex flex-col gap-5 border-b border-[#ebe6f0] bg-gradient-to-r from-white to-[#f5f0fa] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="rounded-xl border border-[#ded6e9] bg-white p-2.5 hover:bg-[#f0eafc]" aria-label="Mes anterior"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => setCursor(new Date())} className="rounded-xl border border-[#ded6e9] bg-white px-4 py-2.5 text-xs font-bold hover:bg-[#f0eafc]">Hoy</button>
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="rounded-xl border border-[#ded6e9] bg-white p-2.5 hover:bg-[#f0eafc]" aria-label="Mes siguiente"><ChevronRight className="h-5 w-5" /></button>
            <h2 className="ml-2 font-serif text-2xl font-bold capitalize">{cursor.toLocaleDateString("es-MX", { month: "long", year: "numeric" })}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatBadge label="Agendadas" value={active} color="purple" />
            <StatBadge label="Completadas" value={completed} color="green" />
            <StatBadge label="Canceladas" value={cancelled} color="red" />
            <div className="ml-1 flex rounded-xl border border-[#ded6e9] bg-white p-1">
              <button onClick={() => setView("month")} className={`rounded-lg p-2 ${view === "month" ? "bg-[#7c5cbf] text-white" : "text-[#6c6178]"}`} title="Vista mensual"><Grid3X3 className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={`rounded-lg p-2 ${view === "list" ? "bg-[#7c5cbf] text-white" : "text-[#6c6178]"}`} title="Vista de lista"><List className="h-4 w-4" /></button>
            </div>
          </div>
        </header>

        {view === "month" ? (
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-7 border-b border-[#ebe6f0] bg-[#faf8fc]">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <div key={day} className="px-3 py-3 text-center text-[10px] font-extrabold uppercase tracking-[.14em] text-[#74687f]">{day}</div>)}</div>
              <div className="grid grid-cols-7">{days.map((date) => {
                const dayCitas = citas.filter((cita) => sameDay(new Date(cita.start_at), date));
                const inMonth = date.getMonth() === cursor.getMonth();
                const today = sameDay(date, new Date());
                return <button key={date.toISOString()} onClick={() => onCreate(date)} className={`min-h-[140px] border-b border-r border-[#ebe6f0] p-2 text-left align-top transition hover:bg-[#f8f4fb] ${inMonth ? "bg-white" : "bg-[#faf9fb] text-[#aaa1b2]"}`}><span className={`mb-2 grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${today ? "bg-[#7c5cbf] text-white" : ""}`}>{date.getDate()}</span><span className="space-y-1">{dayCitas.slice(0, 3).map((cita) => { const patient = expedienteById.get(cita.expediente_id); const isCancelled = cita.status === "cancelled"; const isCompleted = cita.status === "completed"; return <span key={cita.id} className={`block rounded-lg border px-2 py-1.5 ${isCancelled ? "border-red-100 bg-red-50 text-red-700 opacity-60" : isCompleted ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-[#ddd1ea] bg-[#f0eafc] text-[#593e82]"}`}><span className="block text-[10px] font-extrabold">{new Date(cita.start_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span><span className="block truncate text-[11px] font-semibold">{patient?.nombre_completo || "Paciente"}</span></span>; })}{dayCitas.length > 3 && <span className="block px-2 text-[10px] font-bold text-[#7c5cbf]">+ {dayCitas.length - 3} citas</span>}</span></button>;
              })}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-5">{monthCitas.length ? monthCitas.map((cita) => <AppointmentRow key={cita.id} cita={cita} paciente={expedienteById.get(cita.expediente_id)} onStatus={onStatus} />) : <p className="py-14 text-center text-sm text-[#6c6178]">No hay citas en este mes.</p>}</div>
        )}
      </section>

      {cancelled > 0 && <section className="rounded-3xl border border-red-100 bg-red-50/60 p-5"><h3 className="mb-3 flex items-center gap-2 font-serif text-xl font-bold text-red-800"><X className="h-5 w-5" /> Citas canceladas del mes</h3><div className="grid gap-3 lg:grid-cols-2">{monthCitas.filter((cita) => cita.status === "cancelled").map((cita) => <AppointmentRow key={cita.id} cita={cita} paciente={expedienteById.get(cita.expediente_id)} onStatus={onStatus} compact />)}</div></section>}
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: "purple" | "green" | "red" }) {
  const style = color === "green" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : color === "red" ? "bg-red-50 text-red-700 border-red-100" : "bg-[#f0eafc] text-[#63428f] border-[#ded1ea]";
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${style}`}><b className="text-sm">{value}</b>{label}</span>;
}

function AppointmentRow({ cita, paciente, onStatus, compact = false }: { cita: Cita; paciente?: Expediente; onStatus: (cita: Cita, status: "completed" | "cancelled") => void; compact?: boolean }) {
  const cancelled = cita.status === "cancelled";
  const completed = cita.status === "completed";
  return <article className={`grid gap-4 rounded-2xl border border-[#ded6e9] bg-white ${compact ? "p-4" : "p-5 md:grid-cols-[1fr_auto] md:items-center"}`}><div className={cancelled ? "opacity-60" : ""}><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase ${completed ? "bg-emerald-100 text-emerald-800" : cancelled ? "bg-red-100 text-red-700" : "bg-[#f0eafc] text-[#6948ad]"}`}>{completed ? "Completada" : cancelled ? "Cancelada" : "Agendada"}</span><span className="text-[11px] font-semibold text-[#7c5cbf]">{paciente?.folio || "Expediente"}</span></div><h4 className="mt-2 font-serif text-lg font-bold">{paciente?.nombre_completo || "Paciente con expediente"}</h4><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#6c6178]"><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{new Date(cita.start_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}</span><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{cita.location || "Sin ubicación"}</span></div>{cita.notes && <p className="mt-2 text-xs text-[#6c6178]">{cita.notes}</p>}{cancelled && cita.cancel_reason && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"><b>Motivo:</b> {cita.cancel_reason}</p>}</div>{!compact && !cancelled && !completed && <div className="flex gap-2"><button onClick={() => onStatus(cita, "completed")} className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50">Completar</button><button onClick={() => onStatus(cita, "cancelled")} className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Cancelar</button></div>}</article>;
}

function ModalShell({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#170f24]/70 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#fdfcff] shadow-2xl"><header className="sticky top-0 z-10 flex items-start justify-between border-b border-[#ded6e9] bg-[#fdfcff]/95 px-6 py-5 backdrop-blur"><div><h2 className="font-serif text-2xl font-bold">{title}</h2><p className="mt-1 text-sm text-[#6c6178]">{subtitle}</p></div><button type="button" onClick={onClose} className="rounded-full border border-[#ded6e9] p-2" aria-label="Cerrar"><X className="h-5 w-5" /></button></header>{children}</div></div>;
}

function ExpedienteModal({ draft, setDraft, editing, saving, onClose, onSubmit }: { draft: ExpedienteDraft; setDraft: React.Dispatch<React.SetStateAction<ExpedienteDraft>>; editing: Expediente | null; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent) => void }) {
  const field = (key: keyof ExpedienteDraft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  return <ModalShell title={editing ? "Editar expediente" : "Crear expediente"} subtitle="El paciente estará disponible en Calendario al guardar esta ficha." onClose={onClose}><form onSubmit={onSubmit} className="grid gap-5 p-6 sm:grid-cols-2"><Field label="Nombre completo" required><input required value={draft.nombre_completo} onChange={(e) => field("nombre_completo", e.target.value)} /></Field><Field label="Fecha de nacimiento"><input type="date" value={draft.fecha_nacimiento} onChange={(e) => field("fecha_nacimiento", e.target.value)} /></Field><Field label="Teléfono"><input type="tel" value={draft.telefono} onChange={(e) => field("telefono", e.target.value)} /></Field><Field label="Correo"><input type="email" value={draft.email} onChange={(e) => field("email", e.target.value)} /></Field><Field label="Dirección" wide><input value={draft.direccion} onChange={(e) => field("direccion", e.target.value)} /></Field><Field label="Sustancia o situación principal"><input value={draft.sustancia_consumo} onChange={(e) => field("sustancia_consumo", e.target.value)} /></Field><Field label="Motivo de ingreso"><input value={draft.motivo_ingreso} onChange={(e) => field("motivo_ingreso", e.target.value)} /></Field><Field label="Contacto de emergencia"><input value={draft.contacto_emergencia_nombre} onChange={(e) => field("contacto_emergencia_nombre", e.target.value)} /></Field><Field label="Teléfono de emergencia"><input type="tel" value={draft.contacto_emergencia_telefono} onChange={(e) => field("contacto_emergencia_telefono", e.target.value)} /></Field><Field label="Correo de emergencia" wide><input type="email" value={draft.contacto_emergencia_correo} onChange={(e) => field("contacto_emergencia_correo", e.target.value)} /></Field><div className="flex justify-end gap-3 border-t border-[#ded6e9] pt-5 sm:col-span-2"><button type="button" onClick={onClose} className="rounded-full border border-[#ded6e9] px-5 py-3 text-sm font-bold">Cancelar</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#0369a1] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Guardar cambios" : "Crear expediente"}</button></div></form></ModalShell>;
}

function CitaModal({ draft, setDraft, expedientes, saving, onClose, onSubmit }: { draft: { expediente_id: string; start_at: string; end_at: string; location: string; notes: string }; setDraft: React.Dispatch<React.SetStateAction<{ expediente_id: string; start_at: string; end_at: string; location: string; notes: string }>>; expedientes: Expediente[]; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent) => void }) {
  const field = (key: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  return <ModalShell title="Agendar cita" subtitle="El paciente debe provenir de Expediente; no se permiten registros manuales." onClose={onClose}><form onSubmit={onSubmit} className="grid gap-5 p-6 sm:grid-cols-2"><Field label="Paciente de Expediente" required wide><select required value={draft.expediente_id} onChange={(e) => field("expediente_id", e.target.value)}><option value="">Selecciona un paciente</option>{expedientes.map((item) => <option key={item.id} value={item.id}>{item.nombre_completo} · {item.folio}</option>)}</select></Field><Field label="Inicio" required><input required type="datetime-local" value={draft.start_at} onChange={(e) => field("start_at", e.target.value)} /></Field><Field label="Término" required><input required type="datetime-local" value={draft.end_at} onChange={(e) => field("end_at", e.target.value)} /></Field><Field label="Ubicación"><select value={draft.location} onChange={(e) => field("location", e.target.value)}><option>Sacramento</option><option>Fuente de la Felicidad</option><option>En línea</option></select></Field><Field label="Anotaciones"><input value={draft.notes} onChange={(e) => field("notes", e.target.value)} /></Field><div className="flex justify-end gap-3 border-t border-[#ded6e9] pt-5 sm:col-span-2"><button type="button" onClick={onClose} className="rounded-full border border-[#ded6e9] px-5 py-3 text-sm font-bold">Cancelar</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#7c5cbf] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Agendar cita</button></div></form></ModalShell>;
}

function Field({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactElement }) {
  return <label className={`space-y-2 text-xs font-bold text-[#4d405d] ${wide ? "sm:col-span-2" : ""}`}><span>{label}{required && <b className="ml-1 text-red-500">*</b>}</span><span className="block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#d8cde5] [&_input]:bg-white [&_input]:px-3 [&_input]:text-sm [&_input]:font-normal [&_input]:outline-none [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-[#d8cde5] [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_select]:font-normal [&_select]:outline-none">{children}</span></label>;
}
