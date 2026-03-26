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
          read: "Read article"
        }
      : {
          label: "Blog",
          title: "Diario de Reestructuración",
          subtitle: "Pensamientos clínicos, herramientas prácticas y reflexiones sobre la salud mental moderna.",
          all: "Ver todos los artículos",
          read: "Leer artículo"
        };

  return (
    <section className="py-32 bg-secondary/20">
      <div className="container mx-auto px-6">
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
