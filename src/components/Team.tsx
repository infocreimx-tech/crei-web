"use client";

import Image from "next/image";

export default function Team() {
  const leader = {
    name: "Fernando Núñez",
    role: "Psicólogo",
    image: "/equipo-lider.jpeg",
    intro:
      "Está liderado por Fernando Nuñez, el es psicólogo. Fernando pasó por una etapa de profunda crisis personal que incluyó 45 internamientos, tiempo en prisión y vivir en situación de calle debido a las adicciones. Su fundación ha brindado ayuda gratuita a miles de familias que enfrentan problemas de codependencia y consumo de sustancias.",
  };

  return (
    <section id="equipo" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="w-full mx-auto max-w-[360px] md:max-w-[420px]">
            <Image
              src={leader.image}
              alt="Líder del equipo"
              width={900}
              height={675}
              className="w-full h-auto rounded-2xl border border-border shadow-lg object-cover object-center"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              ¿Quién es Fernando Núñez?
            </h2>
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                Fernando Núñez es un destacado psicólogo y líder de opinión mexicano, reconocido por su
                capacidad para transformar crisis profundas en modelos de intervención clínica y social. Tras
                superar un proceso de adversidad personal, profesionalizó su experiencia para convertirse en un
                referente en el tratamiento de conductas de riesgo y reinserción social.
              </p>
              <p className="font-semibold text-primary">Trayectoria y Enfoque Profesional</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Especialización en Adicciones:</span> Fundador del Centro de
                  Reestructuración Emocional Integral (CREI). Bajo un enfoque humanista y basado en evidencia,
                  Fernando lidera estrategias de rehabilitación y acompañamiento clínico de alta complejidad,
                  transformando modelos de tratamiento en soluciones de vida.
                </li>
                <li>
                  <span className="font-medium">Presencia en Medios:</span> Líder de opinión consultado por
                  plataformas nacionales como TV Azteca y Milenio. Su labor mediática se centra en desmitificar
                  las adicciones y colocar la salud mental en el centro de la conversación pública y la reforma
                  social.
                </li>
                <li>
                  <span className="font-medium">Conferencista y Autor:</span> Ponente destacado en foros de
                  prevención nacional como el Festival Sejuve. Su trayectoria como conferencista abarca diversas
                  plataformas en México, donde comparte estrategias de alto impacto sobre resiliencia y salud
                  mental.
                </li>
              </ul>
              <p>
                Su labor se enfoca en desmitificar el concepto de “tocar fondo”, por herramientas prácticas que
                devuelvan la autonomía, la funcionalidad y el propósito de vida a las personas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
