"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

export default function Team() {
  const { lang } = useI18n();
  const leader = {
    name: "Fernando Núñez",
    role: "Psicólogo",
    image: "/equipo-lider.jpeg",
    intro:
      "Está liderado por Fernando Nuñez, el es psicólogo. Fernando pasó por una etapa de profunda crisis personal que incluyó 45 internamientos, tiempo en prisión y vivir en situación de calle debido a las adicciones. Su fundación ha brindado ayuda gratuita a miles de familias que enfrentan problemas de codependencia y consumo de sustancias.",
  };

  const copy =
    lang === "en"
      ? {
          imageAlt: "Team leader",
          title: "Who is Fernando Núñez?",
          p1: "Fernando Núñez is a prominent Mexican psychologist and thought leader, recognized for turning deep crises into models for clinical and social intervention. After overcoming a period of personal adversity, he professionalized his experience to become a reference in the treatment of high-risk behaviors and social reintegration.",
          sectionTitle: "Professional Background & Approach",
          li1Title: "Addiction Specialization:",
          li1Body:
            " Founder of the Comprehensive Emotional Restructuring Center (CREI). With a humanistic, evidence-based approach, Fernando leads high-complexity rehabilitation and clinical support strategies, transforming treatment models into real-life solutions.",
          li2Title: "Media Presence:",
          li2Body:
            " A thought leader consulted by national platforms such as TV Azteca and Milenio. His work focuses on demystifying addiction and placing mental health at the center of public conversation and social reform.",
          li3Title: "Speaker & Author:",
          li3Body:
            " Featured speaker in national prevention forums such as Festival Sejuve. His speaking work spans multiple platforms in Mexico, sharing high-impact strategies on resilience and mental health.",
          p2:
            'His work focuses on demystifying the idea of "hitting rock bottom" through practical tools that restore autonomy, functionality, and a sense of purpose.'
        }
      : {
          imageAlt: "Líder del equipo",
          title: "¿Quién es Fernando Núñez?",
          p1: "Fernando Núñez es un destacado psicólogo y líder de opinión mexicano, reconocido por su capacidad para transformar crisis profundas en modelos de intervención clínica y social. Tras superar un proceso de adversidad personal, profesionalizó su experiencia para convertirse en un referente en el tratamiento de conductas de riesgo y reinserción social.",
          sectionTitle: "Trayectoria y Enfoque Profesional",
          li1Title: "Especialización en Adicciones:",
          li1Body:
            " Fundador del Centro de Reestructuración Emocional Integral (CREI). Bajo un enfoque humanista y basado en evidencia, Fernando lidera estrategias de rehabilitación y acompañamiento clínico de alta complejidad, transformando modelos de tratamiento en soluciones de vida.",
          li2Title: "Presencia en Medios:",
          li2Body:
            " Líder de opinión consultado por plataformas nacionales como TV Azteca y Milenio. Su labor mediática se centra en desmitificar las adicciones y colocar la salud mental en el centro de la conversación pública y la reforma social.",
          li3Title: "Conferencista y Autor:",
          li3Body:
            " Ponente destacado en foros de prevención nacional como el Festival Sejuve. Su trayectoria como conferencista abarca diversas plataformas en México, donde comparte estrategias de alto impacto sobre resiliencia y salud mental.",
          p2:
            "Su labor se enfoca en desmitificar el concepto de “tocar fondo”, por herramientas prácticas que devuelvan la autonomía, la funcionalidad y el propósito de vida a las personas."
        };

  return (
    <section id="equipo" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="w-full mx-auto max-w-[360px] md:max-w-[420px]">
            <Image
              src={leader.image}
              alt={copy.imageAlt}
              width={900}
              height={675}
              className="w-full h-auto rounded-2xl border border-border shadow-lg object-cover object-center"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              {copy.title}
            </h2>
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                {copy.p1}
              </p>
              <p className="font-semibold text-primary">{copy.sectionTitle}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">{copy.li1Title}</span>
                  {copy.li1Body}
                </li>
                <li>
                  <span className="font-medium">{copy.li2Title}</span>
                  {copy.li2Body}
                </li>
                <li>
                  <span className="font-medium">{copy.li3Title}</span>
                  {copy.li3Body}
                </li>
              </ul>
              <p>
                {copy.p2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
