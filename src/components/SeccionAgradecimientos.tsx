"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useI18n } from "@/i18n/I18nProvider";

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
}

// Paleta de gradientes para las burbujas
const GRADIENTS = [
  "linear-gradient(135deg, rgba(124,92,191,0.35), rgba(168,85,247,0.2))",
  "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.2))",
  "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(245,158,11,0.2))",
  "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(124,92,191,0.2))",
  "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.2))",
  "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(16,185,129,0.2))",
  "linear-gradient(135deg, rgba(239,68,68,0.22), rgba(251,191,36,0.2))",
  "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.2))",
];

const BORDER_COLORS = [
  "rgba(124,92,191,0.35)",
  "rgba(16,185,129,0.3)",
  "rgba(251,191,36,0.3)",
  "rgba(59,130,246,0.3)",
  "rgba(236,72,153,0.28)",
  "rgba(6,182,212,0.3)",
  "rgba(239,68,68,0.28)",
  "rgba(168,85,247,0.3)",
];

// Tarjeta burbuja individual
function BurbujaCard({ m, i }: { m: Agradecimiento; i: number }) {
  const gi = i % GRADIENTS.length;
  return (
    <div
      className="flex-shrink-0 w-64 rounded-3xl p-5 flex flex-col gap-3 mx-3 cursor-default select-none"
      style={{
        background: GRADIENTS[gi],
        border: `1px solid ${BORDER_COLORS[gi]}`,
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      {/* Avatar circular + nombre */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#fbfaff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {m.nombre.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: "#fbfaff" }}>
            {m.nombre}
          </p>
          {m.ciudad && (
            <p className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {m.ciudad}
            </p>
          )}
        </div>
        {m.destacado && (
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0 ml-auto" />
        )}
      </div>

      {/* Mensaje */}
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
        {m.mensaje.length > 120 ? m.mensaje.slice(0, 120) + "…" : m.mensaje}
      </p>
    </div>
  );
}

// Fila con scroll infinito
function FilaInfinita({
  items,
  direction = "left",
  speed = 40,
}: {
  items: Agradecimiento[];
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicamos para efecto infinito
  const doubled = [...items, ...items];
  const totalWidth = doubled.length * (256 + 24); // w-64 + mx-3*2
  const duration = totalWidth / speed;

  return (
    <div className="overflow-hidden w-full py-2">
      <div
        className="flex"
        style={{
          animation: `scroll-${direction} ${duration}s linear infinite`,
          width: `${totalWidth}px`,
        }}
      >
        {doubled.map((m, i) => (
          <BurbujaCard key={`${m.id}-${i}`} m={m} i={i} />
        ))}
      </div>
    </div>
  );
}

export default function SeccionAgradecimientos() {
  const { lang } = useI18n();
  const [items, setItems] = useState<Agradecimiento[]>([]);
  const [loading, setLoading] = useState(true);

  const copy =
    lang === "en"
      ? {
          badge: "Wall of Love",
          title: "Wall of Love",
          subtitle: "Real messages from people who found a new path at CREI.",
          cta: "Leave your message",
          seeAll: "See all messages",
          empty: "Be the first to leave a message of love.",
        }
      : {
          badge: "Muro de Amor",
          title: "Muro de Amor",
          subtitle: "Mensajes reales de personas que encontraron un nuevo camino en CREI.",
          cta: "Dejar mi mensaje",
          seeAll: "Ver todos los mensajes",
          empty: "Sé el primero en dejar un mensaje de amor.",
        };

  useEffect(() => {
    const load = async () => {
      const { data } = await sb
        .from("agradecimientos")
        .select("*")
        .eq("aprobado", true)
        .order("destacado", { ascending: false })
        .order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, []);

  // Dividir en dos filas
  const fila1 = items.filter((_, i) => i % 2 === 0);
  const fila2 = items.filter((_, i) => i % 2 !== 0);

  return (
    <>
      {/* Keyframes de animación */}
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <section id="muro-de-amor" className="py-24 relative overflow-hidden">
        {/* Orbs de fondo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,92,191,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          {/* Encabezado */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center px-6 mb-14"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
              style={{
                background: "rgba(124,92,191,0.15)",
                border: "1px solid rgba(124,92,191,0.35)",
                color: "#c4b5fd",
              }}
            >
              <Heart className="w-4 h-4 fill-current" />
              {copy.badge}
            </div>
            <h2
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={{ color: "#fbfaff" }}
            >
              {copy.title}
            </h2>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(196,181,253,0.75)" }}
            >
              {copy.subtitle}
            </p>
          </motion.div>

          {/* Burbujas */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div
                className="w-10 h-10 rounded-full border-4 animate-spin"
                style={{ borderColor: "#7c5cbf", borderTopColor: "transparent" }}
              />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 px-6">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: "#c4b5fd" }} />
              <p className="opacity-50 mb-8" style={{ color: "#c4b5fd" }}>{copy.empty}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Fila 1: izquierda */}
              {fila1.length > 0 && (
                <FilaInfinita items={fila1} direction="left" speed={35} />
              )}
              {/* Fila 2: derecha */}
              {fila2.length > 0 && (
                <FilaInfinita items={fila2} direction="right" speed={30} />
              )}
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 px-6"
          >
            <Link
              href={`/${lang}/agradecimientos`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#7c5cbf,#a855f7)",
                color: "#fff",
                boxShadow: "0 0 24px rgba(124,92,191,0.4)",
              }}
            >
              <Heart className="w-4 h-4 fill-current" />
              {copy.cta}
            </Link>
            <Link
              href={`/${lang}/agradecimientos`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-105"
              style={{
                background: "rgba(124,92,191,0.1)",
                border: "1px solid rgba(124,92,191,0.3)",
                color: "#c4b5fd",
              }}
            >
              <Send className="w-4 h-4" />
              {copy.seeAll}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
