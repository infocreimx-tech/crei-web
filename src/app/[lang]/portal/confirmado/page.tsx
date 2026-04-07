"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/messages";

export default function ConfirmadoPage({ params: { lang } }: { params: { lang: Locale } }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-10 text-center relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logotipo%20CREI%20blanco-U70Ym6V1Xq6a1MhK4ZINnORsCjNsqg.png"
            alt="CREI Logo"
            width={120}
            height={45}
            className="h-10 w-auto opacity-90"
          />
        </div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3, damping: 12, stiffness: 100 }}
          className="flex justify-center mb-8"
        >
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-serif font-bold text-primary mb-4">
          Identidad Verificada
        </h1>
        
        <p className="text-muted-foreground mb-10 leading-relaxed text-sm">
          Tu correo electrónico ha sido autenticado exitosamente. Ahora tienes acceso completo a tu perfil clínico y a tus herramientas de recuperación.
        </p>

        <Link href={`/${lang}/portal`} className="inline-flex w-full">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
          >
            Ingresar al Portal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
