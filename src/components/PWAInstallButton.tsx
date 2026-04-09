"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, Share, PlusSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallButton({ lang }: { lang: "es" | "en" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [deviceEnv, setDeviceEnv] = useState<"ios" | "android" | "desktop">("desktop");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Detect device environment
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceEnv("ios");
    } else if (/android/.test(userAgent)) {
      setDeviceEnv("android");
    }

    // Listen for the native install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show native prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Show manual instructions modal for iOS or unsupported browsers
      setShowInstructions(true);
    }
  };

  const t = {
    downloadText: lang === "es" ? "Descargar e Instalar CREI App" : "Download & Install CREI App",
    isInstalled: lang === "es" ? "Aplicación ya Instalada" : "App already Installed",
    instructionsTitle: lang === "es" ? "Cómo instalar la App" : "How to install the App",
    iosStep1: lang === "es" ? "En tu navegador Safari, toca el botón de " : "In your Safari browser, tap the ",
    iosStep1Bold: lang === "es" ? "Compartir" : "Share",
    iosStep1End: lang === "es" ? " en la barra inferior." : " button at the bottom.",
    iosStep2: lang === "es" ? "Selecciona " : "Select ",
    iosStep2Bold: lang === "es" ? "Añadir a Pantalla de Inicio" : "Add to Home Screen",
    iosStep2End: lang === "es" ? " en el menú." : " from the menu.",
    descIOS: lang === "es" ? "iOS restringe las instalaciones automáticas. Debes hacerlo manualmente en Safari." : "iOS restricts automatic installations. You must do it manually in Safari.",
    descOther: lang === "es" ? "Tu navegador actual no soporta instalación directa. Intenta desde Google Chrome o Safari en móvil." : "Your current browser does not support direct installation. Try Google Chrome or Safari on mobile.",
    close: lang === "es" ? "Entendido" : "Got it",
  };

  if (isStandalone) {
    return (
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl opacity-70 mt-6">
        <Smartphone className="w-5 h-5" />
        <span className="font-medium tracking-wide">{t.isInstalled}</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300 mt-6"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <Download className="w-6 h-6 relative z-10" />
        <span className="font-bold tracking-wider relative z-10">{t.downloadText}</span>
      </button>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              
              <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 text-primary/50 hover:text-primary transition-colors bg-background/50 backdrop-blur rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold text-primary mb-2 mt-4 font-playfair">{t.instructionsTitle}</h3>
              
              {deviceEnv === "ios" ? (
                <div>
                  <p className="text-sm text-primary/70 mb-6">{t.descIOS}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                      <div className="p-2 bg-primary/5 rounded-lg shrink-0">
                        <Share className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-sm text-primary/80">
                        <span className="font-bold text-accent">1.</span> {t.iosStep1} <strong className="text-primary">{t.iosStep1Bold}</strong> {t.iosStep1End}
                      </p>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                      <div className="p-2 bg-primary/5 rounded-lg shrink-0">
                        <PlusSquare className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-sm text-primary/80">
                        <span className="font-bold text-accent">2.</span> {t.iosStep2} <strong className="text-primary">{t.iosStep2Bold}</strong> {t.iosStep2End}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-md text-primary/80">{t.descOther}</p>
                  <div className="flex justify-center py-6">
                    <Smartphone className="w-16 h-16 text-primary/20 animate-pulse" />
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold tracking-wide hover:opacity-90 transition-opacity"
              >
                {t.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
