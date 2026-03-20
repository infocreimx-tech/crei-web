"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function PreexpedienteForm() {
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/preexpediente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        form.reset();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      } else {
        const err = await res.json();
        alert(`Ocurrió un error: ${err.error || 'Server Error'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al servidor al enviar el formulario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            ✅ ¡Preexpediente guardado exitosamente!
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8 md:p-12 rounded-3xl shadow-lg">
        
        {/* SECCIÓN 1: Datos de quien llama */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">1. Datos de quien llama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="caller_name" className="text-sm font-medium text-primary">Nombre *</label>
              <input type="text" id="caller_name" name="caller_name" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Ej. María López" />
            </div>
            <div className="space-y-2">
              <label htmlFor="caller_city" className="text-sm font-medium text-primary">Ciudad de Origen</label>
              <input type="text" id="caller_city" name="caller_city" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Ej. Ciudad de México" />
            </div>
            <div className="space-y-2">
              <label htmlFor="caller_email" className="text-sm font-medium text-primary">Correo Electrónico</label>
              <input type="email" id="caller_email" name="caller_email" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="maria@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="caller_phone" className="text-sm font-medium text-primary">Teléfono *</label>
              <input type="tel" id="caller_phone" name="caller_phone" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="+52 55 1234 5678" />
            </div>
            <div className="space-y-2">
              <label htmlFor="caller_age" className="text-sm font-medium text-primary">Edad</label>
              <input type="number" id="caller_age" name="caller_age" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Ej. 45" />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: Datos del paciente */}
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">2. Datos del Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="patient_name" className="text-sm font-medium text-primary">Nombre del Paciente *</label>
              <input type="text" id="patient_name" name="patient_name" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Ej. Carlos López" />
            </div>
            <div className="space-y-2">
              <label htmlFor="patient_age" className="text-sm font-medium text-primary">Edad del Paciente</label>
              <input type="number" id="patient_age" name="patient_age" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Ej. 25" />
            </div>
            <div className="space-y-2">
              <label htmlFor="addiction_type" className="text-sm font-medium text-primary">Tipo de Adicción</label>
              <select id="addiction_type" name="addiction_type" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all">
                <option value="">Selecciona una opción</option>
                <option value="Alcohol">Alcohol</option>
                <option value="Sustancias químicas">Sustancias químicas</option>
                <option value="Ludopatía">Ludopatía</option>
                <option value="Trastornos Alimenticios">Trastornos Alimenticios</option>
                <option value="Múltiples">Múltiples</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="rehab_history" className="text-sm font-medium text-primary">Anexos o Clínicas (Historial)</label>
              <select id="rehab_history" name="rehab_history" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all">
                <option value="">Selecciona una opción</option>
                <option value="Ninguno">Ninguno</option>
                <option value="1 vez">1 vez</option>
                <option value="2-3 veces">2-3 veces</option>
                <option value="Más de 3 veces">Más de 3 veces</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="substances_consumed" className="text-sm font-medium text-primary">Sustancias que consume</label>
            <input type="text" id="substances_consumed" name="substances_consumed" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Ej. Marihuana, cristal, etc." />
          </div>
          <div className="space-y-2">
            <label htmlFor="patient_notes" className="text-sm font-medium text-primary">Notas del paciente</label>
            <textarea id="patient_notes" name="patient_notes" rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all resize-none" placeholder="Contexto adicional, estado emocional, comportamiento..."></textarea>
          </div>
        </div>

        {/* SECCIÓN 3: Tipo de Pago */}
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">3. Detalles de Pago e Ingreso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium text-primary">Presupuesto ($)</label>
              <input type="number" id="budget" name="budget" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Ej. 15000" />
            </div>
            <div className="space-y-2">
              <label htmlFor="payment_frequency" className="text-sm font-medium text-primary">Frecuencia de Pago</label>
              <select id="payment_frequency" name="payment_frequency" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all">
                <option value="">Selecciona una opción</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="therapy_type" className="text-sm font-medium text-primary">Tipo de Terapia</label>
              <select id="therapy_type" name="therapy_type" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/50 transition-all">
                <option value="">Selecciona una opción</option>
                <option value="Internamiento">Internamiento</option>
                <option value="Ambulatoria">Ambulatoria</option>
                <option value="Mixta">Mixta</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
        >
          {submitting ? "Guardando..." : "Guardar Preexpediente"} <CheckCircle size={20} />
        </button>
      </form>
    </div>
  );
}
