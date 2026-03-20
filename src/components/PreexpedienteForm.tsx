"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Phone,
  User,
  MapPin,
  Mail,
  Calendar,
  HeartPulse,
  ClipboardList,
  Banknote,
  ChevronRight,
  Loader2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

/* ─────────── helpers ─────────── */
const inputBase =
  "w-full px-4 py-3 rounded-xl border border-border bg-white/60 dark:bg-white/5 placeholder:text-muted-foreground/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 text-sm";

const labelBase = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5";

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelBase}>
        {Icon && <Icon className="inline w-3.5 h-3.5 mr-1 -mt-0.5 opacity-60" />}
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({
  step,
  title,
  subtitle,
  color,
}: {
  step: string;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-4 pb-4 border-b border-border/60 mb-6`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-md shrink-0 ${color}`}
      >
        {step}
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground leading-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

/* ─────────── main component ─────────── */
export default function PreexpedienteForm() {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, any> = Object.fromEntries(fd.entries());
    
    // Remove the File object from the JSON payload (will be attached as URL later)
    delete payload.payment_receipt;

    try {
      // 1. Subir imagen si existe
      const fileInput = form.elements.namedItem("payment_receipt") as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const sup = getSupabase();
        const { error: uploadErr } = await sup.storage.from("comprobantes").upload(fileName, file);
        
        if (uploadErr) {
          throw new Error("Error al subir el comprobante: " + uploadErr.message);
        }
        
        const { data: publicUrlData } = sup.storage.from("comprobantes").getPublicUrl(fileName);
        payload.payment_receipt_url = publicUrlData.publicUrl;
      }

      // 2. Enviar datos JSON al backend
      const res = await fetch("/api/preexpediente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        form.reset();
        setToast({ type: "success", msg: "¡Preexpediente guardado exitosamente!" });
        setTimeout(() => setToast(null), 6000);
      } else {
        const err = await res.json();
        setToast({ type: "error", msg: err.error || "Error al guardar el formulario." });
        setTimeout(() => setToast(null), 8000);
      }
    } catch {
      setToast({ type: "error", msg: "Error de conexión. Verifica tu internet e intenta de nuevo." });
      setTimeout(() => setToast(null), 8000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 80, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 80, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold max-w-sm text-white ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ══════════ SECCIÓN 1: Quien llama ══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <SectionHeader
            step="1"
            title="Datos de quien llama"
            subtitle="Información de contacto del familiar o representante"
            color="bg-violet-600"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Nombre completo" required icon={User}>
              <input
                type="text"
                name="caller_name"
                id="caller_name"
                required
                className={inputBase}
                placeholder="Ej. María López"
              />
            </Field>

            <Field label="Ciudad de origen" icon={MapPin}>
              <input
                type="text"
                name="caller_city"
                id="caller_city"
                className={inputBase}
                placeholder="Ej. Ciudad de México"
              />
            </Field>

            <Field label="Correo electrónico" icon={Mail}>
              <input
                type="email"
                name="caller_email"
                id="caller_email"
                className={inputBase}
                placeholder="ejemplo@correo.com"
              />
            </Field>

            <Field label="Teléfono" required icon={Phone}>
              <input
                type="tel"
                name="caller_phone"
                id="caller_phone"
                required
                className={inputBase}
                placeholder="+52 55 1234 5678"
              />
            </Field>

            <Field label="Edad" icon={Calendar}>
              <input
                type="number"
                name="caller_age"
                id="caller_age"
                min={10}
                max={100}
                className={inputBase}
                placeholder="Ej. 45"
              />
            </Field>
          </div>
        </motion.div>

        {/* ══════════ SECCIÓN 2: Datos del paciente ══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <SectionHeader
            step="2"
            title="Datos del Paciente"
            subtitle="Información clínica y situación actual del paciente"
            color="bg-sky-600"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Nombre del paciente" required icon={User}>
              <input
                type="text"
                name="patient_name"
                id="patient_name"
                required
                className={inputBase}
                placeholder="Ej. Carlos López"
              />
            </Field>

            <Field label="Edad del paciente" icon={Calendar}>
              <input
                type="number"
                name="patient_age"
                id="patient_age"
                min={5}
                max={100}
                className={inputBase}
                placeholder="Ej. 27"
              />
            </Field>

            {/* SELECT: Tipo de adicción */}
            <Field label="Tipo de adicción" icon={HeartPulse}>
              <select name="addiction_type" id="addiction_type" className={inputBase}>
                <option value="">— Selecciona —</option>
                <option value="Alcohol">Alcohol</option>
                <option value="Drogas ilegales">Drogas ilegales</option>
                <option value="Medicamentos">Medicamentos con receta / automedicación</option>
                <option value="Tabaco">Tabaco / Nicotina</option>
                <option value="Ludopatía">Ludopatía (juegos de azar)</option>
                <option value="Trastornos Alimenticios">Trastornos Alimenticios</option>
                <option value="Múltiples">Múltiples adicciones</option>
                <option value="Otro">Otro</option>
              </select>
            </Field>

            {/* SELECT: Historial de anexos */}
            <Field label="Anexos o clínicas previas" icon={ClipboardList}>
              <select name="rehab_history" id="rehab_history" className={inputBase}>
                <option value="">— Selecciona —</option>
                <option value="Ninguno">Ninguno (primer intento)</option>
                <option value="1 vez">1 vez</option>
                <option value="2-3 veces">2 – 3 veces</option>
                <option value="Más de 3 veces">Más de 3 veces</option>
              </select>
            </Field>

            {/* ABIERTO: Sustancias */}
            <div className="sm:col-span-2">
              <Field label="Sustancias que consume">
                <input
                  type="text"
                  name="substances_consumed"
                  id="substances_consumed"
                  className={inputBase}
                  placeholder="Ej. Cristal, alcohol, benzodiacepinas…"
                />
              </Field>
            </div>

            {/* ABIERTO: Notas */}
            <div className="sm:col-span-2">
              <Field label="Notas del paciente">
                <textarea
                  name="patient_notes"
                  id="patient_notes"
                  rows={4}
                  className={`${inputBase} resize-none`}
                  placeholder="Contexto adicional: estado emocional, conducta, intentos de suicidio, situación familiar…"
                />
              </Field>
            </div>
          </div>
        </motion.div>

        {/* ══════════ SECCIÓN 3: Tipo de pago ══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <SectionHeader
            step="3"
            title="Tipo de pago e ingreso"
            subtitle="Capacidad económica y modalidad de tratamiento preferida"
            color="bg-amber-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* ABIERTO: Presupuesto */}
            <Field label="Presupuesto (MXN)" icon={Banknote}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  name="budget"
                  id="budget"
                  min={0}
                  className={`${inputBase} pl-7`}
                  placeholder="Ej. 15000"
                />
              </div>
            </Field>

            {/* SELECT: Frecuencia de pago */}
            <Field label="Frecuencia de pago">
              <select name="payment_frequency" id="payment_frequency" className={inputBase}>
                <option value="">— Selecciona —</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
              </select>
            </Field>

            {/* SELECT: Tipo de terapia */}
            <Field label="Tipo de terapia">
              <select name="therapy_type" id="therapy_type" className={inputBase}>
                <option value="">— Selecciona —</option>
                <option value="Internamiento">Internamiento</option>
                <option value="Ambulatoria">Ambulatoria</option>
                <option value="Mixta">Mixta</option>
              </select>
            </Field>

            {/* UPLOAD: Comprobante */}
            <div className="sm:col-span-3 lg:col-span-1 mt-2 sm:mt-0">
              <Field label="Comprobante de pago (Foto/PDF)" icon={Upload}>
                <input
                  type="file"
                  name="payment_receipt"
                  id="payment_receipt"
                  accept="image/*,application/pdf"
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer bg-white/60 dark:bg-white/5 border border-border/60 rounded-xl"
                />
              </Field>
            </div>
          </div>
        </motion.div>

        {/* ── Submit ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 active:scale-[0.99] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed text-base group"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando preexpediente…
              </>
            ) : (
              <>
                Guardar Preexpediente
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Los campos marcados con <span className="text-red-500 font-semibold">*</span> son obligatorios.
            La información se almacena de forma segura en la base de datos de CREI.
          </p>
        </motion.div>
      </form>
    </div>
  );
}
