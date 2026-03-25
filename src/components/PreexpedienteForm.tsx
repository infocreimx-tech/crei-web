"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Phone, User, MapPin, Mail, Calendar, HeartPulse,
  ClipboardList, Banknote, ChevronRight, Loader2, AlertCircle, Upload,
  Activity, FileText, UserPlus
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

/* ─────────── helpers ─────────── */
const inputBase =
  "w-full px-4 py-3 rounded-xl border border-border bg-white/60 dark:bg-white/5 placeholder:text-muted-foreground/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-200 text-sm";

const labelBase = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5";
const checkboxBase = "w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer";

function Field({ label, required, icon: Icon, children }: { label: string; required?: boolean; icon?: React.ElementType; children: React.ReactNode }) {
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

function SectionHeader({ step, title, subtitle, color, icon: Icon }: { step: string; title: string; subtitle: string; color: string; icon?: React.ElementType }) {
  return (
    <div className={`flex items-center gap-4 pb-4 border-b border-border/60 mb-6 mt-8`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-md shrink-0 ${color}`}>
        {Icon ? <Icon size={20} /> : step}
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
    
    // Generate boolean mapping for checkboxes (FormData only includes them if checked and value is "on")
    const checkboxFields = [
      'substance_alcohol', 'substance_cocaina', 'substance_heroina', 'substance_marihuana',
      'substance_med_estimulantes', 'substance_tabaco', 'substance_alucinogenos',
      'substance_drogas_diseno', 'substance_inhalables', 'substance_med_depresivos',
      'substance_meta_anfetaminas', 'consultation_reference_sheet', 'family_is_representative'
    ];

    checkboxFields.forEach(field => {
      payload[field] = fd.has(field);
    });

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

      // Generar FOLIO
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let newFolio = 'CR-';
      for (let i = 0; i < 6; i++) {
        newFolio += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // 2. Enviar datos directamente a Supabase
      const dbPayload = {
        folio: newFolio,
        
        // Quien llama
        caller_name: payload.caller_name ? String(payload.caller_name).trim() : null,
        caller_city: payload.caller_city ? String(payload.caller_city).trim() : null,
        caller_email: payload.caller_email ? String(payload.caller_email).trim() : null,
        caller_phone: payload.caller_phone ? String(payload.caller_phone).trim() : null,
        caller_age: payload.caller_age ? Number(payload.caller_age) : null,
        
        // Paciente Generales
        patient_name: payload.patient_name ? String(payload.patient_name).trim() : null,
        patient_lastname: payload.patient_lastname ? String(payload.patient_lastname).trim() : null,
        patient_age: payload.patient_age ? Number(payload.patient_age) : null,
        patient_sex: payload.patient_sex ? String(payload.patient_sex).trim() : null,
        patient_dob: payload.patient_dob ? String(payload.patient_dob).trim() : null,
        patient_nationality: payload.patient_nationality ? String(payload.patient_nationality).trim() : null,
        patient_occupation: payload.patient_occupation ? String(payload.patient_occupation).trim() : null,
        patient_phone: payload.patient_phone ? String(payload.patient_phone).trim() : null,
        patient_marital_status: payload.patient_marital_status ? String(payload.patient_marital_status).trim() : null,
        patient_medical_services: payload.patient_medical_services ? String(payload.patient_medical_services).trim() : null,
        patient_education: payload.patient_education ? String(payload.patient_education).trim() : null,
        patient_email: payload.patient_email ? String(payload.patient_email).trim() : null,

        // Domicilio
        address_street: payload.address_street ? String(payload.address_street).trim() : null,
        address_ext_num: payload.address_ext_num ? String(payload.address_ext_num).trim() : null,
        address_int_num: payload.address_int_num ? String(payload.address_int_num).trim() : null,
        address_colonia: payload.address_colonia ? String(payload.address_colonia).trim() : null,
        address_municipio: payload.address_municipio ? String(payload.address_municipio).trim() : null,
        address_zip: payload.address_zip ? String(payload.address_zip).trim() : null,
        
        // Consumo
        addiction_type: payload.addiction_type ? String(payload.addiction_type).trim() : null,
        rehab_history: payload.rehab_history ? String(payload.rehab_history).trim() : null,
        substances_consumed: payload.substances_consumed ? String(payload.substances_consumed).trim() : null, // Mantenemos el old abierto
        substance_alcohol: Boolean(payload.substance_alcohol),
        substance_cocaina: Boolean(payload.substance_cocaina),
        substance_heroina: Boolean(payload.substance_heroina),
        substance_marihuana: Boolean(payload.substance_marihuana),
        substance_med_estimulantes: Boolean(payload.substance_med_estimulantes),
        substance_tabaco: Boolean(payload.substance_tabaco),
        substance_alucinogenos: Boolean(payload.substance_alucinogenos),
        substance_drogas_diseno: Boolean(payload.substance_drogas_diseno),
        substance_inhalables: Boolean(payload.substance_inhalables),
        substance_med_depresivos: Boolean(payload.substance_med_depresivos),
        substance_meta_anfetaminas: Boolean(payload.substance_meta_anfetaminas),
        substance_otros: payload.substance_otros ? String(payload.substance_otros).trim() : null,

        // Motivos Consulta
        consultation_motive: payload.consultation_motive ? String(payload.consultation_motive).trim() : null,
        consultation_origin: payload.consultation_origin ? String(payload.consultation_origin).trim() : null,
        consultation_admission_type: payload.consultation_admission_type ? String(payload.consultation_admission_type).trim() : null,
        consultation_reference_sheet: Boolean(payload.consultation_reference_sheet),

        // Familiar
        family_is_representative: Boolean(payload.family_is_representative),
        family_name: payload.family_name ? String(payload.family_name).trim() : null,
        family_materno: payload.family_materno ? String(payload.family_materno).trim() : null,
        family_paterno: payload.family_paterno ? String(payload.family_paterno).trim() : null,
        family_phone: payload.family_phone ? String(payload.family_phone).trim() : null,
        family_email: payload.family_email ? String(payload.family_email).trim() : null,

        // Notas y Firma
        patient_notes: payload.patient_notes ? String(payload.patient_notes).trim() : null,
        staff_assigned: payload.staff_assigned ? String(payload.staff_assigned).trim() : null,
        created_by_name: payload.created_by_name ? String(payload.created_by_name).trim() : null,
        created_by_position: payload.created_by_position ? String(payload.created_by_position).trim() : null,

        // Finanzas
        budget: payload.budget ? Number(payload.budget) : null,
        payment_frequency: payload.payment_frequency ? String(payload.payment_frequency).trim() : null,
        therapy_type: payload.therapy_type ? String(payload.therapy_type).trim() : null,
        payment_receipt_url: payload.payment_receipt_url ? String(payload.payment_receipt_url) : null,
      };

      const sup = getSupabase();
      const { error: dbErr } = await sup.from("preexpediente").insert(dbPayload);

      if (!dbErr) {
        form.reset();
        setToast({ type: "success", msg: `¡Preexpediente guardado! Expediente creado. Folio: ${newFolio}` });
        setTimeout(() => setToast(null), 10000);
      } else {
        setToast({ type: "error", msg: `Error en base de datos: ${dbErr.message}` });
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
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 80, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 80, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold max-w-sm text-white ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-border/60 rounded-3xl p-6 md:p-10 shadow-sm">
        
        {/* PARTE 1 - QUIEN LLAMA (Contacto Original) */}
        <SectionHeader step="1" title="Datos de Contacto (Quien llama)" subtitle="Contacto inicial telefónico u origen del registro" color="bg-violet-600" icon={Phone} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <Field label="Nombre del contacto"><input type="text" name="caller_name" className={inputBase} placeholder="Pedro López" /></Field>
          <Field label="Ciudad origen"><input type="text" name="caller_city" className={inputBase} /></Field>
          <Field label="Teléfono de contacto"><input type="tel" name="caller_phone" className={inputBase} /></Field>
          <Field label="Correo"><input type="email" name="caller_email" className={inputBase} /></Field>
          <Field label="Edad"><input type="number" name="caller_age" className={inputBase} /></Field>
        </div>

        {/* PARTE 2 - DATOS CLÍNICOS Y GENERALES */}
        <SectionHeader step="2" title="Datos Generales del Paciente" subtitle="Identidad y perfil clínico" color="bg-sky-600" icon={User} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <Field label="Nombre" required><input type="text" name="patient_name" className={inputBase} required/></Field>
          <Field label="Apellidos"><input type="text" name="patient_lastname" className={inputBase} /></Field>
          <Field label="Sexo">
            <select name="patient_sex" className={inputBase}>
              <option value="">— Seleccionar —</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </Field>
          <Field label="Teléfono Particular"><input type="tel" name="patient_phone" className={inputBase} /></Field>
          <Field label="Fecha de Nacimiento"><input type="date" name="patient_dob" className={inputBase} /></Field>
          <Field label="Edad"><input type="number" name="patient_age" className={inputBase} /></Field>
          <Field label="Nacionalidad"><input type="text" name="patient_nationality" className={inputBase} /></Field>
          <Field label="Ocupación"><input type="text" name="patient_occupation" className={inputBase} /></Field>
          <Field label="Estado Civil"><input type="text" name="patient_marital_status" className={inputBase} /></Field>
          <Field label="Servicios Médicos"><input type="text" name="patient_medical_services" className={inputBase} placeholder="IMSS, ISSSTE..." /></Field>
          <Field label="Escolaridad"><input type="text" name="patient_education" className={inputBase} /></Field>
          <Field label="Correo Particular"><input type="email" name="patient_email" className={inputBase} /></Field>
        </div>

        {/* DOMICILIO */}
        <SectionHeader step="" title="Domicilio Particular" subtitle="Residencia" color="bg-emerald-600" icon={MapPin} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <Field label="Calle"><input type="text" name="address_street" className={inputBase} /></Field>
          <Field label="Ext"><input type="text" name="address_ext_num" className={inputBase} /></Field>
          <Field label="Int"><input type="text" name="address_int_num" className={inputBase} /></Field>
          <Field label="Colonia"><input type="text" name="address_colonia" className={inputBase} /></Field>
          <Field label="Municipio / Alcaldía"><input type="text" name="address_municipio" className={inputBase} /></Field>
          <Field label="C.P."><input type="text" name="address_zip" className={inputBase} /></Field>
        </div>

        {/* CONSUMO E HISTORIAL */}
        <SectionHeader step="3" title="Historial Clínico y Consumo" subtitle="Detalle patológico" color="bg-rose-600" icon={Activity} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <Field label="Afección Primaria (Histórico)">
            <select name="addiction_type" className={inputBase}>
              <option value="">— Seleccionar —</option>
              <option value="Alcohol">Alcohol</option>
              <option value="Drogas ilegales">Drogas ilegales</option>
              <option value="Medicamentos">Medicamentos automedicación</option>
              <option value="Múltiples">Múltiples adicciones</option>
              <option value="Otro">Otro</option>
            </select>
          </Field>
          <Field label="Intentos previos o Anexos">
            <select name="rehab_history" className={inputBase}>
              <option value="">— Seleccionar —</option>
              <option value="Ninguno">Ninguno</option>
              <option value="1 vez">1 vez</option>
              <option value="2-3 veces">2 – 3 veces</option>
              <option value="Más de 3 veces">Más de 3 veces</option>
            </select>
          </Field>
        </div>
        
        <div className="bg-slate-100 dark:bg-black/20 p-5 rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_alcohol" className={checkboxBase} /> Alcohol</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_cocaina" className={checkboxBase} /> Cocaína</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_heroina" className={checkboxBase} /> Heroína</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_marihuana" className={checkboxBase} /> Marihuana</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_med_estimulantes" className={checkboxBase} /> Med. Estimulantes</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_tabaco" className={checkboxBase} /> Tabaco</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_alucinogenos" className={checkboxBase} /> Alucinógenos</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_drogas_diseno" className={checkboxBase} /> Drogas Diseño</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_inhalables" className={checkboxBase} /> Inhalables</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_med_depresivos" className={checkboxBase} /> Med. Depresivos</label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="checkbox" name="substance_meta_anfetaminas" className={checkboxBase} /> Meta / Anfetaminas</label>
        </div>
        <div className="mt-4">
          <Field label="Otros consumos o detalles"><input type="text" name="substance_otros" className={inputBase} /></Field>
        </div>

        {/* MOTIVO DE LA CONSULTA */}
        <SectionHeader step="" title="Motivo de Consulta e Ingreso" subtitle="Contexto y procedencia" color="bg-amber-500" icon={FileText} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Motivo de Consulta"><input type="text" name="consultation_motive" className={inputBase} /></Field>
          <Field label="De dónde proviene"><input type="text" name="consultation_origin" className={inputBase} /></Field>
          <Field label="Tipo de Ingreso">
            <select name="consultation_admission_type" className={inputBase}>
              <option value="">— Seleccionar —</option>
              <option value="Voluntario">Voluntario</option>
              <option value="Involuntario">Involuntario</option>
              <option value="Traslado">Traslado</option>
            </select>
          </Field>
          <div className="col-span-full pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input type="checkbox" name="consultation_reference_sheet" className={checkboxBase} /> ¿Presenta Hoja de Referencia?
            </label>
          </div>
        </div>

        {/* FAMILIAR / REPRESENTANTE */}
        <SectionHeader step="4" title="Familiar Responsable" subtitle="Tutor o contacto de emergencia" color="bg-indigo-600" icon={UserPlus} />
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-indigo-700 dark:text-indigo-300">
            <input type="checkbox" name="family_is_representative" className={checkboxBase} /> ¿Es esta persona la Representante Responsable?
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <Field label="Nombre(s)"><input type="text" name="family_name" className={inputBase} /></Field>
          <Field label="Paterno"><input type="text" name="family_paterno" className={inputBase} /></Field>
          <Field label="Materno"><input type="text" name="family_materno" className={inputBase} /></Field>
          <Field label="Tel. / Whatsapp"><input type="text" name="family_phone" className={inputBase} /></Field>
          <Field label="Email Familiar"><input type="email" name="family_email" className={inputBase} /></Field>
        </div>

        {/* NOTAS Y FIRMAS INSTITUCIONALES */}
        <SectionHeader step="5" title="Anotaciones Clínicas" subtitle="Uso exclusivo del staff" color="bg-emerald-700" icon={ClipboardList} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Field label="Notas del paciente / Observaciones">
              <textarea name="patient_notes" rows={4} className={`${inputBase} resize-y`} placeholder="Contexto adicional, intentos conductuales..." />
            </Field>
          </div>
          <Field label="Asignación del Staff (Usuarios)"><input type="text" name="staff_assigned" className={inputBase} placeholder="Ej. Dr. Rodríguez" /></Field>
          <Field label="Elabora: Nombre de quien llena esto"><input type="text" name="created_by_name" className={inputBase} /></Field>
          <Field label="Cargo de quien elabora"><input type="text" name="created_by_position" className={inputBase} /></Field>
        </div>

        {/* SECCIÓN FINANCIERA ORIGINAL */}
        <SectionHeader step="6" title="Finanzas y Admisión" subtitle="Terapia seleccionada y prespuesto" color="bg-zinc-800 dark:bg-zinc-300 dark:text-black text-white" icon={Banknote} />
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
          <Field label="Presupuesto (MXN)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
              <input type="number" name="budget" min={0} className={`${inputBase} pl-7`} placeholder="Ej. 15000" />
            </div>
          </Field>
          <Field label="Frecuencia">
            <select name="payment_frequency" className={inputBase}>
              <option value="">— Seleccionar —</option>
              <option value="Semanal">Semanal</option>
              <option value="Quincenal">Quincenal</option>
              <option value="Mensual">Mensual</option>
            </select>
          </Field>
          <Field label="Modalidad">
            <select name="therapy_type" className={inputBase}>
              <option value="">— Seleccionar —</option>
              <option value="Internamiento">Internamiento</option>
              <option value="Ambulatoria">Ambulatoria</option>
              <option value="Mixta">Mixta</option>
            </select>
          </Field>
          <div className="xl:col-span-1 md:col-span-3">
            <Field label="Comprobante (Foto/PDF)" icon={Upload}>
              <input type="file" name="payment_receipt" accept="image/*,application/pdf" className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer bg-white/60 dark:bg-white/5 border border-border/60 rounded-xl" />
            </Field>
          </div>
        </div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-8">
          <button type="submit" disabled={submitting} className="w-full py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black text-lg lg:text-xl rounded-2xl hover:opacity-90 active:scale-[0.99] transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3">
            {submitting ? <><Loader2 className="w-6 h-6 animate-spin" /> PROCESANDO Y GENERANDO FOLIO…</> : <>GUARDAR E INICIAR EXPEDIENTE COMPLETO <ChevronRight className="w-6 h-6" /></>}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
