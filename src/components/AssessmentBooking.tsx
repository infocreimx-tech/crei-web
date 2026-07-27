"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  ShieldCheck,
  Video,
} from "lucide-react";

type Modality = "presencial" | "videollamada";

type Confirmation = {
  id: string;
  inicio: string;
  fin: string;
  modalidad: Modality;
};

const AVAILABLE_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const CREI_OFFICE_ADDRESS =
  "Sacramento 521, Insurgentes San Borja, Benito Juárez, 03100 Ciudad de México, CDMX";
const CREI_OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CREI_OFFICE_ADDRESS)}`;

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-[#cfc4dc] bg-[#f8f5fb] px-4 text-sm text-[#302747] outline-none transition placeholder:text-[#91879a] focus:border-[#7258a8] focus:bg-white focus:ring-4 focus:ring-[#7258a8]/10";

export default function AssessmentBooking({ lang }: { lang: "es" | "en" }) {
  const [modality, setModality] = useState<Modality>("presencial");
  const [minDate, setMinDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  useEffect(() => {
    setMinDate(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    );
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setOccupiedTimes([]);
      setSelectedTime("");
      setAvailabilityError("");
      return;
    }

    const controller = new AbortController();
    setLoadingAvailability(true);
    setAvailabilityError("");
    setOccupiedTimes([]);
    setSelectedTime("");

    const loadAvailability = async () => {
      try {
        const response = await fetch(
          `/api/assessment-appointments?fecha=${encodeURIComponent(selectedDate)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.error ||
              (lang === "en"
                ? "We could not check availability."
                : "No pudimos consultar la disponibilidad."),
          );
        }

        setOccupiedTimes(
          Array.isArray(result.occupiedTimes) ? result.occupiedTimes : [],
        );
      } catch (caught) {
        if (controller.signal.aborted) return;
        setAvailabilityError(
          caught instanceof Error
            ? caught.message
            : lang === "en"
              ? "We could not check availability."
              : "No pudimos consultar la disponibilidad.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAvailability(false);
        }
      }
    };

    loadAvailability();
    return () => controller.abort();
  }, [lang, selectedDate]);

  const copy =
    lang === "en"
      ? {
          eyebrow: "Clinical assessment · 60 minutes",
          title: "Schedule an assessment appointment",
          description:
            "Choose your preferred time. The CREI team will review the request and contact you to confirm the appointment.",
          durationTitle: "One full hour",
          durationText: "Reserved for an initial clinical assessment.",
          modalityTitle: "In person or by video call",
          modalityText: "Choose the option that is most comfortable for you.",
          privacyTitle: "Confidential information",
          privacyText: "Your information is used only to manage your care.",
          formTitle: "Choose your appointment",
          name: "Full name",
          email: "Email",
          phone: "Phone or WhatsApp",
          date: "Date",
          time: "Start time",
          chooseDateFirst: "Choose a date first",
          checkingAvailability: "Checking availability...",
          occupied: "Occupied",
          noAvailability:
            "There are no available appointments on this date. Choose another day.",
          modality: "Modality",
          inPerson: "In person",
          video: "Video call",
          office: "CREI office",
          openMap: "Open in maps",
          videoLocation: "The access link will be sent when the appointment is confirmed.",
          reason: "What would you like us to know? (optional)",
          reasonPlaceholder: "Briefly tell us the reason for the assessment.",
          consent: "I accept the privacy notice and the processing of my data.",
          submit: "Request assessment",
          submitting: "Saving appointment...",
          successTitle: "Assessment requested",
          successBody:
            "We saved your one-hour appointment. The CREI team will contact you to confirm it.",
          another: "Request another time",
        }
      : {
          eyebrow: "Valoración clínica · 60 minutos",
          title: "Agenda una cita de valoración",
          description:
            "Elige el horario que prefieras. El equipo de CREI revisará la solicitud y se pondrá en contacto contigo para confirmar la cita.",
          durationTitle: "Una hora completa",
          durationText: "Reservada para realizar una valoración clínica inicial.",
          modalityTitle: "Presencial o videollamada",
          modalityText: "Elige la opción que te resulte más cómoda.",
          privacyTitle: "Información confidencial",
          privacyText: "Tus datos se utilizan únicamente para gestionar tu atención.",
          formTitle: "Elige tu cita",
          name: "Nombre completo",
          email: "Correo electrónico",
          phone: "Teléfono o WhatsApp",
          date: "Fecha",
          time: "Hora de inicio",
          chooseDateFirst: "Primero elige una fecha",
          checkingAvailability: "Consultando disponibilidad...",
          occupied: "Ocupado",
          noAvailability:
            "No quedan citas disponibles en esta fecha. Elige otro día.",
          modality: "Modalidad",
          inPerson: "Presencial",
          video: "Videollamada",
          office: "Consultorio CREI",
          openMap: "Abrir en mapas",
          videoLocation: "El enlace de acceso se enviará al confirmar la cita.",
          reason: "¿Qué te gustaría que supiéramos? (opcional)",
          reasonPlaceholder: "Cuéntanos brevemente el motivo de la valoración.",
          consent: "Acepto el aviso de privacidad y el tratamiento de mis datos.",
          submit: "Solicitar valoración",
          submitting: "Guardando cita...",
          successTitle: "Valoración solicitada",
          successBody:
            "Guardamos tu cita de una hora. El equipo de CREI se pondrá en contacto contigo para confirmarla.",
          another: "Solicitar otro horario",
        };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/assessment-appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(data.get("nombre") || ""),
          email: String(data.get("email") || ""),
          telefono: String(data.get("telefono") || ""),
          fecha: String(data.get("fecha") || ""),
          hora: String(data.get("hora") || ""),
          modalidad: modality,
          motivo: String(data.get("motivo") || ""),
          consentimiento: data.get("consentimiento") === "on",
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          result.error ||
            (lang === "en"
              ? "We could not save the appointment."
              : "No pudimos guardar la cita."),
        );
      }

      setConfirmation(result.appointment as Confirmation);
      form.reset();
      setSelectedDate("");
      setSelectedTime("");
      setOccupiedTimes([]);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : lang === "en"
            ? "We could not save the appointment."
            : "No pudimos guardar la cita.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formattedConfirmation = confirmation
    ? new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-MX", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Mexico_City",
      }).format(new Date(confirmation.inicio))
    : "";

  return (
    <section
      id="cita-valoracion"
      className="relative overflow-hidden bg-[#eee8f6] px-6 py-24 md:py-28"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/80 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#dcefc5]/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
        <div className="flex flex-col rounded-[2rem] bg-[#302747] p-8 text-white shadow-[0_28px_80px_rgba(48,39,71,.2)] md:p-11">
          <span className="text-[11px] font-black uppercase tracking-[.18em] text-[#dcefc5]">
            {copy.eyebrow}
          </span>
          <h2 className="mt-5 font-serif text-4xl font-bold leading-[1.05] md:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            {copy.description}
          </p>

          <div className="mt-10 grid gap-3">
            <article className="flex gap-4 rounded-2xl border border-white/15 bg-white/[.06] p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#dcefc5] text-[#302747]">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold">{copy.durationTitle}</h3>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  {copy.durationText}
                </p>
              </div>
            </article>
            <article className="flex gap-4 rounded-2xl border border-white/15 bg-white/[.06] p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#dcefc5]">
                <Video className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold">{copy.modalityTitle}</h3>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  {copy.modalityText}
                </p>
              </div>
            </article>
            <article className="flex gap-4 rounded-2xl border border-white/15 bg-white/[.06] p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#dcefc5]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold">{copy.privacyTitle}</h3>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  {copy.privacyText}
                </p>
              </div>
            </article>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#d9cfe2] bg-[#fffdf9] p-6 shadow-[0_24px_70px_rgba(48,39,71,.14)] sm:p-8 md:p-10">
          {confirmation ? (
            <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[#e8f4dc] text-[#466334]">
                <CheckCircle2 className="h-10 w-10" />
              </span>
              <h3 className="mt-7 font-serif text-4xl font-bold text-[#302747]">
                {copy.successTitle}
              </h3>
              <p className="mt-4 max-w-md leading-7 text-[#675e70]">
                {copy.successBody}
              </p>
              <div className="mt-7 w-full max-w-md rounded-2xl border border-[#d9cfe2] bg-[#f8f5fb] p-5 text-left">
                <p className="flex items-center gap-2 text-sm font-bold text-[#302747]">
                  <CalendarDays className="h-5 w-5 text-[#7258a8]" />
                  {formattedConfirmation}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-[#675e70]">
                  {confirmation.modalidad === "presencial" ? (
                    <MapPin className="h-5 w-5 text-[#7258a8]" />
                  ) : (
                    <Video className="h-5 w-5 text-[#7258a8]" />
                  )}
                  {confirmation.modalidad === "presencial"
                    ? copy.inPerson
                    : copy.video}
                  {" · "}60 min
                </p>
                <p className="mt-3 text-sm leading-6 text-[#675e70]">
                  {confirmation.modalidad === "presencial"
                    ? CREI_OFFICE_ADDRESS
                    : copy.videoLocation}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="mt-8 rounded-full border border-[#7258a8] px-6 py-3 text-sm font-bold text-[#7258a8] transition hover:bg-[#eee8f6]"
              >
                {copy.another}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-7 border-b border-[#e7dfea] pb-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#eee7f8] px-3 py-2 text-[10px] font-black uppercase tracking-[.15em] text-[#634993]">
                  <CalendarDays className="h-4 w-4" />
                  60 min · CDMX
                </span>
                <h3 className="mt-4 font-serif text-3xl font-bold text-[#302747]">
                  {copy.formTitle}
                </h3>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-bold text-[#40364b]">
                    {copy.name}
                    <input
                      name="nombre"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-bold text-[#40364b]">
                    {copy.phone}
                    <input
                      name="telefono"
                      required
                      minLength={8}
                      maxLength={30}
                      type="tel"
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className="block text-sm font-bold text-[#40364b]">
                  {copy.email}
                  <input
                    name="email"
                    required
                    maxLength={120}
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-bold text-[#40364b]">
                    {copy.date}
                    <input
                      name="fecha"
                      required
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={(event) => setSelectedDate(event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-bold text-[#40364b]">
                    {copy.time}
                    <select
                      name="hora"
                      required
                      value={selectedTime}
                      onChange={(event) => setSelectedTime(event.target.value)}
                      disabled={
                        !selectedDate ||
                        loadingAvailability ||
                        Boolean(availabilityError)
                      }
                      className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <option value="" disabled>
                        {loadingAvailability
                          ? copy.checkingAvailability
                          : selectedDate
                            ? "--:--"
                            : copy.chooseDateFirst}
                      </option>
                      {AVAILABLE_TIMES.map((time) => (
                        <option
                          key={time}
                          value={time}
                          disabled={occupiedTimes.includes(time)}
                        >
                          {time}
                          {occupiedTimes.includes(time)
                            ? ` · ${copy.occupied}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {availabilityError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                  >
                    {availabilityError}
                  </p>
                )}

                {selectedDate &&
                  !loadingAvailability &&
                  !availabilityError &&
                  occupiedTimes.length === AVAILABLE_TIMES.length && (
                    <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                      {copy.noAvailability}
                    </p>
                  )}

                <fieldset>
                  <legend className="text-sm font-bold text-[#40364b]">
                    {copy.modality}
                  </legend>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      aria-pressed={modality === "presencial"}
                      onClick={() => setModality("presencial")}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        modality === "presencial"
                          ? "border-[#7258a8] bg-[#eee8f6] text-[#543985]"
                          : "border-[#d9cfe2] bg-white text-[#675e70]"
                      }`}
                    >
                      <MapPin className="h-4 w-4" /> {copy.inPerson}
                    </button>
                    <button
                      type="button"
                      aria-pressed={modality === "videollamada"}
                      onClick={() => setModality("videollamada")}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        modality === "videollamada"
                          ? "border-[#7258a8] bg-[#eee8f6] text-[#543985]"
                          : "border-[#d9cfe2] bg-white text-[#675e70]"
                      }`}
                    >
                      <Video className="h-4 w-4" /> {copy.video}
                    </button>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#d9cfe2] bg-[#f8f5fb] p-4">
                    {modality === "presencial" ? (
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#7258a8]" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-[.12em] text-[#7258a8]">
                            {copy.office}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[#4f4658]">
                            {CREI_OFFICE_ADDRESS}
                          </p>
                          <a
                            href={CREI_OFFICE_MAP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-xs font-bold text-[#7258a8] underline decoration-[#7258a8]/30 underline-offset-4"
                          >
                            {copy.openMap}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Video className="mt-0.5 h-5 w-5 shrink-0 text-[#7258a8]" />
                        <p className="text-sm leading-6 text-[#4f4658]">
                          {copy.videoLocation}
                        </p>
                      </div>
                    )}
                  </div>
                </fieldset>

                <label className="block text-sm font-bold text-[#40364b]">
                  {copy.reason}
                  <textarea
                    name="motivo"
                    rows={3}
                    maxLength={1000}
                    placeholder={copy.reasonPlaceholder}
                    className={`${inputClass} h-auto resize-none py-3`}
                  />
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-[#e4dce8] bg-[#f8f5fb] p-4 text-sm leading-6 text-[#5f5668]">
                  <input
                    name="consentimiento"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-[#7258a8]"
                  />
                  <span>{copy.consent}</span>
                </label>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
                  >
                    {error}
                  </p>
                )}

                <button
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7258a8] px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(114,88,168,.28)] transition hover:-translate-y-0.5 hover:bg-[#5d438d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {copy.submitting}
                    </>
                  ) : (
                    <>
                      <CalendarDays className="h-5 w-5" />
                      {copy.submit}
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
