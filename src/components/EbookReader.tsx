"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

export interface EbookPage {
  id: number;
  type: "text" | "image" | "cover" | "cta";
  content?: React.ReactNode;
  imageUrl?: string;
}

interface EbookReaderProps {
  pages: EbookPage[];
}

export default function EbookReader({ pages }: EbookReaderProps) {
  const { lang } = useI18n();
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => {
    if (currentPage < pages.length - 1) setCurrentPage((p) => p + 1);
  };
  const prev = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  };

  const page = pages[currentPage];

  return (
    <div className="fixed inset-0 bg-[#f4ebd0] md:bg-[#1a1a1a] flex items-center justify-center z-[100] p-4 md:p-8">
      {/* Close button */}
      <Link
        href={`/${lang}/blog`}
        className="absolute top-6 right-6 z-50 text-stone-600 md:text-white/70 hover:text-stone-900 md:hover:text-white transition-colors bg-white/50 md:bg-white/10 p-2 rounded-full backdrop-blur-md"
      >
        <X className="w-6 h-6" />
      </Link>

      <div className="relative w-full max-w-2xl h-[85vh] md:h-[80vh] bg-[#fdfbf7] shadow-2xl rounded-sm overflow-hidden flex flex-col">
        {/* Book spine simulation on desktop */}
        <div className="hidden md:block absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-black/10 to-transparent z-10 pointer-events-none" />

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 p-8 md:p-12 overflow-y-auto block pb-24"
            >
              {page.type === "cover" && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  {page.imageUrl && (
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-8 shadow-md">
                      <Image
                        src={page.imageUrl}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {page.content}
                </div>
              )}

              {page.type === "text" && (
                <div className="prose prose-lg mx-auto text-stone-800 font-serif leading-relaxed">
                  {page.content}
                </div>
              )}

              {page.type === "image" && page.imageUrl && (
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-full h-full max-h-[60vh] rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={page.imageUrl}
                      alt={`Page ${currentPage}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {page.type === "cta" && (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                  {page.content}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Bar */}
        <div className="h-16 shrink-0 border-t border-stone-200 bg-[#fdfbf7] flex items-center justify-between px-6 z-20">
          <button
            onClick={prev}
            disabled={currentPage === 0}
            className="p-2 text-stone-500 hover:text-stone-900 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span className="font-serif text-sm text-stone-400">
            {currentPage + 1} / {pages.length}
          </span>

          <button
            onClick={next}
            disabled={currentPage === pages.length - 1}
            className="p-2 text-stone-500 hover:text-stone-900 disabled:opacity-30 transition-colors"
            style={{ touchAction: "manipulation" }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
