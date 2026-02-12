"use client";

import Image from "next/image";

export default function Team() {
  const leader = {
    name: "Fernando Nuñez",
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
              Nuestro Equipo de Expertos:
            </h2>
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                Fernando Núñez es líder y un reconocido psicólogo mexicano cuya trayectoria destaca por
                transformar una historia personal de adversidad extrema en un motor de ayuda para otros.
                Tras superar años de adicción y haber pasado por el sistema penitenciario, decidió
                profesionalizarse para combatir esta problemática.
              </p>
              <p className="font-semibold text-primary">Trayectoria y Enfoque Profesional</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Especialización en Adicciones:</span> Se formó como psicólogo
                  con un enfoque humanista y basado en evidencia. Es el director del Centro de Reestructuración
                  Emocional Integral (CREI), donde lidera procesos de rehabilitación y acompañamiento emocional.
                </li>
                <li>
                  <span className="font-medium">Conferencista Motivacional:</span> Participa activamente en foros
                  de prevención, como el Festival Sejuve y conferencias tituladas “En la mente de un adicto”,
                  donde comparte su testimonio para sensibilizar a familias y jóvenes.
                </li>
                <li>
                  <span className="font-medium">Presencia en Medios:</span> Su historia de superación ha ganado
                  relevancia en medios como TV Azteca y Milenio, donde expone la importancia de la salud mental
                  y la reinserción social.
                </li>
                <li>
                  <span className="font-medium">Autor:</span> Ha publicado obras bajo un enfoque psicológico
                  sobre temas de relaciones y comportamiento, incluyendo títulos como “Cerebro, selección y cosas
                  de pareja”.
                </li>
              </ul>
              <p>
                Su labor actual se centra en desmitificar el “tocar fondo” y proveer herramientas prácticas para
                que las personas recuperen su autonomía y bienestar emocional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
