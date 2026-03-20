import PreexpedienteForm from "@/components/PreexpedienteForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preexpediente | CREI",
  description: "Formulario de preingreso para terapeutas CREI. Registra los datos iniciales del paciente de forma segura.",
  robots: { index: false, follow: false },
};

export default function PreexpedientePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-14 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          {/* Badge */}
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Uso interno — Terapeutas CREI
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 leading-tight">
            Gestión de Preexpediente
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Completa la información inicial del paciente. Los datos se almacenan de forma segura y quedan disponibles para el equipo clínico.
          </p>
        </div>

        <PreexpedienteForm />

      </div>
    </main>
  );
}
