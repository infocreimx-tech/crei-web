"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, User, ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import type { Locale } from "@/i18n/messages";
import { useI18n } from "@/i18n/I18nProvider";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PortalRegister({ lang }: { lang: Locale }) {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = getSupabase();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 1. Validar si el correo ya existe sin hacer la petición grande a auth
      const { data: emailExists, error: rpcError } = await supabase.rpc("check_email_exists", { 
        correo: formData.email 
      });

      if (emailExists) {
        setErrorMessage("Este correo ya está registrado en el portal. Por favor, intenta iniciar sesión.");
        setIsLoading(false);
        return;
      }

      // 2. Si no existe, procedemos a registrar al paciente
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            telefono: formData.telefono,
          },
          emailRedirectTo: `${window.location.origin}/${lang}/portal/confirmado`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("¡Registro exitoso! Por favor, verifica tu correo (o inicia sesión si no se requiere confirmación).");
        setTimeout(() => {
          router.push(`/${lang}/portal`);
        }, 3000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error inesperado al registrar el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginHref = `/${lang}/portal`;
  const homeHref = `/${lang}`;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-primary relative overflow-hidden items-center justify-center p-12 text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1920&auto=format&fit=crop"
            alt="Registro en Portal del Paciente"
            fill
            className="object-cover opacity-60 mix-blend-multiply"
            priority
          />
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-md text-center md:text-left">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("portal.backToHome")}
          </Link>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Crear Cuenta</h1>
          <p className="text-lg opacity-90 leading-relaxed">Únete a CREI para ver tu historial, solicitar citas y continuar de manera integral tu acompañamiento.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <div className="absolute top-6 left-6 md:hidden">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("portal.backToHome")}
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8 mt-10 md:mt-0 pb-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-primary">Regístrate</h2>
            <p className="mt-2 text-muted-foreground">Llena los datos para acceder a tu perfil paciente.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary/80" htmlFor="nombre">Nombre(s)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-muted/30 border border-border rounded-lg pl-9 pr-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary/80" htmlFor="apellidos">Apellidos</label>
                <div className="relative">
                  <input
                    id="apellidos"
                    type="text"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    placeholder="Tus apellidos"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80" htmlFor="telefono">Teléfono / Celular</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="telefono"
                  type="text"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-muted/30 border border-border rounded-lg pl-9 pr-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="Ej: 55 1234 5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80" htmlFor="email">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-muted/30 border border-border rounded-lg pl-9 pr-4 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder={t("portal.emailPlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary/80" htmlFor="password">Contraseña</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-muted/30 border border-border rounded-lg pl-9 pr-10 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}
            
            {successMessage && (
              <div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          <div className="pt-6 text-center border-t border-border mt-6">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href={loginHref} className="text-primary font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
