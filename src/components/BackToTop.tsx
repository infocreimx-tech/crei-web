"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          aria-label="Volver al inicio"
          className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #7c5cbf, #a855f7)", border: "1px solid rgba(196,181,253,0.3)", boxShadow: "0 4px 20px rgba(124,92,191,0.5)" }}
        >
          <ArrowUp className="w-5 h-5" style={{ color: "#fff" }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
