"use client";

import EbookReader, { EbookPage } from "@/components/EbookReader";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";

export default function EbookPageContainer() {
  const { lang } = useI18n();

  const pages: EbookPage[] = [
    {
      id: 1,
      type: "cover",
      imageUrl: "/blog/eeboock.jpeg",
      content: (
        <>
          <span className="text-accent font-medium tracking-widest uppercase text-sm mb-4 block">
            EBook / Manifiesto
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
            La salida es hacia adentro
          </h1>
          <p className="text-xl text-stone-600 font-medium">— Fer Núñez</p>
        </>
      ),
    },
    {
      id: 2,
      type: "text",
      content: (
        <>
          <p>
            Sí, necesitas estructura. Sí, necesitas grupo, terapia y guía
            profesional.
          </p>
          <br/>
          <p>
            Pero también puedes recuperar tu vida con fuego, con hielo, con
            energía y propósito.
          </p>
          <br/>
          <p>Esto no se trata solo de dejar de consumir.</p>
          <p>
            <strong>Se trata de despertar.</strong>
          </p>
          <p>De volver a sentir.</p>
          <p>De recuperar tu poder.</p>
        </>
      ),
    },
    {
      id: 3,
      type: "text",
      content: (
        <>
          <p>
            Si ya intentaste lo clásico y sientes que falta algo, escúchame: Hay
            un mundo entero de herramientas que pueden complementar tu proceso.
          </p>
          <br/>
          <p>Sumergirte en hielo para reconectar con tu cuerpo.</p>
          <br/>
          <p>
            Caminar sobre brasas y recordar que puedes vencer cualquier miedo.
          </p>
          <br/>
          <p>
            Romper tablas con tu mano y flechas con tu garganta… para romper tus
            propios límites.
          </p>
        </>
      ),
    },
    {
      id: 4,
      type: "text",
      content: (
        <>
          <p>
            Masajes terapéuticos, meditaciones guiadas, cuarzos y bioenergía que
            limpian más de lo que crees.
          </p>
          <br/>
          <p>
            Búsquedas de visión en la montaña o en la selva, donde el alma se
            reencuentra con lo esencial.
          </p>
          <br/>
          <p>
            La recuperación no tiene que ser aburrida. Puede ser profunda. Puede
            ser intensa. Puede ser mágica.
          </p>
          <br/>
          <p>
            No te sirve pasar toda la vida encerrado. Pero algo está allá
            afuera… esperando ayudarte a sanar.
          </p>
          <br/>
          <p>
            No tengas miedo de explorar. Solo ten cuidado de no huir disfrazado
            de búsqueda.
          </p>
        </>
      ),
    },
    {
      id: 5,
      type: "image",
      imageUrl: "/blog/eboock.jpeg",
    },
    {
      id: 6,
      type: "text",
      content: (
        <>
          <h2 className="text-2xl font-bold mb-6">
            ¿Y SI ESTO FUERA… TU ÚLTIMA OPORTUNIDAD?
          </h2>
          <p>
            Haz una pausa. Respira. Regálame tres minutos de conciencia. No para
            convencerte de nada. Sino para que te digas la verdad.
          </p>
          <br/>
          <p>Imagínate esto: HOY ES TU ÚLTIMO DÍA…</p>
          <p>¿Cómo te recordó tu familia?</p>
          <p>¿Qué dejaste pendiente?</p>
          <p>¿Qué sueños enterraste por andar apagando fuegos con droga?</p>
        </>
      ),
    },
    {
      id: 7,
      type: "text",
      content: (
        <>
          <p>
            Eres más inteligente de lo que actúas. Tienes más bendiciones de las
            que agradeces.
          </p>
          <br/>
          <p>
            Y con toda esa edad, tu historia y tu corazón… ya deberías estar
            rompiéndola. La gente debería admirarte, no preocuparse por ti.
          </p>
          <br/>
          <p>
            No importa si ya lo perdiste todo, o si todavía crees que
            "controlas".
          </p>
          <p>
            Hoy puedes decidir. Hoy puedes pedir ayuda. Hoy puedes empezar de
            nuevo.
          </p>
          <br />
          <p className="font-bold text-lg text-accent">
            NO ESPERES A QUE TODO SE DERRUMBE. LA VERDADERA VALENTÍA ES PEDIR
            AYUDA ANTES DE QUE LA VIDA TE LA IMPONGA.
          </p>
        </>
      ),
    },
    {
      id: 8,
      type: "text",
      content: (
        <>
          <h2 className="text-xl font-bold mb-6">
            LO QUE NADIE TE DIJO SOBRE LA RECUPERACIÓN
          </h2>
          <p>
            Nadie te lo dijo… Pero la recuperación no es mágica. No es rápida. Y
            no es como tú esperas.
          </p>
          <br/>
          <p>No es una línea recta.</p>
          <p>No es una historia digna de redes sociales.</p>
          <p>Es cruda. Es confusa. Es profundamente humana.</p>
          <br/>
          <p>
            Vas a tener días donde no entiendes. Donde te preguntas: ¿por qué
            sigues luchando?
          </p>
          <br/>
          <p>
            Días donde tu mente te traiciona. Donde el deseo de rendirte es más
            fuerte que tus razones para seguir.
          </p>
        </>
      ),
    },
    {
      id: 9,
      type: "text",
      content: (
        <>
          <p>
            La tentación no desaparece. Solo aprende a disfrazarse. Y si no
            estás alerta… te convence.
          </p>
          <br/>
          <p>Pero también habrá días donde sonríes sin estar drogado.</p>
          <p>Días donde duermes sin culpas.</p>
          <p>Días donde miras a alguien a los ojos… y no sientes vergüenza.</p>
          <br/>
          <p>Días donde respiras profundo y sientes paz. No euforia. Paz.</p>
        </>
      ),
    },
    {
      id: 10,
      type: "text",
      content: (
        <>
          <p>
            Y ahí… en esos momentos simples, reales, cotidianos… empieza tu
            libertad.
          </p>
          <br/>
          <p>Porque la recuperación no es dejar de consumir.</p>
          <p>Es dejar de huir.</p>
          <br/>
          <p>
            Es aprender a estar contigo mismo sin tener que apagar nada.
          </p>
          <p>
            Es aprender a vivir despierto. A sentir sin anestesia. A amar sin
            poseer. A reconstruirte desde la verdad, no desde la apariencia.
          </p>
        </>
      ),
    },
    {
      id: 11,
      type: "image",
      imageUrl: "/blog/ebok.jpeg",
    },
    {
      id: 12,
      type: "text",
      content: (
        <>
          <p>Y eso, aunque nadie te lo dijo, es lo más hermoso de todo.</p>
          <p>
            La recuperación no es perfecta… pero es lo más real que vas a vivir
            en tu vida.
          </p>
          <br />
          <h2 className="text-xl font-bold mb-4 my-8">
            ÁMAME CUANDO MENOS ME LO MEREZCO… PORQUE ES CUANDO MÁS LO NECESITO.
          </h2>
          <p>
            No lo digo por los demás. Me lo digo a mí. Porque aprendí a
            abrazarme justo cuando más me odiaba.
          </p>
        </>
      ),
    },
    {
      id: 13,
      type: "text",
      content: (
        <>
          <p>
            Si llegaste hasta aquí, no es casualidad. Es porque algo dentro de
            ti todavía quiere vivir. Y si estás leyendo esto… aún estás a
            tiempo.
          </p>
          <br/>
          <p>
            Todo lo que acabas de leer no es solo información. Es un llamado. Un
            grito. Una puerta abierta. Y quiero que sepas que no estás solo.
          </p>
          <br/>
          <p>
            Tú no tienes por qué resolver esto por tu cuenta. Mi equipo y yo
            estamos aquí para acompañarte. No solo en dejar las drogas… sino en
            reconstruir tu vida desde cero. Desde lo más profundo. Desde lo más
            real.
          </p>
        </>
      ),
    },
    {
      id: 14,
      type: "cta",
      content: (
        <>
          <h2 className="text-2xl font-bold mb-6 text-stone-900">
            ¿QUÉ SIGUE DESPUÉS DE ESTE EBOOK?
          </h2>
          <p className="mb-4 text-stone-700">
            Pide una valoración gratuita. Vamos a escucharte, entender tu historia y
            decirte exactamente qué hacer. Sin juicio. Sin presión. Solo verdad.
          </p>
          <p className="mb-10 text-stone-700">
            Únete a CREI. Esta es una comunidad donde se habla claro, donde te
            confrontamos desde el amor, y donde vas a encontrar el apoyo que no
            encontraste en ningún otro lado.
          </p>

          <Link
            href={`/${lang}/portal`}
            className="bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-xl w-full"
          >
            Quiero pedir ayuda
          </Link>
        </>
      ),
    },
    {
      id: 15,
      type: "text",
      content: (
        <>
          <p>Y si estás listo para moverte… entra al programa:</p>
          <br/>
          <h3 className="text-2xl font-bold italic mb-6">
            "La salida es hacia adentro"
          </h3>
          <p>
            No es un curso. Es una transformación. Física, emocional y
            espiritual.
          </p>
          <p>Y todo el equipo de CREI</p>
          <br />
          <p>
            En esta página pudiste ver una imagen mía en medio del hielo. No lo
            hice por valentía, sino porque necesitaba recordar que la mente no
            manda sobre el alma.
          </p>
        </>
      ),
    },
    {
      id: 16,
      type: "text",
      content: (
        <>
          <p>
            También hay una imagen caminando sobre fuego. No fue un show. Fue un
            acto de decisión: ya había caminado por el infierno… y esta vez salí
            por mis propios pies.
          </p>
          <br/>
          <p>
            Verás una imagen rompiendo una flecha con el cuello. No fue por
            fuerza física. Fue para recordarme que cuando enfrentas tu miedo… se
            rompe el límite.
          </p>
        </>
      ),
    },
    {
      id: 17,
      type: "text",
      content: (
        <>
          <p>
            Mi equipo y yo ya cruzamos por caminos oscuros. Y si hoy estamos
            aquí, es para decirte esto:
          </p>
          <br/>
          <p className="text-2xl font-medium my-6 text-accent">
            Para salir del infierno hay que atravesarlo.
          </p>
          <p>Muchas veces con el corazón, solo no lo sueltes.</p>
          <br/>
          <p>
            Tú decides. Puedes cerrar este libro… o puedes abrirte a una nueva
            historia.
          </p>
          <br />
          <p>Una que termine con esta frase:</p>
          <p className="text-3xl font-bold mt-4">Lo logramos.</p>
          <p className="text-right mt-8 italic text-stone-500 font-bold">— Fer Núñez</p>
        </>
      ),
    },
  ];

  return <EbookReader pages={pages} />;
}
