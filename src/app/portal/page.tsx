"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";

export default function PortalLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      // Here you would handle the actual login logic
      alert("Funcionalidad de login simulada");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Side - Image/Brand */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-primary relative overflow-hidden items-center justify-center p-12 text-primary-foreground">
        {/* Background Image using Next.js Image for optimization */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?q=80&w=1920&auto=format&fit=crop"
            alt="Consultorio de terapia cálido y profesional"
            fill
            className="object-cover opacity-60 mix-blend-multiply"
            priority
          />
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-md text-center md:text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-8 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Portal del Paciente</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Accede a tu historial, gestiona tus citas y mantén comunicación directa con tu especialista en un entorno seguro y confidencial.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-6 left-6 md:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-primary">Bienvenido de nuevo</h2>
            <p className="mt-2 text-muted-foreground">Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80" htmlFor="email">
                Correo Electrónico o ID de Paciente
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="text"
                  required
                  className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="ej. paciente@crei.mx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary/80" htmlFor="password">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-primary font-medium hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-12 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="pt-6 text-center border-t border-border">
            <p className="text-sm text-muted-foreground">
              ¿Es tu primera vez?{" "}
              <Link href="/#contacto" className="text-primary font-medium hover:underline">
                Contacta a administración
              </Link>{" "}
              para activar tu cuenta.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
