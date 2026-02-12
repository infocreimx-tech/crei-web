"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    let observer: MutationObserver | undefined;
    try {
      const key = "crei-cookie-consent";
      const consent = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (consent) return;
      const html = document.documentElement;
      const show = () => setShowConsent(true);
      if (html && html.dataset.infoModal === "1") {
        observer = new MutationObserver(() => {
          if (html.dataset.infoModal !== "1") {
            show();
            if (observer) observer.disconnect();
          }
        });
        observer.observe(html, { attributes: true, attributeFilter: ["data-info-modal"] });
      } else {
        show();
      }
    } catch {}
    return () => {
      if (timer) window.clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem("crei-cookie-consent", "true");
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-primary text-lg">
                  Valoramos tu privacidad
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación y analizar el uso de nuestra web. Al continuar navegando, aceptas su uso.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 shrink-0 w-full md:w-auto">
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-md text-sm whitespace-nowrap"
              >
                Aceptar Todo
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-3 bg-transparent border border-border text-primary font-medium rounded-xl hover:bg-muted transition-colors text-sm whitespace-nowrap"
              >
                Solo Necesarias
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
