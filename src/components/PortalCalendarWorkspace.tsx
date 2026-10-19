"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import PushNotificationManager from "@/components/PushNotificationManager";

type Profile = {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
};

type Expediente = {
  id: string;
  nombre_completo: string;
  folio?: string | null;
};

type CalendarEvent = {
  id: string;
  expediente_id?: string | null;
  therapist_id?: string | null;
  start_at: string;
  end_at?: string | null;
  notes?: string | null;
  location?: string | null;
  status: string;
  cancel_reason?: string | null;
  event_kind: "clinical_appointment" | "zoom_meeting" | "internal_event";
  title?: string | null;
  description?: string | null;
  meeting_url?: string | null;
  timezone?: string | null;
  created_by_user_id?: number | null;
  participant_ids: number[];
};

type CalendarResponse = {
  events: CalendarEvent[];
  profiles: Profile[];
  expedientes: Expediente[];
  currentUserId: number;
  isAdmin: boolean;
  migrationRequired: boolean;
  migrationFile: string;
  error?: string;
};

type EventDraft = {
  event_kind: "zoom_meeting" | "internal_event";
  title: string;
  description: string;
  meeting_url: string;
  start_at: string;
  end_at: string;
  participant_ids: number[];
};

const monthFormatter = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
const dateFormatter = new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short" });
const timeFormatter = new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit" });
const fullFormatter = new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short" });

function localDateTimeValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
function initialDraft(userId = 0): EventDraft {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + 60 * 60_000);
  return {
    event_kind: "zoom_meeting",
    title: "",
    description: "",
    meeting_url: "",
    start_at: localDateTimeValue(start),
    end_at: localDateTimeValue(end),
    participant_ids: userId ? [userId] : [],
  };
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function isCancelled(event: CalendarEvent) {
  return String(event.status).toLowerCase() === "cancelled";
}

export default function PortalCalendarWorkspace() {
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [profileFilter, setProfileFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EventDraft>(() => initialDraft());
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/portal-calendar?t=${Date.now()}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No fue posible cargar los eventos importantes.");
      setData(result);
      setDraft((current) => current.participant_ids.length ? current : initialDraft(result.currentUserId));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible cargar los eventos importantes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const expedienteById = useMemo(
    () => new Map((data?.expedientes || []).map((item) => [item.id, item])),
    [data?.expedientes],
  );
  const profileById = useMemo(
    () => new Map((data?.profiles || []).map((item) => [Number(item.id), item])),
    [data?.profiles],
  );

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");
    return (data?.events || []).filter((event) => {
      if (profileFilter !== "all" && !event.participant_ids.map(String).includes(profileFilter) && String(event.therapist_id || "") !== profileFilter) return false;
      if (kindFilter !== "all" && event.event_kind !== kindFilter) return false;
      if (!normalizedQuery) return true;
      const patient = event.expediente_id ? expedienteById.get(event.expediente_id) : null;
      return [event.title, event.description, patient?.nombre_completo, patient?.folio]
        .some((value) => String(value || "").toLocaleLowerCase("es-MX").includes(normalizedQuery));
    });
  }, [data?.events, expedienteById, kindFilter, profileFilter, query]);

  const monthDays = useMemo(() => {
    const first = startOfMonth(cursor);
    const mondayIndex = (first.getDay() + 6) % 7;
    const firstCell = new Date(first);
    firstCell.setDate(first.getDate() - mondayIndex);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(firstCell);
      day.setDate(firstCell.getDate() + index);
      return day;
    });
  }, [cursor]);

  const monthEvents = useMemo(
    () => filteredEvents.filter((event) => {
      const date = new Date(event.start_at);
      return date.getFullYear() === cursor.getFullYear() && date.getMonth() === cursor.getMonth();
    }),
    [cursor, filteredEvents],
  );

  const upcoming = useMemo(
    () => filteredEvents
      .filter((event) => !isCancelled(event) && new Date(event.start_at).getTime() >= Date.now() - 60 * 60_000)
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
      .slice(0, 8),
    [filteredEvents],
  );

  function eventTitle(event: CalendarEvent) {
    if (event.title) return event.title;
    const patient = event.expediente_id ? expedienteById.get(event.expediente_id) : null;
    return patient?.nombre_completo || "Evento importante";
  }

  function openCreate() {
    if (!data || data.migrationRequired) return;
    setEditingId(null);
    setDraft(initialDraft(data.currentUserId));
    setShowForm(true);
  }

  function openEdit(event: CalendarEvent) {
    if (event.event_kind === "clinical_appointment") return;
    setEditingId(event.id);
    setDraft({
      event_kind: event.event_kind,
      title: event.title || "",
      description: event.description || "",
      meeting_url: event.meeting_url || "",
      start_at: localDateTimeValue(new Date(event.start_at)),
      end_at: localDateTimeValue(new Date(event.end_at || event.start_at)),
      participant_ids: event.participant_ids.length ? event.participant_ids : [data?.currentUserId || 0].filter(Boolean),
    });
    setSelected(null);
    setShowForm(true);
  }

  async function saveEvent(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/portal-calendar", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, action: "save", payload: draft } : { payload: draft }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No fue posible guardar el evento.");
      setShowForm(false);
      setEditingId(null);
      setNotice(editingId ? "Evento actualizado y recordatorios reprogramados." : "Evento creado con avisos de 30, 15 y 5 minutos.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible guardar el evento.");
    } finally {
      setSaving(false);
    }
  }

  async function cancelEvent() {
    if (!selected || cancelReason.trim().length < 5) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/portal-calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, action: "cancel", reason: cancelReason }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No fue posible cancelar el evento.");
      setSelected(null);
      setCancelReason("");
      setNotice("Evento cancelado. El registro y el motivo permanecen en el calendario.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No fue posible cancelar el evento.");
    } finally {
      setSaving(false);
    }
  }

  function toggleParticipant(id: number) {
    if (!data || id === data.currentUserId) return;
    setDraft((current) => ({
      ...current,
      participant_ids: current.participant_ids.includes(id)
        ? current.participant_ids.filter((value) => value !== id)
        : [...current.participant_ids, id],
    }));
  }

  if (loading && !data) {
    return <div className="grid h-full place-items-center bg-[#f7f4fa]"><Loader2 className="h-8 w-8 animate-spin text-[#7c5cbf]" /></div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f7f4fa] text-[#302747]">
      <PushNotificationManager promptOnMount showControl={false} />
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border border-[#ded5e8] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[.18em] text-[#7c5cbf]"><BellRing className="h-4 w-4" /> Agenda de Zoom por perfil</p>
              <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Eventos importantes</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d6377]">Reuniones Zoom y actividades internas en una agenda independiente del calendario de valoraciones.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-full border border-[#dcd2e8] bg-white px-4 py-3 text-xs font-bold text-[#5d477d]"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualizar</button>
              <button type="button" onClick={openCreate} disabled={!data || data.migrationRequired} className="inline-flex items-center gap-2 rounded-full bg-[#7650b7] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /> Nuevo evento</button>
            </div>
          </div>
        </header>

        {data?.migrationRequired && (
          <section className="mt-5 flex gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div><b className="block">El calendario clínico permanece intacto</b><p className="mt-1 text-sm leading-6">Eventos importantes utiliza tablas nuevas e independientes: no lee ni modifica las valoraciones. Para habilitar Zoom y recordatorios, ejecuta en Supabase el archivo <code className="rounded bg-amber-100 px-1.5 py-1 text-xs">{data.migrationFile}</code>.</p></div>
          </section>
        )}
        {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">{error}</div>}
        {notice && <div role="status" className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800"><Check className="h-5 w-5" />{notice}</div>}

        <section className="mt-5 grid gap-4 rounded-3xl border border-[#ded5e8] bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-[1fr_220px_220px_auto]">
          <label className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e7ca4]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar evento o reunión" className="h-12 w-full rounded-xl border border-[#ddd3e7] bg-[#faf8fc] pl-11 pr-4 text-sm outline-none focus:border-[#7c5cbf]" /></label>
          {data?.isAdmin ? <select value={profileFilter} onChange={(event) => setProfileFilter(event.target.value)} className="h-12 rounded-xl border border-[#ddd3e7] bg-[#faf8fc] px-4 text-sm font-semibold outline-none"><option value="all">Todos los perfiles</option>{data.profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.username}</option>)}</select> : <div className="flex h-12 items-center gap-2 rounded-xl border border-[#ddd3e7] bg-[#faf8fc] px-4 text-sm font-semibold"><Users className="h-4 w-4 text-[#7c5cbf]" /> Mi calendario</div>}
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)} className="h-12 rounded-xl border border-[#ddd3e7] bg-[#faf8fc] px-4 text-sm font-semibold outline-none"><option value="all">Todos los tipos</option><option value="zoom_meeting">Reuniones Zoom</option><option value="internal_event">Eventos internos</option></select>
          <div className="flex items-center justify-end gap-2 text-xs font-bold text-[#675b72]"><BellRing className="h-4 w-4 text-[#7c5cbf]" /> 30 · 15 · 5 min</div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-[2rem] border border-[#ded5e8] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece6f1] px-5 py-4">
              <div className="flex items-center gap-2"><button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="rounded-full border border-[#ddd3e7] p-2"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setCursor(startOfMonth(new Date()))} className="rounded-full border border-[#ddd3e7] px-4 py-2 text-xs font-bold">Hoy</button><button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="rounded-full border border-[#ddd3e7] p-2"><ChevronRight className="h-4 w-4" /></button></div>
              <h2 className="font-serif text-xl font-bold capitalize">{monthFormatter.format(cursor)}</h2>
              <span className="rounded-full bg-[#f1eafb] px-3 py-1.5 text-[11px] font-bold text-[#6b48a6]">{monthEvents.length} registros</span>
            </div>
            <div className="grid grid-cols-7 border-b border-[#ece6f1] bg-[#faf8fc]">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <div key={day} className="px-2 py-3 text-center text-[10px] font-black uppercase tracking-wider text-[#7e7288]">{day}</div>)}</div>
            <div className="grid grid-cols-7">{monthDays.map((day) => {
              const dayEvents = filteredEvents.filter((event) => sameDay(new Date(event.start_at), day));
              const outside = day.getMonth() !== cursor.getMonth();
              const today = sameDay(day, new Date());
              return <div key={day.toISOString()} className={`min-h-28 border-b border-r border-[#eee8f2] p-1.5 sm:min-h-36 sm:p-2 ${outside ? "bg-[#faf9fb]" : "bg-white"}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${today ? "bg-[#7450b2] text-white" : outside ? "text-[#bbb1c2]" : "text-[#63586d]"}`}>{day.getDate()}</span><div className="mt-1 space-y-1">{dayEvents.slice(0, 3).map((event) => <button key={event.id} type="button" onClick={() => { setSelected(event); setCancelReason(""); }} className={`block w-full truncate rounded-lg border px-2 py-1.5 text-left text-[10px] font-bold ${isCancelled(event) ? "border-red-200 bg-red-50 text-red-700 line-through" : event.event_kind === "zoom_meeting" ? "border-violet-200 bg-violet-50 text-violet-800" : event.event_kind === "internal_event" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-sky-200 bg-sky-50 text-sky-800"}`}><span className="block text-[9px] opacity-70">{timeFormatter.format(new Date(event.start_at))}</span>{eventTitle(event)}</button>)}{dayEvents.length > 3 && <span className="block pl-1 text-[9px] font-bold text-[#7c5cbf]">+{dayEvents.length - 3} más</span>}</div></div>;
            })}</div>
          </section>

          <aside className="rounded-[2rem] border border-[#ded5e8] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#7c5cbf]">Siguiente</p><h2 className="mt-1 font-serif text-2xl font-bold">Próximos eventos</h2></div><Clock3 className="h-6 w-6 text-[#9a7fc4]" /></div>
            <div className="mt-5 space-y-3">{upcoming.length ? upcoming.map((event) => <button key={event.id} type="button" onClick={() => { setSelected(event); setCancelReason(""); }} className="w-full rounded-2xl border border-[#e5deeb] bg-[#fbf9fc] p-4 text-left transition hover:border-[#a88bd2] hover:bg-white"><div className="flex items-center justify-between gap-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${event.event_kind === "zoom_meeting" ? "bg-violet-100 text-violet-800" : event.event_kind === "internal_event" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"}`}>{event.event_kind === "zoom_meeting" ? <Video className="h-3 w-3" /> : <CalendarDays className="h-3 w-3" />}{event.event_kind === "zoom_meeting" ? "Zoom" : event.event_kind === "internal_event" ? "Interno" : "Cita"}</span><span className="text-[10px] font-bold text-[#82758d]">{dateFormatter.format(new Date(event.start_at))}</span></div><h3 className="mt-3 font-serif text-base font-bold">{eventTitle(event)}</h3><p className="mt-1 text-xs text-[#6f6478]">{timeFormatter.format(new Date(event.start_at))} · {event.participant_ids.length || 1} perfil(es)</p></button>) : <div className="rounded-2xl border-2 border-dashed border-[#e4dcec] px-4 py-12 text-center text-sm text-[#7d7186]">No hay actividades próximas con estos filtros.</div>}</div>
          </aside>
        </div>
      </div>

      {showForm && <Modal title={editingId ? "Editar evento" : "Nuevo evento"} onClose={() => setShowForm(false)}><form onSubmit={saveEvent} className="grid gap-5 p-6 sm:grid-cols-2"><Field label="Tipo de evento" wide><div className="grid grid-cols-2 gap-3"><Choice active={draft.event_kind === "zoom_meeting"} onClick={() => setDraft((value) => ({ ...value, event_kind: "zoom_meeting" }))}><Video className="h-4 w-4" /> Reunión Zoom</Choice><Choice active={draft.event_kind === "internal_event"} onClick={() => setDraft((value) => ({ ...value, event_kind: "internal_event", meeting_url: "" }))}><Users className="h-4 w-4" /> Evento interno</Choice></div></Field><Field label="Título" required wide><input required minLength={3} value={draft.title} onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))} placeholder="Ej. Reunión de seguimiento" /></Field><Field label="Inicio" required><input required type="datetime-local" value={draft.start_at} onChange={(event) => setDraft((value) => ({ ...value, start_at: event.target.value }))} /></Field><Field label="Término" required><input required type="datetime-local" value={draft.end_at} onChange={(event) => setDraft((value) => ({ ...value, end_at: event.target.value }))} /></Field>{draft.event_kind === "zoom_meeting" && <Field label="Enlace de Zoom" required wide><input required type="url" value={draft.meeting_url} onChange={(event) => setDraft((value) => ({ ...value, meeting_url: event.target.value }))} placeholder="https://us06web.zoom.us/j/..." /></Field>}<Field label="Descripción" wide><textarea rows={3} value={draft.description} onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))} placeholder="Información interna opcional" /></Field><Field label="Perfiles participantes" wide><div className="grid gap-2 rounded-2xl border border-[#e2dae9] bg-[#faf8fc] p-3 sm:grid-cols-2">{(data?.profiles || []).map((profile) => { const checked = draft.participant_ids.includes(Number(profile.id)); const locked = Number(profile.id) === data?.currentUserId; return <label key={profile.id} className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${checked ? "border-violet-300 bg-white" : "border-transparent"}`}><input type="checkbox" checked={checked} disabled={locked || !data?.isAdmin} onChange={() => toggleParticipant(Number(profile.id))} /><span className="font-semibold capitalize">{profile.username}</span><small className="ml-auto text-[9px] font-bold uppercase text-[#887a93]">{profile.role}</small></label>; })}</div></Field><div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-xs leading-5 text-violet-900 sm:col-span-2"><b className="flex items-center gap-2"><BellRing className="h-4 w-4" /> Recordatorios automáticos</b><p className="mt-1">Cada perfil seleccionado recibirá avisos 30, 15 y 5 minutos antes en sus dispositivos autorizados.</p></div><div className="flex justify-end gap-3 border-t border-[#e5deeb] pt-5 sm:col-span-2"><button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-[#ddd3e7] px-5 py-3 text-sm font-bold">Cancelar</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#7650b7] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{editingId ? "Guardar cambios" : "Crear evento"}</button></div></form></Modal>}

      {selected && <Modal title={isCancelled(selected) ? "Evento cancelado" : "Detalle del evento"} onClose={() => setSelected(null)}><div className="space-y-5 p-6"><div className="rounded-2xl border border-[#e3dbea] bg-[#faf8fc] p-5"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase ${selected.event_kind === "zoom_meeting" ? "bg-violet-100 text-violet-800" : selected.event_kind === "internal_event" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"}`}>{selected.event_kind === "zoom_meeting" ? <Video className="h-3.5 w-3.5" /> : <CalendarDays className="h-3.5 w-3.5" />}{selected.event_kind === "zoom_meeting" ? "Reunión Zoom" : selected.event_kind === "internal_event" ? "Evento interno" : "Cita clínica"}</span><h3 className={`mt-3 font-serif text-2xl font-bold ${isCancelled(selected) ? "text-red-700 line-through" : ""}`}>{eventTitle(selected)}</h3><p className="mt-2 text-sm text-[#6f6478]">{fullFormatter.format(new Date(selected.start_at))} – {timeFormatter.format(new Date(selected.end_at || selected.start_at))}</p>{selected.description && <p className="mt-3 text-sm leading-6 text-[#62576d]">{selected.description}</p>}</div><div className="grid gap-3 sm:grid-cols-2"><Detail label="Modalidad" value={selected.location || "Sin ubicación"} /><Detail label="Participantes" value={(selected.participant_ids.map((id) => profileById.get(id)?.username).filter(Boolean).join(", ")) || "Perfil asignado"} /></div>{selected.meeting_url && !isCancelled(selected) && <div className="flex flex-wrap gap-3"><a href={selected.meeting_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#7650b7] px-5 py-3 text-sm font-bold text-white"><Video className="h-4 w-4" /> Entrar a Zoom <ExternalLink className="h-3.5 w-3.5" /></a><button type="button" onClick={() => navigator.clipboard.writeText(selected.meeting_url || "")} className="inline-flex items-center gap-2 rounded-full border border-[#ddd3e7] px-5 py-3 text-sm font-bold"><Copy className="h-4 w-4" /> Copiar enlace</button></div>}{isCancelled(selected) ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><b>Motivo de cancelación</b><p className="mt-1">{selected.cancel_reason || "No disponible"}</p></div> : selected.event_kind !== "clinical_appointment" && <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4"><label className="text-xs font-bold text-red-900">Motivo para cancelar el evento</label><textarea rows={2} value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} placeholder="Escribe una razón de al menos 5 caracteres" className="mt-2 w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none" /></div>}<div className="flex flex-wrap justify-end gap-3 border-t border-[#e5deeb] pt-5"><button type="button" onClick={() => setSelected(null)} className="rounded-full border border-[#ddd3e7] px-5 py-3 text-sm font-bold">Cerrar</button>{!isCancelled(selected) && selected.event_kind !== "clinical_appointment" && <><button type="button" onClick={() => openEdit(selected)} className="inline-flex items-center gap-2 rounded-full border border-violet-200 px-5 py-3 text-sm font-bold text-violet-800"><Pencil className="h-4 w-4" /> Editar</button><button type="button" onClick={cancelEvent} disabled={saving || cancelReason.trim().length < 5} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"><Trash2 className="h-4 w-4" /> Cancelar evento</button></>}</div></div></Modal>}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#190e27]/70 p-4 backdrop-blur-sm"><section role="dialog" aria-modal="true" className="my-6 w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-[#e5deeb] px-6 py-5"><h2 className="font-serif text-2xl font-bold text-[#302747]">{title}</h2><button type="button" onClick={onClose} className="rounded-full border border-[#ddd3e7] p-2 text-[#5f526a]"><X className="h-4 w-4" /></button></header>{children}</section></div>;
}

function Field({ label, required = false, wide = false, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return <label className={`block ${wide ? "sm:col-span-2" : ""}`}><span className="mb-2 block text-xs font-bold text-[#51465d]">{label}{required && <b className="ml-1 text-red-600">*</b>}</span><div className="[&_input]:h-12 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[#ddd3e7] [&_input]:bg-[#faf8fc] [&_input]:px-4 [&_input]:text-sm [&_input]:outline-none [&_input:focus]:border-[#7c5cbf] [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[#ddd3e7] [&_textarea]:bg-[#faf8fc] [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-sm [&_textarea]:outline-none [&_textarea:focus]:border-[#7c5cbf]">{children}</div></label>;
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-bold ${active ? "border-[#7c5cbf] bg-[#f0eafb] text-[#6945a3]" : "border-[#ddd3e7] bg-white text-[#6f6478]"}`}>{children}</button>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#e5deeb] p-4"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#8a789c]">{label}</p><p className="mt-2 text-sm font-semibold text-[#3f344a]">{value}</p></div>;
}
