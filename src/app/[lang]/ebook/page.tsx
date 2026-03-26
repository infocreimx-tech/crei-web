"use client";

import EbookReader, { EbookPage } from "@/components/EbookReader";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";
import Image from "next/image";

export default function EbookPageContainer() {
  const { lang } = useI18n();

  const pages: EbookPage[] = [
    {
      id: 1,
      type: "text",
      content: (
        <div className="flex flex-col h-full justify-center">
          <div className="text-center mb-8">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
              Manifiesto
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              La salida es hacia adentro
            </h1>
            <p className="text-xl text-stone-500 italic font-serif">— Fer Núñez</p>
          </div>
          <div className="space-y-6 text-stone-700 text-lg leading-relaxed text-center">
            <p>
              Sí, necesitas estructura. Sí, necesitas grupo, terapia y guía profesional.
            </p>
            <p className="font-bold text-stone-900 text-xl">
              Pero también puedes recuperar tu vida con fuego, con hielo, con energía y propósito.
            </p>
            <p>
              Esto no se trata solo de dejar de consumir. Se trata de despertar. De volver a sentir. De recuperar tu poder.
            </p>
          </div>
          <div className="mt-8 relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-lg">
            <Image src="/blog/eeboock.jpeg" alt="Hielo y Fuego" fill className="object-cover" />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      type: "text",
      content: (
        <div className="flex flex-col h-full justify-center space-y-6">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4 border-l-4 border-accent pl-4">
            Sanar Más Allá de lo Clásico
          </h2>
          <div className="space-y-4 text-stone-700 text-lg leading-relaxed">
            <p>
              Si ya intentaste lo clásico y sientes que falta algo, escúchame: Hay un mundo entero de herramientas que pueden complementar tu proceso.
            </p>
            <p className="italic text-stone-600 border-y py-4 border-stone-200">
              Sumergirte en hielo para reconectar con tu cuerpo. Caminar sobre brasas y recordar que puedes vencer cualquier miedo. Romper tablas con tu mano y flechas con tu garganta… para romper tus propios límites.
            </p>
            <p>
              Masajes terapéuticos, meditaciones guiadas, cuarzos y bioenergía que limpian más de lo que crees. Búsquedas de visión en la montaña o en la selva, donde el alma se reencuentra con lo esencial.
            </p>
            <p className="font-bold text-accent">
              La recuperación no tiene que ser aburrida. Puede ser profunda. Puede ser intensa. Puede ser mágica.
            </p>
            <p>
              No te sirve pasar toda la vida encerrado. Pero algo está allá afuera… esperando ayudarte a sanar. Solo ten cuidado de no huir disfrazado de búsqueda.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      type: "text",
      content: (
        <div className="flex flex-col h-full justify-center space-y-6">
          <h2 className="text-3xl font-serif font-bold text-stone-900 text-center mb-6">
            ¿Y SI ESTO FUERA... TU ÚLTIMA OPORTUNIDAD?
          </h2>
          <div className="bg-stone-100 p-8 rounded-2xl space-y-4 text-stone-800 text-lg leading-relaxed shadow-inner">
            <p>
              Haz una pausa. Respira. Regálame tres minutos de conciencia. No para convencerte de nada. Sino para que te digas la verdad. Imagínate esto: <strong className="text-red-800">HOY ES TU ÚLTIMO DÍA...</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium text-stone-700">
              <li>¿Cómo te recordó tu familia?</li>
              <li>¿Qué dejaste pendiente?</li>
              <li>¿Qué sueños enterraste por andar apagando fuegos con droga?</li>
            </ul>
            <p>
              Eres más inteligente de lo que actúas. Tienes más bendiciones de las que agradeces. Y con toda esa edad, tu historia y tu corazón… ya deberías estar rompiéndola.
            </p>
          </div>
          <div className="mt-4 bg-accent/10 border-l-4 border-accent p-6 rounded-r-xl">
            <p className="font-bold text-accent text-xl">
              NO ESPERES A QUE TODO SE DERRUMBE. LA VERDADERA VALENTÍA ES PEDIR AYUDA ANTES DE QUE LA VIDA TE LA IMPONGA.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      type: "text",
      content: (
        <div className="flex flex-col h-full justify-center space-y-6">
          <div className="relative w-full h-40 md:h-56 rounded-xl overflow-hidden shadow-lg mb-4">
            <Image src="/blog/ebok.jpeg" alt="Resiliencia" fill className="object-cover" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 border-l-4 border-accent pl-4">
            Lo Que Nadie Te Dijo
          </h2>
          <div className="space-y-4 text-stone-700 text-lg leading-relaxed">
            <p>
              Nadie te lo dijo… Pero la recuperación no es mágica. No es rápida. Y no es una historia digna de redes sociales. Es cruda. Es confusa. Es humana.
            </p>
            <p>
              Vas a tener días donde tu mente te traiciona. Pero también habrá días donde sonríes sin estar drogado. Días donde respiras profundo y sientes paz.
            </p>
            <p className="font-bold text-xl text-stone-800 my-4 text-center">
              "Porque la recuperación no es dejar de consumir.<br/>Es dejar de huir."
            </p>
            <p>
              Es aprender a vivir despierto. A sentir sin anestesia. A reconstruirte desde la verdad, no desde la apariencia.
            </p>
            <p className="italic font-medium text-stone-600 text-center border-t border-b py-4">
              Ámame cuando menos me lo merezco… porque es cuando más lo necesito.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      type: "text",
      content: (
        <div className="flex flex-col h-full justify-center items-center text-center space-y-8">
          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-xl mx-auto border-4 border-white mb-4">
            <Image src="/blog/eboock.jpeg" alt="Fer Núñez" fill className="object-cover" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              ¿Qué sigue después de leer esto?
            </h2>
            <p className="text-stone-600 text-lg max-w-md mx-auto">
              Si llegaste hasta aquí, no es casualidad. Mi equipo y yo estamos aquí para acompañarte a reconstruir tu vida desde cero.
            </p>
            <p className="font-bold text-accent text-xl italic mt-6">
              "Para salir del infierno hay que atravesarlo."
            </p>
          </div>

          <div className="flex flex-col w-full max-w-sm gap-4 mt-8">
            <Link
              href={`/${lang}/portal`}
              className="bg-accent text-white px-8 py-5 rounded-full font-bold text-lg hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-2xl"
            >
              Pedir valoración gratuita
            </Link>
            <p className="text-stone-400 font-serif text-sm mt-4">
              La salida es hacia adentro — Lo logramos.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return <EbookReader pages={pages} />;
}
