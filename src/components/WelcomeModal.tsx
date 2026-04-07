"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Target, X, ChevronRight, Sparkles } from "lucide-react";

export default function WelcomeModal({ userEmail, userName }: { userEmail: string, userName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Verificar si ya vio el modal
    const storageKey = `welcome_portal_seen_${userEmail}`;
    if (!localStorage.getItem(storageKey)) {
      setIsOpen(true);
    }
  }, [userEmail]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(`welcome_portal_seen_${userEmail}`, "true");
  };

  const nextStep = () => {
    if (step === 2) {
      handleClose();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0514]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#150b24] w-full max-w-2xl rounded-3xl border border-[#9f86c0]/30 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col"
              style={{ minHeight: "500px" }}
            >
              {/* Background Ambient Glow */}
              <div className="absolute top-[-100px] right-[-100px] w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none transition-colors duration-1000" 
                   style={{ background: step === 1 ? "#7c5cbf" : step === 2 ? "#0f766e" : "#e879f9" }} />

              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-6 right-6 text-white/30 hover:text-white/80 transition-colors z-20 bg-black/20 p-2 rounded-full backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content Wrapper */}
              <div className="relative z-10 p-8 md:p-12 flex-1 flex flex-col justify-center">
                
                <AnimatePresence mode="wait">
                  
                  {/* STEP 0: Welcome */}
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      <div className="mx-auto w-20 h-20 bg-[#e879f9]/20 rounded-full flex items-center justify-center mb-8 border border-[#e879f9]/30">
                        <Sparkles className="w-10 h-10 text-[#e879f9]" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                        Bienvenido a tu recuperación, {userName || "Paciente"}
                      </h2>
                      <p className="text-[#c4b5fd] text-lg leading-relaxed mb-8 max-w-md mx-auto">
                        Este portal ha sido diseñado meticulosamente para acompañarte en cada fase de tu transformación. Antes de empezar, queremos mostrarte dos herramientas fundamentales.
                      </p>
                    </motion.div>
                  )}

                  {/* STEP 1: 12 Pasos */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      <div className="mx-auto w-24 h-24 bg-[#7c5cbf]/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(124,92,191,0.3)]">
                        <BookOpen className="w-12 h-12 text-[#a78bfa] relative z-10" />
                      </div>
                      <h2 className="text-3xl font-serif font-bold text-white mb-4">
                        ¿Por qué son importantes los 12 Pasos de AA?
                      </h2>
                      <p className="text-[#c4b5fd] leading-relaxed mb-6">
                        No son solo lecturas, son un <strong>mapa espiritual y mental</strong> probado durante décadas. 
                        Este formato <span className="italic text-white">e-book inmersivo</span> te guiará para:
                      </p>
                      <div className="text-left space-y-4 max-w-md mx-auto bg-black/20 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#7c5cbf] mt-2" />
                          <p className="text-[#ebe5f5] text-sm leading-relaxed">Admitir la vulnerabilidad sin culpa y construir resiliencia real.</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#7c5cbf] mt-2" />
                          <p className="text-[#ebe5f5] text-sm leading-relaxed">Hacer un inventario moral profundo para sanar relaciones rotas.</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#7c5cbf] mt-2" />
                          <p className="text-[#ebe5f5] text-sm leading-relaxed">Mantener una sobriedad emocional sustentable a largo plazo.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Metas */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      <div className="mx-auto w-24 h-24 bg-[#0f766e]/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(15,118,110,0.3)]">
                        <Target className="w-12 h-12 text-[#2dd4bf]" />
                      </div>
                      <h2 className="text-3xl font-serif font-bold text-white mb-4">
                        El poder del Cumplimiento de Metas
                      </h2>
                      <p className="text-[#c4b5fd] leading-relaxed mb-6">
                        La voluntad por sí sola se agota; <strong>los sistemas y las rutinas construyen el futuro</strong>. 
                        Nuestra sección de metas masivas es crucial porque:
                      </p>
                      <div className="text-left space-y-4 max-w-md mx-auto bg-black/20 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#0f766e] mt-2 shrink-0" />
                          <p className="text-[#ebe5f5] text-sm leading-relaxed">Te permite fracturar abrumadores retos mensuales en pequeñas acciones diarias manejables.</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#0f766e] mt-2 shrink-0" />
                          <p className="text-[#ebe5f5] text-sm leading-relaxed">El progreso visual (trazando tu círculo al 100%) activa neuroquímicos de recompensa de forma saludable.</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-[#0f766e] mt-2 shrink-0" />
                          <p className="text-[#ebe5f5] text-sm leading-relaxed">Fomenta el compromiso activo; registrar una tarea eleva en 80% su probabilidad de éxito.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

              {/* Bottom Actions */}
              <div className="border-t border-white/10 bg-black/20 p-6 flex justify-between items-center relative z-10 w-full shrink-0">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "bg-white w-6" : "bg-white/20 w-3"}`} />
                  ))}
                </div>
                
                <button 
                  onClick={nextStep}
                  className="bg-white text-black font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/90 transition-all active:scale-95"
                >
                  {step === 2 ? "Comenzar" : "Siguiente"} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
