"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface JournalProps {
  articles: any[];
}

export default function Journal({ articles }: JournalProps) {
  const { lang } = useI18n();
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [dbStats, setDbStats] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch('/api/reactions')
      .then(res => res.json())
      .then(data => {
        if (data.data) setDbStats(data.data);
      })
      .catch(err => console.error("Error fetching exact reactions:", err));
  }, []);

  const toggleReaction = async (slug: string, emoji: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    // Si ya le dio a este mismo, solo lo quitamos visualmente
    if (reactions[slug] === emoji) {
       setReactions((prev) => { const n = {...prev}; delete n[slug]; return n; });
       return;
    }

    setReactions((prev) => ({ ...prev, [slug]: emoji }));

    try {
      await fetch('/api/reactions', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ slug, emoji })
      });
      // Volver a jalar para tener el recuento exacto actualizado
      const res = await fetch('/api/reactions');
      const data = await res.json();
      if (data.data) setDbStats(data.data);
    } catch(err) {
      console.error("No se pudo guardar la reacción", err);
    }
  };

  const copy =
    lang === "en"
      ? {
          label: "Blog",
          title: "Blog",
          subtitle: "Clinical insights, practical tools, and reflections on modern mental health.",
          all: "View all messages",
          read: "Read completely",
        }
      : {
          label: "Blog",
          title: "Blog",
          subtitle: "Pensamientos clínicos, herramientas prácticas y reflexiones sobre la salud mental moderna.",
          all: "Ver más mensajes",
          read: "Leer artículo",
        };

  return (
    <section className="py-32 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-accent font-medium tracking-widest uppercase text-sm mb-2 block">
              {copy.label}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary flex items-center gap-3">
              {copy.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {copy.subtitle}
            </p>
          </div>
          <Link
            href={`/${lang}/blog`}
            className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors group"
          >
            {copy.all}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* WhatsApp Chat Layout container */}
        <div className="max-w-3xl mx-auto bg-[#0b141a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
          
          {/* Chat Header */}
          <div className="bg-[#202c33] px-6 py-4 flex items-center gap-4 border-b border-white/5 sticky top-0 z-20">
            <div className="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
              <svg viewBox="0 0 24 24" width="24" height="24" className="text-white fill-current" opacity="0.9">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-[#e9edef] font-semibold text-lg leading-tight">CREI Blog</h3>
              <p className="text-[#8696a0] text-xs">tap here for group info</p>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="p-4 sm:p-6 space-y-6 bg-[#0b141a] relative min-h-[500px]">
            {/* Background texture optional - solid is fine for darkmode UI */}
            
            <div className="relative z-10 space-y-8">
              {articles.map((article, index) => {
                const isSent = index % 2 !== 0;

                // Contabilidad de Base de Datos
                const stats = dbStats[article.slug] || { reaction_love: 0, reaction_like: 0, reaction_laugh: 0 };
                const userLocal = reactions[article.slug];
                
                // Determinar el emoji más popular de este artículo conteo exacto
                let maxEmoji = '❤️';
                let maxCount = stats.reaction_love || 0;
                
                if ((stats.reaction_like || 0) > maxCount) {
                   maxCount = stats.reaction_like;
                   maxEmoji = '👍';
                }
                if ((stats.reaction_laugh || 0) > maxCount) {
                   maxCount = stats.reaction_laugh;
                   maxEmoji = '😂';
                }

                // Override visual optimista
                let activeEmoji = userLocal || (maxCount > 0 ? maxEmoji : '❤️');
                let displayCount = maxCount;
                if (userLocal && maxCount === 0) displayCount = 1;

                const shoulDisplayCounter = displayCount > 0;

                return (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`relative w-[90%] sm:w-[75%] p-2 rounded-2xl group/bubble ${
                        isSent 
                          ? 'bg-[#005c4b] rounded-tr-sm text-white' 
                          : 'bg-[#202c33] rounded-tl-sm text-[#e9edef]'
                      } shadow-sm`}
                    >
                      {/* Sender name for received messages */}
                      {!isSent && (
                        <div className="text-[#53bdeb] text-sm font-semibold px-2 pt-1 mb-1">
                          {article.author || "~ Dr. Fer Núñez"}
                        </div>
                      )}

                      <Link href={`/${lang}/blog/${article.slug}`} className="block group">
                        {/* Image Attachment */}
                        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-2">
                          <Image
                            src={article.image || "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop"}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          <div className="absolute flex items-center justify-center inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-full">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Article Text Content */}
                        <div className="px-2 pb-1">
                          <h4 className="font-bold text-base leading-tight mb-2 group-hover:text-white/80 transition-colors text-white">
                            {article.title}
                          </h4>
                          <p className={`text-sm leading-snug mb-3 line-clamp-3 ${isSent ? 'text-[#e9edef]/90' : 'text-[#8696a0]'}`}>
                            {article.excerpt}
                          </p>
                          
                          {/* Timestamp and status */}
                          <div className="flex items-center justify-end gap-1.5 mt-1 float-right">
                            <span className="text-[10px] text-white/50">{article.readTime}</span>
                            {isSent && (
                              <svg viewBox="0 0 16 15" width="16" height="15" className="text-[#53bdeb] fill-current">
                                <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                              </svg>
                            )}
                          </div>
                          <div className="clear-both"></div>
                        </div>
                      </Link>

                      {/* Interactive Reactions Menu */}
                      <div className={`absolute -bottom-3 ${isSent ? 'left-4' : 'right-4'} flex flex-row-reverse gap-1 bg-[#182229] border border-white/10 rounded-full px-2 py-0.5 shadow-sm opacity-0 group-hover/bubble:opacity-100 transition-opacity z-20`}>
                        {['😂', '👍', '❤️'].map(emoji => (
                          <button 
                            key={emoji}
                            onClick={(e) => toggleReaction(article.slug, emoji, e)}
                            className={`text-sm hover:scale-125 transition-transform ${reactions[article.slug] === emoji ? 'bg-white/20 rounded-full scale-110' : ''}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      {/* Active Reaction Exact Display - Solo si > 0 */}
                      {shoulDisplayCounter && (
                        <div className={`absolute -bottom-3 ${isSent ? 'left-2' : 'right-2'} bg-[#202c33] border border-white/10 rounded-full px-1.5 py-0.5 shadow-md text-[11px] z-10 flex items-center gap-1 group/reaction`}>
                          <span className="leading-none">{activeEmoji}</span>
                          <span className={`font-semibold leading-none ${userLocal ? 'text-[#00a884]' : 'text-[#8696a0]'}`}>
                             {displayCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Chat Input Area (Mock) */}
          <div className="bg-[#202c33] px-3 sm:px-4 py-3 flex items-center gap-3 border-t border-white/5">
            <button className="text-[#8696a0] hover:text-white p-2 shrink-0">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.349 8.469 4.35v7.061c0 2.001 1.53 3.531 3.531 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z" />
              </svg>
            </button>
            <div className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2.5 text-[#8696a0] text-sm">
              {lang === 'en' ? 'Type a message...' : 'Escribe un mensaje...'}
            </div>
            <button className="text-[#00a884] hover:text-[#00c99f] p-2 shrink-0">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors"
          >
            {copy.all}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
