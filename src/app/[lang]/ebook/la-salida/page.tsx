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
        <div className="space-y-6">
          <div className="text-center mb-10 mt-4">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">MANIFIESTO</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              La salida es hacia adentro
            </h1>
            <p className="text-xl text-stone-500 italic font-serif">— Fer Núñez</p>
          </div>
          <p>Sí, necesitas estructura. Sí, necesitas grupo, terapia y guía profesional.</p>
          <p>Pero también puedes recuperar tu vida con fuego, con hielo, con energía y propósito.</p>
          <p>Esto no se trata solo de dejar de consumir.</p>
          <p className="font-bold text-xl text-accent">Se trata de despertar.</p>
          <p className="font-bold text-xl text-accent">De volver a sentir.</p>
          <p className="font-bold text-xl text-accent">De recuperar tu poder.</p>
          <p>Si ya intentaste lo clásico y sientes que falta algo, escúchame:</p>
          <p>Hay un mundo entero de herramientas que pueden complementar tu proceso.</p>
          <p>Sumergirte en hielo para reconectar con tu cuerpo.</p>
          <p>Caminar sobre brasas y recordar que puedes vencer cualquier miedo.</p>
          <p>Romper tablas con tu mano y flechas con tu garganta… para romper tus propios límites.</p>
          <p>Masajes terapéuticos, meditaciones guiadas, cuarzos y bioenergía que limpian más de lo que crees.</p>
          <p>Búsquedas de visión en la montaña o en la selva, donde el alma se reencuentra con lo esencial.</p>
          <p className="font-bold text-lg text-stone-800 border-l-4 border-accent pl-4 py-2">
            La recuperación no tiene que ser aburrida. Puede ser profunda. Puede ser intensa. Puede ser mágica.
          </p>
          <p>No te sirve pasar toda la vida encerrado. Pero algo está allá afuera… esperando ayudarte a sanar.</p>
          <p>No tengas miedo de explorar. Solo ten cuidado de no huir disfrazado de búsqueda.</p>
        </div>
      )
    },
    {
      id: 2,
      type: "text",
      content: (
        <div className="space-y-6 mt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 text-center">
            ¿Y SI ESTO FUERA… TU ÚLTIMA OPORTUNIDAD?
          </h2>
          <p>Haz una pausa. Respira. Regálame tres minutos de conciencia. No para convencerte de nada. Sino para que te digas la verdad.</p>
          <p>Imagínate esto:</p>
          <p className="font-bold text-xl text-red-800">HOY ES TU ÚLTIMO DÍA…</p>
          <ul className="list-disc pl-6 space-y-2 text-stone-800 font-medium">
            <li>¿Cómo te recordó tu familia?</li>
            <li>¿Qué dejaste pendiente?</li>
            <li>¿Qué sueños enterraste por andar apagando fuegos con droga?</li>
          </ul>
          <p>Eres más inteligente de lo que actúas. Tienes más bendiciones de las que agradeces.</p>
          <p>Y con toda esa edad, tu historia y tu corazón… ya deberías estar rompiéndola. La gente debería admirarte, no preocuparse por ti.</p>
          <p>No importa si ya lo perdiste todo, o si todavía crees que “controlas”.</p>
          <p>Hoy puedes decidir. Hoy puedes pedir ayuda. Hoy puedes empezar de nuevo.</p>
          <div className="mt-8 bg-stone-100 p-6 rounded-xl shadow-inner text-center">
            <p className="font-bold text-accent text-lg">
              NO ESPERES A QUE TODO SE DERRUMBE. <br/><br/>LA VERDADERA VALENTÍA ES PEDIR AYUDA ANTES DE QUE LA VIDA TE LA IMPONGA.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      type: "text",
      content: (
        <div className="space-y-6 mt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 border-b pb-4">
            LO QUE NADIE TE DIJO SOBRE LA RECUPERACIÓN
          </h2>
          <p>Nadie te lo dijo… Pero la recuperación no es mágica. No es rápida. Y no es como tú esperas.</p>
          <p>No es una línea recta.</p>
          <p>No es una historia digna de redes sociales.</p>
          <p className="font-bold text-lg text-stone-800">Es cruda. Es confusa. Es profundamente humana.</p>
          <p>Vas a tener días donde no entiendes. Donde te preguntas: ¿por qué sigues luchando?</p>
          <p>Días donde tu mente te traiciona. Donde el deseo de rendirte es más fuerte que tus razones para seguir.</p>
          <p>La tentación no desaparece. Solo aprende a disfrazarse. Y si no estás alerta… te convence.</p>
          <p>Pero también habrá días donde sonríes sin estar drogado.</p>
          <p>Días donde duermes sin culpas.</p>
          <p>Días donde miras a alguien a los ojos… y no sientes vergüenza.</p>
          <p>Días donde respiras profundo y sientes paz. No euforia. Paz.</p>
          <p>Y ahí… en esos momentos simples, reales, cotidianos… empieza tu libertad.</p>
          <div className="border-l-4 border-accent pl-4 py-2 italic my-6 text-stone-700 bg-stone-50 rounded-r-lg p-4">
            <p className="mb-2">Porque la recuperación no es dejar de consumir.</p>
            <p className="mb-2">Es dejar de huir.</p>
            <p className="mb-2">Es aprender a estar contigo mismo sin tener que apagar nada.</p>
            <p>Es aprender a vivir despierto. A sentir sin anestesia. A amar sin poseer. A reconstruirte desde la verdad, no desde la apariencia.</p>
          </div>
          <p>Y eso, aunque nadie te lo dijo, es lo más hermoso de todo.</p>
          <p className="font-bold text-lg text-accent text-center mt-8">
            La recuperación no es perfecta… pero es lo más real que vas a vivir en tu vida.
          </p>
        </div>
      )
    },
    {
      id: 4,
      type: "text",
      content: (
        <div className="space-y-6 mt-4">
          <h2 className="text-xl font-bold text-stone-900 text-center uppercase tracking-wide leading-relaxed">
            ÁMAME CUANDO MENOS ME LO MEREZCO…<br/>PORQUE ES CUANDO MÁS LO NECESITO.
          </h2>
          <p>No lo digo por los demás. Me lo digo a mí. Porque aprendí a abrazarme justo cuando más me odiaba.</p>
          <p>Si llegaste hasta aquí, no es casualidad. Es porque algo dentro de ti todavía quiere vivir. Y si estás leyendo esto… aún estás a tiempo.</p>
          <p>Todo lo que acabas de leer no es solo información. Es un llamado. Un grito. Una puerta abierta. Y quiero que sepas que no estás solo.</p>
          <p>Tú no tienes por qué resolver esto por tu cuenta. Mi equipo y yo estamos aquí para acompañarte. No solo en dejar las drogas… sino en reconstruir tu vida desde cero. Desde lo más profundo. Desde lo más real.</p>
          
          <h3 className="text-2xl font-bold mt-10 mb-4 text-stone-900 border-b pb-2">
            ¿QUÉ SIGUE DESPUÉS DE ESTE EBOOK?
          </h3>
          <p>Pide una valoración gratuita. Por llamada o videollamada.</p>
          <p>Vamos a escucharte, entender tu historia y decirte exactamente qué hacer. Sin juicio. Sin presión. Solo verdad.</p>
          <p className="font-bold text-accent text-lg">Únete a CREI.</p>
          <p>Esta es una comunidad donde se habla claro, donde te confrontamos desde el amor, y donde vas a encontrar el apoyo que no encontraste en ningún otro lado.</p>
          <p>Y si estás listo para moverte… entra al programa:</p>
          <p className="text-2xl font-serif font-bold italic text-center my-6 text-stone-800">“La salida es hacia adentro”</p>
          <p className="text-center text-stone-600">No es un curso. Es una transformación. Física, emocional y espiritual.</p>
          <p className="text-center font-bold">Y todo el equipo de CREI</p>
          
          <div className="flex justify-center mt-10 point-events-auto">
            <Link
              href={`/${lang}/portal`}
              className="bg-stone-900 text-white px-10 py-5 rounded-full font-bold hover:bg-stone-800 transition-transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 shadow-xl text-lg relative z-50 text-center"
            >
              Pedir valoración gratuita
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 5,
      type: "text",
      content: (
        <div className="space-y-10 mt-4 text-center">
          
          <div className="space-y-6">
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-md mx-auto relative group">
              <Image src="/blog/eboock.jpeg" alt="Hielo" fill className="object-contain bg-stone-100 group-hover:scale-105 transition-transform duration-700" />
            </div>
            <p className="italic text-stone-700 font-serif text-lg px-4 border-l-4 border-stone-300">
              En esta página puedes ver una imagen mía en medio del hielo. No lo hice por valentía, sino porque necesitaba recordar que la mente no manda sobre el alma.
            </p>
          </div>

          <div className="space-y-6 mt-12 pt-12 border-t border-stone-200">
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-md mx-auto group">
              <Image src="/blog/eeboock.jpeg" alt="Fuego" fill className="object-contain bg-stone-100 group-hover:scale-105 transition-transform duration-700" />
            </div>
            <p className="italic text-stone-700 font-serif text-lg px-4 border-l-4 border-stone-300">
              También hay una imagen caminando sobre fuego. No fue un show. Fue un acto de decisión: ya había caminado por el infierno… y esta vez salí por mis propios pies.
            </p>
          </div>

          <div className="space-y-6 mt-12 pt-12 border-t border-stone-200">
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-md mx-auto group">
              <Image src="/blog/ebok.jpeg" alt="Flecha" fill className="object-contain bg-stone-100 group-hover:scale-105 transition-transform duration-700" />
            </div>
            <p className="italic text-stone-700 font-serif text-lg px-4 border-l-4 border-stone-300">
              Verás una imagen rompiendo una flecha con el cuello. No fue por fuerza física. Fue para recordarme que cuando enfrentas tu miedo… se rompe el límite.
            </p>
          </div>

          <div className="mt-16 bg-stone-900 text-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            
            <p className="text-lg md:text-xl mb-6 font-light relative z-10">
              Mi equipo y yo ya cruzamos por caminos oscuros. Y si hoy estamos aquí, es para decirte esto:
            </p>
            <p className="text-3xl font-serif font-bold text-accent mb-6 relative z-10">
              Para salir del infierno hay que atravesarlo.
            </p>
            <p className="text-lg relative z-10">Muchas veces con el corazón, solo no lo sueltes.</p>
            <p className="mt-6 text-white/90 relative z-10">Tú decides. Puedes cerrar este libro… o puedes abrirte a una nueva historia.</p>
            <p className="mt-4 relative z-10">Una que termine con esta frase:</p>
            
            <p className="text-5xl md:text-6xl font-black mt-8 tracking-widest text-[#fdfbf7] relative z-10">
              LO LOGRAMOS.
            </p>
            
            <p className="text-right mt-12 italic text-white/50 font-serif text-xl border-t border-white/20 pt-4 relative z-10">
              — Fer Núñez
            </p>
          </div>
        </div>
      )
    }
  ];

  return <EbookReader pages={pages} />;
}
