"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Heart, Send, Star, MapPin, X, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sb = createClient(
  "https://uywihjppwzrrfjkguvot.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5d2loanBwd3pycmZqa2d1dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTQ1OTEsImV4cCI6MjA4OTUzMDU5MX0.7eFia3SwiV4bBHvo-qZsmzEEu4RqTRMnMwbVZgrLZFw"
);

interface Agradecimiento {
  id: number;
  nombre: string;
  mensaje: string;
  ciudad?: string;
  destacado: boolean;
  created_at: string;
}

interface FormState {
  nombre: string;
  mensaje: string;
  ciudad: string;
  email: string;
}

const INITIAL_FORM: FormState = { nombre: "", mensaje: "", ciudad: "", email: "" };

export default function AgradecimientosPage() {
  const [mensajes, setMensajes] = useState<Agradecimiento[]>([]);
  const [destacados, setDestacados] = useState<Agradecimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const load = async () => {
      const [{ data: dest }, { data: rest }] = await Promise.all([
        sb.from("agradecimientos").select("*").eq("aprobado", true).eq("destacado", true).order("created_at", { ascending: false }),
        sb.from("agradecimientos").select("*").eq("aprobado", true).eq("destacado", false).order("created_at", { ascending: false }).limit(50),
      ]);
      setDestacados(dest || []);
      setMensajes(rest || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.mensaje.trim()) {
      setFormError("Por favor escribe tu nombre y mensaje.");
      return;
    }
    if (form.mensaje.trim().length < 10) {
      setFormError("El mensaje debe tener al menos 10 caracteres.");
      return;
    }
    setSending(true);
    setFormError("");
    try {
      const { error } = await sb.from("agradecimientos").insert({
        nombre: form.nombre.trim(),
        mensaje: form.mensaje.trim(),
        ciudad: form.ciudad.trim() || null,
        email: form.email.trim() || null,
        aprobado: false,
        destacado: false,
      });
      if (error) throw error;
      setSent(true);
      setForm(INITIAL_FORM);
      setTimeout(() => { setSent(false); setShowForm(false); }, 4000);
    } catch (err: any) {
      setFormError("Ocurrió un error. Inténtalo de nuevo.");
    }
    setSending(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24" style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0f2e 40%, #0d1a2e 100%)" }}>

        {/* ── Hero ── */}
        <section className="relative py-20 px-6 text-center overflow-hidden">
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse, #7c5cbf, transparent)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "#e879f9" }} />

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(124,92,191,0.2)", border: "1px solid rgba(124,92,191,0.4)", color: "#c4b5fd" }}>
              <Heart className="w-4 h-4 fill-current" /> Mensajes de amor
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight" style={{ color: "#fbfaff" }}>
              Agradecimientos
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(196,181,253,0.8)" }}>
              Cada historia de transformación es un regalo. Aquí compartimos los mensajes
              de quienes han confiado en CREI y encontrado un nuevo camino.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #7c5cbf, #a855f7)", color: "#fff", boxShadow: "0 0 30px rgba(124,92,191,0.4)" }}>
              <Heart className="w-5 h-5" /> Dejar mi mensaje
            </button>
          </motion.div>
        </section>

        {/* ── Destacados ── */}
        {destacados.length > 0 && (
          <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <h2 className="text-2xl font-serif font-bold" style={{ color: "#fbbf24" }}>Mensajes Destacados</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destacados.map((m, i) => (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="relative rounded-3xl p-7 overflow-hidden"
                    style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.25)", backdropFilter: "blur(12px)" }}>
                    <Star className="absolute top-5 right-5 w-4 h-4 fill-yellow-400 text-yellow-400 opacity-60" />
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: "radial-gradient(circle at top right, #fbbf24, transparent)" }} />
                    {/* Comillas */}
                    <p className="text-4xl font-serif leading-none mb-2" style={{ color: "#fbbf24", opacity: 0.5 }}>"</p>
                    <p className="text-base leading-relaxed mb-5 relative z-10" style={{ color: "rgba(251,250,255,0.9)" }}>
                      {m.mensaje}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                        {m.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "#fbfaff" }}>{m.nombre}</p>
                        {m.ciudad && <p className="text-xs flex items-center gap-1" style={{ color: "rgba(196,181,253,0.6)" }}><MapPin className="w-3 h-3" />{m.ciudad}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Todos los mensajes ── */}
        <section className="py-12 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-8" style={{ color: "#fbfaff" }}>
              Voces de nuestra comunidad
            </h2>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-4 animate-spin" style={{ borderColor: "#7c5cbf", borderTopColor: "transparent" }} />
              </div>
            ) : mensajes.length === 0 && destacados.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: "#c4b5fd" }} />
                <p className="text-lg opacity-50" style={{ color: "#c4b5fd" }}>Sé el primero en dejar tu mensaje.</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {mensajes.map((m, i) => (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="break-inside-avoid rounded-3xl p-6 mb-6"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(159,134,192,0.2)", backdropFilter: "blur(12px)" }}>
                    <p className="text-3xl font-serif leading-none mb-2" style={{ color: "#c4b5fd", opacity: 0.4 }}>"</p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(251,250,255,0.85)" }}>{m.mensaje}</p>
                    <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: "rgba(159,134,192,0.15)" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(124,92,191,0.2)", color: "#c4b5fd" }}>
                        {m.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "#fbfaff" }}>{m.nombre}</p>
                        <p className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>
                          {m.ciudad && <><MapPin className="w-3 h-3 inline mr-1" />{m.ciudad} · </>}
                          {formatDate(m.created_at)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA al fondo */}
            <div className="text-center mt-16">
              <button onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-105"
                style={{ background: "rgba(124,92,191,0.15)", border: "1px solid rgba(124,92,191,0.4)", color: "#c4b5fd" }}>
                <Heart className="w-5 h-5" /> Comparte tu historia
              </button>
            </div>
          </div>
        </section>

        {/* ── Modal: Dejar mensaje ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
              onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
              <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg rounded-[2rem] p-8"
                style={{ background: "rgba(15,10,30,0.98)", border: "1px solid rgba(124,92,191,0.4)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>

                {sent ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                    <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: "#fbfaff" }}>¡Gracias por tu mensaje!</h3>
                    <p className="text-sm" style={{ color: "rgba(196,181,253,0.7)" }}>
                      Tu agradecimiento será revisado y publicado pronto. 💜
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,92,191,0.2)" }}>
                          <Heart className="w-5 h-5 text-purple-400 fill-current" />
                        </div>
                        <h3 className="text-xl font-serif font-bold" style={{ color: "#fbfaff" }}>Deja tu mensaje</h3>
                      </div>
                      <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                        <X className="w-4 h-4" style={{ color: "#c4b5fd" }} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#c4b5fd" }}>Nombre *</label>
                          <input
                            type="text" required maxLength={80}
                            placeholder="Tu nombre"
                            value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(159,134,192,0.3)", color: "#fbfaff" }} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#c4b5fd" }}>Ciudad <span className="opacity-50">(opcional)</span></label>
                          <input
                            type="text" maxLength={60}
                            placeholder="Ciudad, País"
                            value={form.ciudad} onChange={e => setForm(p => ({ ...p, ciudad: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(159,134,192,0.3)", color: "#fbfaff" }} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#c4b5fd" }}>Tu mensaje *</label>
                        <textarea
                          required minLength={10} maxLength={600} rows={5}
                          placeholder="Comparte tu experiencia con CREI, cómo te ayudó, o simplemente un mensaje de amor hacia la fundación..."
                          value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(159,134,192,0.3)", color: "#fbfaff" }} />
                        <p className="text-right text-xs mt-1" style={{ color: "rgba(196,181,253,0.4)" }}>{form.mensaje.length}/600</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#c4b5fd" }}>Email <span className="opacity-50">(opcional, no se publica)</span></label>
                        <input
                          type="email" maxLength={120}
                          placeholder="tu@email.com"
                          value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(159,134,192,0.3)", color: "#fbfaff" }} />
                      </div>

                      {formError && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                        </div>
                      )}

                      <p className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>
                        Tu mensaje será revisado antes de publicarse. El email nunca se mostrará.
                      </p>

                      <button type="submit" disabled={sending}
                        className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                        style={{ background: sending ? "rgba(124,92,191,0.4)" : "linear-gradient(135deg,#7c5cbf,#a855f7)", color: "#fff", boxShadow: sending ? "none" : "0 0 20px rgba(124,92,191,0.4)" }}>
                        {sending ? (
                          <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Enviando...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Enviar mensaje</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
