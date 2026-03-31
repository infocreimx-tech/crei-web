"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

interface JournalProps {
  articles: any[];
}

export default function Journal({ articles }: JournalProps) {
  const { lang } = useI18n();
  const copy =
    lang === "en"
      ? {
          label: "Blog",
          title: "Restructuring Journal",
          subtitle: "Clinical insights, practical tools, and reflections on modern mental health.",
          all: "View all articles",
          read: "Read article",
          banner1Badge: "New Release",
          banner1Title: "The Way Out Is Within",
          banner1Desc: "Yes, you need structure. Yes, you need community. But you can also reclaim your life with fire, with ice, with energy and purpose. Discover the new manifesto by Fer Núñez.",
          banner1Cta: "Read Full Manifesto",
          banner2Badge: "Exclusive New eBook",
          banner2Title: "Nobody Taught You How to Help",
          banner2Desc: "This eBook is for you. For those who love with everything but don't know how to help without sinking. A direct and urgent guide for parents and families.",
          banner2Cta: "Read the Full Guide",
        }
      : {
          label: "Blog",
          title: "Diario de Reestructuración",
          subtitle: "Pensamientos clínicos, herramientas prácticas y reflexiones sobre la salud mental moderna.",
          all: "Ver todos los artículos",
          read: "Leer artículo",
          banner1Badge: "Nuevo Lanzamiento",
          banner1Title: "La salida es hacia adentro",
          banner1Desc: "Sí, necesitas estructura. Sí, necesitas grupo. Pero también puedes recuperar tu vida con fuego, con hielo, con energía y propósito. Descubre el nuevo manifiesto de Fer Núñez.",
          banner1Cta: "Ver Manifiesto Completo",
          banner2Badge: "Nuevo Ebook Exclusivo",
          banner2Title: "Nadie Te Enseñó A Ayudar",
          banner2Desc: "Este eBook es para ti. Para los que aman con todo pero no saben cómo ayudar sin hundirse. Una guía directa y urgente para padres y familiares.",
          banner2Cta: "Ver Guía Completa",
        };

  return (
    <section className="py-32 bg-secondary/20">
      <div className="container mx-auto px-6">
        {/* EBOOK CAROUSEL CTA NUEVO */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 mb-16 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          
          {/* Banner 1: La salida es hacia adentro */}
          <div className="snap-center shrink-0 w-full min-w-full md:min-w-0 md:w-full bg-primary text-secondary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
            
            <div className="relative z-10 max-w-2xl">
              <span className="text-accent font-medium tracking-widest uppercase text-sm mb-3 block">{copy.banner1Badge}</span>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{copy.banner1Title}</h3>
              <p className="text-white/80 text-lg mb-8 max-w-xl">
                {copy.banner1Desc}
              </p>
              <Link href={`/${lang}/ebook/la-salida`} className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-xl">
                <BookOpen className="w-5 h-5" />
                {copy.banner1Cta}
              </Link>
            </div>
            
            <div className="relative z-10 hidden md:block w-48 h-64 shadow-2xl rounded-sm overflow-hidden transform group-hover:-rotate-3 transition-transform duration-500">
              <Image src="/blog/eeboock.jpeg" alt="Ebook Cover" fill className="object-cover bg-stone-100" />
            </div>
          </div>

          {/* Banner 2: Nadie te enseñó a ayudar */}
          <div className="snap-center shrink-0 w-full min-w-full md:min-w-0 md:w-full bg-stone-900 text-stone-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517486808906-6caae5fbbb14?q=80&w=2000')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/90 to-transparent" />
            
            <div className="relative z-10 max-w-2xl">
              <span className="text-stone-400 font-medium tracking-widest uppercase text-sm mb-3 block">{copy.banner2Badge}</span>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">{copy.banner2Title}</h3>
              <p className="text-white/80 text-lg mb-8 max-w-xl">
                {copy.banner2Desc}
              </p>
              <Link href={`/${lang}/ebook/nadie-te-enseno`} className="inline-flex items-center gap-2 bg-stone-700 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-600 transition-transform hover:scale-105 active:scale-95 shadow-xl border border-stone-500">
                <BookOpen className="w-5 h-5" />
                {copy.banner2Cta}
              </Link>
            </div>
            
            <div className="relative z-10 hidden md:block w-48 h-64 shadow-2xl rounded-sm overflow-hidden transform group-hover:rotate-3 transition-transform duration-500">
              <Image src="/blog/nadie-1.jpg" alt="Ayudar Ebook Cover" fill className="object-cover bg-stone-100" />
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-accent font-medium tracking-widest uppercase text-sm mb-2 block">
              {copy.label}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <Link href={`/${lang}/blog/${article.slug}`} key={article.slug} className="group cursor-pointer flex flex-col h-full">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                <div className="relative h-64 w-full overflow-hidden rounded-2xl mb-6">
                  <Image
                    src={article.image || "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-primary">
                    {article.category}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <BookOpen className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-tight">
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary border-b border-primary/20 pb-1 group-hover:border-accent group-hover:text-accent transition-all">
                      {copy.read}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
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
