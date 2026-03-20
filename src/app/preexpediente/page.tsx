import PreexpedienteForm from "@/components/PreexpedienteForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preexpediente | CREI",
  description: "Formulario de preingreso y preexpediente para terapeutas.",
};

export default function PreexpedientePage() {
  return (
    <main className="min-h-screen bg-muted/20 py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Gestión de Preexpediente
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Completa la siguiente información inicial para abrir el perfil del paciente. Asegúrate de incluir la mayor cantidad de detalles posible.
          </p>
        </div>
        
        <PreexpedienteForm />
      </div>
    </main>
  );
}
