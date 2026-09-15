"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

type AssignedPatient = {
  id: string;
  nombre: string;
  ciudad: string;
  telefono: string;
  sexo: "hombre" | "mujer";
  dia: string;
  hora: string;
  terapeuta_atencion: string;
  created_at: string;
};

export default function AssignedPatientsInbox({
  lang,
  therapistName,
}: {
  lang: "es" | "en";
  therapistName: string;
}) {
  const [patients, setPatients] = useState<AssignedPatient[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/assigned-patients", {
        cache: "no-store",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "No fue posible cargar la bandeja.");
      }
      setPatients(Array.isArray(result.patients) ? result.patients : []);
      setNewCount(Number(result.newCount) || 0);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "No fue posible cargar la bandeja.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, [load]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-MX", {
        dateStyle: "medium",
        timeZone: "America/Mexico_City",
      }),
    [lang],
  );

  const isNew = (createdAt: string) =>
    new Date(createdAt).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <main className="min-h-screen bg-[#f5f1f8] text-[#302747]">
      <header className="border-b border-white/10 bg-[#1b102b] px-5 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href={`/${lang}/portal-terapeutas/dashboard`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al portal
          </Link>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#d8c8f2]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            {therapistName}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e8e0f2] px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] text-[#654b91]">
              <BellRing className="h-4 w-4" /> Bandeja clínica
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold md:text-6xl">
              Pacientes asignados
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-[#6d6376]">
              Aquí recibirás a las personas que Paulina te asigne. La bandeja se
              actualiza automáticamente cada minuto.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#ded6e7] bg-white px-5 py-4 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#7258a8] text-white">
              <BellRing className="h-5 w-5" />
            </span>
            <div>
              <strong className="block text-2xl leading-none">{newCount}</strong>
              <span className="text-xs font-bold text-[#756b7e]">
                nuevos esta semana
              </span>
            </div>
          </div>
        </section>

        <section className="mt-9 overflow-hidden rounded-[2rem] border border-[#ded6e7] bg-white shadow-[0_20px_60px_rgba(48,39,71,.1)]">
          <div className="flex items-center justify-between border-b border-[#eee8f1] px-6 py-5 md:px-8">
            <div>
              <h2 className="font-serif text-2xl font-bold">Nuevas asignaciones</h2>
              <p className="mt-1 text-sm text-[#756b7e]">
                {patients.length} paciente{patients.length === 1 ? "" : "s"} en total
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              aria-label="Actualizar"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#d6cee1] text-[#7258a8] transition hover:bg-[#eee8f6] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading && patients.length === 0 ? (
            <div className="grid min-h-72 place-items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#7258a8]" />
            </div>
          ) : error ? (
            <div className="grid min-h-72 place-items-center px-6 text-center">
              <div>
                <p className="text-sm font-semibold text-red-700">{error}</p>
                <button onClick={load} className="mt-4 rounded-full border border-[#7258a8] px-5 py-2 text-xs font-bold text-[#7258a8]">
                  Intentar nuevamente
                </button>
              </div>
            </div>
          ) : patients.length === 0 ? (
            <div className="grid min-h-72 place-items-center px-6 text-center">
              <div>
                <UserRoundCheck className="mx-auto h-12 w-12 text-[#b9aec3]" />
                <h3 className="mt-4 font-serif text-2xl font-bold">Sin pacientes pendientes</h3>
                <p className="mt-2 text-sm text-[#756b7e]">
                  Te avisaremos aquí cuando Paulina te asigne uno nuevo.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2 md:p-7">
              {patients.map((patient) => (
                <article key={patient.id} className="relative rounded-3xl border border-[#ded6e7] bg-[#faf8fc] p-5">
                  {isNew(patient.created_at) && (
                    <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      Nuevo
                    </span>
                  )}
                  <h3 className="pr-20 font-serif text-2xl font-bold">{patient.nombre}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#7258a8]">
                    {patient.sexo}
                  </p>
                  <div className="mt-5 grid gap-3 text-sm text-[#675e70] sm:grid-cols-2">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#7258a8]" />{patient.ciudad}</span>
                    <a className="flex items-center gap-2 font-semibold text-[#5c438a]" href={`tel:${patient.telefono.replace(/[^\d+]/g, "")}`}><Phone className="h-4 w-4" />{patient.telefono}</a>
                    <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#7258a8]" />{dateFormatter.format(new Date(`${patient.dia}T12:00:00`))}</span>
                    <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#7258a8]" />{patient.hora.slice(0, 5)}</span>
                  </div>
                  <Link
                    href={`/${lang}/portal-terapeutas/app/expediente`}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#7258a8] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#5c438a]"
                  >
                    Abrir Expediente
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
