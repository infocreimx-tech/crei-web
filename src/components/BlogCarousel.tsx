"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

interface BlogCarouselProps {
  articles: any[];
}

export default function BlogCarousel({ articles }: BlogCarouselProps) {
  const { lang } = useI18n();
  const copy =
    lang === "en"
      ? {
          label: "Community",
          title: "Our Latest Articles",
          read: "Read article",
        }
      : {
          label: "Comunidad",
          title: "Nuestros Últimos Artículos",
          read: "Leer artículo",
        };

  return (
    <section className="py-24 bg-[#1a0f2e] border-b border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg font-bold tracking-widest uppercase text-accent block mb-4"
          >
            {copy.label}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-white"
          >
            {copy.title}
          </motion.h2>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {articles.map((article, index) => (
            <div key={article.slug} className="snap-center shrink-0 w-[85vw] md:w-[400px]">
              <Link href={`/${lang}/blog/${article.slug}`} className="group cursor-pointer flex flex-col h-full">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-accent/30 transition-colors"
                >
                  <div className="relative h-56 w-full overflow-hidden rounded-2xl mb-6">
                    <Image
                      src={article.image || "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop"}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[#0e0720]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                      {article.category}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                      <BookOpen className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-accent transition-colors leading-tight">
                      {article.title}
                    </h3>

                    <p className="text-white/60 text-sm mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white border-b border-white/20 pb-1 group-hover:border-accent group-hover:text-accent transition-all">
                        {copy.read}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
