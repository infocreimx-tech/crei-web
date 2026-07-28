"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

type PatientSex = "hombre" | "mujer";

type PatientRecord = {
  id: string;
  nombre: string;
  ciudad: string;
  telefono: string;
  sexo: PatientSex;
  dia: string;
  hora: string;
  created_at: string;
  updated_at: string;
};

export default function PaulinaPatientRegistry({
  lang,
  therapistName,
  canCreate,
}: {
  lang: "es" | "en";
  therapistName: string;
  canCreate: boolean;
}) {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const copy =
    lang === "en"
      ? {
          back: "Back to portal",
          private: "Private program · Paulina",
          title: "Patient registry",
          description:
            "Save the essential contact information for each person you assist.",
          formTitle: "New patient",
          formHelp: "All fields are required.",
          name: "Full name",
          namePlaceholder: "Patient name",
          city: "City",
          cityPlaceholder: "City of residence",
          phone: "Phone number",
          phonePlaceholder: "55 0000 0000",
          day: "Day",
          time: "Time",
          sex: "Sex",
          man: "Man",
          woman: "Woman",
          save: "Save patient",
          saving: "Saving...",
          success: "Patient saved successfully.",
          listTitle: "Registered patients",
          onePatient: "patient",
          manyPatients: "patients",
          empty: "No patients have been registered yet.",
          retry: "Try again",
          registered: "Registered",
          protected: "Only Paulina can view and create these records.",
          adminReadOnly:
            "Administrative view: you can review every record in this program.",
        }
      : {
          back: "Volver al portal",
          private: "Programa privado · Paulina",
          title: "Registro de pacientes",
          description:
            "Guarda los datos esenciales de contacto de cada persona que atiendes.",
          formTitle: "Nuevo paciente",
          formHelp: "Todos los campos son obligatorios.",
          name: "Nombre completo",
          namePlaceholder: "Nombre del paciente",
          city: "Ciudad",
          cityPlaceholder: "Ciudad de residencia",
          phone: "Número telefónico",
          phonePlaceholder: "55 0000 0000",
          day: "Día",
          time: "Hora",
          sex: "Sexo",
          man: "Hombre",
          woman: "Mujer",
          save: "Guardar paciente",
          saving: "Guardando...",
          success: "Paciente guardado correctamente.",
          listTitle: "Pacientes registrados",
          onePatient: "paciente",
          manyPatients: "pacientes",
          empty: "Todavía no hay pacientes registrados.",
          retry: "Intentar nuevamente",
          registered: "Registrado",
          protected: "Sólo Paulina puede consultar y crear estos registros.",
          adminReadOnly:
            "Vista administrativa: puedes consultar todos los registros de este programa.",
        };

  const loadPatients = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/paulina-patients", {
        cache: "no-store",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "No fue posible cargar los registros.");
      }
      setPatients(Array.isArray(result.patients) ? result.patients : []);
    } catch (caught) {
      setLoadError(
        caught instanceof Error
          ? caught.message
          : "No fue posible cargar los registros.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const patientLabel = useMemo(
    () =>
      patients.length === 1
        ? copy.onePatient
        : copy.manyPatients,
    [copy.manyPatients, copy.onePatient, patients.length],
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setFormError("");
    setSuccess("");

    try {
      const response = await fetch("/api/paulina-patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(data.get("nombre") || ""),
          ciudad: String(data.get("ciudad") || ""),
          telefono: String(data.get("telefono") || ""),
          sexo: String(data.get("sexo") || ""),
          dia: String(data.get("dia") || ""),
          hora: String(data.get("hora") || ""),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "No fue posible guardar el registro.");
      }

      setPatients((current) => [result.patient as PatientRecord, ...current]);
      form.reset();
      setSuccess(copy.success);
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : "No fue posible guardar el registro.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "America/Mexico_City",
      }),
    [lang],
  );

  const appointmentDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-MX", {
        dateStyle: "medium",
        timeZone: "America/Mexico_City",
      }),
    [lang],
  );

  const inputClass =
    "mt-2 h-12 w-full rounded-xl border border-[#d6cee1] bg-[#faf8fc] px-4 text-sm text-[#302747] outline-none transition placeholder:text-[#9b92a4] focus:border-[#7258a8] focus:bg-white focus:ring-4 focus:ring-[#7258a8]/10";

  return (
    <main className="min-h-screen bg-[#f5f1f8] text-[#302747]">
      <header className="border-b border-[#ded6e7] bg-[#1b102b] px-5 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            href={`/${lang}/portal-terapeutas/dashboard`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#d8c8f2]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            {therapistName}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <section className="mb-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e8e0f2] px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] text-[#654b91]">
            <ClipboardList className="h-4 w-4" />
            {copy.private}
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#6d6376]">
            {copy.description}
          </p>
        </section>

        <div
          className={`grid items-start gap-7 ${
            canCreate ? "lg:grid-cols-[0.78fr_1.22fr]" : ""
          }`}
        >
          {canCreate && (
          <section className="rounded-[2rem] border border-[#ded6e7] bg-white p-6 shadow-[0_20px_60px_rgba(48,39,71,.1)] md:p-8">
            <div className="mb-6 border-b border-[#eee8f1] pb-5">
              <h2 className="font-serif text-3xl font-bold">{copy.formTitle}</h2>
              <p className="mt-2 text-sm text-[#756b7e]">{copy.formHelp}</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <label className="block text-sm font-bold">
                {copy.name}
                <input
                  name="nombre"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  placeholder={copy.namePlaceholder}
                  className={inputClass}
                />
              </label>

              <label className="block text-sm font-bold">
                {copy.city}
                <input
                  name="ciudad"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="address-level2"
                  placeholder={copy.cityPlaceholder}
                  className={inputClass}
                />
              </label>

              <label className="block text-sm font-bold">
                {copy.phone}
                <input
                  name="telefono"
                  required
                  minLength={8}
                  maxLength={30}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={copy.phonePlaceholder}
                  className={inputClass}
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold">
                  {copy.day}
                  <input
                    name="dia"
                    required
                    type="date"
                    className={inputClass}
                  />
                </label>

                <label className="block text-sm font-bold">
                  {copy.time}
                  <input
                    name="hora"
                    required
                    type="time"
                    className={inputClass}
                  />
                </label>
              </div>

              <fieldset>
                <legend className="text-sm font-bold">{copy.sex}</legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {[
                    { value: "hombre", label: copy.man },
                    { value: "mujer", label: copy.woman },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#d6cee1] bg-[#faf8fc] p-4 text-sm font-bold has-[:checked]:border-[#7258a8] has-[:checked]:bg-[#eee8f6]"
                    >
                      <input
                        name="sexo"
                        type="radio"
                        value={option.value}
                        required
                        className="h-4 w-4 accent-[#7258a8]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
                >
                  {formError}
                </p>
              )}
              {success && (
                <p
                  role="status"
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  {success}
                </p>
              )}

              <button
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7258a8] px-5 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(114,88,168,.25)] transition hover:bg-[#5c438a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {copy.saving}
                  </>
                ) : (
                  <>
                    <UserRound className="h-5 w-5" />
                    {copy.save}
                  </>
                )}
              </button>
            </form>
          </section>
          )}

          <section className="overflow-hidden rounded-[2rem] border border-[#ded6e7] bg-white shadow-[0_20px_60px_rgba(48,39,71,.1)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#eee8f1] px-6 py-6 md:px-8">
              <div>
                <h2 className="font-serif text-3xl font-bold">
                  {copy.listTitle}
                </h2>
                <p className="mt-1 text-sm text-[#756b7e]">
                  {patients.length} {patientLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={loadPatients}
                disabled={loading}
                aria-label={copy.retry}
                className="grid h-11 w-11 place-items-center rounded-full border border-[#d6cee1] text-[#7258a8] transition hover:bg-[#eee8f6] disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="border-b border-[#eee8f1] bg-[#faf8fc] px-6 py-3 text-xs text-[#756b7e] md:px-8">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {canCreate ? copy.protected : copy.adminReadOnly}
              </span>
            </div>

            {loading ? (
              <div className="grid min-h-80 place-items-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#7258a8]" />
              </div>
            ) : loadError && patients.length === 0 ? (
              <div className="grid min-h-80 place-items-center px-6 text-center">
                <div>
                  <p className="max-w-md text-sm font-semibold leading-6 text-red-700">
                    {loadError}
                  </p>
                  <button
                    type="button"
                    onClick={loadPatients}
                    className="mt-5 rounded-full border border-[#7258a8] px-5 py-2.5 text-xs font-bold text-[#7258a8]"
                  >
                    {copy.retry}
                  </button>
                </div>
              </div>
            ) : patients.length === 0 ? (
              <div className="grid min-h-80 place-items-center px-6 text-center text-[#756b7e]">
                <div>
                  <Users className="mx-auto h-10 w-10 text-[#b9aec3]" />
                  <p className="mt-4 text-sm">{copy.empty}</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#eee8f1]">
                {patients.map((patient) => (
                  <article
                    key={patient.id}
                    className="grid gap-4 px-6 py-5 transition hover:bg-[#faf8fc] md:grid-cols-2 md:items-center md:px-8 xl:grid-cols-[1.3fr_.9fr_.9fr_.9fr_auto]"
                  >
                    <div>
                      <h3 className="font-bold text-[#302747]">
                        {patient.nombre}
                      </h3>
                      <span className="mt-1 inline-flex rounded-full bg-[#eee8f6] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.1em] text-[#654b91]">
                        {patient.sexo === "hombre" ? copy.man : copy.woman}
                      </span>
                    </div>
                    <p className="flex items-center gap-2 text-sm text-[#675e70]">
                      <MapPin className="h-4 w-4 shrink-0 text-[#7258a8]" />
                      {patient.ciudad}
                    </p>
                    <a
                      href={`tel:${patient.telefono.replace(/[^\d+]/g, "")}`}
                      className="flex items-center gap-2 text-sm font-semibold text-[#5c438a]"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      {patient.telefono}
                    </a>
                    <div className="space-y-1 text-sm text-[#675e70]">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[#7258a8]" />
                        {appointmentDateFormatter.format(
                          new Date(`${patient.dia}T12:00:00`),
                        )}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0 text-[#7258a8]" />
                        {patient.hora.slice(0, 5)}
                      </p>
                    </div>
                    <p className="text-xs text-[#8b8292] md:text-right">
                      {copy.registered}
                      <br />
                      {dateFormatter.format(new Date(patient.created_at))}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
