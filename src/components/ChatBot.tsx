 "use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Info, Search } from "lucide-react";
import Link from "next/link";
import { getServiceCategories } from "./Services";
import { useI18n } from "@/i18n/I18nProvider";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function matchPlans(query: string, categories: ReturnType<typeof getServiceCategories>) {
  const q = query.toLowerCase();
  const results: Array<{ category: string; item: string; desc: string }> = [];
  for (const cat of categories) {
    const catMatch =
      cat.title.toLowerCase().includes(q) || cat.subtitle.toLowerCase().includes(q);
    for (const it of cat.items) {
      const itemMatch =
        it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q) || catMatch;
      if (itemMatch) {
        results.push({ category: cat.title, item: it.title, desc: it.desc });
      }
    }
  }
  return results;
}

function buildAnswer(
  query: string,
  categories: ReturnType<typeof getServiceCategories>,
  lang: "es" | "en"
) {
  const hits = matchPlans(query, categories);
  if (hits.length === 0) {
    const all = categories
      .map(
        (c) =>
          `• ${c.title}: ${c.items.map((i) => i.title).join(", ")}`
      )
      .join("\n");
    return [
      lang === "en"
        ? "I couldn't find an exact match. Here's an overview of our plans and services:"
        : "No encontré coincidencias exactas. Aquí tienes un panorama de nuestros planes y servicios:",
      all,
      lang === "en"
        ? "You can ask, for example: “addiction”, “individual therapy”, “assessment”, “coaching”."
        : "Puedes preguntar por ejemplo: “adicciones”, “psicoterapia individual”, “diagnóstico”, “coaching ejecutivo”."
    ].join("\n");
  }
  const grouped = hits.reduce<Record<string, Array<{ item: string; desc: string }>>>((acc, h) => {
    acc[h.category] ||= [];
    acc[h.category].push({ item: h.item, desc: h.desc });
    return acc;
  }, {});
  const parts: string[] = [
    lang === "en" ? "These options match your query:" : "Estas opciones coinciden con tu consulta:"
  ];
  for (const [cat, items] of Object.entries(grouped)) {
    parts.push(`\n${cat}:`);
    for (const it of items) {
      parts.push(`- ${it.item}: ${it.desc}`);
    }
  }
  parts.push(
    lang === "en"
      ? "\nDo you want to schedule an initial evaluation? I can take you to WhatsApp for immediate support."
      : "\n¿Quieres agendar una evaluación inicial? Puedo llevarte a WhatsApp para atención inmediata."
  );
  return parts.join("\n");
}

export default function ChatBot() {
  const { lang } = useI18n();
  const categories = useMemo(() => getServiceCategories(lang), [lang]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content:
        lang === "en"
          ? "Hi, I'm the CREI assistant. Ask about any plan or service: addiction, therapy, assessment, couples, coaching."
          : "Hola, soy el asistente CREI. Pregunta por cualquier plan o servicio: adicciones, psicoterapia, diagnóstico, pareja, coaching.",
    },
  ]);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const quickQueries = useMemo(
    () =>
      lang === "en"
        ? ["Addiction", "Individual therapy", "Assessment", "Couples therapy", "Coaching"]
        : ["Adicciones", "Psicoterapia Individual", "Diagnóstico", "Terapia de Pareja", "Coaching Ejecutivo"],
    [lang]
  );

  function send(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const answer = buildAnswer(trimmed, categories, lang);
    const botMsg: ChatMessage = { role: "assistant", content: answer };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence initial={false}>
        {!open && (
          <motion.button
            key="chat-launcher"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setOpen(true)}
            aria-label={lang === "en" ? "Open plan assistant" : "Abrir asistente de planes"}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <MessageSquare className="w-5 h-5" />
            {lang === "en" ? "Plan info" : "Informes de planes"}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-[360px] sm:w-[420px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
              <div className="flex items-center gap-2 text-primary">
                <Info className="w-5 h-5" />
                <span className="font-semibold">{lang === "en" ? "CREI Assistant" : "Asistente CREI"}</span>
              </div>
              <button
                className="text-muted-foreground hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
                onClick={() => setOpen(false)}
                aria-label={lang === "en" ? "Close assistant" : "Cerrar asistente"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 h-[380px] overflow-y-auto space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "assistant" ? "text-sm text-primary" : "text-sm text-muted-foreground"}
                >
                  {m.role === "assistant" ? "CREI:" : lang === "en" ? "You:" : "Tú:"}{" "}
                  <span className="whitespace-pre-line">{m.content}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickQueries.map((q) => (
                  <button
                    key={q}
                    className="px-3 py-1.5 text-xs bg-muted text-primary rounded-full hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => send(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    placeholder={lang === "en" ? "Ask about a plan or service…" : "Pregunta por un plan o servicio…"}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                <button
                  onClick={() => send(input)}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={lang === "en" ? "Send" : "Enviar"}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                {lang === "en" ? "Immediate support:" : "Atención inmediata:"}
                <Link
                  href={
                    lang === "en"
                      ? "https://wa.me/525530412552?text=Hi%20CREI%2C%20I%27d%20like%20info%20about%20your%20plans"
                      : "https://wa.me/525530412552?text=Hola%20CREI%2C%20quiero%20informes%20sobre%20planes"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-primary"
                  aria-label={lang === "en" ? "Open WhatsApp for information" : "Abrir WhatsApp para informes"}
                >
                  WhatsApp
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
